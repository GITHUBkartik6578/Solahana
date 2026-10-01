# 💎 SOLAHANA — Premium Financial Planning Platform

> A production-ready financial planning and wealth management platform built using the MERN Stack with a luxury fintech user experience.

---

## 📸 Project Preview

> *Note: High-resolution screenshots of the live platform will be added here.*

* **Home Page**: Luxury editorial hero section, methodology timeline, and interactive goal desks.
* **Financial Planning Page**: Comprehensive goal planning, retirement structuring, and estate planning modules.
* **Consultation Dashboard**: Client portal to manage private 1-on-1 advisory sessions and status badges.
* **Admin Dashboard**: Fiduciary CRM table to filter, confirm, update meeting links, and manage client bookings.
* **Calculators**: Financial planning tools for compounding, FIRE retirement, and tax loss harvesting.

---

## 📖 About The Project

**SOLAHANA** is a modern, full-stack wealth management and goal-based financial planning application designed to bring quiet luxury aesthetics to retail wealth planning. Inspired by elite institutional fintech platforms like Stripe, Apple, and Fintoo, SOLAHANA bridges the gap between complex financial calculations and intuitive user experiences.

The platform provides holistic frameworks for:
* **Goal-Based Financial Planning**: Structuring wealth around life milestones.
* **Retirement Planning (FIRE)**: Indexing passive income against inflation for early retirement.
* **Tax Planning & Harvesting**: Maximizing Section 80C/80D efficiency and LTCG tax loss harvesting.
* **Investment Advisory**: Goal-aligned multi-asset portfolio strategies.
* **Consultation Booking CRM**: Private 1-on-1 fiduciary scheduling with real-time advisor management.

Built on a robust MERN (MongoDB, Express.js, React 19, Node.js) stack, SOLAHANA is engineered with security, modularity, and high-performance scalability in mind.

---

## 🛠️ Tech Stack

### Frontend & UI Architecture
| Technology | Description |
| :--- | :--- |
| **React 19** | Modern UI framework for building reactive component structures |
| **Vite** | Next-generation frontend build tooling and HMR dev server |
| **Tailwind CSS v4** | Utility-first styling engine powering luxury dark navy & gold design |
| **Framer Motion** | Physics-based animations, micro-interactions, and glass modal transitions |
| **Lucide Icons** | Pixel-perfect vector icon system |
| **Axios** | HTTP client with automatic JWT bearer & HTTP-only cookie interceptors |
| **Zod** | Client and server schema validation |

### Backend & Database Engine
| Technology | Description |
| :--- | :--- |
| **Node.js** | Event-driven JavaScript runtime environment |
| **Express.js** | Fast, unopinionated MVC web framework for Node |
| **MongoDB Atlas** | Cloud-native NoSQL database engine |
| **Mongoose** | Elegant MongoDB object modeling and schema validation |
| **JWT (JSON Web Tokens)** | Secure session tokens with HTTP-only cookie support |
| **bcryptjs** | Password hashing utilizing 12 salt rounds |
| **Nodemailer** | Transporter architecture for transactional advisory email notifications |

### Security & Infrastructure
| Service | Purpose |
| :--- | :--- |
| **Helmet** | HTTP security header hardening |
| **CORS** | Cross-Origin Resource Sharing control |
| **Express Rate Limit** | IP-based request throttling against brute-force attacks |
| **Morgan** | HTTP request logging for development & production monitoring |

---

## ✨ Key Features

### 🎨 Frontend & User Experience
- [x] **Quiet Luxury Design System**: Deep Navy (`#020B2D`), Sapphire Navy (`#071C48`), and Gold (`#C8A24A`) palette.
- [x] **Responsive Navigation**: Desktop dropdowns with glassmorphism preview cards and mobile menu drawer.
- [x] **Interactive Goal Desks**: Milestone roadmaps for Dream Home, Child Education, Retirement, and Tax Saving.
- [x] **Global Search Modal (`Cmd+K`)**: Instant search overlay to jump between calculators and planning services.
- [x] **Client Advisory Portal**: Private dashboard tracking personal bookings and meeting links.
- [x] **Admin Advisory Desk**: Fiduciary CRM dashboard with client search, status filters, and meeting assignment.

### 🛡️ Backend Engine & CRM APIs
- [x] **JWT Authentication**: Secure user registration, password hashing (bcrypt 12 rounds), login, and session persistence.
- [x] **Role-Based Authorization**: Middleware protecting client routes and admin advisory desks (`role: 'admin'`).
- [x] **Zod Schema Validation**: Server-side request validation returning structured `ApiError` responses.
- [x] **Consultation Booking CRM**: Create, query (`/my`), cancel, status-update, search, and delete consultation requests.
- [x] **Email Notification System**: HTML email templates for booking confirmations and advisor status updates.
- [x] **Global Error Handler**: Standardized `ApiResponse` (2xx) and `ApiError` (4xx/5xx) JSON envelopes.

