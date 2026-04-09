using backend.Interfaces;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace backend.Tests.Controllers
{
    public class EmployeeControllerTests
    {
        private readonly Mock<IEmployeeService> _mockService;
        private readonly Mock<ILogger<backend.Controllers.EmployeeController>> _mockLogger;
        private readonly backend.Controllers.EmployeeController _controller;

        public EmployeeControllerTests()
        {
            _mockService = new Mock<IEmployeeService>();
            _mockLogger = new Mock<ILogger<backend.Controllers.EmployeeController>>();
            _controller = new backend.Controllers.EmployeeController(_mockService.Object, _mockLogger.Object);
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
                Age = 30,
                Salary = 50000,
                DepartmentId = departmentId,
                CreatedDate = DateTime.Now,
                ModifiedDate = DateTime.Now
            };
        }

        // GetAllEmployees Tests
        [Fact]
        public async Task GetAllEmployees_ReturnsOkResult_WithEmployeeList()
        {
            // Arrange
            var employees = new List<Employee>
            {
                CreateTestEmployee(1),
                CreateTestEmployee(2)
            };
            _mockService.Setup(s => s.GetAllEmployeesAsync())
                .ReturnsAsync(employees);

            // Act
            var result = await _controller.GetAllEmployees();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnedEmployees = Assert.IsAssignableFrom<IEnumerable<Employee>>(okResult.Value);
            Assert.Equal(2, returnedEmployees.Count());
        }

        [Fact]
        public async Task GetAllEmployees_ReturnsOkResult_WithEmptyList()
        {
            // Arrange
            _mockService.Setup(s => s.GetAllEmployeesAsync())
                .ReturnsAsync(new List<Employee>());

            // Act
            var result = await _controller.GetAllEmployees();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnedEmployees = Assert.IsAssignableFrom<IEnumerable<Employee>>(okResult.Value);
            Assert.Empty(returnedEmployees);
        }

        [Fact]
        public async Task GetAllEmployees_ReturnsInternalServerError_WhenExceptionThrown()
        {
            // Arrange
            _mockService.Setup(s => s.GetAllEmployeesAsync())
                .ThrowsAsync(new Exception("Database error"));

            // Act
            var result = await _controller.GetAllEmployees();

            // Assert
            var statusResult = Assert.IsType<ObjectResult>(result.Result);
            Assert.Equal(500, statusResult.StatusCode);
        }

        // GetEmployeeById Tests
        [Fact]
        public async Task GetEmployeeById_ReturnsOkResult_WithEmployee()
        {
            // Arrange
            var employee = CreateTestEmployee(1);
            _mockService.Setup(s => s.GetEmployeeByIdAsync(1))
                .ReturnsAsync(employee);

            // Act
            var result = await _controller.GetEmployeeById(1);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnedEmployee = Assert.IsType<Employee>(okResult.Value);
            Assert.Equal(1, returnedEmployee.EmployeeId);
        }

        [Fact]
        public async Task GetEmployeeById_ReturnsNotFound_WhenEmployeeDoesNotExist()
        {
            // Arrange
            _mockService.Setup(s => s.GetEmployeeByIdAsync(999))
                .ReturnsAsync((Employee?)null);

            // Act
            var result = await _controller.GetEmployeeById(999);

            // Assert
            var notFoundResult = Assert.IsType<NotFoundObjectResult>(result.Result);
            Assert.NotNull(notFoundResult.Value);
        }

        [Fact]
        public async Task GetEmployeeById_ReturnsInternalServerError_WhenExceptionThrown()
        {
            // Arrange
            _mockService.Setup(s => s.GetEmployeeByIdAsync(1))
                .ThrowsAsync(new Exception("Database error"));

            // Act
            var result = await _controller.GetEmployeeById(1);

            // Assert
            var statusResult = Assert.IsType<ObjectResult>(result.Result);
            Assert.Equal(500, statusResult.StatusCode);
        }

        // GetEmployeesByDepartment Tests
        [Fact]
        public async Task GetEmployeesByDepartment_ReturnsOkResult_WithEmployeeList()
        {
            // Arrange
            var employees = new List<Employee>
            {
                CreateTestEmployee(1, 1),
                CreateTestEmployee(2, 1)
            };
            _mockService.Setup(s => s.GetEmployeesByDepartmentAsync(1))
                .ReturnsAsync(employees);

            // Act
            var result = await _controller.GetEmployeesByDepartment(1);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnedEmployees = Assert.IsAssignableFrom<IEnumerable<Employee>>(okResult.Value);
            Assert.Equal(2, returnedEmployees.Count());
        }

        [Fact]
        public async Task GetEmployeesByDepartment_ReturnsOkResult_WithEmptyList()
        {
            // Arrange
            _mockService.Setup(s => s.GetEmployeesByDepartmentAsync(1))
                .ReturnsAsync(new List<Employee>());

            // Act
            var result = await _controller.GetEmployeesByDepartment(1);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnedEmployees = Assert.IsAssignableFrom<IEnumerable<Employee>>(okResult.Value);
            Assert.Empty(returnedEmployees);
        }

        // CreateEmployee Tests
        [Fact]
        public async Task CreateEmployee_ReturnsCreatedAtActionResult_WhenSuccessful()
        {
            // Arrange
            var employee = CreateTestEmployee();
            _mockService.Setup(s => s.AddEmployeeAsync(It.IsAny<Employee>()))
                .ReturnsAsync(1);

            // Act
            var result = await _controller.CreateEmployee(employee);

            // Assert
            var createdResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            Assert.Equal(nameof(backend.Controllers.EmployeeController.GetEmployeeById), createdResult.ActionName);
            Assert.NotNull(createdResult.RouteValues);
            Assert.Equal(1, (int)((dynamic)createdResult.RouteValues["id"]!));
        }

        [Fact]
        public async Task CreateEmployee_ReturnsBadRequest_WhenArgumentExceptionThrown()
        {
            // Arrange
            var employee = new Employee { FirstName = "", LastName = "Doe", EmailAddress = "john@example.com", DepartmentId = 1 };
            _mockService.Setup(s => s.AddEmployeeAsync(It.IsAny<Employee>()))
                .ThrowsAsync(new ArgumentException("First name cannot be empty"));

            // Act
            var result = await _controller.CreateEmployee(employee);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
            Assert.NotNull(badRequestResult.Value);
        }

        [Fact]
        public async Task CreateEmployee_ReturnsConflict_WhenInvalidOperationExceptionThrown()
        {
            // Arrange
            var employee = CreateTestEmployee();
            _mockService.Setup(s => s.AddEmployeeAsync(It.IsAny<Employee>()))
                .ThrowsAsync(new InvalidOperationException("Email already exists"));

            // Act
            var result = await _controller.CreateEmployee(employee);

            // Assert
            var conflictResult = Assert.IsType<ConflictObjectResult>(result.Result);
            Assert.NotNull(conflictResult.Value);
        }

        [Fact]
        public async Task CreateEmployee_ReturnsInternalServerError_WhenUnexpectedExceptionThrown()
        {
            // Arrange
            var employee = CreateTestEmployee();
            _mockService.Setup(s => s.AddEmployeeAsync(It.IsAny<Employee>()))
                .ThrowsAsync(new Exception("Database error"));

            // Act
            var result = await _controller.CreateEmployee(employee);

            // Assert
            var statusResult = Assert.IsType<ObjectResult>(result.Result);
            Assert.Equal(500, statusResult.StatusCode);
        }

        // UpdateEmployee Tests
        [Fact]
        public async Task UpdateEmployee_ReturnsNoContent_WhenSuccessful()
        {
            // Arrange
            var employee = CreateTestEmployee(1);
            _mockService.Setup(s => s.UpdateEmployeeAsync(It.IsAny<Employee>()))
                .ReturnsAsync(true);

            // Act
            var result = await _controller.UpdateEmployee(1, employee);

            // Assert
            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public async Task UpdateEmployee_ReturnsBadRequest_WhenIdMismatch()
        {
            // Arrange
            var employee = CreateTestEmployee(2);

            // Act
            var result = await _controller.UpdateEmployee(1, employee);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.NotNull(badRequestResult.Value);
        }

        [Fact]
        public async Task UpdateEmployee_ReturnsNotFound_WhenEmployeeDoesNotExist()
        {
            // Arrange
            var employee = CreateTestEmployee(1);
            _mockService.Setup(s => s.UpdateEmployeeAsync(It.IsAny<Employee>()))
                .ReturnsAsync(false);

            // Act
            var result = await _controller.UpdateEmployee(1, employee);

            // Assert
            var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
            Assert.NotNull(notFoundResult.Value);
        }

        [Fact]
        public async Task UpdateEmployee_ReturnsBadRequest_WhenArgumentExceptionThrown()
        {
            // Arrange
            var employee = CreateTestEmployee(1);
            _mockService.Setup(s => s.UpdateEmployeeAsync(It.IsAny<Employee>()))
                .ThrowsAsync(new ArgumentException("Invalid data"));

            // Act
            var result = await _controller.UpdateEmployee(1, employee);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.NotNull(badRequestResult.Value);
        }

        [Fact]
        public async Task UpdateEmployee_ReturnsConflict_WhenInvalidOperationExceptionThrown()
        {
            // Arrange
            var employee = CreateTestEmployee(1);
            _mockService.Setup(s => s.UpdateEmployeeAsync(It.IsAny<Employee>()))
                .ThrowsAsync(new InvalidOperationException("Email already exists"));

            // Act
            var result = await _controller.UpdateEmployee(1, employee);

            // Assert
            var conflictResult = Assert.IsType<ConflictObjectResult>(result);
            Assert.NotNull(conflictResult.Value);
        }

        [Fact]
        public async Task UpdateEmployee_ReturnsInternalServerError_WhenUnexpectedExceptionThrown()
        {
            // Arrange
            var employee = CreateTestEmployee(1);
            _mockService.Setup(s => s.UpdateEmployeeAsync(It.IsAny<Employee>()))
                .ThrowsAsync(new Exception("Database error"));

            // Act
            var result = await _controller.UpdateEmployee(1, employee);

            // Assert
            var statusResult = Assert.IsType<ObjectResult>(result);
            Assert.Equal(500, statusResult.StatusCode);
        }

        // DeleteEmployee Tests
        [Fact]
        public async Task DeleteEmployee_ReturnsNoContent_WhenSuccessful()
        {
            // Arrange
            _mockService.Setup(s => s.DeleteEmployeeAsync(1))
                .ReturnsAsync(true);

            // Act
            var result = await _controller.DeleteEmployee(1);

            // Assert
            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public async Task DeleteEmployee_ReturnsNotFound_WhenEmployeeDoesNotExist()
        {
            // Arrange
            _mockService.Setup(s => s.DeleteEmployeeAsync(999))
                .ReturnsAsync(false);

            // Act
            var result = await _controller.DeleteEmployee(999);

            // Assert
            var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
            Assert.NotNull(notFoundResult.Value);
        }

        [Fact]
        public async Task DeleteEmployee_ReturnsInternalServerError_WhenExceptionThrown()
        {
            // Arrange
            _mockService.Setup(s => s.DeleteEmployeeAsync(1))
                .ThrowsAsync(new Exception("Database error"));

            // Act
            var result = await _controller.DeleteEmployee(1);

            // Assert
            var statusResult = Assert.IsType<ObjectResult>(result);
            Assert.Equal(500, statusResult.StatusCode);
        }
    }
}
