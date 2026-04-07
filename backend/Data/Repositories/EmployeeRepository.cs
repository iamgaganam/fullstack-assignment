using System.Data;
using backend.Interfaces;
using backend.Models;
using Microsoft.Data.SqlClient;

namespace backend.Data.Repositories
{
    public class EmployeeRepository : IEmployeeRepository
    {
        private readonly string _connectionString;
        private readonly ILogger<EmployeeRepository> _logger;

        public EmployeeRepository(IConfiguration configuration, ILogger<EmployeeRepository> logger)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection") 
                ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
            _logger = logger;
        }

        public async Task<List<Employee>> GetAllEmployeesAsync()
        {
            var employees = new List<Employee>();
            try
            {
                var query = @"SELECT EmployeeId, FirstName, LastName, EmailAddress, DateOfBirth, Age, Salary, DepartmentId, CreatedDate, ModifiedDate 
                              FROM [dbo].[Employee] 
                              ORDER BY FirstName, LastName";
                
                using (var connection = new SqlConnection(_connectionString))
                {
                    using (var command = new SqlCommand(query, connection))
                    {
                        await connection.OpenAsync();
                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                employees.Add(new Employee
                                {
                                    EmployeeId = reader.GetInt32(0),
                                    FirstName = reader.GetString(1),
                                    LastName = reader.GetString(2),
                                    EmailAddress = reader.GetString(3),
                                    DateOfBirth = reader.GetDateTime(4),
                                    Age = reader.GetInt32(5),
                                    Salary = reader.GetDecimal(6),
                                    DepartmentId = reader.GetInt32(7),
                                    CreatedDate = reader.GetDateTime(8),
                                    ModifiedDate = reader.GetDateTime(9)
                                });
                            }
                        }
                    }
                }
                _logger.LogInformation("Retrieved all employees successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error retrieving employees: {ex.Message}");
                throw;
            }
            return employees;
        }

        public async Task<Employee?> GetEmployeeByIdAsync(int employeeId)
        {
            try
            {
                var query = @"SELECT EmployeeId, FirstName, LastName, EmailAddress, DateOfBirth, Age, Salary, DepartmentId, CreatedDate, ModifiedDate 
                              FROM [dbo].[Employee] 
                              WHERE EmployeeId = @EmployeeId";
                
                using (var connection = new SqlConnection(_connectionString))
                {
                    using (var command = new SqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@EmployeeId", employeeId);
                        await connection.OpenAsync();
                        
                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            if (await reader.ReadAsync())
                            {
                                return new Employee
                                {
                                    EmployeeId = reader.GetInt32(0),
                                    FirstName = reader.GetString(1),
                                    LastName = reader.GetString(2),
                                    EmailAddress = reader.GetString(3),
                                    DateOfBirth = reader.GetDateTime(4),
                                    Age = reader.GetInt32(5),
                                    Salary = reader.GetDecimal(6),
                                    DepartmentId = reader.GetInt32(7),
                                    CreatedDate = reader.GetDateTime(8),
                                    ModifiedDate = reader.GetDateTime(9)
                                };
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error retrieving employee: {ex.Message}");
                throw;
            }
            return null;
        }

        public async Task<List<Employee>> GetEmployeesByDepartmentAsync(int departmentId)
        {
            var employees = new List<Employee>();
            try
            {
                var query = @"SELECT EmployeeId, FirstName, LastName, EmailAddress, DateOfBirth, Age, Salary, DepartmentId, CreatedDate, ModifiedDate 
                              FROM [dbo].[Employee] 
                              WHERE DepartmentId = @DepartmentId
                              ORDER BY FirstName, LastName";
                
                using (var connection = new SqlConnection(_connectionString))
                {
                    using (var command = new SqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@DepartmentId", departmentId);
                        await connection.OpenAsync();
                        
                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                employees.Add(new Employee
                                {
                                    EmployeeId = reader.GetInt32(0),
                                    FirstName = reader.GetString(1),
                                    LastName = reader.GetString(2),
                                    EmailAddress = reader.GetString(3),
                                    DateOfBirth = reader.GetDateTime(4),
                                    Age = reader.GetInt32(5),
                                    Salary = reader.GetDecimal(6),
                                    DepartmentId = reader.GetInt32(7),
                                    CreatedDate = reader.GetDateTime(8),
                                    ModifiedDate = reader.GetDateTime(9)
                                });
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error retrieving employees by department: {ex.Message}");
                throw;
            }
            return employees;
        }

        public async Task<Employee?> GetEmployeeByEmailAsync(string emailAddress)
        {
            try
            {
                var query = @"SELECT EmployeeId, FirstName, LastName, EmailAddress, DateOfBirth, Age, Salary, DepartmentId, CreatedDate, ModifiedDate 
                              FROM [dbo].[Employee] 
                              WHERE EmailAddress = @EmailAddress";
                
                using (var connection = new SqlConnection(_connectionString))
                {
                    using (var command = new SqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@EmailAddress", emailAddress);
                        await connection.OpenAsync();
                        
                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            if (await reader.ReadAsync())
                            {
                                return new Employee
                                {
                                    EmployeeId = reader.GetInt32(0),
                                    FirstName = reader.GetString(1),
                                    LastName = reader.GetString(2),
                                    EmailAddress = reader.GetString(3),
                                    DateOfBirth = reader.GetDateTime(4),
                                    Age = reader.GetInt32(5),
                                    Salary = reader.GetDecimal(6),
                                    DepartmentId = reader.GetInt32(7),
                                    CreatedDate = reader.GetDateTime(8),
                                    ModifiedDate = reader.GetDateTime(9)
                                };
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error retrieving employee by email: {ex.Message}");
                throw;
            }
            return null;
        }

        public async Task<int> AddEmployeeAsync(Employee employee)
        {
            try
            {
                var query = @"INSERT INTO [dbo].[Employee] (FirstName, LastName, EmailAddress, DateOfBirth, Age, Salary, DepartmentId, CreatedDate, ModifiedDate) 
                              VALUES (@FirstName, @LastName, @EmailAddress, @DateOfBirth, @Age, @Salary, @DepartmentId, @CreatedDate, @ModifiedDate);
                              SELECT CAST(SCOPE_IDENTITY() AS INT);";
                
                using (var connection = new SqlConnection(_connectionString))
                {
                    using (var command = new SqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@FirstName", employee.FirstName);
                        command.Parameters.AddWithValue("@LastName", employee.LastName);
                        command.Parameters.AddWithValue("@EmailAddress", employee.EmailAddress);
                        command.Parameters.AddWithValue("@DateOfBirth", employee.DateOfBirth);
                        command.Parameters.AddWithValue("@Age", employee.Age);
                        command.Parameters.AddWithValue("@Salary", employee.Salary);
                        command.Parameters.AddWithValue("@DepartmentId", employee.DepartmentId);
                        command.Parameters.AddWithValue("@CreatedDate", DateTime.UtcNow);
                        command.Parameters.AddWithValue("@ModifiedDate", DateTime.UtcNow);
                        
                        await connection.OpenAsync();
                        var result = await command.ExecuteScalarAsync();
                        _logger.LogInformation($"Employee added successfully with ID: {result}");
                        return result != null ? Convert.ToInt32(result) : 0;
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error adding employee: {ex.Message}");
                throw;
            }
        }

        public async Task<bool> UpdateEmployeeAsync(Employee employee)
        {
            try
            {
                var query = @"UPDATE [dbo].[Employee] 
                              SET FirstName = @FirstName, 
                                  LastName = @LastName, 
                                  EmailAddress = @EmailAddress, 
                                  DateOfBirth = @DateOfBirth, 
                                  Age = @Age, 
                                  Salary = @Salary, 
                                  DepartmentId = @DepartmentId, 
                                  ModifiedDate = @ModifiedDate
                              WHERE EmployeeId = @EmployeeId";
                
                using (var connection = new SqlConnection(_connectionString))
                {
                    using (var command = new SqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@EmployeeId", employee.EmployeeId);
                        command.Parameters.AddWithValue("@FirstName", employee.FirstName);
                        command.Parameters.AddWithValue("@LastName", employee.LastName);
                        command.Parameters.AddWithValue("@EmailAddress", employee.EmailAddress);
                        command.Parameters.AddWithValue("@DateOfBirth", employee.DateOfBirth);
                        command.Parameters.AddWithValue("@Age", employee.Age);
                        command.Parameters.AddWithValue("@Salary", employee.Salary);
                        command.Parameters.AddWithValue("@DepartmentId", employee.DepartmentId);
                        command.Parameters.AddWithValue("@ModifiedDate", DateTime.UtcNow);
                        
                        await connection.OpenAsync();
                        var result = await command.ExecuteNonQueryAsync();
                        _logger.LogInformation($"Employee updated successfully");
                        return result > 0;
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error updating employee: {ex.Message}");
                throw;
            }
        }

        public async Task<bool> DeleteEmployeeAsync(int employeeId)
        {
            try
            {
                var query = "DELETE FROM [dbo].[Employee] WHERE EmployeeId = @EmployeeId";
                
                using (var connection = new SqlConnection(_connectionString))
                {
                    using (var command = new SqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@EmployeeId", employeeId);
                        await connection.OpenAsync();
                        var result = await command.ExecuteNonQueryAsync();
                        _logger.LogInformation($"Employee deleted successfully");
                        return result > 0;
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error deleting employee: {ex.Message}");
                throw;
            }
        }
    }
}