### 🔮 Upcoming Features Roadmap
- [ ] **SIP & Compounding Calculator**: Real-time step-up compounding visualizer.
- [ ] **FIRE Retirement Target Calculator**: Corpus calculator indexing inflation and withdrawal rates.
- [ ] **Tax Regime Calculator**: FY 2025-26 Old vs New Tax Regime optimization tool.
- [ ] **Blog & Insights CMS**: Financial knowledge articles and market research updates.
- [ ] **Newsletter Subscriptions**: Instant capital markets and tax harvesting alerts.

---

## 📁 Project Structure

```text
Solahana/
├── server/                        # Express Node.js Backend Server
│   ├── config/                    # Database connections (connectDB.js)
│   ├── controllers/               # Controller logic (authController, consultationController)
│   ├── middleware/                # Security, auth, admin, validation & error handling
│   ├── models/                    # Mongoose Data Models (User, Consultation, Newsletter)
│   ├── routes/                    # REST API Endpoint definitions (authRoutes, consultationRoutes, adminConsultationRoutes)
│   ├── services/                  # Business services (emailService)
│   ├── utils/                     # Helper utilities (asyncHandler, ApiResponse, ApiError, generateToken)
│   ├── validations/               # Zod validation schemas (authValidation, consultationValidation)
│   ├── app.js                     # Express app & middleware order setup
│   └── server.js                  # Server listener & database initializer
│
├── src/                           # React Frontend Client (Vite)
│   ├── components/                # Modular UI components (Navbar, Hero, AuthModal, Contact, etc.)
│   ├── context/                   # Global React State (AuthContext)
│   ├── pages/                     # Full Page Components (About, Goals, Tax, Dashboard, AdminDashboard)
│   ├── services/                  # API HTTP services (apiClient, authService, consultationService)
│   ├── App.jsx                    # Root App router container & AuthProvider wrapper
│   ├── index.css                  # Tailwind CSS v4 design tokens & custom utilities
│   └── main.jsx                   # React DOM entrypoint
│
├── .env                           # Root Environment Configuration File
├── .env.example                   # Environment Template Reference
├── vite.config.js                 # Vite Dev Server Configuration & /api proxy
└── package.json                   # Project dependencies and npm scripts
```

---

## 🚀 Getting Started

Follow these step-by-step instructions to set up SOLAHANA locally on your machine.

### Prerequisites
Make sure you have the following installed on your system:
* **Node.js**: `v18.0.0` or higher
* **npm**: `v9.0.0` or higher
* **MongoDB**: A running local MongoDB instance OR a **MongoDB Atlas** cluster URL.

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/mohammed-hanzala/Solahana.git
cd Solahana
```

### Step 2: Install Project Dependencies
Run `npm install` in the root directory to install all dependencies:
```bash
npm install
```

---

## 🔐 Environment Variables

Create a `.env` file in the root directory of the project:

```bash
cp .env.example .env
```

Open `.env` and fill in your values:

```env
# Server Configuration
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Database Connection
MONGODB_URI=mongodb://localhost:27017/solahana

# JWT Authentication
JWT_SECRET=solahana_super_secret_jwt_key_2026_production
JWT_EXPIRES_IN=7d
JWT_COOKIE_EXPIRES_IN=7

# Email Service (Nodemailer - Optional for dev mode)
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=your_smtp_username
EMAIL_PASS=your_smtp_password
EMAIL_FROM=SOLAHANA Advisory <advisory@solahana.com>

# Cloudinary Storage (Optional placeholder)
CLOUDINARY_CLOUD_NAME=solahana_cloud
CLOUDINARY_API_KEY=1234567890
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

---

## 🏃 Running the Application

The frontend and backend are two separate processes and must be started in **two separate terminal windows**, using two **different** npm scripts.

### Terminal 1 — Backend Express Server
```bash
npm run server
```
(equivalent to `node server/server.js`)
* Backend running at: `http://localhost:5000`
* Health Check endpoint: `http://localhost:5000/api/health`

### Terminal 2 — Frontend Vite Application
```bash
npm run dev
```
* Frontend running at: `http://localhost:5173`

