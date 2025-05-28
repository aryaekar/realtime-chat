import React, { useState } from 'react';
import { useChatContext } from '../context/chatcontext.jsx';
import useSendMessage from '../hooks/useSendmessage.jsx';
import { useAuthContext } from '../context/authcontext.jsx';

export const MessageInput = () => {
  const { selectedChat } = useChatContext();
  const {sendMessage} = useSendMessage();
  const [message, setMessage] = useState('');
  const {user}=useAuthContext();
  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && selectedChat) {
      const otherParticipant=selectedChat.participants.find(p=>p!==user._id);
      sendMessage(message, selectedChat._id,user._id,otherParticipant);
      setMessage('');
    }
  };

  if (!selectedChat) return null;

  return (
    <div className="border-t border-gray-200 p-4 bg-white">
      <form onSubmit={handleSubmit} className="flex items-end">
        {/* Attachment button */}
        <button
          type="button"
          className="p-2 rounded-full text-gray-500 hover:bg-gray-100 focus:outline-none"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
            />
          </svg>
        </button>

        {/* Message input */}
        <div className="flex-1 ml-2 border border-gray-300 rounded-md focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 overflow-hidden">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="block w-full px-4 py-2 resize-none focus:outline-none"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
        </div>

        {/* Emoji picker button */}
        <button
          type="button"
          className="ml-2 p-2 rounded-full text-gray-500 hover:bg-gray-100 focus:outline-none"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>

        {/* Send button */}
        <button
          type="submit"
          className="ml-2 p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          disabled={!message.trim()}
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        </button>
      </form>
    </div>
  );
}; 
export default MessageInput;