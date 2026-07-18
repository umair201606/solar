<?php

namespace App\Http\Controllers;

use App\Models\ProductLead;
use Illuminate\Http\Request;

class LeadController extends Controller
{
    public function index(Request $request)
    {
        $leads = ProductLead::query()
            ->with('product:id,slug,name,category,brand,price')
            ->latest()
            ->paginate($request->integer('per_page', 50));

        return response()->json($leads);
    }

    public function destroy(ProductLead $lead)
    {
        $lead->delete();

        return response()->json(['message' => 'Lead deleted']);
    }
}
