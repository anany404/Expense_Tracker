<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Food',      'color' => '#f59e0b', 'icon' => 'Food'],
            ['name' => 'Travel',    'color' => '#3b82f6', 'icon' => 'Travel'],
            ['name' => 'Bills',     'color' => '#ef4444', 'icon' => 'Bills'],
            ['name' => 'Shopping',  'color' => '#8b5cf6', 'icon' => 'Shopping'],
            ['name' => 'Health',    'color' => '#10b981', 'icon' => 'Health'],
            ['name' => 'Education', 'color' => '#06b6d4', 'icon' => 'Education'],
        ];

        foreach ($categories as $cat) {
            DB::table('categories')->insertOrIgnore([
                'user_id'    => null,
                'name'       => $cat['name'],
                'color'      => $cat['color'],
                'icon'       => $cat['icon'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}