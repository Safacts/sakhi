import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      localStorage.setItem('sakhi_token', token);
      navigate('/');
    } else {
      navigate('/login-failed');
    }
  }, [searchParams, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-xl animate-pulse">Authenticating with Aacharya...</div>
    </div>
  );
};

export default AuthCallback;
