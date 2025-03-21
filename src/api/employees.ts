import connectToDatabase from "../lib/mongodb";
import Employee from "../models/Employee";
import User from "../models/User";

export interface Employee {
  id: string;
  user_id: string;
  station_id: string;
  position: string;
  hire_date: string;
  status: "active" | "inactive" | "on_leave";
  hourly_rate: number;
  salary: number;
  created_at: string;
}

export interface EmployeeWithProfile extends Employee {
  profiles: {
    full_name: string;
    email: string;
    phone: string;
    avatar_url?: string;
  };
}

export async function getEmployees(stationId: string) {
  try {
    await connectToDatabase();

    const employees = await Employee.find({ station_id: stationId }).lean();

    // Get user profiles for each employee
    const employeesWithProfiles = await Promise.all(
      employees.map(async (employee) => {
        const user = await User.findById(employee.user_id).lean();

        return {
          id: employee._id.toString(),
          user_id: employee.user_id.toString(),
          station_id: employee.station_id.toString(),
          position: employee.position,
          hire_date: employee.hire_date.toISOString(),
          status: employee.status,
          hourly_rate: employee.hourly_rate,
          salary: employee.salary || 0,
          created_at: employee.created_at.toISOString(),
          profiles: {
            full_name: user.full_name,
            email: user.email,
            phone: user.phone || "",
            avatar_url: user.avatar_url,
          },
        };
      }),
    );

    return employeesWithProfiles as EmployeeWithProfile[];
  } catch (error) {
    console.error("Error getting employees:", error);
    throw error;
  }
}

export async function getEmployeeById(id: string) {
  try {
    await connectToDatabase();

    const employee = await Employee.findById(id).lean();
    if (!employee) throw new Error("Employee not found");

    const user = await User.findById(employee.user_id).lean();

    return {
      id: employee._id.toString(),
      user_id: employee.user_id.toString(),
      station_id: employee.station_id.toString(),
      position: employee.position,
      hire_date: employee.hire_date.toISOString(),
      status: employee.status,
      hourly_rate: employee.hourly_rate,
      salary: employee.salary || 0,
      created_at: employee.created_at.toISOString(),
      profiles: {
        full_name: user.full_name,
        email: user.email,
        phone: user.phone || "",
        avatar_url: user.avatar_url,
      },
    } as EmployeeWithProfile;
  } catch (error) {
    console.error("Error getting employee by ID:", error);
    throw error;
  }
}

export async function createEmployee(
  employee: Omit<Employee, "id" | "created_at">,
) {
  try {
    await connectToDatabase();

    const newEmployee = await Employee.create({
      user_id: employee.user_id,
      station_id: employee.station_id,
      position: employee.position,
      hire_date: employee.hire_date,
      status: employee.status,
      hourly_rate: employee.hourly_rate,
      salary: employee.salary || 0,
    });

    return {
      id: newEmployee._id.toString(),
      user_id: newEmployee.user_id.toString(),
      station_id: newEmployee.station_id.toString(),
      position: newEmployee.position,
      hire_date: newEmployee.hire_date.toISOString(),
      status: newEmployee.status,
      hourly_rate: newEmployee.hourly_rate,
      salary: newEmployee.salary || 0,
      created_at: newEmployee.created_at.toISOString(),
    } as Employee;
  } catch (error) {
    console.error("Error creating employee:", error);
    throw error;
  }
}

export async function updateEmployee(id: string, updates: Partial<Employee>) {
  try {
    await connectToDatabase();

    const updatedEmployee = await Employee.findByIdAndUpdate(
      id,
      { ...updates },
      { new: true, runValidators: true },
    ).lean();

    if (!updatedEmployee) throw new Error("Employee not found");

    return {
      id: updatedEmployee._id.toString(),
      user_id: updatedEmployee.user_id.toString(),
      station_id: updatedEmployee.station_id.toString(),
      position: updatedEmployee.position,
      hire_date: updatedEmployee.hire_date.toISOString(),
      status: updatedEmployee.status,
      hourly_rate: updatedEmployee.hourly_rate,
      salary: updatedEmployee.salary || 0,
      created_at: updatedEmployee.created_at.toISOString(),
    } as Employee;
  } catch (error) {
    console.error("Error updating employee:", error);
    throw error;
  }
}

export async function deleteEmployee(id: string) {
  try {
    await connectToDatabase();

    const result = await Employee.findByIdAndDelete(id);
    if (!result) throw new Error("Employee not found");

    return true;
  } catch (error) {
    console.error("Error deleting employee:", error);
    throw error;
  }
}
