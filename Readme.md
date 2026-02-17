# 🛒 Luxify E-Commerce API Documentation

> Backend Status: Production Ready  
> Stack: Express + MongoDB + JWT + Stripe + Cloudinary  

---

# 🌍 Base URL

## Development
http://localhost:5000/api

## Production
https://luxify-backend-blue.vercel.app/api

---

# 🔐 Authentication

All protected routes require:

Authorization: Bearer <JWT_TOKEN>

JWT is returned from:
- POST /auth/login
- POST /auth/google

---

# 👤 Authentication APIs

---

## 🔹 Register

POST /auth/register

### Body
{
  "name": "Ahmed",
  "email": "ahmed@gmail.com",
  "password": "123456"
}

### Response
{
  "message": "User registered successfully",
  "user": {
    "id": "USER_ID",
    "email": "ahmed@gmail.com",
    "role": "customer"
  }
}

---

## 🔹 Login

POST /auth/login

### Body
{
  "email": "ahmed@gmail.com",
  "password": "123456"
}

### Response
{
  "token": "JWT_TOKEN",
  "user": {
    "id": "USER_ID",
    "role": "customer"
  }
}

---

## 🔹 Google Login

POST /auth/google

### Body
{
  "idToken": "GOOGLE_ID_TOKEN"
}

Returns same structure as login.

---

# 🛍 Products APIs

---

## 🔹 Get All Products

GET /products

### Query Parameters

- search=iphone
- category=Mobiles
- featured=true
- minPrice=100
- maxPrice=1000
- page=1
- limit=10

Example:
GET /products?featured=true&limit=8

---

## 🔹 Get Single Product

GET /products/:id

Returns:
- images (main + gallery)
- features
- specifications
- rating
- reviews
- reviewsCount
- featured

---

# ⭐ Reviews

---

## 🔹 Add Review

POST /reviews/:productId

🔒 Authentication Required

Body:
{
  "rating": 5,
  "comment": "Amazing product!"
}

Rules:
- One review per user per product

---

# 🛒 Cart APIs

🔒 All require authentication

---

## 🔹 Get Cart

GET /cart

Response:
{
  "items": [],
  "subtotal": 600,
  "shipping": 0,
  "tax": 60,
  "discount": 0,
  "total": 660
}

---

## 🔹 Add to Cart

POST /cart

{
  "productId": "PRODUCT_ID",
  "quantity": 2
}

---

## 🔹 Update Quantity

PUT /cart

{
  "productId": "PRODUCT_ID",
  "quantity": 5
}

---

## 🔹 Remove Item

DELETE /cart/:productId

---

## 🔹 Clear Cart

DELETE /cart

---

## 🔹 Apply Promo Code

POST /cart/apply-coupon

{
  "code": "WELCOME15"
}

Supported codes:
- WELCOME15 (15% discount)
- SAVE10 (10% discount)
- FREESHIP (Free shipping)

---

# 💳 Checkout (Stripe)

---

## 🔹 Create Payment Intent

POST /checkout/create-payment-intent

Response:
{
  "clientSecret": "pi_xxx_secret_xxx",
  "cartTotal": 670.96
}

### Frontend Stripe Flow

1. Call /checkout/create-payment-intent
2. Use clientSecret with stripe.confirmPayment()
3. DO NOT create order manually
4. Order is created automatically via Stripe Webhook

---

# 📦 Orders

---

## 🔹 My Orders

GET /orders/my-orders

---

## 🔹 Order Details

GET /orders/:id

---

# 👨‍💼 Admin APIs

🔒 Require Admin JWT

Authorization: Bearer ADMIN_JWT

---

# 🛍 Admin Products

POST   /admin/products  
PUT    /admin/products/:id  
DELETE /admin/products/:id  
PATCH  /admin/products/featured/:id  

---

# 👥 Admin Users

GET   /admin/users  
PATCH /admin/users/block/:id  
PATCH /admin/users/role/:id  

---

# 📦 Admin Orders

GET /orders/admin/all  

PUT /orders/admin/status/:id  

Order status values:
- processing
- shipped
- delivered

---

# 📊 Analytics (Admin Only)

GET /analytics/dashboard  
GET /analytics/daily-sales  
GET /analytics/top-products  
GET /analytics/recent-orders  

---

# 🖼 Image Upload (Admin Only)

---

## 🔹 Upload Single Image

POST /upload/single  

Form-data:
image: File

---

## 🔹 Upload Multiple Images

POST /upload/multiple  

Form-data:
images: File[]

---

# 🔐 Role-Based Access

customer → shop + cart + orders  
admin → full dashboard  
staff → limited admin (if configured)

---

# 🚨 Error Response Format

Errors may return:

{
  "error": "Something went wrong"
}

OR

{
  "message": "Validation error"
}

Frontend should handle both formats.

---

# 🧠 Important Notes for Frontend Developer

- Always include Authorization header for protected routes.
- Stripe webhook automatically creates orders.
- Do NOT create orders manually from frontend.
- Cart totals (tax, shipping, discount) are calculated by backend.
- Featured products endpoint:
  GET /products?featured=true

---

# ✅ Backend Features Completed

✔ Email & Google Authentication  
✔ Product Management  
✔ Reviews System  
✔ Cart with Tax & Shipping  
✔ Promo Codes  
✔ Stripe Payments  
✔ Stripe Webhook Automation  
✔ Orders  
✔ Admin Dashboard  
✔ Analytics  

---

