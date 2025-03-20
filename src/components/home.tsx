import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Fuel, ShieldCheck, Users, CreditCard } from "lucide-react";
import { useAuth } from "./auth/AuthContext";

import LoginForm from "./auth/LoginForm";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

const Home = () => {
  const navigate = useNavigate();
  const { login, user, isLoading: authLoading, error: authError } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleLogin = async (values: any) => {
    setIsLoading(true);
    setError("");

    try {
      const success = await login(values.email, values.password);
      if (!success) {
        setError("Invalid credentials. Please try again.");
      }
    } catch (err) {
      setError("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-blue-100">
      {/* Header */}
      <header className="bg-white shadow-sm py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Fuel className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-primary">FuelStation</h1>
          </div>
          <div className="hidden md:flex space-x-4">
            <Button variant="ghost">About</Button>
            <Button variant="ghost">Contact</Button>
            <Button variant="ghost">Support</Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-12 flex flex-col md:flex-row items-center justify-center gap-12">
        {/* Left side - Login Form */}
        <div className="w-full md:w-1/2 max-w-md">
          <LoginForm
            onSubmit={handleLogin}
            isLoading={isLoading || authLoading}
            error={error || authError}
          />
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>Demo accounts:</p>
            <p>superadmin@example.com / password123</p>
            <p>admin@example.com / password123</p>
            <p>employee@example.com / password123</p>
            <p>customer@example.com / password123</p>
          </div>
        </div>

        {/* Right side - Features */}
        <div className="w-full md:w-1/2 space-y-6">
          <h2 className="text-3xl font-bold text-center md:text-left text-primary">
            Fuel Station Management System
          </h2>
          <p className="text-lg text-center md:text-left text-muted-foreground">
            A comprehensive solution for managing fuel stations with distinct
            interfaces for different user roles.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            <FeatureCard
              icon={<ShieldCheck className="h-8 w-8 text-primary" />}
              title="Superadmin Portal"
              description="Manage multiple stations, users, and system-wide reports from a centralized dashboard."
            />

            <FeatureCard
              icon={<Users className="h-8 w-8 text-primary" />}
              title="Station Admin Portal"
              description="Control station operations, inventory, employees, and financial reporting."
            />

            <FeatureCard
              icon={<Fuel className="h-8 w-8 text-primary" />}
              title="Employee Interface"
              description="Streamlined interface for fuel dispensing, shift management, and sales processing."
            />

            <FeatureCard
              icon={<CreditCard className="h-8 w-8 text-primary" />}
              title="Customer Dashboard"
              description="Monitor fuel usage, view invoices, and manage monthly payments."
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">FuelStation</h3>
              <p className="text-sm opacity-80">
                A comprehensive fuel station management system with role-based
                access control.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm opacity-80">
                <li>
                  <a href="#" className="hover:underline">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Support
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <p className="text-sm opacity-80">
                Email: support@fuelstation.com
                <br />
                Phone: +1 (555) 123-4567
                <br />
                Address: 123 Fuel Lane, Gas City, FC 12345
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-primary-foreground/20 text-center text-sm opacity-70">
            <p>
              © {new Date().getFullYear()} FuelStation Management System. All
              rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({
  icon,
  title = "Feature",
  description = "Feature description",
}: FeatureCardProps) => {
  return (
    <Card className="bg-white hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-center space-x-2">
          {icon}
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  );
};

export default Home;
