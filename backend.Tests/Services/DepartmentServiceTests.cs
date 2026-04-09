using backend.Interfaces;
using backend.Models;
using backend.Services;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace backend.Tests.Services
{
    public class DepartmentServiceTests
    {
        private readonly Mock<IDepartmentRepository> _mockRepository;
        private readonly Mock<ILogger<DepartmentService>> _mockLogger;
        private readonly DepartmentService _service;

        public DepartmentServiceTests()
        {
            _mockRepository = new Mock<IDepartmentRepository>();
            _mockLogger = new Mock<ILogger<DepartmentService>>();
            _service = new DepartmentService(_mockRepository.Object, _mockLogger.Object);
        }

        // GetAllDepartmentsAsync Tests
        [Fact]
        public async Task GetAllDepartmentsAsync_ReturnsEmptyList_WhenNoDepartmentsExist()
        {
            // Arrange
            _mockRepository.Setup(r => r.GetAllDepartmentsAsync())
                .ReturnsAsync(new List<Department>());

            // Act
            var result = await _service.GetAllDepartmentsAsync();

            // Assert
            Assert.Empty(result);
            _mockRepository.Verify(r => r.GetAllDepartmentsAsync(), Times.Once);
        }

        [Fact]
        public async Task GetAllDepartmentsAsync_ReturnsAllDepartments_WhenDepartmentsExist()
        {
            // Arrange
            var departments = new List<Department>
            {
                new Department { DepartmentId = 1, DepartmentCode = "IT", DepartmentName = "Information Technology" },
                new Department { DepartmentId = 2, DepartmentCode = "HR", DepartmentName = "Human Resources" }
            };
            _mockRepository.Setup(r => r.GetAllDepartmentsAsync())
                .ReturnsAsync(departments);

            // Act
            var result = await _service.GetAllDepartmentsAsync();

            // Assert
            Assert.Equal(2, result.Count);
            Assert.Equal("IT", result[0].DepartmentCode);
            _mockRepository.Verify(r => r.GetAllDepartmentsAsync(), Times.Once);
        }

        // GetDepartmentByIdAsync Tests
        [Fact]
        public async Task GetDepartmentByIdAsync_ThrowsArgumentException_WhenIdIsZero()
        {
            // Act & Assert
            await Assert.ThrowsAsync<ArgumentException>(() => _service.GetDepartmentByIdAsync(0));
        }

        [Fact]
        public async Task GetDepartmentByIdAsync_ThrowsArgumentException_WhenIdIsNegative()
        {
            // Act & Assert
            await Assert.ThrowsAsync<ArgumentException>(() => _service.GetDepartmentByIdAsync(-1));
        }

        [Fact]
        public async Task GetDepartmentByIdAsync_ReturnsDepartment_WhenIdIsValid()
        {
            // Arrange
            var department = new Department { DepartmentId = 1, DepartmentCode = "IT", DepartmentName = "IT Department" };
            _mockRepository.Setup(r => r.GetDepartmentByIdAsync(1))
                .ReturnsAsync(department);

            // Act
            var result = await _service.GetDepartmentByIdAsync(1);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("IT", result.DepartmentCode);
            _mockRepository.Verify(r => r.GetDepartmentByIdAsync(1), Times.Once);
        }

        [Fact]
        public async Task GetDepartmentByIdAsync_ReturnsNull_WhenDepartmentNotFound()
        {
            // Arrange
            _mockRepository.Setup(r => r.GetDepartmentByIdAsync(999))
                .ReturnsAsync((Department?)null);

            // Act
            var result = await _service.GetDepartmentByIdAsync(999);

            // Assert
            Assert.Null(result);
        }

        // GetDepartmentByCodeAsync Tests
        [Fact]
        public async Task GetDepartmentByCodeAsync_ThrowsArgumentException_WhenCodeIsNull()
        {
            // Act & Assert
            await Assert.ThrowsAsync<ArgumentException>(() => _service.GetDepartmentByCodeAsync(null!));
        }

        [Fact]
        public async Task GetDepartmentByCodeAsync_ThrowsArgumentException_WhenCodeIsEmpty()
        {
            // Act & Assert
            await Assert.ThrowsAsync<ArgumentException>(() => _service.GetDepartmentByCodeAsync(""));
        }

        [Fact]
        public async Task GetDepartmentByCodeAsync_ThrowsArgumentException_WhenCodeIsWhitespace()
        {
            // Act & Assert
            await Assert.ThrowsAsync<ArgumentException>(() => _service.GetDepartmentByCodeAsync("   "));
        }

        [Fact]
        public async Task GetDepartmentByCodeAsync_TrimsDepartmentCode_BeforeSearch()
        {
            // Arrange
            var department = new Department { DepartmentId = 1, DepartmentCode = "IT", DepartmentName = "IT Department" };
            _mockRepository.Setup(r => r.GetDepartmentByCodeAsync("IT"))
                .ReturnsAsync(department);

            // Act
            var result = await _service.GetDepartmentByCodeAsync("  IT  ");

            // Assert
            Assert.NotNull(result);
            _mockRepository.Verify(r => r.GetDepartmentByCodeAsync("IT"), Times.Once);
        }

        // AddDepartmentAsync Tests
        [Fact]
        public async Task AddDepartmentAsync_ThrowsArgumentNullException_WhenDepartmentIsNull()
        {
            // Act & Assert
            await Assert.ThrowsAsync<ArgumentNullException>(() => _service.AddDepartmentAsync(null!));
        }

        [Fact]
        public async Task AddDepartmentAsync_ThrowsArgumentException_WhenDepartmentCodeIsEmpty()
        {
            // Arrange
            var department = new Department { DepartmentCode = "", DepartmentName = "IT Department" };

            // Act & Assert
            await Assert.ThrowsAsync<ArgumentException>(() => _service.AddDepartmentAsync(department));
        }

        [Fact]
        public async Task AddDepartmentAsync_ThrowsArgumentException_WhenDepartmentNameIsEmpty()
        {
            // Arrange
            var department = new Department { DepartmentCode = "IT", DepartmentName = "" };

            // Act & Assert
            await Assert.ThrowsAsync<ArgumentException>(() => _service.AddDepartmentAsync(department));
        }

        [Fact]
        public async Task AddDepartmentAsync_ThrowsArgumentException_WhenDepartmentCodeExceedMaxLength()
        {
            // Arrange
            var department = new Department 
            { 
                DepartmentCode = new string('A', 51), 
                DepartmentName = "IT Department" 
            };

            // Act & Assert
            await Assert.ThrowsAsync<ArgumentException>(() => _service.AddDepartmentAsync(department));
        }

        [Fact]
        public async Task AddDepartmentAsync_ThrowsArgumentException_WhenDepartmentNameExceedMaxLength()
        {
            // Arrange
            var department = new Department 
            { 
                DepartmentCode = "IT", 
                DepartmentName = new string('A', 101) 
            };

            // Act & Assert
            await Assert.ThrowsAsync<ArgumentException>(() => _service.AddDepartmentAsync(department));
        }

        [Fact]
        public async Task AddDepartmentAsync_ThrowsInvalidOperationException_WhenDepartmentCodeAlreadyExists()
        {
            // Arrange
            var existingDepartment = new Department { DepartmentId = 1, DepartmentCode = "IT", DepartmentName = "Existing" };
            var newDepartment = new Department { DepartmentCode = "IT", DepartmentName = "New IT" };

            _mockRepository.Setup(r => r.GetDepartmentByCodeAsync("IT"))
                .ReturnsAsync(existingDepartment);

            // Act & Assert
            await Assert.ThrowsAsync<InvalidOperationException>(() => _service.AddDepartmentAsync(newDepartment));
        }

        [Fact]
        public async Task AddDepartmentAsync_AddsNewDepartment_WhenValidAndCodeDoesNotExist()
        {
            // Arrange
            var department = new Department { DepartmentCode = "IT", DepartmentName = "IT Department" };

            _mockRepository.Setup(r => r.GetDepartmentByCodeAsync("IT"))
                .ReturnsAsync((Department?)null);
            _mockRepository.Setup(r => r.AddDepartmentAsync(department))
                .ReturnsAsync(1);

            // Act
            var result = await _service.AddDepartmentAsync(department);

            // Assert
            Assert.Equal(1, result);
            _mockRepository.Verify(r => r.AddDepartmentAsync(department), Times.Once);
        }

        // UpdateDepartmentAsync Tests
        [Fact]
        public async Task UpdateDepartmentAsync_ThrowsArgumentException_WhenIdIsZero()
        {
            // Arrange
            var department = new Department { DepartmentId = 0, DepartmentCode = "IT", DepartmentName = "IT Department" };

            // Act & Assert
            await Assert.ThrowsAsync<ArgumentException>(() => _service.UpdateDepartmentAsync(department));
        }

        [Fact]
        public async Task UpdateDepartmentAsync_ThrowsInvalidOperationException_WhenNewCodeAlreadyExistsForAnotherDepartment()
        {
            // Arrange
            var existingDepartment = new Department { DepartmentId = 2, DepartmentCode = "HR", DepartmentName = "HR" };
            var updateDepartment = new Department { DepartmentId = 1, DepartmentCode = "HR", DepartmentName = "Updated IT" };

            _mockRepository.Setup(r => r.GetDepartmentByCodeAsync("HR"))
                .ReturnsAsync(existingDepartment);

            // Act & Assert
            await Assert.ThrowsAsync<InvalidOperationException>(() => _service.UpdateDepartmentAsync(updateDepartment));
        }

        [Fact]
        public async Task UpdateDepartmentAsync_AllowsUpdateWithSameCode_ForSameDepartment()
        {
            // Arrange
            var department = new Department { DepartmentId = 1, DepartmentCode = "IT", DepartmentName = "Updated IT" };

            _mockRepository.Setup(r => r.GetDepartmentByCodeAsync("IT"))
                .ReturnsAsync(department);
            _mockRepository.Setup(r => r.UpdateDepartmentAsync(department))
                .ReturnsAsync(true);

            // Act
            var result = await _service.UpdateDepartmentAsync(department);

            // Assert
            Assert.True(result);
            _mockRepository.Verify(r => r.UpdateDepartmentAsync(department), Times.Once);
        }

        [Fact]
        public async Task UpdateDepartmentAsync_UpdatesDepartment_WhenValidAndCodeDoesNotExistElsewhere()
        {
            // Arrange
            var department = new Department { DepartmentId = 1, DepartmentCode = "IT", DepartmentName = "Updated IT" };

            _mockRepository.Setup(r => r.GetDepartmentByCodeAsync("IT"))
                .ReturnsAsync((Department?)null);
            _mockRepository.Setup(r => r.UpdateDepartmentAsync(department))
                .ReturnsAsync(true);

            // Act
            var result = await _service.UpdateDepartmentAsync(department);

            // Assert
            Assert.True(result);
        }

        // DeleteDepartmentAsync Tests
        [Fact]
        public async Task DeleteDepartmentAsync_ThrowsArgumentException_WhenIdIsZero()
        {
            // Act & Assert
            await Assert.ThrowsAsync<ArgumentException>(() => _service.DeleteDepartmentAsync(0));
        }

        [Fact]
        public async Task DeleteDepartmentAsync_DeletesDepartment_WhenIdIsValid()
        {
            // Arrange
            _mockRepository.Setup(r => r.DeleteDepartmentAsync(1))
                .ReturnsAsync(true);

            // Act
            var result = await _service.DeleteDepartmentAsync(1);

            // Assert
            Assert.True(result);
            _mockRepository.Verify(r => r.DeleteDepartmentAsync(1), Times.Once);
        }

        [Fact]
        public async Task DeleteDepartmentAsync_ReturnsFalse_WhenDepartmentNotFound()
        {
            // Arrange
            _mockRepository.Setup(r => r.DeleteDepartmentAsync(999))
                .ReturnsAsync(false);

            // Act
            var result = await _service.DeleteDepartmentAsync(999);

            // Assert
            Assert.False(result);
        }
    }
}
