'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAnalytics } from '@/hooks/useAnalytics';
import { ref, onChildAdded, onValue } from 'firebase/database';
import database from '@/lib/firebase';
import { chatBotAPI } from "@/shared/api/chatbot-client";

export default function ChatbotWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Array<{ text: string; sender: 'user' | 'bot' }>>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const { logEvent } = useAnalytics();

    // --- Load all messages từ Firebase khi component mount ---
    useEffect(() => {
        if (!database) {
            console.error('Firebase database is not initialized');
            setIsLoading(false);
            return;
        }

        const chatRef = ref(database, 'chatbot-ai-3a6560b3-6149-480d-a13b-d3b6d2de0f12-chatbot');

        // Load existing messages
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

                console.log('📥 Loaded existing messages:', loadedMessages);
                setMessages(loadedMessages);
            }

            setIsLoading(false);
        }, (error) => {
            console.error('❌ Error loading existing messages:', error);
            setIsLoading(false);
        });

        // Listen for new messages
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

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || !database || isSending) return;

        const userMessage = { text: inputValue, sender: 'user' as const };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsSending(true);

        try {
            console.log('📤 Sending question to API:', inputValue);

            await chatBotAPI.askQuestion(inputValue);

            console.log('✅ Question sent successfully');
            logEvent('chat_message_sent', {
                message: inputValue,
                timestamp: new Date().toISOString()
            });

            // Backend sẽ tự động ghi vào Firebase
            // Firebase listener sẽ nhận message bot và cập nhật UI

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

    // Animation loading dots cho bot
    const LoadingDots = () => (
        <div className="flex justify-start">
            <div className="max-w-[80%] p-3 rounded-lg bg-white border border-gray-200 rounded-tl-none">
                <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="fixed bottom-8 right-8 z-50">
            {isOpen ? (
                <div className="w-80 h-[500px] bg-white rounded-lg shadow-2xl flex flex-col overflow-hidden border border-gray-200">
                    <div className="bg-primary text-white p-4 flex justify-between items-center">
                        <h3 className="font-semibold">Hỗ trợ trực tuyến</h3>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-white hover:bg-white/20 p-1 rounded-full transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                        {isLoading ? (
                            <div className="flex items-center justify-center h-full">
                                <div className="text-center text-gray-500">
                                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                                    <div>Đang tải tin nhắn...</div>
                                </div>
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="text-center text-gray-500 py-4">
                                Chưa có tin nhắn nào
                                <div className="text-xs mt-2">
                                    Database connected: {database ? '✅' : '❌'}
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {messages.map((msg, index) => (
                                    <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[80%] p-3 rounded-lg ${msg.sender === 'user' ? 'bg-primary text-white rounded-tr-none' : 'bg-white border border-gray-200 rounded-tl-none'}`}>
                                            {msg.text}
                                        </div>
                                    </div>
                                ))}
                                {/* Hiển thị animation khi đang gửi */}
                                {isSending && <LoadingDots />}
                            </div>
                        )}
                    </div>

                    <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Nhập tin nhắn..."
                                className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                                disabled={!database || isSending}
                            />
                            <Button
                                type="submit"
                                className="bg-primary hover:bg-primary/90 transition-colors min-w-[60px]"
                                disabled={!database || !inputValue.trim() || isSending}
                            >
                                {isSending ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    'Gửi'
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            ) : (
                <button
                    onClick={() => setIsOpen(true)}
                    className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 transition-all duration-300 hover:scale-110"
                    aria-label="Mở chat"
                >
                    <MessageCircle size={24} />
                </button>
            )}
        </div>
    );
}