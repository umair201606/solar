<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductLead extends Model
{
    protected $fillable = [
        'product_id', 'product_name', 'phone_used', 'channel', 'product_url',
        'ip', 'user_agent', 'referrer',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
