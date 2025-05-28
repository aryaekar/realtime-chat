import { useState } from 'react';
import { useNavigate,Link } from 'react-router-dom';
import { useAuthContext } from '../context/authcontext.jsx';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setUser } = useAuthContext();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!email || !password){
      setError("Please enter email and password");
      return;
    }
    try{
      const response= await axios.post(`${API_URL}/login`,{email,password});
      if(response.status===200){
        setUser(response.data.user);
        localStorage.setItem("chat-user",JSON.stringify(response.data.user));
        navigate('/');
      }
      else{
        setError(response.data.error);
      }
    }
    catch(error){
      setError(error.response.data.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 mb-20  bg-white p-8 rounded-lg shadow-md">
        <div>
          <p className="mt-6 mb-10 text-center text-2xl font-bold text-gray-900">
            Log in to Chat
          </p>
        </div>
        <div>
          <p className='text-center'>Don't have an account? <Link to="/register" className='text-blue-500'>Register</Link></p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <label htmlFor="email" className="text-sm font-medium text-gray-900 m-2">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none my-2 rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="text-sm font-medium text-gray-900 m-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none my-2 rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
