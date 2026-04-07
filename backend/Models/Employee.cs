namespace backend.Models
{
    /// <summary>
    /// Represents an employee in the system.
    /// </summary>
    public class Employee
    {
        /// <summary>
        /// Gets or sets the unique identifier for the employee.
        /// </summary>
        public int EmployeeId { get; set; }

        /// <summary>
        /// Gets or sets the first name of the employee.
        /// </summary>
        public string FirstName { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the last name of the employee.
        /// </summary>
        public string LastName { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the email address of the employee.
        /// </summary>
        public string EmailAddress { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the date of birth of the employee.
        /// </summary>
        public DateTime DateOfBirth { get; set; }

        /// <summary>
        /// Gets or sets the age of the employee.
        /// </summary>
        public int Age { get; set; }

        /// <summary>
        /// Gets or sets the salary of the employee.
        /// </summary>
        public decimal Salary { get; set; }

        /// <summary>
        /// Gets or sets the department ID that the employee belongs to.
        /// </summary>
        public int DepartmentId { get; set; }

        /// <summary>
        /// Gets or sets the creation date of the employee record.
        /// </summary>
        public DateTime CreatedDate { get; set; }

        /// <summary>
        /// Gets or sets the last modification date of the employee record.
        /// </summary>
        public DateTime ModifiedDate { get; set; }
    }
}
