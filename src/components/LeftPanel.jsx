import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, UserCircle } from 'lucide-react';
import api from '../utils/api';

export default function LeftPanel({ activeJob }) {
    const navigate = useNavigate();
    const [orderHistory, setOrderHistory] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchOrderHistory = async () => {
            try {
                const historyResponse = await api.get('/bookings/history');
                const recentOrders = historyResponse.data.slice(0, 5);
                setOrderHistory(recentOrders);
            } catch (error) {
                console.error("Failed to fetch order history", error);
            }
        };

        const fetchUserData = async () => {
            try {
                const userResponse = await api.get('/profile/me');
                setUser(userResponse.data);
                if (userResponse.data.mobile_number === null) {
                    navigate('/form');
                }
            } catch (error) {
                console.error("Failed to fetch user data", error);
            }
        };

        fetchOrderHistory();
        fetchUserData();
    }, [navigate]);

    const handleGoToActiveJob = () => {
        if (activeJob && activeJob.request_id) {
            navigate(`/mechanic-found/${activeJob.request_id}`);
        }
    };



    return (
        <aside className="
      w-full bg-gray-100 border-5 border-gray-500/10 rounded-3xl shadow-[3px_3px_6px_#FFFFFF,-3px_-3px_6px_#d9d9d9] p-4 flex flex-col items-center justify-start space-y-4
      md:static md:h-auto md:w-80  pb-20 md:pb-20 lg:pb-3 -px-4 -mb-6
      fixed pb-8 bottom-0 left-1/2 -translate-x-1/2 z-50
      md:translate-x-0 md:bottom-auto">

            {/* User Info */}
            <div className="flex items-center w-full gap-3 p-2 bg-gray-200 rounded-xl shadow-[inset_2px_2px_5px_#BABECC,inset_-5px_-5px_10px_#FFFFFF]">
                {user?.profile_pic ? (
                    <img src={user.profile_pic} alt="User Avatar" className="w-10 h-10 rounded-full" />
                ) : (
                    <UserCircle className="w-10 h-10 text-gray-500" />
                )}
                <div className="flex-1">
                    <p className="font-bold text-gray-800">{user?.first_name} {user?.last_name}</p>
                    <p className="text-xs text-gray-500">Tài khoản</p>
                </div>
                <button
                    onClick={() => navigate("/profile")}
                    className="p-2 bg-gray-300 rounded-full shadow-[3px_3px_6px_#BABECC,-3px_-3px_6px_#FFFFFF] hover:shadow-[inset_1px_1px_2px_#BABECC,inset_-1px_-1px_2px_#FFFFFF] transition">
                    <ArrowRight size={16} className="text-gray-600" />
                </button>
            </div>

            {/* Conditional Button: Active Job or Request Now */}
            {activeJob ? (
                <button
                    className="w-full bg-green-500 text-white py-3 px-4 rounded-xl shadow-[3px_3px_6px_#BABECC,-3px_-3px_6px_#FFFFFF] font-semibold hover:shadow-[inset_1px_1px_2px_#BABECC,inset_-1px_-1px_2px_#FFFFFF] transition flex items-center justify-between"
                    onClick={handleGoToActiveJob}
                >
                    <span>Đang thực hiện</span>
                    <ArrowRight size={20} />
                </button>
            ) : (
                <button
                    className="w-full bg-blue-500 text-white py-3 rounded-xl shadow-[3px_3px_6px_#BABECC,-3px_-3px_6px_#FFFFFF] font-semibold hover:shadow-[inset_1px_1px_2px_#BABECC,inset_-1px_-1px_2px_#FFFFFF] transition"
                    onClick={() => navigate("/request")}
                >
                    Yêu cầu ngay
                </button>
            )}

            {/* Past Order Card */}
            <div className="hidden md:flex w-full bg-gray-100/30 rounded-2xl  flex-col p-4 text-gray-600 text-sm">
                <h3 className="font-bold text-xl mb-3 text-gray-800">Đơn hàng gần đây</h3>
                <div className="overflow-auto max-h-[180px] space-y-3 px-3 py-1">
                    {orderHistory.length > 0 ? (
                        orderHistory.map(order => (
                            <div key={order.id} className="p-3 bg-gray-200 rounded-xl shadow-[3px_3px_6px_#BABECC,-3px_-3px_6px_#FFFFFF]">
                                <p className="font-semibold text-gray-700">{order.problem}</p>
                                <p className="text-xs text-gray-500">
                                    {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A'}
                                </p>
                            </div>
                        ))
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-gray-500">Không có đơn hàng nào</p>
                        </div>
                    )}
                </div>
            </div>


        </aside>
    );
}
