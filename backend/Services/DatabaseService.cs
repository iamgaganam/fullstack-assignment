using System.Data;
using Microsoft.Data.SqlClient;

namespace backend.Services
{
    public class DatabaseService
    {
        private readonly string _connectionString;
        private readonly ILogger<DatabaseService> _logger;

        public DatabaseService(IConfiguration configuration, ILogger<DatabaseService> logger)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection") 
                ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
            _logger = logger;
        }

        /// <summary>
        /// Tests the database connection
        /// </summary>
        public async Task<bool> TestConnectionAsync()
        {
            try
            {
                using (var connection = new SqlConnection(_connectionString))
                {
                    await connection.OpenAsync();
                    _logger.LogInformation("Database connection successful");
                    return true;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Database connection failed: {ex.Message}");
                return false;
            }
        }

        /// <summary>
        /// Executes a query and returns a DataTable
        /// </summary>
        public async Task<DataTable> ExecuteQueryAsync(string query)
        {
            var dataTable = new DataTable();
            try
            {
                using (var connection = new SqlConnection(_connectionString))
                {
                    using (var command = new SqlCommand(query, connection))
                    {
                        using (var adapter = new SqlDataAdapter(command))
                        {
                            adapter.Fill(dataTable);
                        }
                    }
                }
                _logger.LogInformation("Query executed successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Query execution failed: {ex.Message}");
                throw;
            }
            return dataTable;
        }

        /// <summary>
        /// Executes a non-query command (INSERT, UPDATE, DELETE)
        /// </summary>
        public async Task<int> ExecuteNonQueryAsync(string query)
        {
            try
            {
                using (var connection = new SqlConnection(_connectionString))
                {
                    await connection.OpenAsync();
                    using (var command = new SqlCommand(query, connection))
                    {
                        var result = await command.ExecuteNonQueryAsync();
                        _logger.LogInformation("Non-query executed successfully");
                        return result;
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Non-query execution failed: {ex.Message}");
                throw;
            }
        }

        /// <summary>
        /// Executes a scalar query (returns single value)
        /// </summary>
        public async Task<object?> ExecuteScalarAsync(string query)
        {
            try
            {
                using (var connection = new SqlConnection(_connectionString))
                {
                    await connection.OpenAsync();
                    using (var command = new SqlCommand(query, connection))
                    {
                        var result = await command.ExecuteScalarAsync();
                        _logger.LogInformation("Scalar query executed successfully");
                        return result;
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Scalar query execution failed: {ex.Message}");
                throw;
            }
        }
    }
}
