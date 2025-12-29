# E-Commerce Backend

REST API for a full-stack e-commerce application built with Node.js, Express, and MongoDB.

## Features
- User authentication (JWT + cookies)
- Product listing with search, sorting, filtering & pagination
- Cart & order management
- Cash on Delivery (COD)
- Order history & order details
- Secure protected routes

## Tech Stack
- Node.js
- Express.js
- MongoDB & Mongoose
- JWT Authentication
- bcrypt
- dotenv

### Deployment
- Railway

### API Routes
- /api/users
- /api/products
- /api/orders

## Environment Variables
- PORT=8000  
- MONGO_URI=your_mongodb_connection_string  
- JWT_SECRET=your_jwt_secret

## Installation & Setup
- git clone https://github.com/CysecGhost/ecommerce-backend.git
- cd ecommerce-backend
- npm install
- npm run dev

## Live API
- https://ghost-ecommerce-backend.up.railway.app/
