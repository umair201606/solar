<?php

namespace App\Http\Controllers;

use App\Jobs\SendPriceAlerts;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

class ProductImportExportController extends Controller
{
    /**
     * Column sets per template type. Every template shares the core
     * columns; the trailing spec columns differ per product type and are
     * folded into the product's specs list on import.
     */
    private const CORE_COLUMNS = [
        'name' => 'Product name (required) — e.g. Goodwe 10kW 1-Ph Hybrid Inverter',
        'category' => 'Category (must exist, or approve as new during import)',
        'brand' => 'Brand (must exist, or approve as new during import)',
        'price' => 'Price in Rs. numbers only — e.g. 410000 (panels: rate per watt e.g. 43.75)',
        'internal_price' => 'Internal price in Rs. — hidden from store, used for dealer margin calc',
        'price_date' => 'Date this price applies from, YYYY-MM-DD — empty = today',
        'unit' => 'Display unit — e.g. 10kW, 5kWh, Per Watt',
        'warranty' => 'Warranty — e.g. 5 Years',
        'phase' => 'Single Phase / Three Phase (inverters)',
        'power_kw' => 'Numeric capacity: kW for inverters, kWh for batteries, e.g. 10',
        'whatsapp_number' => 'Override WhatsApp number — empty = default number',
        'description' => 'Description — empty = default description',
        'tagline' => 'Short card line — e.g. Best for residential & small commercial solar systems',
        'is_published' => 'yes / no (empty = yes)',
    ];

    private const TYPE_COLUMNS = [
        'batteries' => [
            'voltage' => 'e.g. 51.2V',
            'capacity_ah' => 'e.g. 100Ah',
            'protection' => 'IP rating, e.g. IP65',
            'life_cycles' => 'e.g. 8000+',
        ],
        'inverters' => [
            'inverter_type' => 'On-Grid / Off-Grid / Hybrid',
            'protection' => 'IP rating, e.g. IP66',
            'series_model' => 'e.g. PV12000, S6, Max Pro',
        ],
        'panels' => [
            'panel_watts' => 'e.g. 590W',
            'technology' => 'e.g. N-Type Bifacial, Mono',
            'grade' => 'e.g. A Grade',
        ],
        'generic' => [
            'specs' => 'Extra specs, pipe-separated — e.g. Voltage: 51.2V | Capacity: 100Ah',
        ],
    ];

    private const SPEC_LABELS = [
        'voltage' => 'Voltage', 'capacity_ah' => 'Capacity', 'protection' => 'Protection',
        'life_cycles' => 'Life Cycles', 'inverter_type' => 'Type', 'series_model' => 'Series',
        'panel_watts' => 'Power', 'technology' => 'Technology', 'grade' => 'Grade',
    ];

    public function template(Request $request)
    {
        $type = $request->query('type', 'generic');
        $columns = self::CORE_COLUMNS + (self::TYPE_COLUMNS[$type] ?? self::TYPE_COLUMNS['generic']);

        $spreadsheet = new Spreadsheet;
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Products');

        $sheet->fromArray(array_keys($columns), null, 'A1');
        $sheet->fromArray(array_values($columns), null, 'A2');

        $example = match ($type) {
            'batteries' => ['Soluna 10kWh IP65 Lithium Battery', 'Lithium Batteries', 'Soluna', 590000, 550000, now()->toDateString(), '10kWh', '10 Years', '', 10, '', '', 'Long-life lithium backup for day & night power', 'yes', '51.2V', '200Ah', 'IP65', '8000+'],
            'inverters' => ['Goodwe 10kW 1-Ph Hybrid Inverter', 'Hybrid Inverters', 'Goodwe', 405000, 380000, now()->toDateString(), '10kW', '5 Years', 'Single Phase', 10, '', '', 'Best for residential & small commercial solar systems', 'yes', 'Hybrid', 'IP65', 'GW10K-ET'],
            'panels' => ['Jinko 590W Solar Panel', 'Solar Panels', 'Jinko', 44.00, 40.00, now()->toDateString(), 'Per Watt', '', '', 0.59, '', '', 'High-efficiency Tier-1 module — priced per watt', 'yes', '590W', 'N-Type Mono', 'A Grade'],
            default => ['Goodwe 10kW 1-Ph Hybrid Inverter', 'Hybrid Inverters', 'Goodwe', 405000, 380000, now()->toDateString(), '10kW', '5 Years', 'Single Phase', 10, '', '', 'Best for residential & small commercial solar systems', 'yes', 'Type: Hybrid | Protection: IP65'],
        };
        $sheet->fromArray($example, null, 'A3');

        $lastCol = $sheet->getHighestColumn();
        $sheet->getStyle("A1:{$lastCol}1")->getFont()->setBold(true);
        $sheet->getStyle("A1:{$lastCol}1")->getFill()->setFillType(Fill::FILL_SOLID)
            ->getStartColor()->setRGB('D4FF00');
        $sheet->getStyle("A2:{$lastCol}2")->getFont()->setItalic(true)->setSize(8);
        foreach (range('A', $lastCol) as $col) {
            $sheet->getColumnDimension($col)->setWidth(22);
        }
        $sheet->freezePane('A3');

        return $this->downloadSpreadsheet($spreadsheet, "products-template-{$type}.xlsx");
    }

