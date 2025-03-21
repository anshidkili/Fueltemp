# Fuel Station Management System

## Project Overview
A comprehensive role-based web application for managing fuel stations with distinct interfaces for superadmins, station admins, employees, and credit customers.

## Features
- **Authentication System**: Role-based login with separate dashboards for superadmins (managing multiple stations), admins (station owners), employees (fuel dispensers), and credit customers (monthly billing).
- **Station Management**: Track fuel dispensers, inventory, sales, and employee shifts with real-time meter readings and financial reporting.
- **Financial Tracking**: Comprehensive system for monitoring sales, expenses, credit accounts, and generating profit/loss reports with export capabilities.
- **Credit Customer Portal**: Dashboard for regular customers to monitor fuel usage by vehicle, view invoices, and manage monthly payments.
- **Responsive Design**: Mobile-friendly interface with real-time updates and notifications for all user roles.

## Tech Stack
- **Frontend**: React with TypeScript, Vite
- **UI Components**: Shadcn UI (Radix UI + Tailwind CSS)
- **State Management**: React Context API
- **Routing**: React Router
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts
- **Icons**: Lucide React

## Current Implementation
This project is currently implemented as a frontend-only application with mock data services. It demonstrates the UI and interaction patterns that would be used in a full implementation. In a production environment, this would be connected to a real backend service.

## Module Structure
The application is organized into the following modules:

- **Auth**: Authentication and user management
- **Stations**: Station management
- **Employees**: Employee management
- **Customers**: Customer management
- **Inventory**: Inventory tracking
- **Dispensers**: Fuel dispenser management
- **Sales**: Sales processing
- **Shifts**: Employee shift management
- **Vehicles**: Customer vehicle management
- **Invoices**: Invoice generation and management
- **Payments**: Payment processing
- **Reports**: Reporting and analytics

## Prerequisites
- Node.js 18+
- npm or yarn

## Installation

```bash
# Clone the repository
git clone [repository-url]

# Navigate to the project directory
cd fuel-station-management

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Demo Accounts
- Superadmin: superadmin@example.com / password123
- Admin: admin@example.com / password123
- Employee: employee@example.com / password123
- Customer: customer@example.com / password123

## Project Structure
```
src/
├── api/           # API service modules with mock implementations
├── components/    # UI components
│   ├── auth/      # Authentication components
│   ├── customer/  # Customer-specific components
│   ├── dashboard/ # Dashboard components
│   ├── sales/     # Sales interface components
│   └── ui/        # Shadcn UI components
├── hooks/         # Custom React hooks
├── lib/           # Utility libraries
├── models/        # Data models
└── stories/       # Component stories
```

## Future Enhancements
- Integration with a real backend service
- Offline support for remote locations
- Mobile app for field operations
- Advanced reporting and analytics
- Integration with payment gateways
- Barcode/QR code scanning for vehicle identification

## License
MIT
