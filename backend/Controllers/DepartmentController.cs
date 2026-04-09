using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    /// <summary>
    /// API controller for managing department operations.
    /// Provides endpoints for CRUD operations on departments.
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class DepartmentController : ControllerBase
    {
        private readonly backend.Interfaces.IDepartmentService _departmentService;
        private readonly ILogger<DepartmentController> _logger;

        /// <summary>
        /// Initializes a new instance of the DepartmentController.
        /// </summary>
        /// <param name="departmentService">The department service for business logic.</param>
        /// <param name="logger">The logger for logging operations.</param>
        public DepartmentController(backend.Interfaces.IDepartmentService departmentService, ILogger<DepartmentController> logger)
        {
            _departmentService = departmentService;
            _logger = logger;
        }

        /// <summary>
        /// Retrieves all departments from the database.
        /// </summary>
        /// <returns>A list of all departments.</returns>
        /// <response code="200">Returns the list of departments.</response>
        /// <response code="500">If there is a server error retrieving departments.</response>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Department>>> GetAllDepartments()
        {
            try
            {
                var departments = await _departmentService.GetAllDepartmentsAsync();
                return Ok(departments);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error fetching departments: {ex.Message}");
                return StatusCode(500, new { message = "Error fetching departments", error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        /// <summary>
        /// Retrieves a department by their ID.
        /// </summary>
        /// <param name="id">The unique identifier of the department.</param>
        /// <returns>The department with the specified ID.</returns>
        /// <response code="200">Returns the department if found.</response>
        /// <response code="404">If the department is not found.</response>
        /// <response code="500">If there is a server error retrieving the department.</response>
        public async Task<ActionResult<Department>> GetDepartmentById(int id)
        {
            try
            {
                var department = await _departmentService.GetDepartmentByIdAsync(id);
                if (department == null)
                    return NotFound(new { message = "Department not found" });

                return Ok(department);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error fetching department: {ex.Message}");
                return StatusCode(500, new { message = "Error fetching department", error = ex.Message });
            }
        }

        [HttpPost]
        /// <summary>
        /// Creates a new department.
        /// </summary>
        /// <param name="department">The department data to create.</param>
        /// <returns>The ID of the newly created department.</returns>
        /// <response code="201">Returns the newly created department ID.</response>
        /// <response code="400">If the department data is invalid.</response>
        /// <response code="409">If a department with the same code already exists.</response>
        /// <response code="500">If there is a server error creating the department.</response>
        public async Task<ActionResult<int>> CreateDepartment([FromBody] Department department)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var departmentId = await _departmentService.AddDepartmentAsync(department);
                return CreatedAtAction(nameof(GetDepartmentById), new { id = departmentId }, departmentId);
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning($"Validation error: {ex.Message}");
                return BadRequest(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning($"Invalid operation: {ex.Message}");
                return Conflict(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error creating department: {ex.Message}");
                return StatusCode(500, new { message = "Error creating department", error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        /// <summary>
        /// Updates an existing department.
        /// </summary>
        /// <param name="id">The unique identifier of the department to update.</param>
        /// <param name="department">The updated department data.</param>
        /// <returns>No content if successful.</returns>
        /// <response code="204">If the department was successfully updated.</response>
        /// <response code="400">If the department data is invalid or ID mismatch.</response>
        /// <response code="404">If the department is not found.</response>
        /// <response code="409">If the update conflicts with existing data.</response>
        /// <response code="500">If there is a server error updating the department.</response>
        public async Task<ActionResult> UpdateDepartment(int id, [FromBody] Department department)
        {
            try
            {
                if (id != department.DepartmentId)
                    return BadRequest(new { message = "ID mismatch" });

                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var success = await _departmentService.UpdateDepartmentAsync(department);
                if (!success)
                    return NotFound(new { message = "Department not found" });

                return NoContent();
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning($"Validation error: {ex.Message}");
                return BadRequest(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning($"Invalid operation: {ex.Message}");
                return Conflict(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error updating department: {ex.Message}");
                return StatusCode(500, new { message = "Error updating department", error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        /// <summary>
        /// Deletes a department by their ID.
        /// </summary>
        /// <param name="id">The unique identifier of the department to delete.</param>
        /// <returns>No content if successful.</returns>
        /// <response code="204">If the department was successfully deleted.</response>
        /// <response code="404">If the department is not found.</response>
        /// <response code="500">If there is a server error deleting the department.</response>
        public async Task<ActionResult> DeleteDepartment(int id)
        {
            try
            {
                var success = await _departmentService.DeleteDepartmentAsync(id);
                if (!success)
                    return NotFound(new { message = "Department not found" });

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error deleting department: {ex.Message}");
                return StatusCode(500, new { message = "Error deleting department", error = ex.Message });
            }
        }
    }
}
