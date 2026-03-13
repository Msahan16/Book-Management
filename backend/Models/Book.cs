namespace BookManagementAPI.Models
{
    /// <summary>
    /// Represents a book in the library
    /// </summary>
    public class Book
    {
        /// <summary>
        /// Unique identifier for the book
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Title of the book
        /// </summary>
        public string Title { get; set; } = string.Empty;

        /// <summary>
        /// Author of the book
        /// </summary>
        public string Author { get; set; } = string.Empty;

        /// <summary>
        /// International Standard Book Number
        /// </summary>
        public string ISBN { get; set; } = string.Empty;

        /// <summary>
        /// Publication date of the book
        /// </summary>
        public DateTime PublicationDate { get; set; }
    }
}
