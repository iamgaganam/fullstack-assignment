using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    /// <summary>
    /// API controller for managing employee operations.
    /// Provides endpoints for CRUD operations on employees.
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class EmployeeController : ControllerBase
    {
        private readonly backend.Interfaces.IEmployeeService _employeeService;
        private readonly ILogger<EmployeeController> _logger;

        /// <summary>
        /// Initializes a new instance of the EmployeeController.
        /// </summary>
        /// <param name="employeeService">The employee service for business logic.</param>
        /// <param name="logger">The logger for logging operations.</param>
        public EmployeeController(backend.Interfaces.IEmployeeService employeeService, ILogger<EmployeeController> logger)
        {
            _employeeService = employeeService;
            _logger = logger;
        }

        /// <summary>
        /// Retrieves all employees from the database.
        /// </summary>
        /// <returns>A list of all employees.</returns>
        /// <response code="200">Returns the list of employees.</response>
        /// <response code="500">If there is a server error retrieving employees.</response>
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
        /// Retrieves an employee by their ID.
        /// </summary>
        /// <param name="id">The unique identifier of the employee.</param>
        /// <returns>The employee with the specified ID.</returns>
        /// <response code="200">Returns the employee if found.</response>
        /// <response code="404">If the employee is not found.</response>
        /// <response code="500">If there is a server error retrieving the employee.</response>
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
        /// Retrieves all employees belonging to a specific department.
        /// </summary>
        /// <param name="departmentId">The unique identifier of the department.</param>
        /// <returns>A list of employees in the specified department.</returns>
        /// <response code="200">Returns the list of employees in the department.</response>
        /// <response code="500">If there is a server error retrieving the employees.</response>
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
        /// Creates a new employee.
        /// </summary>
        /// <param name="employee">The employee data to create.</param>
        /// <returns>The ID of the newly created employee.</returns>
        /// <response code="201">Returns the newly created employee ID.</response>
        /// <response code="400">If the employee data is invalid or validation fails.</response>
        /// <response code="409">If the employee already exists or department doesn't exist.</response>
        /// <response code="500">If there is a server error creating the employee.</response>
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
        /// Updates an existing employee.
        /// </summary>
        /// <param name="id">The unique identifier of the employee to update.</param>
        /// <param name="employee">The updated employee data.</param>
        /// <returns>No content if successful.</returns>
        /// <response code="204">If the employee was successfully updated.</response>
        /// <response code="400">If the employee data is invalid or ID mismatch.</response>
        /// <response code="404">If the employee is not found.</response>
        /// <response code="409">If the update conflicts with existing data.</response>
        /// <response code="500">If there is a server error updating the employee.</response>
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
        /// Deletes an employee by their ID.
        /// </summary>
        /// <param name="id">The unique identifier of the employee to delete.</param>
        /// <returns>No content if successful.</returns>
        /// <response code="204">If the employee was successfully deleted.</response>
        /// <response code="404">If the employee is not found.</response>
        /// <response code="500">If there is a server error deleting the employee.</response>
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
