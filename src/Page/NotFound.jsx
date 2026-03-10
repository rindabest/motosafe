import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Home, Wrench } from 'lucide-react';
import Navbar from '../components/Navbar';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-black text-white">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 pt-28 pb-16 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="space-y-5">
          <p className="text-xs font-bold tracking-[0.25em] text-blue-300 uppercase">
            Error 404
          </p>
          <h1 className="text-4xl sm:text-5xl font-black leading-tight">
            Trang đã bị kẹt trong gara.
          </h1>
          <p className="text-slate-300 text-lg">
            Tuyến đường bạn đang tìm kiếm không có trên bản đồ. Hãy để chúng tôi đưa bạn trở lại con đường an toàn hơn.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/10 border border-white/20 hover:bg-white/15 transition"
            >
              <ArrowLeft size={18} /> Quay lại
            </button>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg shadow-blue-500/25 transition"
            >
              <Home size={18} /> Trang chủ
            </Link>

          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-6 bg-blue-500/10 blur-3xl rounded-3xl" />
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur">
            {/* NOTE: Place the provided 404 illustration at public/404-mechanic.png */}
            <img
              src="/404.png"
              alt="MotorSafe 404 illustration"
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />

          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
