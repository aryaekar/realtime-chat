import React, { useRef, useEffect } from 'react';
import { useChatContext } from '../context/chatcontext.jsx';
import { useAuthContext } from '../context/authcontext.jsx';
import { format } from 'date-fns';

export const ChatMessages = () => {
  const { selectedChat, messages } = useChatContext();
  const { user } = useAuthContext();
  const messagesEndRef = useRef(null);
  
  const chatId = selectedChat?._id;
  const chatMessages = chatId ? messages[chatId] || [] : [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, selectedChat]);

  if (!selectedChat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No chat selected</h3>
          <p className="mt-1 text-sm text-gray-500">Select a chat to start messaging</p>
        </div>
      </div>
    );
  }

  // Group messages by date
  const groupedMessages = {};
  chatMessages.forEach(message => {
    const date = new Date(message.createdAt).toISOString().split('T')[0]; // Get YYYY-MM-DD part
    if (!groupedMessages[date]) {
      groupedMessages[date] = [];
    }
    groupedMessages[date].push(message);
  });

  // Format date for display
  const formatMessageDate = (dateString) => {
    const messageDate = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (messageDate.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return format(messageDate, 'MMMM d, yyyy');
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white">
      {/* Chat header */}
      <div className="flex items-center px-4 py-3 border-b border-gray-200 bg-white shadow-sm z-10">
        <div className="flex items-center">
          <div className="relative">
            <img 
              src={`https://ui-avatars.com/api/?name=${selectedChat.participants.find(p => p._id !== user._id)?.username}&background=random`}
              alt={selectedChat.participants.find(p => p._id !== user._id)?.username}
              className="h-10 w-10 rounded-full"
            />
            <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white bg-green-400" />
          </div>
          <div className="ml-3">
            <h2 className="text-lg font-medium text-gray-900">
              {selectedChat.participants.find(p => p._id !== user._id)?.username}
            </h2>
            <p className="text-sm text-gray-500">Online</p>
          </div>
        </div>
        
        {/* Chat actions */}
        <div className="ml-auto flex space-x-2">
          <button className="p-2 rounded-full hover:bg-gray-100">
            <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100">
            <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100">
            <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {Object.keys(groupedMessages).map(date => (
          <div key={date} className="space-y-3">
            {/* Date separator */}
            <div className="flex justify-center">
              <span className="px-4 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-500">
                {formatMessageDate(date)}
              </span>
            </div>
            
            {/* Messages for this date */}
            {groupedMessages[date].map((message, i) => {
              const isCurrentUser = message.from === user._id;
              const previousMessage = i > 0 ? groupedMessages[date][i - 1] : null;
              const isNewGroup = 
                !previousMessage || 
                previousMessage.from !== message.from || 
                (new Date(message.createdAt).getTime() - new Date(previousMessage.createdAt).getTime() > 2 * 60 * 1000);
              
              return (
                <div 
                  key={message._id} 
                  className={`flex flex-col ${isCurrentUser ? "items-end" : "items-start"} ${!isNewGroup ? "mt-1" : ""}`}
                >
                  <div className="flex items-end">
                    {/* Message bubble */}
                    <div 
                      className={`px-4 py-2 rounded-lg max-w-md break-words ${
                        isCurrentUser 
                          ? "bg-blue-500 text-white rounded-br-none" 
                          : "bg-gray-100 text-gray-800 rounded-bl-none"
                      }`}
                    >
                      {message.message}
                      <div 
                        className={`text-xs mt-1 ${
                          isCurrentUser ? "text-blue-100" : "text-gray-500"
                        }`}
                      >
                        {format(new Date(message.createdAt), 'h:mm a')}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
        
        {/* Empty state */}
        {chatMessages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No messages</h3>
              <p className="mt-1 text-sm text-gray-500">Start the conversation by sending a message below.</p>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

    </div>
  );
}; 
export default ChatMessages;