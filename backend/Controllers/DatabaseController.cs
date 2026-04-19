using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DatabaseController : ControllerBase
    {
        private readonly DatabaseService _databaseService;
        private readonly ILogger<DatabaseController> _logger;

        public DatabaseController(DatabaseService databaseService, ILogger<DatabaseController> logger)
        {
            _databaseService = databaseService;
            _logger = logger;
        }

        /// <summary>
        /// Tests DB connection.
        /// </summary>
        [HttpGet("test-connection")]
        public async Task<IActionResult> TestConnection()
        {
            try
            {
                var isConnected = await _databaseService.TestConnectionAsync();
                if (isConnected)
                {
                    return Ok(new { success = true, message = "Database connection successful" });
                }
                else
                {
                    return BadRequest(new { success = false, message = "Database connection failed" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error testing database connection");
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Gets database tables.
        /// </summary>
        [HttpGet("get-tables")]
        public async Task<IActionResult> GetTables()
        {
            try
            {
                var query = @"
                    SELECT TABLE_NAME 
                    FROM INFORMATION_SCHEMA.TABLES 
                    WHERE TABLE_TYPE = 'BASE TABLE'
                    ORDER BY TABLE_NAME";

                var tables = await _databaseService.ExecuteQueryAsync(query);
                var tableNames = new List<string>();

                foreach (System.Data.DataRow row in tables.Rows)
                {
                    tableNames.Add(row["TABLE_NAME"].ToString() ?? "");
                }

                return Ok(new { success = true, tables = tableNames });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving tables");
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Gets database info.
        /// </summary>
        [HttpGet("get-info")]
        public async Task<IActionResult> GetDatabaseInfo()
        {
            try
            {
                var query = @"
                    SELECT 
                        DB_NAME() as DatabaseName,
                        SERVERPROPERTY('ProductVersion') as SQLServerVersion,
                        GETDATE() as ServerTime";

                var info = await _databaseService.ExecuteQueryAsync(query);
                
                if (info.Rows.Count > 0)
                {
                    var row = info.Rows[0];
                    return Ok(new
                    {
                        success = true,
                        databaseName = row["DatabaseName"],
                        sqlServerVersion = row["SQLServerVersion"],
                        serverTime = row["ServerTime"]
                    });
                }
                
                return BadRequest(new { success = false, message = "Unable to retrieve database info" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving database info");
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }
    }
}
