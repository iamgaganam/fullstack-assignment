using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    /// <summary>
    /// Employee API endpoints.
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class EmployeeController : ControllerBase
    {
        private readonly backend.Interfaces.IEmployeeService _employeeService;
        private readonly ILogger<EmployeeController> _logger;

        /// <summary>
        /// Creates an EmployeeController.
        /// </summary>
        public EmployeeController(backend.Interfaces.IEmployeeService employeeService, ILogger<EmployeeController> logger)
        {
            _employeeService = employeeService;
            _logger = logger;
        }

        /// <summary>
        /// Gets all employees.
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Employee>>> GetAllEmployees()
        {
            try
            {
                var employees = await _employeeService.GetAllEmployeesAsync();
                return Ok(employees);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error fetching employees: {ex.Message}");
                return StatusCode(500, new { message = "Error fetching employees", error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        /// <summary>
        /// Gets an employee by ID.
        /// </summary>
        public async Task<ActionResult<Employee>> GetEmployeeById(int id)
        {
            try
            {
                var employee = await _employeeService.GetEmployeeByIdAsync(id);
                if (employee == null)
                    return NotFound(new { message = "Employee not found" });

                return Ok(employee);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error fetching employee: {ex.Message}");
                return StatusCode(500, new { message = "Error fetching employee", error = ex.Message });
            }
        }

        [HttpGet("department/{departmentId}")]
        /// <summary>
        /// Gets employees by department.
        /// </summary>
        public async Task<ActionResult<IEnumerable<Employee>>> GetEmployeesByDepartment(int departmentId)
        {
            try
            {
                var employees = await _employeeService.GetEmployeesByDepartmentAsync(departmentId);
                return Ok(employees);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error fetching employees: {ex.Message}");
                return StatusCode(500, new { message = "Error fetching employees", error = ex.Message });
            }
        }

        [HttpPost]
        /// <summary>
        /// Creates an employee.
        /// </summary>
        public async Task<ActionResult<int>> CreateEmployee([FromBody] Employee employee)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var employeeId = await _employeeService.AddEmployeeAsync(employee);
                return CreatedAtAction(nameof(GetEmployeeById), new { id = employeeId }, employeeId);
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
                _logger.LogError($"Error creating employee: {ex.Message}");
                return StatusCode(500, new { message = "Error creating employee", error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        /// <summary>
        /// Updates an employee.
        /// </summary>
        public async Task<ActionResult> UpdateEmployee(int id, [FromBody] Employee employee)
        {
            try
            {
                if (id != employee.EmployeeId)
                    return BadRequest(new { message = "ID mismatch" });

                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var success = await _employeeService.UpdateEmployeeAsync(employee);
                if (!success)
                    return NotFound(new { message = "Employee not found" });

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
                _logger.LogError($"Error updating employee: {ex.Message}");
                return StatusCode(500, new { message = "Error updating employee", error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        /// <summary>
        /// Deletes an employee.
        /// </summary>
        public async Task<ActionResult> DeleteEmployee(int id)
        {
            try
            {
                var success = await _employeeService.DeleteEmployeeAsync(id);
                if (!success)
                    return NotFound(new { message = "Employee not found" });

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error deleting employee: {ex.Message}");
                return StatusCode(500, new { message = "Error deleting employee", error = ex.Message });
            }
        }
    }
}
