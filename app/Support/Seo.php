<?php

namespace App\Support;

use App\Models\Project;
use Illuminate\Support\Str;

/**
 * Central, server-side source of truth for all SEO metadata and structured
 * data (JSON-LD). This is what search engines and social scrapers actually
 * read on the first byte of every page, because the public site is an
 * Inertia SPA and crawlers should never have to execute JavaScript to see
 * the title, description, canonical URL, Open Graph tags or schema.
 *
 * The same array is:
 *   - shared to the Blade root template (rendered into <head> server-side), and
 *   - shared to Inertia as the `seo` prop (so client-side navigation can keep
 *     the tags in sync without producing duplicates).
 *
 * @see \App\Http\Middleware\HandleInertiaRequests::share()
 * @see resources/views/app.blade.php
 * @see resources/js/components/SEO.jsx
 */
class Seo
{
    public const SITE_NAME   = 'Solarkon';
    public const LEGAL_NAME  = 'Solarkon Private Limited';
    public const SITE_URL    = 'https://solarkon.org';
    public const DEFAULT_IMG = '/hero-image.webp';
    public const LOGO        = '/brand-logos/android-chrome-512x512.png';
    public const PHONE       = '+92-306-2935768';
    public const PHONE_ALT   = '+92-42-36449602';
    public const EMAIL       = 'info@solarkon.org';
    public const STREET      = '94-C J1 Johar Town, Phase 2';
    public const CITY        = 'Lahore';
    public const REGION      = 'Punjab';
    public const POSTAL      = '54000';
    public const COUNTRY     = 'PK';
    public const GEO_LAT     = '31.4697';
    public const GEO_LNG     = '74.2728';
    public const LOCALE      = 'en_PK';
    public const THEME_COLOR = '#F97316';

    /**
     * A broad, coherent keyword universe covering every service, system type,
     * sector, city and brand Solarkon works with. Used for the <meta keywords>
     * tag and to seed page-level keyword lists. Kept human-readable so it never
     * reads as spam.
     */
    public const GLOBAL_KEYWORDS = 'solar company in Pakistan, best solar company in Pakistan, solar panel installation, solar system installation, solar energy solutions, solar power system Pakistan, Solarkon, solar company Lahore, solar panels price in Pakistan, solar system price in Pakistan, residential solar, home solar system, commercial solar, industrial solar, agricultural solar, off grid solar system, on grid solar system, hybrid solar system, net metering Pakistan, solar net metering, solar financing, solar on installments, solar EMI, bank financed solar, power purchase agreement, PPA solar, rooftop solar, ground mounted solar, solar EPC, solar inverter, solar battery, lithium battery storage, solar panel, mono PERC solar panel, bifacial solar panel, K-Electric net metering, LESCO net metering, solar for factories, solar for mills, solar for homes, renewable energy Pakistan, clean energy, green energy Pakistan, MWp solar plant, KWp solar system, Trina Solar, JinkoSolar, LONGi, Canadian Solar, Huawei solar, GoodWe, Fronius, SMA, Voltronic, solar installation near me';

    /**
     * Human-readable service areas (drives areaServed schema + copy relevance).
     *
     * @var list<string>
     */
    public const SERVICE_AREAS = [
        'Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad',
        'Multan', 'Gujranwala', 'Sialkot', 'Sheikhupura', 'Kasur',
        'Okara', 'Sahiwal', 'Hattar', 'Punjab', 'Pakistan',
    ];

    /**
     * Blog posts live in the front-end data layer, but their canonical
     * metadata is mirrored here so crawlers get real per-article titles and
     * descriptions server-side (no JS execution required).
     *
     * @var array<string, array{title: string, description: string, date: string}>
     */
    public const BLOG = [
        'bashir-sons-5mwp-two-lender-financing' => [
            'title'       => "Inside Bashir Sons' 5 MWp Plant: How Two Lenders Powered One Project",
            'description' => 'One rooftop plant, two financing partners. Askari Bank funded 4 MWp and Parwaz Financial backed 1 MWp. See how Solarkon engineered, wired and energised all 5 MWp on Huawei inverters.',
            'date'        => '2026-07-01',
        ],
        'solar-financing-options-pakistan' => [
            'title'       => 'Self-Finance, Installments, Bank Loan or PPA: Which Solar Plan Fits You?',
            'description' => 'Four clear ways to fund your switch to solar in Pakistan — outright ownership, easy monthly installments, a bank-financed EMI, or a zero-investment Power Purchase Agreement. Compare the trade-offs.',
            'date'        => '2026-06-24',
        ],
        'off-grid-hybrid-on-grid-solar-systems' => [
            'title'       => 'Off-Grid vs Hybrid vs On-Grid: Which Solar System Is Right for You?',
            'description' => 'On-grid cuts bills through net metering, off-grid frees you from the grid with battery storage, and hybrid delivers both plus outage protection. Match the right solar system to your home, business or farm.',
            'date'        => '2026-06-16',
        ],
    ];

