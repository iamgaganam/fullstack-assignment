namespace backend.Models
{
    /// <summary>
    /// Represents a department in the organization.
    /// </summary>
    public class Department
    {
        /// <summary>
        /// Department ID.
        /// </summary>
        public int DepartmentId { get; set; }

        /// <summary>
        /// Department code.
        /// </summary>
        public string DepartmentCode { get; set; } = string.Empty;

        /// <summary>
        /// Department name.
        /// </summary>
        public string DepartmentName { get; set; } = string.Empty;

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
