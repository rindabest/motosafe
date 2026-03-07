import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    Car, User, Shield, Calendar, MapPin,
    FileText, ArrowLeft, RefreshCw, AlertCircle,
    CheckCircle, Briefcase, Info, Hash, Palette,
    Activity, HardDrive, Weight, Users, Clock, Settings
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../utils/apiVercel';
import Navbar from '../../components/Navbar';
import { toast } from 'react-hot-toast';

const VehicleDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [vehicle, setVehicle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchVehicleDetails = async () => {
        setLoading(true);
        setError(null);
        console.log(`[VehicleDetails] Attempting to fetch details for identifier/ID: ${id}`);

        try {
            // First try fetching by ID as provided in URL
            const response = await api.get(`/vehicle/saved/${id}`);

            console.log(`[VehicleDetails] Response received:`, response.data);

            if (response.data.success) {
                // Merge data from both top level and nested 'data' key to be consistent
                const combinedData = {
                    ...(response.data.data || {}),
                    ...response.data
                };
                setVehicle(combinedData);
            } else {
                setError(response.data.message || 'Không tìm thấy bản ghi xe trong cơ sở dữ liệu');
            }
        } catch (err) {
            console.error('[VehicleDetails] Fetch Error:', err);

            if (err.response) {
                // Server responded with a status code outside the 2xx range
                setError(`Server Error (${err.response.status}): ${err.response.data?.message || err.message}`);
            } else if (err.request) {
                // Request was made but no response was received
                setError('No response from server. Please check if the backend is running on port 3000.');
            } else {
                setError('Lỗi mạng. Kiểm tra kết nối của bạn.');
            }

            toast.error('Không thể tải chi tiết xe');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchVehicleDetails();
    }, [id]);

    const DetailCard = ({ icon: Icon, label, value, color = "blue" }) => {
        const themes = {
            blue: "bg-blue-50 text-blue-600 border-blue-100",
            green: "bg-green-50 text-green-600 border-green-100",
            amber: "bg-amber-50 text-amber-600 border-amber-100",
            purple: "bg-purple-50 text-purple-600 border-purple-100",
            rose: "bg-rose-50 text-rose-600 border-rose-100",
            indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
            slate: "bg-slate-50 text-slate-600 border-slate-100"
        };

        return (
            <div className={`p-4 rounded-3xl border ${themes[color] || themes.blue} flex items-center gap-4 transition-all hover:shadow-lg hover:shadow-${color}-100/50`}>
                <div className={`p-2 rounded-xl bg-white shadow-sm`}>
                    <Icon size={20} />
                </div>
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-0.5">{label}</p>
                    <p className="text-sm font-black tracking-tight">{value || 'N/A'}</p>
                </div>
            </div>
        );
    };

    const SectionHeader = ({ icon: Icon, title }) => (
        <div className="flex items-center gap-3 mb-6 px-1">
            <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-white">
                <Icon size={20} />
            </div>
            <h3 className="text-xl font-black text-gray-900 tracking-tight uppercase">{title}</h3>
        </div>
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <RefreshCw className="animate-spin text-blue-600 mx-auto mb-4" size={48} />
                    <p className="font-black text-gray-900 tracking-widest uppercase">Đang tải hồ sơ...</p>
                </div>
            </div>
        );
    }

    if (error || !vehicle) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <AlertCircle className="text-red-500 mb-4" size={64} />
                <h2 className="text-2xl font-black text-gray-900 mb-2">Yêu cầu thất bại</h2>
                <p className="text-gray-500 mb-8 max-w-md text-center">{error || 'Không tìm thấy bản ghi xe'}</p>
                <div className="flex gap-4">
                    <button
                        onClick={() => navigate('/dashboard/vehicles')}
                        className="flex items-center gap-2 bg-white border border-gray-200 text-gray-900 px-8 py-4 rounded-2xl font-bold hover:bg-gray-100 transition-all"
                    >
                        <ArrowLeft size={20} /> Bảng điều khiển
                    </button>
                    <button
                        onClick={fetchVehicleDetails}
                        className="flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all"
                    >
                        <RefreshCw size={20} /> Thử lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white pb-20">
            <Navbar />

            {/* Hero Section */}
            <div className="relative pt-24 pb-12 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-gray-50 to-white -z-10" />

                <div className="max-w-7xl mx-auto px-4">
                    <button
                        onClick={() => navigate('/dashboard/vehicles')}
                        className="mb-8 flex items-center gap-2 text-gray-400 hover:text-gray-900 font-bold transition-colors"
                    >
                        <ArrowLeft size={18} /> QUAY LẠI BẢNG ĐIỀU KHIỂN
                    </button>

                    <div className="flex flex-col lg:flex-row gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="w-full lg:w-1/2"
                        >
                            <div className="relative">
                                <div className="absolute -inset-4 bg-blue-600/5 rounded-[3rem] blur-3xl" />
                                <div className="relative bg-white rounded-[3rem] border border-gray-100 shadow-2xl p-4">
                                    <div className="aspect-[16/10] rounded-[2rem] bg-gray-50 flex items-center justify-center overflow-hidden">
                                        {vehicle.vehicle_image ? (
                                            <img
                                                src={vehicle.vehicle_image}
                                                alt={vehicle.brand_model}
                                                className="w-full h-full object-contain p-8 hover:scale-110 transition-transform duration-700"
                                            />
                                        ) : (
                                            <Car size={120} className="text-gray-200" />
                                        )}
                                    </div>
                                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-md px-6 py-2 rounded-full border border-white shadow-xl flex items-center gap-2">
                                        <div className={`w-3 h-3 rounded-full ${vehicle.rc_status === 'ACTIVE' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                                        <span className="text-xs font-black tracking-widest text-gray-900 uppercase">TRẠNG THÁI RC: {vehicle.rc_status === 'ACTIVE' ? 'HOẠT ĐỘNG' : vehicle.rc_status || 'CHƯA RÕ'}</span>
                                        {vehicle.is_insurance_expired && (
                                            <>
                                                <div className="w-[1px] h-4 bg-gray-200" />
                                                <span className="text-[10px] font-black tracking-widest text-red-600 uppercase">BẢO HIỂM HẾT HẠN</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="w-full lg:w-1/2 space-y-4"
                        >
                            <div className="flex flex-wrap gap-2">
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full text-xs font-black tracking-widest uppercase">
                                    <Shield size={14} /> Bản ghi cơ sở dữ liệu đã xác minh
                                </div>
                                {vehicle.is_insurance_expired && (
                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-full text-xs font-black tracking-widest uppercase">
                                        <AlertCircle size={14} /> Bảo hiểm hết hạn
                                    </div>
                                )}
                            </div>
                            <h1 className="text-5xl lg:text-7xl font-black text-gray-900 leading-none tracking-tight">
                                {vehicle.license_plate || vehicle.vehicleId}
                            </h1>
                            <div className="space-y-1">
                                <p className="text-2xl font-bold text-blue-600">{vehicle.brand_model}</p>
                                <p className="text-lg font-medium text-gray-400">{vehicle.brand_name}</p>
                            </div>

                            <div className="flex flex-wrap gap-3 pt-6">
                                <div className="px-5 py-3 bg-gray-100 rounded-2xl font-black text-gray-900 text-sm">
                                    Loại nhiên liệu: {vehicle.fuel_type}
                                </div>
                                <div className="px-5 py-3 bg-gray-100 rounded-2xl font-black text-gray-900 text-sm">
                                    Phân loại: {vehicle.class}
                                </div>
                                <div className="px-5 py-3 bg-gray-100 rounded-2xl font-black text-gray-900 text-sm">
                                    Tiêu chuẩn: {vehicle.norms || 'BS-VI'}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-7xl mx-auto px-4 mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* Left & Middle: Detailed Stats */}
                    <div className="lg:col-span-2 space-y-16">

                        {/* Legal & Ownership */}
                        <section>
                            <SectionHeader icon={User} title="Chi tiết sở hữu" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <DetailCard icon={User} label="Chủ sở hữu đã đăng ký" value={vehicle.owner_name} color="indigo" />
                                <DetailCard icon={Users} label="Tên cha" value={vehicle.father_name} color="indigo" />
                                <DetailCard icon={Activity} label="Số đời chủ" value={vehicle.owner_count} color="indigo" />
                                <DetailCard icon={Calendar} label="Ngày đăng ký" value={vehicle.registration_date} color="indigo" />
                            </div>
                        </section>

                        {/* Insurance & Compliance */}
                        <section>
                            <SectionHeader icon={Shield} title="Tuân thủ & Bảo hiểm" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <DetailCard icon={Shield} label="Công ty bảo hiểm" value={vehicle.insurance_company} color="green" />
                                <DetailCard
                                    icon={vehicle.is_insurance_expired ? AlertCircle : Shield}
                                    label="Trạng thái bảo hiểm"
                                    value={vehicle.is_insurance_expired ? 'HẾT HẠN' : 'HOẠT ĐỘNG'}
                                    color={vehicle.is_insurance_expired ? "rose" : "green"}
                                />
                                <DetailCard icon={Clock} label="Hạn bảo hiểm" value={vehicle.insurance_expiry} color="green" />
                                <DetailCard icon={FileText} label="Số đơn bảo hiểm" value={vehicle.insurance_policy} color="green" />
                                <DetailCard icon={Calendar} label="Thuế nộp đến" value={vehicle.tax_upto} color="amber" />
                                <DetailCard icon={Activity} label="Số PUCC" value={vehicle.pucc_number} color="purple" />
                                <DetailCard icon={Clock} label="PUCC có hiệu lực đến" value={vehicle.pucc_upto} color="purple" />
                            </div>
                        </section>

                        {/* Technical Specifications */}
                        <section>
                            <SectionHeader icon={Settings} title="Hồ sơ kỹ thuật" />
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <DetailCard icon={Hash} label="Số máy" value={vehicle.engine_number} color="slate" />
                                <DetailCard icon={Hash} label="Số khung" value={vehicle.chassis_number} color="slate" />
                                <DetailCard icon={HardDrive} label="Dung tích" value={`${vehicle.cubic_capacity} CC`} color="slate" />
                                <DetailCard icon={Palette} label="Màu sắc" value={vehicle.color} color="slate" />
                                <DetailCard icon={Users} label="Số chỗ ngồi" value={vehicle.seating_capacity} color="slate" />
                                <DetailCard icon={Clock} label="Tuổi thọ xe" value={vehicle.vehicle_age} color="slate" />
                                <DetailCard icon={Briefcase} label="Đã vay vốn" value={vehicle.is_financed === "1" ? "CÓ" : "KHÔNG"} color="rose" />
                                <DetailCard icon={Briefcase} label="Bên cấp vốn" value={vehicle.financer} color="rose" />
                            </div>
                        </section>

                        {/* Addresses */}
                        <section>
                            <SectionHeader icon={MapPin} title="Địa chỉ đã đăng ký" />
                            <div className="space-y-4">
                                <div className="p-6 bg-gray-50 rounded-[2rem] border border-gray-200">
                                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-3">Địa chỉ hiện tại</p>
                                    <p className="text-gray-900 font-bold leading-relaxed">{vehicle.present_address}</p>
                                </div>
                                <div className="p-6 bg-gray-50 rounded-[2rem] border border-gray-200">
                                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-3">Địa chỉ thường trú</p>
                                    <p className="text-gray-900 font-bold leading-relaxed">{vehicle.permanent_address}</p>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Right: Sidebar Metadata */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-28 space-y-6">
                            <div className="bg-gray-900 text-white rounded-[3rem] p-10">
                                <SectionHeader icon={Info} title="Siêu dữ liệu báo cáo" />
                                <div className="space-y-8 mt-4">
                                    <div>
                                        <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">ID NGUỒN</p>
                                        <p className="text-white font-mono font-bold">{vehicle.db_id || vehicle.id}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">ĐỒNG BỘ LẦN CUỐI</p>
                                        <p className="text-white font-bold">{vehicle.last_synced_at ? new Date(vehicle.last_synced_at).toLocaleString() : 'Vừa xong'}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">NGUỒN DỮ LIỆU</p>
                                        <p className="inline-block px-3 py-1 bg-blue-600 text-white rounded-lg text-xs font-black uppercase">{vehicle.source}</p>
                                    </div>
                                    <hr className="border-gray-800" />
                                    <div className="pt-4 flex items-center justify-between">
                                        <p className="text-sm font-bold opacity-60">Trạng thái</p>
                                        <span className="flex items-center gap-2 text-green-400 text-sm font-black uppercase tracking-widest">
                                            <CheckCircle size={16} /> Đã mã hóa
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 bg-blue-50 rounded-[3rem] border-2 border-blue-100 flex items-center gap-6">
                                <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-blue-600">
                                    <Shield size={32} />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-black text-gray-900 uppercase text-sm">Cổng bảo mật</h4>
                                    <p className="text-xs text-blue-600/60 font-medium">Tài liệu này là bản đại diện kỹ thuật số của dữ liệu chính phủ đã được xác minh.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default VehicleDetails;
