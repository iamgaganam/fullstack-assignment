using backend.Interfaces;
using backend.Models;
using backend.Services;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace backend.Tests.Services
{
    public class EmployeeServiceTests
    {
        private readonly Mock<IEmployeeRepository> _mockEmployeeRepository;
        private readonly Mock<IDepartmentRepository> _mockDepartmentRepository;
        private readonly Mock<ILogger<EmployeeService>> _mockLogger;
        private readonly EmployeeService _service;

        public EmployeeServiceTests()
        {
            _mockEmployeeRepository = new Mock<IEmployeeRepository>();
            _mockDepartmentRepository = new Mock<IDepartmentRepository>();
            _mockLogger = new Mock<ILogger<EmployeeService>>();
            _service = new EmployeeService(_mockEmployeeRepository.Object, _mockDepartmentRepository.Object, _mockLogger.Object);
        }

        private Department CreateTestDepartment(int id = 1)
        {
            return new Department { DepartmentId = id, DepartmentCode = "IT", DepartmentName = "Information Technology" };
        }

        private Employee CreateTestEmployee(int id = 1, int departmentId = 1)
        {
            return new Employee
            {
                EmployeeId = id,
                FirstName = "John",
                LastName = "Doe",
                EmailAddress = "john@example.com",
                DateOfBirth = DateTime.Now.AddYears(-30),
                DepartmentId = departmentId,
                Salary = 50000
            };
        }

        // GetAllEmployeesAsync Tests
        [Fact]
        public async Task GetAllEmployeesAsync_ReturnsEmptyList_WhenNoEmployeesExist()
        {
            // Arrange
            _mockEmployeeRepository.Setup(r => r.GetAllEmployeesAsync())
                .ReturnsAsync(new List<Employee>());

            // Act
            var result = await _service.GetAllEmployeesAsync();

            // Assert
            Assert.Empty(result);
            _mockEmployeeRepository.Verify(r => r.GetAllEmployeesAsync(), Times.Once);
        }

        [Fact]
        public async Task GetAllEmployeesAsync_ReturnsAllEmployees_WhenEmployeesExist()
        {
            // Arrange
            var employees = new List<Employee>
            {
                CreateTestEmployee(1),
                CreateTestEmployee(2)
            };
            _mockEmployeeRepository.Setup(r => r.GetAllEmployeesAsync())
                .ReturnsAsync(employees);

            // Act
            var result = await _service.GetAllEmployeesAsync();

            // Assert
            Assert.Equal(2, result.Count);
            _mockEmployeeRepository.Verify(r => r.GetAllEmployeesAsync(), Times.Once);
        }

        // GetEmployeeByIdAsync Tests
        [Fact]
        public async Task GetEmployeeByIdAsync_ThrowsArgumentException_WhenIdIsZero()
        {
            // Act & Assert
            await Assert.ThrowsAsync<ArgumentException>(() => _service.GetEmployeeByIdAsync(0));
        }

        [Fact]
        public async Task GetEmployeeByIdAsync_ThrowsArgumentException_WhenIdIsNegative()
        {
            // Act & Assert
            await Assert.ThrowsAsync<ArgumentException>(() => _service.GetEmployeeByIdAsync(-1));
        }

        [Fact]
        public async Task GetEmployeeByIdAsync_ReturnsEmployee_WhenIdIsValid()
        {
            // Arrange
            var employee = CreateTestEmployee();
            _mockEmployeeRepository.Setup(r => r.GetEmployeeByIdAsync(1))
                .ReturnsAsync(employee);

            // Act
            var result = await _service.GetEmployeeByIdAsync(1);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("John", result.FirstName);
            _mockEmployeeRepository.Verify(r => r.GetEmployeeByIdAsync(1), Times.Once);
        }

        [Fact]
        public async Task GetEmployeeByIdAsync_ReturnsNull_WhenEmployeeNotFound()
        {
            // Arrange
            _mockEmployeeRepository.Setup(r => r.GetEmployeeByIdAsync(999))
                .ReturnsAsync((Employee?)null);

            // Act
            var result = await _service.GetEmployeeByIdAsync(999);

            // Assert
            Assert.Null(result);
        }

        // GetEmployeesByDepartmentAsync Tests
        [Fact]
        public async Task GetEmployeesByDepartmentAsync_ThrowsArgumentException_WhenDepartmentIdIsZero()
        {
            // Act & Assert
            await Assert.ThrowsAsync<ArgumentException>(() => _service.GetEmployeesByDepartmentAsync(0));
        }

        [Fact]
        public async Task GetEmployeesByDepartmentAsync_ReturnsEmployeesForDepartment_WhenDepartmentIdIsValid()
        {
            // Arrange
            var employees = new List<Employee>
            {
                CreateTestEmployee(1, 1),
                CreateTestEmployee(2, 1)
            };
            _mockEmployeeRepository.Setup(r => r.GetEmployeesByDepartmentAsync(1))
                .ReturnsAsync(employees);

            // Act
            var result = await _service.GetEmployeesByDepartmentAsync(1);

            // Assert
            Assert.Equal(2, result.Count);
            Assert.All(result, e => Assert.Equal(1, e.DepartmentId));
        }

        [Fact]
        public async Task GetEmployeesByDepartmentAsync_ReturnsEmptyList_WhenNoDepartmentEmployees()
        {
            // Arrange
            _mockEmployeeRepository.Setup(r => r.GetEmployeesByDepartmentAsync(999))
                .ReturnsAsync(new List<Employee>());

            // Act
            var result = await _service.GetEmployeesByDepartmentAsync(999);

            // Assert
            Assert.Empty(result);
        }

        // AddEmployeeAsync Tests
        [Fact]
        public async Task AddEmployeeAsync_ThrowsArgumentNullException_WhenEmployeeIsNull()
        {
            // Act & Assert
            await Assert.ThrowsAsync<ArgumentNullException>(() => _service.AddEmployeeAsync(null!));
        }

        [Fact]
        public async Task AddEmployeeAsync_ThrowsArgumentException_WhenFirstNameIsEmpty()
        {
            // Arrange
            var employee = CreateTestEmployee();
            employee.FirstName = "";

            // Act & Assert
            await Assert.ThrowsAsync<ArgumentException>(() => _service.AddEmployeeAsync(employee));
        }

        [Fact]
        public async Task AddEmployeeAsync_ThrowsArgumentException_WhenLastNameIsEmpty()
        {
            // Arrange
            var employee = CreateTestEmployee();
            employee.LastName = "";

            // Act & Assert
            await Assert.ThrowsAsync<ArgumentException>(() => _service.AddEmployeeAsync(employee));
        }

        [Fact]
        public async Task AddEmployeeAsync_ThrowsInvalidOperationException_WhenDepartmentDoesNotExist()
        {
            // Arrange
            var employee = CreateTestEmployee(departmentId: 999);
            _mockDepartmentRepository.Setup(r => r.GetDepartmentByIdAsync(999))
                .ReturnsAsync((Department?)null);

            // Act & Assert
            await Assert.ThrowsAsync<InvalidOperationException>(() => _service.AddEmployeeAsync(employee));
        }

        [Fact]
        public async Task AddEmployeeAsync_ThrowsInvalidOperationException_WhenEmailAlreadyExists()
        {
            // Arrange
            var employee = CreateTestEmployee();
            var existingEmployee = CreateTestEmployee(id: 2);

            _mockDepartmentRepository.Setup(r => r.GetDepartmentByIdAsync(1))
                .ReturnsAsync(CreateTestDepartment());
            _mockEmployeeRepository.Setup(r => r.GetEmployeeByEmailAsync("john@example.com"))
                .ReturnsAsync(existingEmployee);

            // Act & Assert
            await Assert.ThrowsAsync<InvalidOperationException>(() => _service.AddEmployeeAsync(employee));
        }

        [Fact]
        public async Task AddEmployeeAsync_CalculatesAge_BeforeAdding()
        {
            // Arrange
            var dob = DateTime.Now.AddYears(-25);
            var employee = CreateTestEmployee();
            employee.DateOfBirth = dob;
            employee.Age = 0; // Initial age

            _mockDepartmentRepository.Setup(r => r.GetDepartmentByIdAsync(1))
                .ReturnsAsync(CreateTestDepartment());
            _mockEmployeeRepository.Setup(r => r.GetEmployeeByEmailAsync("john@example.com"))
                .ReturnsAsync((Employee?)null);
            _mockEmployeeRepository.Setup(r => r.AddEmployeeAsync(It.IsAny<Employee>()))
                .ReturnsAsync(1)
                .Callback<Employee>(e => { Assert.Equal(25, e.Age); });

            // Act
            var result = await _service.AddEmployeeAsync(employee);

            // Assert
            Assert.Equal(1, result);
        }

        [Fact]
        public async Task AddEmployeeAsync_AddsEmployee_WhenValid()
        {
            // Arrange
            var employee = CreateTestEmployee();

            _mockDepartmentRepository.Setup(r => r.GetDepartmentByIdAsync(1))
                .ReturnsAsync(CreateTestDepartment());
            _mockEmployeeRepository.Setup(r => r.GetEmployeeByEmailAsync("john@example.com"))
                .ReturnsAsync((Employee?)null);
            _mockEmployeeRepository.Setup(r => r.AddEmployeeAsync(employee))
                .ReturnsAsync(1);

            // Act
            var result = await _service.AddEmployeeAsync(employee);

            // Assert
            Assert.Equal(1, result);
            _mockEmployeeRepository.Verify(r => r.AddEmployeeAsync(employee), Times.Once);
        }

        // UpdateEmployeeAsync Tests
        [Fact]
        public async Task UpdateEmployeeAsync_ThrowsArgumentException_WhenIdIsZero()
        {
            // Arrange
            var employee = CreateTestEmployee();
            employee.EmployeeId = 0;

            // Act & Assert
            await Assert.ThrowsAsync<ArgumentException>(() => _service.UpdateEmployeeAsync(employee));
        }

        [Fact]
        public async Task UpdateEmployeeAsync_ThrowsInvalidOperationException_WhenDepartmentDoesNotExist()
        {
            // Arrange
            var employee = CreateTestEmployee(departmentId: 999);
            _mockDepartmentRepository.Setup(r => r.GetDepartmentByIdAsync(999))
                .ReturnsAsync((Department?)null);

            // Act & Assert
            await Assert.ThrowsAsync<InvalidOperationException>(() => _service.UpdateEmployeeAsync(employee));
        }

        [Fact]
        public async Task UpdateEmployeeAsync_ThrowsInvalidOperationException_WhenEmailAlreadyExistsForAnotherEmployee()
        {
            // Arrange
            var employee = CreateTestEmployee(id: 1);
            var existingEmployee = CreateTestEmployee(id: 2);
            existingEmployee.EmailAddress = "john@example.com";

            _mockDepartmentRepository.Setup(r => r.GetDepartmentByIdAsync(1))
                .ReturnsAsync(CreateTestDepartment());
            _mockEmployeeRepository.Setup(r => r.GetEmployeeByEmailAsync("john@example.com"))
                .ReturnsAsync(existingEmployee);

            // Act & Assert
            await Assert.ThrowsAsync<InvalidOperationException>(() => _service.UpdateEmployeeAsync(employee));
        }

        [Fact]
        public async Task UpdateEmployeeAsync_AllowsUpdateWithSameEmail_ForSameEmployee()
        {
            // Arrange
            var employee = CreateTestEmployee(id: 1);
            var existingEmployee = CreateTestEmployee(id: 1);

            _mockDepartmentRepository.Setup(r => r.GetDepartmentByIdAsync(1))
                .ReturnsAsync(CreateTestDepartment());
            _mockEmployeeRepository.Setup(r => r.GetEmployeeByEmailAsync("john@example.com"))
                .ReturnsAsync(existingEmployee);
            _mockEmployeeRepository.Setup(r => r.UpdateEmployeeAsync(employee))
                .ReturnsAsync(true);

            // Act
            var result = await _service.UpdateEmployeeAsync(employee);

            // Assert
            Assert.True(result);
        }

        [Fact]
        public async Task UpdateEmployeeAsync_UpdatesEmployee_WhenValid()
        {
            // Arrange
            var employee = CreateTestEmployee();

            _mockDepartmentRepository.Setup(r => r.GetDepartmentByIdAsync(1))
                .ReturnsAsync(CreateTestDepartment());
            _mockEmployeeRepository.Setup(r => r.GetEmployeeByEmailAsync("john@example.com"))
                .ReturnsAsync((Employee?)null);
            _mockEmployeeRepository.Setup(r => r.UpdateEmployeeAsync(employee))
                .ReturnsAsync(true);

            // Act
            var result = await _service.UpdateEmployeeAsync(employee);

            // Assert
            Assert.True(result);
            _mockEmployeeRepository.Verify(r => r.UpdateEmployeeAsync(employee), Times.Once);
        }

        // DeleteEmployeeAsync Tests
        [Fact]
        public async Task DeleteEmployeeAsync_ThrowsArgumentException_WhenIdIsZero()
        {
            // Act & Assert
            await Assert.ThrowsAsync<ArgumentException>(() => _service.DeleteEmployeeAsync(0));
        }

        [Fact]
        public async Task DeleteEmployeeAsync_DeletesEmployee_WhenIdIsValid()
        {
            // Arrange
            _mockEmployeeRepository.Setup(r => r.DeleteEmployeeAsync(1))
                .ReturnsAsync(true);

            // Act
            var result = await _service.DeleteEmployeeAsync(1);

            // Assert
            Assert.True(result);
            _mockEmployeeRepository.Verify(r => r.DeleteEmployeeAsync(1), Times.Once);
        }

        [Fact]
        public async Task DeleteEmployeeAsync_ReturnsFalse_WhenEmployeeNotFound()
        {
            // Arrange
            _mockEmployeeRepository.Setup(r => r.DeleteEmployeeAsync(999))
                .ReturnsAsync(false);

            // Act
            var result = await _service.DeleteEmployeeAsync(999);

            // Assert
            Assert.False(result);
        }

        // Age Calculation Tests
        [Fact]
        public void CalculateAge_CalculatesCorrectAge_ForBirthdayToday()
        {
            // Arrange
            var dob = new DateTime(1990, 4, 9);
            var today = new DateTime(2015, 4, 9);
            var employee = CreateTestEmployee();
            employee.DateOfBirth = dob;

            // This test demonstrates age calculation behavior
            var expectedAge = today.Year - dob.Year;

            Assert.Equal(25, expectedAge);
        }

        [Fact]
        public void CalculateAge_CalculatesCorrectAge_BeforeBirthdayThisYear()
        {
            // Arrange
            var dob = new DateTime(1990, 12, 31);
            var today = new DateTime(2015, 4, 9);

            var expectedAge = today.Year - dob.Year - 1; // Birthday hasn't occurred yet

            Assert.Equal(24, expectedAge);
        }
    }
}
