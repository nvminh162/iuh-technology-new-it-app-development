# Product Management - Midterm CRUD (ExpressJS + EJS)

README này mô tả đúng hiện trạng code đã làm trong thư mục `product-management`.

## 1. Tổng quan

Ứng dụng quản lý sản phẩm sử dụng:

- Node.js + Express
- EJS template engine
- AWS DynamoDB để lưu dữ liệu
- AWS S3 để lưu ảnh upload
- Multer để xử lý file upload

## 2. Cấu trúc dữ liệu Product

Dữ liệu đang lưu trong DynamoDB có dạng thực tế:

```js
{
  id: string,
  name: string,
  price: string | number,
  quantity: string | number,
  image?: string // URL ảnh trên S3 (nếu có)
}
```

Lưu ý:

- Trường `createdAt` chưa được sử dụng trong code hiện tại.
- Giá trị `price`, `quantity` được tính toán thông qua `Number(...)` khi render.

## 3. Route thực tế trong bài làm

| Chức năng | Method | Route | Ghi chú |
| --- | --- | --- | --- |
| Danh sách sản phẩm | GET | `/` | Render `views/index.ejs` |
| Mở form thêm | GET | `/form` | Render form rỗng |
| Mở form sửa | GET | `/form/:id` | Đổ dữ liệu cũ lên form |
| Tạo sản phẩm | POST | `/items` | Có thể upload `image` |
| Cập nhật sản phẩm | POST | `/items/:id` | Giữ ảnh cũ nếu không upload mới |
| Xóa sản phẩm | POST | `/items/delete/:id` | Xóa item và xóa ảnh S3 nếu có |

## 4. Mô tả chức năng đã hoàn thành

### 4.1 Hiển thị danh sách

- Hiển thị: id, name, price, image, quantity.
- Có thêm:
  - `Status`: Còn vé / Sắp hết vé / Hết vé.
  - `Amount = price * quantity`.
- Có thao tác: Sửa, Xóa.

### 4.2 Thêm sản phẩm

- Form nhập: `name`, `price`, `quantity`, `image(file)`.
- Upload ảnh qua `multipart/form-data`.
- Sau khi lưu thành công redirect về `/`.

### 4.3 Cập nhật sản phẩm

- Tải dữ liệu cũ theo `id` lên form.
- Nếu upload ảnh mới: upload lên S3 và xóa ảnh cũ trên S3.
- Sau khi cập nhật thành công redirect về `/`.

### 4.4 Xóa sản phẩm

- Xóa bản ghi trong DynamoDB.
- Nếu item có ảnh thì xóa file ảnh trên S3.

## 5. Validation đang áp dụng

Validation server (`validation/index.js`):

- `quantity >= 0`
- `price >= 0`

Validation form HTML:

- `name`, `price`, `quantity` bắt buộc (`required`).

Lưu ý so với đề bài:

- Đề bài yêu cầu `price > 0`, `quantity > 0`, check URL image.
- Code hiện tại đang dùng upload file ảnh (không nhập URL), và chấp nhận `price = 0`, `quantity = 0`.

## 6. Lưu trữ dữ liệu

- DynamoDB Table: `Products`
- S3 Bucket mặc định trong code: `nguyenvanminh-22003405-s3-midterm`

Thông tin AWS credentials đọc từ biến môi trường:

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`

Region hiện tại hard-code: `ap-southeast-1`.

## 7. Cấu trúc thư mục hiện tại

```text
product-management/
|-- index.js
|-- package.json
|-- .env
|-- .env.example
|-- config/
|   `-- index.js
|-- controller/
|   `-- index.js
|-- service/
|   `-- index.js
|-- validation/
|   `-- index.js
|-- utils/
|   `-- index.js
`-- views/
    |-- index.ejs
    `-- form.ejs
```

## 8. Hướng dẫn chạy

### 8.1 Cài đặt

```bash
npm install
```

### 8.2 Cấu hình môi trường

Tạo file `.env` (hoặc copy từ `.env.example`):

```env
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
```

Đồng thời cần đảm bảo:

- Đã tạo DynamoDB table `Products`.
- Đã tạo S3 bucket và cấp quyền `PutObject/GetObject/DeleteObject`.

### 8.3 Chạy app

```bash
npm start
```

App chạy tại: `http://localhost:3000`

## 9. Đánh giá mức độ đáp ứng đề bài

- Có CRUD cơ bản: Đạt.
- EJS + Routing: Đạt.
- Validation: Đạt một phần (chưa đúng điều kiện `> 0`, chưa check URL image do đã đổi sang upload file).
- Xem chi tiết riêng `/products/:id`: Chưa tách route riêng (hiển thị thông tin trong danh sách).
- Confirm trước khi xóa: Chưa có hộp thoại confirm trên giao diện.

## 10. Ghi chú cải tiến (nếu cần nâng điểm)

- Thêm route chi tiết riêng cho từng sản phẩm.
- Thêm confirm JS trước khi submit xóa.
- Nâng validation thành `price > 0`, `quantity > 0`.
- Tách CSS/public và bố cục giao diện đẹp hơn.
