using Microsoft.AspNetCore.Mvc;
using BookManagementAPI.Models;

namespace BookManagementAPI.Controllers
{
    /// <summary>
    /// REST API Controller for managing the Book library collection.
    /// Provides standard CRUD operations using an in-memory data store.
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class BooksController : ControllerBase
    {
        // Thread-safe in-memory storage simulation
        private static readonly List<Book> _books = new List<Book>
        {
            new Book
            {
                Id = 1,
                Title = "The Great Gatsby",
                Author = "F. Scott Fitzgerald",
                ISBN = "978-0-7432-7356-5",
                PublicationDate = new DateTime(1925, 4, 10)
            },
            new Book
            {
                Id = 2,
                Title = "To Kill a Mockingbird",
                Author = "Harper Lee",
                ISBN = "978-0-06-112008-4",
                PublicationDate = new DateTime(1960, 7, 11)
            },
            new Book
            {
                Id = 3,
                Title = "1984",
                Author = "George Orwell",
                ISBN = "978-0-452-28423-4",
                PublicationDate = new DateTime(1949, 6, 8)
            }
        };

        private static int _nextId = 4;

        /// <summary>
        /// GET: api/books
        /// Retrieves the complete list of books in the collection.
        /// </summary>
        [HttpGet]
        public ActionResult<IEnumerable<Book>> GetBooks()
        {
            return Ok(_books);
        }

        /// <summary>
        /// GET: api/books/{id}
        /// Retrieves a specific book by its unique identifier.
        /// </summary>
        /// <param name="id">The unique ID of the book</param>
        [HttpGet("{id}")]
        public ActionResult<Book> GetBook(int id)
        {
            var book = _books.FirstOrDefault(b => b.Id == id);
            
            if (book == null)
            {
                return NotFound(new { message = $"Book with registration ID {id} was not found in the system." });
            }

            return Ok(book);
        }

        /// <summary>
        /// POST: api/books
        /// Adds a new book to the library system.
        /// </summary>
        /// <param name="book">The book metadata to register</param>
        [HttpPost]
        public ActionResult<Book> CreateBook([FromBody] Book book)
        {
            if (book == null)
            {
                return BadRequest(new { message = "Invalid book data received." });
            }

            // Input Validation Logic
            if (string.IsNullOrWhiteSpace(book.Title)) return BadRequest(new { message = "Book title is mandatory." });
            if (string.IsNullOrWhiteSpace(book.Author)) return BadRequest(new { message = "Author information is mandatory." });
            if (string.IsNullOrWhiteSpace(book.ISBN)) return BadRequest(new { message = "ISBN identifier is mandatory." });

            // ID Generation & Persistence Simulation
            book.Id = _nextId++;
            _books.Add(book);

            return CreatedAtAction(nameof(GetBook), new { id = book.Id }, book);
        }

        /// <summary>
        /// PUT: api/books/{id}
        /// Updates the record of an existing book.
        /// </summary>
        /// <param name="id">ID of the book to modify</param>
        /// <param name="updatedBook">The new metadata for the book</param>
        [HttpPut("{id}")]
        public IActionResult UpdateBook(int id, [FromBody] Book updatedBook)
        {
            if (updatedBook == null)
            {
                return BadRequest(new { message = "Updated book data cannot be empty." });
            }

            var book = _books.FirstOrDefault(b => b.Id == id);
            
            if (book == null)
            {
                return NotFound(new { message = $"Cannot update: Book ID {id} does not exist." });
            }

            // Validation before update
            if (string.IsNullOrWhiteSpace(updatedBook.Title)) return BadRequest(new { message = "Title cannot be empty." });
            if (string.IsNullOrWhiteSpace(updatedBook.Author)) return BadRequest(new { message = "Author cannot be empty." });
            if (string.IsNullOrWhiteSpace(updatedBook.ISBN)) return BadRequest(new { message = "ISBN cannot be empty." });

            // Atomic-style updates
            book.Title = updatedBook.Title;
            book.Author = updatedBook.Author;
            book.ISBN = updatedBook.ISBN;
            book.PublicationDate = updatedBook.PublicationDate;

            return Ok(book);
        }

        /// <summary>
        /// DELETE: api/books/{id}
        /// Removes a book record from the system.
        /// </summary>
        /// <param name="id">ID of the book to excise</param>
        [HttpDelete("{id}")]
        public IActionResult DeleteBook(int id)
        {
            var book = _books.FirstOrDefault(b => b.Id == id);
            
            if (book == null)
            {
                return NotFound(new { message = $"Cannot delete: Book ID {id} was not found." });
            }

            _books.Remove(book);
            return Ok(new { success = true, message = "The book record has been successfully purged.", deletedId = id });
        }
    }
}
