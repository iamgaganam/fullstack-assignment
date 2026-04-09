using backend.Interfaces;
using backend.Models;

namespace backend.Services
{
    public class DepartmentService : backend.Interfaces.IDepartmentService
    {
        private readonly IDepartmentRepository _departmentRepository;
        private readonly ILogger<DepartmentService> _logger;

        public DepartmentService(IDepartmentRepository departmentRepository, ILogger<DepartmentService> logger)
        {
            _departmentRepository = departmentRepository;
            _logger = logger;
        }

        public async Task<List<Department>> GetAllDepartmentsAsync()
        {
            return await _departmentRepository.GetAllDepartmentsAsync();
        }

        public async Task<Department?> GetDepartmentByIdAsync(int departmentId)
        {
            if (departmentId <= 0)
                throw new ArgumentException("Department ID must be greater than 0");

            return await _departmentRepository.GetDepartmentByIdAsync(departmentId);
        }

        public async Task<Department?> GetDepartmentByCodeAsync(string departmentCode)
        {
            if (string.IsNullOrWhiteSpace(departmentCode))
                throw new ArgumentException("Department Code cannot be empty");

            return await _departmentRepository.GetDepartmentByCodeAsync(departmentCode.Trim());
        }

        public async Task<int> AddDepartmentAsync(Department department)
        {
            ValidateDepartment(department);

            // Check if department code already exists
            var existing = await _departmentRepository.GetDepartmentByCodeAsync(department.DepartmentCode);
            if (existing != null)
                throw new InvalidOperationException($"Department Code '{department.DepartmentCode}' already exists");

            return await _departmentRepository.AddDepartmentAsync(department);
        }

        public async Task<bool> UpdateDepartmentAsync(Department department)
        {
            ValidateDepartment(department);

            if (department.DepartmentId <= 0)
                throw new ArgumentException("Department ID must be greater than 0");

            // Check if new code already exists for another department
            var existing = await _departmentRepository.GetDepartmentByCodeAsync(department.DepartmentCode);
            if (existing != null && existing.DepartmentId != department.DepartmentId)
                throw new InvalidOperationException($"Department Code '{department.DepartmentCode}' already exists");

            return await _departmentRepository.UpdateDepartmentAsync(department);
        }

        public async Task<bool> DeleteDepartmentAsync(int departmentId)
        {
            if (departmentId <= 0)
                throw new ArgumentException("Department ID must be greater than 0");

            return await _departmentRepository.DeleteDepartmentAsync(departmentId);
        }

        private void ValidateDepartment(Department department)
        {
            if (department == null)
                throw new ArgumentNullException(nameof(department));

            if (string.IsNullOrWhiteSpace(department.DepartmentCode))
                throw new ArgumentException("Department Code cannot be empty");

            if (string.IsNullOrWhiteSpace(department.DepartmentName))
                throw new ArgumentException("Department Name cannot be empty");

            if (department.DepartmentCode.Length > 50)
                throw new ArgumentException("Department Code cannot exceed 50 characters");

            if (department.DepartmentName.Length > 100)
                throw new ArgumentException("Department Name cannot exceed 100 characters");
        }
    }
}
