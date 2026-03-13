import { Component, OnInit } from '@angular/core';
import { Book } from '../../models/book.model';
import { BookService } from '../../services/book.service';
import Swal from 'sweetalert2';


@Component({
    selector: 'app-book-list',
    templateUrl: './book-list.component.html',
    styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit {
    books: Book[] = [];
    filteredBooks: Book[] = [];
    loading = false;
    error: string | null = null;
    searchTerm = '';

    // Form state
    showForm = false;
    editingBook: Book | null = null;

    constructor(private bookService: BookService) { }

    ngOnInit(): void {
        this.loadBooks();
    }

    /**
     * Load all books from the API
     */
    loadBooks(): void {
        this.loading = true;
        this.error = null;

        this.bookService.getBooks().subscribe({
            next: (data) => {
                this.books = data;
                this.filteredBooks = data;
                this.loading = false;
            },
            error: (err) => {
                this.error = err.message || 'Failed to load books';
                this.loading = false;
                Swal.fire({
                    title: 'Error!',
                    text: this.error || 'Unknown error occurred while loading books',
                    icon: 'error',
                    background: '#ffffff',
                    color: '#1e293b',
                    confirmButtonColor: '#4f46e5'
                });
            }
        });
    }

    /**
     * Filter books based on search term
     */
    filterBooks(): void {
        const term = this.searchTerm.toLowerCase().trim();

        if (!term) {
            this.filteredBooks = this.books;
            return;
        }

        this.filteredBooks = this.books.filter(book =>
            book.title.toLowerCase().includes(term) ||
            book.author.toLowerCase().includes(term) ||
            book.isbn.toLowerCase().includes(term)
        );
    }

    /**
     * Show form to add a new book
     */
    showAddForm(): void {
        this.editingBook = null;
        this.showForm = true;
    }

    /**
     * Show form to edit an existing book
     */
    editBook(book: Book): void {
        this.editingBook = { ...book };
        this.showForm = true;
    }

    /**
     * Delete a book with confirmation
     */
    deleteBook(book: Book): void {
        Swal.fire({
            title: 'Are you sure?',
            text: `You are about to delete "${book.title}". This action cannot be undone!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Yes, delete it!',
            background: '#ffffff',
            color: '#1e293b',
            iconColor: '#f59e0b',
            buttonsStyling: true,
            customClass: {
                confirmButton: 'swal2-confirm-custom',
                cancelButton: 'swal2-cancel-custom'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                this.bookService.deleteBook(book.id).subscribe({
                    next: () => {
                        this.loadBooks();
                        this.showSuccessMessage(`"${book.title}" has been deleted successfully`);
                    },
                    error: (err) => {
                        this.error = err.message || 'Failed to delete book';
                        Swal.fire({
                            title: 'Error!',
                            text: this.error || 'Unknown error occurred',
                            icon: 'error',
                            background: '#ffffff',
                            color: '#1e293b',
                            confirmButtonColor: '#4f46e5'
                        });
                    }
                });
            }
        });
    }

    /**
     * Handle form submission
     */
    onFormSubmit(book: Book): void {
        this.showForm = false;
        this.loadBooks();

        const action = this.editingBook ? 'updated' : 'added';
        this.showSuccessMessage(`Book "${book.title}" has been ${action} successfully`);
    }

    /**
     * Handle form cancellation
     */
    onFormCancel(): void {
        this.showForm = false;
        this.editingBook = null;
    }

    /**
     * Show success message (simple implementation)
     */
    private showSuccessMessage(message: string): void {
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            background: '#ffffff',
            color: '#1e293b',
            iconColor: '#10b981',
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
            }
        });

        Toast.fire({
            icon: 'success',
            title: message
        });
    }

    /**
     * Format date for display
     */
    formatDate(date: Date | string): string {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
}
