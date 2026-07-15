# 🔧 FixItNow - Home Service Marketplace Backend API

A robust RESTful backend API for **FixItNow**, a home service marketplace that connects customers with skilled technicians. The system supports role-based authentication, service booking, Stripe payment integration, technician management, reviews, and admin-controlled service approval.

---

## 🚀 Live API

https://assignment-4-ph.vercel.app

## 📚 API Documentation

https://documenter.getpostman.com/view/xxxxxxxx

## 🎥 Demo Video

https://drive.google.com/file/d/xxxxxxxx/view

---

## ✨ Features

### 🔐 Authentication
- JWT Authentication
- Access & Refresh Tokens
- Role-based Authorization
- Secure Password Hashing (bcrypt)

### 👤 Customer
- Register & Login
- Browse Categories
- Browse Master Services
- Browse Technicians
- Search & Filter Technicians
- Create Bookings
- Online Payment with Stripe
- View Booking History
- Submit Reviews

### 🛠 Technician
- Create Technician Profile
- Update Profile
- Manage Availability
- Request Service Approval
- Offer Approved Services
- Accept Bookings
- Complete Services

### 👨‍💼 Admin
- Manage Users
- Manage Categories
- Manage Master Services
- Approve/Reject Service Requests
- View Technician Services

### 💳 Payment
- Stripe Checkout
- Secure Webhook Verification
- Automatic Payment Status Update

### ⭐ Reviews
- Customer Reviews
- Automatic Technician Average Rating Calculation

---

# 🏗 Tech Stack

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL (Neon)
- JWT
- Stripe
- Zod
- bcryptjs

---
# 📂 Project Structure

```
src/
├── config/                
├── lib/                    
├── middleware/             
├── modules/
│   ├── auth/               
│   ├── availability/       
│   ├── booking/            
│   ├── category/           
│   ├── MasterService/      
│   ├── payment/            
│   ├── reviews/            
│   ├── serviceRequest/     
│   ├── technicianProfile/  
│   ├── technicianServices/ 
│   └── user/               
├── routes/                 
├── utils/                  
├── app.ts                 
└── server.ts               
```



# 🔄 Application Workflow

## Customer

```
Register/Login
      ↓
Browse Categories
      ↓
Browse Master Services
      ↓
Browse Technicians
      ↓
View Technician Profile
      ↓
Create Booking
      ↓
Stripe Payment
      ↓
Booking Requested
      ↓
Technician Accepts
      ↓
Service Completed
      ↓
Submit Review
```

---

## Technician

```
Register/Login
      ↓
Create Technician Profile
      ↓
Add Availability
      ↓
Request Service Approval
      ↓
Admin Approves
      ↓
Offer Service
      ↓
Receive Booking
      ↓
Accept Booking
      ↓
Complete Service
```

---

## Admin

```
Login
      ↓
Manage Categories
      ↓
Manage Master Services
      ↓
Approve Service Requests
      ↓
Manage Users
```

---

# 🔐 User Roles

- Customer
- Technician
- Admin

---



# 🛠 Installation

Clone the repository

```bash
git clone https://github.com/AbuShahma022/assignment-4.git
```

Install dependencies

```bash
npm install
```

Generate Prisma Client

```bash
npx prisma generate
```

Run migrations

```bash
npx prisma migrate dev
```

Start development server

```bash
npm run dev
```

---

# ⚙ Environment Variables

Create a `.env` file.

```env
DATABASE_URL=

JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=

JWT_ACCESS_EXPIRES_IN=
JWT_REFRESH_EXPIRES_IN=

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

APP_URL=
PORT=
NODE_ENV=
```

---

# 📌 Main API Modules

- Authentication
- Users
- Categories
- Master Services
- Technician Profile
- Technician Services
- Availability
- Bookings
- Payments
- Reviews
- Service Requests

---

# 🚀 Technical Challenges Solved

## Stripe Webhook Integration

Implemented secure Stripe webhook verification to update payment status only after Stripe confirms a successful payment. Technicians cannot accept bookings until payment status becomes **SUCCESS**, ensuring a secure booking workflow.

---

## Shared Location Optimization

Prevented duplicate location records by reusing existing locations. During profile updates, technicians are connected to an existing location or a new one is created without affecting other technicians sharing the same location.

---

## Average Rating Optimization

Automatically recalculated and stored technician average ratings whenever a review is submitted, avoiding expensive calculations on every request.

---

# 👨‍💻 Author

**Md Abu Shahma**

GitHub:
https://github.com/AbuShahma022