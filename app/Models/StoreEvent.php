<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StoreEvent extends Model
{
    protected $fillable = ['type', 'product_id', 'meta', 'ip'];

    protected function casts(): array
    {
        return ['meta' => 'array'];
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
