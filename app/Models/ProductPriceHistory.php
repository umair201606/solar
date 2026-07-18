<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductPriceHistory extends Model
{
    protected $fillable = ['product_id', 'price', 'recorded_on', 'source'];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'recorded_on' => 'date:Y-m-d',
        ];
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
