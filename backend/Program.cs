var builder = WebApplication.CreateBuilder(args);

// Register services.

builder.Services.AddControllers();
builder.Services.AddOpenApi();

// Configure CORS.
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:3000")
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Database service.
builder.Services.AddScoped<backend.Services.DatabaseService>();

// Repository services.
builder.Services.AddScoped<backend.Interfaces.IDepartmentRepository, backend.Data.Repositories.DepartmentRepository>();
builder.Services.AddScoped<backend.Interfaces.IEmployeeRepository, backend.Data.Repositories.EmployeeRepository>();

// Business services.
builder.Services.AddScoped<backend.Interfaces.IDepartmentService, backend.Services.DepartmentService>();
builder.Services.AddScoped<backend.Interfaces.IEmployeeService, backend.Services.EmployeeService>();

var app = builder.Build();

// Configure pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("AllowFrontend");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
