import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Phone, Lock, Eye, EyeOff, Shield, Headphones, Bike } from "lucide-react";
import { Button } from "../../components/ui/button";
import motorcycleBg from "../../assets/motorcycle-bg.jpg";
import apiAuth, { handleApiError } from "../../utils/apiAuth";

const NewLogin = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Check if we were redirected from registration
    const redirectState = location.state || {};
    const [showPassword, setShowPassword] = useState(false);

    // Auto-fill phone/email if it was passed from Register page
    const [phone, setPhone] = useState(redirectState.accountIdentifier || "");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(redirectState.message || null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        // AC1 & AC2 & AC3: Bắt buộc nhập
        if (!phone || !password) {
            setError("Vui lòng điền đủ thông tin");
            return;
        }

        setLoading(true);
        try {
            const res = await apiAuth.post("/auth/login", {
                accountIdentifier: phone, // The backend accepts both email & phone via this field
                password
            });

            if (res.data.token) {
                // Save token to localStorage
                localStorage.setItem("token", res.data.token);

                // AC6: Đăng nhập thành công -> chuyển hướng đến màn hình GPS
                navigate("/");
            }
        } catch (err) {
            // AC4 & AC5 handled by API Error interceptor
            setError(handleApiError(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#111111]">
            <div
                className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay"
                style={{ backgroundImage: `url(${motorcycleBg})` }}
            />
            {/* Dark gradient overlay to match mockup's soft dark vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#111111]/80 to-[#111111]/90" />

            <div className="relative z-10 w-full max-w-[420px] mx-4">
                <div className="bg-[#18181A] border border-zinc-800/60 rounded-2xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
                    {/* Subtle top glow matching mockup style */}
                    <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-[#f97316]/30 to-transparent"></div>

                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center gap-2 mb-3">
                            <Bike className="w-8 h-8 text-[#f97316]" strokeWidth={2.5} />
                            <h1 className="text-3xl font-heading font-bold text-white tracking-tight">
                                MotorSafe
                            </h1>
                        </div>
                        <p className="text-zinc-400 text-[13px] leading-relaxed max-w-[280px] mx-auto">
                            Người bạn đồng hành cứu hộ tin cậy. Mọi cung đường, mọi thời điểm.
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="mb-6 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm text-center">
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="block text-xs font-medium text-zinc-300 ml-1">Số điện thoại</label>
                            <div className="relative">
                                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-zinc-500" />
                                <input
                                    type="text"
                                    placeholder="Nhập số điện thoại của bạn"
                                    value={phone}
                                    onChange={(e) => {
                                        setPhone(e.target.value);
                                        setError(null);
                                    }}
                                    className="w-full bg-[#1C1C1E] border border-zinc-800/80 rounded-xl pl-11 pr-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-[#f97316]/50 focus:border-[#f97316]/50 transition-all text-[15px]"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5 pb-2">
                            <label className="block text-xs font-medium text-zinc-300 ml-1">Mật khẩu</label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-zinc-500" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Nhập mật khẩu của bạn"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setError(null);
                                    }}
                                    className="w-full bg-[#1C1C1E] border border-zinc-800/80 rounded-xl pl-11 pr-12 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-[#f97316]/50 focus:border-[#f97316]/50 transition-all text-[15px]"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                                </button>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={loading || !phone || !password}
                            className="w-full py-3.5 text-[15px] font-semibold rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white shadow-[0_4px_14px_0_rgba(249,115,22,0.39)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.23)] transition-all flex items-center justify-center gap-2 border-0"
                        >
                            {loading ? "Đang xử lý..." : (
                                <>Đăng nhập <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg></>
                            )}
                        </Button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-zinc-800/60 flex flex-col items-center gap-4">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-medium">
                                <Shield className="w-3.5 h-3.5" />
                                <span>Bảo mật 256-bit</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-medium">
                                <Headphones className="w-3.5 h-3.5" />
                                <span>Cứu hộ 24/7</span>
                            </div>
                        </div>
                    </div>
                </div>

                <p className="text-center mt-6 text-xs text-zinc-600 font-medium">
                    © 2026 Dịch vụ cứu hộ MotorSafe. Bảo lưu mọi quyền.
                </p>
                <div className="text-center mt-3 text-[13px] text-zinc-500">
                    Bạn chưa có tài khoản?{" "}
                    <Link to="/register" className="text-[#f97316] font-semibold hover:text-[#EA580C] transition-colors">
                        Đăng ký ngay
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NewLogin;
