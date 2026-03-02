```
https://eggplant-hamster-2cc.notion.site/T-i-Li-u-H-ng-D-n-Th-c-H-nh-M-n-C-ng-Ngh-M-i-Tu-n-4-5-6-7a088ab66da54697b23606922511a4b0#fb8c82f48c7e45d78c545f6eab00a8cd
```

### Tổng quan

```bash
npm i aws-sdk ejs express express-session body-parser dotenv

yarn add aws-sdk ejs express express-session body-parser dotenv
```

---

### 1. `express`

- **Chức năng**: Framework web cho Node.js, giúp tạo server HTTP, định nghĩa route, middleware rất dễ.
- **Dùng để**:  
  - Tạo API (REST API)  
  - Xử lý request/response (GET, POST, PUT, DELETE, …)  
- **Ví dụ ngắn**:

```js
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello Express');
});

app.listen(3000);
```

---

### 2. `express-session`

- **Chức năng**: Quản lý session trong Express (lưu thông tin người dùng giữa các request).
- **Dùng để**:
  - Lưu trạng thái đăng nhập (login session)
  - Lưu giỏ hàng, thông tin tạm của người dùng
- **Ví dụ ngắn**:

```js
const session = require('express-session');

app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false
}));

app.get('/set', (req, res) => {
  req.session.username = 'Minh';
  res.send('Đã set session');
});
```

---

### 3. `body-parser`

- **Chức năng**: Middleware để đọc dữ liệu body của request (form, JSON, …).
- **Dùng để**:
  - Lấy dữ liệu từ form HTML (`application/x-www-form-urlencoded`)
  - Lấy dữ liệu JSON từ client
- **Lưu ý**: Trong phiên bản Express mới, `express.json()` và `express.urlencoded()` đã thay thế được `body-parser`, nhưng nhiều code cũ vẫn dùng.

```js
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/submit', (req, res) => {
  console.log(req.body); // đọc dữ liệu gửi lên
  res.send('OK');
});
```

---

### 4. `ejs`

- **Chức năng**: Template engine (View engine) cho Express, giúp render HTML động từ server.
- **Dùng để**:
  - Tạo file `.ejs` chứa HTML + code nhúng `<%= %>`
  - Render trang HTML với dữ liệu từ server
- **Ví dụ ngắn**:

```js
app.set('view engine', 'ejs');

app.get('/home', (req, res) => {
  res.render('index', { name: 'Minh' });
});
```

Trong `views/index.ejs`:

```ejs
<h1>Xin chào <%= name %></h1>
```

---

### 5. `dotenv`

- **Chức năng**: Đọc biến môi trường từ file `.env` vào `process.env`.
- **Dùng để**:
  - Lưu các giá trị nhạy cảm: mật khẩu DB, API key, secret, …
  - Tách config ra khỏi code
- **Ví dụ ngắn**:

```js
require('dotenv').config();

const dbPassword = process.env.DB_PASSWORD;
```

File `.env`:

```env
DB_PASSWORD=123456
```

---

### 6. `aws-sdk`

- **Chức năng**: SDK chính thức của Amazon Web Services cho Node.js.
- **Dùng để**:
  - Làm việc với S3 (upload/download file)
  - Gửi email qua SES
  - Gọi các dịch vụ AWS khác (DynamoDB, SQS, SNS, …)
- **Ví dụ rất đơn giản với S3** (chỉ minh họa):

```js
const AWS = require('aws-sdk');
AWS.config.update({ region: 'ap-southeast-1' });

const s3 = new AWS.S3();

s3.listBuckets((err, data) => {
  if (err) console.log(err);
  else console.log(data.Buckets);
});
```
---
