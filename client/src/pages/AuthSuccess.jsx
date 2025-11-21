import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AuthSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userStr = params.get('user');

    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        localStorage.setItem('user', JSON.stringify(user));
        // Force a reload to ensure Navbar updates
        window.location.href = '/';
      } catch (error) {
        console.error('Failed to parse user data:', error);
        navigate('/');
      }
    } else {
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Completing authentication...</p>
      </div>
    </div>
  );
}
