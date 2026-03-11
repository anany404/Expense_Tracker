<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Expense extends Model
{
    protected $fillable = ['user_id', 'category_id', 'amount', 'date', 'note'];
    protected $casts    = ['date' => 'date:Y-m-d', 'amount' => 'float'];
    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}