<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $fillable = ['user_id', 'name', 'color', 'icon'];
    public function expenses()
    {
        return $this->hasMany(Expense::class);
    }
}