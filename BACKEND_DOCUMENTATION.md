# BACKEND_DOCUMENTATION.md

# TÀI LIỆU BACKEND - JOB PORTAL

## Phiên bản

Version: 1.0

Ngày cập nhật: 08/07/2026

---

# 1. Giới thiệu dự án

## 1.1 Mục đích

Đây là hệ thống tuyển dụng (Job Portal) được xây dựng bằng Spring Boot.

Hệ thống cho phép:

- Người tìm việc (Candidate) tìm kiếm việc làm và ứng tuyển.
- Nhà tuyển dụng (Employer) đăng tin tuyển dụng và quản lý ứng viên.
- Quản trị viên (Admin) quản lý toàn bộ hệ thống.

Backend được thiết kế theo mô hình RESTful API và sử dụng JWT Authentication để xác thực người dùng.

Frontend (React) sẽ giao tiếp với backend thông qua HTTP API.

---

# 2. Công nghệ sử dụng

## Backend

- Java 17
- Spring Boot
- Spring Security
- Spring Data JPA
- Hibernate
- JWT Authentication
- BCrypt Password Encoder
- Maven

## Database

MySQL

## Kiến trúc

REST API

Stateless Authentication

Role Based Authorization

---

# 3. Kiến trúc dự án

Project được chia thành các package chính như sau:

```

auth/
config/
controller/
dto/
entity/
exception/
filter/
repository/
service/

```

## auth

Xử lý:

- Đăng ký
- Đăng nhập

---

## controller

Tiếp nhận HTTP Request.

Controller không chứa business logic.

Controller chỉ:

- Nhận Request
- Validate dữ liệu
- Gọi Service
- Trả Response

---

## service

Chứa toàn bộ business logic của hệ thống.

Ví dụ:

- Tạo Job
- Apply Job
- Dashboard Employer
- Cập nhật trạng thái ứng tuyển

---

## repository

Làm việc với Database thông qua Spring Data JPA.

Không viết SQL thủ công.

Sử dụng Query Method của Spring Data.

Ví dụ:

```

findByEmail()

existsByEmail()

findByJob_Id()

countByEmployer_Id()

```

---

## entity

Ánh xạ dữ liệu với Database.

Sử dụng:

- @Entity
- @Table
- @ManyToOne
- @OneToMany
- @JoinColumn

---

## dto

Request và Response giữa Frontend và Backend.

Frontend tuyệt đối không làm việc trực tiếp với Entity.

---

## filter

Chứa JwtFilter.

Filter sẽ:

- Đọc JWT Token
- Xác thực Token
- Đưa User vào SecurityContext

---

## config

Cấu hình:

- Spring Security
- BCrypt
- CORS

---

## exception

Xử lý lỗi tập trung.

Toàn bộ RuntimeException và Validation Exception đều được xử lý tại đây.

---

# 4. Kiến trúc tổng thể

```

┌──────────────┐
│ React Client │
└──────┬───────┘
│
HTTP
│
▼
┌────────────────────┐
│ Spring Boot REST │
└─────────┬──────────┘
│
JWT Filter
│
▼
Security Context
│
▼
Controller
│
▼
Service
│
▼
Repository
│
▼
MySQL

```

Luồng xử lý luôn theo thứ tự trên.

Controller không truy cập Database.

Controller luôn thông qua Service.

Repository chỉ làm nhiệm vụ truy vấn dữ liệu.

---

# 5. Vai trò người dùng

Hệ thống có 3 Role.

## ADMIN

Quản trị hệ thống.

Quyền:

- Quản lý Job
- Quản lý Employer
- Quản lý Candidate
- Xem Dashboard
- Có thể sửa hoặc xóa Job

Lưu ý:

Admin không được phép đăng ký từ API Register.

Admin chỉ được tạo trực tiếp trong Database hoặc bằng công cụ quản trị.

---

## EMPLOYER

Nhà tuyển dụng.

Employer có thể:

- Đăng Job
- Cập nhật Job của mình
- Xóa Job của mình (nếu chưa có người Apply)
- Xem danh sách ứng viên
- Duyệt ứng viên
- Từ chối ứng viên
- Xem Dashboard

Employer không được:

- Apply Job
- Chỉnh sửa Job của Employer khác

---

## CANDIDATE

Người tìm việc.

Candidate có thể:

- Đăng ký tài khoản
- Đăng nhập
- Xem danh sách Job
- Tìm kiếm Job
- Apply Job
- Xem các Job đã Apply
- Hủy đơn ứng tuyển (nếu chưa được ACCEPTED)

Candidate không được:

- Đăng Job
- Sửa Job
- Xóa Job
- Duyệt ứng viên

---

# 6. Authentication

Hệ thống sử dụng JWT Authentication.

Backend không lưu Session.

Mọi Request cần xác thực đều phải gửi JWT Token.

Quy trình đăng nhập:

```

Login

↓

Backend kiểm tra Email

↓

So sánh Password bằng BCrypt

↓

Sinh JWT

↓

Trả Token

↓

Frontend lưu Token

↓

Mỗi Request gửi:

Authorization: Bearer <token>

↓

JwtFilter xác thực

↓

SecurityContextHolder

↓

Controller

```

Backend chỉ tin tưởng User được lấy từ JWT đã xác thực.

Frontend không được tự gửi UserId hoặc EmployerId.

Backend sẽ tự xác định người dùng hiện tại thông qua JWT.

---

# 7. Phân quyền

Các API được chia thành Public và Protected.

## Public API

Không cần đăng nhập.

Bao gồm:

- Register
- Login
- Danh sách Job
- Chi tiết Job
- Tìm kiếm Job

---

## Protected API

Cần JWT.

Nếu không gửi JWT:

401 Unauthorized

Nếu gửi JWT không hợp lệ:

401 Unauthorized

Nếu Role không đủ quyền:

403 Forbidden

---

## Quy tắc phân quyền

ADMIN

Có toàn quyền.

EMPLOYER

Có quyền quản lý Job của mình.

CANDIDATE

Chỉ được Apply Job và quản lý đơn ứng tuyển của mình.

---
---

# 8. Mô hình dữ liệu (Entity)

Hệ thống sử dụng 3 Entity chính:

- User
- Job
- JobApplication

Quan hệ giữa các Entity như sau:

```text
                    User
              +----------------+
              | id             |
              | name           |
              | email          |
              | password       |
              | role           |
              | createdAt      |
              +----------------+
                    |
                    | 1
                    |
                    | *
            JobApplication
      +--------------------------+
      | id                       |
      | status                   |
      | createdAt                |
      | user_id                  |
      | job_id                   |
      +--------------------------+
                    *
                    |
                    | 1
                    |
                    |
                  Job
          +----------------------+
          | id                   |
          | title                |
          | description          |
          | salary               |
          | location             |
          | createdAt            |
          | employer_id          |
          +----------------------+
```

JobApplication đóng vai trò là bảng trung gian giữa User và Job.

---

# 9. Entity User

Tên bảng:

```text
users
```

## Các thuộc tính

| Field | Kiểu dữ liệu | Mô tả |
|----------|-------------|----------------|
| id | Long | ID người dùng |
| name | String | Họ tên |
| email | String | Email đăng nhập (Unique) |
| password | String | Mật khẩu đã mã hóa BCrypt |
| role | Enum | Quyền người dùng |
| createdAt | LocalDateTime | Thời gian tạo |

---

## Role

User có 3 Role.

```text
ADMIN

EMPLOYER

CANDIDATE
```

---

