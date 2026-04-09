using backend.Models;

namespace backend.Interfaces
{
    /// <summary>
    /// Service interface for employee business logic operations.
    /// </summary>
    public interface IEmployeeService
    {
        /// <summary>
        /// Retrieves all employees asynchronously.
        /// </summary>
        /// <returns>A list of all employees.</returns>
        Task<List<Employee>> GetAllEmployeesAsync();

        /// <summary>
        /// Retrieves an employee by their ID asynchronously.
        /// </summary>
        /// <param name="employeeId">The employee ID.</param>
        /// <returns>The employee object, or null if not found.</returns>
        Task<Employee?> GetEmployeeByIdAsync(int employeeId);

        /// <summary>
        /// Retrieves all employees in a specific department asynchronously.
        /// </summary>
        /// <param name="departmentId">The department ID.</param>
        /// <returns>A list of employees in the department.</returns>
        Task<List<Employee>> GetEmployeesByDepartmentAsync(int departmentId);

        /// <summary>
        /// Adds a new employee asynchronously.
        /// </summary>
        /// <param name="employee">The employee to add.</param>
        /// <returns>The ID of the newly created employee.</returns>
        Task<int> AddEmployeeAsync(Employee employee);

        /// <summary>
        /// Updates an existing employee asynchronously.
        /// </summary>
        /// <param name="employee">The employee with updated information.</param>
        /// <returns>True if the update was successful, false otherwise.</returns>
        Task<bool> UpdateEmployeeAsync(Employee employee);

        /// <summary>
        /// Deletes an employee asynchronously.
        /// </summary>
        /// <param name="employeeId">The ID of the employee to delete.</param>
        /// <returns>True if the deletion was successful, false otherwise.</returns>
        Task<bool> DeleteEmployeeAsync(int employeeId);
    }
}
