import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthContextProvider } from './context/authcontext.jsx'
import { ChatContextProvider } from './context/chatcontext.jsx'
import { SocketContextProvider } from './context/socketcontext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
    <AuthContextProvider>
      <SocketContextProvider>
        <ChatContextProvider>
          <App />
        </ChatContextProvider>
      </SocketContextProvider>
    </AuthContextProvider>
)
