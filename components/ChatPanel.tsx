
import React, { useState, useRef, useEffect } from 'react';
import { Send, X, MessageSquare, Users } from 'lucide-react';
import { Comment } from '../types';

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  workflowName: string;
  comments: Comment[];
  onAddComment: (text: string) => void;
  currentUser: string;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({ 
  isOpen, 
  onClose, 
  workflowName, 
  comments, 
  onAddComment,
  currentUser 
}) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [comments, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onAddComment(newMessage);
      setNewMessage('');
    }
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 transition-opacity" 
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div className={`fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header */}
        <div className="p-4 border-b border-slate-200 bg-indigo-50/50 flex items-center justify-between shrink-0">
          <div>
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-indigo-600" />
              Collaboration
            </h3>
            <p className="text-xs text-slate-500 truncate max-w-[250px]">{workflowName}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-200 text-slate-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Context Note */}
        <div className="px-4 py-3 bg-amber-50 border-b border-amber-100 text-xs text-amber-800 flex items-start gap-2 shrink-0">
          <Users className="w-4 h-4 mt-0.5 shrink-0 opacity-70" />
          <p>
            <strong>Note:</strong> This is a shared space for <strong>Step Owners</strong> and <strong>Workflow Owners</strong> to discuss process details, blockers, and updates.
          </p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
          {comments.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-sm italic">
              No messages yet. Start the conversation!
            </div>
          ) : (
            comments.map((msg) => {
              const isMe = msg.userName === currentUser;
              return (
                <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm text-sm ${
                    isMe 
                      ? 'bg-indigo-600 text-white rounded-br-none' 
                      : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'
                  }`}>
                    <p>{msg.text}</p>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1 px-1">
                     <span className="text-[10px] font-bold text-slate-500">{isMe ? 'You' : msg.userName}</span>
                     <span className="text-[10px] text-slate-400">• {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-slate-200 bg-white shrink-0">
           <form onSubmit={handleSubmit} className="relative">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="w-full pl-4 pr-12 py-3 bg-slate-100 border-transparent focus:bg-white focus:border-indigo-300 focus:ring-4 focus:ring-indigo-500/10 rounded-xl text-sm transition-all outline-none"
              />
              <button 
                type="submit"
                disabled={!newMessage.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
           </form>
        </div>
      </div>
    </>
  );
};
