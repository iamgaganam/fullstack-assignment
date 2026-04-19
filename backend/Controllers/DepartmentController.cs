using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    /// <summary>
    /// Department API endpoints.
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class DepartmentController : ControllerBase
    {
        private readonly backend.Interfaces.IDepartmentService _departmentService;
        private readonly ILogger<DepartmentController> _logger;

        /// <summary>
        /// Creates a DepartmentController.
        /// </summary>
        public DepartmentController(backend.Interfaces.IDepartmentService departmentService, ILogger<DepartmentController> logger)
        {
            _departmentService = departmentService;
            _logger = logger;
        }

        /// <summary>
        /// Gets all departments.
        /// </summary>
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
        /// Gets a department by ID.
        /// </summary>
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
        /// Creates a department.
        /// </summary>
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
        /// Updates a department.
        /// </summary>
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
        /// Deletes a department.
        /// </summary>
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
