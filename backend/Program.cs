var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddOpenApi();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:3000")
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Add Database Service
builder.Services.AddScoped<backend.Services.DatabaseService>();

// Add Repository Services
builder.Services.AddScoped<backend.Interfaces.IDepartmentRepository, backend.Data.Repositories.DepartmentRepository>();
builder.Services.AddScoped<backend.Interfaces.IEmployeeRepository, backend.Data.Repositories.EmployeeRepository>();

// Add Business Logic Services
builder.Services.AddScoped<backend.Services.DepartmentService>();
builder.Services.AddScoped<backend.Services.EmployeeService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("AllowFrontend");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
