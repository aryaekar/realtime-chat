import { useState, createContext } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './pages/home'
import Login from './pages/login'

export const AuthContext = createContext(null);

function App() {
  const [user, setUser] = useState(null);
  
  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </AuthContext.Provider>
  )
}

export default App
