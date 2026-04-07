-- =====================================================
-- COMPANY MANAGEMENT SYSTEM DATABASE & SAMPLE DATA
-- Database: CompanyDB
-- =====================================================

-- ===== CREATE DEPARTMENT TABLE =====
CREATE TABLE [dbo].[Department]
(
    [DepartmentId] INT IDENTITY(1,1) PRIMARY KEY,
    [DepartmentCode] NVARCHAR(50) NOT NULL UNIQUE,
    [DepartmentName] NVARCHAR(100) NOT NULL,
    [CreatedDate] DATETIME DEFAULT GETUTCDATE(),
    [ModifiedDate] DATETIME DEFAULT GETUTCDATE()
);

-- ===== CREATE EMPLOYEE TABLE =====
CREATE TABLE [dbo].[Employee]
(
    [EmployeeId] INT IDENTITY(1,1) PRIMARY KEY,
    [FirstName] NVARCHAR(50) NOT NULL,
    [LastName] NVARCHAR(50) NOT NULL,
    [EmailAddress] NVARCHAR(100) NOT NULL UNIQUE,
    [DateOfBirth] DATE NOT NULL,
    [Age] INT,
    [Salary] DECIMAL(10, 2) NOT NULL,
    [DepartmentId] INT NOT NULL,
    [CreatedDate] DATETIME DEFAULT GETUTCDATE(),
    [ModifiedDate] DATETIME DEFAULT GETUTCDATE(),
    CONSTRAINT [FK_Employee_Department] FOREIGN KEY ([DepartmentId]) 
        REFERENCES [dbo].[Department]([DepartmentId]) ON DELETE CASCADE
);

-- ===== CREATE INDEXES FOR GOOD PERFORMANCE =====
CREATE INDEX [IX_Employee_DepartmentId] ON [dbo].[Employee]([DepartmentId]);
CREATE INDEX [IX_Employee_EmailAddress] ON [dbo].[Employee]([EmailAddress]);

GO

-- =====================================================
-- SAMPLE DATA - DEPARTMENTS
-- =====================================================
INSERT INTO [dbo].[Department] (DepartmentCode, DepartmentName, CreatedDate, ModifiedDate)
VALUES 
    ('IT', 'Information Technology', GETUTCDATE(), GETUTCDATE()),
    ('HR', 'Human Resources', GETUTCDATE(), GETUTCDATE()),
    ('FINANCE', 'Finance & Accounting', GETUTCDATE(), GETUTCDATE()),
    ('SALES', 'Sales & Marketing', GETUTCDATE(), GETUTCDATE()),
    ('OPERATIONS', 'Operations', GETUTCDATE(), GETUTCDATE());

GO

-- =====================================================
-- SAMPLE DATA - EMPLOYEE NAMES
-- =====================================================
INSERT INTO [dbo].[Employee] (FirstName, LastName, EmailAddress, DateOfBirth, Age, Salary, DepartmentId, CreatedDate, ModifiedDate)
VALUES
    -- IT Department
    ('Roshan', 'Perera', 'roshan.perera@company.com', '1990-05-15', 34, 85000.00, 1, GETUTCDATE(), GETUTCDATE()),
    
    -- HR Department
    ('Priya', 'Wijesinghe', 'priya.wijesinghe@company.com', '1992-08-22', 32, 78000.00, 2, GETUTCDATE(), GETUTCDATE()),
    
    -- Finance Department
    ('Arun', 'Chandrasekara', 'arun.chandrasekara@company.com', '1988-03-10', 36, 92000.00, 3, GETUTCDATE(), GETUTCDATE()),
    
    -- Sales Department
    ('Ishani', 'De Silva', 'ishani.desilva@company.com', '1995-11-30', 30, 72000.00, 4, GETUTCDATE(), GETUTCDATE()),
    
    -- Operations Department
    ('Keshani', 'Bandara', 'keshani.bandara@company.com', '1993-07-18', 32, 75000.00, 5, GETUTCDATE(), GETUTCDATE());

GO

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================
-- to verify data insertion:
-- SELECT * FROM [dbo].[Department];
-- SELECT * FROM [dbo].[Employee];
-- SELECT e.FirstName, e.LastName, e.EmailAddress, d.DepartmentName, e.Salary 
-- FROM [dbo].[Employee] e 
-- INNER JOIN [dbo].[Department] d ON e.DepartmentId = d.DepartmentId;
