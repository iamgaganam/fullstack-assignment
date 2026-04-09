using backend.Interfaces;
using backend.Models;

namespace backend.Services
{
    public class EmployeeService : backend.Interfaces.IEmployeeService
    {
        private readonly IEmployeeRepository _employeeRepository;
        private readonly IDepartmentRepository _departmentRepository;
        private readonly ILogger<EmployeeService> _logger;

        public EmployeeService(IEmployeeRepository employeeRepository, IDepartmentRepository departmentRepository, ILogger<EmployeeService> logger)
        {
            _employeeRepository = employeeRepository;
            _departmentRepository = departmentRepository;
            _logger = logger;
        }

        public async Task<List<Employee>> GetAllEmployeesAsync()
        {
            return await _employeeRepository.GetAllEmployeesAsync();
        }

        public async Task<Employee?> GetEmployeeByIdAsync(int employeeId)
        {
            if (employeeId <= 0)
                throw new ArgumentException("Employee ID must be greater than 0");

            return await _employeeRepository.GetEmployeeByIdAsync(employeeId);
        }

        public async Task<List<Employee>> GetEmployeesByDepartmentAsync(int departmentId)
        {
            if (departmentId <= 0)
                throw new ArgumentException("Department ID must be greater than 0");

            return await _employeeRepository.GetEmployeesByDepartmentAsync(departmentId);
        }

        public async Task<int> AddEmployeeAsync(Employee employee)
        {
            ValidateEmployee(employee);

            // Check if department exists
            var department = await _departmentRepository.GetDepartmentByIdAsync(employee.DepartmentId);
            if (department == null)
                throw new InvalidOperationException($"Department with ID {employee.DepartmentId} does not exist");

            // Check if email already exists
            var existing = await _employeeRepository.GetEmployeeByEmailAsync(employee.EmailAddress);
            if (existing != null)
                throw new InvalidOperationException($"Email '{employee.EmailAddress}' already exists");

            // Calculate age
            employee.Age = CalculateAge(employee.DateOfBirth);

            return await _employeeRepository.AddEmployeeAsync(employee);
        }

        public async Task<bool> UpdateEmployeeAsync(Employee employee)
        {
            ValidateEmployee(employee);

            if (employee.EmployeeId <= 0)
                throw new ArgumentException("Employee ID must be greater than 0");

            // Check if department exists
            var department = await _departmentRepository.GetDepartmentByIdAsync(employee.DepartmentId);
            if (department == null)
                throw new InvalidOperationException($"Department with ID {employee.DepartmentId} does not exist");

            // Check if new email already exists for another employee
            var existing = await _employeeRepository.GetEmployeeByEmailAsync(employee.EmailAddress);
            if (existing != null && existing.EmployeeId != employee.EmployeeId)
                throw new InvalidOperationException($"Email '{employee.EmailAddress}' already exists");

            // Calculate age
            employee.Age = CalculateAge(employee.DateOfBirth);

            return await _employeeRepository.UpdateEmployeeAsync(employee);
        }

        public async Task<bool> DeleteEmployeeAsync(int employeeId)
        {
            if (employeeId <= 0)
                throw new ArgumentException("Employee ID must be greater than 0");

            return await _employeeRepository.DeleteEmployeeAsync(employeeId);
        }

        private void ValidateEmployee(Employee employee)
        {
            if (employee == null)
                throw new ArgumentNullException(nameof(employee));

            if (string.IsNullOrWhiteSpace(employee.FirstName))
                throw new ArgumentException("First Name cannot be empty");

            if (string.IsNullOrWhiteSpace(employee.LastName))
                throw new ArgumentException("Last Name cannot be empty");

            if (string.IsNullOrWhiteSpace(employee.EmailAddress))
                throw new ArgumentException("Email Address cannot be empty");

            if (employee.FirstName.Length > 50)
                throw new ArgumentException("First Name cannot exceed 50 characters");

            if (employee.LastName.Length > 50)
                throw new ArgumentException("Last Name cannot exceed 50 characters");

            if (employee.EmailAddress.Length > 100)
                throw new ArgumentException("Email Address cannot exceed 100 characters");

            if (!IsValidEmail(employee.EmailAddress))
                throw new ArgumentException("Email Address format is invalid");

            if (employee.DateOfBirth >= DateTime.Now)
                throw new ArgumentException("Date of Birth must be in the past");

            if (employee.DateOfBirth.Year < 1900)
                throw new ArgumentException("Date of Birth year cannot be before 1900");

            if (employee.Salary < 0)
                throw new ArgumentException("Salary cannot be negative");

            if (employee.DepartmentId <= 0)
                throw new ArgumentException("Department ID must be greater than 0");
        }

        private int CalculateAge(DateTime dateOfBirth)
        {
            var today = DateTime.Today;
            var age = today.Year - dateOfBirth.Year;
            
            if (dateOfBirth.Date > today.AddYears(-age))
                age--;

            return age;
        }

        private bool IsValidEmail(string email)
        {
            try
            {
                var addr = new System.Net.Mail.MailAddress(email);
                return addr.Address == email;
            }
            catch
            {
                return false;
            }
        }
    }
}
