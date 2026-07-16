<?php

namespace App\Models;

use Endroid\QrCode\ErrorCorrectionLevel;
use Endroid\QrCode\QrCode;
use Endroid\QrCode\Writer\PngWriter;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Certificate extends Model
{
    protected $fillable = [
        'uuid', 'certificate_type', 'reference', 'issue_date',
        'client_name', 'address', 'valid_years', 'status',
    ];

    protected $attributes = [
        'certificate_type' => 'Building Fitness Certificate',
        'valid_years' => 2,
        'status' => 'valid',
    ];

    protected function casts(): array
    {
        return [
            'issue_date' => 'date',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (Certificate $certificate) {
            if (empty($certificate->uuid)) {
                $certificate->uuid = (string) Str::uuid();
            }
        });
    }

    /** Public verification URL encoded in the QR code (absolute, per APP_URL). */
    public function verifyUrl(): string
    {
        return url('/verify/'.$this->uuid);
    }

    /** QR code as a base64 PNG data URI — used in the PDF, admin, and verify page. */
    public function qrDataUri(): string
    {
        $qr = new QrCode(
            data: $this->verifyUrl(),
            errorCorrectionLevel: ErrorCorrectionLevel::Medium,
            size: 320,
            margin: 8,
        );

        return (new PngWriter())->write($qr)->getDataUri();
    }

    public function isValid(): bool
    {
        return $this->status === 'valid';
    }

    /** Shape for the public verification page. */
    public function toFrontend(): array
    {
        return [
            'uuid' => $this->uuid,
            'type' => $this->certificate_type,
            'reference' => $this->reference,
            'issueDate' => $this->issue_date?->format('d/m/Y'),
            'clientName' => $this->client_name,
            'address' => $this->address,
            'validYears' => $this->valid_years,
            'status' => $this->status,
            'isValid' => $this->isValid(),
            'issuedAt' => $this->created_at?->format('d M Y'),
            'qr' => $this->qrDataUri(),
            'verifyUrl' => $this->verifyUrl(),
        ];
    }
}