    /**
     * Build the complete SEO payload for a request path (as returned by
     * Illuminate\Http\Request::path(), i.e. '/' for the homepage, 'about',
     * 'projects/some-slug', etc.).
     *
     * @return array<string, mixed>
     */
    public static function forPath(string $path): array
    {
        $path = trim($path, '/');

        // Non-public areas must never be indexed.
        if ($path === '' ? false : Str::is(['admin*', 'portal*', 'api/*', 'media*', 'verify/*'], $path)) {
            return static::finalize([
                'title'       => static::title('Solarkon'),
                'description' => 'Solarkon — leading solar energy solutions in Pakistan.',
                'robots'      => 'noindex, nofollow',
                'path'        => $path,
                'schemas'     => [],
            ]);
        }

        return match (true) {
            $path === ''                        => static::home(),
            $path === 'about'                   => static::about(),
            $path === 'solutions'               => static::solutions(),
            $path === 'projects'                => static::projects(),
            $path === 'contact'                 => static::contact(),
            $path === 'store'                   => static::store(),
            Str::startsWith($path, 'projects/') => static::projectDetail(Str::after($path, 'projects/')),
            Str::startsWith($path, 'blog/')     => static::blogDetail(Str::after($path, 'blog/')),
            default                             => static::home(),
        };
    }

    // ---------------------------------------------------------------------
    // Per-page definitions
    // ---------------------------------------------------------------------

    private static function home(): array
    {
        return static::finalize([
            'title'       => 'Solarkon | #1 Solar Company in Pakistan – Solar Panel Installation',
            'description' => 'Solarkon Private Limited is Pakistan’s leading solar energy company, delivering residential, commercial, industrial & agricultural solar systems. 700+ installations, on-grid, off-grid & hybrid solutions, net metering & flexible financing. Get a free solar quote in Lahore.',
            'keywords'    => static::GLOBAL_KEYWORDS,
            'path'        => '',
            'breadcrumbs' => [['Home', static::SITE_URL]],
            'schemas'     => [
                static::organizationSchema(),
                static::websiteSchema(),
                static::localBusinessSchema(),
            ],
        ]);
    }

    private static function about(): array
    {
        return static::finalize([
            'title'       => 'About Solarkon | Pakistan’s Leading Solar Energy Company',
            'description' => 'Learn about Solarkon Private Limited — certified solar engineers behind 700+ installations and Pakistan’s largest 150MW solar project. Trusted residential, commercial, industrial & agricultural solar EPC across Pakistan.',
            'path'        => 'about',
            'breadcrumbs' => [['Home', static::SITE_URL], ['About', static::SITE_URL.'/about']],
            'schemas'     => [static::organizationSchema(), static::breadcrumbSchema([
                ['Home', static::SITE_URL], ['About', static::SITE_URL.'/about'],
            ])],
        ]);
    }

    private static function solutions(): array
    {
        return static::finalize([
            'title'       => 'Solar Solutions – Residential, Commercial, Industrial & Agricultural | Solarkon',
            'description' => 'Explore Solarkon’s solar solutions in Pakistan: on-grid, off-grid & hybrid systems for homes, businesses, factories and farms. Net metering, solar inverters, battery storage and flexible financing engineered by certified experts.',
            'path'        => 'solutions',
            'breadcrumbs' => [['Home', static::SITE_URL], ['Solutions', static::SITE_URL.'/solutions']],
            'schemas'     => array_merge(
                static::serviceSchemas(),
                [static::faqSchema(), static::breadcrumbSchema([
                    ['Home', static::SITE_URL], ['Solutions', static::SITE_URL.'/solutions'],
                ])],
            ),
        ]);
    }

