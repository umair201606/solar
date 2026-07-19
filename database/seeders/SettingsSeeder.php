<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingsSeeder extends Seeder
{
    public function run(): void
    {
        $defaults = [
            'whatsapp_default_number' => '03066575943',
            'default_product_description' => 'Genuine product with official warranty, available at Solarkon — '
                .'trusted solar products trading & energy solutions company. Market-competitive rates updated '
                .'regularly. Contact us on WhatsApp for current price, stock availability and delivery.',
            'default_product_image' => '',
            'category_image_batteries' => '/storage/media/1784395296_Battery.jpg',
            'category_image_inverters' => '/storage/media/1784395297_Inverter.jpg',
            'category_image_panels' => '/storage/media/1784395299_Panel.jpg',
            'store_announcements' => "🎉 Exclusive discounts for our customers — call us on WhatsApp to get your discount!\n🚚 Delivery available all over Pakistan\n✅ Genuine products with official warranty",
        ];

        foreach ($defaults as $key => $value) {
            if (Setting::query()->where('key', $key)->doesntExist()) {
                Setting::create(['key' => $key, 'value' => $value]);
            }
        }
    }
}
