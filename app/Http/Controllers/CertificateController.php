<?php

namespace App\Http\Controllers;

use App\Models\Certificate;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CertificateController extends Controller
{
    // ---- Admin API ----

    public function index()
    {
        return response()->json(
            Certificate::latest()->get()->map(fn (Certificate $c) => $this->adminRow($c))
        );
    }

    public function store(Request $request)
    {
        // Treat a blank reference as null so the unique rule is skipped and one
        // is auto-generated below.
        $request->merge(['reference' => $request->reference ?: null]);

        $data = $request->validate([
            'certificate_type' => 'nullable|string|max:255',
            'reference' => 'nullable|string|max:255|unique:certificates,reference',
            'issue_date' => 'required|date',
            'client_name' => 'required|string|max:255',
            'address' => 'nullable|string|max:1000',
            'valid_years' => 'nullable|integer|min:1|max:50',
        ], [
            'reference.unique' => 'This reference number has already been used.',
        ]);

        $data['certificate_type'] = $data['certificate_type'] ?: 'Building Fitness Certificate';
        $data['valid_years'] = $data['valid_years'] ?? 2;
        $data['reference'] = $data['reference'] ?: $this->nextReference($data['issue_date']);

        $certificate = Certificate::create($data);

        return response()->json($this->adminRow($certificate), 201);
    }

    public function show(Certificate $certificate)
    {
        return response()->json($this->adminRow($certificate));
    }

    public function destroy(Certificate $certificate)
    {
        $certificate->delete();

        return response()->json(['message' => 'Certificate deleted']);
    }

    public function revoke(Certificate $certificate)
    {
        $certificate->update([
            'status' => $certificate->isValid() ? 'revoked' : 'valid',
        ]);

        return response()->json($this->adminRow($certificate));
    }

    /** Suggest the next reference for a given year, e.g. SK/BFC/2026/0012. */
    public function nextRef(Request $request)
    {
        $date = $request->query('date', now()->toDateString());

        return response()->json(['reference' => $this->nextReference($date)]);
    }

    /** Live check whether a reference is still free. */
    public function checkRef(Request $request)
    {
        $reference = trim((string) $request->query('reference', ''));

        if ($reference === '') {
            return response()->json(['available' => true]);
        }

        return response()->json([
            'available' => ! Certificate::where('reference', $reference)->exists(),
        ]);
    }

    // ---- Public ----

    public function verify(string $uuid)
    {
        $certificate = Certificate::where('uuid', $uuid)->first();

        return Inertia::render('CertificateVerify', [
            'certificate' => $certificate?->toFrontend(),
            'found' => (bool) $certificate,
        ]);
    }

    public function download(string $uuid)
    {
        $certificate = Certificate::where('uuid', $uuid)->firstOrFail();

        $pdf = Pdf::loadView('certificates.pdf', [
            'c' => $certificate,
            'qr' => $certificate->qrDataUri(),
        ])->setPaper('a4')->setOption('isFontSubsettingEnabled', true);

        $name = str($certificate->client_name)->slug().'-certificate.pdf';

        return $pdf->download($name);
    }

    // ---- Helpers ----

    private function adminRow(Certificate $c): array
    {
        return [
            'id' => $c->id,
            'uuid' => $c->uuid,
            'certificate_type' => $c->certificate_type,
            'reference' => $c->reference,
            'issue_date' => $c->issue_date?->toDateString(),
            'client_name' => $c->client_name,
            'address' => $c->address,
            'valid_years' => $c->valid_years,
            'status' => $c->status,
            'verify_url' => $c->verifyUrl(),
            'qr' => $c->qrDataUri(),
            'created_at' => $c->created_at?->toDateString(),
        ];
    }

    private function nextReference(string $date): string
    {
        $year = date('Y', strtotime($date));
        $count = Certificate::whereYear('created_at', $year)->count() + 1;

        return sprintf('SK/BFC/%s/%04d', $year, $count);
    }
}
