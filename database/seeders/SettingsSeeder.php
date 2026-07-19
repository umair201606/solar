<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SettingsSeeder extends Seeder
{
    public function run(): void
    {
        $path = database_path('seeders/data/settings.json');
        $settings = json_decode(file_get_contents($path), true);

        foreach ($settings as $row) {
            DB::table('settings')->updateOrInsert(
                ['key' => $row['key']],
                [
                    'value'      => $row['value'],
                    'created_at' => $row['created_at'],
                    'updated_at' => $row['updated_at'],
                ],
            );
        }

        $this->command?->info(count($settings).' settings seeded.');
    }
}
