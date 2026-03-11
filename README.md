# Smart Expense Tracker

Full-stack expense tracking app built with React + Laravel.

## Tech Stack
- **Frontend:** React, Bootstrap 5, Axios
- **Backend:** PHP 8+, Laravel 10, MySQL, REST API
- **Auth:** Laravel Sanctum (token-based)

## Project Structure
```
expense-tracker/
├── frontend/        ← React app
└── backend/         ← Laravel API
```

## Setup Instructions

### 1. Backend (Laravel)
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

Edit `.env` — set your DB credentials:
```
DB_DATABASE=expense_tracker
DB_USERNAME=root
DB_PASSWORD=your_password
```

```bash
php artisan migrate --seed
php artisan serve   # runs on http://localhost:8000
```

### 2. Frontend (React)
```bash
cd frontend
npm install
npm start           # runs on http://localhost:3000
```

## Default Seeded Categories
Food, Travel, Bills, Shopping, Health, Education

## API Base URL
`http://localhost:8000/api`
