# 🎬 BookMyShow Clone

A full-stack clone of the popular ticket booking platform **BookMyShow**, built to demonstrate practical use of authentication, authorization, and booking workflows for users, partners, and admins.

## 🚀 Features

### 👤 User
- Register and Login
- View list of available movies and theaters
- Book tickets by selecting seats and making secure payments
- Receive ticket details via email
- Reset password if forgotten

### 🧑‍💼 Partner
- Register and login as a theater partner
- Add theaters for approval by admin
- Once approved, add shows with:
  - Show timing
  - Seat layout
  - Pricing

### 🛠️ Admin
- View and manage theaters added by partners
- Approve or block theaters to control platform integrity

---

## 🔐 Authentication & Roles
Role-based access:
- **User**: Can browse and book
- **Partner**: Can manage theaters and shows
- **Admin**: Has platform control privileges

Secure password handling using **bcrypt** and **JWT-based authentication** for protected routes.

---

## 🧰 Tech Stack

| Tech | Description |
|------|-------------|
| **Frontend** | React |
| **Backend**  | Node.js, Express.js |
| **Database** | MongoDB with Mongoose |
| **Security** | Helmet, Rate Limiting, Input Sanitization |
| **Mailing**  | Nodemailer |
| **Payments** | Stripe (or Mock Payment Integration) |
| **Deployment** | Coming Soon |

---

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/bookmyshow-clone.git
   
