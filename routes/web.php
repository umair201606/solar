<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::inertia('/', 'Home')->name('home');
Route::inertia('/projects', 'Projects')->name('projects');
Route::get('/projects/{slug}', fn (string $slug) => Inertia::render('ProjectDetail', ['slug' => $slug]))->name('projects.show');
Route::inertia('/about', 'About')->name('about');
Route::inertia('/contact', 'Contact')->name('contact');
Route::inertia('/solutions', 'Solutions')->name('solutions');
Route::inertia('/store', 'Store')->name('store');
Route::get('/blog/{slug}', fn (string $slug) => Inertia::render('BlogDetail', ['slug' => $slug]))->name('blog.show');
