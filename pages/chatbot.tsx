import { useEffect, useState } from "react";
import {
  Bot,
  User,
  Stethoscope,
  Clock,
  Send,
  Trash2,
  Search,
  Plus,
  Moon,
  Sun,
  Settings,
  MessageCircle,
  Activity,
  Shield,
  Brain,
  FileText,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

type Message = {
  sender: "user" | "bot";
  text: string;
  timestamp: number;
  type: "symptom" | "diagnosis" | "advice" | "general";
};

type Chat = {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  category?: string;
};

export default function ChatbotPage() {
  const [message, setMessage] = useState("");
  const [chatLog, setChatLog] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<Chat[]>([]);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  // Sample chat history loaded once on mount
  useEffect(() => {
    const sampleHistory: Chat[] = [
      {
        id: "1",
        title: "Persistent headache and fatigue symptoms",
        messages: [
          {
            sender: "user",
            text: "I've been experiencing persistent headaches and feeling very tired for the past week",
            timestamp: Date.now() - 86400000,
            type: "symptom",
          },
          {
            sender: "bot",
            text: "Based on your symptoms of persistent headaches and fatigue, several factors could be contributing to your condition. Common causes include dehydration, irregular sleep patterns, stress, or underlying medical conditions. I recommend maintaining adequate hydration, establishing consistent sleep schedules, and consulting with a healthcare professional for comprehensive evaluation if symptoms persist.",
            timestamp: Date.now() - 86400000,
            type: "advice",
          },
        ],
        createdAt: Date.now() - 86400000,
        category: "General Health",
      },
      {
        id: "2",
        title: "Post-exercise chest discomfort assessment",
        messages: [
          {
            sender: "user",
            text: "I'm experiencing chest discomfort after exercising",
            timestamp: Date.now() - 172800000,
            type: "symptom",
          },
          {
            sender: "bot",
            text: "Chest discomfort following exercise requires careful evaluation. While this could indicate muscle strain or gastroesophageal reflux, it's essential to rule out cardiovascular concerns. Please discontinue exercise immediately and seek medical attention if you experience severe pain, radiation to arms or jaw, or accompanying shortness of breath.",
            timestamp: Date.now() - 172800000,
            type: "diagnosis",
          },
        ],
        createdAt: Date.now() - 172800000,
        category: "Cardiology",
      },
      {
        id: "3",
        title: "Seasonal allergic reaction management",
        messages: [
          {
            sender: "user",
            text: "I have runny nose, sneezing, and itchy eyes during this season",
            timestamp: Date.now() - 259200000,
            type: "symptom",
          },
          {
            sender: "bot",
            text: "Your symptoms are consistent with seasonal allergic rhinitis. Consider implementing environmental controls such as air purification systems, maintaining closed windows during high pollen periods, and utilizing over-the-counter antihistamines. For persistent or severe symptoms, consultation with an allergist for comprehensive testing and targeted treatment protocols is recommended.",
            timestamp: Date.now() - 259200000,
            type: "advice",
          },
        ],
        createdAt: Date.now() - 259200000,
        category: "Allergy & Immunology",
      },
    ];
    setHistory(sampleHistory);
  }, []);

  // Welcome message on first load
  useEffect(() => {
    if (chatLog.length === 0) {
      setChatLog([
        {
          sender: "bot",
          text: "Welcome to your AI Healthcare Assistant. I'm designed to help you understand your symptoms and provide evidence-based health guidance. Please describe your symptoms or health concerns in detail, and I'll provide comprehensive assistance.\n\nImportant: This consultation is for informational purposes only and should not replace professional medical advice or diagnosis.",
          timestamp: Date.now(),
          type: "general",
        },
      ]);
    }
  }, [chatLog.length]);

  const saveChatToHistory = (log: Message[]) => {
    if (log.length <= 1) return;

    const id = currentChatId || Date.now().toString();
    const userMsg = log.find((m) => m.sender === "user");
    const title = `${
      userMsg?.text.slice(0, 50) +
      (userMsg?.text.length! > 50 ? "..." : "")
    }` || "New Consultation";

    const newChat: Chat = {
      id,
      title,
      messages: log,
      createdAt: Date.now(),
      category: "General Health",
    };

    const updated = [newChat, ...history.filter((h) => h.id !== id).slice(0, 19)];
    setHistory(updated);
    setCurrentChatId(id);
  };

  const sendMessage = async () => {
    if (!message.trim() || loading) return;
    setLoading(true);

    const userMsg: Message = {
      sender: "user",
      text: message,
      timestamp: Date.now(),
      type: "symptom",
    };
    const newLog = [...chatLog, userMsg];
    setChatLog(newLog);
    setMessage("");

    // Simulate backend call
    setTimeout(() => {
      const responses = [
        "Based on your reported symptoms, I recommend maintaining proper hydration and adequate rest. Monitor your condition closely and consult with a healthcare professional for comprehensive evaluation if symptoms persist or worsen within 24-48 hours.",
        "Your symptoms warrant careful observation and professional medical assessment. I suggest documenting any changes in your condition and scheduling an appointment with your healthcare provider for accurate diagnosis and appropriate treatment recommendations.",
        "Thank you for providing detailed information about your health concerns. While I can offer general guidance based on your symptoms, it's essential to consult with a qualified healthcare professional for proper medical evaluation and personalized treatment planning.",
        "Your reported symptoms require professional medical attention for accurate assessment. Please consider scheduling a consultation with your healthcare provider to discuss these concerns and receive appropriate medical care tailored to your specific needs.",
      ];

      const botMsg: Message = {
        sender: "bot",
        text: responses[Math.floor(Math.random() * responses.length)],
        timestamp: Date.now(),
        type: "advice",
      };

      const finalLog = [...newLog, botMsg];
      setChatLog(finalLog);
      saveChatToHistory(finalLog);
      setLoading(false);
    }, 2000);
  };

  const loadChat = (chat: Chat) => {
    setChatLog(chat.messages);
    setCurrentChatId(chat.id);
  };

  const startNewChat = () => {
    setChatLog([
      {
        sender: "bot",
        text: "Hello! I'm your AI healthcare assistant. How may I assist you with your health concerns today?",
        timestamp: Date.now(),
        type: "general",
      },
    ]);
    setCurrentChatId(null);
  };

  const deleteChat = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setHistory((prev) => prev.filter((c) => c.id !== chatId));
    if (currentChatId === chatId) {
      startNewChat();
    }
  };

  const filteredHistory = history.filter((chat) =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "Just now";
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "symptom":
        return <FileText className="w-3 h-3" />;
      case "diagnosis":
        return <Brain className="w-3 h-3" />;
      case "advice":
        return <CheckCircle className="w-3 h-3" />;
      default:
        return <MessageCircle className="w-3 h-3" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "symptom":
        return "Symptom Report";
      case "diagnosis":
        return "Clinical Analysis";
      case "advice":
        return "Medical Guidance";
      default:
        return "General";
    }
  };

  return (
    <div className={`${theme === "dark" ? "dark" : ""}`}>
      <div className="flex h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? "w-80" : "w-16"
          } transition-all duration-300 bg-white/95 dark:bg-slate-800/95 backdrop-blur-lg border-r border-slate-200/60 dark:border-slate-700/60 flex flex-col shadow-2xl`}
        >
          <div className="p-6 border-b border-slate-200/60 dark:border-slate-700/60">
            <div className="flex items-center justify-between">
              {sidebarOpen && (
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-600 to-blue-700 shadow-lg">
                    <Stethoscope className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-800 dark:text-white">
                      MedicalAI Pro
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Advanced Healthcare Assistant
                    </p>
                  </div>
                </div>
              )}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <MessageCircle className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </button>
            </div>

            {sidebarOpen && (
              <div className="mt-6 space-y-4">
                <button
                  onClick={startNewChat}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-700 hover:to-blue-800 text-white transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                >
                  <Plus className="w-4 h-4" />
                  New Consultation
                </button>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search consultations..."
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            )}
          </div>

          {sidebarOpen && (
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-3">
                {filteredHistory.map((chat) => (
                  <div
                    key={chat.id}
                    className={`group relative p-4 rounded-xl cursor-pointer transition-all hover:bg-slate-50 dark:hover:bg-slate-700/50 border ${
                      currentChatId === chat.id
                        ? "bg-cyan-50 dark:bg-cyan-900/20 border-cyan-200 dark:border-cyan-800 shadow-md"
                        : "border-transparent hover:border-slate-200 dark:hover:border-slate-600"
                    }`}
                    onClick={() => loadChat(chat)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 dark:text-white truncate mb-2">
                          {chat.title}
                        </p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-600">
                            {chat.category}
                          </span>
                          <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                            {formatTime(chat.createdAt)}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => deleteChat(chat.id, e)}
                        className="opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 transition-all"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="p-4 border-t border-slate-200/60 dark:border-slate-700/60">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors flex-1"
              >
                {theme === "light" ? (
                  <>
                    <Moon className="w-4 h-4" />
                    {sidebarOpen && <span className="text-sm">Dark Mode</span>}
                  </>
                ) : (
                  <>
                    <Sun className="w-4 h-4" />
                    {sidebarOpen && <span className="text-sm">Light Mode</span>}
                  </>
                )}
              </button>
              {sidebarOpen && (
                <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                  <Settings className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                </button>
              )}
            </div>
          </div>
        </aside>

        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-lg border-b border-slate-200/60 dark:border-slate-700/60 px-8 py-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-600 to-blue-700 shadow-lg">
                  <Stethoscope className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Healthcare Assistant
                  </h1>
                  <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
                    <Brain className="w-4 h-4" />
                    AI-powered medical consultation & symptom analysis
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-4 py-2 rounded-lg border border-amber-200 dark:border-amber-800">
                <AlertTriangle className="w-4 h-4" />
                Professional guidance recommended
              </div>
            </div>
          </header>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-8">
            <div className="max-w-4xl mx-auto space-y-8">
              {chatLog.map((msg, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-4 group ${
                    msg.sender === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`flex-shrink-0 p-3 rounded-full shadow-lg ${
                      msg.sender === "user"
                        ? "bg-gradient-to-br from-slate-600 to-slate-700"
                        : "bg-gradient-to-br from-cyan-600 to-blue-700"
                    }`}
                  >
                    {msg.sender === "user" ? (
                      <User className="w-5 h-5 text-white" />
                    ) : (
                      <Bot className="w-5 h-5 text-white" />
                    )}
                  </div>

                  <div
                    className={`flex-1 max-w-[75%] ${
                      msg.sender === "user" ? "text-right" : ""
                    }`}
                  >
                    <div
                      className={`inline-block p-5 rounded-2xl shadow-sm border transition-all duration-200 hover:shadow-lg ${
                        msg.sender === "user"
                          ? "bg-gradient-to-br from-slate-600 to-slate-700 text-white border-slate-500"
                          : "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-600"
                      }`}
                    >
                      <p className="whitespace-pre-wrap leading-relaxed text-sm font-medium">
                        {msg.text}
                      </p>
                      {msg.type !== "general" && (
                        <div
                          className={`mt-3 text-xs px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 ${
                            msg.sender === "user"
                              ? "bg-slate-700/40 text-slate-200"
                              : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-600"
                          }`}
                        >
                          {getTypeIcon(msg.type)}
                          {getTypeLabel(msg.type)}
                        </div>
                      )}
                    </div>
                    <p
                      className={`text-xs text-slate-500 dark:text-slate-400 mt-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 ${
                        msg.sender === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <Clock className="w-3 h-3" />
                      {formatTime(msg.timestamp)}
                    </p>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 p-3 rounded-full shadow-lg bg-gradient-to-br from-cyan-600 to-blue-700">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-2xl p-6 shadow-lg max-w-md">
                    <div className="flex items-center justify-center gap-4">
                      <Stethoscope className="w-6 h-6 text-cyan-600 animate-pulse" />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          Analyzing your consultation...
                        </span>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="w-28 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-600 rounded-full animate-pulse"></div>
                          </div>
                          <Activity className="w-4 h-4 text-cyan-600 animate-bounce" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Input Area */}
          <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-lg border-t border-slate-200/60 dark:border-slate-700/60 p-8 shadow-lg">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-end gap-4">
                <div className="flex-1">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    placeholder="Describe your symptoms, medical concerns, or ask health-related questions in detail..."
                    className="w-full px-5 py-4 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none transition-all shadow-sm"
                    rows={3}
                    disabled={loading}
                  />
                </div>
                <button
                  onClick={sendMessage}
                  disabled={loading || !message.trim()}
                  className="p-4 bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-700 hover:to-blue-800 disabled:from-slate-400 disabled:to-slate-500 text-white rounded-xl disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Press Enter to send, Shift+Enter for new line</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  <span>Secure & Confidential</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}