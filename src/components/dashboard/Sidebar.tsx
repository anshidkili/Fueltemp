import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "../../lib/utils";
import {
  LayoutDashboard,
  Users,
  Building2,
  FileBarChart,
  Clipboard,
  Fuel,
  Package,
  CreditCard,
  Car,
  Receipt,
  LogOut,
  Settings,
} from "lucide-react";
import { Separator } from "../ui/separator";
import { useAuth } from "../auth/AuthContext";

interface SidebarProps {
  userRole?: "superadmin" | "admin" | "employee" | "customer";
  activePath?: string;
  onNavigate?: (path: string) => void;
}

const Sidebar = ({
  userRole = "admin",
  activePath = "/dashboard",
  onNavigate = () => {},
}: SidebarProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Use authenticated user role if available
  const role = user?.role || userRole;

  const handleNavigation = (path: string) => {
    onNavigate(path);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const NavItem = ({
    icon: Icon,
    label,
    path,
  }: {
    icon: React.ElementType;
    label: string;
    path: string;
  }) => (
    <Link
      to={path}
      className={cn(
        "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors",
        activePath === path
          ? "bg-slate-100 dark:bg-slate-800 text-primary"
          : "text-slate-600 dark:text-slate-300",
      )}
      onClick={() => handleNavigation(path)}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </Link>
  );

  const renderSuperadminMenu = () => (
    <>
      <NavItem icon={LayoutDashboard} label="Dashboard" path="/dashboard" />
      <NavItem icon={Building2} label="Stations" path="/stations" />
      <NavItem icon={Users} label="User Management" path="/users" />
      <NavItem icon={FileBarChart} label="Reports" path="/reports" />
      <NavItem icon={Settings} label="System Settings" path="/settings" />
    </>
  );

  const renderAdminMenu = () => (
    <>
      <NavItem icon={LayoutDashboard} label="Dashboard" path="/dashboard" />
      <NavItem icon={Users} label="Employees" path="/employees" />
      <NavItem icon={Package} label="Inventory" path="/inventory" />
      <NavItem icon={Fuel} label="Dispensers" path="/dispensers" />
      <NavItem icon={CreditCard} label="Credit Customers" path="/customers" />
      <NavItem icon={FileBarChart} label="Financial Reports" path="/reports" />
    </>
  );

  const renderEmployeeMenu = () => (
    <>
      <NavItem icon={LayoutDashboard} label="Dashboard" path="/dashboard" />
      <NavItem icon={Clipboard} label="Shift Management" path="/shift" />
      <NavItem icon={Fuel} label="Fuel Dispensing" path="/dispensing" />
      <NavItem icon={Receipt} label="Sales History" path="/sales" />
    </>
  );

  const renderCustomerMenu = () => (
    <>
      <NavItem icon={LayoutDashboard} label="Dashboard" path="/dashboard" />
      <NavItem icon={Car} label="My Vehicles" path="/vehicles" />
      <NavItem icon={Fuel} label="Fuel Usage" path="/usage" />
      <NavItem icon={Receipt} label="Invoices" path="/invoices" />
      <NavItem icon={CreditCard} label="Payments" path="/payments" />
    </>
  );

  return (
    <div className="h-full w-64 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 flex flex-col">
      <div className="p-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Fuel Station
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {role.charAt(0).toUpperCase() + role.slice(1)} Portal
        </p>
      </div>

      <Separator />

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {role === "superadmin" && renderSuperadminMenu()}
        {role === "admin" && renderAdminMenu()}
        {role === "employee" && renderEmployeeMenu()}
        {role === "customer" && renderCustomerMenu()}
      </nav>

      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
