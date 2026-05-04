import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot } from 'lucide-react';
import './SymptomChecker.css';

interface Message {
    id: string;
    sender: 'user' | 'bot';
    text: string;
}

const SymptomChecker = () => {
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', sender: 'bot', text: 'Hello! Please describe the symptoms of the patient. E.g., "High fever and chest pain for 2 days."' }
    ]);
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(false);
    const endOfMessagesRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    const sendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!inputText.trim()) return;

        const userMsg: Message = { id: Date.now().toString(), sender: 'user', text: inputText };
        setMessages(prev => [...prev, userMsg]);
        setInputText('');
        setLoading(true);

        try {
            // Connect to the local backend express server
            const response = await fetch('http://localhost:3000/api/symptom-check', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ symptoms: userMsg.text })
            });

            let data;
            if (response.ok) {
                data = await response.json();
            } else {
                throw new Error("Backend unavailable");
            }

            const botMsg: Message = {
                id: (Date.now() + 1).toString(),
                sender: 'bot',
                text: `Risk: ${data.riskLevel}\nAssessment: ${data.diagnosis}\nRecommendation: ${data.advice}\n\n*${data.disclaimer}*`
            };

            setMessages(prev => [...prev, botMsg]);
        } catch (error) {
            console.error(error);
            const errorMsg: Message = {
                id: (Date.now() + 1).toString(),
                sender: 'bot',
                text: 'Sorry, I am having trouble connecting to the network right now. Falling back to offline triage rules...'
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="symptom-checker-page animate-fade-in">
            <header className="page-header">
                <h2>AI Symptom Triage</h2>
                <p className="text-muted">Describe symptoms to get an instant AI risk assessment.</p>
            </header>

            <div className="chat-container card flex-column">
                <div className="chat-area">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`message-wrapper ${msg.sender === 'user' ? 'user' : 'bot'}`}>
                            {msg.sender === 'bot' && (
                                <div className="bot-avatar">
                                    <Bot size={20} color="var(--primary)" />
                                </div>
                            )}
                            <div className={`message-bubble ${msg.sender === 'user' ? 'user-bubble' : 'bot-bubble'}`}>
                                {msg.text.split('\n').map((line, i) => (
                                    <React.Fragment key={i}>
                                        {line}
                                        {i !== msg.text.split('\n').length - 1 && <br />}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="message-wrapper bot">
                            <div className="bot-avatar"><Bot size={20} color="var(--primary)" /></div>
                            <div className="message-bubble bot-bubble loading-dots">
                                <span>.</span><span>.</span><span>.</span>
                            </div>
                        </div>
                    )}
                    <div ref={endOfMessagesRef} />
                </div>

                <form className="input-area" onSubmit={sendMessage}>
                    <input
                        type="text"
                        className="chat-input"
                        placeholder="Type patient symptoms here..."
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        disabled={loading}
                    />
                    <button type="submit" className="btn btn-primary send-btn" disabled={loading || !inputText.trim()}>
                        <Send size={18} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SymptomChecker;
