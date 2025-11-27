'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Loader2, Search, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAnalytics } from '@/hooks/useAnalytics';
import { ref, onChildAdded, onValue } from 'firebase/database';
import database from '@/lib/firebase';
import { chatBotAPI } from "@/shared/api/chatbot-client";

const DEFAULT_QUESTIONS = [
    "Có phòng trọ nào giá rẻ không?",
    "Làm sao để đăng ký thuê phòng?",
    "Tiện ích xung quanh có gì?",
    "Chính sách đặt cọc thế nào?",
    "Có cho nuôi thú cưng không?",
    "Giá điện nước tính thế nào?",
    "Có wifi không?",
    "Có chỗ để xe không?"
];

const DEFAULT_ANSWERS: { [key: string]: string } = {
    "Có phòng trọ nào giá rẻ không?": "Hiện chúng tôi có nhiều phòng trọ với mức giá từ 1.5 - 3 triệu/tháng tùy theo diện tích và tiện nghi. Bạn có thể sử dụng bộ lọc trên website để tìm phòng theo ngân sách của mình.",
    "Làm sao để đăng ký thuê phòng?": "Bạn có thể đăng ký thuê phòng trực tiếp trên website bằng cách: 1. Chọn phòng yêu thích, 2. Điền thông tin liên hệ, 3. Đặt lịch xem phòng. Sau đó chúng tôi sẽ liên hệ lại để xác nhận.",
    "Tiện ích xung quanh có gì?": "Các phòng trọ của chúng tôi đều nằm ở vị trí thuận tiện, gần chợ, siêu thị, trường học và các tuyến xe buýt. Mỗi khu vực sẽ có tiện ích riêng, bạn có thể xem chi tiết trong thông tin từng phòng.",
    "Chính sách đặt cọc thế nào?": "Chính sách đặt cọc: Đặt cọc 1 tháng tiền nhà khi ký hợp đồng. Tiền cọc sẽ được hoàn trả khi kết thúc hợp đồng (trừ các chi phí phát sinh nếu có).",
    "Có cho nuôi thú cưng không?": "Tùy theo từng phòng trọ sẽ có quy định riêng về thú cưng. Một số phòng cho phép nuôi thú cưng nhỏ, bạn vui lòng kiểm tra thông tin chi tiết từng phòng hoặc liên hệ trực tiếp để được tư vấn.",
    "Giá điện nước tính thế nào?": "Giá điện: 3,500 VND/kWh, giá nước: 20,000 VND/m3. Hóa đơn điện nước sẽ được tính hàng tháng dựa trên số đo công tơ và thanh toán cùng với tiền nhà.",
    "Có wifi không?": "Tất cả các phòng trọ đều được trang bị wifi miễn phí với tốc độ cao, ổn định phục vụ nhu cầu học tập và làm việc.",
    "Có chỗ để xe không?": "Mỗi phòng trọ đều có chỗ để xe riêng biệt, an toàn. Khu vực để xe có camera giám sát 24/7 đảm bảo an ninh."
};

