import React, { useState } from 'react';
import axios from 'axios';
import { useChatContext } from '../context/chatcontext.jsx';
import { useAuthContext } from '../context/authcontext.jsx';

export const FriendRequestsModal = ({ isOpen, onClose }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searchError, setSearchError] = useState('');
    const { requests, setRequests, users } = useChatContext();
    const { user } = useAuthContext();
    const API_URL = import.meta.env.VITE_API_URL;

    const handleRequest = async (requestId, action) => {
        try {
            let response;
            if(action === "accept") {
                response = await axios.post(`${API_URL}/acceptrequest`, { requestid: requestId });
            } else {
                response = await axios.post(`${API_URL}/rejectrequest`, { requestid: requestId });
            }
            if (response.status === 200) {
                setRequests(prevRequests => 
                    prevRequests.filter(request => request._id !== requestId)
                );
            }
        } catch (error) {
            console.error(`Error ${action}ing request:`, error);
        }
    };
    const isfriend=(userid)=>{
        return users.some(user=>user._id===userid);
    }
    const isrequest=(userid)=>{
        return requests.some(request=>request.sender===userid);
    }
    const handleSearch = async (e) => {
        e.preventDefault();
        const query = searchQuery?.trim();
        
        if (!query || query.length === 0) {
          setSearchError('Please enter a search term');
          setSearchResults([]);
          return;
        }
        
        setSearchError('');
        setSearchResults([]); // Clear previous results
        
        try {
            const response = await axios.get(`${API_URL}/searchusername/${query}`);
          
          
          setSearchResults(response.data);
          
          if (response.data.length === 0) {
            setSearchError('No users found matching your search');
          }
        } catch (error) {
          console.error("Error searching users:", error);
          if (error.response?.status === 400) {
            setSearchError('Invalid search term');
          } else {
            setSearchError('Failed to search users. Please try again.');
          }
          setSearchResults([]);
        }
      };

    const sendFriendRequest = async (userId) => {
        try {
            const response = await axios.post(`${API_URL}/sendrequest`, {
                receiverid: userId,
                senderid: user._id
            });
            if (response.status === 200) {
                setRequests(prevRequests => [...prevRequests, response.data]);
            }
        } catch (error) {
            console.error("Error sending friend request:", error);
        }
    };
    const getUsername=(userid)=>{
        // const user=await axios.get(`${API_URL}/users/${userid}`);
        const user=users.find(u=>u._id===userid);
        return user?user.username:"";
    }
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-md mx-4">
                <div className="p-4 border-b">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold">Friend Requests</h2>
                        <button 
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="p-4">
                    {/* Search Section */}
                    <form onSubmit={handleSearch} className="mb-4">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search users by username..."
                                className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                            >
                                Search
                            </button>
                        </div>
                        {searchError && (
                            <p className="mt-2 text-sm text-red-500">{searchError}</p>
                        )}
                    </form>

                    {/* Search Results */}
                    {searchResults.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-lg font-medium mb-2">Search Results</h3>
                            <div className="space-y-2">
                                {searchResults.map(result => (
                                    <div key={result._id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                        <span>{result.username}</span>
                                        {!isfriend(result._id)?<button
                                            onClick={() => sendFriendRequest(result._id)}
                                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                        >
                                            Add Friend
                                        </button>:isrequest(result._id)?"Request Sent":"Friend"}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Pending Requests */}
                    <div>
                        <h3 className="text-lg font-medium mb-2">Pending Requests</h3>
                        {requests.length === 0 ? (
                            <p className="text-gray-500 text-center py-2">No pending requests</p>
                        ) : (
                            <div className="space-y-2">
                                {requests.filter(request=>request.receiver===user._id).map(request => (
                                    <div key={request._id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                        <span>{getUsername(request.sender)}</span>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleRequest(request._id, 'accept')}
                                                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                            >
                                                Accept
                                            </button>
                                            <button
                                                onClick={() => handleRequest(request._id, 'reject')}
                                                className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FriendRequestsModal; 