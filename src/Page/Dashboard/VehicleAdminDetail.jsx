import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  Car,
  CheckCircle,
  Loader2,
  Pencil,
  Trash2,
} from "lucide-react";
import Navbar from "../../components/Navbar";
import api from "../../utils/apiVercel";
import { toast } from "react-hot-toast";

/* ---------------------------------- Utils --------------------------------- */

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString();
};

const detailFields = [
  { key: "vehicle_id", label: "ID Phương tiện" },
  { key: "license_plate", label: "Biển số xe" },
  { key: "chassis_number", label: "Số khung" },
  { key: "engine_number", label: "Số máy" },
  { key: "brand_name", label: "Thương hiệu" },
  { key: "brand_model", label: "Mấu xe" },
  { key: "fuel_type", label: "Nhiên liệu" },
  { key: "color", label: "Màu sắc" },
  { key: "class", label: "Phân loại" },
  { key: "norms", label: "Tiêu chuẩn khí thải" },
  { key: "seating_capacity", label: "Số chỗ ngồi" },
  { key: "cubic_capacity", label: "Dung tích" },
  { key: "owner_name", label: "Tên chủ xe" },
  { key: "father_name", label: "Cha / Người giám hộ" },
  { key: "present_address", label: "Địa chỉ hiện tại" },
  { key: "permanent_address", label: "Địa chỉ thường trú" },
  { key: "registration_date", label: "Ngày đăng ký", format: formatDate },
  { key: "rc_status", label: "Trạng thái RC" },
  { key: "insurance_company", label: "Công ty bảo hiểm" },
  { key: "insurance_policy", label: "Số đơn bảo hiểm" },
  { key: "insurance_expiry", label: "Hạn bảo hiểm", format: formatDate },
  { key: "permit_type", label: "Loại giấy phép" },
  { key: "permit_number", label: "Số giấy phép" },
  { key: "permit_valid_from", label: "Giấy phép từ ngày", format: formatDate },
  { key: "permit_valid_upto", label: "Giấy phép đến ngày", format: formatDate },
  { key: "pucc_number", label: "Số đăng kiểm" },
  { key: "pucc_upto", label: "Đăng kiểm đến ngày", format: formatDate },
  { key: "tax_upto", label: "Thuế đến ngày" },
  { key: "vehicle_category", label: "Danh mục xe" },
];

const editableKeys = detailFields.map((f) => f.key);

/* ------------------------------ Main Component ----------------------------- */

const VehicleAdminDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [vehicle, setVehicle] = useState(null);
  const [rawData, setRawData] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showRaw, setShowRaw] = useState(false);

  /* ------------------------------ Fetch Logic ------------------------------ */

  const hydrate = async () => {
    if (!id) return;
    setLoading(true);

    try {
      const res = await api.get(`/vehicle/saved/${id}`);
      if (!res.data?.success) {
        toast.error("Không tìm thấy xe");
        return;
      }

      const merged = { ...res.data.data };
      setVehicle(merged);

      // extract raw
      const rr = merged?.raw_response;
      setRawData(rr?.raw_response ?? rr ?? null);

      // populate edit form
      const formInit = {};
      editableKeys.forEach((key) => {
        formInit[key] = merged?.[key] ?? "";
      });
      setEditForm(formInit);
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải hồ sơ xe");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    hydrate();
  }, [id]);

  /* ------------------------------ Handlers -------------------------------- */

  const handleUpdate = async () => {
    setSaving(true);
    try {
      const payload = Object.fromEntries(
        Object.entries(editForm).filter(([_, v]) => v !== "")
      );
      await api.patch(`/vehicle/saved/${id}`, payload);
      toast.success("Đã cập nhật xe");
      await hydrate();
    } catch (err) {
      toast.error("Cập nhật thất bại");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Xóa vĩnh viễn xe này?")) return;

    setDeleting(true);
    try {
      await api.delete(`/vehicle/saved/${id}`);
      toast.success("Đã xóa xe");
      navigate("/admin/vehicles");
    } catch {
      toast.error("Xóa thất bại");
    } finally {
      setDeleting(false);
    }
  };

  /* ------------------------------ Loading UI ------------------------------ */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  if (!vehicle) return null;

  /* ---------------------------------- UI ---------------------------------- */

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 pt-24 pb-20 space-y-8">
        {/* Back */}
        <button
          onClick={() => navigate("/admin/vehicles")}
          className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 font-semibold"
        >
          <ArrowLeft size={16} /> Quay lại
        </button>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          {/* Image Header */}
          <div className="relative h-56 bg-slate-900">
            {vehicle.vehicle_image ? (
              <img
                src={vehicle.vehicle_image}
                alt="Vehicle"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700">
                <Car size={90} className="text-white/20" />
              </div>
            )}

            <div className="absolute top-4 right-4 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-white/10 backdrop-blur text-white">
              {vehicle.rc_status === 'ACTIVE' ? 'HOẠT ĐỘNG' : vehicle.rc_status || "TRẠNG THÁI"}
            </div>
          </div>

          <div className="p-8 space-y-8">
            {/* Title */}
            <div>
              <h1 className="text-3xl font-black uppercase text-slate-900">
                {vehicle.license_plate}
              </h1>
              <p className="text-slate-500 font-medium">
                {vehicle.brand_model || vehicle.brand_name || "—"}
              </p>
            </div>

            {/* Status Badges */}
            <div className="flex flex-wrap gap-3">
              <div
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase ${vehicle.is_insurance_expired
                  ? "bg-red-50 text-red-700"
                  : "bg-emerald-50 text-emerald-700"
                  }`}
              >
                {vehicle.is_insurance_expired ? (
                  <AlertCircle size={14} />
                ) : (
                  <CheckCircle size={14} />
                )}
                {vehicle.is_insurance_expired
                  ? "Bảo hiểm Hết hạn"
                  : "Bảo hiểm Hoạt động"}
              </div>

              <div className="px-4 py-2 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase">
                ID {vehicle.id}
              </div>
            </div>

            {/* Detail Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {detailFields.map((field) => {
                const value = vehicle?.[field.key];
                if (!value) return null;
                return (
                  <div
                    key={field.key}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-100"
                  >
                    <p className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-1">
                      {field.label}
                    </p>
                    <p className="font-semibold text-slate-900 break-words">
                      {field.format ? field.format(value) : value}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Editor */}
            <div>
              <h3 className="text-sm font-bold uppercase text-slate-500 mb-4">
                Chỉnh sửa xe
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {editableKeys.map((key) => (
                  <input
                    key={key}
                    value={editForm[key] || ""}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        [key]: e.target.value,
                      }))
                    }
                    placeholder={key.replace(/_/g, " ").toUpperCase()}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-200 outline-none"
                  />
                ))}
              </div>
            </div>

            {/* Raw JSON */}
            <div>
              <button
                onClick={() => setShowRaw((v) => !v)}
                className="text-xs text-blue-600 underline"
              >
                {showRaw ? "Ẩn phản hồi thô" : "Hiển thị phản hồi thô"}
              </button>

              {showRaw && (
                <pre className="mt-4 text-sm bg-slate-900 text-slate-100 rounded-2xl p-6 overflow-auto max-h-[600px] leading-relaxed border border-slate-800">
                  {JSON.stringify(rawData ?? vehicle, null, 2)}
                </pre>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleUpdate}
                disabled={saving}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-60"
              >
                {saving ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Pencil size={16} />
                )}
                Lưu thay đổi
              </button>

              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-5 py-3 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 font-semibold disabled:opacity-60"
              >
                {deleting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Trash2 size={16} />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleAdminDetail;