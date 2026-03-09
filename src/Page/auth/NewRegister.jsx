import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Phone, Mail, Lock, Eye, EyeOff, Shield, CheckCircle, ArrowRight, CreditCard, Bike } from "lucide-react";
import { Button } from "../../components/ui/button";
import motorcycleBg from "../../assets/motorcycle-bg.jpg";
import apiAuth, { handleApiError } from "../../utils/apiAuth";

const NewRegister = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [form, setForm] = useState({
        fullName: "",
        phone: "",
        email: "",
        cccd: "",
        password: "",
        confirmPassword: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});
    const [success, setSuccess] = useState(null);

    const updateField = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        setFieldErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[field];
            return newErrors;
        });
        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setFieldErrors({});
        setSuccess(null);

        const newFieldErrors = {};
        const { fullName, phone, email, cccd, password, confirmPassword } = form;

        // AC02: Không được để trống
        if (!fullName) newFieldErrors.fullName = "Vui lòng nhập họ tên";
        if (!phone) newFieldErrors.phone = "Vui lòng nhập số điện thoại";
        if (!email) newFieldErrors.email = "Vui lòng nhập email";
        if (!cccd) newFieldErrors.cccd = "Vui lòng nhập CCCD";
        if (!password) newFieldErrors.password = "Vui lòng nhập mật khẩu";
        if (!confirmPassword) newFieldErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";

        // If some are empty, we stop here or continue to more specific checks? 
        // Usually, it's better to show all specific errors.

        // AC03: Họ và tên
        const nameRegex = /^[\p{L}\s]+$/u;
        if (fullName && !nameRegex.test(fullName)) {
            newFieldErrors.fullName = "Họ và tên không hợp lệ";
        }

        // AC04: Số điện thoại
        const phoneRegex = /^\d{10}$/;
        if (phone && !phoneRegex.test(phone)) {
            newFieldErrors.phone = "Số điện thoại không hợp lệ";
        }

        // AC05: Email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email && !emailRegex.test(email)) {
            newFieldErrors.email = "Email không hợp lệ";
        }

        // AC06: CCCD
        const cccdRegex = /^\d{12}$/;
        if (cccd && !cccdRegex.test(cccd)) {
            newFieldErrors.cccd = "CCCD không hợp lệ";
        }

        // AC07: Mật khẩu
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
        if (password && !passwordRegex.test(password)) {
            newFieldErrors.password = "Mật khẩu không hợp lệ";
        }

        // AC08: Xác nhận mật khẩu
        if (password && confirmPassword && password !== confirmPassword) {
            newFieldErrors.confirmPassword = "Mật khẩu xác nhận không đúng";
        }

        if (Object.keys(newFieldErrors).length > 0) {
            setFieldErrors(newFieldErrors);
            return;
        }

        setLoading(true);
        try {
            const res = await apiAuth.post("/auth/register", {
                fullName,
                phone,
                email,
                cccd,
                password
            });

            if (res.data) {
                setSuccess("Đăng ký thành công");
                setTimeout(() => {
                    navigate("/login", {
                        state: {
                            message: "Đăng ký thành công. Vui lòng đăng nhập.",
                            accountIdentifier: email || phone // Pass the email or phone to pre-fill
                        }
                    });
                }, 1500);
            }
        } catch (err) {
            setError(handleApiError(err));
        } finally {
            setLoading(false);
        }
    };

    const getInputClass = (fieldName) => {
        const hasError = fieldErrors[fieldName];
        return `w-full bg-[#1C1C1E] border ${hasError ? 'border-red-500/50' : 'border-zinc-800/80'} rounded-xl pl-11 pr-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 ${hasError ? 'focus:ring-red-500/50 focus:border-red-500/50' : 'focus:ring-[#f97316]/50 focus:border-[#f97316]/50'} transition-all text-sm`;
    };

    const ErrorMessage = ({ message }) => {
        if (!message) return null;
        return <p className="text-red-500 text-[11px] mt-1 ml-1 font-medium">{message}</p>;
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#111111]">
            <header className="px-8 py-5 absolute top-0 left-0 z-50">
                <Link to="/login" className="flex items-center gap-2">
                    <Bike className="w-7 h-7 text-[#f97316]" strokeWidth={2.5} />
                    <span className="text-xl font-heading font-bold text-white tracking-tight">
                        MotorSafe
                    </span>
                </Link>
            </header>

            <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
                <div className="w-full max-w-6xl flex flex-col lg:flex-row shadow-2xl rounded-2xl overflow-hidden bg-[#18181A]">
                    {/* Left Pane - Gradient & Info */}
                    <div className="w-full lg:w-[45%] flex flex-col bg-gradient-to-br from-[#6b3a1a] via-[#3a1d0d] to-[#1a0d05] p-10 justify-between relative">
                        <div className="relative z-10">
                            <span className="inline-block px-3 py-1 rounded bg-[#f97316]/20 text-[#f97316] text-[11px] font-bold uppercase tracking-wider mb-6 border border-[#f97316]/30">
                                LUÔN ĐỒNG HÀNH CÙNG BẠN
                            </span>
                            <h2 className="text-4xl lg:text-5xl font-heading font-bold text-white leading-[1.1] mb-5 tracking-tight">
                                An tâm trên mọi<br />cung đường.
                            </h2>
                            <p className="text-zinc-300 text-[15px] leading-relaxed mb-8 max-w-sm">
                                Tham gia cùng hàng ngàn biker tin tưởng MotorSafe để được cứu hộ và sửa chữa khẩn cấp nhanh chóng.
                            </p>
                            <div className="flex items-center gap-3 mb-10">
                                <CheckCircle className="w-5 h-5 text-[#f97316]" />
                                <span className="text-[15px] text-zinc-200 font-medium">Trung tâm điều phối 24/7 Đà Nẵng.</span>
                            </div>
                        </div>

                        <div className="relative z-10 w-full rounded-xl overflow-hidden shadow-2xl border border-white/10 mt-4">
                            <img
                                src={motorcycleBg}
                                alt="Xe mô tô cứu hộ MotorSafe"
                                className="w-full h-48 object-cover opacity-90"
                            />
                        </div>
                    </div>

                    {/* Right Pane - Form */}
                    <div className="w-full lg:w-[55%] p-10 lg:p-14 flex flex-col justify-center">
                        <div className="max-w-md w-full mx-auto">
                            <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">
                                Tạo Tài Khoản
                            </h2>
                            <p className="text-zinc-400 text-[14px] mb-8">
                                Hoàn tất đăng ký chỉ trong chưa đầy 2 phút.
                            </p>

                            {error && (
                                <div className="mb-4 p-3 rounded bg-red-500/15 border border-red-500/50 text-red-500 text-sm">
                                    {error}
                                </div>
                            )}
                            {success && (
                                <div className="mb-4 p-3 rounded bg-green-500/15 border border-green-500/50 text-green-500 text-sm">
                                    {success}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-zinc-300 ml-1 mb-1.5">Họ và Tên</label>
                                        <div className="relative">
                                            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-zinc-500" />
                                            <input
                                                type="text"
                                                placeholder="Nhập họ tên"
                                                value={form.fullName}
                                                onChange={(e) => updateField("fullName", e.target.value)}
                                                className={getInputClass("fullName")}
                                            />
                                        </div>
                                        <ErrorMessage message={fieldErrors.fullName} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-zinc-300 ml-1 mb-1.5">Số Điện Thoại</label>
                                        <div className="relative">
                                            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-zinc-500" />
                                            <input
                                                type="tel"
                                                placeholder="Nhập số điện thoại"
                                                value={form.phone}
                                                onChange={(e) => updateField("phone", e.target.value)}
                                                className={getInputClass("phone")}
                                            />
                                        </div>
                                        <ErrorMessage message={fieldErrors.phone} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-zinc-300 ml-1 mb-1.5">Địa Chỉ Email</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-zinc-500" />
                                            <input
                                                type="email"
                                                placeholder="Nhập email"
                                                value={form.email}
                                                onChange={(e) => updateField("email", e.target.value)}
                                                className={getInputClass("email")}
                                            />
                                        </div>
                                        <ErrorMessage message={fieldErrors.email} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-zinc-300 ml-1 mb-1.5">CCCD</label>
                                        <div className="relative">
                                            <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-zinc-500" />
                                            <input
                                                type="text"
                                                placeholder="Nhập CCCD"
                                                value={form.cccd}
                                                onChange={(e) => updateField("cccd", e.target.value)}
                                                className={getInputClass("cccd")}
                                            />
                                        </div>
                                        <ErrorMessage message={fieldErrors.cccd} />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-zinc-300 ml-1 mb-1.5">Mật Khẩu</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-zinc-500" />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            value={form.password}
                                            onChange={(e) => updateField("password", e.target.value)}
                                            className={`${getInputClass("password")} !pr-12`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    <ErrorMessage message={fieldErrors.password} />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-zinc-300 ml-1 mb-1.5">Xác Nhận Mật Khẩu</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-zinc-500" />
                                        <input
                                            type={showConfirm ? "text" : "password"}
                                            placeholder="••••••••"
                                            value={form.confirmPassword}
                                            onChange={(e) => updateField("confirmPassword", e.target.value)}
                                            className={`${getInputClass("confirmPassword")} !pr-12`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirm(!showConfirm)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                                        >
                                            {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    <ErrorMessage message={fieldErrors.confirmPassword} />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 text-[15px] font-semibold rounded-xl h-12 bg-[#F97316] hover:bg-[#EA580C] text-white gap-2 mt-4 shadow-[0_4px_14px_0_rgba(249,115,22,0.39)] border-0"
                                >
                                    {loading ? "Đang xử lý..." : (
                                        <>Đăng Ký <ArrowRight className="w-[18px] h-[18px]" /></>
                                    )}
                                </Button>
                            </form>

                            <div className="flex items-center gap-4 my-7">
                                <div className="flex-1 h-[1px] bg-zinc-800" />
                                <span className="text-xs font-medium text-zinc-600">or</span>
                                <div className="flex-1 h-[1px] bg-zinc-800" />
                            </div>

                            <p className="text-center text-[13px] text-zinc-500 font-medium">
                                Đã có tài khoản?{" "}
                                <Link to="/login" className="text-[#f97316] font-semibold hover:text-[#EA580C] transition-colors">
                                    Đăng nhập tại đây
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Remove header / footer to match the clean mockup or keep footer subtle */}
            <footer className="w-full text-center pb-6">
                <p className="text-xs font-medium text-zinc-500/80">
                    © 2026 MotorSafe Rescue Services. Bảo lưu mọi quyền. Cứu hộ xe máy chuyên nghiệp 24/7.
                </p>
            </footer>
        </div>
    );
};

export default NewRegister;
