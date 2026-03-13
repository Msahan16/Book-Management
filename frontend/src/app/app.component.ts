import { Component, OnInit } from '@angular/core';

/**
 * Root Component of the Book Management System.
 * Coordinates the main layout and global application state.
 */
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    /** Main application title displayed in the header */
    title = 'Book Management System';

    constructor() { }

    ngOnInit(): void {
        console.log('%c📚 Book Management System Initialized', 'color: #4f46e5; font-size: 1.2rem; font-weight: bold;');
        console.log('Built with Angular 17 & ASP.NET Core 10');
    }
}
