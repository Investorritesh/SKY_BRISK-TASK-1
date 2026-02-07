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

## API Documentation
Once the server is running, the API endpoints follow the `/api/` prefix. (Swagger docs integration in progress).
