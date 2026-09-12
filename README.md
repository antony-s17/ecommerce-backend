# Pixel Market Backend

📌 Description

Backend REST API for **Pixel Market**, a full-stack video game e-commerce application.

The API provides user authentication, role-based authorization, product management, shopping cart, wishlist, product reviews, order creation, image uploads and Stripe Checkout payment integration.

Product, user, cart, wishlist and order information is persisted in PostgreSQL using Prisma ORM, while product reviews are managed with MongoDB and Mongoose.

Product images are stored through Cloudinary.

Payments are processed through **Stripe Checkout**. The backend creates Stripe Checkout Sessions, verifies completed payments with Stripe and creates orders only after a successful payment confirmation.

Interactive OpenAPI documentation is available through Swagger UI at `/api/docs`.

---

## 🚀 Demo / Docs

- Backend API: `https://ecommerce-backend-6dm1.onrender.com/api`
- Swagger UI: `https://ecommerce-backend-6dm1.onrender.com/api/docs/`

For the deployed version, replace the localhost URLs with the production backend URL.

---

## 🛠️ Technologies

- Node.js
- Express 5
- JavaScript (ES Modules)
- PostgreSQL
- Prisma ORM
- MongoDB
- Mongoose
- JWT authentication
- HTTP-only cookies
- bcrypt
- Stripe Checkout
- Cloudinary
- Multer
- Swagger / OpenAPI
- swagger-jsdoc
- swagger-ui-express
- pnpm

---

## ✨ Features

### Authentication

- User registration
- User login
- User logout
- Password hashing with bcrypt
- JWT authentication
- Authentication through HTTP-only cookies
- Authenticated user profile
- Role-based authorization
- USER and ADMIN roles

### Products

- Get product catalog
- Get product by ID
- Create products
- Update products
- Delete products
- Product stock management
- Product price management
- Product image uploads
- Cloudinary image storage
- Administrator-only product management

### Shopping Cart

- Create and manage active carts
- Add products to cart
- Increment product quantities
- Retrieve cart information
- Calculate product subtotals
- Calculate cart total
- Checkout integration

### Stripe Payments

- Create Stripe Checkout Sessions
- Redirect users to Stripe-hosted Checkout
- Stripe test mode support
- Payment verification
- Checkout Session validation
- User validation through Stripe metadata
- Order creation only after successful payment
- Checkout confirmation endpoint

### Orders

- Create orders after successful payment
- Store purchased products
- Store purchase-time prices
- Calculate order total
- Associate orders with authenticated users
- Mark carts as completed after checkout

### Wishlist

- Add products to wishlist
- Retrieve authenticated user's wishlist
- Remove products from wishlist

### Reviews

- Create product reviews
- Retrieve product reviews
- 1–5 star rating
- User comments
- MongoDB persistence using Mongoose

### API Documentation

- Swagger UI
- OpenAPI schemas
- Documented authentication
- Documented product operations
- Documented cart operations
- Shared API schemas

---

## 📂 Project Structure

```text
ecommerce-backend/

├── prisma/
│   └── schema.prisma
│
├── src/
│   ├── config/
│   │   ├── stripe.js
│   │   └── ...
│   │
│   ├── controllers/
│   │   ├── auth.js
│   │   ├── cart.js
│   │   ├── product.js
│   │   ├── user.js
│   │   ├── wishlist.js
│   │   └── ...
│   │
│   ├── db/
│   │   └── ...
│   │
│   ├── docs/
│   │   ├── schemas/
│   │   └── ...
│   │
│   ├── middlewares/
│   │   ├── authenticate.js
│   │   └── ...
│   │
│   ├── misc/
│   │   └── errors.js
│   │
│   ├── routes/
│   │   ├── auth.js
│   │   ├── cart.js
│   │   ├── product.js
│   │   ├── user.js
│   │   ├── wishlist.js
│   │   └── ...
│   │
│   ├── services/
│   │   ├── auth.js
│   │   ├── cart.js
│   │   ├── product.js
│   │   ├── stripe.js
│   │   ├── wishlist.js
│   │   └── ...
│   │
│   ├── utils/
│   │   └── ...
│   │
│   ├── app.js
│   └── server.js
│
├── .env
├── package.json
├── pnpm-lock.yaml
└── README.md
```

---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/antony-s17/ecommerce-backend.git

cd ecommerce-backend
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure environment variables

Create a `.env` file in the project root.

Example:

