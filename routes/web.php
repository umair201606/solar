<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\MediaController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CertificateController;
use App\Http\Controllers\StoreController;
use App\Http\Controllers\CatalogController;
use App\Http\Controllers\LeadController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\ProductImportExportController;
use App\Http\Controllers\CrmController;
use App\Http\Controllers\ClientPortalController;
use App\Http\Controllers\PriceAlertController;

// Public routes
Route::inertia('/', 'Home')->name('home');
Route::inertia('/projects', 'Projects')->name('projects');
Route::get('/projects/{slug}', fn (string $slug) => Inertia::render('ProjectDetail', ['slug' => $slug]))->name('projects.show');
Route::inertia('/about', 'About')->name('about');
Route::inertia('/contact', 'Contact')->name('contact');
Route::inertia('/solutions', 'Solutions')->name('solutions');
Route::inertia('/store', 'Store')->name('store');
Route::get('/blog/{slug}', fn (string $slug) => Inertia::render('BlogDetail', ['slug' => $slug]))->name('blog.show');

// Public store API
Route::get('/api/store/products', [StoreController::class, 'products'])->name('api.store.products');
Route::post('/api/store/products/{product}/contact-click', [StoreController::class, 'contactClick'])->name('api.store.contact');
Route::post('/api/store/track', [StoreController::class, 'track'])->name('api.store.track');

// Public price-alert push subscriptions (store visitors opt in with filters)
Route::get('/api/store/alerts/config', [PriceAlertController::class, 'config'])->name('api.store.alerts.config');
Route::post('/api/store/alerts/subscribe', [PriceAlertController::class, 'subscribe'])->name('api.store.alerts.subscribe');
Route::post('/api/store/alerts/unsubscribe', [PriceAlertController::class, 'unsubscribe'])->name('api.store.alerts.unsubscribe');

// Public certificate verification (QR code target) + PDF download
Route::get('/verify/{uuid}', [CertificateController::class, 'verify'])->name('certificate.verify');
Route::get('/verify/{uuid}/download', [CertificateController::class, 'download'])->name('certificate.download');

// Client portal (not linked from the public site — URL is shared directly)
Route::get('/portal/login', fn () => Inertia::render('portal/Login'))->name('portal.login');
Route::post('/portal/login', [ClientPortalController::class, 'login'])->name('portal.login.post');
Route::post('/portal/logout', [ClientPortalController::class, 'logout'])->name('portal.logout');

Route::middleware('auth:client')->group(function () {
    Route::get('/api/portal/projects', [ClientPortalController::class, 'projects'])->name('api.portal.projects');
    Route::get('/api/portal/projects/{id}', [ClientPortalController::class, 'project'])->name('api.portal.projects.show');

    // Portal SPA entry (after the login route so it doesn't shadow it)
    Route::get('/portal/{any?}', fn () => Inertia::render('portal/PortalApp'))->where('any', '.*')->name('portal');
});

// Admin login
Route::get('/admin/login', fn () => Inertia::render('admin/Login'))->name('admin.login');
Route::post('/admin/login', [AuthController::class, 'login'])->name('admin.login.post');
Route::post('/admin/logout', [AuthController::class, 'logout'])->name('admin.logout');

