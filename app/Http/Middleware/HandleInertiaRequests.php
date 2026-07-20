<?php

namespace App\Http\Middleware;

use App\Models\Project;
use App\Support\Seo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\View;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $isAdmin = $request->is('admin*') || $request->is('api/*') || $request->is('media*');

        // Build the SEO payload once and expose it two ways:
        //  - View::share() renders it into the Blade <head> server-side, so
        //    crawlers and social scrapers get real tags on the first byte.
        //  - the `seo` Inertia prop lets the client SEO component keep those
        //    same tags in sync during SPA navigation (without duplicating them).
        $seo = Seo::forPath($request->path());
        View::share('seo', $seo);

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'seo' => $seo,
            'auth' => [
                'user' => $request->user(),
            ],
            // Published projects power the public site (home, /projects, detail).
            // Skipped for admin/api requests to avoid needless queries.
            'projects' => $isAdmin ? [] : fn () => Project::where('is_published', true)
                ->orderBy('order')
                ->get()
                ->map(fn (Project $p) => $p->toFrontend())
                ->all(),
        ];
    }
}
