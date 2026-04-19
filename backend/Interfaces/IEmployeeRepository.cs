using backend.Models;

namespace backend.Interfaces
{
    /// <summary>
    /// Employee repository contract.
    /// </summary>
    public interface IEmployeeRepository
    {
        /// <summary>
        /// Gets all employees.
        /// </summary>
        Task<List<Employee>> GetAllEmployeesAsync();

        /// <summary>
        /// Gets an employee by ID.
        /// </summary>
        Task<Employee?> GetEmployeeByIdAsync(int employeeId);

        /// <summary>
        /// Gets employees by department.
        /// </summary>
        Task<List<Employee>> GetEmployeesByDepartmentAsync(int departmentId);

        /// <summary>
        /// Gets an employee by email.
        /// </summary>
        Task<Employee?> GetEmployeeByEmailAsync(string emailAddress);

        /// <summary>
        /// Adds an employee.
        /// </summary>
        Task<int> AddEmployeeAsync(Employee employee);

        /// <summary>
        /// Updates an employee.
        /// </summary>
        Task<bool> UpdateEmployeeAsync(Employee employee);

        /// <summary>
        /// Deletes an employee.
        /// </summary>
        Task<bool> DeleteEmployeeAsync(int employeeId);
    }
}