    private static function projects(): array
    {
        return static::finalize([
            'title'       => 'Our Solar Projects & Installations in Pakistan | Solarkon',
            'description' => 'Browse Solarkon’s portfolio of completed solar projects across Pakistan — rooftop and ground-mounted plants from KWp to multi-MWp for steel mills, flour mills, pharma, food industry, schools and more. 700+ installations delivered.',
            'path'        => 'projects',
            'breadcrumbs' => [['Home', static::SITE_URL], ['Projects', static::SITE_URL.'/projects']],
            'schemas'     => [static::projectsItemListSchema(), static::breadcrumbSchema([
                ['Home', static::SITE_URL], ['Projects', static::SITE_URL.'/projects'],
            ])],
        ]);
    }

    private static function contact(): array
    {
        return static::finalize([
            'title'       => 'Contact Solarkon | Free Solar Quote & Consultation in Lahore, Pakistan',
            'description' => 'Contact Solarkon for a free solar consultation and quote in Pakistan. Call +92 306 2935768 or visit 94-C J1 Johar Town, Lahore. Residential, commercial, industrial & agricultural solar system installation.',
            'path'        => 'contact',
            'breadcrumbs' => [['Home', static::SITE_URL], ['Contact', static::SITE_URL.'/contact']],
            'schemas'     => [static::localBusinessSchema(), static::breadcrumbSchema([
                ['Home', static::SITE_URL], ['Contact', static::SITE_URL.'/contact'],
            ])],
        ]);
    }

    private static function store(): array
    {
        return static::finalize([
            'title'       => 'Solar Store – Buy Solar Panels, Inverters & Batteries in Pakistan | Solarkon',
            'description' => 'Shop genuine solar products at Solarkon: solar panels, inverters, lithium batteries and complete solar systems from Trina, JinkoSolar, LONGi, Canadian Solar, Huawei and GoodWe. Best solar prices in Pakistan with warranty.',
            'path'        => 'store',
            'breadcrumbs' => [['Home', static::SITE_URL], ['Store', static::SITE_URL.'/store']],
            'schemas'     => [static::storeSchema(), static::breadcrumbSchema([
                ['Home', static::SITE_URL], ['Store', static::SITE_URL.'/store'],
            ])],
        ]);
    }

    private static function projectDetail(string $slug): array
    {
        $project = Project::where('is_published', true)->where('slug', $slug)->first();

        if (! $project) {
            return static::projects();
        }

        $loc     = $project->location ? " in {$project->location}" : '';
        $title   = "{$project->title}{$loc} | Solarkon Solar Project";
        $desc    = $project->description
            ?: "See how Solarkon designed, installed and energised the {$project->title} solar project{$loc}. A proven solar installation delivering clean energy and lasting savings in Pakistan.";
        $image   = static::absoluteImage($project->img);

        return static::finalize([
            'title'       => $title,
            'description' => Str::limit(strip_tags($desc), 300),
            'path'        => 'projects/'.$slug,
            'image'       => $image,
            'type'        => 'article',
            'breadcrumbs' => [
                ['Home', static::SITE_URL],
                ['Projects', static::SITE_URL.'/projects'],
                [$project->title, static::SITE_URL.'/projects/'.$slug],
            ],
            'schemas'     => [
                static::projectSchema($project, $image),
                static::breadcrumbSchema([
                    ['Home', static::SITE_URL],
                    ['Projects', static::SITE_URL.'/projects'],
                    [$project->title, static::SITE_URL.'/projects/'.$slug],
                ]),
            ],
        ]);
    }

    private static function blogDetail(string $slug): array
    {
        $post = static::BLOG[$slug] ?? null;

        $title = $post['title'] ?? Str::headline($slug);
        $desc  = $post['description'] ?? 'Solar insights, guides and project stories from Solarkon — Pakistan’s leading solar energy company.';

        return static::finalize([
            'title'       => "{$title} | Solarkon Blog",
            'description' => $desc,
            'path'        => 'blog/'.$slug,
            'type'        => 'article',
            'breadcrumbs' => [
                ['Home', static::SITE_URL],
                ['Blog', static::SITE_URL.'/blog/'.$slug],
                [$title, static::SITE_URL.'/blog/'.$slug],
            ],
            'schemas'     => [
                static::articleSchema($slug, $title, $desc, $post['date'] ?? null),
                static::breadcrumbSchema([
                    ['Home', static::SITE_URL],
                    [$title, static::SITE_URL.'/blog/'.$slug],
                ]),
            ],
        ]);
    }

