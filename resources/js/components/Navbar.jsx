import { Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const LOGO = '/brand-logos/android-chrome-192x192.png';

const links = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Solutions', path: '/solutions' },
    { name: 'Projects', path: '/projects' },
    { name: 'Store', path: '/store' },
    { name: 'Contact Us', path: '/contact' },
];

export default function Navbar() {
    const { url } = usePage();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setOpen(false);
    }, [url]);

    const linkClass = (path) =>
        url === path
            ? 'font-bold text-[#D4F64D]'
            : 'font-bold text-white hover:text-[#D4F64D]';

    return (
        <>
            <header className="relative z-50 w-full px-4 pt-4 sm:px-6 lg:px-7">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <Link href="/" className="flex shrink-0 items-center gap-3">
                            <img
                                className="size-12 sm:size-14 lg:size-16 object-contain"
                                src={LOGO}
                                alt="Solarkon logo"
                            />
                            <div className="text-white flex flex-col justify-center">
                                <p className="text-xl font-extrabold tracking-tight sm:text-2xl lg:text-3xl leading-none">
                                    Solarkon
                                </p>
                                <p className="text-[10px] font-normal tracking-wide sm:text-xs mt-1 leading-none">
                                    Solar &amp; Green energy
                                </p>
                            </div>
                        </Link>
                    </div>

                    <nav
                        className="hidden items-center gap-6 lg:flex lg:gap-9"
                        aria-label="Primary navigation"
                    >
                        {links.map((item) => (
                            <Link
                                key={item.name}
                                href={item.path}
                                className={`text-lg transition-colors ${linkClass(item.path)}`}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    <div className="flex items-center gap-3">
                        <div className="relative hidden lg:inline-flex group items-center justify-center rounded-full p-[2px] overflow-hidden shadow-[0_0_20px_rgba(212,246,77,0.25)] transition-shadow hover:shadow-[0_0_30px_rgba(212,246,77,0.45)]">
                            <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,#10B981_30%,#D4F64D_50%,transparent_70%)] opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
                            <Link
                                href="/contact"
                                className="relative inline-flex h-full w-full items-center justify-center rounded-full bg-[#08100B] px-8 py-3 text-lg font-bold text-white transition-colors group-hover:bg-black/90 z-10"
                            >
                                Let&apos;s Talk Energy
                            </Link>
                        </div>

                        <button
                            type="button"
                            className="inline-flex size-11 items-center justify-center rounded-xl border border-white/30 text-white transition-all hover:bg-white/10 active:scale-95 lg:hidden"
                            aria-expanded={open}
                            aria-controls="mobile-nav"
                            aria-label={open ? 'Close menu' : 'Open menu'}
                            onClick={() => setOpen((prev) => !prev)}
                        >
                            <svg
                                className="size-6"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                aria-hidden="true"
                            >
                                {open ? (
                                    <path
                                        d="M6 6l12 12M18 6L6 18"
                                        strokeLinecap="round"
                                    />
                                ) : (
                                    <path
                                        d="M4 7h16M4 12h16M4 17h16"
                                        strokeLinecap="round"
                                    />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </header>

            {open && createPortal(
                <div className="fixed inset-0 z-[100] lg:hidden">
                    <div
                        className="absolute inset-0 bg-[#08100B]/60 backdrop-blur-md"
                        onClick={() => setOpen(false)}
                    />
                    <nav
                        id="mobile-nav"
                        className="absolute top-24 left-1/2 -translate-x-1/2 w-[90%] bg-black/40 backdrop-blur-2xl backdrop-saturate-200 border border-white/20 shadow-2xl shadow-black/50 rounded-[2.5rem] p-8 animate-in fade-in zoom-in-95 duration-300"
                        aria-label="Mobile navigation"
                    >
                        <div className="flex justify-end mb-4">
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                className="flex size-9 items-center justify-center rounded-full border border-white/30 text-white hover:bg-white/10 transition-colors"
                                aria-label="Close menu"
                            >
                                <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                                    <path d="M6 6l12 12M18 6L6 18" />
                                </svg>
                            </button>
                        </div>
                        <ul className="flex flex-col gap-5 text-center">
                            {links.map((item) => (
                                <li key={item.name}>
                                    <Link
                                        href={item.path}
                                        className={`block text-xl font-bold transition-colors drop-shadow-sm ${linkClass(item.path)}`}
                                        onClick={() => setOpen(false)}
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                            <li className="pt-6 mt-2 border-t border-white/10">
                                <div className="relative inline-flex w-full group items-center justify-center rounded-full p-[2px] overflow-hidden shadow-[0_0_20px_rgba(212,246,77,0.25)]">
                                    <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,#10B981_30%,#D4F64D_50%,transparent_70%)]" />
                                    <Link
                                        href="/contact"
                                        onClick={() => setOpen(false)}
                                        className="relative inline-flex w-full justify-center items-center bg-[#08100B] text-white px-8 py-4 rounded-full text-lg font-bold z-10"
                                    >
                                        Let&apos;s Talk Energy
                                    </Link>
                                </div>
                            </li>
                        </ul>
                    </nav>
                </div>,
                document.body
            )}
        </>
    );
}
