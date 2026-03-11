<?php
namespace App\Http\Controllers;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        $categories = Category::where(function ($q) use ($request) {
            $q->whereNull('user_id')->orWhere('user_id', $request->user()->id);
        })->orderBy('name')->get();
        return response()->json($categories);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'  => 'required|string|max:100',
            'color' => 'nullable|string|max:7',
            'icon'  => 'nullable|string|max:10',
        ]);
        $data['user_id'] = $request->user()->id;
        $data['color']   = $data['color'] ?? '#6c757d';
        $data['icon']    = $data['icon']  ?? '📁';
        return response()->json(Category::create($data), 201);
    }

    public function destroy(Request $request, Category $category)
    {
        if ($category->user_id !== $request->user()->id) {
            abort(403, 'Cannot delete a predefined category.');
        }
        $category->delete();
        return response()->json(['message' => 'Category deleted.']);
    }
}