'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'next/navigation';
import type { Locale } from '@/i18n.config';
import { getTranslation } from '@/lib/translations';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Loader, Send, MessageCircle, Trash2, Copy, Check } from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function FarmerPage() {
  const params = useParams();
  const locale = (params?.locale as Locale) || 'en';
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    locale === 'en' ? 'How to manage crop pests?' : locale === 'hi' ? 'फसल कीटों को कैसे नियंत्रित करें?' : 'ಬೆಳೆ ಕೀಟಗಳನ್ನು ಹೇಗೆ ನಿಯಂತ್ರಿಸುವುದು?',
    locale === 'en' ? 'Best time to irrigate crops' : locale === 'hi' ? 'फसलों को पानी देने का सही समय' : 'ಬೆಳೆಗಳಿಗೆ ನೀರಾವರಣದ ಸರಿಯ ಸಮಯ',
    locale === 'en' ? 'Soil testing importance' : locale === 'hi' ? 'मिट्टी परीक्षण का महत्व' : 'ಮಣ್ಣಿನ ಪರೀಕ್ষೆಯ ಪ್ರಾಮುಖ್ಯತೆ',
    locale === 'en' ? 'Organic farming methods' : locale === 'hi' ? 'जैविक खेती की विधियाँ' : 'ಜೈವಿಕ ಕೃಷಿ ವಿಧಾನಗಳು',
  ];

  const copyToClipboard = (text: string, messageId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(messageId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  useEffect(() => {
    // Load chat history from localStorage
    const saved = localStorage.getItem(`farmer-chat-${locale}`);
    if (saved) {
      setMessages(
        JSON.parse(saved).map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }))
      );
    }
  }, [locale]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const t = getTranslation(locale);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/groq-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: input,
          language: locale,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => {
        const updated = [...prev, assistantMessage];
        localStorage.setItem(`farmer-chat-${locale}`, JSON.stringify(updated));
        return updated;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      const errorMessage: ChatMessage = {
        id: (Date.now() + 2).toString(),
        role: 'assistant',
        content: t.common.error,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = () => {
    setMessages([]);
    localStorage.removeItem(`farmer-chat-${locale}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="border-b border-border bg-gradient-to-r from-primary/10 to-secondary/10 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold text-foreground">{t.farmer.title}</h1>
          <p className="mt-2 text-muted-foreground">{t.farmer.description}</p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-4">
          {/* Main Chat Area */}
          <div className="lg:col-span-3">
            <Card className="flex h-[600px] flex-col">
              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.length === 0 && (
                  <div className="flex h-full flex-col items-center justify-center text-center">
                    <div>
                      <MessageCircle className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                      <p className="text-muted-foreground mb-6">Start by asking a farming question...</p>
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-muted-foreground mb-3">Suggested Questions:</p>
                        {suggestedQuestions.map((question, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setInput(question);
                              setTimeout(() => {
                                const form = document.querySelector('form');
                                form?.dispatchEvent(new Event('submit', { bubbles: true }));
                              }, 0);
                            }}
                            className="block w-full text-left text-xs p-2 rounded border border-primary/20 hover:bg-primary/10 hover:border-primary/50 transition-colors text-muted-foreground hover:text-foreground truncate"
                          >
                            {question}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-md rounded-lg px-4 py-3 group ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-card border border-border text-foreground'
                      }`}
                    >
                      {message.role === 'assistant' ? (
                        <div className="text-sm space-y-2">
                          {message.content.split('\n').map((line, idx) => {
                            if (!line.trim()) return null;
                            return (
                              <div key={idx}>
                                {line.trim().startsWith('-') || line.trim().startsWith('•') || /^\d+\./.test(line.trim()) ? (
                                  <p className="text-sm">{line.trim()}</p>
                                ) : (
                                  <p className="text-sm">• {line.trim()}</p>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-sm">{message.content}</p>
                      )}
                      <div className="flex items-center justify-between mt-2 gap-2">
                        <span className="text-xs opacity-70">
                          {message.timestamp.toLocaleTimeString(locale)}
                        </span>
                        {message.role === 'assistant' && (
                          <button
                            onClick={() => copyToClipboard(message.content, message.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-muted rounded"
                            title="Copy response"
                          >
                            {copiedId === message.id ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="rounded-lg bg-card border border-border px-4 py-2">
                      <Loader className="h-5 w-5 animate-spin text-primary" />
                    </div>
                  </div>
                )}

                {error && (
                  <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
                    {error}
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <form onSubmit={handleSubmit} className="border-t border-border p-4">
                <div className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={t.farmer.placeholder}
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    size="icon"
                    className="flex-shrink-0"
                  >
                    {isLoading ? (
                      <Loader className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </form>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Clear History */}
            <Card className="p-4">
              <Button
                onClick={clearHistory}
                variant="outline"
                className="w-full"
                disabled={messages.length === 0}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {t.farmer.history}
              </Button>
            </Card>

            {/* Recent Queries */}
            {messages.length > 0 && (
              <Card className="p-4">
                <h3 className="font-semibold mb-3 text-sm">{t.farmer.history}</h3>
                <div className="space-y-2">
                  {messages
                    .filter((m) => m.role === 'user')
                    .slice(-5)
                    .reverse()
                    .map((msg) => (
                      <button
                        key={msg.id}
                        onClick={() => setInput(msg.content)}
                        className="block w-full text-left text-xs p-2 rounded border border-border hover:bg-primary/10 transition-colors text-muted-foreground hover:text-foreground truncate"
                      >
                        {msg.content}
                      </button>
                    ))}
                </div>
              </Card>
            )}

            {/* Tips */}
            <Card className="p-4 bg-primary/5 border-primary/20">
              <h3 className="font-semibold mb-2 text-sm">Tips</h3>
              <ul className="space-y-1 text-xs text-muted-foreground">
                <li>• Ask specific questions</li>
                <li>• Include crop type</li>
                <li>• Mention your region</li>
                <li>• Be clear & detailed</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