    // ---------------------------------------------------------------------
    // Structured data (JSON-LD) builders
    // ---------------------------------------------------------------------

    public static function organizationSchema(): array
    {
        return [
            '@context'    => 'https://schema.org',
            '@type'       => 'Organization',
            '@id'         => static::SITE_URL.'/#organization',
            'name'        => static::LEGAL_NAME,
            'alternateName' => static::SITE_NAME,
            'url'         => static::SITE_URL,
            'logo'        => static::SITE_URL.static::LOGO,
            'image'       => static::SITE_URL.static::DEFAULT_IMG,
            'description' => 'Pakistan’s leading solar energy solutions provider with 700+ installations across residential, commercial, industrial and agricultural sectors, including Pakistan’s largest 150MW solar project.',
            'telephone'   => static::PHONE,
            'email'       => static::EMAIL,
            'foundingLocation' => static::CITY.', Pakistan',
            'address'     => static::addressSchema(),
            'areaServed'  => static::SERVICE_AREAS,
            'contactPoint' => [
                '@type'             => 'ContactPoint',
                'telephone'         => static::PHONE,
                'contactType'       => 'sales',
                'areaServed'        => 'PK',
                'availableLanguage' => ['en', 'ur'],
            ],
            'sameAs' => [
                'https://www.facebook.com/solarkon',
                'https://www.instagram.com/solarkon',
                'https://www.linkedin.com/company/solarkon',
                'https://twitter.com/solarkon',
                'https://www.youtube.com/@solarkon',
            ],
        ];
    }

    public static function localBusinessSchema(): array
    {
        return [
            '@context'   => 'https://schema.org',
            '@type'      => ['LocalBusiness', 'SolarEnergyContractor'],
            '@id'        => static::SITE_URL.'/#localbusiness',
            'name'       => static::LEGAL_NAME,
            'image'      => static::SITE_URL.static::DEFAULT_IMG,
            'logo'       => static::SITE_URL.static::LOGO,
            'url'        => static::SITE_URL,
            'telephone'  => static::PHONE,
            'email'      => static::EMAIL,
            'priceRange' => '$$',
            'currenciesAccepted' => 'PKR',
            'address'    => static::addressSchema(),
            'geo'        => [
                '@type'     => 'GeoCoordinates',
                'latitude'  => static::GEO_LAT,
                'longitude' => static::GEO_LNG,
            ],
            'areaServed' => static::SERVICE_AREAS,
            'openingHoursSpecification' => [
                '@type'     => 'OpeningHoursSpecification',
                'dayOfWeek' => ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                'opens'     => '09:00',
                'closes'    => '18:00',
            ],
            'aggregateRating' => [
                '@type'       => 'AggregateRating',
                'ratingValue' => '4.9',
                'reviewCount' => '700',
            ],
        ];
    }

    public static function websiteSchema(): array
    {
        return [
            '@context'        => 'https://schema.org',
            '@type'           => 'WebSite',
            '@id'             => static::SITE_URL.'/#website',
            'url'             => static::SITE_URL,
            'name'            => static::SITE_NAME,
            'inLanguage'      => 'en-PK',
            'publisher'       => ['@id' => static::SITE_URL.'/#organization'],
            'potentialAction' => [
                '@type'       => 'SearchAction',
                'target'      => [
                    '@type'       => 'EntryPoint',
                    'urlTemplate' => static::SITE_URL.'/store?search={search_term_string}',
                ],
                'query-input' => 'required name=search_term_string',
            ],
        ];
    }

    private static function serviceSchemas(): array
    {
        $services = [
            ['Residential Solar Solutions', 'Home solar power systems that cut electricity bills for households across Pakistan with net metering and battery backup.'],
            ['Commercial Solar Solutions', 'Efficient commercial solar power systems that replace high-cost conventional energy for offices and businesses.'],
            ['Industrial Solar Solutions', 'High-capacity industrial solar systems for factories, mills and warehouses with heavy-load, stable energy and operational savings.'],
            ['Agricultural Solar Solutions', 'Reliable off-grid and solar solutions for irrigation, tube wells and farm operations that slash fuel and power costs.'],
        ];

        return array_map(fn ($s) => [
            '@context'    => 'https://schema.org',
            '@type'       => 'Service',
            'serviceType' => $s[0],
            'name'        => $s[0],
            'description' => $s[1],
            'provider'    => ['@id' => static::SITE_URL.'/#organization'],
            'areaServed'  => static::SERVICE_AREAS,
        ], $services);
    }

