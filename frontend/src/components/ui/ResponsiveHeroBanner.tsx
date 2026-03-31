"use client";

import React, { useState } from 'react';

interface NavLink {
    label: string;
    href: string;
    isActive?: boolean;
}

interface Partner {
    logoUrl: string;
    href: string;
}

interface ResponsiveHeroBannerProps {
    logoUrl?: string;
    backgroundImageUrl?: string;
    navLinks?: NavLink[];
    ctaButtonText?: string;
    ctaButtonHref?: string;
    badgeText?: string;
    badgeLabel?: string;
    title?: string;
    titleLine2?: string;
    description?: string;
    primaryButtonText?: string;
    primaryButtonHref?: string;
    secondaryButtonText?: string;
    secondaryButtonHref?: string;
    partners?: Partner[];
    onLogout?: () => void;
    onPrimaryAction?: () => void;
}

const ResponsiveHeroBanner: React.FC<ResponsiveHeroBannerProps> = ({
    logoUrl = "https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/febf2421-4a9a-42d6-871d-ff4f9518021c_1600w.png",
    backgroundImageUrl = "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=2013",
    navLinks = [
        { label: "Dashboard", href: "#", isActive: true },
        { label: "Loan Matching", href: "#" },
        { label: "Agent Reports", href: "#" },
        { label: "Trust Engine", href: "#" },
        { label: "Support", href: "#" }
    ],
    ctaButtonText = "Check Limit",
    ctaButtonHref = "#",
    badgeLabel = "NOBLE CAUSE",
    badgeText = "Empowering Bharat's Financial Future",
    title = "BharosaCredit",
    titleLine2 = "Aadhaar to Prosperity",
    description = "Experience financial inclusion like never before. Our advanced 7-agent pipeline makes credit matching accessible, transparent, and immediate for every citizen.",
    primaryButtonText = "Start Assessment",
    primaryButtonHref = "#",
    secondaryButtonText = "Watch Mission",
    secondaryButtonHref = "#",
    partnersTitle = "Supported by Banks",
    partners = [
        { logoUrl: "https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/f7466370-2832-4fdd-84c2-0932bb0dd850_800w.png", href: "#" },
        { logoUrl: "https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/0a9a71ec-268b-4689-a510-56f57e9d4f13_1600w.png", href: "#" },
        { logoUrl: "https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/a9ed4369-748a-49f8-9995-55d6c876bbff_1600w.png", href: "#" },
        { logoUrl: "https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/0d8966a4-8525-4e11-9d5d-2d7390b2c798_1600w.png", href: "#" },
        { logoUrl: "https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/2ed33c8b-b8b2-4176-967f-3d785fed07d8_1600w.png", href: "#" }
    ],
    onLogout,
    onPrimaryAction
}) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <section className="w-full isolate min-h-[90vh] overflow-hidden relative">
            <img
                src={backgroundImageUrl}
                alt=""
                className="w-full h-full object-cover absolute top-0 right-0 bottom-0 left-0 opacity-40 scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#020408]/80 via-[#020408]/40 to-[#020408]" />
            <div className="pointer-events-none absolute inset-0 ring-1 ring-black/30" />

            <header className="z-10 xl:top-4 relative">
                <div className="mx-6 sm:mx-10 lg:mx-20">
                    <div className="flex items-center justify-between pt-4">
                        <div className="flex items-center gap-2">
                             <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-xl">B</span>
                             </div>
                             <span className="text-white font-bold text-xl tracking-tight">BharosaCredit</span>
                        </div>

                        <nav className="hidden md:flex items-center gap-2">
                            <div className="flex items-center gap-1 rounded-full bg-white/5 px-1 py-1 ring-1 ring-white/10 backdrop-blur">
                                {navLinks.map((link, index) => (
                                    <a
                                        key={index}
                                        href={link.href}
                                        className={`px-3 py-2 text-sm font-medium hover:text-white font-sans transition-colors ${link.isActive ? 'text-white/90' : 'text-white/80'
                                            }`}
                                    >
                                        {link.label}
                                    </a>
                                ))}
                                <button
                                    onClick={onLogout}
                                    className="ml-1 inline-flex items-center gap-2 rounded-full bg-emerald-500 px-3.5 py-2 text-sm font-medium text-white hover:bg-emerald-400 font-sans transition-colors"
                                >
                                    Log Out
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                        <polyline points="16 17 21 12 16 7" />
                                        <line x1="21" y1="12" x2="9" y2="12" />
                                    </svg>
                                </button>
                            </div>
                        </nav>

                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15 backdrop-blur"
                            aria-expanded={mobileMenuOpen}
                            aria-label="Toggle menu"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-white/90">
                                <path d="M4 5h16" />
                                <path d="M4 12h16" />
                                <path d="M4 19h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </header>

            <div className="z-10 relative">
                <div className="sm:pt-20 md:pt-24 lg:pt-32 w-full pt-20 px-10 sm:px-16 lg:px-24 pb-16">
                    <div className="mx-auto max-w-3xl text-center">
                        <div className="mb-6 inline-flex items-center gap-3 rounded-full bg-emerald-500/10 px-2.5 py-2 ring-1 ring-emerald-500/20 backdrop-blur animate-fade-slide-in-1">
                            <span className="inline-flex items-center text-[10px] font-bold tracking-wider text-white bg-emerald-500 rounded-full py-0.5 px-2 font-sans uppercase">
                                {badgeLabel}
                            </span>
                            <span className="text-sm font-medium text-emerald-400 font-sans">
                                {badgeText}
                            </span>
                        </div>

                        <h1 className="sm:text-5xl md:text-6xl lg:text-7xl leading-tight text-4xl text-white tracking-tight font-serif font-normal animate-fade-slide-in-2">
                            {title}
                            <br className="hidden sm:block" />
                            {titleLine2}
                        </h1>

                        <p className="sm:text-lg animate-fade-slide-in-3 text-base text-white/70 max-w-2xl mt-6 mx-auto leading-relaxed">
                            {description}
                        </p>

                        <div className="flex flex-col sm:flex-row sm:gap-4 mt-10 gap-3 items-center justify-center animate-fade-slide-in-4">
                            <button
                                onClick={onPrimaryAction}
                                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-sm font-bold text-white rounded-full py-4 px-8 font-sans transition-all shadow-xl shadow-emerald-500/20"
                            >
                                {primaryButtonText}
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                                    <path d="M5 12h14" />
                                    <path d="m12 5 7 7-7 7" />
                                </svg>
                            </button>
                            <a
                                href={secondaryButtonHref}
                                className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-8 py-4 text-sm font-bold text-white hover:bg-white/10 font-sans transition-all"
                            >
                                {secondaryButtonText}
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                                    <path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    <div className="mx-auto mt-20 max-w-screen-2xl overflow-hidden relative">
                        <p className="animate-fade-slide-in-1 text-[10px] font-bold tracking-[0.3em] text-white/40 text-center uppercase mb-8">
                            {partnersTitle}
                        </p>
                        
                        {/* Infinite Marquee Container */}
                        <div className="relative flex overflow-hidden group">
                           <div className="flex animate-[marquee_40s_linear_infinite] whitespace-nowrap gap-12 items-center">
                              {[
                                "Axis Bank", "Bandhan Bank", "Bank of Baroda", "Bank of India", 
                                "Canara Bank", "Central Bank of India", "City Union Bank", "Federal Bank",
                                "HDFC Bank", "ICICI Bank", "IDFC FIRST Bank", "Indian Bank", 
                                "IndusInd Bank", "Karnataka Bank", "Kotak Mahindra Bank", "Punjab National Bank", 
                                "RBL Bank", "State Bank of India", "South Indian Bank", "UCO Bank", 
                                "Union Bank of India", "YES Bank"
                              ].map((bank, index) => {
                                const slug = bank.toLowerCase().replace(/ /g, '-');
                                const logoUrl = `https://cdn.jsdelivr.net/gh/planetabhi/banks-in-india@main/logos/${slug}.png`;
                                
                                return (
                                  <div key={index} className="flex items-center gap-3 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer group/bank">
                                     <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center overflow-hidden border border-white/10 group-hover/bank:border-emerald-500/50 transition-all">
                                        <img 
                                          src={logoUrl} 
                                          alt={bank}
                                          className="w-full h-full object-contain p-1.5"
                                          onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.style.display = 'none';
                                            const parent = target.parentElement;
                                            if (parent) {
                                              parent.innerHTML = `<span class="text-white/40 font-bold text-lg">${bank[0]}</span>`;
                                            }
                                          }}
                                        />
                                     </div>
                                     <span className="font-bold text-sm tracking-tight text-white/60 group-hover/bank:text-white transition-colors">{bank.toUpperCase()}</span>
                                  </div>
                                );
                              })}
                              {/* Mirror copy for infinite loop */}
                              {[
                                "Axis Bank", "Bandhan Bank", "Bank of Baroda", "Bank of India", 
                                "Canara Bank", "Central Bank of India", "City Union Bank", "Federal Bank",
                                "HDFC Bank", "ICICI Bank", "IDFC FIRST Bank", "Indian Bank", 
                                "IndusInd Bank", "Karnataka Bank", "Kotak Mahindra Bank", "Punjab National Bank", 
                                "RBL Bank", "State Bank of India", "South Indian Bank", "UCO Bank", 
                                "Union Bank of India", "YES Bank"
                              ].map((bank, index) => {
                                const slug = bank.toLowerCase().replace(/ /g, '-');
                                const logoUrl = `https://cdn.jsdelivr.net/gh/planetabhi/banks-in-india@main/logos/${slug}.png`;
                                
                                return (
                                  <div key={`mirror-${index}`} className="flex items-center gap-3 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer group/bank">
                                     <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center overflow-hidden border border-white/10 group-hover/bank:border-emerald-500/50 transition-all">
                                        <img 
                                          src={logoUrl} 
                                          alt={bank}
                                          className="w-full h-full object-contain p-1.5"
                                          onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.style.display = 'none';
                                            const parent = target.parentElement;
                                            if (parent) {
                                              parent.innerHTML = `<span class="text-white/40 font-bold text-lg">${bank[0]}</span>`;
                                            }
                                          }}
                                        />
                                     </div>
                                     <span className="font-bold text-sm tracking-tight text-white/60 group-hover/bank:text-white transition-colors">{bank.toUpperCase()}</span>
                                  </div>
                                );
                              })}
                           </div>

                           {/* Fading Edges Overlay */}
                           <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#020408] to-transparent z-10" />
                           <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#020408] to-transparent z-10" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ResponsiveHeroBanner;
