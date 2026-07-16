<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function index()
    {
        return response()->json(Project::orderBy('order')->latest()->get());
    }

    public function store(Request $request)
    {
        $data = $this->validateData($request);
        $project = Project::create($data);

        return response()->json($project, 201);
    }

    public function show(Project $project)
    {
        return response()->json($project);
    }

    public function update(Request $request, Project $project)
    {
        $data = $this->validateData($request, $project->id);
        $project->update($data);

        return response()->json($project);
    }

    public function destroy(Project $project)
    {
        $project->delete();

        return response()->json(['message' => 'Project deleted successfully']);
    }

    private function validateData(Request $request, ?int $ignoreId = null): array
    {
        $slugRule = 'nullable|string|max:255|unique:projects,slug';
        if ($ignoreId) {
            $slugRule .= ',' . $ignoreId;
        }

        return $request->validate([
            'title' => 'required|string|max:255',
            'slug' => $slugRule,
            'detail_title' => 'nullable|string|max:255',
            'location' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'completion_date' => 'nullable|string|max:255',
            'capacity' => 'nullable|string|max:255',
            'unit' => 'nullable|string|max:255',
            'img' => 'nullable|string',
            'tags' => 'nullable|array',
            'tags.*.icon' => 'nullable|string',
            'tags.*.text' => 'nullable|string',
            'overview' => 'nullable|string',
            'objectives' => 'nullable|string',
            'objectives_list' => 'nullable|array',
            'results' => 'nullable|array',
            'delivered' => 'nullable|array',
            'delivered.*.title' => 'nullable|string',
            'delivered.*.desc' => 'nullable|string',
            'impact' => 'nullable|string',
            'gallery' => 'nullable|array',
            'gallery.*' => 'string',
            'testimonial_quote' => 'nullable|string',
            'testimonial_name' => 'nullable|string|max:255',
            'testimonial_role' => 'nullable|string|max:255',
            'testimonial_img' => 'nullable|string',
            'is_published' => 'boolean',
            'order' => 'nullable|integer',
        ]);
    }
}
