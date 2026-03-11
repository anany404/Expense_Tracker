<?php
namespace App\Http\Controllers;
use App\Models\Income;
use Illuminate\Http\Request;

class IncomeController extends Controller
{
    public function index(Request $request)
    {
        $query = Income::where('user_id', $request->user()->id)->orderBy('date', 'desc');
        if ($request->filled('month')) {
            $query->whereYear('date', substr($request->month, 0, 4))
                  ->whereMonth('date', substr($request->month, 5, 2));
        }
        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'amount' => 'required|numeric|min:0.01',
            'date'   => 'required|date',
            'source' => 'required|string|max:100',
            'note'   => 'nullable|string|max:255',
        ]);
        $data['user_id'] = $request->user()->id;
        return response()->json(Income::create($data), 201);
    }

    public function update(Request $request, Income $income)
    {
        if ($income->user_id !== $request->user()->id) abort(403);
        $data = $request->validate([
            'amount' => 'required|numeric|min:0.01',
            'date'   => 'required|date',
            'source' => 'required|string|max:100',
            'note'   => 'nullable|string|max:255',
        ]);
        $income->update($data);
        return response()->json($income);
    }

    public function destroy(Request $request, Income $income)
    {
        if ($income->user_id !== $request->user()->id) abort(403);
        $income->delete();
        return response()->json(['message' => 'Income deleted.']);
    }
}