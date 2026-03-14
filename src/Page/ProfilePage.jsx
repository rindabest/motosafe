// src/Page/ProfilePage.jsx
import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import {
    User, Mail, Phone, Edit2, Save, X, LogOut,
    Calendar, MapPin,
    AlertTriangle, Clock, ChevronRight,
    Wrench, Bike, CreditCard
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { toast } from 'react-hot-toast';

// --- Reusable Editable Field Component ---
const EditableField = React.memo(({ label, name, value, onChange, type = "text" }) => (
    <div className="mb-4">
        <label className="block text-sm font-medium text-gray-500 mb-1">{label}</label>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            className="w-full bg-gray-50 text-gray-900 p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
        />
    </div>
));

const OrderHistoryCard = React.memo(({ order }) => {
    const statusStyles = {
        PENDING: "bg-amber-100 text-amber-700 border-amber-200",
        COMPLETED: "bg-green-100 text-green-700 border-green-200",
        CANCELLED: "bg-red-100 text-red-700 border-red-200",
        EXPIRED: "bg-gray-100 text-gray-700 border-gray-200",
    };

    const createdDate = new Date(order.created_at || order.updated_at || Date.now());
    const dateLabel = createdDate.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
    const timeLabel = createdDate.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
    });

    const status = (order.status || "PENDING").toUpperCase();
    const serviceType = (order.service_type || "General Service").replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());

    return (
        <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm hover:shadow-lg transition-all duration-200">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-red-600 font-bold text-lg">
                    <AlertTriangle className="w-5 h-5" />
                    <span>{order.problem || "Service Request"}</span>
                </div>
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border ${statusStyles[status] || statusStyles.PENDING}`}>
                    <Clock className="w-3.5 h-3.5" />
                    <span>{status === 'PENDING' ? 'Đang chờ' : status === 'COMPLETED' ? 'Hoàn tất' : status === 'CANCELLED' ? 'Đã hủy' : 'Hết hạn'}</span>
                </div>
            </div>

            {/* Vehicle + Service */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-3 border-t border-gray-100">
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center">
                        <Bike className="w-5 h-5 text-gray-500" />
                    </div>
                    <div>
                        <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Phương tiện</p>
                        <p className="text-base font-bold text-gray-900">Xe Máy</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center">
                        <Wrench className="w-5 h-5 text-gray-500" />
                    </div>
                    <div>
                        <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Loại dịch vụ</p>
                        <p className="text-base font-bold text-gray-900">{serviceType}</p>
                    </div>
                </div>
            </div>

            {/* Location */}
            <div className="py-3 border-t border-gray-100 flex items-start gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-red-500" />
                </div>
                <div className="flex-1">
                    <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Vị trí</p>
                    <p className="text-sm text-gray-700 leading-relaxed">{order.location || "Chưa xác định"}</p>
                </div>
            </div>

            {/* Created On */}
            <div className="py-3 border-t border-gray-100 flex items-center gap-3 text-sm text-gray-700">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-gray-500 font-semibold">Ngày tạo</span>
                <span className="font-bold text-gray-900">{dateLabel}</span>
                <span className="text-gray-300">|</span>
                <span className="font-semibold text-gray-800">{timeLabel}</span>
            </div>

            {/* Actions */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-red-200 transition-all flex items-center justify-center gap-2">
                    Xem chi tiết <ChevronRight size={16} />
                </button>
                {status === 'PENDING' && (
                    <button className="w-full py-3 bg-white text-gray-800 border border-gray-200 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all">
                        Hủy yêu cầu
                    </button>
                )}
            </div>
        </div>
    );
});

// --- Skeleton Loader ---
const ProfileSkeleton = () => (
    <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-5xl mx-auto px-4 py-8 pt-24">
            <div className="animate-pulse space-y-8">
                {/* Profile Card Skeleton */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-8">
                    <div className="w-28 h-28 bg-gray-200 rounded-full"></div>
                    <div className="flex-1 space-y-4 w-full">
                        <div className="h-8 bg-gray-200 rounded-lg w-1/3 mx-auto md:mx-0"></div>
                        <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto md:mx-0"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto md:mx-0"></div>
                        </div>
                        <div className="flex gap-3 justify-center md:justify-start pt-2">
                            <div className="h-10 bg-gray-200 rounded-xl w-24"></div>
                            <div className="h-10 bg-gray-200 rounded-xl w-24"></div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8">
                    {/* History Skeleton */}
                    <div className="space-y-4">
                        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                        <div className="h-40 bg-gray-200 rounded-2xl"></div>
                        <div className="h-40 bg-gray-200 rounded-2xl"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedUser, setEditedUser] = useState(null);
    const [orderHistory, setOrderHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userResponse = await api.get('/profile/me');
                setUser(userResponse.data);
                setEditedUser(userResponse.data);
                return userResponse.data;
            } catch (error) {
                console.error("Failed to fetch user data", error);
                return null;
            }
        };

        const fetchOrderHistory = async () => {
            try {
                const historyResponse = await api.get('/bookings/history');
                const data = historyResponse.data;
                setOrderHistory(data || []);
            } catch (error) {
                console.error("Failed to fetch order history", error);
            }
        };

        const fetchData = async () => {
            setLoading(true);
            await fetchUserData();
            await fetchOrderHistory();
            setLoading(false);
        };

        fetchData();
    }, []);


    // User editing handlers
    const handleEdit = useCallback(() => {
        setEditedUser(user);
        setIsEditing(true);
    }, [user]);

    const handleSave = useCallback(async () => {
        if (!editedUser.full_name?.trim() || !editedUser.email?.trim()) {
            toast.error('Vui lòng điền họ tên và email');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(editedUser.email)) {
            toast.error('Vui lòng nhập địa chỉ email hợp lệ');
            return;
        }

        try {
            // Placeholder: Replace with actual EditUserProfile endpoint if implemented later
            // const response = await api.post('/Profile/EditUserProfile/', editedUser);
            // setUser(response.data);
            setIsEditing(false);
            toast.success('Chức năng cập nhật hồ sơ đang được hoàn thiện');
        } catch (error) {
            console.error("Failed to save user data", error);
        }

    }, [editedUser]);

    const handleCancel = useCallback(() => {
        setIsEditing(false);
        setEditedUser(user);
    }, [user]);

    const handleUserChange = useCallback((e) => {
        const { name, value } = e.target;
        setEditedUser(prev => ({ ...prev, [name]: value }));
    }, []);

    const handleLogout = () => {
        navigate("/logout");
    };

    if (loading || !user) {
        return <ProfileSkeleton />;
    }

    return (
        <div className="min-h-screen bg-gray-50 text-gray-700">
            <Navbar />

            <div className="max-w-4xl mx-auto px-4 py-8 pt-24">

                {/* --- User Information Card --- */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-8 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                        <div className="relative group">
                            {user.profile_pic ? (
                                <img src={user.profile_pic} alt="Ảnh đại diện" className="w-28 h-28 rounded-full object-cover border-4 border-gray-50 shadow-md" />
                            ) : (
                                <div className="w-28 h-28 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 border-4 border-white shadow-md">
                                    <User size={48} />
                                </div>
                            )}
                        </div>

                        <div className="flex-grow text-center md:text-left w-full">
                            {isEditing ? (
                                <div className="grid md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-2 text-left w-full">
                                    <EditableField
                                        label="Họ tên"
                                        name="full_name"
                                        value={editedUser.full_name || ""}
                                        onChange={handleUserChange}
                                    />
                                    <EditableField
                                        label="Email"
                                        name="email"
                                        value={editedUser.email || ""}
                                        onChange={handleUserChange}
                                        type="email"
                                    />
                                    <EditableField
                                        label="Số điện thoại"
                                        name="mobile_number"
                                        value={editedUser.mobile_number || ""}
                                        onChange={handleUserChange}
                                        type="tel"
                                    />
                                    <EditableField
                                        label="CCCD"
                                        name="cccd"
                                        value={editedUser.cccd || ""}
                                        onChange={handleUserChange}
                                    />
                                </div>
                            ) : (
                                <div className="space-y-2 w-full">
                                    <h2 className="text-3xl font-bold text-gray-900">{user.full_name || `${user.first_name || ''} ${user.last_name || ''}`}</h2>
                                    <div className="flex flex-col md:flex-row gap-4 text-gray-500 items-center md:items-start justify-center md:justify-start flex-wrap mt-2">
                                        <p className="flex items-center gap-2">
                                            <Mail size={16} />{user.email || "Chưa cập nhật email"}
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <Phone size={16} />{user.mobile_number}
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <CreditCard size={16} />{user.cccd || "Chưa cập nhật CCCD"}
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-3 mt-6 justify-center md:justify-start">
                                {isEditing ? (
                                    <>
                                        <button
                                            onClick={handleSave}
                                            className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg shadow-blue-200"
                                        >
                                            <Save size={18} /> Lưu thay đổi
                                        </button>
                                        <button
                                            onClick={handleCancel}
                                            className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors flex items-center gap-2"
                                        >
                                            <X size={18} /> Hủy
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        {/* Hide edit for now since fake API */}
                                        <button
                                            onClick={handleLogout}
                                            className="px-6 py-2.5 bg-red-50 text-red-600 rounded-xl font-medium hover:bg-red-100 transition-colors flex items-center gap-2"
                                        >
                                            <LogOut size={18} /> Đăng xuất
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8">
                    {/* --- Order History Card --- */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center px-1">
                            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <Clock className="text-orange-600" /> Lịch sử yêu cầu dịch vụ
                            </h3>
                        </div>
                        <div className="space-y-4">
                            {orderHistory.length > 0 ? (
                                orderHistory.map(order => (
                                    <OrderHistoryCard key={order.id} order={order} />
                                ))
                            ) : (
                                <div className="bg-white rounded-2xl p-8 text-center border border-dashed border-gray-300 shadow-sm">
                                    <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-500 font-medium">Bạn chưa có lịch sử yêu cầu nào.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