```env
PORT=3000

DATABASE_URL=postgresql://...

MONGO_URI=mongodb://...

JWT_SECRET=your_jwt_secret

STRIPE_SECRET_KEY=sk_test_...

FRONTEND_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

> Never commit the `.env` file or expose secret credentials in the repository.

For production, `FRONTEND_URL` must point to the deployed frontend instead of localhost.

Example:

```env
FRONTEND_URL=https://your-frontend.netlify.app
```

---

## ▶️ Run in Development

Start the development server:

```bash
pnpm run dev
```

The API will normally be available at:

```text
http://localhost:3000
```

API base URL:

```text
http://localhost:3000/api
```

Swagger documentation:

```text
http://localhost:3000/api/docs
```

---

## 👤 Demo Credentials

To test administrator features, use the following demo account:

- **Email:** `admin@gmail.com`
- **Password:** `admin123`

These credentials are provided for evaluation purposes only.

---

## 🔐 Authentication

Pixel Market uses JWT authentication.

After a successful login, the backend creates an `access_token` and sends it using an HTTP-only cookie.

The frontend then sends the cookie automatically with authenticated requests.

The authentication flow is:

```text
Login
   ↓
POST /api/auth/login
   ↓
Validate credentials
   ↓
Generate JWT
   ↓
HTTP-only access_token cookie
   ↓
Authenticated requests
   ↓
authenticate middleware
   ↓
Protected resource
```

Protected endpoints use:

```text
access_token
```

to identify the authenticated user.

Administrator operations additionally verify that the authenticated user has the `ADMIN` role.

---

## 🔌 API Base Paths

The main API resources are:

```text
/api/auth
/api/user
/api/product
/api/cart
/api/wishlist
```

Product reviews are nested under products:

```text
/api/product/{productId}/reviews
```

---

# API Endpoints

Below are the main API endpoints.

For complete request and response schemas, use the Swagger documentation available at:

```text
/api/docs
```

---

## 🔑 Authentication

### Register User

```http
POST /api/auth/register
```

Request:

```json
{
  "username": "jdoe",
  "email": "jdoe@example.com",
  "password": "strongpassword"
}
```

Example:

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"jdoe","email":"jdoe@example.com","password":"secret"}'
```

---

### Login

```http
POST /api/auth/login
```

Request:

```json
{
  "email": "jdoe@example.com",
  "password": "secret"
}
```

Example:

```bash
curl -i -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"jdoe@example.com","password":"secret"}'
```

A successful login sets the `access_token` HTTP-only cookie.

---

### Logout

```http
POST /api/auth/logout
```

Requires an authenticated session.

The endpoint clears the authentication cookie.

---

## 👤 User

### Get Authenticated Profile

```http
GET /api/user/profile
```

Requires authentication.

Example:

```bash
curl -b "access_token=..." \
  http://localhost:3000/api/user/profile
```

---

## 🎮 Products

### Get All Products

```http
GET /api/product
```

---

### Get Product

```http
GET /api/product/{id}
```

---

### Create Product

```http
POST /api/product
```

Requires:

```text
ADMIN
```

Product creation supports product information and image upload.

The request uses `multipart/form-data`.

Example structure:

```text
product → JSON product information
image   → image file
```

Product images are uploaded to Cloudinary.

---

### Update Product

```http
PUT /api/product/{id}
```

Requires:

```text
ADMIN
```

Supports updating product information and product images.

---

### Delete Product

```http
DELETE /api/product/{id}
```

Requires:

```text
ADMIN
```

---

## ⭐ Reviews

### Create Product Review

```http
POST /api/product/{productId}/reviews
```

Requires authentication.

A review contains:

```json
{
  "rating": 5,
  "comment": "Excellent game!"
}
```

Ratings use a range from:

```text
1–5
```

---

### Get Product Reviews

```http
GET /api/product/{productId}/reviews
```

Reviews are persisted using MongoDB and Mongoose.

---

## 🛒 Cart

### Add Product to Cart

```http
POST /api/cart
```

Requires authentication.

Request:

```json
{
  "productId": "<product-id>"
}
```

If the product already exists in the active cart, its quantity can be incremented by the cart service.

---

### Get Cart

```http
GET /api/cart
```

Requires authentication.

The response contains information such as:

```text
Cart ID
Products
Quantity
Unit price
Subtotal
```

---

## 💳 Stripe Checkout

Pixel Market uses **Stripe Checkout** to process payments.

The backend is responsible for communicating with Stripe. Stripe secret credentials are never exposed to the frontend.

### Create Checkout Session

```http
POST /api/cart/checkout
```

Requires authentication.

The backend retrieves the authenticated user's active cart and converts the cart products into Stripe `line_items`.

Example internal Stripe structure:

```js
{
  price_data: {
    currency: "pen",

    product_data: {
      name: product.name
    },

    unit_amount: Math.round(
      Number(product.price) * 100
    )
  },

  quantity: product.quantity
}
```

The backend then creates a Stripe Checkout Session.

Stripe metadata contains information used to associate the payment with the application:

```text
userId
cartId
```

The API returns:

```json
{
  "ok": true,
  "data": {
    "url": "https://checkout.stripe.com/...",
    "sessionId": "cs_test_..."
  }
}
```

The frontend redirects the browser to the returned Stripe Checkout URL.

---

### Stripe Checkout Flow

