# MotorSafe - Quick Motorcycle Rescue

MotorSafe là một ứng dụng hỗ trợ cứu hộ xe máy nhanh chóng, bao gồm cổng thông tin cho khách hàng và hệ thống quản lý yêu cầu cứu hộ.

## 🚀 Tính năng chính
- **Tìm kiếm thợ gần nhất**: Tự động xác định vị trí và tìm kiếm thợ sửa xe trong khu vực.
- **Yêu cầu cứu hộ**: Gửi thông tin sự cố và yêu cầu thợ đến hỗ trợ.
- **Theo dõi trạng thái**: Cập nhật trạng thái cứu hộ theo thời gian thực qua WebSockets.
- **Quản lý thông tin**: Lưu trữ thông tin xe và lịch sử sửa chữa.

---

## 🛠️ Công nghệ sử dụng

### Frontend
- **Framework**: React 19 + Vite 6
- **Styling**: Tailwind CSS 4, Framer Motion
- **Maps**: Leaflet (OpenStreetMap)
- **Real-time**: Socket.io-client

### Backend
- **Framework**: ASP.NET Core Web API
- **Database**: MySQL (Entity Framework Core)
- **Real-time**: SignalR / WebSockets

---

## 💻 Hướng dẫn cài đặt

### 1. Yêu cầu hệ thống
- **Node.js**: Phiên bản 18+
- **.NET SDK**: 8.0+
- **MySQL Server**: (XAMPP hoặc MySQL Workbench)

### 2. Cài đặt Frontend
Từ thư mục gốc của dự án:
```bash
# Cài đặt các package
npm install

# Chạy project ở chế độ development
npm run dev
```
Truy cập tại: `http://localhost:5173`

> **Lưu ý**: Nếu bạn chạy Backend locally, hãy kiểm tra file `vite.config.js` và cập nhật mục `proxy` trỏ về `http://localhost:5000` (hoặc cổng backend của bạn).

### 3. Cài đặt Backend
Di chuyển vào thư mục `Backend`:
```bash
cd Backend

# Cập nhật thông tin kết nối database (MySQL)
# Mở file appsettings.json và sửa DefaultConnection

# Khởi tạo database (Yêu cầu dotnet-ef)
dotnet ef database update

# Chạy server
dotnet run
```
Backend mặc định sẽ chạy tại: `https://localhost:5001` hoặc `http://localhost:5000`

---

## 📂 Cấu trúc thư mục
- `/src`: Mã nguồn Frontend (React components, Pages, Utils).
- `/Backend`: Mã nguồn ASP.NET Core Web API.
- `/public`: Các tài nguyên tĩnh (Images, Icons).

---

## 🤝 Contributor
- Dự án được phát triển bởi **rindabest**.

---

## 📄 Giấy phép
Dự án này là mã nguồn mở.
