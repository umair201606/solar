<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ClientPortalController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (Auth::guard('client')->attempt($credentials + ['is_active' => true], $request->boolean('remember'))) {
            $request->session()->regenerate();

            return redirect('/portal');
        }

        return back()->withErrors([
            'email' => 'These credentials are not valid or the account is inactive.',
        ]);
    }

    public function logout(Request $request)
    {
        Auth::guard('client')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/portal/login');
    }

    /** Projects assigned to the signed-in client, with stages and progress. */
    public function projects(Request $request)
    {
        $client = $request->user('client');

        return response()->json([
            'client' => ['name' => $client->name, 'company' => $client->company],
            'projects' => $client->crmProjects()
                ->with('stages')
                ->latest()
                ->get()
                ->map(fn ($p) => $this->present($p)),
        ]);
    }

    public function project(Request $request, int $id)
    {
        $project = $request->user('client')->crmProjects()
            ->with('stages')
            ->findOrFail($id);

        return response()->json($this->present($project));
    }

    private function present($project): array
    {
        return [
            'id' => $project->id,
            'title' => $project->title,
            'status' => $project->status,
            'description' => $project->description,
            'location' => $project->location,
            'start_date' => $project->start_date?->toDateString(),
            'expected_end_date' => $project->expected_end_date?->toDateString(),
            'ticker' => $project->ticker ?? [],
            'total_progress' => $project->total_progress,
            'stages' => $project->stages->map(fn ($s) => [
                'id' => $s->id,
                'name' => $s->name,
                'weight' => $s->weight,
                'progress' => $s->progress,
                'note' => $s->note,
            ])->values(),
            'updated_at' => $project->updated_at?->toDateTimeString(),
        ];
    }
}
