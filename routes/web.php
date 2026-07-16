<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\MediaController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CertificateController;

// Public routes
Route::inertia('/', 'Home')->name('home');
Route::inertia('/projects', 'Projects')->name('projects');
Route::get('/projects/{slug}', fn (string $slug) => Inertia::render('ProjectDetail', ['slug' => $slug]))->name('projects.show');
Route::inertia('/about', 'About')->name('about');
Route::inertia('/contact', 'Contact')->name('contact');
Route::inertia('/solutions', 'Solutions')->name('solutions');
Route::inertia('/store', 'Store')->name('store');
Route::get('/blog/{slug}', fn (string $slug) => Inertia::render('BlogDetail', ['slug' => $slug]))->name('blog.show');

// Public certificate verification (QR code target) + PDF download
Route::get('/verify/{uuid}', [CertificateController::class, 'verify'])->name('certificate.verify');
Route::get('/verify/{uuid}/download', [CertificateController::class, 'download'])->name('certificate.download');

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
