<?php

namespace Database\Seeders;

use App\Models\Project;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
    public function run(): void
    {
        $industrial = '/images/clients.webp';
        $corporate = '/images/client-portrait-corporate.webp';

        $projects = [
            [
                'slug' => 'bashir-sons-steel',
                'img' => '/images/vibrant_images/bashirsons1.webp',
                'title' => 'Bashir Sons Steel Industry',
                'detail_title' => 'Bashir Sons Steel Industry 5 MWp Solar Installation',
                'location' => 'Kala Shah Kaku, Pakistan',
                'description' => "Large-scale solar installation for one of Pakistan's leading steel mills, powering heavy industrial operations with 5 MWp of clean energy. A landmark project in Pakistan's industrial solar sector.",
                'completion_date' => 'Completed',
                'tags' => [
                    ['icon' => 'zap', 'text' => '5 MWp'],
                    ['icon' => 'building', 'text' => 'Heavy Industry'],
                    ['icon' => 'sun', 'text' => 'Grid-Tied Solar PV'],
                ],
                'overview' => "Large-scale solar installation for one of Pakistan's leading steel mills, powering heavy industrial operations with 5 MWp of clean energy. Designed to meet the high energy demands of steel manufacturing while significantly reducing operational costs.",
                'objectives' => 'Offset heavy industrial energy consumption with megawatt-scale solar and reduce reliance on expensive grid electricity.',
                'objectives_list' => ['Megawatt solar array design and installation', 'Grid-tied integration for seamless power supply', 'Load balancing for heavy machinery operations'],
                'results' => ['Significant reduction in electricity overheads', 'Stable power supply for continuous industrial operations'],
                'delivered' => [
                    ['title' => '5 MWp Solar Array', 'desc' => 'High-capacity industrial-grade solar PV system.'],
                ],
                'impact' => "Setting a new benchmark for renewable energy adoption in Pakistan's steel industry.",
                'testimonial_quote' => 'Solarkon delivered a massive solar solution that powers our entire steel operation. The savings and reliability have exceeded our expectations.',
                'testimonial_name' => 'Bashir Sons Operations Director',
                'testimonial_role' => 'Steel Industry, Kala Shah Kaku',
                'testimonial_img' => $industrial,
                'gallery' => [
                    '/images/vibrant_images/bashirsons1.webp',
                    '/images/vibrant_images/bashirsons2.webp',
                    '/images/vibrant_images/bashirsons4.webp',
                    '/images/vibrant_images/bashirsons6.webp',
                ],
                'order' => 1,
            ],
            [
                'slug' => 'gourmet-bakeries',
                'img' => '/images/vibrant_images/gourmet.webp',
                'title' => 'Gourmet Bakeries',
                'detail_title' => 'Gourmet Bakeries 3.5 MWp Multi-Branch Solar System',
                'location' => 'Multiple Branches, Pakistan',
                'description' => "Multi-branch solar installation for one of Pakistan's largest bakery chains. 3.5 MWp distributed across multiple locations, ensuring consistent power for production facilities.",
                'completion_date' => 'Completed',
                'tags' => [
                    ['icon' => 'zap', 'text' => '3.5 MWp'],
                    ['icon' => 'building', 'text' => 'Food Industry'],
                    ['icon' => 'sun', 'text' => 'Multi-Site Solar PV'],
                ],
                'overview' => "Multi-branch solar installation across Gourmet Bakeries' production facilities. Designed to ensure uninterrupted power for baking operations and cold storage while cutting energy costs significantly.",
                'objectives' => 'Provide reliable, cost-effective power across multiple production sites in the food industry.',
                'objectives_list' => ['Distributed solar deployment across branches', 'Cold storage power backup integration', 'Energy monitoring and optimization'],
                'results' => ['Substantial reduction in monthly electricity bills', 'Uninterrupted production during grid outages'],
                'delivered' => [
                    ['title' => 'Multi-Site Solar Array', 'desc' => 'Distributed solar PV systems across branches.'],
                ],
                'impact' => 'Enabling the food industry to operate sustainably with reliable clean energy.',
                'testimonial_quote' => "Solarkon's multi-site installation keeps our bakeries running smoothly across all locations. A game-changer for our operations.",
                'testimonial_name' => 'Gourmet Facilities Manager',
                'testimonial_role' => 'Food Production, Pakistan',
                'testimonial_img' => $corporate,
                'gallery' => [
                    '/images/vibrant_images/gourmet.webp',
                    '/images/vibrant_images/gourmet1.webp',
                    '/images/vibrant_images/gourmet4.webp',
                    '/images/vibrant_images/gourmet6.webp',
                ],
                'order' => 2,
            ],
            [
                'slug' => 'hajvery-foods',
                'img' => '/images/vibrant_images/hajvery.webp',
                'title' => 'Hajvery Foods',
                'detail_title' => 'Hajvery Foods 1.2 MWp Solar Installation',
                'location' => 'Daska, Sialkot',
                'description' => 'Solar power solution for a major food processing facility in Daska. 1.2 MWp system designed to meet the high energy demands of food processing, packaging, and cold storage operations.',
                'completion_date' => 'Completed',
                'tags' => [
                    ['icon' => 'zap', 'text' => '1.2 MWp'],
                    ['icon' => 'building', 'text' => 'Food Processing'],
                    ['icon' => 'sun', 'text' => 'Grid-Tied Solar PV'],
                ],
                'overview' => "Large-scale solar installation for Hajvery Foods' processing facility, powering production lines, packaging units, and cold storage. Designed to ensure uninterrupted operations while cutting energy costs.",
                'objectives' => 'Meet the high energy demands of food processing with reliable, cost-effective solar power.',
                'objectives_list' => ['High-capacity solar array for processing plant', 'Cold storage power reliability', 'Grid-tied with net metering'],
                'results' => ['Dramatic reduction in energy overheads', 'Consistent power for temperature-sensitive operations'],
                'delivered' => [
                    ['title' => '1.2 MWp Solar Array', 'desc' => 'Industrial solar PV system for food processing.'],
                ],
                'impact' => "Driving sustainability in Pakistan's food processing industry.",
                'testimonial_quote' => "The solar system from Solarkon has transformed our processing facility's energy profile. Reliable power and significant savings.",
                'testimonial_name' => 'Hajvery Foods Plant Manager',
                'testimonial_role' => 'Food Industry, Daska',
                'testimonial_img' => $industrial,
                'gallery' => [
                    '/images/vibrant_images/hajvery.webp',
                    '/images/vibrant_images/hajvery1.webp',
                    '/images/vibrant_images/hajvery8.webp',
                ],
                'order' => 3,
            ],
            [
                'slug' => 'azaan-flour-mill',
                'img' => '/images/solar-panels-closeup.webp',
                'title' => 'Azaan Flour Mill',
                'detail_title' => 'Azaan Flour Mill Solar Installation',
                'location' => 'Pakistan',
                'description' => 'Solar power solution for a flour milling facility, ensuring reliable energy for grinding, packaging, and storage operations.',
                'completion_date' => 'Ongoing',
                'tags' => [
                    ['icon' => 'zap', 'text' => 'Commercial'],
                    ['icon' => 'building', 'text' => 'Food Processing'],
                    ['icon' => 'sun', 'text' => 'Grid-Tied Solar PV'],
                ],
                'overview' => 'Solar installation for Azaan Flour Mill, designed to power milling operations with clean, reliable energy while reducing operational costs.',
                'objectives' => 'Provide reliable power for flour milling operations and reduce dependency on grid electricity.',
                'objectives_list' => ['Commercial solar array design', 'Grid-tied integration', 'Load balancing for milling machinery'],
                'results' => ['Reduced energy costs', 'Reliable power for continuous operations'],
                'delivered' => [
                    ['title' => 'Commercial Solar Array', 'desc' => 'Solar PV system for flour milling operations.'],
                ],
                'impact' => 'Supporting the food processing industry with sustainable energy.',
                'testimonial_quote' => "Solarkon's solar solution keeps our flour mill running efficiently. Reliable power and great savings.",
                'testimonial_name' => 'Azaan Flour Mill Management',
                'testimonial_role' => 'Food Processing, Pakistan',
                'testimonial_img' => $industrial,
                'gallery' => [],
                'order' => 4,
            ],
            [
                'slug' => 'bashir-sons-ongoing',
                'img' => '/images/vibrant_images/ongoingB.webp',
                'title' => 'Bashir Sons Steel Industry, Phase 2',
                'detail_title' => 'Bashir Sons Steel Industry 10 MWp Ongoing Expansion',
                'location' => 'Kala Shah Kaku, Pakistan',
                'description' => 'Second phase expansion for Bashir Sons Steel Industry, adding 10 MWp of solar capacity to power growing industrial operations.',
                'completion_date' => 'Ongoing',
                'tags' => [
                    ['icon' => 'zap', 'text' => '10 MWp'],
                    ['icon' => 'building', 'text' => 'Heavy Industry'],
                    ['icon' => 'sun', 'text' => 'Grid-Tied Solar PV'],
                ],
                'overview' => 'Phase 2 expansion of the existing solar installation at Bashir Sons Steel Industry, doubling capacity to meet increasing energy demands.',
                'objectives' => 'Expand solar capacity to support growing industrial operations.',
                'objectives_list' => ['10 MWp solar array installation', 'Integration with existing system', 'Enhanced load balancing'],
                'results' => ['Increased renewable energy capacity', 'Greater operational cost savings'],
                'delivered' => [
                    ['title' => '10 MWp Solar Array', 'desc' => 'Expansion of industrial solar PV system.'],
                ],
                'impact' => 'Setting new records in industrial solar adoption in Pakistan.',
                'testimonial_quote' => 'The Phase 2 expansion with Solarkon will double our solar capacity, further reducing our operational costs.',
                'testimonial_name' => 'Bashir Sons Operations Director',
                'testimonial_role' => 'Steel Industry, Kala Shah Kaku',
                'testimonial_img' => $industrial,
                'gallery' => [],
                'order' => 5,
            ],
        ];

        foreach ($projects as $data) {
            Project::updateOrCreate(['slug' => $data['slug']], $data);
        }
    }
}
