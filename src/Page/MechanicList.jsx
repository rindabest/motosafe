import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Search, Filter, MapPin, Phone, Clock,
    CheckCircle, XCircle, Edit, Eye, Trash2, Plus
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const MechanicList = () => {
    const [mechanics, setMechanics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);
    const [filters, setFilters] = useState({
        verified: '',
        status: ''
    });
    const API_BASE_URL = '/api/ms-mechanics';

    const fetchMechanics = async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams();
            if (filters.verified) queryParams.append('verified', filters.verified);
            if (filters.status) queryParams.append('status', filters.status);

            const response = await fetch(`${API_BASE_URL}?${queryParams.toString()}`);
            const data = await response.json();

            if (data.success) {
                setMechanics(data.mechanics);
            } else {
                toast.error('Không thể tải danh sách thợ');
            }
        } catch (error) {
            console.error('Error fetching mechanics:', error);
            toast.error('Lỗi mạng');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMechanics();
    }, [filters]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDeleteMechanic = async (mechanic) => {
        if (!mechanic?.id) return;

        const confirmDelete = window.confirm(
            `Xóa thợ "${mechanic.shop_name || mechanic.full_name || 'Không xác định'}"? Hành động này không thể hoàn tác.`
        );
        if (!confirmDelete) return;

        setDeletingId(mechanic.id);
        try {
            let response = await fetch(`${API_BASE_URL}/${mechanic.id}`, {
                method: 'DELETE'
            });

            // Fallback alias supported by backend
            if (!response.ok) {
                response = await fetch(`${API_BASE_URL}/${mechanic.id}/deleted`, {
                    method: 'DELETE'
                });
            }

            if (!response.ok) {
                throw new Error('Failed to delete mechanic');
            }

            setMechanics(prev => prev.filter(item => item.id !== mechanic.id));
            toast.success('Xóa thợ thành công');
        } catch (error) {
            console.error('Error deleting mechanic:', error);
            toast.error('Không thể xóa thợ');
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Danh mục Thợ sửa xe</h1>
                        <p className="text-gray-500 mt-1">Quản lý và xem tất cả thợ đã đăng ký</p>
                    </div>
                    <Link
                        to="/ms"
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
                    >
                        <Plus size={18} /> Đăng ký mới
                    </Link>
                </div>

                {/* Filters */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-wrap gap-4 items-center">
                    <div className="flex items-center gap-2 text-gray-500">
                        <Filter size={18} />
                        <span className="font-medium text-sm">Bộ lọc:</span>
                    </div>

                    <select
                        name="verified"
                        value={filters.verified}
                        onChange={handleFilterChange}
                        className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 outline-none"
                    >
                        <option value="">Tất cả trạng thái xác minh</option>
                        <option value="true">Đã xác minh</option>
                        <option value="false">Chưa xác minh</option>
                    </select>

                    <select
                        name="status"
                        value={filters.status}
                        onChange={handleFilterChange}
                        className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 outline-none"
                    >
                        <option value="">Tất cả trạng thái trực tuyến</option>
                        <option value="ONLINE">Trực tuyến</option>
                        <option value="OFFLINE">Ngoại tuyến</option>
                    </select>
                </div>

                {/* List */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center text-gray-500">Đang tải danh sách thợ...</div>
                    ) : mechanics.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                                <Search size={24} className="text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">Không tìm thấy thợ nào</h3>
                            <p className="text-gray-500 mt-1">Hãy thử điều chỉnh bộ lọc hoặc thêm thợ mới.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-gray-600">
                                <thead className="bg-gray-50 text-xs uppercase font-semibold text-gray-500">
                                    <tr>
                                        <th className="px-6 py-4">Thợ / Cửa hàng</th>
                                        <th className="px-6 py-4">Trạng thái</th>
                                        <th className="px-6 py-4">Xác minh</th>
                                        <th className="px-6 py-4">Vị trí</th>
                                        <th className="px-6 py-4 text-right">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {mechanics.map((mechanic) => (
                                        <tr key={mechanic.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                                                        {mechanic.profile_photo ? (
                                                            <img src={mechanic.profile_photo} alt="" className="h-full w-full object-cover" />
                                                        ) : (
                                                            <div className="h-full w-full flex items-center justify-center text-gray-400 font-bold text-xs">IMG</div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-gray-900">{mechanic.shop_name || 'Generic Shop'}</div>
                                                        <div className="text-xs text-gray-500">{mechanic.full_name || 'No Name'}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border
                                                    ${mechanic.status === 'ONLINE'
                                                        ? 'bg-green-50 text-green-700 border-green-200'
                                                        : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${mechanic.status === 'ONLINE' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                                                    {mechanic.status === 'ONLINE' ? 'TRỰC TUYẾN' : 'NGOẠI TUYẾN'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {mechanic.is_verified ? (
                                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium text-blue-700 bg-blue-50 border border-blue-100">
                                                        <CheckCircle size={12} /> Đã xác minh
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium text-orange-700 bg-orange-50 border border-orange-100">
                                                        <XCircle size={12} /> Đang chờ
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1.5 text-gray-500" title={mechanic.shop_address}>
                                                    <MapPin size={14} className="flex-shrink-0" />
                                                    <span className="truncate max-w-[150px]">{mechanic.shop_address || 'No Address'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        to={`/ms/view/${mechanic.id}`}
                                                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Xem chi tiết"
                                                    >
                                                        <Eye size={18} />
                                                    </Link>
                                                    <Link
                                                        to={`/ms/edit/${mechanic.id}`}
                                                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                        title="Chỉnh sửa thợ"
                                                    >
                                                        <Edit size={18} />
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteMechanic(mechanic)}
                                                        disabled={deletingId === mechanic.id}
                                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                        title="Xóa thợ"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MechanicList;
