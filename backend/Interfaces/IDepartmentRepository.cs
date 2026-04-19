using backend.Models;

namespace backend.Interfaces
{
    /// <summary>
    /// Department repository contract.
    /// </summary>
    public interface IDepartmentRepository
    {
        /// <summary>
        /// Gets all departments.
        /// </summary>
        Task<List<Department>> GetAllDepartmentsAsync();

        /// <summary>
        /// Gets a department by ID.
        /// </summary>
        Task<Department?> GetDepartmentByIdAsync(int departmentId);

        /// <summary>
        /// Gets a department by code.
        /// </summary>
        Task<Department?> GetDepartmentByCodeAsync(string departmentCode);

        /// <summary>
        /// Adds a department.
        /// </summary>
        Task<int> AddDepartmentAsync(Department department);

        /// <summary>
        /// Updates a department.
        /// </summary>
        Task<bool> UpdateDepartmentAsync(Department department);

        /// <summary>
        /// Deletes a department.
        /// </summary>
        Task<bool> DeleteDepartmentAsync(int departmentId);
    }
}
