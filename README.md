# MamboShop — Website Thương Mại Điện Tử Quần Áo Thời Trang

**MamboShop** là nền tảng mua sắm thời trang trực tuyến được xây dựng theo hướng hiện đại, tối ưu trải nghiệm người dùng trên cả máy tính lẫn thiết bị di động (Responsive). Hệ thống hỗ trợ đầy đủ các luồng duyệt sản phẩm theo danh mục, bộ lọc đa tiêu chí, tìm kiếm nhanh, quản lý giỏ hàng, xác thực tài khoản và theo dõi thông tin cá nhân/đơn hàng.

---

## Tính năng nổi bật

- **Trang chủ & Danh mục thời trang:** Hiển thị danh sách sản phẩm quần áo, phụ kiện theo từng bộ sưu tập, danh mục, mức giá, đánh giá và mức độ phổ biến.
- **Bộ lọc & Tìm kiếm thông minh:** Lọc sản phẩm theo khoảng giá, danh mục, sắp xếp theo giá/lượt bán; hỗ trợ giao diện `Drawer` tối ưu cho thiết bị di động.
- **Chi tiết sản phẩm:** Xem hình ảnh sản phẩm, mô tả chi tiết (được làm sạch nội dung HTML an toàn với DOMPurify), lựa chọn phân loại và thêm nhanh vào giỏ hàng.
- **Xác thực & Quản lý tài khoản:** Đăng ký, đăng nhập, đăng xuất an toàn, duy trì phiên đăng nhập bằng `localStorage` kết hợp `AppContext` và tự động đồng bộ trạng thái người dùng.
- **Giỏ hàng & Đặt hàng:** Thêm, cập nhật số lượng, xóa sản phẩm trong giỏ hàng và tiến hành đặt hàng trực tuyến.

---

## Công nghệ sử dụng

Dự án được phát triển dựa trên hệ sinh thái **React + TypeScript + Vite**:


| Nhóm công nghệ          | Thư viện / Công cụ                   | Phiên bản           | Vai trò trong dự án                                               |
| :------------------------- | :--------------------------------------- | :-------------------- | :------------------------------------------------------------------- |
| **Core & Ngôn ngữ**      | React, React DOM                         | `^19.2.8`             | Xây dựng giao diện người dùng theo kiến trúc component       |
|                            | TypeScript                               | `~6.0.2`              | Kiểm soát kiểu dữ liệu tĩnh, giảm lỗi runtime                |
|                            | Vite (`@vitejs/plugin-react`)            | `^8.2.2`              | Công cụ build và dev server tốc độ cao                         |
| **UI & Styling**           | Ant Design (`antd`)                      | `^6.6.2`              | Bộ component UI (Form, Drawer, Modal, Menu, Pagination...)          |
|                            | `@ant-design/icons`                      | `6.x`                 | Hệ thống biểu tượng giao diện                                  |
|                            | Tailwind CSS (`@tailwindcss/vite`)       | `^4.3.3`              | Utility-first CSS giúp tùy biến giao diện và responsive nhanh   |
|                            | `classnames`                             | `^2.5.1`              | Ghép nối class CSS có điều kiện gọn gàng                     |
| **Routing & State / Data** | React Router DOM                         | `^7.18.3`             | Điều hướng trang phía client (SPA routing)                      |
|                            | TanStack Query (`@tanstack/react-query`) | `^5.105.0`            | Quản lý server state, caching, đồng bộ dữ liệu API            |
|                            | `@tanstack/react-query-devtools`         | `^5.105.0`            | Công cụ debug cache và trạng thái query khi phát triển        |
| **Form & Validation**      | React Hook Form                          | `^7.91.0`             | Quản lý trạng thái và hiệu năng form                          |
|                            | Yup &`@hookform/resolvers`               | `^1.7.1` / `^6.0.2`   | Định nghĩa schema kiểm tra dữ liệu đầu vào                  |
| **HTTP & Tiện ích**      | Axios                                    | `^1.21.0`             | Giao tiếp RESTful API, xử lý interceptor request/response         |
|                            | React Toastify                           | `^11.2.0`             | Hiển thị thông báo trạng thái (toast) cho người dùng        |
|                            | DOMPurify                                | `^3.4.18`             | Làm sạch nội dung HTML (chống XSS) khi render mô tả sản phẩm |
|                            | Lodash                                   | `^4.18.1`             | Các hàm tiện ích xử lý mảng, object, debounce...              |
| **Code Quality**           | ESLint & TypeScript ESLint               | `^10.9.0` / `^8.67.0` | Kiểm tra quy tắc code, React Hooks và chất lượng mã nguồn    |

---

## Yêu cầu môi trường

- **Node.js:** Khuyến nghị phiên bản `>= 20.x` (tương thích tốt với Vite 8 & React 19).
- **Yarn:** Đã cài đặt Yarn (`yarn --version`).

---

## Hướng dẫn cài đặt và chạy dự án với Yarn

### 1. Clone mã nguồn

```bash
git clone https://github.com/Thanh19111/MamboShop.git
cd mamboshop
```

### 2. Cài đặt các gói phụ thuộc

```bash
yarn install
```

### 3. Cấu hình biến môi trường

Tạo file `.env` (hoặc `.env.local`) ở thư mục gốc của dự án và khai báo đường dẫn API backend (lưu ý tiền tố `VITE_` của Vite):

```env
VITE_BASE_API_URL=http://localhost:4000/api
```

### 4. Khởi chạy môi trường phát triển (Development)

```bash
yarn dev
```

Sau khi chạy thành công, mở trình duyệt tại địa chỉ hiển thị trên terminal (`http://localhost:5173`).

---

## Khởi chạy trên môi trường ảo hóa (Docker hoặc Podman)

```bash
# Kéo image mới nhất từ Docker Hub
docker pull embeddium/mamboshop:latest

# Chạy container bằng nền tảng Docker (ví dụ map port 80 của máy host tới port 80 của container)
docker run -d \
  --name mamboshop \
  -p 80:80 \
  --restart unless-stopped \
  embeddium/mamboshop:latest
```

Sau khi chạy thành công, mở trình duyệt tại địa chỉ hiển thị trên terminal (`http://localhost`).

---

## Các lệnh (Scripts) thường dùng


| Lệnh          | Mô tả                                                                                                               |
| :------------- | :-------------------------------------------------------------------------------------------------------------------- |
| `yarn dev`     | Khởi chạy server phát triển với Hot Module Replacement (HMR)                                                     |
| `yarn build`   | Kiểm tra kiểu dữ liệu TypeScript (`tsc -b`) và đóng gói bản production (`vite build`) vào thư mục `dist/` |
| `yarn preview` | Chạy thử bản build production ở local để kiểm tra trước khi deploy                                           |
| `yarn lint`    | Chạy ESLint kiểm tra lỗi cú pháp và quy tắc code toàn dự án                                                 |