## Quan hệ

Một User có thể:

- tạo nhiều Job (nếu là Employer)
- Apply nhiều Job

Trong source code:

```java
@OneToMany(mappedBy = "user")
private List<JobApplication> applications;
```

Frontend không cần quan tâm tới danh sách này vì Backend sử dụng DTO.

---

# 10. Entity Job

Tên bảng

```text
jobs
```

## Các thuộc tính

| Field | Kiểu |
|-----------|-------------|
| id | Long |
| title | String |
| description | String |
| salary | BigDecimal |
| location | String |
| createdAt | LocalDateTime |
| employer | User |

---

## employer

Mỗi Job luôn thuộc về đúng một Employer.

Backend tự lấy Employer từ JWT.

Frontend KHÔNG gửi employerId.

Ví dụ khi tạo Job.

Request:

```json
{
    "title":"Java Backend",
    "description":"Spring Boot",
    "salary":1200,
    "location":"Ha Noi"
}
```

Backend sẽ tự động lấy Employer đang đăng nhập.

```java
User employer =
(User) SecurityContextHolder
.getContext()
.getAuthentication()
.getPrincipal();
```

Sau đó gán

```java
job.setEmployer(employer);
```

---

## createdAt

Được sinh tự động.

```java
@PrePersist
```

Frontend không gửi.

---

# 11. Entity JobApplication

Tên bảng

```text
job_application
```

## Thuộc tính

| Field | Kiểu |
|----------|-------------|
| id | Long |
| status | Enum |
| createdAt | LocalDateTime |
| user | User |
| job | Job |

---

## Status

Có 3 trạng thái.

```text
PENDING

ACCEPTED

REJECTED
```

---

## Giá trị mặc định

Khi Candidate Apply.

Backend tự động đặt:

```text
PENDING
```

Frontend không được gửi Status.

Ví dụ:

Sai

```json
{
    "status":"ACCEPTED"
}
```

Đúng

```text
POST /jobs/{jobId}/apply
```

Không có Body.

---

## createdAt

Được Backend sinh tự động.

Frontend không gửi.

---

# 12. Quy tắc sử dụng Entity

Frontend không được sử dụng trực tiếp Entity.

Mọi giao tiếp đều phải thông qua DTO.

Ví dụ.

Không bao giờ trả về User Entity.

Sai.

```json
{
    "id":1,
    "name":"Nguyen Van A",
    "password":"..."
}
```

Đúng.

```json
{
    "id":1,
    "name":"Nguyen Van A",
    "email":"abc@gmail.com"
}
```

Password luôn được ẩn.

---

# 13. DTO

Backend sử dụng DTO để tách biệt dữ liệu giữa Database và API.

DTO gồm hai loại.

- Request
- Response

---

# 14. Authentication DTO

## RegisterRequest

Được sử dụng khi đăng ký.

```json
{
    "name":"Nguyen Van A",
    "email":"abc@gmail.com",
    "password":"12345678",
    "role":"CANDIDATE"
}
```

Validation.

| Field | Điều kiện |
|----------|----------------|
| name | Không được rỗng |
| email | Đúng định dạng Email |
| password | 8-24 ký tự |
| role | Không được null |

Lưu ý.

Backend sẽ từ chối nếu role = ADMIN.

---

## RegisterResponse

Backend trả về.

```json
{
    "id":1,
    "name":"Nguyen Van A",
    "email":"abc@gmail.com",
    "role":"CANDIDATE",
    "createdAt":"..."
}
```

Không trả Password.

---

## LoginRequest

```json
{
    "email":"abc@gmail.com",
    "password":"12345678"
}
```

---

## LoginResponse

```json
{
    "token":"eyJhbGciOi..."
}
```

Frontend phải lưu Token.

---

# 15. Job DTO

## JobRequest

Dùng khi tạo hoặc cập nhật Job.

```json
{
    "title":"Java Backend",
    "description":"Spring Boot",
    "salary":1000,
    "location":"Ha Noi"
}
```

Validation.

| Field | Điều kiện |
|---------|----------------|
| title | 3 - 100 ký tự |
| salary | >= 0 |
| location | Không được rỗng |

---

## JobResponse

Backend trả về.

```json
{
    "id":1,
    "title":"Java Backend",
    "description":"Spring Boot",
    "salary":1000,
    "location":"Ha Noi",
    "createdAt":"..."
}
```

Không trả Employer.

Frontend không cần EmployerId.

---

# 16. JobApplication DTO

## JobApplicationResponse

Được trả sau khi Apply Job.

```json
{
    "jobId":1,
    "userId":5,
    "status":"PENDING",
    "message":"Bạn đã ứng tuyển thành công"
}
```

---

## JobApplicationItemResponse

Employer dùng để xem danh sách ứng viên.

```json
{
    "userId":5,
    "userEmail":"abc@gmail.com",
    "jobId":1,
    "status":"PENDING"
}
```

---

## UpdateApplicationStatusRequest

Employer gửi.

```json
{
    "status":"ACCEPTED"
}
```

Hoặc

```json
{
    "status":"REJECTED"
}
```

Không được gửi.

```json
{
    "status":"PENDING"
}
```

Backend sẽ từ chối.

---

## UpdateApplicationStatusResponse

```json
{
    "applicationId":8,
    "status":"ACCEPTED",
    "message":"Cập nhật trạng thái thành công"
}
```

---

## MeApplicationResponse

Candidate xem các Job đã Apply.

```json
{
    "jobId":1,
    "title":"Java Backend",
    "location":"Ha Noi",
    "salary":1000,
    "status":"PENDING"
}
```

---

## EmployerDashboardResponse

Backend trả về Dashboard.

```json
{
    "totalJobs":12,
    "totalApplications":35,
    "pending":10,
    "accepted":18,
    "rejected":7
}
```

Frontend chỉ cần hiển thị các số liệu này.

---

# 17. Quy tắc sử dụng DTO

Frontend phải sử dụng đúng DTO mà Backend định nghĩa.

Không được:

- Thêm field mới vào Request.
- Đổi tên field.
- Tự tạo dữ liệu mà Backend không hỗ trợ.
- Gửi các field Backend tự sinh như:
  - createdAt
  - employer
  - status khi Apply Job
  - password trong Response

Mọi dữ liệu gửi lên Backend phải đúng với DTO tương ứng.

---

# 18. API Specification

Toàn bộ Backend được thiết kế theo chuẩn RESTful API.

Base URL:

```text
http://localhost:8080
```

Mọi API cần đăng nhập đều phải gửi Header:

```http
Authorization: Bearer <JWT_TOKEN>
```

Nếu API không yêu cầu đăng nhập sẽ được ghi rõ là **Public API**.

---

# 19. Authentication API

## 19.1 Đăng ký

### Endpoint

```http
POST /auth/register
```

### Quyền

Public API

Không cần JWT.

---

### Request Body

```json
{
    "name":"Nguyen Van A",
    "email":"abc@gmail.com",
    "password":"12345678",
    "role":"CANDIDATE"
}
```

---

### Validation

| Field | Điều kiện |
|---------|----------------|
| name | Không được rỗng |
| email | Đúng định dạng Email |
| password | 8-24 ký tự |
| role | Không được null |

---

### Business Rule

- Email không được trùng.
- Role không được là ADMIN.
- Password sẽ được mã hóa bằng BCrypt trước khi lưu Database.

---

### Response

```json
{
    "id":1,
    "name":"Nguyen Van A",
    "email":"abc@gmail.com",
    "role":"CANDIDATE",
    "createdAt":"2026-07-08T10:00:00"
}
```

