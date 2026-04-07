using System.Data;
using backend.Interfaces;
using backend.Models;
using Microsoft.Data.SqlClient;

namespace backend.Data.Repositories
{
    public class DepartmentRepository : IDepartmentRepository
    {
        private readonly string _connectionString;
        private readonly ILogger<DepartmentRepository> _logger;

        public DepartmentRepository(IConfiguration configuration, ILogger<DepartmentRepository> logger)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection") 
                ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
            _logger = logger;
        }

        public async Task<List<Department>> GetAllDepartmentsAsync()
        {
            var departments = new List<Department>();
            try
            {
                var query = "SELECT DepartmentId, DepartmentCode, DepartmentName, CreatedDate, ModifiedDate FROM [dbo].[Department] ORDER BY DepartmentName";
                
                using (var connection = new SqlConnection(_connectionString))
                {
                    using (var command = new SqlCommand(query, connection))
                    {
                        await connection.OpenAsync();
                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                departments.Add(new Department
                                {
                                    DepartmentId = reader.GetInt32(0),
                                    DepartmentCode = reader.GetString(1),
                                    DepartmentName = reader.GetString(2),
                                    CreatedDate = reader.GetDateTime(3),
                                    ModifiedDate = reader.GetDateTime(4)
                                });
                            }
                        }
                    }
                }
                _logger.LogInformation("Retrieved all departments successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error retrieving departments: {ex.Message}");
                throw;
            }
            return departments;
        }

        public async Task<Department?> GetDepartmentByIdAsync(int departmentId)
        {
            try
            {
                var query = "SELECT DepartmentId, DepartmentCode, DepartmentName, CreatedDate, ModifiedDate FROM [dbo].[Department] WHERE DepartmentId = @DepartmentId";
                
                using (var connection = new SqlConnection(_connectionString))
                {
                    using (var command = new SqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@DepartmentId", departmentId);
                        await connection.OpenAsync();
                        
                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            if (await reader.ReadAsync())
                            {
                                return new Department
                                {
                                    DepartmentId = reader.GetInt32(0),
                                    DepartmentCode = reader.GetString(1),
                                    DepartmentName = reader.GetString(2),
                                    CreatedDate = reader.GetDateTime(3),
                                    ModifiedDate = reader.GetDateTime(4)
                                };
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error retrieving department: {ex.Message}");
                throw;
            }
            return null;
        }

        public async Task<Department?> GetDepartmentByCodeAsync(string departmentCode)
        {
            try
            {
                var query = "SELECT DepartmentId, DepartmentCode, DepartmentName, CreatedDate, ModifiedDate FROM [dbo].[Department] WHERE DepartmentCode = @DepartmentCode";
                
                using (var connection = new SqlConnection(_connectionString))
                {
                    using (var command = new SqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@DepartmentCode", departmentCode);
                        await connection.OpenAsync();
                        
                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            if (await reader.ReadAsync())
                            {
                                return new Department
                                {
                                    DepartmentId = reader.GetInt32(0),
                                    DepartmentCode = reader.GetString(1),
                                    DepartmentName = reader.GetString(2),
                                    CreatedDate = reader.GetDateTime(3),
                                    ModifiedDate = reader.GetDateTime(4)
                                };
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error retrieving department by code: {ex.Message}");
                throw;
            }
            return null;
        }

        public async Task<int> AddDepartmentAsync(Department department)
        {
            try
            {
                var query = @"INSERT INTO [dbo].[Department] (DepartmentCode, DepartmentName, CreatedDate, ModifiedDate) 
                              VALUES (@DepartmentCode, @DepartmentName, @CreatedDate, @ModifiedDate);
                              SELECT CAST(SCOPE_IDENTITY() AS INT);";
                
                using (var connection = new SqlConnection(_connectionString))
                {
                    using (var command = new SqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@DepartmentCode", department.DepartmentCode);
                        command.Parameters.AddWithValue("@DepartmentName", department.DepartmentName);
                        command.Parameters.AddWithValue("@CreatedDate", DateTime.UtcNow);
                        command.Parameters.AddWithValue("@ModifiedDate", DateTime.UtcNow);
                        
                        await connection.OpenAsync();
                        var result = await command.ExecuteScalarAsync();
                        _logger.LogInformation($"Department added successfully with ID: {result}");
                        return result != null ? Convert.ToInt32(result) : 0;
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error adding department: {ex.Message}");
                throw;
            }
        }

        public async Task<bool> UpdateDepartmentAsync(Department department)
        {
            try
            {
                var query = @"UPDATE [dbo].[Department] 
                              SET DepartmentCode = @DepartmentCode, 
                                  DepartmentName = @DepartmentName, 
                                  ModifiedDate = @ModifiedDate
                              WHERE DepartmentId = @DepartmentId";
                
                using (var connection = new SqlConnection(_connectionString))
                {
                    using (var command = new SqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@DepartmentId", department.DepartmentId);
                        command.Parameters.AddWithValue("@DepartmentCode", department.DepartmentCode);
                        command.Parameters.AddWithValue("@DepartmentName", department.DepartmentName);
                        command.Parameters.AddWithValue("@ModifiedDate", DateTime.UtcNow);
                        
                        await connection.OpenAsync();
                        var result = await command.ExecuteNonQueryAsync();
                        _logger.LogInformation($"Department updated successfully");
                        return result > 0;
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error updating department: {ex.Message}");
                throw;
            }
        }

        public async Task<bool> DeleteDepartmentAsync(int departmentId)
        {
            try
            {
                var query = "DELETE FROM [dbo].[Department] WHERE DepartmentId = @DepartmentId";
                
                using (var connection = new SqlConnection(_connectionString))
                {
                    using (var command = new SqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@DepartmentId", departmentId);
                        await connection.OpenAsync();
                        var result = await command.ExecuteNonQueryAsync();
                        _logger.LogInformation($"Department deleted successfully");
                        return result > 0;
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error deleting department: {ex.Message}");
                throw;
            }
        }
    }
}