    private static function faqSchema(): array
    {
        $faqs = [
            ['How much does a solar system cost in Pakistan?', 'Solar system prices in Pakistan depend on size, brand and system type (on-grid, off-grid or hybrid). Solarkon offers free surveys, transparent quotes and flexible financing including installments, bank EMIs and PPAs.'],
            ['What is net metering and how does it lower my bill?', 'Net metering lets your on-grid solar system export surplus electricity to the utility grid (LESCO, K-Electric, etc.), offsetting your bill. Solarkon handles the complete net metering application and approval process.'],
            ['Which is better: on-grid, off-grid or hybrid solar?', 'On-grid is best for lowering bills through net metering, off-grid suits areas with unreliable grid access using batteries, and hybrid combines both with outage protection. Solarkon recommends the right system after a site survey.'],
            ['Do you install solar for homes, businesses and factories?', 'Yes. Solarkon delivers residential, commercial, industrial and agricultural solar systems across Pakistan, from small rooftop setups to multi-megawatt ground-mounted plants.'],
            ['Can I get solar on installments?', 'Yes. Solarkon offers self-finance, easy monthly installments, bank-financed EMI plans and zero-investment Power Purchase Agreements so you can go solar within your budget.'],
        ];

        return [
            '@context'   => 'https://schema.org',
            '@type'      => 'FAQPage',
            'mainEntity' => array_map(fn ($f) => [
                '@type'          => 'Question',
                'name'           => $f[0],
                'acceptedAnswer' => ['@type' => 'Answer', 'text' => $f[1]],
            ], $faqs),
        ];
    }

    private static function storeSchema(): array
    {
        return [
            '@context'   => 'https://schema.org',
            '@type'      => 'Store',
            'name'       => 'Solarkon Solar Store',
            'url'        => static::SITE_URL.'/store',
            'image'      => static::SITE_URL.static::DEFAULT_IMG,
            'telephone'  => static::PHONE,
            'priceRange' => '$$',
            'address'    => static::addressSchema(),
            'department' => ['Solar Panels', 'Solar Inverters', 'Solar Batteries', 'Complete Solar Systems'],
        ];
    }

    private static function projectsItemListSchema(): array
    {
        $projects = Project::where('is_published', true)->orderBy('order')->take(50)->get();

        return [
            '@context'        => 'https://schema.org',
            '@type'           => 'ItemList',
            'name'            => 'Solarkon Solar Projects in Pakistan',
            'numberOfItems'   => $projects->count(),
            'itemListElement' => $projects->values()->map(fn (Project $p, int $i) => [
                '@type'    => 'ListItem',
                'position' => $i + 1,
                'name'     => $p->title,
                'url'      => static::SITE_URL.'/projects/'.$p->slug,
            ])->all(),
        ];
    }

    private static function projectSchema(Project $project, string $image): array
    {
        return [
            '@context'    => 'https://schema.org',
            '@type'       => 'CreativeWork',
            'name'        => $project->title,
            'headline'    => $project->detail_title ?: $project->title,
            'description' => Str::limit(strip_tags($project->description ?? ''), 300),
            'image'       => $image,
            'url'         => static::SITE_URL.'/projects/'.$project->slug,
            'locationCreated' => $project->location
                ? ['@type' => 'Place', 'name' => $project->location]
                : null,
            'dateCreated' => $project->completion_date,
            'creator'     => ['@id' => static::SITE_URL.'/#organization'],
            'keywords'    => static::tagKeywords($project->tags),
        ];
    }

    /**
     * Tags may be stored as plain strings or as objects ({label, icon}).
     * Normalise them into a single comma-separated keyword string.
     */
    private static function tagKeywords($tags): ?string
    {
        if (! is_array($tags) || $tags === []) {
            return null;
        }

        $labels = array_filter(array_map(function ($tag) {
            if (is_string($tag)) {
                return $tag;
            }

            if (is_array($tag)) {
                return $tag['label'] ?? $tag['name'] ?? $tag['title'] ?? null;
            }

            return null;
        }, $tags));

        return $labels ? implode(', ', $labels) : null;
    }

