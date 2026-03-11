<?php
namespace App\Http\Controllers;
use App\Models\Expense;
use Illuminate\Http\Request;

class ExpenseController extends Controller
{
    public function index(Request $request)
    {
        $query = Expense::with('category')
            ->where('user_id', $request->user()->id)
            ->orderBy('date', 'desc');
        if ($request->filled('month')) {
            $query->whereYear('date', substr($request->month, 0, 4))
                  ->whereMonth('date', substr($request->month, 5, 2));
        }
        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }
        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'amount'      => 'required|numeric|min:0.01',
            'category_id' => 'required|exists:categories,id',
            'date'        => 'required|date',
            'note'        => 'nullable|string|max:255',
        ]);
        $data['user_id'] = $request->user()->id;
        $expense = Expense::create($data);
        return response()->json($expense->load('category'), 201);
    }

    public function show(Request $request, Expense $expense)
    {
        if ($expense->user_id !== $request->user()->id) abort(403);
        return response()->json($expense->load('category'));
    }

    public function update(Request $request, Expense $expense)
    {
        if ($expense->user_id !== $request->user()->id) abort(403);
        $data = $request->validate([
            'amount'      => 'required|numeric|min:0.01',
            'category_id' => 'required|exists:categories,id',
            'date'        => 'required|date',
            'note'        => 'nullable|string|max:255',
        ]);
        $expense->update($data);
        return response()->json($expense->load('category'));
    }

    public function destroy(Request $request, Expense $expense)
    {
        if ($expense->user_id !== $request->user()->id) abort(403);
        $expense->delete();
        return response()->json(['message' => 'Expense deleted.']);
    }
}