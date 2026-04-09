using backend.Interfaces;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace backend.Tests.Controllers
{
    public class DepartmentControllerTests
    {
        private readonly Mock<IDepartmentService> _mockService;
        private readonly Mock<ILogger<backend.Controllers.DepartmentController>> _mockLogger;
        private readonly backend.Controllers.DepartmentController _controller;

        public DepartmentControllerTests()
        {
            _mockService = new Mock<IDepartmentService>();
            _mockLogger = new Mock<ILogger<backend.Controllers.DepartmentController>>();
            _controller = new backend.Controllers.DepartmentController(_mockService.Object, _mockLogger.Object);
        }

        private Department CreateTestDepartment(int id = 1)
        {
            return new Department
            {
                DepartmentId = id,
                DepartmentCode = "IT",
                DepartmentName = "Information Technology",
                CreatedDate = DateTime.Now,
                ModifiedDate = DateTime.Now
            };
        }

        // GetAllDepartments Tests
        [Fact]
        public async Task GetAllDepartments_ReturnsOkResult_WithDepartmentList()
        {
            // Arrange
            var departments = new List<Department>
            {
                CreateTestDepartment(1),
                CreateTestDepartment(2)
            };
            _mockService.Setup(s => s.GetAllDepartmentsAsync())
                .ReturnsAsync(departments);

            // Act
            var result = await _controller.GetAllDepartments();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnedDepartments = Assert.IsAssignableFrom<IEnumerable<Department>>(okResult.Value);
            Assert.Equal(2, returnedDepartments.Count());
        }

        [Fact]
        public async Task GetAllDepartments_ReturnsOkResult_WithEmptyList()
        {
            // Arrange
            _mockService.Setup(s => s.GetAllDepartmentsAsync())
                .ReturnsAsync(new List<Department>());

            // Act
            var result = await _controller.GetAllDepartments();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnedDepartments = Assert.IsAssignableFrom<IEnumerable<Department>>(okResult.Value);
            Assert.Empty(returnedDepartments);
        }

        [Fact]
        public async Task GetAllDepartments_ReturnsInternalServerError_WhenExceptionThrown()
        {
            // Arrange
            _mockService.Setup(s => s.GetAllDepartmentsAsync())
                .ThrowsAsync(new Exception("Database error"));

            // Act
            var result = await _controller.GetAllDepartments();

            // Assert
            var statusResult = Assert.IsType<ObjectResult>(result.Result);
            Assert.Equal(500, statusResult.StatusCode);
        }

        // GetDepartmentById Tests
        [Fact]
        public async Task GetDepartmentById_ReturnsOkResult_WithDepartment()
        {
            // Arrange
            var department = CreateTestDepartment(1);
            _mockService.Setup(s => s.GetDepartmentByIdAsync(1))
                .ReturnsAsync(department);

            // Act
            var result = await _controller.GetDepartmentById(1);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnedDepartment = Assert.IsType<Department>(okResult.Value);
            Assert.Equal(1, returnedDepartment.DepartmentId);
        }

        [Fact]
        public async Task GetDepartmentById_ReturnsNotFound_WhenDepartmentDoesNotExist()
        {
            // Arrange
            _mockService.Setup(s => s.GetDepartmentByIdAsync(999))
                .ReturnsAsync((Department?)null);

            // Act
            var result = await _controller.GetDepartmentById(999);

            // Assert
            var notFoundResult = Assert.IsType<NotFoundObjectResult>(result.Result);
            Assert.NotNull(notFoundResult.Value);
        }

        [Fact]
        public async Task GetDepartmentById_ReturnsInternalServerError_WhenExceptionThrown()
        {
            // Arrange
            _mockService.Setup(s => s.GetDepartmentByIdAsync(1))
                .ThrowsAsync(new Exception("Database error"));

            // Act
            var result = await _controller.GetDepartmentById(1);

            // Assert
            var statusResult = Assert.IsType<ObjectResult>(result.Result);
            Assert.Equal(500, statusResult.StatusCode);
        }

        // CreateDepartment Tests
        [Fact]
        public async Task CreateDepartment_ReturnsCreatedAtActionResult_WhenSuccessful()
        {
            // Arrange
            var department = new Department { DepartmentCode = "IT", DepartmentName = "IT Department" };
            _mockService.Setup(s => s.AddDepartmentAsync(It.IsAny<Department>()))
                .ReturnsAsync(1);

            // Act
            var result = await _controller.CreateDepartment(department);

            // Assert
            var createdResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            Assert.Equal(nameof(backend.Controllers.DepartmentController.GetDepartmentById), createdResult.ActionName);
            Assert.NotNull(createdResult.RouteValues);
            Assert.Equal(1, (int)((dynamic)createdResult.RouteValues["id"]!));
        }

        [Fact]
        public async Task CreateDepartment_ReturnsBadRequest_WhenArgumentExceptionThrown()
        {
            // Arrange
            var department = new Department { DepartmentCode = "", DepartmentName = "IT" };
            _mockService.Setup(s => s.AddDepartmentAsync(It.IsAny<Department>()))
                .ThrowsAsync(new ArgumentException("Code cannot be empty"));

            // Act
            var result = await _controller.CreateDepartment(department);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
            Assert.NotNull(badRequestResult.Value);
        }

        [Fact]
        public async Task CreateDepartment_ReturnsConflict_WhenInvalidOperationExceptionThrown()
        {
            // Arrange
            var department = new Department { DepartmentCode = "IT", DepartmentName = "IT Department" };
            _mockService.Setup(s => s.AddDepartmentAsync(It.IsAny<Department>()))
                .ThrowsAsync(new InvalidOperationException("Code already exists"));

            // Act
            var result = await _controller.CreateDepartment(department);

            // Assert
            var conflictResult = Assert.IsType<ConflictObjectResult>(result.Result);
            Assert.NotNull(conflictResult.Value);
        }

        [Fact]
        public async Task CreateDepartment_ReturnsInternalServerError_WhenUnexpectedExceptionThrown()
        {
            // Arrange
            var department = new Department { DepartmentCode = "IT", DepartmentName = "IT Department" };
            _mockService.Setup(s => s.AddDepartmentAsync(It.IsAny<Department>()))
                .ThrowsAsync(new Exception("Database error"));

            // Act
            var result = await _controller.CreateDepartment(department);

            // Assert
            var statusResult = Assert.IsType<ObjectResult>(result.Result);
            Assert.Equal(500, statusResult.StatusCode);
        }

        // UpdateDepartment Tests
        [Fact]
        public async Task UpdateDepartment_ReturnsNoContent_WhenSuccessful()
        {
            // Arrange
            var department = CreateTestDepartment(1);
            _mockService.Setup(s => s.UpdateDepartmentAsync(It.IsAny<Department>()))
                .ReturnsAsync(true);

            // Act
            var result = await _controller.UpdateDepartment(1, department);

            // Assert
            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public async Task UpdateDepartment_ReturnsBadRequest_WhenIdMismatch()
        {
            // Arrange
            var department = CreateTestDepartment(2);

            // Act
            var result = await _controller.UpdateDepartment(1, department);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.NotNull(badRequestResult.Value);
        }

        [Fact]
        public async Task UpdateDepartment_ReturnsNotFound_WhenDepartmentDoesNotExist()
        {
            // Arrange
            var department = CreateTestDepartment(1);
            _mockService.Setup(s => s.UpdateDepartmentAsync(It.IsAny<Department>()))
                .ReturnsAsync(false);

            // Act
            var result = await _controller.UpdateDepartment(1, department);

            // Assert
            var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
            Assert.NotNull(notFoundResult.Value);
        }

        [Fact]
        public async Task UpdateDepartment_ReturnsBadRequest_WhenArgumentExceptionThrown()
        {
            // Arrange
            var department = CreateTestDepartment(1);
            _mockService.Setup(s => s.UpdateDepartmentAsync(It.IsAny<Department>()))
                .ThrowsAsync(new ArgumentException("Invalid data"));

            // Act
            var result = await _controller.UpdateDepartment(1, department);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.NotNull(badRequestResult.Value);
        }

        [Fact]
        public async Task UpdateDepartment_ReturnsConflict_WhenInvalidOperationExceptionThrown()
        {
            // Arrange
            var department = CreateTestDepartment(1);
            _mockService.Setup(s => s.UpdateDepartmentAsync(It.IsAny<Department>()))
                .ThrowsAsync(new InvalidOperationException("Code already exists"));

            // Act
            var result = await _controller.UpdateDepartment(1, department);

            // Assert
            var conflictResult = Assert.IsType<ConflictObjectResult>(result);
            Assert.NotNull(conflictResult.Value);
        }

        [Fact]
        public async Task UpdateDepartment_ReturnsInternalServerError_WhenUnexpectedExceptionThrown()
        {
            // Arrange
            var department = CreateTestDepartment(1);
            _mockService.Setup(s => s.UpdateDepartmentAsync(It.IsAny<Department>()))
                .ThrowsAsync(new Exception("Database error"));

            // Act
            var result = await _controller.UpdateDepartment(1, department);

            // Assert
            var statusResult = Assert.IsType<ObjectResult>(result);
            Assert.Equal(500, statusResult.StatusCode);
        }
    }
}
