import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';
import { Book } from '../models/book.model';

/**
 * Service responsible for all book-related API communication.
 * Handles CRUD operations and error management.
 */
@Injectable({
    providedIn: 'root'
})
export class BookService {
    /** The base URL for the backend API */
    private readonly API_URL = 'http://localhost:5000/api/books';

    constructor(private http: HttpClient) { }

    /**
     * Retrieves all books from the library.
     * @returns An Observable of the Book array.
     */
    getBooks(): Observable<Book[]> {
        return this.http.get<Book[]>(this.API_URL).pipe(
            retry(1),
            tap(() => this.log('Fetched all books')),
            catchError(this.handleError)
        );
    }

    /**
     * Retrieves a single book by its unique ID.
     * @param id The ID of the book to fetch.
     */
    getBook(id: number): Observable<Book> {
        return this.http.get<Book>(`${this.API_URL}/${id}`).pipe(
            retry(1),
            tap(() => this.log(`Fetched book ID: ${id}`)),
            catchError(this.handleError)
        );
    }

    /**
     * Adds a new book to the library collection.
     * @param book The book object to create.
     */
    createBook(book: Book): Observable<Book> {
        return this.http.post<Book>(this.API_URL, book).pipe(
            tap((newBook) => this.log(`Created book: ${newBook.title}`)),
            catchError(this.handleError)
        );
    }

    /**
     * Updates an existing book in the collection.
     * @param id The ID of the book to update.
     * @param book The updated book data.
     */
    updateBook(id: number, book: Book): Observable<Book> {
        return this.http.put<Book>(`${this.API_URL}/${id}`, book).pipe(
            tap(() => this.log(`Updated book ID: ${id}`)),
            catchError(this.handleError)
        );
    }

    /**
     * Permanently removes a book from the library.
     * @param id The ID of the book to delete.
     */
    deleteBook(id: number): Observable<void> {
        return this.http.delete<void>(`${this.API_URL}/${id}`).pipe(
            tap(() => this.log(`Deleted book ID: ${id}`)),
            catchError(this.handleError)
        );
    }

    /**
     * Standardized error handling for all HTTP requests.
     */
    private handleError(error: HttpErrorResponse) {
        let message = 'An unexpected error occurred. Please try again later.';

        if (error.error instanceof ErrorEvent) {
            // Client-side/Network issue
            message = `Client Error: ${error.error.message}`;
        } else {
            // Backend returned an unsuccessful response code
            message = error.error?.message || `Server Error (Code ${error.status}): ${error.message}`;
        }

        console.error(`[BookService] ${message}`);
        return throwError(() => new Error(message));
    }

    /**
     * Internal logger for service activities.
     */
    private log(message: string): void {
        console.log(`%c[BookService] ${message}`, 'color: #10b981; font-weight: 500;');
    }
}
