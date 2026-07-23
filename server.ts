import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Google Sheets Proxy endpoint to bypass CORS & prevent caching
  app.get('/api/sheets/fetch', async (req, res) => {
    try {
      let targetUrl = req.query.url as string;
      if (!targetUrl) {
        return res.status(400).json({ error: 'Missing target URL parameter' });
      }

      // Add timestamp parameter to bypass Google CDN / server cache
      const sep = targetUrl.includes('?') ? '&' : '?';
      if (!targetUrl.includes('t=')) {
        targetUrl = `${targetUrl}${sep}t=${Date.now()}`;
      }

      console.log('Fetching Google Sheet CSV from proxy:', targetUrl);

      let response = await fetch(targetUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) LsPlaceDocsPortal/1.0',
          'Accept': 'text/csv,text/plain,*/*',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
        },
        cache: 'no-store',
      });

      // Fallback: If GViz API failed, try standard /export?format=csv
      if (!response.ok && targetUrl.includes('/gviz/tq')) {
        const fallbackUrl = targetUrl.replace('/gviz/tq?tqx=out:csv', '/export?format=csv');
        console.log('GViz endpoint failed, attempting fallback export URL:', fallbackUrl);
        response = await fetch(fallbackUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) LsPlaceDocsPortal/1.0',
            'Accept': 'text/csv,text/plain,*/*',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
          },
          cache: 'no-store',
        });
      }

      if (!response.ok) {
        throw new Error(`Google Sheets responded with HTTP status ${response.status}`);
      }

      const csvData = await response.text();
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
      res.setHeader('Pragma', 'no-cache');
      res.send(csvData);
    } catch (err: any) {
      console.error('Error fetching sheet from Google:', err);
      res.status(500).json({
        error: 'Failed to fetch Google Sheet data',
        message: err.message || 'Error communicating with Google Sheets',
      });
    }
  });

  // AI Assistant Smart Search & Procedural Q&A Endpoint
  app.post('/api/ai/smart-search', async (req, res) => {
    try {
      const { query, documents, userRole, department } = req.body;

      if (!query || typeof query !== 'string') {
        return res.status(400).json({ error: 'Missing or invalid query parameter' });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(503).json({
          answer: 'Hệ thống trợ lý AI hiện đang chưa được cấu hình API Key. Bạn vẫn có thể sử dụng bộ lọc và thanh tìm kiếm tiêu chuẩn bên trên.',
          suggestedDocIds: [],
        });
      }

      const ai = new GoogleGenAI({ apiKey });

      const docsSummary = (documents || []).slice(0, 25).map((d: any) => ({
        id: d.id,
        code: d.code,
        title: d.title,
        category: d.category,
        department: d.department,
        minRole: d.minRole,
        tags: d.tags ? d.tags.join(', ') : '',
        description: d.description,
      }));

      const prompt = `
Bạn là Trợ lý AI Nội bộ của Chuỗi Siêu Thị Thực Phẩm L's Place Food Mart (Hà Nội, Việt Nam).
Nhiệm vụ của bạn là giải đáp thắc mắc của nhân viên công ty dựa trên danh sách quy trình, quy định, biểu mẫu và tài liệu đào tạo hiện có.

Vị trí/Quyền của người hỏi: ${userRole || 'Nhân viên'} (Phòng: ${department || 'Cửa hàng'}).
Thắc mắc của nhân viên: "${query}"

Danh sách tài liệu hiện có trong hệ thống repository L's Place:
${JSON.stringify(docsSummary, null, 2)}

Hãy trả lời ngắn gọn, lịch sự, chuyên nghiệp bằng tiếng Việt:
1. Giải đáp trực tiếp các bước / hướng dẫn cho câu hỏi của nhân viên.
2. Chỉ rõ mã văn bản (ví dụ SOP-CH-001, BM-NS-001) và tên tài liệu chính xác mà nhân viên nên xem hoặc tải về.
3. Nhấn mạnh lưu ý quan trọng (nếu có) đối với quy trình tại siêu thị L's Place (như quy định an toàn thực phẩm, bảo quản nhiệt độ, đồng phục...).
4. Trả về định dạng JSON thuần túy theo schema sau:
{
  "answer": "Nội dung trả lời chi tiết bằng markdown...",
  "suggestedDocIds": ["doc-1", "doc-6"]
}
Chỉ trả về chuỗi JSON, không kèm thêm markdown codeblock bọc ngoài nếu có thể.
`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const responseText = response.text || '';
      let parsedJson: any = {};
      try {
        parsedJson = JSON.parse(responseText);
      } catch (e) {
        parsedJson = {
          answer: responseText,
          suggestedDocIds: [],
        };
      }

      return res.json({
        answer: parsedJson.answer || 'Rất tiếc, tôi chưa tìm thấy tài liệu phù hợp.',
        suggestedDocIds: parsedJson.suggestedDocIds || [],
      });
    } catch (error: any) {
      console.error('Gemini AI error:', error);
      return res.status(500).json({
        error: 'AI search error',
        message: error.message || 'Internal AI service error',
      });
    }
  });

  // Vite development middleware or static production serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`L's Place Document Portal Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
