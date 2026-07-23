import React, { useState } from 'react';
import {
  Bot,
  Sparkles,
  Send,
  X,
  FileText,
  ArrowRight,
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  RefreshCw,
  Eye,
  Download,
} from 'lucide-react';
import { DocumentItem, UserRole } from '../types';

interface AISearchAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  documents: DocumentItem[];
  userRole: UserRole;
  userDepartment: string;
  onPreviewDoc: (doc: DocumentItem) => void;
}

export const AISearchAssistantModal: React.FC<AISearchAssistantModalProps> = ({
  isOpen,
  onClose,
  documents,
  userRole,
  userDepartment,
  onPreviewDoc,
}) => {
  const [queryInput, setQueryInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [suggestedDocs, setSuggestedDocs] = useState<DocumentItem[]>([]);

  if (!isOpen) return null;

  const sampleQuestions = [
    'Tôi muốn đăng ký nghỉ phép 3 ngày thì dùng biểu mẫu nào?',
    'Quy trình kiểm kê hàng tươi sống và đồ đông lạnh ca sáng?',
    'Nội quy về đồng phục và thẻ tên nhân viên L\'s Place?',
    'Thủ tục đổi trả hàng cho khách hàng khi sản phẩm bị lỗi?',
  ];

  const handleAskAI = async (textToAsk?: string) => {
    const question = textToAsk || queryInput;
    if (!question.trim()) return;

    setIsLoading(true);
    setAiAnswer(null);
    setSuggestedDocs([]);

    try {
      const response = await fetch('/api/ai/smart-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: question,
          documents,
          userRole,
          department: userDepartment,
        }),
      });

      const data = await response.json();
      setAiAnswer(data.answer || 'Rất tiếc, tôi chưa thể trả lời câu hỏi này.');

      if (data.suggestedDocIds && data.suggestedDocIds.length > 0) {
        const found = documents.filter((d) => data.suggestedDocIds.includes(d.id));
        setSuggestedDocs(found.length > 0 ? found : fallbackSearchDocs(question));
      } else {
        setSuggestedDocs(fallbackSearchDocs(question));
      }
    } catch (err) {
      console.error('AI assistant error:', err);
      // Fallback client-side smart matching
      setAiAnswer(
        `Dựa trên thư viện tài liệu L's Place, đối với thắc mắc "${question}", bạn có thể tham khảo các quy trình và biểu mẫu chuẩn bên dưới:`
      );
      setSuggestedDocs(fallbackSearchDocs(question));
    } finally {
      setIsLoading(false);
    }
  };

  const fallbackSearchDocs = (q: string) => {
    const lower = q.toLowerCase().trim();
    if (!lower) return [];

    // Extract core keywords (filtering out tiny stop words)
    const keywords = lower
      .split(/[\s,?.!;-]+/)
      .filter((k) => k.length > 1 && !['tôi', 'muốn', 'là', 'cho', 'về', 'dùng', 'thì', 'nào', 'cần', 'các', 'những', 'được'].includes(k));

    return documents
      .map((doc) => {
        const titleLower = doc.title.toLowerCase();
        const descLower = (doc.description || '').toLowerCase();
        const codeLower = doc.code.toLowerCase();
        const deptLower = doc.department.toLowerCase();
        const catLower = doc.category.toLowerCase();
        const tagsLower = (doc.tags || []).map((t) => t.toLowerCase()).join(' ');

        const fullText = `${titleLower} ${descLower} ${codeLower} ${deptLower} ${catLower} ${tagsLower}`;

        let score = 0;

        // Direct full query match
        if (fullText.includes(lower)) score += 15;
        if (titleLower.includes(lower)) score += 20;

        // Keyword matches
        keywords.forEach((kw) => {
          if (titleLower.includes(kw)) score += 5;
          if (codeLower.includes(kw)) score += 8;
          if (descLower.includes(kw)) score += 3;
          if (tagsLower.includes(kw)) score += 4;
          if (deptLower.includes(kw)) score += 2;
          if (catLower.includes(kw)) score += 2;
        });

        return { doc, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((item) => item.doc)
      .slice(0, 4);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[88vh] animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 p-4 text-white flex justify-between items-center shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-white/20 backdrop-blur-xs rounded-xl">
              <Bot className="w-5 h-5 text-amber-100" />
            </div>
            <div>
              <h3 className="font-bold text-base flex items-center space-x-1.5">
                <span>Trợ Lý Tra Cứu AI L's Place</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-200 animate-pulse" />
              </h3>
              <p className="text-[11px] text-amber-100">
                Hỏi đáp bằng tiếng Việt tự nhiên về mọi quy trình, quy định & biểu mẫu
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* Sample prompts */}
          {!aiAnswer && !isLoading && (
            <div className="space-y-2 bg-amber-50/60 p-4 rounded-xl border border-amber-200/80">
              <p className="font-bold text-slate-800 flex items-center space-x-1.5">
                <Lightbulb className="w-4 h-4 text-amber-600" />
                <span>Gợi ý câu hỏi phổ biến của nhân viên:</span>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {sampleQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setQueryInput(q);
                      handleAskAI(q);
                    }}
                    className="p-2.5 bg-white hover:bg-amber-100/60 border border-amber-200 rounded-xl text-left text-slate-700 hover:text-amber-900 transition flex items-start space-x-2 font-medium"
                  >
                    <ArrowRight className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span>{q}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Loading state */}
          {isLoading && (
            <div className="py-12 text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-amber-500 animate-spin mx-auto" />
              <p className="font-bold text-slate-700">Trợ lý AI đang tìm kiếm và phân tích tài liệu L's Place...</p>
              <p className="text-[11px] text-slate-400">Vui lòng đợi trong giây lát</p>
            </div>
          )}

          {/* AI Response Box */}
          {aiAnswer && !isLoading && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center space-x-2 text-[#2B62B8] font-bold">
                  <Bot className="w-4 h-4 text-amber-600" />
                  <span>Trợ lý L's Place Trả lời:</span>
                </div>
                <div className="prose prose-slate max-w-none text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {aiAnswer}
                </div>
              </div>

              {/* Suggested Document Cards */}
              {suggestedDocs.length > 0 && (
                <div className="space-y-2">
                  <p className="font-bold text-slate-800 flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Tài liệu & Biểu mẫu được đề xuất xem ngay:</span>
                  </p>

                  <div className="space-y-2">
                    {suggestedDocs.map((doc) => (
                      <div
                        key={doc.id}
                        className="p-3 bg-white border border-slate-200 hover:border-[#2B62B8] rounded-xl shadow-2xs transition flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-3 overflow-hidden">
                          <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-[#2B62B8] rounded border border-blue-200">
                            {doc.code}
                          </span>
                          <div className="truncate">
                            <h5 className="font-bold text-slate-900 truncate">{doc.title}</h5>
                            <p className="text-[11px] text-slate-500 truncate">{doc.description}</p>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            onClose();
                            onPreviewDoc(doc);
                          }}
                          className="ml-2 px-3 py-1.5 bg-[#2B62B8] hover:bg-[#224fa0] text-white font-bold rounded-lg text-xs transition flex items-center space-x-1 shrink-0"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Mở xem</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input Form Footer */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAskAI();
            }}
            className="flex space-x-2"
          >
            <input
              type="text"
              placeholder="Nhập thắc mắc của bạn (vd: Mẫu xin vắng mặt, quy trình thu ngân...)"
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button
              type="submit"
              disabled={isLoading || !queryInput.trim()}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition flex items-center space-x-1.5 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline text-xs">Gửi hỏi</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
