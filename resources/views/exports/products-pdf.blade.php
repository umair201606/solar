<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        * { font-family: DejaVu Sans, sans-serif; }
        body { font-size: 9px; color: #1a1a1a; margin: 24px; }
        .header { border-bottom: 3px solid #d4ff00; padding-bottom: 8px; margin-bottom: 12px; }
        .header h1 { margin: 0; font-size: 16px; color: #041a12; }
        .header p { margin: 2px 0 0; color: #555; }
        table { width: 100%; border-collapse: collapse; }
        th { background: #041a12; color: #d4ff00; text-align: left; padding: 5px 6px; font-size: 8px; text-transform: uppercase; }
        td { padding: 4px 6px; border-bottom: 1px solid #e5e5e5; }
        tr:nth-child(even) td { background: #f7f8f6; }
        .price { text-align: right; white-space: nowrap; font-weight: bold; }
        .up { color: #c0392b; } .down { color: #27ae60; }
        .muted { color: #888; }
        .footer { margin-top: 10px; font-size: 8px; color: #888; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Solarkon — Product Price List</h1>
        <p>
            Generated {{ $generatedAt->format('d M Y, h:i A') }} &nbsp;|&nbsp; {{ $products->count() }} products
            @if(!empty($filters))
                &nbsp;|&nbsp; Filters: {{ collect($filters)->map(fn ($v, $k) => "$k: $v")->implode(', ') }}
            @endif
        </p>
    </div>

    <table>
        <thead>
            <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Brand</th>
                <th>Capacity</th>
                <th>Phase</th>
                <th>Warranty</th>
                <th style="text-align:right">Price</th>
                <th>Trend</th>
            </tr>
        </thead>
        <tbody>
            @foreach($products as $p)
                <tr>
                    <td>{{ $p->name }}</td>
                    <td>{{ $p->category }}</td>
                    <td>{{ $p->brand ?: '—' }}</td>
                    <td>{{ $p->unit ?: '—' }}</td>
                    <td>{{ $p->phase ? ($p->phase === 'Single Phase' ? '1-Ph' : '3-Ph') : '—' }}</td>
                    <td>{{ $p->warranty ?: '—' }}</td>
                    <td class="price">
                        @if($p->price === null)
                            —
                        @elseif($p->unit === 'Per Watt')
                            Rs. {{ number_format((float) $p->price, 2) }}/W
                        @else
                            Rs. {{ number_format((float) $p->price) }}
                        @endif
                    </td>
                    <td class="{{ $p->trend }}">
                        @if($p->trend === 'up') ▲ @elseif($p->trend === 'down') ▼ @else — @endif
                        <span class="muted">{{ $p->price_change }}</span>
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        Solarkon — Trusted Solar Products Trading &amp; Energy Solutions Company &nbsp;|&nbsp; WhatsApp: 0306-6575943
    </div>
</body>
</html>
