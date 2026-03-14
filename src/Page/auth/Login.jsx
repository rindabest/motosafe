import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../utils/api';

const AUTH_REDIRECT_KEY = 'post_login_redirect';

const isSafeRedirectPath = (path) =>
  typeof path === 'string' &&
  path.startsWith('/') &&
  !path.startsWith('//') &&
  !path.startsWith('/login') &&
  !path.startsWith('/verify');

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isRegister, setIsRegister] = useState(false);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const redirectPath = React.useMemo(() => {
    const params = new URLSearchParams(location.search);
    const fromQuery = params.get('redirect');
    if (isSafeRedirectPath(fromQuery)) return fromQuery;
    const savedPath = sessionStorage.getItem(AUTH_REDIRECT_KEY);
    return isSafeRedirectPath(savedPath) ? savedPath : '/home';
  }, [location.search]);

  useEffect(() => {
    if (isSafeRedirectPath(redirectPath)) {
      sessionStorage.setItem(AUTH_REDIRECT_KEY, redirectPath);
    }
  }, [redirectPath]);

  const checkLoginStatus = useCallback(() => {
    const token = localStorage.getItem('token');
    if (token) {
      sessionStorage.removeItem(AUTH_REDIRECT_KEY);
      navigate(redirectPath, { replace: true });
    }
  }, [navigate, redirectPath]);

  useEffect(() => {
    checkLoginStatus();
  }, [checkLoginStatus]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!phone || !password) {
      setError('Vui lòng nhập số điện thoại và mật khẩu.');
      return;
    }
    if (isRegister && !fullName) {
      setError('Vui lòng nhập họ tên của bạn.');
      return;
    }

    setLoading(true);
    try {
      if (isRegister) {
        await api.post('/auth/register', { phone, password, fullName });
        setIsRegister(false);
        setError('Đăng ký thành công! Vui lòng đăng nhập.');
      } else {
        const res = await api.post('/auth/login', { phone, password });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        sessionStorage.removeItem(AUTH_REDIRECT_KEY);
        navigate(redirectPath, { replace: true });
      }
    } catch (err) {
      console.error("Auth failed:", err);
      setError(err.response?.data?.message || 'Xác thực thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 via-slate-900 to-blue-900 p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white/10 backdrop-blur-md rounded-xl shadow-lg border border-white/20">

        <div className="text-center text-white">
          <img src="/ms.png" alt="MotorSafe Logo" className="w-20 h-20 mx-auto mb-4 rounded-full border-2 border-white/30" />
          <h1 className="text-3xl font-bold tracking-wider">MOTORSAFE</h1>
          <p className="text-sm text-gray-300 italic">Cứu hộ nhanh chóng mọi nơi</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {isRegister && (
            <div>
              <input
                type="text"
                placeholder="Họ và tên"
                className="w-full px-4 py-3 bg-white/20 rounded-lg border border-transparent focus:border-white/50 text-white placeholder-gray-300 focus:outline-none transition"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={loading}
              />
            </div>
          )}
          <div>
            <input
              type="text"
              placeholder="Số điện thoại"
              className="w-full px-4 py-3 bg-white/20 rounded-lg border border-transparent focus:border-white/50 text-white placeholder-gray-300 focus:outline-none transition"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={loading}
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Mật khẩu"
              className="w-full px-4 py-3 bg-white/20 rounded-lg border border-transparent focus:border-white/50 text-white placeholder-gray-300 focus:outline-none transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 active:scale-95 transition-transform disabled:opacity-50"
          >
            {loading ? 'Vui lòng chờ...' : (isRegister ? 'Đăng ký' : 'Đăng nhập')}
          </button>
        </form>

        {error && <p className={error.includes('successful') ? "text-green-400 text-sm text-center" : "text-red-400 text-sm text-center"}>{error}</p>}

        <div className="flex items-center justify-center space-x-2">
          <hr className="w-full border-white/20" />
          <button
            type="button"
            onClick={() => { setIsRegister(!isRegister); setError(''); }}
            className="text-gray-300 text-sm hover:text-white whitespace-nowrap"
          >
            {isRegister ? 'Hoặc Đăng nhập' : 'Hoặc Đăng ký'}
          </button>
          <hr className="w-full border-white/20" />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