export default function ChatbotWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Array<{ text: string; sender: 'user' | 'bot' }>>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showQuickQuestions, setShowQuickQuestions] = useState(true);
    const { logEvent } = useAnalytics();

    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!database) {
            console.error('Firebase database is not initialized');
            setIsLoading(false);
            return;
        }

        const chatRef = ref(database, 'chatbot-ai-3a6560b3-6149-480d-a13b-d3b6d2de0f12-chatbot');

        const loadExistingMessages = onValue(chatRef, (snapshot) => {
            const data = snapshot.val();
            console.log('📦 All existing data:', data);

            if (data) {
                const loadedMessages: Array<{ text: string; sender: 'user' | 'bot' }> = [];

                Object.values(data).forEach((msg: any) => {
                    if (msg?.content) {
                        let sender: 'user' | 'bot' = 'user';
                        if (msg.sender === 'ai' || msg.sender === 'bot' || msg.sender === 'system') {
                            sender = 'bot';
                        }
                        loadedMessages.push({ text: msg.content, sender });
                    }
                });

                setMessages(loadedMessages);
            }

            setIsLoading(false);
        }, (error) => {
            console.error('❌ Error loading existing messages:', error);
            setIsLoading(false);
        });

        const unsubscribe = onChildAdded(chatRef, (snapshot) => {
            const msg = snapshot.val();
            console.log('🔥 New Firebase message received:', msg);

            if (!msg?.content) {
                console.warn('Message missing content:', msg);
                return;
            }

            let sender: 'user' | 'bot' = 'user';
            if (msg.sender === 'ai' || msg.sender === 'bot' || msg.sender === 'system') {
                sender = 'bot';
            }

            setMessages(prev => {
                const isDuplicate = prev.some(m =>
                    m.text === msg.content && m.sender === sender
                );

                if (!isDuplicate) {
                    console.log('✅ Adding new message:', { text: msg.content, sender });
                    return [...prev, { text: msg.content, sender }];
                }
                return prev;
            });
        }, (error) => {
            console.error('❌ Firebase listener error:', error);
        });

        return () => {
            console.log('🧹 Cleaning up Firebase listeners');
            unsubscribe();
            loadExistingMessages();
        };
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const filteredQuestions = DEFAULT_QUESTIONS.filter(question =>
        question.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || !database || isSending) return;

        const userMessage = { text: inputValue, sender: 'user' as const };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setSearchQuery('');
        setIsSending(true);

        try {
            console.log('📤 Sending question to API:', inputValue);
            await chatBotAPI.askQuestion(inputValue);
            console.log('✅ Question sent successfully');
            logEvent('chat_message_sent', {
                message: inputValue,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            console.error('❌ Error sending question:', error);
            setMessages(prev => [...prev, {
                text: 'Có lỗi xảy ra, vui lòng thử lại!',
                sender: 'bot'
            }]);
        } finally {
            setIsSending(false);
        }
    };

    const handleDefaultQuestionClick = async (question: string) => {
        if (!database || isSending) return;

        const userMessage = { text: question, sender: 'user' as const };
        setMessages(prev => [...prev, userMessage]);
        setSearchQuery('');
        setIsSending(true);

        try {
            if (DEFAULT_ANSWERS[question]) {
                setTimeout(() => {
                    setMessages(prev => [...prev, {
                        text: DEFAULT_ANSWERS[question],
                        sender: 'bot'
                    }]);
                    setIsSending(false);
                }, 1000);

                logEvent('default_question_clicked', {
                    question: question,
                    timestamp: new Date().toISOString()
                });
            } else {
                console.log('📤 Sending default question to API:', question);
                await chatBotAPI.askQuestion(question);
                console.log('✅ Default question sent successfully');
                logEvent('default_question_sent', {
                    question: question,
                    timestamp: new Date().toISOString()
                });
            }
        } catch (error) {
            console.error('❌ Error sending default question:', error);
            setMessages(prev => [...prev, {
                text: 'Có lỗi xảy ra, vui lòng thử lại!',
                sender: 'bot'
            }]);
            setIsSending(false);
        }
    };

    const LoadingDots = () => (
        <div className="flex justify-start">
            <div className="max-w-[80%] p-3 rounded-lg bg-white border border-green-100 rounded-tl-none shadow-sm">
                <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="fixed bottom-8 right-8 z-50">
            {isOpen ? (
                <div className="w-80 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-green-100">
                    {/* Header với gradient xanh lá trẻ trung */}
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-4 flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-lg">Trợ lý thuê trọ</h3>
                            <p className="text-green-100 text-xs">Chúng tôi ở đây để giúp bạn!</p>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-white hover:bg-white/20 p-1 rounded-full transition-colors duration-200"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Main chat area */}
                    <div className="flex-1 p-4 overflow-y-auto bg-gradient-to-b from-green-50 to-white">
                        {isLoading ? (
                            <div className="flex items-center justify-center h-full">
                                <div className="text-center text-green-600">
                                    <div className="w-12 h-12 border-4 border-green-200 border-t-green-500 rounded-full animate-spin mx-auto mb-3"></div>
                                    <div className="font-medium">Đang kết nối...</div>
                                </div>
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="text-center py-4">
                                {/* Welcome message */}
                                <div className="bg-white rounded-2xl p-4 shadow-sm border border-green-100 mb-4">
                                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <MessageCircle className="text-green-500" size={24} />
                                    </div>
                                    <h4 className="font-bold text-green-800 mb-1">Xin chào! 👋</h4>
                                    <p className="text-green-600 text-sm">Tôi có thể giúp gì cho việc thuê trọ của bạn?</p>
                                </div>

                                {/* Search */}
                                <div className="relative mb-4">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400 w-4 h-4" />
                                    <input
                                        type="text"
                                        placeholder="Tìm câu hỏi..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 text-sm border border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent bg-white"
                                    />
                                </div>

                                {/* Quick questions */}
                                <div className="space-y-2">
                                    <div className="text-xs text-green-500 font-medium mb-2">
                                        {filteredQuestions.length > 0
                                            ? '💡 Câu hỏi thường gặp'
                                            : '🔍 Không tìm thấy câu hỏi phù hợp'
                                        }
                                    </div>
                                    {filteredQuestions.map((question, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleDefaultQuestionClick(question)}
                                            disabled={isSending}
                                            className="w-full text-left p-3 text-sm bg-white border border-green-200 rounded-xl hover:bg-green-50 hover:border-green-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                                        >
                                            {question}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {messages.map((msg, index) => (
                                    <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[85%] p-3 rounded-2xl ${msg.sender === 'user'
                                            ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-br-none shadow-md'
                                            : 'bg-white border border-green-100 rounded-bl-none shadow-sm'}`}>
                                            {msg.text}
                                        </div>
                                    </div>
                                ))}
                                {isSending && <LoadingDots />}
                                <div ref={messagesEndRef} />
                            </div>
                        )}
                    </div>

                    {/* Quick questions toggle - chỉ hiện khi có tin nhắn */}
                    {messages.length > 0 && filteredQuestions.length > 0 && (
                        <div className="border-t border-green-100 bg-white">
                            {/* Toggle button */}
                            <button
                                onClick={() => setShowQuickQuestions(!showQuickQuestions)}
                                className="w-full p-2 flex items-center justify-center gap-1 text-green-600 hover:bg-green-50 transition-colors text-xs font-medium"
                            >
                                {showQuickQuestions ? (
                                    <>
                                        <ChevronUp size={14} />
                                        Ẩn câu hỏi nhanh
                                    </>
                                ) : (
                                    <>
                                        <ChevronDown size={14} />
                                        Hiện câu hỏi nhanh
                                    </>
                                )}
                            </button>

                            {/* Quick questions panel */}
                            {showQuickQuestions && (
                                <div className="p-3 bg-green-50 border-t border-green-100">
                                    <div className="text-xs text-green-600 font-medium mb-2">💬 Câu hỏi nhanh:</div>
                                    <div className="flex flex-wrap gap-2 max-h-20 overflow-y-auto">
                                        {filteredQuestions.slice(0, 4).map((question, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handleDefaultQuestionClick(question)}
                                                disabled={isSending}
                                                className="text-xs px-3 py-2 bg-white border border-green-200 rounded-lg hover:bg-green-100 hover:border-green-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                                            >
                                                {question}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Input form */}
                    <form onSubmit={handleSendMessage} className="p-4 border-t border-green-100 bg-white">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Nhập tin nhắn của bạn..."
                                className="flex-1 p-3 border border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all bg-white"
                                disabled={!database || isSending}
                            />
                            <Button
                                type="submit"
                                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 transition-all duration-200 min-w-[60px] h-auto rounded-xl shadow-md"
                                disabled={!database || !inputValue.trim() || isSending}
                            >
                                {isSending ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <span className="text-sm">Gửi</span>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            ) : (
                <button
                    onClick={() => setIsOpen(true)}
                    className="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full flex items-center justify-center shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 group"
                    aria-label="Mở chat"
                >
                    <MessageCircle className="text-white group-hover:scale-110 transition-transform" size={24} />
                    {/* Ping animation */}
                    <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-20"></div>
                </button>
            )}
        </div>
    );
}