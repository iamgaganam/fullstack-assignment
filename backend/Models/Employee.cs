namespace backend.Models
{
    /// <summary>
    /// Represents an employee in the system.
    /// </summary>
    public class Employee
    {
        /// <summary>
        /// Employee ID.
        /// </summary>
        public int EmployeeId { get; set; }

        /// <summary>
        /// First name.
        /// </summary>
        public string FirstName { get; set; } = string.Empty;

        /// <summary>
        /// Last name.
        /// </summary>
        public string LastName { get; set; } = string.Empty;

        /// <summary>
        /// Email.
        /// </summary>
        public string EmailAddress { get; set; } = string.Empty;

        /// <summary>
        /// Date of birth.
        /// </summary>
        public DateTime DateOfBirth { get; set; }

        /// <summary>
        /// Age.
        /// </summary>
        public int Age { get; set; }

        /// <summary>
        /// Salary.
        /// </summary>
        public decimal Salary { get; set; }

        /// <summary>
        /// Department ID.
        /// </summary>
        public int DepartmentId { get; set; }

        /// <summary>
        /// Created timestamp.
        /// </summary>
        public DateTime CreatedDate { get; set; }

        /// <summary>
        /// Updated timestamp.
        /// </summary>
        public DateTime ModifiedDate { get; set; }
    }
}