// Admin protected routes
Route::middleware('auth')->group(function () {

    // Admin SPA entry
    Route::get('/admin/{any?}', function () {
        return Inertia::render('admin/AdminApp');
    })->where('any', '.*');

    // Media API
    Route::get('/media', [MediaController::class, 'index'])->name('media.index');
    Route::post('/media/upload', [MediaController::class, 'store'])->name('media.store');
    Route::delete('/media/{id}', [MediaController::class, 'destroy'])->name('media.destroy');

    // Projects API
    Route::get('/api/projects', [ProjectController::class, 'index'])->name('api.projects.index');
    Route::post('/api/projects', [ProjectController::class, 'store'])->name('api.projects.store');
    Route::get('/api/projects/{project}', [ProjectController::class, 'show'])->name('api.projects.show');
    Route::put('/api/projects/{project}', [ProjectController::class, 'update'])->name('api.projects.update');
    Route::delete('/api/projects/{project}', [ProjectController::class, 'destroy'])->name('api.projects.destroy');

    // Product import/export (before {product} routes so paths don't collide)
    Route::get('/api/products/template', [ProductImportExportController::class, 'template'])->name('api.products.template');
    Route::post('/api/products/import/check', [ProductImportExportController::class, 'checkExists'])->name('api.products.import.check');
    Route::post('/api/products/import/preview', [ProductImportExportController::class, 'importPreview'])->name('api.products.import.preview');
    Route::post('/api/products/import/commit', [ProductImportExportController::class, 'importCommit'])->name('api.products.import.commit');
    Route::get('/api/products/export', [ProductImportExportController::class, 'export'])->name('api.products.export');

    // Product price history
    Route::get('/api/products/{product}/prices', [ProductController::class, 'prices'])->name('api.products.prices');
    Route::post('/api/products/{product}/prices', [ProductController::class, 'addPrice'])->name('api.products.prices.add');
    Route::put('/api/products/{product}/prices/{priceId}', [ProductController::class, 'updatePrice'])->name('api.products.prices.update');
    Route::delete('/api/products/{product}/prices/{priceId}', [ProductController::class, 'deletePrice'])->name('api.products.prices.delete');

    // Categories & brands
    Route::get('/api/catalog', [CatalogController::class, 'index'])->name('api.catalog.index');
    Route::post('/api/categories', [CatalogController::class, 'storeCategory'])->name('api.categories.store');
    Route::put('/api/categories/{category}', [CatalogController::class, 'updateCategory'])->name('api.categories.update');
    Route::delete('/api/categories/{category}', [CatalogController::class, 'destroyCategory'])->name('api.categories.destroy');
    Route::post('/api/brands', [CatalogController::class, 'storeBrand'])->name('api.brands.store');
    Route::put('/api/brands/{brand}', [CatalogController::class, 'updateBrand'])->name('api.brands.update');
    Route::delete('/api/brands/{brand}', [CatalogController::class, 'destroyBrand'])->name('api.brands.destroy');

    // CRM: clients, client projects, insights
    Route::get('/api/crm/dashboard', [CrmController::class, 'dashboard'])->name('api.crm.dashboard');
    Route::get('/api/crm/clients', [CrmController::class, 'clients'])->name('api.crm.clients');
    Route::post('/api/crm/clients', [CrmController::class, 'storeClient'])->name('api.crm.clients.store');
    Route::put('/api/crm/clients/{client}', [CrmController::class, 'updateClient'])->name('api.crm.clients.update');
    Route::delete('/api/crm/clients/{client}', [CrmController::class, 'destroyClient'])->name('api.crm.clients.destroy');
    Route::get('/api/crm/projects', [CrmController::class, 'projects'])->name('api.crm.projects');
    Route::post('/api/crm/projects', [CrmController::class, 'storeProject'])->name('api.crm.projects.store');
    Route::get('/api/crm/projects/{crmProject}', [CrmController::class, 'showProject'])->name('api.crm.projects.show');
    Route::put('/api/crm/projects/{crmProject}', [CrmController::class, 'updateProject'])->name('api.crm.projects.update');
    Route::delete('/api/crm/projects/{crmProject}', [CrmController::class, 'destroyProject'])->name('api.crm.projects.destroy');

    // Price-alert push admin: subscriber stats, send-now button, schedule settings
    Route::get('/api/push/alerts', [PriceAlertController::class, 'adminIndex'])->name('api.push.alerts');
    Route::put('/api/push/alerts', [PriceAlertController::class, 'adminUpdate'])->name('api.push.alerts.update');
    Route::post('/api/push/alerts/send', [PriceAlertController::class, 'adminSend'])->name('api.push.alerts.send');

    // Leads, settings, analytics
    Route::get('/api/leads', [LeadController::class, 'index'])->name('api.leads.index');
    Route::delete('/api/leads/{lead}', [LeadController::class, 'destroy'])->name('api.leads.destroy');
    Route::get('/api/settings', [SettingController::class, 'index'])->name('api.settings.index');
    Route::put('/api/settings', [SettingController::class, 'update'])->name('api.settings.update');
    Route::get('/api/analytics/store', [AnalyticsController::class, 'store'])->name('api.analytics.store');

    // Products API
    Route::get('/api/products', [ProductController::class, 'index'])->name('api.products.index');
    Route::post('/api/products', [ProductController::class, 'store'])->name('api.products.store');
    Route::get('/api/products/{product}', [ProductController::class, 'show'])->name('api.products.show');
    Route::put('/api/products/{product}', [ProductController::class, 'update'])->name('api.products.update');
    Route::delete('/api/products/{product}', [ProductController::class, 'destroy'])->name('api.products.destroy');

    // Certificates API
    Route::get('/api/certificates', [CertificateController::class, 'index'])->name('api.certificates.index');
    Route::get('/api/certificates/next-ref', [CertificateController::class, 'nextRef'])->name('api.certificates.nextref');
    Route::get('/api/certificates/check-ref', [CertificateController::class, 'checkRef'])->name('api.certificates.checkref');
    Route::post('/api/certificates', [CertificateController::class, 'store'])->name('api.certificates.store');
    Route::get('/api/certificates/{certificate}', [CertificateController::class, 'show'])->name('api.certificates.show');
    Route::post('/api/certificates/{certificate}/revoke', [CertificateController::class, 'revoke'])->name('api.certificates.revoke');
    Route::delete('/api/certificates/{certificate}', [CertificateController::class, 'destroy'])->name('api.certificates.destroy');
});
