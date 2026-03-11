# Smart Expense Tracker — Full Developer Guide

## What You're Building
A full-stack money tracking app. Users register/login, add expenses and income, and see their financial summary on a dashboard.

---

## Complete File Structure

```
expense-tracker/
│
├── backend/                          ← Laravel REST API
│   ├── .env.example                  ← Copy to .env, fill in DB creds
│   ├── composer.json
│   ├── routes/
│   │   └── api.php                   ← All API routes
│   ├── app/
│   │   ├── Models/
│   │   │   ├── User.php
│   │   │   ├── Expense.php
│   │   │   ├── Income.php
│   │   │   └── Category.php
│   │   └── Http/Controllers/
│   │       ├── AuthController.php    ← Register, login, logout
│   │       ├── ExpenseController.php ← CRUD + filter
│   │       ├── IncomeController.php  ← CRUD
│   │       ├── CategoryController.php
│   │       └── DashboardController.php
│   ├── database/
│   │   ├── migrations/               ← 5 migration files
│   │   └── seeders/
│   │       └── CategorySeeder.php    ← Seeds 6 predefined categories
│   └── config/
│       └── cors.php
│
└── frontend/                         ← React app
    ├── package.json
    ├── public/index.html
    └── src/
        ├── index.js
        ├── App.js                    ← Router + route guards
        ├── App.css                   ← All custom styles
        ├── utils/
        │   └── api.js                ← Axios instance + token interceptor
        ├── context/
        │   └── AuthContext.js        ← Global auth state
        ├── components/
        │   └── Layout.js             ← Sidebar + nav
        └── pages/
            ├── Login.js
            ├── Register.js
            ├── Dashboard.js          ← Summary cards + by-category
            ├── Expenses.js           ← CRUD table + filters
            ├── Incomes.js            ← CRUD table
            └── Categories.js         ← Predefined + custom categories
```

---

## Step-by-Step Setup

### Prerequisites
- PHP 8.1+
- Composer
- Node.js 18+
- MySQL 8+

### 1. Create the MySQL database
```sql
CREATE DATABASE expense_tracker;
```

### 2. Set up Laravel backend
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

Edit `.env`:
```
DB_DATABASE=expense_tracker
DB_USERNAME=root
DB_PASSWORD=your_password
```

Run migrations and seed default categories:
```bash
php artisan migrate --seed
php artisan serve
# API now running at http://localhost:8000
```

### 3. Set up React frontend
```bash
cd frontend
npm install
npm start
# App running at http://localhost:3000
```

---

## API Reference

| Method | Endpoint | Auth? | Description |
|--------|----------|-------|-------------|
| POST | /api/register | ❌ | Create account |
| POST | /api/login | ❌ | Login, returns token |
| POST | /api/logout | ✅ | Revoke token |
| GET | /api/me | ✅ | Get current user |
| GET | /api/dashboard | ✅ | Summary totals |
| GET | /api/expenses | ✅ | List expenses (filter: ?month=&category_id=) |
| POST | /api/expenses | ✅ | Create expense |
| PUT | /api/expenses/{id} | ✅ | Update expense |
| DELETE | /api/expenses/{id} | ✅ | Delete expense |
| GET | /api/incomes | ✅ | List income (filter: ?month=) |
| POST | /api/incomes | ✅ | Create income |
| PUT | /api/incomes/{id} | ✅ | Update income |
| DELETE | /api/incomes/{id} | ✅ | Delete income |
| GET | /api/categories | ✅ | List global + user categories |
| POST | /api/categories | ✅ | Create custom category |
| DELETE | /api/categories/{id} | ✅ | Delete custom category |

**Authentication:** All protected routes require `Authorization: Bearer {token}` header.
The token is stored in `localStorage` and auto-attached by the Axios interceptor in `api.js`.

---

## How Authentication Works

1. User registers → Laravel hashes password with `bcrypt` → returns Sanctum token
2. Token stored in `localStorage` on the frontend
3. Every API request has `Authorization: Bearer <token>` attached automatically
4. On 401 response → token cleared, user redirected to `/login`
5. Logout → token deleted from DB and `localStorage`

**Passwords are hashed** via the `'password' => 'hashed'` cast in the `User` model — Laravel auto-bcrypts on assignment.

---

## How Data Isolation Works

Every protected controller method filters by `user_id`:
```php
// Example from ExpenseController
Expense::where('user_id', $request->user()->id)->get();
```
Users can only see, edit, or delete their own records. Any attempt to access another user's record returns `403 Forbidden`.

---

## Features Checklist

- ✅ Register with name, email, password (hashed)
- ✅ Login / logout with Sanctum tokens
- ✅ Each user sees only their own data
- ✅ Add / edit / delete expenses (amount, category, date, note)
- ✅ Add / edit / delete income (amount, source, date, note)
- ✅ Predefined categories (Food, Travel, Bills, Shopping, Health, Education)
- ✅ Create / delete custom categories with icon + color picker
- ✅ Dashboard: Total Income, Total Expense, Remaining Balance
- ✅ Expense breakdown by category on dashboard
- ✅ Filter expenses by month and/or category
- ✅ Filter income by month
- ✅ Full CRUD on expenses and income with edit modals

---

## Common Errors & Fixes

| Error | Fix |
|-------|-----|
| CORS error in browser | Check `config/cors.php` — `allowed_origins` must match your React URL |
| 401 on every request | Make sure `php artisan serve` is running and token is valid |
| 500 on migration | Confirm DB credentials in `.env` are correct |
| `APP_KEY` missing | Run `php artisan key:generate` |
| Sanctum not working | Run `php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"` |