> ⚠️ **Do not run `npm run dev` in both terminals.** This project has a single root `package.json`, and `"dev"` only starts the Vite frontend — it does **not** start Express. Running `npm run dev` a second time for the backend just launches a second Vite dev server on the next free port (e.g. `5174`), leaves port `5000` empty, and every API call fails with `404 API Route Not Found` (Vite's `/api` proxy has nothing to forward to). Always use `npm run server` (or `npm run start`) for the backend.

---

## 🧪 Testing Login & Authentication

To test authentication and client sessions locally:

1. Open `http://localhost:5173` in your browser.
2. Click **Login** in the top navigation bar.
3. Select the **Sign Up** tab on the glass modal.
4. Enter your details (`Full Name`, `Email`, `Password`, `Phone`, `City`) and click **Create Account**.
5. Upon successful creation, you will automatically be logged in and your name will appear in the top right navbar.
6. Click your name badge to navigate to your private **Client Dashboard** (`#dashboard`) or **Admin Desk** (`#admin`).

---

## 📑 API Endpoints Summary

### Authentication APIs (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new user & issue JWT token |
| `POST` | `/api/auth/login` | Public | Authenticate credentials & set HTTP-only cookie |
| `POST` | `/api/auth/logout` | Private | Clear active user session cookie |
| `GET` | `/api/auth/me` | Private | Retrieve current logged-in user profile |
| `PATCH` | `/api/auth/profile` | Private | Update name, phone, city, or avatar |

### Consultation CRM APIs (`/api/consultations` & `/api/admin`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/consultations` | Private (User) | Book a new advisory consultation |
| `GET` | `/api/consultations/my` | Private (User) | Get logged-in user's bookings |
| `PATCH` | `/api/consultations/:id/cancel` | Private (User) | Cancel pending booking |
| `GET` | `/api/admin/consultations` | Private (Admin) | Search, filter & paginate all client bookings |
| `PATCH` | `/api/admin/consultations/:id/status` | Private (Admin) | Update status, add meeting link & notes |
| `DELETE` | `/api/admin/consultations/:id` | Private (Admin) | Delete consultation record |

### System APIs
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Public | Health check verification |

---

## 🗄️ Database Schemas

SOLAHANA uses MongoDB Atlas with Mongoose object modeling:

* **`users`**: Manages account credentials, bcrypt password hashes, roles (`user`, `advisor`, `admin`), active states, and login timestamps.
* **`consultations`**: Stores client advisory bookings, preferred date/time, financial goals, consultation mode, meeting links, and advisor internal notes.
* **`newsletters`**: Manages email subscriber lists for wealth insights.
* **`blogs`** *(Coming Soon)*: Articles and market research commentary.
* **`savedcalculations`** *(Coming Soon)*: Saved client calculation snapshots.

---

## 🔒 Security Architecture

- **JWT Authentication**: Tokens stored in secure HTTP-only cookies and supported via Bearer authorization headers.
- **Bcrypt Hashing**: Passwords salted and hashed using `12` rounds before database persistence.
- **Zod Validation**: Input sanitization blocking invalid enum values, malformed emails, and past dates.
- **HTTP Security Headers**: `helmet` enabled to protect against common web vulnerabilities (XSS, clickjacking).
- **CORS Protection**: Origin whitelist configured for production domains and local development ports.
- **Rate Limiting**: API throttling limit of 300 requests per 15 minutes per IP.

---

## 🗺️ Development Roadmap

- [x] **Phase 1**: Core UI Design System & Landing Page.
- [x] **Phase 2**: Planning Pages (About, Goals, Investments, Tax Planning, Calculators Preview).
- [x] **Phase 3**: Backend Server Foundation & MongoDB Atlas Connection.
- [x] **Phase 4**: Production JWT Authentication & User Sessions.
- [x] **Phase 5**: Consultation Booking CRM & Admin Advisory Desk.
- [ ] **Phase 6**: Financial Calculators Engine (SIP, FIRE, Tax Optimizer).
- [ ] **Phase 7**: Blog & Insights CMS System.
- [ ] **Phase 8**: Production Cloud Deployment (Vercel + Render).

---

## 🤝 Contributing

Contributions are welcome! If you'd like to improve SOLAHANA:

1. **Fork** the Repository.
2. Create your Feature Branch:
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. Commit your Changes:
   ```bash
   git commit -m "feat: add AmazingFeature"
   ```
4. Push to the Branch:
   ```bash
   git push origin feature/AmazingFeature
   ```
5. Open a **Pull Request**.

---

## 👨‍💻 Author

### **Mohammed Hanzala Khan**
*Computer Engineering Student & MERN Stack Developer*

* 🌐 **GitHub**: [github.com/mohammed-hanzala](https://github.com/mohammed-hanzala)
* 💼 **LinkedIn**: *(Coming Soon)*
* 📧 **Email**: [khanhanzalajan@gmail.com](mailto:khanhanzalajan@gmail.com)

---

## 📜 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

## ✅ New Developer Quick Check-Off List

Before submitting your first PR, verify that:
- [x] Repository cloned and `npm install` completed.
- [x] `.env` file created from `.env.example`.
- [x] Backend starts cleanly via `npm run server` (not `npm run dev` — see the warning above).
- [x] Frontend starts cleanly via `npm run dev`.
- [x] `http://localhost:5000/api/health` returns status `200 OK`.
- [x] Account registration and login work via the top navigation bar.
- [x] Consultation booking submits cleanly and appears on `http://localhost:5173/#dashboard`.
