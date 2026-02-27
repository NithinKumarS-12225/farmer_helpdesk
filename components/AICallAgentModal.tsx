'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { Locale } from '@/i18n.config';
import { getTranslation } from '@/lib/translations';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Phone, Mic, Send, X, Volume2, VolumeX, Loader } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AICallAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  locale: Locale;
}

export default function AICallAgentModal({ isOpen, onClose, locale }: AICallAgentModalProps) {
  const t = getTranslation(locale);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognitionError, setRecognitionError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize speech recognition
  useEffect(() => {
    if (!isOpen) return;

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        console.warn('[v0] Speech Recognition not supported');
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = getLanguageCode(locale);

      recognition.onstart = () => {
        console.log('[v0] Listening started');
        setIsListening(true);
        setRecognitionError('');
      };

      recognition.onresult = (event: any) => {
        console.log('[v0] Result received. Results length:', event.results.length);
        
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          console.log('[v0] Result', i, ':', transcript, 'isFinal:', event.results[i].isFinal);
          finalTranscript += transcript;
        }

        if (finalTranscript.trim()) {
          console.log('[v0] Final transcript:', finalTranscript);
          setInput(finalTranscript.trim());
          
          // Auto-submit the transcribed text
          setTimeout(() => {
            submitMessage(finalTranscript.trim());
          }, 300);
        }
        
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        console.error('[v0] Recognition error:', event.error);
        setRecognitionError(`Error: ${event.error}`);
        setIsListening(false);
      };

      recognition.onend = () => {
        console.log('[v0] Listening ended');
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      console.log('[v0] Speech recognition initialized');
    } catch (error) {
      console.error('[v0] Error setting up speech recognition:', error);
      setRecognitionError('Could not initialize speech recognition');
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [isOpen, locale]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getLanguageCode = (loc: Locale): string => {
    const codes: Record<Locale, string> = {
      en: 'en-US',
      hi: 'hi-IN',
      kn: 'kn-IN',
      ta: 'ta-IN',
      te: 'te-IN',
      bn: 'bn-IN',
      ml: 'ml-IN',
      ur: 'ur-IN',
    };
    return codes[loc] || 'en-US';
  };

  const submitMessage = useCallback(async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      console.log('[v0] Sending message to API:', messageText);
      const response = await fetch('/api/groq-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: messageText,
          language: locale,
        }),
      });

      if (!response.ok) {
        throw new Error('API call failed');
      }

      const data = await response.json();
      console.log('[v0] API response:', data);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || 'No response from AI',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Text-to-speech
      if (!isMuted && data.response) {
        speakText(data.response);
      }
    } catch (error) {
      console.error('[v0] Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: 'assistant',
        content: 'Sorry, there was an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, locale, isMuted]);

  const handleSendMessage = async () => {
    submitMessage(input);
  };

  const handleVoiceClick = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser. Please use text input instead.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        console.log('[v0] Starting speech recognition');
      } catch (error) {
        console.error('[v0] Error starting recognition:', error);
        setRecognitionError('Could not start recording. Please try again.');
      }
    }
  };

  const speakText = (text: string) => {
    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = getLanguageCode(locale);
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;

      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
      console.log('[v0] Speaking:', text.substring(0, 50));
    } catch (error) {
      console.error('[v0] Error speaking:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-md flex flex-col max-h-96 md:max-h-[600px]">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            <h2 className="text-lg font-bold">AI Farm Agent</h2>
          </div>
          <button
            onClick={onClose}
            className="hover:bg-white/20 rounded-full p-1 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-center text-muted-foreground">
              <div>
                <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mx-auto mb-2">
                  <Phone className="h-6 w-6 text-green-600" />
                </div>
                <p className="text-sm">Ask our AI agent for farming help</p>
                <p className="text-xs mt-1 opacity-70">Use text or voice input</p>
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`rounded-lg px-3 py-2 text-sm max-w-xs ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground border border-border'
                  }`}
                >
                  <p>{msg.content}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {msg.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted text-foreground border border-border rounded-lg px-3 py-2 flex items-center gap-2">
                <Loader className="h-4 w-4 animate-spin" />
                <span className="text-sm">Processing...</span>
              </div>
            </div>
          )}
          {recognitionError && (
            <div className="flex justify-center">
              <div className="bg-red-100 text-red-800 text-xs rounded-lg px-3 py-2">
                {recognitionError}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-border p-4 space-y-3">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your question..."
              disabled={isLoading}
              className="text-sm"
            />
            <Button
              size="icon"
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim()}
              className="h-9 w-9"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex gap-2 justify-center">
            <Button
              size="sm"
              variant={isListening ? 'default' : 'outline'}
              onClick={handleVoiceClick}
              className="text-xs"
            >
              <Mic className={`h-3 w-3 mr-1 ${isListening ? 'animate-pulse' : ''}`} />
              {isListening ? 'Listening...' : 'Voice'}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsMuted(!isMuted)}
              className="text-xs"
            >
              {isMuted ? <VolumeX className="h-3 w-3 mr-1" /> : <Volume2 className="h-3 w-3 mr-1" />}
              {isMuted ? 'Muted' : 'Sound'}
            </Button>
          </div>

          <div className="text-xs text-center text-muted-foreground">
            <p>Using Groq AI • {locale.toUpperCase()}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Call Groq API
      const response = await fetch('/api/groq-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: input,
          language: locale,
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();
      console.log('[v0] Groq response:', data);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Speak response if not muted
      if (voiceAssistant && !isMuted) {
        console.log('[v0] Speaking response:', data.response);
        await voiceAssistant.speak(data.response);
      }
    } catch (error) {
      console.error('[v0] Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: 'assistant',
        content: 'Sorry, there was an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceInput = () => {
    if (!voiceAssistant || !voiceAssistant.isSupported()) {
      alert('Voice input is not supported in your browser');
      return;
    }

    if (isListening) {
      voiceAssistant.stopListening();
      setIsListening(false);
    } else {
      voiceAssistant.startListening();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-md flex flex-col max-h-96 md:max-h-[600px]">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            <h2 className="text-lg font-bold">AI Farm Agent</h2>
          </div>
          <button
            onClick={onClose}
            className="hover:bg-white/20 rounded-full p-1 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-center text-muted-foreground">
              <div>
                <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mx-auto mb-2">
                  <Phone className="h-6 w-6 text-green-600" />
                </div>
                <p className="text-sm">Ask our AI agent for farming help</p>
                <p className="text-xs mt-1 opacity-70">Available in {locale.toUpperCase()}</p>
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`rounded-lg px-3 py-2 text-sm max-w-xs ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground border border-border'
                  }`}
                >
                  <p>{msg.content}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {msg.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted text-foreground border border-border rounded-lg px-3 py-2 flex items-center gap-2">
                <Loader className="h-4 w-4 animate-spin" />
                <span className="text-sm">Processing...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-border p-4 space-y-3">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask a question..."
              disabled={isLoading}
              className="text-sm"
            />
            <Button
              size="icon"
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim()}
              className="h-9 w-9"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex gap-2 justify-center">
            <Button
              size="sm"
              variant={isListening ? 'default' : 'outline'}
              onClick={handleVoiceInput}
              className="text-xs"
            >
              <Mic className={`h-3 w-3 mr-1 ${isListening ? 'animate-pulse' : ''}`} />
              {isListening ? 'Listening...' : 'Voice'}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsMuted(!isMuted)}
              className="text-xs"
            >
              {isMuted ? <VolumeX className="h-3 w-3 mr-1" /> : <Volume2 className="h-3 w-3 mr-1" />}
              {isMuted ? 'Muted' : 'Sound'}
            </Button>
          </div>

          <div className="text-xs text-center text-muted-foreground">
            <p>Using Groq AI • {locale.toUpperCase()}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
