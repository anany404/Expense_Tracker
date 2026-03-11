<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\IncomeController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me',      [AuthController::class, 'me']);

    Route::get('/dashboard', [DashboardController::class, 'summary']);

    Route::apiResource('expenses', ExpenseController::class);

    Route::get   ('incomes',         [IncomeController::class, 'index']);
    Route::post  ('incomes',         [IncomeController::class, 'store']);
    Route::put   ('incomes/{income}',[IncomeController::class, 'update']);
    Route::delete('incomes/{income}',[IncomeController::class, 'destroy']);

    Route::get   ('categories',            [CategoryController::class, 'index']);
    Route::post  ('categories',            [CategoryController::class, 'store']);
    Route::delete('categories/{category}', [CategoryController::class, 'destroy']);
});