<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\CrmProject;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class CrmController extends Controller
{
    /* ---------------- Clients ---------------- */

    public function clients()
    {
        return response()->json(
            Client::withCount('crmProjects')->latest()->get()
        );
    }

    public function storeClient(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:clients,email',
            'password' => 'required|string|min:6',
            'phone' => 'nullable|string|max:30',
            'company' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $client = Client::create($data);

        return response()->json($client->loadCount('crmProjects'), 201);
    }

    public function updateClient(Request $request, Client $client)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'email', 'max:255', Rule::unique('clients', 'email')->ignore($client->id)],
            'password' => 'nullable|string|min:6',
            'phone' => 'nullable|string|max:30',
            'company' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        if (empty($data['password'])) {
            unset($data['password']);
        }

        $client->update($data);

        return response()->json($client->loadCount('crmProjects'));
    }

    public function destroyClient(Client $client)
    {
        $client->delete();

        return response()->json(['ok' => true]);
    }

    /* ---------------- CRM projects ---------------- */

    public function projects()
    {
        return response()->json(
            CrmProject::with(['client:id,name,email,company', 'stages'])->latest()->get()
        );
    }

    public function showProject(CrmProject $crmProject)
    {
        return response()->json($crmProject->load(['client:id,name,email,company', 'stages']));
    }

    public function storeProject(Request $request)
    {
        [$data, $stages] = $this->validateProject($request);

        $project = CrmProject::create($data);
        $this->syncStages($project, $stages);

        return response()->json($project->load(['client:id,name,email,company', 'stages']), 201);
    }

    public function updateProject(Request $request, CrmProject $crmProject)
    {
        [$data, $stages] = $this->validateProject($request);

        $crmProject->update($data);
        $this->syncStages($crmProject, $stages);

        return response()->json($crmProject->fresh()->load(['client:id,name,email,company', 'stages']));
    }

    public function destroyProject(CrmProject $crmProject)
    {
        $crmProject->delete();

        return response()->json(['ok' => true]);
    }

    /* ---------------- Dashboard insights ---------------- */

    public function dashboard()
    {
        $projects = CrmProject::with(['client:id,name', 'stages'])->get();

        $byStatus = collect(CrmProject::STATUSES)
            ->mapWithKeys(fn ($s) => [$s => $projects->where('status', $s)->count()]);

        $continuing = $projects->whereIn('status', CrmProject::CONTINUING)->values();

        $cutoff = now()->subDays(30);
        $newLast30 = [
            'continuing' => $continuing->where('created_at', '>=', $cutoff)->count(),
            'completed' => $projects->where('status', 'completed')->where('created_at', '>=', $cutoff)->count(),
            'starting_soon' => $projects->where('status', 'starting-soon')->where('created_at', '>=', $cutoff)->count(),
        ];

        return response()->json([
            'new_last_30' => $newLast30,
            'counts' => [
                'clients' => Client::count(),
                'active_clients' => Client::where('is_active', true)->count(),
                'projects' => $projects->count(),
                'continuing' => $continuing->count(),
                'by_status' => $byStatus,
            ],
            'avg_continuing_progress' => $continuing->isEmpty()
                ? null
                : (int) round($continuing->avg(fn ($p) => $p->total_progress)),
            'continuing_projects' => $continuing
                ->sortBy('expected_end_date')
                ->values()
                ->map(fn ($p) => $this->projectSummary($p)),
            'upcoming_projects' => $projects->where('status', 'starting-soon')
                ->sortBy('start_date')
                ->values()
                ->map(fn ($p) => $this->projectSummary($p)),
            'recently_completed' => $projects->where('status', 'completed')
                ->sortByDesc('updated_at')
                ->take(6)
                ->values()
                ->map(fn ($p) => $this->projectSummary($p)),
        ]);
    }

    private function projectSummary(CrmProject $p): array
    {
        return [
            'id' => $p->id,
            'title' => $p->title,
            'status' => $p->status,
            'client' => $p->client?->name,
            'total_progress' => $p->total_progress,
            'stages_count' => $p->stages->count(),
            'start_date' => $p->start_date?->toDateString(),
            'expected_end_date' => $p->expected_end_date?->toDateString(),
        ];
    }

    /* ---------------- Helpers ---------------- */

    private function validateProject(Request $request): array
    {
        $data = $request->validate([
            'client_id' => 'nullable|exists:clients,id',
            'title' => 'required|string|max:255',
            'status' => ['required', Rule::in(CrmProject::STATUSES)],
            'description' => 'nullable|string',
            'location' => 'nullable|string|max:255',
            'start_date' => 'nullable|date',
            'expected_end_date' => 'nullable|date',
            'ticker' => 'nullable|array',
            'ticker.*' => 'string|max:500',
            'stages' => 'nullable|array',
            'stages.*.id' => 'nullable|integer',
            'stages.*.name' => 'required|string|max:255',
            'stages.*.weight' => 'required|integer|min:0|max:100',
            'stages.*.progress' => 'required|integer|min:0|max:100',
            'stages.*.note' => 'nullable|string|max:500',
        ]);

        $stages = $data['stages'] ?? [];
        unset($data['stages']);
        $data['ticker'] = array_values(array_filter($data['ticker'] ?? [], fn ($t) => trim($t) !== ''));

        return [$data, $stages];
    }

    private function syncStages(CrmProject $project, array $stages): void
    {
        $keepIds = [];

        foreach ($stages as $order => $stage) {
            $attributes = [
                'name' => $stage['name'],
                'weight' => $stage['weight'],
                'progress' => $stage['progress'],
                'note' => $stage['note'] ?? null,
                'sort_order' => $order,
            ];

            if (! empty($stage['id']) && ($existing = $project->stages()->find($stage['id']))) {
                $existing->update($attributes);
                $keepIds[] = $existing->id;
            } else {
                $keepIds[] = $project->stages()->create($attributes)->id;
            }
        }

        $project->stages()->whereNotIn('id', $keepIds)->delete();
    }
}
