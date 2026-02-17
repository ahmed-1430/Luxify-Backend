# 🛒 Luxify E-Commerce API Documentation

> Backend Status: Production Ready  
> Stack: Express + MongoDB + JWT + Stripe + Cloudinary  

---

# 🌍 Base URL

### Development

https://luxify-backend-blue.vercel.app/api


---

# 🔐 Authentication

All protected routes require:



Authorization: Bearer <JWT_TOKEN>



JWT is returned from:
- `/auth/login`
- `/auth/google`

---

# 👤 Authentication APIs

---

## 🔹 Register

**POST** `/auth/register`

### Body
```json
{
  "name": "Ahmed",
  "email": "ahmed@gmail.com",
  "password": "123456"
}


Response
{
  "message": "User registered successfully",
  "user": {
    "id": "USER_ID",
    "email": "ahmed@gmail.com",
    "role": "customer"
  }
}


Login
POST /auth/login
{
  "email": "ahmed@gmail.com",
  "password": "123456"
}

Response
{
  "token": "JWT_TOKEN",
  "user": {
    "id": "USER_ID",
    "role": "customer"
  }
}

Google Login
POST /auth/google
{
  "idToken": "GOOGLE_ID_TOKEN"
}


Returns same structure as login.

🛍 Products API
Get All Products
GET /products
Query Parameters
Param	Example
search	?search=iphone
category	?category=Mobiles
featured	?featured=true
minPrice	?minPrice=100
maxPrice	?maxPrice=1000
page	?page=1
limit	?limit=10
Get Single Product
GET /products/:id

Returns:

images

features

specifications

rating

reviews

reviewsCount

⭐ Reviews
Add Review
POST /reviews/:productId

Auth Required

{
  "rating": 5,
  "comment": "Amazing product!"
}


Rules:

One review per user per product

🛒 Cart APIs

All require authentication.

Get Cart
GET /cart
{
  "items": [],
  "subtotal": 600,
  "shipping": 0,
  "tax": 60,
  "discount": 0,
  "total": 660
}

Add to Cart
POST /cart
{
  "productId": "PRODUCT_ID",
  "quantity": 2
}

Update Quantity
PUT /cart
{
  "productId": "PRODUCT_ID",
  "quantity": 5
}

Remove Item
DELETE /cart/:productId
Clear Cart
DELETE /cart
Apply Promo Code
POST /cart/apply-coupon
{
  "code": "WELCOME15"
}


Supported codes:

WELCOME15

SAVE10

FREESHIP

💳 Checkout (Stripe)
Create Payment Intent
POST /checkout/create-payment-intent

Response:

{
  "clientSecret": "pi_xxx_secret_xxx",
  "cartTotal": 670.96
}

Frontend Stripe Flow

Call create-payment-intent

Use clientSecret with stripe.confirmPayment()

DO NOT create order manually

Order is created automatically via webhook

📦 Orders
My Orders
GET /orders/my-orders
Order Details
GET /orders/:id
👨‍💼 Admin APIs

Require:

Authorization: Bearer ADMIN_JWT

🛍 Admin Products
Method	Endpoint
POST	/admin/products
PUT	/admin/products/:id
DELETE	/admin/products/:id
PATCH	/admin/products/featured/:id
👥 Admin Users
Method	Endpoint
GET	/admin/users
PATCH	/admin/users/block/:id
PATCH	/admin/users/role/:id
📦 Admin Orders
Method	Endpoint
GET	/orders/admin/all
PUT	/orders/admin/status/:id

Order status values:

processing

shipped

delivered

📊 Analytics (Admin Only)
Endpoint	Purpose
GET /analytics/dashboard	Revenue + stats
GET /analytics/daily-sales	Sales chart
GET /analytics/top-products	Top 5 products
GET /analytics/recent-orders	Latest 10 orders
🖼 Image Upload (Admin Only)
Upload Single Image
POST /upload/single

Form-data:

image: File

Upload Multiple Images
POST /upload/multiple

Form-data:

images: File[]

⚙️ Role-Based Access
Role	Access
customer	shop + cart + orders
admin	full dashboard
staff	(limited admin if configured)
🚨 Error Format

Errors may return:

{
  "error": "Something went wrong"
}


OR

{
  "message": "Validation error"
}


Frontend should handle both.

🧠 Frontend Developer Notes

Always include Authorization header for protected routes.

Stripe webhook automatically creates orders.

Do NOT create orders manually from frontend.

Cart totals (tax, shipping, discount) are calculated by backend.

Featured products can be fetched via:

GET /products?featured=true

✅ Backend Feature Status

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