---

### Các lỗi có thể xảy ra

Email đã tồn tại.

```json
{
    "message":"Email đã được sử dụng"
}
```

Role không hợp lệ.

```json
{
    "message":"Bạn không đủ quyền"
}
```

Validation lỗi.

```json
{
    "email":"Email không đúng định dạng"
}
```

---

# 19.2 Đăng nhập

### Endpoint

```http
POST /auth/login
```

### Quyền

Public API

---

### Request

```json
{
    "email":"abc@gmail.com",
    "password":"12345678"
}
```

---

### Response

```json
{
    "token":"eyJhbGciOiJIUzI1NiJ9..."
}
```

Frontend phải lưu token này để sử dụng cho các request tiếp theo.

---

### Business Rule

Backend sẽ:

- tìm User theo Email
- so sánh Password bằng BCrypt
- tạo JWT
- trả JWT cho Frontend

---

### Các lỗi

Sai Email.

```json
{
    "message":"User not found"
}
```

Sai Password.

```json
{
    "message":"Sai mật khẩu"
}
```

---

# 20. Job API

## 20.1 Lấy danh sách Job

### Endpoint

```http
GET /jobs
```

### Quyền

Public API

---

### Query Parameter

| Tên | Mặc định |
|------|-----------|
| page | 0 |
| size | 10 |

Ví dụ.

```http
GET /jobs?page=0&size=10
```

---

### Response

Spring Data trả về Page.

```json
{
    "content":[
        {
            "id":1,
            "title":"Java Backend",
            "description":"Spring Boot",
            "salary":1000,
            "location":"Ha Noi",
            "createdAt":"..."
        }
    ],
    "totalPages":2,
    "totalElements":15,
    "number":0,
    "size":10
}
```

---

## 20.2 Chi tiết Job

### Endpoint

```http
GET /jobs/{id}
```

Public API

---

Ví dụ.

```http
GET /jobs/5
```

---

### Response

```json
{
    "id":5,
    "title":"Java Backend",
    "description":"Spring Boot",
    "salary":1200,
    "location":"Ha Noi",
    "createdAt":"..."
}
```

---

Nếu Job không tồn tại.

```json
{
    "message":"Job không tồn tại"
}
```

---

## 20.3 Tìm kiếm Job

### Endpoint

```http
GET /jobs/search
```

Public API

---

### Query

```http
/jobs/search?title=java&location=ha noi
```

Hai tham số đều có thể để trống.

Ví dụ.

```http
/jobs/search?title=&location=ha noi
```

Backend sử dụng:

```java
findByTitleContainingIgnoreCaseAndLocationContainingIgnoreCase(...)
```

Nên tìm kiếm không phân biệt chữ hoa chữ thường.

---

### Response

```json
[
    {
        "id":1,
        "title":"Java Backend",
        "salary":1000,
        "location":"Ha Noi"
    }
]
```

---

## 20.4 Tạo Job

### Endpoint

```http
POST /jobs
```

### Quyền

EMPLOYER

ADMIN

---

### Header

```http
Authorization: Bearer <token>
```

---

### Request

```json
{
    "title":"Java Backend",
    "description":"Spring Boot",
    "salary":1000,
    "location":"Ha Noi"
}
```

---

### Business Rule

Frontend không gửi employerId.

Backend tự lấy Employer từ JWT.

createdAt cũng được Backend tự sinh.

---

### Response

```json
{
    "id":10,
    "title":"Java Backend",
    "description":"Spring Boot",
    "salary":1000,
    "location":"Ha Noi",
    "createdAt":"..."
}
```

---

## 20.5 Cập nhật Job

### Endpoint

```http
PUT /jobs/{id}
```

### Quyền

EMPLOYER

ADMIN

---

### Request

Giống JobRequest.

---

### Business Rule

Employer chỉ được sửa Job của chính mình.

Admin được sửa mọi Job.

Nếu Employer cố sửa Job của người khác.

```json
{
    "message":"Bạn không có quyền sửa job này"
}
```

---

## 20.6 Xóa Job

### Endpoint

```http
DELETE /jobs/{id}
```

### Quyền

EMPLOYER

ADMIN

---

### Business Rule

Employer chỉ được xóa Job của mình.

Nếu Job đã có người Apply.

Backend sẽ từ chối.

```json
{
    "message":"Job đã có người Apply!!! Không được phép xóa"
}
```

Nếu thành công.

```text
Đã xóa Job 5
```

---

# 21. Job Application API

## 21.1 Apply Job

### Endpoint

```http
POST /jobs/{jobId}/apply
```

### Quyền

Chỉ CANDIDATE.

---

### Request

Không có Body.

Frontend chỉ cần gửi JWT.

---

### Business Rule

Backend sẽ:

- lấy Candidate từ JWT
- kiểm tra Job tồn tại
- kiểm tra đã Apply chưa
- tạo JobApplication
- status = PENDING

---

### Response

```json
{
    "jobId":1,
    "userId":5,
    "status":"PENDING",
    "message":"Bạn đã ứng tuyển thành công"
}
```

---

Nếu Apply trùng.

```json
{
    "message":"Bạn đã ứng tuyển công việc này rồi"
}
```

---

## 21.2 Danh sách ứng viên

### Endpoint

```http
GET /jobs/{jobId}/applications
```

### Quyền

EMPLOYER

ADMIN

---

### Response

```json
[
    {
        "userId":5,
        "userEmail":"abc@gmail.com",
        "jobId":1,
        "status":"PENDING"
    }
]
```

Nếu Job không tồn tại.

```json
{
    "message":"Job không tồn tại"
}
```

---

## 21.3 Cập nhật trạng thái

### Endpoint

```http
PATCH /jobs/{applicationId}
```

### Quyền

EMPLOYER

---

### Request

```json
{
    "status":"ACCEPTED"
}
```

hoặc

```json
{
    "status":"REJECTED"
}
```

Không được gửi.

```json
{
    "status":"PENDING"
}
```

---

### Response

```json
{
    "applicationId":8,
    "status":"ACCEPTED",
    "message":"Cập nhật trạng thái thành công"
}
```

---

## 21.4 Danh sách Job đã Apply

### Endpoint

```http
GET /users
```

### Quyền

CANDIDATE

---

### Response

```json
[
    {
        "jobId":1,
        "title":"Java Backend",
        "location":"Ha Noi",
        "salary":1000,
        "status":"PENDING"
    }
]
```

---

## 21.5 Hủy đơn ứng tuyển

### Endpoint

```http
DELETE /applications/{id}
```

### Quyền

CANDIDATE

---

### Business Rule

Candidate chỉ được xóa đơn của chính mình.

Nếu trạng thái là ACCEPTED.

Backend sẽ từ chối.

```json
{
    "message":"Không thể hủy vì đã được chấp nhận"
}
```

Nếu thành công.

```text
Đã xóa thành công
```

---

# 22. Dashboard API

## Endpoint

```http
GET /employer/dashboard
```

### Quyền

EMPLOYER

ADMIN

---

### Response

```json
{
    "totalJobs":12,
    "totalApplications":35,
    "pending":10,
    "accepted":18,
    "rejected":7
}
```

Frontend chỉ cần hiển thị các số liệu thống kê.

---

# 23. Business Rules

Phần này mô tả toàn bộ quy tắc nghiệp vụ của hệ thống.

Frontend phải tuân thủ các quy tắc này, không tự suy luận hoặc thay đổi logic.

---

