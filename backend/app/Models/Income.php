<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Income extends Model
{
    protected $fillable = ['user_id', 'amount', 'date', 'source', 'note'];
    protected $casts    = ['date' => 'date:Y-m-d', 'amount' => 'float'];
}