    /**
     * Real-time check: given a row's name/brand/category/specs, return
     * whether a matching product exists in the database.
     */
    public function checkExists(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'brand' => 'nullable|string|max:255',
            'category' => 'nullable|string|max:255',
            'unit' => 'nullable|string|max:255',
            'warranty' => 'nullable|string|max:255',
            'phase' => 'nullable|string|max:255',
            'power_kw' => 'nullable|numeric',
            'specs' => 'nullable|array',
        ]);

        $slug = Str::slug($request->input('name'));
        $existing = Product::query()
            ->where('slug', $slug)
            ->first(['id', 'name', 'brand', 'category', 'unit', 'warranty', 'phase', 'power_kw', 'specs', 'price']);

        if (! $existing) {
            return response()->json(['exists' => false]);
        }

        $allMatch = $this->specsMatch(
            $existing,
            $request->input('name'),
            $request->input('brand'),
            $request->input('category'),
            [
                'unit' => $request->input('unit'),
                'warranty' => $request->input('warranty'),
                'phase' => $this->normalizePhase($request->input('phase')),
                'power_kw' => $request->filled('power_kw') ? (float) $request->input('power_kw') : null,
            ],
            $request->input('specs') ?? []
        );

        return response()->json([
            'exists' => true,
            'all_match' => $allMatch,
            'existing_id' => $existing->id,
            'existing_price' => (float) $existing->price,
        ]);
    }

    /**
     * Step 1 of import: parse the uploaded file and return reviewable
     * rows. Nothing is written to the database here.
     */
    public function importPreview(Request $request)
    {
        $request->validate(['file' => 'required|file|mimes:xlsx,xls,csv,txt|max:10240']);

        $rows = $this->readRows($request->file('file')->getRealPath());
        if (empty($rows)) {
            return response()->json(['message' => 'No data rows found in the file.'], 422);
        }

        $products = Product::query()->get(['id', 'slug', 'name', 'price', 'brand', 'category', 'unit', 'warranty', 'phase', 'power_kw', 'specs'])->keyBy('slug');
        $categories = Category::pluck('name');
        $brands = Brand::pluck('name');
        $categorySlugs = $categories->keyBy(fn ($n) => Str::slug($n));
        $brandSlugs = $brands->keyBy(fn ($n) => Str::slug($n));

        $preview = [];
        $newCategories = [];
        $newBrands = [];

        foreach ($rows as $i => $row) {
            $name = trim((string) ($row['name'] ?? ''));
            if ($name === '') {
                continue;
            }

            $specs = $this->buildSpecs($row);
            $slug = Str::slug($name);
            $existing = $products->get($slug);

            // Normalize category/brand casing against known values.
            $category = trim((string) ($row['category'] ?? ''));
            $brand = trim((string) ($row['brand'] ?? ''));
            $category = $categorySlugs->get(Str::slug($category), $category);
            $brand = $brandSlugs->get(Str::slug($brand), $brand);

            $issues = [];
            if ($category === '') {
                $issues[] = 'Missing category';
            } elseif (! $categories->contains($category)) {
                $issues[] = 'New category';
                $newCategories[$category] = true;
            }
            if ($brand !== '' && ! $brands->contains($brand)) {
                $issues[] = 'New brand';
                $newBrands[$brand] = true;
            }

            $price = is_numeric($row['price'] ?? null) ? (float) $row['price'] : null;
            $priceDate = $this->normalizeDate($row['price_date'] ?? null);

            $status = 'new';
            $priceChanged = false;
            if ($existing) {
                $allMatch = $this->specsMatch($existing, $name, $brand, $category, [
                    'unit' => trim((string) ($row['unit'] ?? '')) ?: null,
                    'warranty' => trim((string) ($row['warranty'] ?? '')) ?: null,
                    'phase' => $this->normalizePhase($row['phase'] ?? null),
                    'power_kw' => is_numeric($row['power_kw'] ?? null) ? (float) $row['power_kw'] : null,
                ], $specs);
                if ($allMatch) {
                    $priceChanged = $price !== null && (float) $existing->price !== $price;
                    $status = $priceChanged ? 'price-change' : 'duplicate';
                }
            }

            $preview[] = [
                'row' => $i + 1,
                'include' => $status !== 'duplicate',
                'status' => $status,
                'existing_id' => $existing?->id,
                'existing_price' => $existing ? (float) $existing->price : null,
                'issues' => $issues,
                'data' => [
                    'name' => $name,
                    'category' => $category,
                    'brand' => $brand ?: null,
                    'price' => $price,
                    'internal_price' => is_numeric($row['internal_price'] ?? null) ? (float) $row['internal_price'] : null,
                    'price_date' => $priceDate,
                    'unit' => trim((string) ($row['unit'] ?? '')) ?: null,
                    'warranty' => trim((string) ($row['warranty'] ?? '')) ?: null,
                    'phase' => $this->normalizePhase($row['phase'] ?? null),
                    'power_kw' => is_numeric($row['power_kw'] ?? null) ? (float) $row['power_kw'] : null,
                    'whatsapp_number' => trim((string) ($row['whatsapp_number'] ?? '')) ?: null,
                    'description' => trim((string) ($row['description'] ?? '')) ?: null,
                    'tagline' => trim((string) ($row['tagline'] ?? '')) ?: null,
                    'is_published' => ! in_array(strtolower(trim((string) ($row['is_published'] ?? ''))), ['no', 'false', '0'], true),
                    'specs' => $specs,
                ],
            ];
        }

        return response()->json([
            'rows' => $preview,
            'new_categories' => array_keys($newCategories),
            'new_brands' => array_keys($newBrands),
            'summary' => [
                'total' => count($preview),
                'new' => collect($preview)->where('status', 'new')->count(),
                'price_changes' => collect($preview)->where('status', 'price-change')->count(),
                'duplicates' => collect($preview)->where('status', 'duplicate')->count(),
            ],
        ]);
    }

    /**
     * Step 2 of import: apply the reviewed (possibly edited) rows.
     */
    public function importCommit(Request $request)
    {
        $payload = $request->validate([
            'add_categories' => 'array',
            'add_categories.*' => 'string|max:255',
            'add_brands' => 'array',
            'add_brands.*' => 'string|max:255',
            'rows' => 'required|array|min:1',
            'rows.*.data.name' => 'required|string|max:255',
            'rows.*.data.category' => 'required|string|max:255',
            'rows.*.data.brand' => 'nullable|string|max:255',
            'rows.*.data.price' => 'nullable|numeric|min:0',
            'rows.*.data.internal_price' => 'nullable|numeric|min:0',
            'rows.*.data.price_date' => 'nullable|date',
            'rows.*.data.unit' => 'nullable|string|max:255',
            'rows.*.data.warranty' => 'nullable|string|max:255',
            'rows.*.data.phase' => 'nullable|in:Single Phase,Three Phase',
            'rows.*.data.power_kw' => 'nullable|numeric|min:0',
            'rows.*.data.whatsapp_number' => 'nullable|string|max:30',
            'rows.*.data.description' => 'nullable|string',
            'rows.*.data.tagline' => 'nullable|string|max:255',
            'rows.*.data.is_published' => 'boolean',
            'rows.*.data.specs' => 'nullable|array',
            'rows.*.action' => 'required|in:create,update,delete',
        ]);

        foreach ($payload['add_categories'] ?? [] as $i => $name) {
            Category::firstOrCreate(['name' => $name], ['sort_order' => 50 + $i]);
        }
        foreach ($payload['add_brands'] ?? [] as $name) {
            Brand::firstOrCreate(['slug' => Str::slug($name)], ['name' => $name]);
        }

        $validCategories = Category::pluck('name');
        $created = $updated = $skipped = $deleted = 0;
        $errors = [];

        foreach ($payload['rows'] as $i => $row) {
            $data = $row['data'];
            $action = $row['action'];

            if ($action !== 'delete' && ! $validCategories->contains($data['category'])) {
                $errors[] = "Row {$data['name']}: category '{$data['category']}' does not exist and was not approved.";
                $skipped++;
                continue;
            }

            $slug = Str::slug($data['name']);
            $existing = Product::query()->where('slug', $slug)->first();

            $attributes = collect($data)->except(['price', 'price_date'])->all();
            $price = $data['price'] ?? null;

            if ($action === 'delete') {
                if (! $existing) {
                    $errors[] = "Row {$data['name']}: product not found — skipped deletion.";
                    $skipped++;
                    continue;
                }
                $existing->media()->detach();
                $existing->delete();
                $deleted++;
            } elseif ($action === 'update') {
                if (! $existing) {
                    $errors[] = "Row {$data['name']}: product not found — skipped update.";
                    $skipped++;
                    continue;
                }
                $existing->update($attributes);
                if ($price !== null && (float) $existing->price !== (float) $price) {
                    $existing->recordPrice((float) $price, $data['price_date'] ?? null, 'import', isset($data['internal_price']) ? (float) $data['internal_price'] : null);
                }
                $updated++;
            } else {
                if ($existing) {
                    $errors[] = "Row {$data['name']}: product already exists — skipped creation.";
                    $skipped++;
                    continue;
                }
                $product = Product::create($attributes + ['slug' => $slug]);
                if ($price !== null) {
                    $product->recordPrice((float) $price, $data['price_date'] ?? null, 'import', isset($data['internal_price']) ? (float) $data['internal_price'] : null);
                }
                $created++;
            }
        }

        // One coalesced alert run for every price the import moved.
        SendPriceAlerts::afterPriceChange();

        return response()->json([
            'created' => $created,
            'updated' => $updated,
            'deleted' => $deleted,
            'skipped' => $skipped,
            'errors' => $errors,
        ]);
    }

    /**
     * Export the (filtered) catalog as Excel or PDF.
     */
    public function export(Request $request)
    {
        $query = Product::query()->orderBy('category')->orderBy('brand')->orderBy('power_kw');

        if ($q = trim((string) $request->query('q'))) {
            $query->where(fn ($w) => $w
                ->where('name', 'like', "%{$q}%")
                ->orWhere('brand', 'like', "%{$q}%")
                ->orWhere('category', 'like', "%{$q}%"));
        }
        if ($category = $request->query('category')) {
            $query->where('category', $category);
        }
        if ($brand = $request->query('brand')) {
            $query->whereIn('brand', explode(',', $brand));
        }
        if ($phase = $request->query('phase')) {
            $query->where('phase', $phase);
        }
        if ($request->filled('kw_min')) {
            $query->where('power_kw', '>=', (float) $request->query('kw_min'));
        }
        if ($request->filled('kw_max')) {
            $query->where('power_kw', '<=', (float) $request->query('kw_max'));
        }
        if ($request->filled('price_min')) {
            $query->where('price', '>=', (float) $request->query('price_min'));
        }
        if ($request->filled('price_max')) {
            $query->where('price', '<=', (float) $request->query('price_max'));
        }
        if ($request->query('published') === 'yes') {
            $query->where('is_published', true);
        }

        $products = $query->get();
        $stamp = now()->format('Y-m-d');

        if ($request->query('format') === 'pdf') {
            $pdf = Pdf::loadView('exports.products-pdf', [
                'products' => $products,
                'generatedAt' => now(),
                'filters' => array_filter($request->only(['q', 'category', 'brand', 'phase', 'kw_min', 'kw_max', 'price_min', 'price_max'])),
            ])->setPaper('a4', 'landscape');

            return $pdf->download("seb-solar-products-{$stamp}.pdf");
        }

        $spreadsheet = new Spreadsheet;
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Products');
        $headers = ['name', 'category', 'brand', 'price', 'price_date', 'unit', 'warranty', 'phase', 'power_kw', 'whatsapp_number', 'description', 'tagline', 'is_published', 'specs', 'trend', 'price_change'];
        $sheet->fromArray($headers, null, 'A1');

        $r = 2;
        foreach ($products as $p) {
            $sheet->fromArray([
                $p->name, $p->category, $p->brand,
                $p->price !== null ? (float) $p->price : null,
                $p->priceHistories()->reorder('recorded_on', 'desc')->value('recorded_on'),
                $p->unit, $p->warranty, $p->phase,
                $p->power_kw !== null ? (float) $p->power_kw : null,
                $p->whatsapp_number, $p->description, $p->tagline,
                $p->is_published ? 'yes' : 'no',
                implode(' | ', $p->specs ?: []),
                $p->trend, $p->price_change,
            ], null, "A{$r}");
            $r++;
        }

        $lastCol = $sheet->getHighestColumn();
        $sheet->getStyle("A1:{$lastCol}1")->getFont()->setBold(true);
        $sheet->getStyle("A1:{$lastCol}1")->getFill()->setFillType(Fill::FILL_SOLID)
            ->getStartColor()->setRGB('D4FF00');
        $sheet->freezePane('A2');

        return $this->downloadSpreadsheet($spreadsheet, "seb-solar-products-{$stamp}.xlsx");
    }

    // ---- helpers ----

    private function readRows(string $path): array
    {
        $spreadsheet = IOFactory::load($path);
        $sheet = $spreadsheet->getActiveSheet();
        $raw = $sheet->toArray(null, true, true, false);

        if (count($raw) < 2) {
            return [];
        }

        $headers = array_map(fn ($h) => Str::of((string) $h)->lower()->trim()->replace([' ', '-'], '_')->toString(), $raw[0]);
        $rows = [];

        foreach (array_slice($raw, 1) as $line) {
            $row = [];
            foreach ($headers as $idx => $header) {
                if ($header !== '') {
                    $row[$header] = $line[$idx] ?? null;
                }
            }
            // Skip the hint row from our own templates and empty lines.
            $name = trim((string) ($row['name'] ?? ''));
            if ($name === '' || str_starts_with($name, 'Product name (required)')) {
                continue;
            }
            $rows[] = $row;
        }

        return $rows;
    }

    private function buildSpecs(array $row): array
    {
        $specs = [];
        foreach (self::SPEC_LABELS as $column => $label) {
            $value = trim((string) ($row[$column] ?? ''));
            if ($value !== '') {
                $specs[] = "{$label}: {$value}";
            }
        }
        foreach (explode('|', (string) ($row['specs'] ?? '')) as $piece) {
            $piece = trim($piece);
            if ($piece !== '') {
                $specs[] = $piece;
            }
        }

        return array_values(array_unique($specs));
    }

    private function normalizePhase($value): ?string
    {
        $v = strtolower(trim((string) $value));

        return match (true) {
            $v === '' => null,
            str_contains($v, 'single') || $v === 'sp' || $v === '1p' || $v === '1-ph' => 'Single Phase',
            str_contains($v, 'three') || $v === '3p' || $v === '3-ph' => 'Three Phase',
            default => null,
        };
    }

    private function normalizeDate($value): ?string
    {
        $v = trim((string) $value);
        if ($v === '') {
            return null;
        }
        if (is_numeric($v) && (float) $v > 20000) { // Excel serial date
            return \PhpOffice\PhpSpreadsheet\Shared\Date::excelToDateTimeObject((float) $v)->format('Y-m-d');
        }
        try {
            return \Carbon\Carbon::parse($v)->format('Y-m-d');
        } catch (\Throwable) {
            return null;
        }
    }

    private function downloadSpreadsheet(Spreadsheet $spreadsheet, string $filename)
    {
        $writer = new Xlsx($spreadsheet);
        $temp = tempnam(sys_get_temp_dir(), 'xlsx');
        $writer->save($temp);

        return response()->download($temp, $filename, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ])->deleteFileAfterSend(true);
    }

    /**
     * Compare an existing product against import row data.
     * Returns true only if name, brand, category, and all specs match exactly.
     */
    private function specsMatch(Product $existing, string $name, ?string $brand, ?string $category, array $fields, array $importSpecs): bool
    {
        // Name already matched via slug; confirm exact name match
        if ( Str::slug($existing->name) !== Str::slug($name)) {
            return false;
        }

        foreach (['brand', 'category'] as $field) {
            $existingVal = $existing->{$field} ?? null;
            $importVal = $field === 'brand' ? $brand : $category;
            if (strtolower(trim((string) ($existingVal ?? ''))) !== strtolower(trim((string) ($importVal ?? '')))) {
                return false;
            }
        }

        foreach ($fields as $field => $importVal) {
            $existingVal = $existing->{$field} ?? null;
            if (is_numeric($existingVal) && is_numeric($importVal)) {
                if ((float) $existingVal !== (float) $importVal) {
                    return false;
                }
            } else {
                $existingNorm = strtolower(trim((string) ($existingVal ?? '')));
                $importNorm = strtolower(trim((string) ($importVal ?? '')));
                if ($existingNorm !== $importNorm) {
                    return false;
                }
            }
        }

        // Compare specs: every import spec must exist in DB specs (DB can have extras)
        $existingSpecs = $existing->specs ?? [];
        if (! is_array($existingSpecs)) {
            $existingSpecs = [];
        }

        foreach ($importSpecs as $spec) {
            if (! in_array($spec, $existingSpecs)) {
                return false;
            }
        }

        return true;
    }
}
