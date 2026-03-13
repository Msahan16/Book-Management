import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Book } from '../../models/book.model';
import { BookService } from '../../services/book.service';
import Swal from 'sweetalert2';


@Component({
    selector: 'app-book-form',
    templateUrl: './book-form.component.html',
    styleUrls: ['./book-form.component.css']
})
export class BookFormComponent implements OnInit {
    @Input() book: Book | null = null;
    @Output() formSubmit = new EventEmitter<Book>();
    @Output() formCancel = new EventEmitter<void>();

    bookForm!: FormGroup;
    loading = false;
    error: string | null = null;
    isEditMode = false;

    constructor(
        private fb: FormBuilder,
        private bookService: BookService
    ) { }

    ngOnInit(): void {
        this.isEditMode = !!this.book;
        this.initializeForm();
    }

    /**
     * Initialize the form with validators
     */
    private initializeForm(): void {
        this.bookForm = this.fb.group({
            title: [this.book?.title || '', [Validators.required, Validators.minLength(1)]],
            author: [this.book?.author || '', [Validators.required, Validators.minLength(1)]],
            isbn: [this.book?.isbn || '', [Validators.required, Validators.pattern(/^[\d-]+$/)]],
            publicationDate: [
                this.book?.publicationDate ? this.formatDateForInput(this.book.publicationDate) : '',
                [Validators.required]
            ]
        });
    }

    /**
     * Format date for input field (YYYY-MM-DD)
     */
    private formatDateForInput(date: Date | string): string {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    /**
     * Check if a field has an error
     */
    hasError(fieldName: string): boolean {
        const field = this.bookForm.get(fieldName);
        return !!(field && field.invalid && (field.dirty || field.touched));
    }

    /**
     * Get error message for a field
     */
    getErrorMessage(fieldName: string): string {
        const field = this.bookForm.get(fieldName);

        if (!field) return '';

        if (field.hasError('required')) {
            return `${this.getFieldLabel(fieldName)} is required`;
        }

        if (field.hasError('minlength')) {
            return `${this.getFieldLabel(fieldName)} is too short`;
        }

        if (field.hasError('pattern')) {
            return 'ISBN should contain only numbers and hyphens';
        }

        return '';
    }

    /**
     * Get user-friendly field label
     */
    private getFieldLabel(fieldName: string): string {
        const labels: { [key: string]: string } = {
            title: 'Title',
            author: 'Author',
            isbn: 'ISBN',
            publicationDate: 'Publication Date'
        };
        return labels[fieldName] || fieldName;
    }

    /**
     * Handle form submission
     */
    onSubmit(): void {
        if (this.bookForm.invalid) {
            // Mark all fields as touched to show errors
            Object.keys(this.bookForm.controls).forEach(key => {
                this.bookForm.get(key)?.markAsTouched();
            });
            return;
        }

        this.loading = true;
        this.error = null;

        const bookData: Book = {
            id: this.book?.id || 0,
            ...this.bookForm.value
        };

        const operation = this.isEditMode
            ? this.bookService.updateBook(bookData.id, bookData)
            : this.bookService.createBook(bookData);

        operation.subscribe({
            next: (result) => {
                this.loading = false;
                this.formSubmit.emit(result);
            },
            error: (err) => {
                this.loading = false;
                this.error = err.message || 'Failed to save book';
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

    /**
     * Handle form cancellation
     */
    onCancel(): void {
        this.formCancel.emit();
    }
}
