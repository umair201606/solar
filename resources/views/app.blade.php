<!DOCTYPE html>
@php($seo = $seo ?? \App\Support\Seo::forPath(request()->path()))
<html lang="en-PK" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        {{-- Primary SEO meta (server-rendered so crawlers & social scrapers get it on the first byte) --}}
        <title>{{ $seo['title'] }}</title>
        <meta name="description" content="{{ $seo['description'] }}">
        <meta name="keywords" content="{{ $seo['keywords'] }}">
        <meta name="robots" content="{{ $seo['robots'] }}">
        <meta name="googlebot" content="{{ $seo['robots'] }}">
        <meta name="author" content="Solarkon Private Limited">
        <meta name="publisher" content="Solarkon Private Limited">
        <meta name="theme-color" content="{{ $seo['themeColor'] }}">
        <link rel="canonical" href="{{ $seo['canonical'] }}">

        {{-- Localisation / geo signals --}}
        <link rel="alternate" hreflang="en-pk" href="{{ $seo['canonical'] }}">
        <link rel="alternate" hreflang="x-default" href="{{ $seo['canonical'] }}">
        <meta name="geo.region" content="PK-PB">
        <meta name="geo.placename" content="Lahore, Pakistan">
        <meta name="geo.position" content="31.4697;74.2728">
        <meta name="ICBM" content="31.4697, 74.2728">

        {{-- Open Graph (Facebook, LinkedIn, WhatsApp) --}}
        <meta property="og:type" content="{{ $seo['type'] }}">
        <meta property="og:site_name" content="{{ $seo['siteName'] }}">
        <meta property="og:title" content="{{ $seo['title'] }}">
        <meta property="og:description" content="{{ $seo['description'] }}">
        <meta property="og:url" content="{{ $seo['canonical'] }}">
        <meta property="og:image" content="{{ $seo['image'] }}">
        <meta property="og:image:alt" content="{{ $seo['title'] }}">
        <meta property="og:locale" content="{{ $seo['locale'] }}">

        {{-- Twitter / X card --}}
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:site" content="@solarkon">
        <meta name="twitter:title" content="{{ $seo['title'] }}">
        <meta name="twitter:description" content="{{ $seo['description'] }}">
        <meta name="twitter:image" content="{{ $seo['image'] }}">

        {{-- Structured data (JSON-LD) --}}
        @foreach ($seo['schemas'] as $schema)
        <script type="application/ld+json">{!! json_encode($schema, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) !!}</script>
        @endforeach

        <link rel="icon" type="image/x-icon" href="/favicon.ico">
        <link rel="icon" type="image/png" sizes="32x32" href="/brand-logos/favicon-32x32.png">
        <link rel="icon" type="image/png" sizes="16x16" href="/brand-logos/favicon-16x16.png">
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
        <link rel="manifest" href="/site.webmanifest">

        <link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/>
        <link href="https://fonts.googleapis.com" rel="preconnect"/>
       <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&amp;display=swap" rel="stylesheet"/>
       <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>

        <!-- Google tag (gtag.js) -->
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-3B82DP85X3"></script>
        <script>
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-3B82DP85X3');
        </script>

        @fonts

        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.jsx'])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        <x-inertia::app />
    </body>
</html>