# 23.1 Quy tắc đăng ký

- Email phải là duy nhất.
- Password được Backend mã hóa bằng BCrypt.
- Người dùng chỉ được đăng ký với role:
  - EMPLOYER
  - CANDIDATE
- Không được đăng ký ADMIN.

Nếu gửi:

```json
{
    "role":"ADMIN"
}
```

Backend sẽ trả lỗi.

---

# 23.2 Quy tắc đăng nhập

Backend chỉ chấp nhận:

- Email tồn tại.
- Password đúng.

Sau khi đăng nhập thành công.

Backend trả về JWT.

Frontend phải:

- lưu JWT
- sử dụng JWT cho mọi Protected API

Không lưu User trong Local Storage để xác thực.

JWT mới là nguồn xác thực duy nhất.

---

# 23.3 Quy tắc tạo Job

Chỉ Employer hoặc Admin được tạo Job.

Employer hiện tại được lấy từ JWT.

Frontend không gửi:

```text
employerId
```

Không gửi:

```text
createdAt
```

Không gửi:

```text
id
```

Backend tự tạo các thông tin này.

---

# 23.4 Quy tắc cập nhật Job

Employer chỉ được sửa Job do chính mình tạo.

Admin có thể sửa mọi Job.

Nếu Employer cố sửa Job của người khác.

Backend sẽ trả lỗi.

---

# 23.5 Quy tắc xóa Job

Employer chỉ được xóa Job của mình.

Nếu Job đã có Candidate Apply.

Không được phép xóa.

Frontend nên hiển thị thông báo lỗi từ Backend.

---

# 23.6 Quy tắc Apply Job

Chỉ Candidate được Apply.

Employer không được Apply.

Admin không được Apply.

Candidate chỉ được Apply một lần cho mỗi Job.

Backend sẽ kiểm tra:

```text
existsByUser_IdAndJob_Id(...)
```

Nếu đã tồn tại.

Backend trả lỗi.

---

# 23.7 Quy tắc trạng thái đơn ứng tuyển

Status gồm:

```text
PENDING

ACCEPTED

REJECTED
```

Ý nghĩa:

PENDING

Đơn đang chờ xử lý.

ACCEPTED

Ứng viên được nhận.

REJECTED

Ứng viên bị từ chối.

---

Candidate không được sửa Status.

Employer mới được sửa.

---

# 23.8 Quy tắc cập nhật Status

Employer chỉ được gửi:

```text
ACCEPTED
```

hoặc

```text
REJECTED
```

Không được gửi:

```text
PENDING
```

Backend sẽ từ chối.

---

# 23.9 Quy tắc hủy đơn

Candidate chỉ được hủy đơn của mình.

Nếu Status là:

```text
ACCEPTED
```

Không được hủy.

Nếu là:

```text
PENDING
```

Có thể hủy.

Nếu là:

```text
REJECTED
```

Có thể hủy.

---

# 23.10 Dashboard

Dashboard chỉ dành cho Employer.

Backend thống kê:

- số Job
- số đơn
- số Pending
- số Accepted
- số Rejected

Frontend không cần tính toán.

Chỉ hiển thị dữ liệu Backend trả về.

---

# 24. Security Flow

Hệ thống sử dụng JWT Authentication.

Luồng xác thực.

```text
User Login

↓

POST /auth/login

↓

Backend kiểm tra Email

↓

Backend kiểm tra Password

↓

Sinh JWT

↓

Trả JWT

↓

Frontend lưu JWT

↓

Request mới

↓

Authorization: Bearer <token>

↓

JwtFilter

↓

JwtService

↓

UserRepository

↓

SecurityContextHolder

↓

Controller

↓

Service
```

Mọi API yêu cầu đăng nhập đều đi qua JwtFilter.

---

# 25. SecurityContextHolder

Backend không tin tưởng dữ liệu từ Frontend.

Ví dụ.

Sai.

```json
{
    "userId":5
}
```

Frontend tuyệt đối không gửi userId để xác thực.

Backend luôn lấy User hiện tại bằng:

```java
SecurityContextHolder
.getContext()
.getAuthentication()
.getPrincipal()
```

Điều này áp dụng cho:

- tạo Job
- Apply Job
- Dashboard
- cập nhật Job
- xóa Job
- lấy danh sách Job đã Apply
- hủy đơn

---

# 26. Error Handling

Toàn bộ lỗi được xử lý bởi:

```text
GlobalExceptionHandler
```

Có hai nhóm lỗi chính.

---

## RuntimeException

Response.

```json
{
    "message":"..."
}
```

Ví dụ.

```json
{
    "message":"Job không tồn tại"
}
```

---

## Validation Error

Response.

```json
{
    "email":"Email không đúng định dạng",
    "password":"Mật khẩu phải từ 8-24 ký tự"
}
```

Frontend nên hiển thị lỗi theo từng field.

---

# 27. HTTP Status

Backend hiện sử dụng chủ yếu:

| Status | Ý nghĩa |
|---------|-----------------------------|
| 200 | Thành công |
| 400 | RuntimeException hoặc Validation |

Lưu ý:

Hiện tại Backend chưa phân biệt:

- 401 Unauthorized
- 403 Forbidden
- 404 Not Found

Các lỗi nghiệp vụ đều đang trả về HTTP 400.

Frontend nên đọc nội dung trường:

```json
message
```

để hiển thị cho người dùng.

---

# 28. Hướng dẫn dành cho Frontend

Frontend chỉ làm nhiệm vụ:

- Hiển thị dữ liệu.
- Gửi Request.
- Lưu JWT.
- Điều hướng giao diện.

Frontend không tự xử lý nghiệp vụ.

Ví dụ.

Không tự kiểm tra:

```text
Candidate đã Apply chưa
```

Luôn gọi API.

Backend sẽ quyết định.

---

Không tự tính Dashboard.

Backend sẽ trả dữ liệu.

---

Không tự xác định quyền.

Frontend có thể ẩn hoặc hiện giao diện theo Role.

Tuy nhiên Backend mới là nơi quyết định cuối cùng.

---

# 29. Quy ước Header

Protected API luôn gửi.

```http
Authorization: Bearer <JWT_TOKEN>
```

Ví dụ.

```http
GET /users

Authorization: Bearer eyJhbGciOiJIUzI1Ni...
```

Nếu không gửi.

Backend sẽ từ chối truy cập.

---

# 30. CORS

Backend chỉ cho phép Frontend chạy tại:

```text
http://localhost:5173
```

Frontend nên chạy bằng Vite trên cổng mặc định 5173.

---

# 31. Mục tiêu của Frontend

Frontend cần xây dựng các màn hình sau.

## Khách (Guest)

- Đăng ký
- Đăng nhập
- Danh sách Job
- Chi tiết Job
- Tìm kiếm Job

---

## Candidate

- Danh sách Job
- Chi tiết Job
- Apply Job
- Danh sách Job đã Apply
- Hủy đơn ứng tuyển

---

## Employer

- Dashboard
- Danh sách Job của mình (có thể mở rộng sau)
- Tạo Job
- Chỉnh sửa Job
- Xóa Job
- Danh sách ứng viên
- Accept Candidate
- Reject Candidate

---

## Admin

Hiện tại Backend chỉ hỗ trợ quyền.

Frontend chưa cần xây dựng giao diện riêng cho Admin.

---

# 32. Lưu ý dành cho AI/Cursor

Khi sinh mã Frontend, luôn tuân thủ các nguyên tắc sau:

