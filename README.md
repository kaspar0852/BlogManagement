# BlogManagement

A modern blog management application built with Angular 17, with features like user authentication, blog post management, real-time notifications, and commenting.

## Features

- User authentication and profile management
- Blog post creation, editing, and viewing
- Commenting system for blog posts
- Real-time notifications via SignalR
- Responsive UI with Tailwind CSS
- State management with NgRx

## Environment Setup

The application uses environment variables for configuration. Create a `.env` file in the root directory with the following variables:

```
API_BASE_URL=http://localhost:5239/api
API_HUB_URL=http://localhost:5239/blogHub
```

You can modify these values to point to your own backend server.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
