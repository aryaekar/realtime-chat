import React, { useRef, useEffect } from 'react';
import { useAuthContext } from '../context/authcontext.jsx';
import { useNavigate } from 'react-router-dom';

export const LogoutPopup = ({ isOpen, onClose, anchorRef }) => {
    const { setUser } = useAuthContext();
    const navigate = useNavigate();
    const menuRef = useRef(null);

    const handleLogout = () => {
        // Clear user data
        setUser(null);
        // Clear any stored data
        localStorage.removeItem('user');
        // Navigate to login page
        navigate('/login');
    };

    // Close dropdown if clicked outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target) &&
                anchorRef?.current &&
                !anchorRef.current.contains(event.target)
            ) {
                onClose();
            }
        }
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose, anchorRef]);

    if (!isOpen) return null;

    // Positioning: absolute above the anchor button
    return (
        <div
            ref={menuRef}
            className="absolute right-0 bottom-full mb-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-50"
            style={{ minWidth: '10rem' }}
        >
            {/* Caret/arrow at the bottom */}
            <div className="absolute -bottom-2 right-4 w-4 h-4 bg-white border-b border-r border-gray-100 rotate-45 z-10"></div>
            <div className="py-2">
                {/* Example: Add more options here if needed */}
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default LogoutPopup; 