1. Không thay đổi tên endpoint.
2. Không thay đổi tên field trong DTO.
3. Không tự tạo API mới.
4. Không gửi các field Backend không yêu cầu.
5. Mọi Protected API đều phải gửi JWT trong Header Authorization.
6. Không tự tính toán nghiệp vụ đã được Backend xử lý.
7. Hiển thị thông báo lỗi dựa trên dữ liệu Backend trả về.
8. Sử dụng đúng Request DTO và Response DTO được mô tả trong tài liệu này.
9. Frontend chỉ là lớp giao diện, mọi quyết định nghiệp vụ thuộc về Backend.
10. Nếu cần dữ liệu mới, phải bổ sung API ở Backend thay vì tự suy diễn.

---

# Kết luận

Tài liệu này mô tả đầy đủ kiến trúc Backend hiện tại của dự án Job Portal.

Frontend phải được xây dựng dựa trên tài liệu này để đảm bảo tương thích hoàn toàn với Backend hiện có.

Không thay đổi API, DTO hoặc Business Rule nếu không có sự thay đổi tương ứng ở Backend.

---

# PHỤ LỤC A - FRONTEND DEVELOPMENT GUIDE

## Mục tiêu

Frontend được xây dựng bằng:

- React
- Vite
- React Router
- Axios

Frontend chỉ là lớp giao diện.

Mọi Business Logic đều thuộc Backend.

---

# 1. Cấu trúc thư mục đề xuất

```text
src/

│
├── api/
│   ├── axios.js
│   ├── authApi.js
│   ├── jobApi.js
│   ├── applicationApi.js
│   └── dashboardApi.js
│
├── pages/
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── JobListPage.jsx
│   ├── JobDetailPage.jsx
│   ├── CandidateApplicationsPage.jsx
│   ├── EmployerDashboardPage.jsx
│   ├── EmployerJobsPage.jsx
│   ├── CreateJobPage.jsx
│   ├── EditJobPage.jsx
│   └── JobApplicationsPage.jsx
│
├── components/
│   ├── Navbar.jsx
│   ├── JobCard.jsx
│   ├── SearchBar.jsx
│   ├── ProtectedRoute.jsx
│   ├── Loading.jsx
│   └── ErrorMessage.jsx
│
├── context/
│   └── AuthContext.jsx
│
├── hooks/
│   └── useAuth.js
│
├── utils/
│   └── token.js
│
├── App.jsx
│
└── main.jsx
```

---

# 2. Axios

Toàn bộ API phải sử dụng chung một Axios Instance.

Không gọi axios trực tiếp trong từng component.

Ví dụ.

```text
axios.js
```

sẽ cấu hình:

- baseURL
- Authorization Header
- timeout (nếu cần)

---

# 3. JWT

Sau khi Login thành công.

Frontend lưu:

```text
localStorage
```

Key đề xuất.

```text
token
```

Ví dụ.

```text
localStorage.setItem("token", token)
```

---

Khi Logout.

```text
localStorage.removeItem("token")
```

---

# 4. Authorization Header

Mọi Protected API.

Axios phải tự thêm.

```http
Authorization: Bearer <token>
```

Không thêm thủ công trong từng component.

Nên sử dụng Axios Interceptor.

---

# 5. AuthContext

Nên tạo AuthContext để quản lý.

Ví dụ.

```text
user

token

isLogin

login()

logout()
```

Mọi component đều lấy dữ liệu từ Context.

Không đọc LocalStorage nhiều lần.

---

# 6. React Router

Nên sử dụng.

```text
/

/login

/register

/jobs

/jobs/:id

/dashboard

/my-applications

/create-job

/edit-job/:id

/jobs/:id/applications
```

---

# 7. Protected Route

Các trang sau cần đăng nhập.

Candidate.

- Apply
- My Applications

Employer.

- Dashboard
- Create Job
- Edit Job
- Applications

Nếu chưa Login.

Điều hướng về.

```text
/login
```

---

# 8. Role Based UI

Sau khi Login.

Frontend nên biết Role.

Để quyết định hiển thị giao diện.

Ví dụ.

Candidate.

Hiển thị.

```text
Apply
```

Employer.

Hiển thị.

```text
Create Job

Dashboard
```

Không cần ẩn bằng CSS.

Nên render theo Role.

---

# 9. Loading

Mọi API nên có Loading.

Ví dụ.

```text
Đang tải...
```

Không để màn hình trắng.

---

# 10. Error

Nếu Backend trả.

```json
{
    "message":"..."
}
```

Frontend hiển thị.

Toast.

Alert.

Hoặc Error Component.

Không hard-code nội dung lỗi.

---

# 11. Validation

Validation chính nằm ở Backend.

Frontend chỉ nên kiểm tra đơn giản.

Ví dụ.

- Không để trống.
- Email.
- Password.

Nếu Backend trả Validation Error.

Ví dụ.

```json
{
    "email":"Email không đúng định dạng"
}
```

Hiển thị đúng dưới Input tương ứng.

---

# 12. Phân trang

Danh sách Job.

Sử dụng.

```text
page

size
```

Backend đã hỗ trợ.

Không tải toàn bộ dữ liệu.

---

# 13. Search

Search Job.

Sử dụng.

```text
title

location
```

Frontend chỉ truyền Query Parameter.

Không lọc dữ liệu phía Client.

---

# 14. Dashboard

Dashboard chỉ hiển thị.

```text
totalJobs

totalApplications

pending

accepted

rejected
```

Không tự tính toán.

---

# 15. Candidate

Trang Candidate gồm.

- Danh sách Job.
- Chi tiết Job.
- Apply.
- Danh sách Job đã Apply.
- Hủy Apply.

---

# 16. Employer

Trang Employer.

- Dashboard.
- Danh sách Job.
- Tạo Job.
- Sửa Job.
- Xóa Job.
- Danh sách Candidate.
- Accept.
- Reject.

---

# 17. Component đề xuất

JobCard

Hiển thị.

- Title
- Salary
- Location

---

JobDetail

Hiển thị.

- Description
- Salary
- Location
- CreatedAt

---

ApplicationTable

Hiển thị.

- Candidate Email
- Status
- Accept Button
- Reject Button

---

Navbar

Nếu Guest.

```text
Login

Register
```

Nếu Candidate.

```text
Jobs

My Applications

Logout
```

Nếu Employer.

```text
Dashboard

Jobs

Create Job

Logout
```

---

# 18. Điều không nên làm

Không gọi API trực tiếp trong nhiều component.

Không hard-code URL Backend.

Không hard-code Token.

Không lưu Password.

Không chỉnh sửa DTO.

Không tự tạo API mới.

Không tự tính Business Logic.

---

# 19. Quy trình phát triển Frontend

Thứ tự nên thực hiện.

1. Axios
2. Router
3. Login
4. Register
5. AuthContext
6. ProtectedRoute
7. Job List
8. Job Detail
9. Search
10. Apply
11. Candidate Applications
12. Employer Dashboard
13. Create Job
14. Edit Job
15. Delete Job
16. Job Applications
17. Accept / Reject
18. Hoàn thiện UI

---

# 20. Nguyên tắc quan trọng

Frontend chỉ là giao diện.

Backend là nguồn dữ liệu duy nhất.

Nếu Backend và Frontend có khác biệt.

Frontend phải tuân theo Backend.

Không được tự suy diễn dữ liệu hoặc thay đổi Business Rule.

---

# PHỤ LỤC B - UI/UX SPECIFICATION

## Mục tiêu giao diện

