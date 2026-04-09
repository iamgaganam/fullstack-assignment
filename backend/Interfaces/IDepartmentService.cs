using backend.Models;

namespace backend.Interfaces
{
    /// <summary>
    /// Service interface for department business logic operations.
    /// </summary>
    public interface IDepartmentService
    {
        /// <summary>
        /// Retrieves all departments asynchronously.
        /// </summary>
        /// <returns>A list of all departments.</returns>
        Task<List<Department>> GetAllDepartmentsAsync();

        /// <summary>
        /// Retrieves a department by their ID asynchronously.
        /// </summary>
        /// <param name="departmentId">The department ID.</param>
        /// <returns>The department object, or null if not found.</returns>
        Task<Department?> GetDepartmentByIdAsync(int departmentId);

        /// <summary>
        /// Retrieves a department by their code asynchronously.
        /// </summary>
        /// <param name="departmentCode">The department code.</param>
        /// <returns>The department object, or null if not found.</returns>
        Task<Department?> GetDepartmentByCodeAsync(string departmentCode);

        /// <summary>
        /// Adds a new department asynchronously.
        /// </summary>
        /// <param name="department">The department to add.</param>
        /// <returns>The ID of the newly created department.</returns>
        Task<int> AddDepartmentAsync(Department department);

        /// <summary>
        /// Updates an existing department asynchronously.
        /// </summary>
        /// <param name="department">The department with updated information.</param>
        /// <returns>True if the update was successful, false otherwise.</returns>
        Task<bool> UpdateDepartmentAsync(Department department);

        /// <summary>
        /// Deletes a department asynchronously.
        /// </summary>
        /// <param name="departmentId">The ID of the department to delete.</param>
        /// <returns>True if the deletion was successful, false otherwise.</returns>
        Task<bool> DeleteDepartmentAsync(int departmentId);
    }
}
