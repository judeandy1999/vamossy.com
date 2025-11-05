'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Send, Bot, User } from 'lucide-react';

const supabase = typeof window !== "undefined"
  ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  : null;

export default function VamossyAgentChat() {
  const [agent, setAgent] = useState("seo");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  async function getUserId() {
    try {
      if (!supabase) return "anon";
      const { data: { user } } = await supabase.auth.getUser();
      return user?.id || "anon";
    } catch { 
      return "anon"; 
    }
  }

  async function sendAgentMessage(e) {
    e?.preventDefault?.();
    if (!message.trim() || loading) return;

    const userMessage = message.trim();
    setMessage("");
    setLoading(true);

    // Add user message to chat
    setMessages(prev => [...prev, { 
      role: 'user', 
      content: userMessage, 
      timestamp: new Date() 
    }]);

    try {
      const userId = await getUserId();
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          agent, 
          userId, 
          sessionId, 
          message: userMessage 
        })
      });

      if (!res.ok) {
        // Get more detailed error information
        let errorMessage = 'Failed to get response';
        try {
          const errorData = await res.json();
          errorMessage = errorData.error || errorData.message || `HTTP ${res.status}: ${res.statusText}`;
        } catch {
          errorMessage = `HTTP ${res.status}: ${res.statusText}`;
        }
        
        console.error('API Error:', {
          status: res.status,
          statusText: res.statusText,
          url: res.url
        });
        
        throw new Error(errorMessage);
      }

      const json = await res.json();

      // Add assistant response to chat
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: json.message,
        agent: json.agent,
        leadScore: json.leadScore,
        timestamp: new Date()
      }]);

    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `Sorry, I encountered an error: ${error.message}. Please try again.`,
        timestamp: new Date(),
        error: true
      }]);
    } finally {
      setLoading(false);
    }
  }

  const agentOptions = [
    { value: "acquisition", label: "Acquisition Agent", color: "bg-blue-100 text-blue-800" },
    { value: "seo", label: "SEO Agent", color: "bg-green-100 text-green-800" },
    { value: "conversion", label: "Conversion Agent", color: "bg-purple-100 text-purple-800" },
    { value: "retention", label: "Retention Agent", color: "bg-orange-100 text-orange-800" },
    { value: "analytics", label: "Analytics Agent", color: "bg-indigo-100 text-indigo-800" },
    { value: "creative", label: "Creative Agent", color: "bg-pink-100 text-pink-800" },
    { value: "foresight", label: "Foresight Agent", color: "bg-gray-100 text-gray-800" }
  ];

  const currentAgent = agentOptions.find(opt => opt.value === agent);

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50 rounded-t-lg">
        <div className="flex items-center gap-3">
          <Bot className="w-6 h-6 text-[#025965]" />
          <h2 className="text-lg font-semibold text-gray-900">Vamossy Agents</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Active:</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${currentAgent?.color}`}>
            {currentAgent?.label}
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 min-h-[400px] max-h-[600px]">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <Bot className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Welcome to Vamossy Agents</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Choose an agent from the dropdown below and ask any question about growing your ecommerce business.
            </p>
          </div>
        )}

        {messages.map((msg, index) => (
          <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-[#025965] rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              </div>
            )}
            
            <div className={`max-w-[80%] ${msg.role === 'user' ? 'order-1' : ''}`}>
              <div className={`rounded-lg px-4 py-3 ${
                msg.role === 'user' 
                  ? 'bg-[#025965] text-white' 
                  : msg.error 
                    ? 'bg-red-50 text-red-900 border border-red-200'
                    : 'bg-gray-50 text-gray-900'
              }`}>
                <div className="whitespace-pre-wrap">{msg.content}</div>
                {msg.leadScore > 0 && (
                  <div className="mt-2 text-xs opacity-75">
                    Lead Score: {msg.leadScore}/10
                  </div>
                )}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {msg.timestamp.toLocaleTimeString()}
              </div>
            </div>

            {msg.role === 'user' && (
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-[#025965] rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-sm text-gray-600">Thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={sendAgentMessage} className="flex items-center gap-3 p-4 border-t bg-gray-50 rounded-b-lg">
        <select 
          value={agent} 
          onChange={(e) => setAgent(e.target.value)} 
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-[#025965] focus:border-transparent"
          disabled={loading}
        >
          {agentOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask your question…"
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#025965] focus:border-transparent"
          disabled={loading}
        />
        
        <button 
          type="submit" 
          className="px-4 py-2 bg-[#025965] text-white rounded-lg hover:bg-[#014c54] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          disabled={loading || !message.trim()}
        >
          <Send className="w-4 h-4" />
          Send
        </button>
      </form>
    </div>
  );
}