<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
    @page { margin: 0; }
    * { margin: 0; padding: 0; }
    body { font-family: DejaVu Serif, "Times New Roman", serif; color: #1a1a1a; font-size: 12px; }

    /* Fixed-width centred content column (reliable in dompdf) */
    .wrap { width: 178mm; margin: 12mm auto 0 auto; }

    /* Header */
    .head { width: 100%; border-collapse: collapse; }
    .head td { vertical-align: middle; }
    .logo-cell { width: 150px; border: 1.5px solid #222; padding: 5px; text-align: center; }
    .logo-cell img { width: 118px; }
    .company-cell { padding-left: 16px; }
    .company-name { font-size: 22px; font-weight: bold; letter-spacing: .5px; }
    .banner { margin-top: 8px; }
    .banner img { width: 265px; }

    /* Date / ref */
    .meta { margin-top: 16px; padding-left: 6px; font-weight: bold; font-size: 12.5px; line-height: 1.55; }

    /* Title */
    .title-block { text-align: center; margin-top: 20px; font-style: italic; }
    .title-block .t1 { font-size: 15px; font-weight: bold; letter-spacing: .5px; }
    .title-block .t2 { font-size: 12.5px; font-weight: bold; margin-top: 3px; }
    .title-block .t3 { font-size: 12.5px; font-weight: bold; margin-top: 3px; }
    .title-block .t4 { font-size: 12px; font-weight: bold; margin-top: 2px; }

    /* Body — left aligned, tight spacing to match the original */
    .body { margin-top: 12px; font-size: 12px; line-height: 1.45; text-align: left; }
    .body p { margin-bottom: 6px; }

    /* Regards / signature / stamp / QR */
    .signrow { width: 100%; margin-top: 18px; border-collapse: collapse; }
    .signrow td { vertical-align: bottom; }
    .regards { font-weight: bold; font-size: 12px; line-height: 1.55; width: 44%; vertical-align: top; }
    .signstamp { width: 34%; text-align: center; }
    .signstamp img.sign { width: 115px; display: block; margin: 0 auto 2px; }
    .signstamp img.stamp { width: 92px; display: block; margin: 0 auto; }
    .qr-cell { width: 22%; text-align: center; }
    .qr-cell img { width: 100px; }
    .qr-cell .scan { font-family: DejaVu Sans, sans-serif; font-size: 7.5px; color: #555; margin-top: 2px; font-style: normal; }

    /* Full-bleed footer (fixed = from paper edge) */
    .footer { position: fixed; left: 0; right: 0; bottom: 0; width: 100%; }
    .footer img { width: 100%; display: block; }

    .void { position: fixed; top: 360px; left: 120px; width: 380px; text-align: center;
            color: rgba(200,0,0,.28); font-size: 68px; font-weight: bold;
            font-family: DejaVu Sans, sans-serif; transform: rotate(-22deg); letter-spacing: 4px; }
</style>
</head>
<body>

    @if($c->status !== 'valid')
        <div class="void">REVOKED</div>
    @endif

    <div class="wrap">

        {{-- Header --}}
        <table class="head">
            <tr>
                <td class="logo-cell">
                    <img src="{{ public_path('certificate/logo.png') }}" alt="Solarkon">
                </td>
                <td class="company-cell">
                    <div class="company-name">SOLARKON (PRIVATE) LIMITED</div>
                    <div class="banner">
                        <img src="{{ public_path('certificate/banner.jpg') }}" alt="Nature Produces and We Deliver">
                    </div>
                </td>
            </tr>
        </table>

        {{-- Date / Reference (dynamic) --}}
        <div class="meta">
            Date: {{ $c->issue_date?->format('d/m/Y') }}<br>
            Ref: {{ $c->reference }}
        </div>

        {{-- Title + client (client fields dynamic) --}}
        <div class="title-block">
            <div class="t1">{{ strtoupper($c->certificate_type) }}</div>
            <div class="t2">For</div>
            <div class="t3">{{ $c->client_name }}</div>
            @if($c->address)
                <div class="t4">Address: {{ $c->address }}</div>
            @endif
        </div>

        {{-- Fixed body --}}
        <div class="body">
            <p>It is certified that the aforementioned building is prima facie Safe, Stable and Sound for its current occupancy.</p>
            <p>This certificate shall remain valid for a period of two (02) years from the date of its issuance, provided that no structural or architectural additions, alterations, modifications, or changes in occupancy are made during this period.</p>
            <p>In the event that any addition, alteration, renovation, or change affecting the structural integrity of the building is proposed, the same shall be carried out only after due structural evaluation, design, and written approval by the undersigned engineer. Any such work undertaken without the approval of the undersigned engineer shall render this certificate null and void.</p>
        </div>

        {{-- Regards / signature / stamp / QR --}}
        <table class="signrow">
            <tr>
                <td class="regards">
                    Regards:<br>
                    Engineer Muhammad Faheem Kamal<br>
                    B.Sc. Civil Engineering<br>
                    PEC No. CIVIL/43054<br>
                    Solarkon Private Limited<br>
                    PEC License No : 11047
                </td>
                <td class="signstamp">
                    <img class="sign" src="{{ public_path('certificate/signature.jpg') }}" alt="Signature">
                    <img class="stamp" src="{{ public_path('certificate/stamp.jpg') }}" alt="Company Stamp">
                </td>
                <td class="qr-cell">
                    <img src="{{ $qr }}" alt="Verification QR">
                    <div class="scan">Scan to verify</div>
                </td>
            </tr>
        </table>

    </div>

    {{-- Fixed footer --}}
    <div class="footer">
        <img src="{{ public_path('certificate/footer.jpg') }}" alt="">
    </div>
</body>
</html>
