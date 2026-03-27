import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { exchangeCode } = useAuth();
  const exchangeStarted = useRef(false);

  useEffect(() => {
    const code = searchParams.get('code');
    if (code && !exchangeStarted.current) {
      exchangeStarted.current = true;
      exchangeCode(code)
        .then(() => navigate('/'))
        .catch(() => navigate('/login-failed'));
    }
  }, [searchParams, exchangeCode, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <div className="text-xl font-medium">Securing your session...</div>
      <p className="text-gray-500 mt-2">Authenticating with Aacharya Hub</p>
    </div>
  );
};

export default AuthCallback;