Frontend phải có giao diện hiện đại, tối giản và chuyên nghiệp.

Phong cách thiết kế lấy cảm hứng từ **TopCV**.

Không cần sao chép hoàn toàn TopCV nhưng phải mang cùng trải nghiệm người dùng.

Website hướng tới cảm giác:

- Sạch sẽ
- Nhiều khoảng trắng
- Dễ đọc
- Hiện đại
- Chuyên nghiệp
- Phù hợp website tuyển dụng

Không thiết kế theo phong cách Dashboard Admin.

Đây là website tuyển dụng dành cho người dùng cuối.

---

# Ngôn ngữ giao diện

Toàn bộ giao diện sử dụng tiếng Việt.

Ví dụ:

Đăng nhập

Đăng ký

Việc làm

Nhà tuyển dụng

Ứng tuyển

Đã ứng tuyển

Mức lương

Địa điểm

Chi tiết công việc

...

---

# Responsive

Website phải hoạt động tốt trên:

Desktop

Laptop

Tablet

Mobile

Ưu tiên Desktop trước.

Sau đó responsive bằng Flexbox hoặc CSS Grid.

Không sử dụng giao diện cố định kích thước.

---

# Theme

Theme sáng.

Không sử dụng Dark Mode.

---

# Màu sắc

Màu chủ đạo:

```text
#00b14f
```

Đây là màu xanh đặc trưng của TopCV.

Các màu phụ:

```text
Trắng

#ffffff

Xám nền

#f5f5f5

Xám nhạt

#fafafa

Border

#e5e5e5

Text chính

#222222

Text phụ

#666666
```

Không sử dụng quá nhiều màu.

---

# Font

Font hiện đại.

Ưu tiên:

Inter

Roboto

Open Sans

Không sử dụng font Serif.

---

# Border Radius

Card

10-12px

Button

8px

Input

8px

---

# Shadow

Card nên có Shadow nhẹ.

Không dùng Shadow quá đậm.

Ví dụ:

```text
box-shadow nhẹ

giống TopCV
```

---

# Navbar

Navbar cố định phía trên.

Chiều cao khoảng:

70px

Bao gồm:

Logo

Menu

Nút Login

Nút Register

Hoặc

Avatar nếu đã đăng nhập.

---

Guest.

```text
Logo

Việc làm

Đăng nhập

Đăng ký
```

---

Candidate.

```text
Logo

Việc làm

Việc đã ứng tuyển

Đăng xuất
```

---

Employer.

```text
Logo

Dashboard

Đăng tuyển

Quản lý Job

Đăng xuất
```

---

# Trang chủ

Trang đầu tiên là:

Danh sách Job.

Không cần Landing Page.

Khi truy cập website.

Hiển thị ngay Job List.

Giống trải nghiệm TopCV.

---

# Search Bar

Đặt ở đầu trang.

Chiếm chiều ngang lớn.

Bao gồm.

Input.

Tên công việc.

Input.

Địa điểm.

Button.

Tìm kiếm.

Giống TopCV.

---

# Job Card

Hiển thị dạng Card.

Một hàng nhiều Card trên Desktop.

Card gồm.

Logo công ty (placeholder nếu chưa có).

Tên Job.

Tên công ty (hiện tại có thể để "Employer").

Salary.

Location.

Ngày đăng.

Button.

Xem chi tiết.

---

Card có hiệu ứng.

Hover.

Nổi nhẹ.

Border chuyển xanh.

---

# Job Detail

Layout hai cột.

Cột trái.

Thông tin Job.

Cột phải.

Box Apply.

Giống TopCV.

Thông tin.

Title.

Salary.

Location.

Description.

Ngày đăng.

Nếu Candidate.

Hiển thị.

Button.

Ứng tuyển.

---

# Login

Form nằm giữa màn hình.

Card trắng.

Bo góc.

Shadow nhẹ.

Input.

Email.

Password.

Button.

Đăng nhập.

Link.

Đăng ký.

---

# Register

Tương tự Login.

Thêm.

Name.

Role.

Role sử dụng Select.

Employer

Candidate

Không hiển thị Admin.

---

# Dashboard Employer

Dashboard dạng Card thống kê.

Một hàng.

Total Job.

Total Applications.

Pending.

Accepted.

Rejected.

Giống Dashboard hiện đại.

---

# Danh sách Job của Employer

Dạng Table.

Các cột.

Title.

Location.

Salary.

CreatedAt.

Action.

Button.

Edit.

Delete.

Applications.

---

# Danh sách Candidate

Dạng Table.

Email.

Status.

Action.

Accept.

Reject.

Nếu đã Accepted.

Disable Button.

Nếu đã Rejected.

Disable Button.

---

# Candidate Applications

Table.

Title.

Salary.

Location.

Status.

Button.

Hủy.

Nếu Status là:

Accepted.

Ẩn nút Hủy.

---

# Button

Primary.

Màu xanh.

Secondary.

Viền xanh.

Danger.

Màu đỏ.

Success.

Màu xanh lá.

---

# Loading

Hiển thị Spinner.

Không để màn hình trắng.

---

# Empty State

Nếu không có Job.

Hiển thị.

"Không có công việc phù hợp."

Nếu chưa Apply.

Hiển thị.

"Bạn chưa ứng tuyển công việc nào."

---

# Error

Nếu API lỗi.

Hiển thị Alert hoặc Toast.

Không hiển thị lỗi mặc định của trình duyệt.

---

# Notification

Các thao tác thành công.

Hiển thị Toast.

Ví dụ.

Đăng nhập thành công.

Ứng tuyển thành công.

Cập nhật thành công.

Xóa thành công.

---

# Animation

Hover Button.

Hover Card.

Transition khoảng:

0.2s

Không sử dụng Animation phức tạp.

---

# Khoảng cách

Website sử dụng nhiều khoảng trắng.

Padding lớn.

Margin hợp lý.

Không đặt các Component sát nhau.

Ưu tiên giao diện thoáng như TopCV.

---

# Icon

Có thể sử dụng:

Lucide React

hoặc

React Icons

Ví dụ.

Location.

Salary.

Search.

User.

Logout.

Dashboard.

Briefcase.

---

# CSS

Ưu tiên:

CSS Modules

hoặc

Tailwind CSS.

Nếu dùng Tailwind thì tổ chức Component rõ ràng.

Không viết CSS lặp lại.

---

# Nguyên tắc thiết kế

Frontend phải mang cảm giác giống TopCV nhưng không sao chép giao diện hoặc tài nguyên của TopCV.

Cursor nên xây dựng giao diện theo phong cách:

- Hiện đại
- Tối giản
- Chuyên nghiệp
- Thống nhất màu sắc
- Responsive
- Dễ mở rộng
- Ưu tiên trải nghiệm người dùng
- Component tái sử dụng
- Mã nguồn sạch, dễ bảo trì

---

# PHỤ LỤC C - FRONTEND TECH STACK

## Mục tiêu

Frontend phải được xây dựng bằng hệ sinh thái React hiện đại.

Ưu tiên code dễ đọc, dễ mở rộng và phù hợp với dự án thực tế.

Không sử dụng thư viện lỗi thời hoặc ít được cộng đồng sử dụng.

---

# Framework

React

Khởi tạo bằng:

Vite

Không sử dụng:

- Create React App
- Next.js
- Remix

---

# Ngôn ngữ

JavaScript (ES6+)

Không sử dụng TypeScript trong phiên bản hiện tại.

---

# Routing

React Router DOM

Sử dụng BrowserRouter.

