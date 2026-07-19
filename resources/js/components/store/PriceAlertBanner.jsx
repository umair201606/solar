import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, X, Check, Loader2 } from "lucide-react";
import axios from "axios";
import { pushSupported, notificationPermission, subscribe } from "../../lib/pushAlerts";

const DISMISS_KEY = "solarkon_price_alert_dismissed";
const DISMISS_DAYS = 7;
const PHASES = ["All", "Single Phase", "Three Phase"];

function recentlyDismissed() {
  const ts = Number(localStorage.getItem(DISMISS_KEY) || 0);
  return ts && Date.now() - ts < DISMISS_DAYS * 864e5;
}

/**
 * Pop-up banner (Home + Store) inviting visitors to get a web push when prices
 * change on products matching filters they choose. Styled to match the store's
 * emerald product UI.
 */
export default function PriceAlertBanner() {
  const [config, setConfig] = useState(null);
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);

  // "all" = every price change; "custom" = only the picked filters. Opens on
  // "custom" so the (fully pre-selected) filters are visible to narrow down.
  const [mode, setMode] = useState("custom");
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [phase, setPhase] = useState("All");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [status, setStatus] = useState("idle"); // idle | saving | done | denied | error

  useEffect(() => {
    // Show for anyone who can receive push and hasn't already opted in or
    // dismissed recently. Note: we do NOT touch the service worker here — that
    // happens only when they click Enable, so nothing can block the banner.
    if (!pushSupported() || recentlyDismissed() || notificationPermission() === "granted") return;

    let alive = true;
    axios
      .get("/api/store/alerts/config")
      .then(({ data }) => {
        if (!alive || !data?.enabled) return;
        setConfig(data);
        // Start with everything selected; the visitor narrows by unchecking.
        setCategories(data.categories || []);
        setBrands(data.brands || []);
        setTimeout(() => alive && setVisible(true), 2000);
      })
      .catch(() => {});

    return () => {
      alive = false;
    };
  }, []);

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setVisible(false);
    setOpen(false);
  };

  const toggle = (list, setList, value) =>
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

  const enable = async () => {
    setStatus("saving");
    const filters =
      mode === "all"
        ? {}
        : {
            categories,
            brands,
            phase,
            price_min: priceMin === "" ? null : Number(priceMin),
            price_max: priceMax === "" ? null : Number(priceMax),
          };
    try {
      await subscribe(filters, config.public_key);
      setStatus("done");
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
      setTimeout(() => {
        setVisible(false);
        setOpen(false);
      }, 1800);
    } catch (e) {
      setStatus(e?.message === "denied" ? "denied" : "error");
    }
  };

  if (!config) return null;

  return (
    <>
      {/* --- slide-up banner --- */}
      <AnimatePresence>
        {visible && !open && (
          <motion.div
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 120, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className="fixed bottom-4 inset-x-4 sm:inset-x-auto sm:right-6 sm:max-w-md z-[60]"
          >
            <div className="flex items-center gap-4 bg-white rounded-2xl border border-gray-200 shadow-2xl p-4 pr-3">
              <div className="grid place-items-center w-11 h-11 shrink-0 rounded-xl bg-emerald-600/10 text-emerald-600">
                <Bell className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-black text-gray-900">Track solar prices</p>
                <p className="text-xs text-gray-500 leading-snug">
                  Get notified the moment prices change on the products you care about.
                </p>
              </div>
              <button
                onClick={() => setOpen(true)}
                className="shrink-0 px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 transition"
              >
                Set alerts
              </button>
              <button
                onClick={dismiss}
                aria-label="Dismiss"
                className="shrink-0 p-1.5 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- filter modal --- */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] grid place-items-end sm:place-items-center bg-black/40 backdrop-blur-sm p-0 sm:p-4"
            onClick={dismiss}
          >
            <motion.div
              initial={{ y: 60, opacity: 0.6 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[92vh] overflow-y-auto"
            >
              {/* header */}
              <div className="flex items-center gap-3 p-5 border-b border-gray-100 sticky top-0 bg-white rounded-t-3xl">
                <div className="grid place-items-center w-10 h-10 rounded-xl bg-emerald-600/10 text-emerald-600">
                  <Bell className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-black text-gray-900">Price change alerts</h3>
                  <p className="text-xs text-gray-500">We'll notify you when matching prices move.</p>
                </div>
                <button onClick={dismiss} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {status === "done" ? (
                <div className="p-10 text-center">
                  <div className="mx-auto grid place-items-center w-14 h-14 rounded-full bg-emerald-600 text-white mb-4">
                    <Check className="w-7 h-7" />
                  </div>
                  <p className="text-lg font-black text-gray-900">You're all set!</p>
                  <p className="text-sm text-gray-500">We'll ping you when prices change.</p>
                </div>
              ) : (
                <div className="p-5 space-y-5">
                  {/* mode toggle */}
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      ["all", "All price changes"],
                      ["custom", "Choose filters"],
                    ].map(([val, label]) => (
                      <button
                        key={val}
                        onClick={() => setMode(val)}
                        className={`px-4 py-3 rounded-2xl text-sm font-bold border transition ${
                          mode === val
                            ? "bg-emerald-600 text-white border-emerald-600"
                            : "bg-white text-gray-700 border-gray-200 hover:border-emerald-600"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>

                  {mode === "custom" && (
                    <div className="space-y-5">
                      <FilterGroup
                        label="Categories"
                        options={config.categories}
                        selected={categories}
                        onToggle={(v) => toggle(categories, setCategories, v)}
                        onAll={() => setCategories(config.categories || [])}
                        onNone={() => setCategories([])}
                      />
                      <FilterGroup
                        label="Brands"
                        options={config.brands}
                        selected={brands}
                        onToggle={(v) => toggle(brands, setBrands, v)}
                        onAll={() => setBrands(config.brands || [])}
                        onNone={() => setBrands([])}
                      />
                      <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Phase</p>
                        <div className="flex gap-2">
                          {PHASES.map((p) => (
                            <button
                              key={p}
                              onClick={() => setPhase(p)}
                              className={`px-3 py-2 rounded-xl text-xs font-bold border transition ${
                                phase === p
                                  ? "bg-emerald-600 text-white border-emerald-600"
                                  : "bg-white text-gray-600 border-gray-200 hover:border-emerald-600"
                              }`}
                            >
                              {p}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                          Price range (PKR)
                        </p>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            inputMode="numeric"
                            placeholder="Min"
                            value={priceMin}
                            onChange={(e) => setPriceMin(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
                          />
                          <span className="text-gray-400">–</span>
                          <input
                            type="number"
                            inputMode="numeric"
                            placeholder="Max"
                            value={priceMax}
                            onChange={(e) => setPriceMax(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {status === "denied" && (
                    <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">
                      Notifications are blocked. Please enable them for this site in your browser
                      settings, then try again.
                    </p>
                  )}
                  {status === "error" && (
                    <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">
                      Something went wrong. Please try again.
                    </p>
                  )}

                  <button
                    onClick={enable}
                    disabled={status === "saving"}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl bg-emerald-600 text-white text-sm font-black hover:bg-emerald-700 transition disabled:opacity-60"
                  >
                    {status === "saving" ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Enabling…
                      </>
                    ) : (
                      <>
                        <Bell className="w-4 h-4" /> Enable notifications
                      </>
                    )}
                  </button>
                  <p className="text-[11px] text-center text-gray-400">
                    You can turn these off anytime from your browser.
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function FilterGroup({ label, options, selected, onToggle, onAll, onNone }) {
  if (!options?.length) return null;
  const allOn = selected.length === options.length;
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">
          {label}
          <span className="ml-1.5 text-gray-400 normal-case font-semibold">
            ({selected.length}/{options.length})
          </span>
        </p>
        <button
          onClick={allOn ? onNone : onAll}
          className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
        >
          {allOn ? "Clear" : "Select all"}
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const on = selected.includes(opt);
          return (
            <button
              key={opt}
              onClick={() => onToggle(opt)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold border transition ${
                on
                  ? "bg-emerald-600 text-white border-emerald-600"
                  : "bg-white text-gray-600 border-gray-200 hover:border-emerald-600"
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
