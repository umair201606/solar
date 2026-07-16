<?php

namespace App\Http\Controllers;

use App\Models\Media;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MediaController extends Controller
{
    public function index()
    {
        return response()->json(Media::latest()->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:jpeg,png,webp,jpg,mp4,mov,avi,wmv,pdf|max:20480',
        ]);

        if (!$request->hasFile('file')) {
            return response()->json(['error' => 'No file uploaded'], 400);
        }

        $file = $request->file('file');
        $filename = time() . '_' . preg_replace('/[^A-Za-z0-9\-\.]/', '', $file->getClientOriginalName());
        $path = $file->storeAs('media', $filename, 'public');

        $media = Media::create([
            'name' => $file->getClientOriginalName(),
            'file_path' => $path,
            'url' => asset('storage/' . $path),
            'mime_type' => $file->getMimeType(),
            'size' => $file->getSize(),
        ]);

        return response()->json($media, 201);
    }

    public function destroy($id)
    {
        $media = Media::findOrFail($id);
        if (Storage::disk('public')->exists($media->file_path)) {
            Storage::disk('public')->delete($media->file_path);
        }
        $media->delete();

        return response()->json(['message' => 'Media deleted successfully']);
    }
}