```text
Shopping Cart
      ↓
POST /api/cart/checkout
      ↓
getCartProducts(userId)
      ↓
Create Stripe line_items
      ↓
Stripe Checkout Session
      ↓
Return session.url
      ↓
Frontend redirects to Stripe
      ↓
User completes payment
      ↓
Stripe redirects to frontend
      ↓
/checkout/success?session_id=...
      ↓
POST /api/cart/checkout/confirm
      ↓
Backend retrieves Stripe Session
      ↓
Verify payment_status
      ↓
Validate user
      ↓
createOrder(userId)
      ↓
Order created
      ↓
Cart completed
```

---

### Confirm Stripe Checkout

```http
POST /api/cart/checkout/confirm
```

Requires authentication.

Request:

```json
{
  "sessionId": "cs_test_..."
}
```

The backend retrieves the Checkout Session directly from Stripe:

```js
stripe.checkout.sessions.retrieve(sessionId)
```

The payment must satisfy:

```text
payment_status === "paid"
```

The backend also validates:

```text
session.metadata.userId === authenticated user ID
```

If both validations succeed, the order is created.

This prevents the frontend from creating an order simply by reporting that a payment succeeded.

---

### Stripe Test Mode

The project currently uses Stripe in test mode.

Standard Stripe test card:

```text
Card number: 4242 4242 4242 4242
Expiration: Any future date
CVC: Any valid 3-digit value
```

No real payment is processed while Stripe test credentials are being used.

---

## 📦 Order Creation

Orders are created only after the Stripe payment has been successfully verified.

The order process is:

```text
Stripe payment confirmed
        ↓
createOrder(userId)
        ↓
Read active cart
        ↓
Calculate total
        ↓
Create Order
        ↓
Create OrderItems
        ↓
Store purchase-time prices
        ↓
Mark Cart as CHECKED_OUT
```

Purchase-time prices are stored separately so that future product price changes do not alter historical order information.

---

## ❤️ Wishlist

### Add Product to Wishlist

```http
POST /api/wishlist
```

Requires authentication.

Request:

```json
{
  "productId": "<product-id>"
}
```

---

### Get Wishlist

```http
GET /api/wishlist
```

Requires authentication.

---

### Remove Product from Wishlist

```http
DELETE /api/wishlist/{productId}
```

Requires authentication.

---

## 🖼️ Product Images

Product creation and updates support image uploads.

Images are processed by the backend and uploaded to **Cloudinary**.

The database stores the resulting image URL instead of storing the image binary directly.

General flow:

```text
Frontend
   ↓
multipart/form-data
   ↓
Multer
   ↓
Backend
   ↓
Cloudinary
   ↓
Image URL
   ↓
PostgreSQL
```

---

## 🗄️ Data Persistence

Pixel Market uses two database technologies.

### PostgreSQL + Prisma

Used for the main transactional e-commerce information:

```text
Users
Products
Carts
CartItems
Orders
OrderItems
Wishlist
```

### MongoDB + Mongoose

Used for:

```text
Product Reviews
```

This allows the project to demonstrate integration with both relational and document-oriented persistence.

---

## 🌤️ API Documentation

Swagger UI is available at:

```text
/api/docs
```

OpenAPI schemas are organized under:

```text
src/docs/schemas/
```

The documentation describes the main API resources, request structures and authentication requirements.

---

## 🛡️ Security

Security-related practices include:

- Password hashing
- JWT authentication
- HTTP-only authentication cookies
- Protected API endpoints
- Role-based authorization
- Environment variables for secrets
- Backend input validation
- UUID validation
- Centralized error handling
- Stripe secret key stored only in backend
- Stripe payment verification performed server-side
- User validation against Stripe Session metadata

Sensitive credentials such as:

```text
JWT_SECRET
STRIPE_SECRET_KEY
DATABASE_URL
MONGO_URI
CLOUDINARY_API_SECRET
```

must never be committed to the repository.

---

## 📌 Best Practices Applied

- Controller / service / route separation
- Centralized error handling
- Request validation
- Authentication middleware
- Role-based authorization
- Prisma transactions for checkout operations
- REST API architecture
- Environment-based configuration
- Swagger/OpenAPI documentation
- Shared OpenAPI schemas
- HTTP-only cookie authentication
- Server-side payment verification
- Stripe secret isolation
- External image storage with Cloudinary
- Relational persistence with PostgreSQL
- Document persistence with MongoDB
- Purchase-time price preservation

---

## 🔗 Frontend

This backend is consumed by the Pixel Market React frontend.

Frontend repository:

```text
https://github.com/antony-s17/ecommerce-frontend
```

The frontend provides:

- React + Vite interface
- Redux Toolkit state management
- Authentication
- Product catalog
- Shopping cart
- Wishlist
- Reviews
- Administration panel
- Stripe Checkout redirection
- Checkout confirmation
- Responsive design
- Netlify deployment support

---

## 👨‍💻 Author

**Antony Salas**

GitHub: https://github.com/antony-s17

---

## 📄 License

This project was developed for educational and portfolio purposes.