Không tự xây dựng Router.

---

# HTTP Client

Axios

Toàn bộ request phải đi qua một Axios Instance chung.

Không gọi fetch().

Không gọi axios trực tiếp trong từng component.

---

# Styling

Ưu tiên:

Tailwind CSS

Nếu cần CSS riêng:

CSS Modules

Không sử dụng:

Bootstrap

Material UI

Ant Design

Semantic UI

Trừ khi có yêu cầu bổ sung.

---

# Form

React Hook Form

Sử dụng để quản lý Form.

Không dùng useState cho từng Input nếu là Form lớn.

---

# Validation

Zod

Kết hợp với React Hook Form.

Validation phía Frontend chỉ nhằm nâng cao trải nghiệm người dùng.

Backend vẫn là nơi xác thực cuối cùng.

---

# Notification

React Hot Toast

Sử dụng Toast cho:

Đăng nhập thành công.

Đăng ký thành công.

Ứng tuyển thành công.

Xóa thành công.

Lỗi từ Backend.

Không sử dụng alert().

---

# Icon

Lucide React

Nếu thiếu Icon mới dùng React Icons.

---

# Loading

Hiển thị Spinner hoặc Skeleton.

Không để giao diện trắng khi chờ API.

---

# State Management

Hiện tại chỉ sử dụng:

Context API

useContext

useState

useEffect

Chưa cần:

Redux

Redux Toolkit

MobX

Zustand

Recoil

---

# API Layer

Mỗi nhóm API là một file riêng.

Ví dụ.

authApi.js

jobApi.js

applicationApi.js

dashboardApi.js

Không viết API trong Component.

---

# Authentication

JWT lưu trong Local Storage.

Axios Interceptor tự động thêm:

Authorization Header.

---

# Build Tool

Vite

Không thay đổi sang Webpack hoặc công cụ khác.

---

# Package Manager

npm

Không sử dụng yarn hoặc pnpm trong dự án này.

---

# Cấu trúc mong muốn

React

↓

React Router

↓

Context API

↓

Axios

↓

Spring Boot REST API

↓

MySQL

---

# PHỤ LỤC D - FRONTEND CODING CONVENTION

## Mục tiêu

Toàn bộ mã nguồn Frontend phải đồng nhất về cách đặt tên, cấu trúc và phong cách lập trình.

Ưu tiên:

- Clean Code
- Readable Code
- Reusable Component
- Dễ bảo trì
- Dễ mở rộng

---

# Đặt tên Component

Sử dụng PascalCase.

Ví dụ.

JobCard.jsx

Navbar.jsx

LoginForm.jsx

ProtectedRoute.jsx

Không sử dụng.

jobcard.jsx

navbar.jsx

---

# Đặt tên Hook

Sử dụng:

use...

Ví dụ.

useAuth()

useJob()

useApplication()

---

# Đặt tên Function

camelCase.

Ví dụ.

handleLogin()

handleSubmit()

fetchJobs()

deleteJob()

updateStatus()

---

# Đặt tên biến

camelCase.

Ví dụ.

jobList

currentUser

applicationList

searchKeyword

---

# Đặt tên hằng số

UPPER_CASE.

Ví dụ.

BASE_URL

TOKEN_KEY

DEFAULT_PAGE_SIZE

---

# Tách Component

Một Component chỉ nên có một trách nhiệm chính.

Ví dụ.

JobCard

chỉ hiển thị một Job.

Không gọi API.

---

JobList

gọi API.

Render nhiều JobCard.

---

# Tách API

Không viết.

axios.get(...)

trong Component.

Thay vào đó.

Component

↓

jobApi.js

↓

axios.js

↓

Backend

---

# useEffect

Không viết logic quá dài trong useEffect.

Nên tách thành Function riêng.

Ví dụ.

fetchJobs()

---

# JSX

Ưu tiên JSX ngắn gọn.

Nếu điều kiện phức tạp.

Nên xử lý trước khi return.

Không viết quá nhiều toán tử lồng nhau.

---

# Props

Destructuring Props.

Ví dụ.

```jsx
function JobCard({ job }) {

}
```

Không viết.

```jsx
props.job
```

nhiều lần.

---

# Comment

Chỉ comment khi thực sự cần.

Không comment cho những đoạn code dễ hiểu.

---

# CSS

Ưu tiên Utility Class của Tailwind.

Không viết inline style.

Ví dụ.

Sai.

```jsx
style={{marginTop:10}}
```

Đúng.

```jsx
mt-2
```

---

# Xử lý API

Mọi API đều phải:

try

↓

catch

↓

Toast

Không để Promise bị bỏ qua.

---

# Error

Hiển thị lỗi từ Backend.

Ví dụ.

```json
{
    "message":"Job không tồn tại"
}
```

Hiển thị đúng nội dung.

Không thay bằng.

"Something went wrong."

---

# Loading

Mỗi API đều nên có.

loading

↓

Spinner

↓

Ẩn Spinner

---

# Empty State

Nếu dữ liệu rỗng.

Hiển thị Component Empty.

Không để bảng trắng.

---

# Reusable Component

Ưu tiên tái sử dụng.

Ví dụ.

Button

Modal

Input

SearchBar

Table

Pagination

Card

---

# Không lặp code

Nếu một đoạn code xuất hiện từ 2 lần trở lên.

Nên tách thành Component hoặc Function.

---

# React Router

Mỗi Page nằm trong:

pages/

Các Component nhỏ nằm trong:

components/

Không đặt lẫn lộn.

---

# Auth

Không kiểm tra JWT bằng cách tự giải mã.

Frontend chỉ cần:

Có Token.

↓

Gửi Token.

↓

Backend xác thực.

---

# Business Logic

Frontend không được:

Tự tính Dashboard.

Tự quyết định Role.

Tự quyết định Candidate đã Apply.

Tự quyết định Employer có quyền sửa Job.

Toàn bộ Business Logic thuộc Backend.

---

# API Endpoint

Không hard-code nhiều nơi.

Nên gom toàn bộ Endpoint vào một file nếu cần.

---

# Chất lượng mã nguồn

Cursor cần tạo mã theo các tiêu chí:

- Component nhỏ
- Hàm ngắn
- Tên biến rõ nghĩa
- Không lặp code
- Có thể mở rộng
- Có thể tái sử dụng
- Đúng chuẩn React hiện đại

---

# Quy tắc quan trọng nhất

Frontend phải tuân thủ hoàn toàn Backend hiện có.

Không được:

- đổi endpoint
- đổi DTO
- đổi business rule
- đổi response
- đổi request

Nếu cần tính năng mới, phải bổ sung API từ Backend thay vì tự giả định.

---

# PHỤ LỤC E - IMPLEMENTATION ROADMAP

## Mục tiêu

Frontend phải được xây dựng theo đúng thứ tự dưới đây.

Không được bỏ qua bước.

Không được thực hiện đồng thời nhiều module khi module trước chưa hoàn thành.

Mỗi bước phải:

- Hoàn thành.
- Chạy được.
- Không có lỗi.
- Có thể kiểm thử.

Sau đó mới chuyển sang bước tiếp theo.

---

# Giai đoạn 1 - Khởi tạo dự án

## Bước 1

Khởi tạo dự án React bằng Vite.

```bash
npm create vite@latest
```

Chọn:

React

JavaScript

---

## Bước 2

Cài đặt toàn bộ thư viện.

Bao gồm:

- React Router DOM
- Axios
- Tailwind CSS
- React Hook Form
- Zod
- React Hot Toast
- Lucide React

