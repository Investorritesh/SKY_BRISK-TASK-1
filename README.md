# ERP Management System (MERN Stack)

A comprehensive ERP solution for managing business operations.

## Features
- **Secure Authentication**: JWT-based login and registration.
- **Role-Based Access**: Admin, Sales, Purchase, Inventory, and Viewer roles.
- **Product Management**: Track SKU, pricing, and real-time inventory levels.
- **Sales & Purchase Orders**: Manage business transactions with automated stock updates.
- **Inventory Tracking**: Goods Receipt Notes (GRN) for supply chain management.
- **Invoicing**: Professional invoice generation with PDF export support.
- **Analytics Dashboard**: Visual metrics and charts using Recharts.
- **Responsive UI**: Built with Material-UI for all device sizes.

## Tech Stack
- **Frontend**: React, Redux Toolkit, Material-UI, Vite, Formik, Yup, Recharts.
- **Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT, Bcrypt.

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB local or Atlas URI

### Installation

1. Clone or download the repository.
2. Setup Backend:
   ```bash
   cd backend
   npm install
   # Create a .env file based on .env.example
   npm run dev
   ```
3. Setup Frontend:
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

## User Roles
- **Admin**: Full system access.
- **Sales**: Access to customers, sales orders, and invoices.
- **Purchase**: Access to suppliers and purchase orders.
- **Inventory**: Access to products and GRN.
- **Viewer**: Read-only access to basic data.

## Deployment

### Backend (e.g., Render, Railway)
1. Set the root directory to `backend`.
2. Environment Variables: `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRE`, `NODE_ENV=production`, `CLIENT_URL`.
3. Start Command: `npm start`.

### Frontend (e.g., Vercel, Netlify)
1. Set the root directory to `frontend`.
2. Set Build Command: `npm run build`.
3. Set Output Directory: `dist`.
4. Environment Variables: `VITE_API_URL` (points to your deployed backend URL + `/api`).

## Root Scripts
For convenience, you can run these from the root folder:
- `npm run install-all`: Installs dependencies for both folders.
- `npm run dev-backend`: Starts backend in dev mode.
- `npm run dev-frontend`: Starts frontend in dev mode.
- `npm run seed`: Seeds the database with sample data.