    private static function articleSchema(string $slug, string $title, string $desc, ?string $date): array
    {
        return array_filter([
            '@context'         => 'https://schema.org',
            '@type'            => 'Article',
            'headline'         => $title,
            'description'      => $desc,
            'image'            => static::SITE_URL.static::DEFAULT_IMG,
            'url'              => static::SITE_URL.'/blog/'.$slug,
            'datePublished'    => $date,
            'inLanguage'       => 'en-PK',
            'author'           => ['@type' => 'Organization', 'name' => static::LEGAL_NAME],
            'publisher'        => ['@id' => static::SITE_URL.'/#organization'],
            'mainEntityOfPage' => static::SITE_URL.'/blog/'.$slug,
        ], fn ($v) => $v !== null);
    }

    public static function breadcrumbSchema(array $items): array
    {
        return [
            '@context'        => 'https://schema.org',
            '@type'           => 'BreadcrumbList',
            'itemListElement' => array_map(fn ($item, $i) => [
                '@type'    => 'ListItem',
                'position' => $i + 1,
                'name'     => $item[0],
                'item'     => $item[1],
            ], $items, array_keys($items)),
        ];
    }

    private static function addressSchema(): array
    {
        return [
            '@type'           => 'PostalAddress',
            'streetAddress'   => static::STREET,
            'addressLocality' => static::CITY,
            'addressRegion'   => static::REGION,
            'postalCode'      => static::POSTAL,
            'addressCountry'  => static::COUNTRY,
        ];
    }

    // ---------------------------------------------------------------------
    // Helpers
    // ---------------------------------------------------------------------

    /**
     * Normalise a per-page array into the full payload Blade + React consume.
     */
    private static function finalize(array $seo): array
    {
        $path      = trim($seo['path'] ?? '', '/');
        $canonical = static::SITE_URL.($path === '' ? '/' : '/'.$path);

        return array_merge([
            'siteName'    => static::SITE_NAME,
            'title'       => static::SITE_NAME,
            'description' => '',
            'keywords'    => static::GLOBAL_KEYWORDS,
            'canonical'   => $canonical,
            'image'       => static::absoluteImage(static::DEFAULT_IMG),
            'type'        => 'website',
            'robots'      => 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
            'locale'      => static::LOCALE,
            'themeColor'  => static::THEME_COLOR,
            'schemas'     => [],
        ], $seo, ['canonical' => $canonical]);
    }

    /**
     * Resolve any stored image reference to an absolute, crawlable URL.
     */
    public static function absoluteImage(?string $img): string
    {
        if (! $img) {
            return static::SITE_URL.static::DEFAULT_IMG;
        }

        if (Str::startsWith($img, ['http://', 'https://'])) {
            return $img;
        }

        return static::SITE_URL.'/'.ltrim($img, '/');
    }

    private static function title(string $t): string
    {
        return $t;
    }

    /**
     * All public, indexable URLs — consumed by the sitemap generator.
     *
     * @return list<array{loc: string, changefreq: string, priority: string, lastmod?: string}>
     */
    public static function sitemapUrls(): array
    {
        $urls = [
            ['loc' => static::SITE_URL.'/',          'changefreq' => 'weekly',  'priority' => '1.0'],
            ['loc' => static::SITE_URL.'/about',     'changefreq' => 'monthly', 'priority' => '0.8'],
            ['loc' => static::SITE_URL.'/solutions', 'changefreq' => 'monthly', 'priority' => '0.9'],
            ['loc' => static::SITE_URL.'/projects',  'changefreq' => 'weekly',  'priority' => '0.9'],
            ['loc' => static::SITE_URL.'/store',     'changefreq' => 'weekly',  'priority' => '0.9'],
            ['loc' => static::SITE_URL.'/contact',   'changefreq' => 'yearly',  'priority' => '0.7'],
        ];

        foreach (Project::where('is_published', true)->orderBy('order')->get() as $project) {
            $urls[] = [
                'loc'        => static::SITE_URL.'/projects/'.$project->slug,
                'changefreq' => 'monthly',
                'priority'   => '0.7',
                'lastmod'    => optional($project->updated_at)->toAtomString(),
            ];
        }

        foreach (static::BLOG as $slug => $post) {
            $urls[] = [
                'loc'        => static::SITE_URL.'/blog/'.$slug,
                'changefreq' => 'monthly',
                'priority'   => '0.6',
                'lastmod'    => $post['date'].'T00:00:00+05:00',
            ];
        }

        return $urls;
    }
}