Không cài thêm thư viện nếu không cần thiết.

---

## Bước 3

Cấu hình Tailwind CSS.

Đảm bảo Tailwind hoạt động.

---

## Bước 4

Tạo cấu trúc thư mục.

```text
api/
components/
pages/
hooks/
context/
utils/
```

---

# Giai đoạn 2 - Kết nối Backend

## Bước 5

Tạo Axios Instance.

Bao gồm:

- baseURL
- timeout (nếu cần)
- Interceptor

---

## Bước 6

Tạo các API Module.

authApi

jobApi

applicationApi

dashboardApi

Không gọi API trực tiếp trong Component.

---

# Giai đoạn 3 - Authentication

## Bước 7

Xây dựng trang Login.

Kết nối:

POST /auth/login

---

## Bước 8

Lưu JWT.

Sau khi Login thành công.

Lưu vào Local Storage.

---

## Bước 9

Tạo AuthContext.

Quản lý:

Token

Role

Login

Logout

Trạng thái đăng nhập

---

## Bước 10

Tạo Protected Route.

Chặn các trang yêu cầu đăng nhập.

---

## Bước 11

Logout.

Xóa Token.

Quay về Login.

---

# Giai đoạn 4 - Giao diện chung

## Bước 12

Tạo Navbar.

Navbar thay đổi theo Role.

Guest

Candidate

Employer

---

## Bước 13

Tạo Footer.

Đơn giản.

---

## Bước 14

Tạo Layout chung.

Header

Main

Footer

---

# Giai đoạn 5 - Job

## Bước 15

Trang Job List.

Kết nối:

GET /jobs

---

## Bước 16

Tạo Search Bar.

Kết nối:

GET /jobs/search

---

## Bước 17

Job Detail.

GET /jobs/{id}

---

## Bước 18

Candidate Apply.

POST /jobs/{id}/apply

---

# Giai đoạn 6 - Candidate

## Bước 19

Trang My Applications.

GET /users

---

## Bước 20

Delete Application.

DELETE /applications/{id}

---

# Giai đoạn 7 - Employer

## Bước 21

Dashboard.

GET /employer/dashboard

---

## Bước 22

Create Job.

POST /jobs

---

## Bước 23

Edit Job.

PUT /jobs/{id}

---

## Bước 24

Delete Job.

DELETE /jobs/{id}

---

## Bước 25

Danh sách Candidate.

GET /jobs/{id}/applications

---

## Bước 26

Accept Candidate.

PATCH /jobs/{applicationId}

Status:

ACCEPTED

---

## Bước 27

Reject Candidate.

PATCH /jobs/{applicationId}

Status:

REJECTED

---

# Giai đoạn 8 - Hoàn thiện

## Bước 28

Responsive.

Desktop

Tablet

Mobile

---

## Bước 29

Loading.

Spinner.

Skeleton.

---

## Bước 30

Toast.

Thành công.

Thất bại.

---

## Bước 31

Validation.

React Hook Form.

Zod.

---

## Bước 32

Empty State.

Không có Job.

Không có Application.

---

## Bước 33

Error Page.

404.

Unauthorized.

---

## Bước 34

Kiểm tra toàn bộ luồng.

Guest

Candidate

Employer

---

# Quy trình làm việc của Cursor

Cursor phải tuân thủ quy trình sau:

1. Đọc toàn bộ tài liệu này trước khi viết mã.

2. Không thay đổi API, DTO hoặc Business Rule.

3. Thực hiện theo đúng thứ tự của Roadmap.

4. Sau khi hoàn thành một bước:
   - Kiểm tra lỗi.
   - Đảm bảo chạy được.
   - Sau đó mới chuyển sang bước tiếp theo.

5. Nếu thiếu dữ liệu từ Backend:
   - Không tự tạo endpoint.
   - Không tự sửa response.
   - Không tự thêm field.
   - Ghi chú rõ Backend cần bổ sung gì.

6. Nếu cần tạo component mới:
   - Ưu tiên tái sử dụng.
   - Đặt đúng thư mục.
   - Tuân thủ Coding Convention.

7. Luôn ưu tiên mã nguồn:
   - Dễ đọc.
   - Dễ mở rộng.
   - Tách component hợp lý.
   - Không lặp code.

8. Khi hoàn thành toàn bộ dự án:
   - Kiểm tra toàn bộ chức năng.
   - Kiểm tra responsive.
   - Kiểm tra tất cả API.
   - Loại bỏ code không sử dụng.

---

# Tiêu chí hoàn thành

Frontend được coi là hoàn thành khi đáp ứng đầy đủ các điều kiện sau:

- Kết nối thành công với Backend hiện tại.
- Sử dụng đúng tất cả endpoint và DTO.
- Giao diện hiện đại, nhất quán, lấy cảm hứng từ TopCV.
- Responsive trên Desktop, Tablet và Mobile.
- Quản lý JWT và phân quyền đúng.
- Hiển thị đầy đủ các chức năng theo từng Role.
- Mã nguồn sạch, dễ đọc, dễ mở rộng và tuân thủ Coding Convention.

---

# Chỉ dẫn cuối cùng dành cho AI (Cursor)

Đây là dự án thật, không phải ví dụ minh họa.

Hãy coi tài liệu này là **nguồn chân lý duy nhất (single source of truth)** cho frontend.

Nếu tài liệu và suy đoán của AI mâu thuẫn với nhau, **luôn ưu tiên tài liệu**.

Không tự ý:
- đổi endpoint,
- đổi DTO,
- đổi business rule,
- thêm tính năng chưa được mô tả.

Mọi màn hình phải được xây dựng từ các API đã có.

Nếu Backend chưa hỗ trợ một chức năng thì bỏ qua chức năng đó.

Không được tự triển khai theo suy đoán.

Tôi đã cập nhật backend.

Một endpoint mới đã được thêm:

GET /employer/jobs

Thông tin endpoint:

- Role:
  - EMPLOYER
  - ADMIN

- Mục đích:
  Lấy danh sách các job mà employer hiện tại đã tạo.

- Authentication:
  JWT Bearer Token bắt buộc.

- Không truyền employerId từ frontend.
  Backend lấy employer hiện tại từ SecurityContextHolder thông qua JWT.

- Response:
  List<JobResponse>

Ví dụ:

[
  {
    "id": 1,
    "title": "Java Backend Developer",
    "description": "Spring Boot Developer",
    "salary": 1500,
    "location": "Ha Noi",
    "createdAt": "2026-07-08T10:30:00"
  }
]

Hãy cập nhật lại hiểu biết về backend.

Chỉ phân tích thay đổi, chưa viết code frontend.

--------------------------

Backend đã được cập nhật.

Tôi đã bổ sung endpoint mới:

GET /employer/jobs

Ngoài ra SecurityConfig đã được cập nhật:

GET /employer/jobs
requires:
- JWT authentication
- ROLE_EMPLOYER
- ROLE_ADMIN

Hãy cập nhật lại hiểu biết về backend hiện tại.

Xác nhận lại:
1. Các role và quyền của từng role
2. Các API frontend có thể sử dụng
3. Các màn hình frontend hiện đã đủ dữ liệu để triển khai

Chưa viết code.
Chỉ phân tích.
## JWT Payload

The generated JWT contains the following claims:

- sub: User ID
- role: User Role (CANDIDATE | EMPLOYER | ADMIN)
- iat: Issued At
- exp: Expiration Time

Frontend should decode the JWT to determine the authenticated user's role.
No additional API call is required.