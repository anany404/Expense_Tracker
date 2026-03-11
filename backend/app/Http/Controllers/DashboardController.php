<?php
namespace App\Http\Controllers;
use App\Models\Expense;
use App\Models\Income;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function summary(Request $request)
    {
        $userId = $request->user()->id;
        $expenseQuery = Expense::where('user_id', $userId);
        $incomeQuery  = Income::where('user_id', $userId);
        if ($request->filled('month')) {
            $year  = substr($request->month, 0, 4);
            $month = substr($request->month, 5, 2);
            $expenseQuery->whereYear('date', $year)->whereMonth('date', $month);
            $incomeQuery->whereYear('date', $year)->whereMonth('date', $month);
        }
        $totalExpense = (float) $expenseQuery->sum('amount');
        $totalIncome  = (float) $incomeQuery->sum('amount');
        $byCategory = Expense::where('user_id', $userId)
            ->when($request->filled('month'), function ($q) use ($request) {
                $q->whereYear('date', substr($request->month, 0, 4))
                  ->whereMonth('date', substr($request->month, 5, 2));
            })
            ->select('category_id', DB::raw('SUM(amount) as total'))
            ->groupBy('category_id')->with('category')->get()
            ->map(fn($row) => [
                'category' => $row->category->name ?? 'Unknown',
                'icon'     => $row->category->icon ?? '📁',
                'color'    => $row->category->color ?? '#6c757d',
                'total'    => (float) $row->total,
            ]);
        return response()->json([
            'total_income'  => $totalIncome,
            'total_expense' => $totalExpense,
            'balance'       => $totalIncome - $totalExpense,
            'by_category'   => $byCategory,
        ]);
    }
}