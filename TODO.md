# Task Management System - TODO List

## Backend Setup (Django + SQLite)
- [x] Create Python virtual environment
- [x] Install Django and required packages (djangorestframework, djangorestframework-simplejwt, django-filter, django-cors-headers)
- [x] Create Django project (backend)
- [x] Configure settings.py for SQLite database, JWT authentication, CORS
- [x] Create Django apps: users, tasks
- [x] Define models: CustomUser, Task, Category, Tag
- [x] Create serializers for User, Task, Category, Tag
- [x] Create views for authentication (register, login), task CRUD, categories/tags
- [x] Set up URL routing for API endpoints
- [x] Run database migrations
- [x] Create superuser for admin access

## Frontend Setup (React + Bootstrap)
- [x] Create React app
- [x] Install required packages (react-router-dom, axios, bootstrap, react-bootstrap, react-router-bootstrap)
- [x] Set up routing for pages: Login, Register, Dashboard, Tasks, Admin
- [x] Create components: LoginForm, RegisterForm, TaskList, TaskForm, Dashboard, Navbar
- [x] Implement authentication context and protected routes
- [x] Integrate API calls with axios for CRUD operations
- [x] Style components with Bootstrap for responsive design
- [x] Add features: task filtering, search, notifications display

## Integration and Testing
- [ ] Test backend API endpoints with Postman/Insomnia
- [ ] Test frontend-backend integration
- [ ] Implement error handling and validation
- [ ] Add loading states and user feedback
- [ ] Final testing and bug fixes

## Deployment Preparation
- [ ] Create README.md with setup instructions
- [ ] Prepare requirements.txt and package.json
- [ ] Document API endpoints
- [ ] Add environment variables configuration
