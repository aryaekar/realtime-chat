import { useState, useEffect, useRef } from 'react';
import { useChatContext } from '../context/chatcontext.jsx';
import { useAuthContext } from '../context/authcontext.jsx';
import { formatDistanceToNow } from 'date-fns';
import FriendRequestsModal from './FriendRequestsModal';
import LogoutPopup from './LogoutPopup';

function Sidebar() {
  const { selectedChat, setSelectedChat, messages, chats, friends } = useChatContext();
  const { user } = useAuthContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [lastMessage, setLastMessage] = useState('');
  const settingsBtnRef = useRef(null);

  // Helper functions
  const getChatName = (chat) => {
    if (!chat || !chat.participants) return 'Unknown Chat';
    const otherParticipant = chat.participants.find(p => p !== user._id);
    const friend = friends.find(f => f._id === otherParticipant);
    return friend?.username || 'Unknown User';
  };

  const getChatAvatar = (chat) => {
    return `https://ui-avatars.com/api/?name=${getChatName(chat)}&background=random`;
  };

  const getLastMessage = (chat) => {
    const chatMessages = messages[chat._id] || [];
    return chatMessages[chatMessages.length - 1];
  };

  useEffect(() => {
    const lastMessages = {};
    
    chats.forEach(chat => {
      const lastMessage = getLastMessage(chat);
      if (lastMessage) {
        lastMessages[chat._id] = lastMessage;
      }
    });
    
    setLastMessage(lastMessages);
  }, [messages, chats]);
  const filteredChats = chats.filter(chat => 
    getChatName(chat).toLowerCase().includes(searchQuery.toLowerCase())
  );


  return (
    <aside className="w-80 flex flex-col border-r border-gray-200 bg-gray-50 h-screen">
      {/* Sidebar header */}
      <div className="p-4 border-b border-gray-200 bg-white flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800 border-red-600">Chats</h2>
        <div >
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2  text-black rounded-md hover:bg-gray-200 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        </button>
      </div>
      </div>
      
      {/* Search input */}
      <div className="p-3 border-b border-gray-200">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search conversations..." 
            className="w-full py-2 pl-8 pr-4 bg-gray-100 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <svg 
            className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500"
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" 
              clipRule="evenodd" 
            />
          </svg>
        </div>
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No chats found
          </div>
        ) : (
          filteredChats.map((chat) => (
            <div 
              key={chat._id}
              className={`flex items-center p-3 border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors ${
                selectedChat?._id === chat._id ? "bg-blue-50 hover:bg-blue-100" : ""
              }`}
              onClick={() => setSelectedChat(chat)}
            >
              {/* Avatar */}
              <div className="relative">
                <img 
                  src={getChatAvatar(chat)} 
                  alt={getChatName(chat)}
                  className="w-12 h-12 rounded-full"
                />
              </div>
              
              {/* Chat info */}
              <div className="ml-3 flex-1 overflow-hidden">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-medium text-gray-900 truncate">{getChatName(chat)}</h3>
                  {getLastMessage(chat) && (
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(getLastMessage(chat).createdAt), { addSuffix: false })}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500 truncate">
                    {lastMessage[chat._id] ? (
                      lastMessage[chat._id].from === user._id ? (
                        <>You: {lastMessage[chat._id].message}</>
                      ) : (
                        lastMessage[chat._id].message
                      )
                    ) : (
                      'No messages yet'
                    )}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* User profile section */}
      <div className="p-3 border-t border-gray-200 bg-white">
        <div className="flex items-center relative">
          <img 
            src={`https://ui-avatars.com/api/?name=${user?.username}&background=random`}
            alt={user?.username}
            className="w-10 h-10 rounded-full"
          />
          <div className="ml-3">
            <h4 className="font-medium text-gray-900">{user?.username}</h4>
            <div className="flex items-center text-sm text-gray-500">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
              Online
            </div>
          </div>
          <button 
            ref={settingsBtnRef}
            onClick={() => setIsLogoutOpen((v) => !v)}
            className="ml-auto p-1 rounded-full hover:bg-gray-100"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
          <LogoutPopup
            isOpen={isLogoutOpen}
            onClose={() => setIsLogoutOpen(false)}
            anchorRef={settingsBtnRef}
          />
        </div>
      </div>


      {/* Friend Requests Modal */}
      <FriendRequestsModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </aside>
  );
}

export default Sidebar;