import { useMemo, useState } from "react";
import { formatRs, formatRsShort, formatDate, formatDateFull } from "../../lib/format";

// history: array of [isoDate, price] sorted by date ascending.

function pathFrom(points, w, h, pad = 2, padLeft = pad) {
  if (points.length === 0) return { line: "", coords: [] };
  const prices = points.map((p) => p[1]);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const span = max - min || 1;
  const t0 = new Date(points[0][0]).getTime();
  const t1 = new Date(points[points.length - 1][0]).getTime();
  const tSpan = t1 - t0 || 1;

  const coords = points.map(([date, price]) => {
    const x = padLeft + ((new Date(date).getTime() - t0) / tSpan) * (w - padLeft - pad);
    const y = h - pad - ((price - min) / span) * (h - pad * 2);
    return [x, y, date, price];
  });

  return {
    line: coords.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" "),
    coords,
    min,
    max,
  };
}

export function Sparkline({ history, trend, width = 96, height = 28 }) {
  const { line } = useMemo(() => pathFrom(history || [], width, height), [history, width, height]);
  if (!history || history.length < 2) return null;

  const color = trend === "up" ? "#e74c3c" : trend === "down" ? "#16a34a" : "#94a3b8";

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
      <path d={line} fill="none" stroke={color} strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

/**
 * 30-day area trend for the product card ("Price trend (30 days)"):
 * dashed gridlines, soft area fill, end dot — like a finance app tile.
 */
export function TrendArea({ history, trend, width = 260, height = 88 }) {
  const points = useMemo(() => {
    const all = history || [];
    if (all.length === 0) return [];
    const last = new Date(all[all.length - 1][0]).getTime();
    const cutoff = last - 30 * 24 * 3600 * 1000;
    const sliced = all.filter(([d]) => new Date(d).getTime() >= cutoff);
    return sliced.length >= 2 ? sliced : all;
  }, [history]);

  const PAD = 6;
  const { line, coords } = useMemo(
    () => pathFrom(points, width, height, PAD),
    [points, width, height]
  );

  if (points.length < 2) {
    return (
      <div className="flex items-center justify-center h-full min-h-[48px] text-[10px] text-gray-300 italic">
        Trend appears after the next rate update
      </div>
    );
  }

  const color = trend === "up" ? "#dc2626" : "#16a34a";
  const gid = `ta-${color.slice(1)}`;
  const end = coords[coords.length - 1];
  const area = `${line} L${end[0]},${height - 2} L${coords[0][0]},${height - 2} Z`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full h-auto overflow-visible"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.16" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.18, 0.5, 0.82].map((f) => (
        <line
          key={f}
          x1={PAD} x2={width - PAD} y1={height * f} y2={height * f}
          stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4 4"
        />
      ))}
      <path d={area} fill={`url(#${gid})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={end[0]} cy={end[1]} r="4" fill={color} />
    </svg>
  );
}

/**
 * Full price-trend chart for the product modal. Pure SVG, hoverable
 * points, date axis from the real recorded dates.
 */
export function PriceChart({ history, unit }) {
  const [hover, setHover] = useState(null);
  const W = 640;
  const H = 210;
  const PAD = 14;
  const PADL = 66;

  const { line, coords, min, max } = useMemo(
    () => pathFrom(history || [], W, H, PAD, PADL),
    [history]
  );

  if (!history || history.length < 2) {
    return (
      <p className="text-sm text-gray-400 italic">
        Price history will appear here as rates are updated.
      </p>
    );
  }

  const first = history[0];
  const mid = history[Math.floor(history.length / 2)];
  const last = history[history.length - 1];
  const area = `${line} L${coords[coords.length - 1][0]},${H - 2} L${coords[0][0]},${H - 2} Z`;
  const rising = last[1] > first[1];
  const color = rising ? "#e74c3c" : last[1] < first[1] ? "#16a34a" : "#64748b";
  const span = max - min;
  const ticks = (span > 0 ? [0, 0.5, 1] : [0.5]).map((f) => ({
    f,
    value: max - f * span,
    y: PAD + f * (H - PAD * 2),
  }));

  return (
    <div>
      <div className="relative">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-auto select-none"
          onMouseLeave={() => setHover(null)}
        >
          <defs>
            <linearGradient id="pc-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.18" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
          {ticks.map((t) => (
            <g key={t.f}>
              <line
                x1={PADL} x2={W - PAD} y1={t.y} y2={t.y}
                stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4 4"
              />
              <text
                x={PADL - 10} y={t.y + 4} textAnchor="end"
                fontSize="11" fontWeight="600" fill="#9ca3af"
              >
                {formatRsShort(t.value, unit)}
              </text>
            </g>
          ))}
          <path d={area} fill="url(#pc-fill)" />
          <path d={line} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
          {coords.map(([x, y, date, price], i) => (
            <g key={i}>
              <circle
                cx={x} cy={y} r="10" fill="transparent"
                onMouseEnter={() => setHover({ x, y, date, price })}
              />
              <circle cx={x} cy={y} r={hover?.date === date ? 4.5 : 2.5} fill={color} />
            </g>
          ))}
          {hover && (
            <line x1={hover.x} y1={PAD} x2={hover.x} y2={H - PAD} stroke={color} strokeDasharray="3 3" strokeWidth="1" opacity="0.5" />
          )}
        </svg>
        {hover && (
          <div
            className="absolute -top-1 pointer-events-none bg-dark-bg text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap"
            style={{
              left: `${(hover.x / W) * 100}%`,
              transform: `translateX(${hover.x > W * 0.75 ? "-100%" : hover.x < W * 0.25 ? "0" : "-50%"})`,
            }}
          >
            {formatRs(hover.price, unit)}
            <span className="text-white/60 font-medium ml-1.5">{formatDateFull(hover.date)}</span>
          </div>
        )}
      </div>
      <div
        className="flex justify-between mt-1.5 text-[10px] text-gray-400 font-medium uppercase tracking-wide"
        style={{ paddingLeft: `${(PADL / W) * 100}%` }}
      >
        <span>{formatDate(first[0])}</span>
        {history.length > 4 && <span>{formatDate(mid[0])}</span>}
        <span>{formatDate(last[0])}</span>
      </div>
    </div>
  );
}
