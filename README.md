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
- **Backend**: Supabase (Authentication, Database, Storage)
- **Charts**: Recharts
- **Icons**: Lucide React

## API Structure
The application uses a modular API structure with the following endpoints:

- `/auth` - Authentication and user management
- `/stations` - Station management
- `/employees` - Employee management
- `/customers` - Customer management
- `/inventory` - Inventory tracking
- `/dispensers` - Fuel dispenser management
- `/sales` - Sales processing
- `/shifts` - Employee shift management
- `/vehicles` - Customer vehicle management
- `/invoices` - Invoice generation and management
- `/payments` - Payment processing
- `/reports` - Reporting and analytics

## Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account (for backend services)

## Environment Variables
Create a `.env` file with the following variables:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

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
├── api/           # API service modules
├── components/    # UI components
│   ├── auth/      # Authentication components
│   ├── customer/  # Customer-specific components
│   ├── dashboard/ # Dashboard components
│   ├── sales/     # Sales interface components
│   └── ui/        # Shadcn UI components
├── hooks/         # Custom React hooks
├── lib/           # Utility libraries
├── types/         # TypeScript type definitions
└── stories/       # Component stories
```

## License
MIT
