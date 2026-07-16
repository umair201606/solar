import { Head } from "@inertiajs/react";
import { ShieldCheck, ShieldAlert, ShieldX, Download, Calendar, Hash, MapPin, Building2 } from "lucide-react";

function Row({ icon: Icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
      <Icon className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
      <div>
        <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">{label}</p>
        <p className="text-sm font-semibold text-dark-bg mt-0.5">{value}</p>
      </div>
    </div>
  );
}

export default function CertificateVerify({ certificate, found }) {
  const valid = found && certificate?.isValid;
  const revoked = found && !certificate?.isValid;

  return (
    <div className="min-h-screen bg-light-bg">
      <Head title="Certificate Verification" />

      {/* Brand header */}
      <header className="bg-dark-bg">
        <div className="max-w-3xl mx-auto px-6 py-5 flex items-center gap-3">
          <img src="/certificate/logo.png" alt="Solarkon" className="h-11 bg-white rounded-lg p-1" />
          <div>
            <p className="text-white font-black leading-tight">SOLARKON (PRIVATE) LIMITED</p>
            <p className="text-primary text-xs font-medium">Certificate Verification Portal</p>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        {/* Status banner */}
        <div
          className={`rounded-3xl p-8 text-center shadow-sm border ${
            valid
              ? "bg-green-50 border-green-200"
              : revoked
                ? "bg-amber-50 border-amber-200"
                : "bg-red-50 border-red-200"
          }`}
        >
          <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mx-auto mb-4">
            {valid ? (
              <ShieldCheck className="w-9 h-9 text-green-600" />
            ) : revoked ? (
              <ShieldAlert className="w-9 h-9 text-amber-500" />
            ) : (
              <ShieldX className="w-9 h-9 text-red-500" />
            )}
          </div>

          {valid && (
            <>
              <h1 className="text-2xl font-black text-green-800">Authentic Certificate</h1>
              <p className="text-green-700 text-sm mt-2 max-w-md mx-auto">
                This certificate is genuine and was officially issued by Solarkon (Private) Limited.
              </p>
            </>
          )}
          {revoked && (
            <>
              <h1 className="text-2xl font-black text-amber-700">Certificate Revoked</h1>
              <p className="text-amber-700 text-sm mt-2 max-w-md mx-auto">
                This certificate was issued by Solarkon (Private) Limited but has since been revoked and is no longer valid.
              </p>
            </>
          )}
          {!found && (
            <>
              <h1 className="text-2xl font-black text-red-700">Certificate Not Found</h1>
              <p className="text-red-600 text-sm mt-2 max-w-md mx-auto">
                We could not verify this certificate. It may be invalid, forged, or the link may be incorrect.
              </p>
            </>
          )}
        </div>

        {/* Details */}
        {found && (
          <div className="mt-6 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-7 py-7 border-b border-gray-100 text-center">
              <span className="inline-block bg-dark-bg text-primary text-sm font-black uppercase tracking-[0.15em] px-6 py-2.5 rounded-full shadow-sm">
                {certificate.type}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-dark-bg mt-4">{certificate.clientName}</h2>
            </div>
            <div className="px-7 py-2">
              <Row icon={Hash} label="Reference Number" value={certificate.reference} />
              <Row icon={Building2} label="Issued To" value={certificate.clientName} />
              <Row icon={MapPin} label="Address" value={certificate.address} />
              <Row icon={Calendar} label="Issue Date" value={certificate.issueDate} />
              <Row icon={ShieldCheck} label="Validity" value={certificate.validYears ? `${certificate.validYears} years from issuance` : null} />
            </div>

            <div className="px-7 py-5 bg-gray-50/60 border-t border-gray-100">
              <a
                href={`/verify/${certificate.uuid}/download`}
                className="w-full flex items-center justify-center gap-2 bg-dark-bg text-primary font-bold py-3.5 rounded-2xl text-sm hover:bg-dark-card transition-colors"
              >
                <Download className="w-4 h-4" /> Download Certificate PDF
              </a>
            </div>
          </div>
        )}

        <p className="text-center text-xs text-gray-400 mt-8">
          For queries, contact Solarkon (Private) Limited · info@solarkon.org · +92 306 2935768
        </p>
      </main>
    </div>
  );
}
