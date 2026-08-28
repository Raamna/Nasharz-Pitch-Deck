import React, { useState } from 'react';
import { Chapter, BrandingConfig } from '../types';
import {
  Sparkles,
  Users,
  MapPin,
  Camera,
  FileText,
  Copy,
  CheckCircle2,
  Download,
  ZoomIn,
  Compass,
  Wrench,
  ShieldCheck,
  Building,
  Anchor,
  Car,
  Truck,
  Tractor,
  Home,
  Check,
  AlertCircle,
  Eye,
  Layers,
  Film,
  Palette,
  Zap,
  Flame,
  ShieldAlert,
  Boxes,
  Package
} from 'lucide-react';

interface ArtTalentChapterViewProps {
  chapter: Chapter;
  branding: BrandingConfig;
  onImageClick: (index: number) => void;
  onDownloadPdf: () => void;
  isGeneratingPdf: boolean;
}

export const ArtTalentChapterView: React.FC<ArtTalentChapterViewProps> = ({
  chapter,
  branding,
  onImageClick,
  onDownloadPdf,
  isGeneratingPdf,
}) => {
  const [activeTab, setActiveTab] = useState<'wardrobe' | 'vehicles-props' | 'films' | 'mobile-labs' | 'color-priorities' | 'locations' | 'moodboard' | 'contract'>('wardrobe');
  const [characterFilter, setCharacterFilter] = useState<'all' | 'master' | 'car' | 'truck' | 'tractor' | 'bike' | 'ups'>('all');
  const [vehicleFilter, setVehicleFilter] = useState<'all' | 'master' | 'car' | 'truck' | 'tractor' | 'bike' | 'ups'>('all');
  const [copiedContract, setCopiedContract] = useState(false);
  const [activeLocationIndex, setActiveLocationIndex] = useState<number>(0);

  // Official Character Sheets ordered strictly by sequence
  const characterSheets = [
    // -------------------------------------------------------------
    // MAIN WARDROBE
    // -------------------------------------------------------------
    {
      id: 0,
      filmKey: 'master',
      filmLabel: 'Main Wardrobe • Master Look',
      title: 'A. Battery Expert — Master Look',
      actor: 'Iftikhar Thakur',
      role: 'Lead Energy Expert & Technical Authority',
      url: 'https://res.cloudinary.com/dawlj9ne4/image/upload/Battery_Pehlwan_Sheet_w2wp4c.png',
      wardrobePoints: [
        'Clean white laboratory coat (crisp, practical, contemporary)',
        'White or very light neutral shalwar qameez underneath',
        'Minimal styling, no tie, no medical costume clichés',
        'No gloves unless required for a technical action'
      ],
      headRule: 'CRITICAL: Absolutely no cap, no turban and no headwear.',
      performance: 'Combination of senior surgeon, technical scientist, and emergency-response expert — unmistakably Iftikhar Thakur.',
      visualRule: 'The Battery Expert should always feel cleaner, sharper and more premium than the character version of Thakur.'
    },
    {
      id: 1,
      filmKey: 'master',
      filmLabel: 'Main Wardrobe • Technical Team',
      title: 'The Alaska Battery Expert Team',
      actor: 'Technical Specialists Ensemble',
      role: 'Mobile Technology Response Unit',
      url: 'https://res.cloudinary.com/dawlj9ne4/image/upload/Battery_Pehlwan_Medical_Team_Sheet_v07k88.png',
      wardrobePoints: [
        'Contemporary technical uniforms with clean silhouettes',
        'Practical jackets or utility-style clothing',
        'Subtle Alaska branding insignia',
        'Functional equipment belts and technical diagnostic cases'
      ],
      headRule: 'Modern technical specialists — DO NOT look like doctors in a hospital.',
      performance: 'High-speed, disciplined, synchronized mobile technology pit-crew.',
      visualRule: 'Visual Feel: Premium mobile technology response unit (not hospital staff).'
    },

    // -------------------------------------------------------------
    // CAR SEQUENCE (FILM 01 — CAR)
    // -------------------------------------------------------------
    {
      id: 2,
      filmKey: 'car',
      filmLabel: 'Film 01 — Car Sequence',
      title: 'Character Thakur: Traffic Policeman',
      actor: 'Iftikhar Thakur',
      role: 'Gridlock Traffic Policeman',
      url: 'https://res.cloudinary.com/dawlj9ne4/image/upload/Battery_Pehlwan_Traf_Policeman_Sheet_bmo9yi.png',
      wardrobePoints: [
        'Authentic Pakistani traffic police uniform (shirt & trousers)',
        'Official Police cap and duty belt',
        'Clean but naturally worn appearance with appropriate shoes',
        'Visual twist silver-foil heat resistance suit for comedy sequence'
      ],
      headRule: 'Must wear official police cap (contrast with Battery Expert with NO headwear).',
      performance: 'Stern, irritated, street-smart, comically confident.',
      visualRule: 'Visual Separation: The Policeman and Battery Expert must never appear visually confused.'
    },
    {
      id: 3,
      filmKey: 'car',
      filmLabel: 'Film 01 — Car Sequence',
      title: 'Traffic Policeman Uniform Color Options',
      actor: 'Wardrobe Department Reference',
      role: 'Provincial Uniform Color Palette & Insignia Variations',
      url: 'https://res.cloudinary.com/dawlj9ne4/image/upload/Battery_Pehlwan_Traf_Policeman_Color_Options_yhw9p8.png',
      wardrobePoints: [
        'Authentic Pakistani provincial traffic police color variations (Blue-grey, khaki, navy, and white trim)',
        'Official high-visibility chest badges and reflective shoulder epaulettes',
        'Approved color palette ensures maximum contrast against urban streetscapes',
        'Standardized municipal traffic warden duty gear'
      ],
      headRule: 'Official peaked traffic warden cap matching selected provincial tunic color.',
      performance: 'Authoritative regulatory palette for high-traffic Lahore Ring Road / Food Street junction.',
      visualRule: 'Provides visual distinction between ordinary civilian vehicles and official traffic enforcement.'
    },
    {
      id: 4,
      filmKey: 'car',
      filmLabel: 'Film 01 — Car Sequence',
      title: 'Car Owner (Luxury Sedan Commuter)',
      actor: 'Supporting Cast',
      role: 'Affluent Urban Professional',
      url: 'https://res.cloudinary.com/dawlj9ne4/image/upload/Battery_Pehlwan_Car_Owner_Sheet_y7jdpt.png',
      wardrobePoints: [
        'Well-groomed Pakistani man, late 30s to mid-40s, affluent urban professional',
        'He should look successful, sophisticated and slightly impatient, but still believable and relatable',
        'His wardrobe should communicate that he owns an expensive car without making him look like a celebrity, politician or fashion model',
        'Tailored modern corporate blazer, crisp shirt, classic leather-strap wristwatch'
      ],
      headRule: 'Neatly groomed metropolitan professional haircut.',
      performance: 'Stressed, high-tempo urban driver caught in dead-battery gridlock on the way to an important engagement.',
      visualRule: 'Authentic metropolitan affluence grounded in everyday Pakistani commute realities.'
    },

    // -------------------------------------------------------------
    // BIKE SEQUENCE (FILM 04 — BIKE)
    // -------------------------------------------------------------
    {
      id: 5,
      filmKey: 'bike',
      filmLabel: 'Film 04 — Bike Sequence',
      title: 'Character Thakur: Office Executive in Safari Suit',
      actor: 'Iftikhar Thakur',
      role: 'Senior Executive Commuter',
      url: 'https://res.cloudinary.com/dawlj9ne4/image/upload/Battery_Pehlwan_Office_Executive_Sheet_k7dybx.png',
      wardrobePoints: [
        'Senior office executive commuting during morning rush hour (formerly morning man)',
        'Classic tailored safari suit (beige/khaki or grey-blue)',
        'Epaulettes, flap chest pockets, belted or structured jacket silhouette',
        'Polished leather shoes, frantic commuter watch-checking in morning traffic'
      ],
      headRule: 'No headwear (natural groomed executive morning hair).',
      performance: 'Stressed senior executive desperate to beat the morning gridlock.',
      visualRule: 'Contrasts against Battery Expert who arrives in crisp white technical lab coat.'
    },
    {
      id: 6,
      filmKey: 'bike',
      filmLabel: 'Film 04 — Bike Sequence',
      title: 'Taxi Bike Rider',
      actor: 'Supporting Cast',
      role: 'Hardworking Urban Motorcycle Taxi Operator',
      url: 'https://res.cloudinary.com/dawlj9ne4/image/upload/Battery_Pehlwan_Taxi_Biker_Sheet_hwhgny.png',
      wardrobePoints: [
        'Practical Pakistani taxi motorcycle rider, urban, hardworking and realistic',
        'He should look like an authentic everyday bike rider, not a fashion model, delivery rider or generic construction worker',
        'Weathered windbreaker or lightweight utility jacket, everyday shalwar qameez or jeans',
        'Practical riding shoes, worn safety helmet, mobile phone handlebar mount'
      ],
      headRule: 'Worn everyday motorcycle safety helmet with quick-release chin strap.',
      performance: 'Street-savvy, energetic, resourceful daily bike taxi pilot navigating dense urban alleys.',
      visualRule: 'Authentic everyday street commuter aesthetic — 100% believable Pakistani ride-hail reality.'
    },
    {
      id: 7,
      filmKey: 'bike',
      filmLabel: 'Film 04 — Bike Sequence',
      title: 'Supporting Cast: Job Interview Candidate',
      actor: 'Supporting Cast',
      role: 'Anxious Job Interview Candidate',
      url: 'https://res.cloudinary.com/dawlj9ne4/image/upload/Battery_Pehlwan_Interview_Candidate_Sheet_r01msw.png',
      wardrobePoints: [
        'Tailored modern corporate blazer, crisp ironed pastel blue/white shirt, silk tie, dark trousers',
        'Commuter leather backpack or clear CV portfolio folder',
        'Safety motorcycle helmet for transit shots',
        'Desperate to reach career-defining job interview on time before the deadline'
      ],
      headRule: 'Groomed corporate hairstyle under motorcycle helmet.',
      performance: 'Nervous tension, checking watch frantically as the minutes tick down.',
      visualRule: 'Sharp modern corporate styling contrasting with stalled motorcycle comedy.'
    },

    // -------------------------------------------------------------
    // TRUCK SEQUENCE (FILM 02 — TRUCK)
    // -------------------------------------------------------------
    {
      id: 8,
      filmKey: 'truck',
      filmLabel: 'Film 02 — Truck Sequence',
      title: 'Character Thakur: Fisherman & Port Logistics Captain',
      actor: 'Iftikhar Thakur',
      role: 'Fish Harbor Logistics Captain',
      url: 'https://res.cloudinary.com/dawlj9ne4/image/upload/Battery_Pehlwan_Pathan_Thakur_Sheet_d2i9er.png',
      wardrobePoints: [
        'Simple traditional shalwar qameez in earthy, practical fabric',
        'Embroidered velvet waistcoat details',
        'Weathered working look with brass ring keys',
        'Comfortable sandals / traditional footwear'
      ],
      headRule: 'KEY MANDATORY RULE: Truck Driver / Fisherman Thakur MUST always wear the white Pathan cap.',
      performance: 'Brave, resilient, protective of his fresh seafood cargo at Karachi fish harbor.',
      visualRule: 'Contrasts against Battery Expert who wears white lab coat with NO Pathan cap and NO headwear.'
    },
    {
      id: 9,
      filmKey: 'truck',
      filmLabel: 'Film 02 — Truck Sequence',
      title: 'Truck Driver & Port Cargo Crew',
      actor: 'Supporting Ensemble',
      role: 'Fish Port Cargo Workers & Truck Helpers',
      url: 'https://res.cloudinary.com/dawlj9ne4/image/upload/Battery_Pehlwan_Truck_Driver_Sheet_kbbtsv.png',
      wardrobePoints: [
        'Practical port cargo crew and heavy commercial transport helpers',
        'Weathered utility workwear, rolled-up sleeves, waterproof rubber boots',
        'Heavy ice crates, wet fish containers, sea-spray salt patina',
        'Grounded Karachi fish harbor maritime atmosphere'
      ],
      headRule: 'Practical cotton patkas or bareheaded harbor workwear.',
      performance: 'Hardworking, bustling dock workers racing against melting ice and spoiling cargo.',
      visualRule: 'Industrial maritime texture balancing high-tech Alaska mobile laboratory arrival.'
    },

    // -------------------------------------------------------------
    // TRACTOR SEQUENCE (FILM 03 — TRACTOR)
    // -------------------------------------------------------------
    {
      id: 10,
      filmKey: 'tractor',
      filmLabel: 'Film 03 — Tractor Sequence (Option A)',
      title: 'Character Thakur: Chaudhary Sb (Option A: Red Polka Turban)',
      actor: 'Iftikhar Thakur',
      role: 'Baraat Patriarch & Farm Landlord',
      url: 'https://res.cloudinary.com/dawlj9ne4/image/upload/Battery_Pehlwan_Chaudharsb_1_Sheet_zbnlik.png',
      wardrobePoints: [
        'Vibrant red turban / safa with golden-yellow polka-dot pattern',
        'Traditional fan-style front knot (Turra / Shamla)',
        'Mustard-yellow kurta with matching dhoti or lacha',
        'Red floral-print stole, traditional tilla khussa'
      ],
      headRule: 'Vibrant red polka turban (Battery Expert wears NO turban, NO headwear).',
      performance: 'Bushy handlebar moustache, thick eyebrows, rustic Punjabi Chaudhary charisma.',
      visualRule: 'Oversized wrench as an optional comic prop.'
    },
    {
      id: 11,
      filmKey: 'tractor',
      filmLabel: 'Film 03 — Tractor Sequence (Option B)',
      title: 'Character Thakur: Chaudhary Sb (Option B: Traditional Boski Elder)',
      actor: 'Iftikhar Thakur',
      role: 'Traditional Rural Grandfather',
      url: 'https://res.cloudinary.com/dawlj9ne4/image/upload/Battery_Pehlwan_ch_sb_Sheet_hi8350.png',
      wardrobePoints: [
        'Starched pristine white Cotton Boski Kurta Pajama',
        'Traditional starched white/cream turban',
        'Authentic handmade Tilla Khussa & carved cane',
        'Pristine village patriarch aesthetic'
      ],
      headRule: 'Traditional starched turban.',
      performance: 'Wise, prestigious, authoritative village elder.',
      visualRule: 'Alternative styling option for Tractor film rural sequence.'
    },
    {
      id: 12,
      filmKey: 'tractor',
      filmLabel: 'Film 03 — Tractor Sequence',
      title: 'Farmer & Agricultural Harvester Crew',
      actor: 'Supporting Ensemble',
      role: 'Agricultural Harvesters',
      url: 'https://res.cloudinary.com/dawlj9ne4/image/upload/Battery_Pehlwan_Farmer_Sheet_dpryzu.png',
      wardrobePoints: [
        'Earthy Khaki/Olive breathable cotton kurta',
        'Traditional Punjabi Tehband (Lungi)',
        'Checkered gamchha / patka shoulder wrap',
        'Realistic harvest soil and field patina'
      ],
      headRule: 'Traditional farmer patka wrap.',
      performance: 'Hardworking, genuine, joyful celebration when the tractor restarts.',
      visualRule: 'Grounded Punjabi rural realism in golden harvest fields.'
    },

    // -------------------------------------------------------------
    // UPS / INVERTER SEQUENCE (FILM 05 — UPS)
    // -------------------------------------------------------------
    {
      id: 13,
      filmKey: 'ups',
      filmLabel: 'Film 05 — UPS / Inverter Sequence',
      title: 'Character Thakur: Festive Wedding Guest',
      actor: 'Iftikhar Thakur & Ensemble',
      role: 'Festive Wedding Guests (Baraat)',
      url: 'https://res.cloudinary.com/dawlj9ne4/image/upload/Battery_Pehlwan_Wedding_Guest_Sheet_yij1ox.png',
      wardrobePoints: [
        'Thakur Look: Traditional formal Pakistani wedding outfit with tasteful waistcoat, elegant light festive styling',
        'Family Ensembles: Festive velvet, banarsi silk, and chiffon in jewel tones (crimson, emerald, marigold, royal purple)',
        'Zari embroidery, floral garlands (Haar)',
        'Fits naturally inside an authentic old Lahore wedding home'
      ],
      headRule: 'Festive wedding styling without clinical lab elements.',
      performance: 'Ecstatic celebratory energy interrupted by blackout, then restored by Battery Expert.',
      visualRule: 'Contrasts warm wedding candlelight with Battery Expert’s sharp clinical efficiency.'
    },
    {
      id: 14,
      filmKey: 'ups',
      filmLabel: 'Film 05 — UPS / Inverter Sequence',
      title: 'UPS Guy / Young Groom (Option A — Two Wardrobe Options)',
      actor: 'Lead Supporting Cast',
      role: 'Stressed Groom Managing Wedding Morning (Kurta & Casual Options)',
      url: 'https://res.cloudinary.com/dawlj9ne4/image/upload/Battery_Pehlwan_UPS_Guy_1_Sheet_irwm7w.png',
      wardrobePoints: [
        'Young Pakistani groom, approximately mid-20s to mid-30s',
        'Two distinct wardrobe options: Traditional festive embroidered kurta pajama vs contemporary semi-formal casual shirt & trousers',
        'Energetic, busy and managing chaotic preparations on the morning of his wedding',
        'Natural, well-groomed appearance with realistic hair and trimmed beard'
      ],
      headRule: 'Well-groomed modern festive haircut.',
      performance: 'Juggling phone calls, relatives, and household electrical crisis on his big day.',
      visualRule: 'Realistic groom aesthetic — relatable, dynamic, and genuinely stressed before power restoration.'
    },
    {
      id: 15,
      filmKey: 'ups',
      filmLabel: 'Film 05 — UPS / Inverter Sequence',
      title: 'UPS Guy / Young Groom (Option B — Master Look)',
      actor: 'Lead Supporting Cast',
      role: 'Stressed Groom Managing Wedding Morning (Master Styling)',
      url: 'https://res.cloudinary.com/dawlj9ne4/image/upload/Battery_Pehlwan_UPS_Guy_Sheet_ilqhb2.png',
      wardrobePoints: [
        'Young Pakistani groom, approximately mid-20s to mid-30s',
        'He is energetic, busy and slightly stressed because he is personally managing the wedding arrangements',
        'He should look like he is constantly being pulled in different directions on the morning of his own wedding — checking preparations, arranging things and managing the chaos',
        'Natural, well-groomed appearance with realistic hair, beard or clean-shaven grooming'
      ],
      headRule: 'Well-groomed modern festive haircut.',
      performance: 'Juggling phone calls, relatives, and household electrical crisis on his big day.',
      visualRule: 'Master groom styling ensuring maximum visual contrast when Battery Expert arrives.'
    },
    {
      id: 16,
      filmKey: 'ups',
      filmLabel: 'Film 05 — UPS / Inverter Sequence',
      title: 'Mother of the Groom / Household Matriarch',
      actor: 'Supporting Cast',
      role: 'Commanding & Practical Pakistani Mother',
      url: 'https://res.cloudinary.com/dawlj9ne4/image/upload/Battery_Pehlwan_UPS_Mother_Sheet_trglgq.png',
      wardrobePoints: [
        'Pakistani mother, approximately late 40s to late 50s',
        'Warm, commanding, practical and expressive',
        'She should look like the person who is managing the entire wedding household and knows exactly what everyone should be doing',
        'Natural Pakistani beauty, realistic skin texture, graceful but strong presence, elegant festive shalwar qameez with dupatta'
      ],
      headRule: 'Graceful festive dupatta drape over styled hair.',
      performance: 'Authoritative matriarch orchestrating wedding preparations with practical urgency.',
      visualRule: 'Authentic Pakistani family emotional anchor during power outage and resolution.'
    }
  ];

  const filteredCharacters = characterSheets.filter(c => {
    if (characterFilter === 'all') return true;
    return c.filmKey === characterFilter;
  });

  // Parallel Production Design Suite: Vehicle & Props Design Grids across all sequences
  const vehiclePropSheets = [
    {
      id: 0,
      filmKey: 'master',
      filmLabel: 'Master Vehicle • Option 1',
      title: 'Unified Battery Pehlwan Mobile Lab Van (Option 1 — Master Livery)',
      subtitle: 'Aerodynamic high-roof emergency vehicle with slide-out battery diagnostic racks',
      url: 'https://res.cloudinary.com/dawlj9ne4/image/upload/Battery_Pehlwan_Branded_Veh_op1_esdu3i.png',
      altOptionUrl: 'https://res.cloudinary.com/dawlj9ne4/image/upload/Battery_Pehlwan_Branded_Veh_jog7cv.png',
      badge: 'Master Livery Option 1',
      mainVehicle: [
        'Aerodynamic high-roof commercial vehicle with custom yellow-and-white Alaska livery',
        'Roof-mounted high-intensity strobe beacon array and technical diagnostic antennas',
        'Full front 3/4 view, side profile, rear deployable ramp, and slide-out diagnostic racks',
        'Holds Alaska Graphite batteries, high-voltage oscilloscopes, and LED status meters'
      ],
      vehicleLook: [
        'Pristine, futuristic yet practical Pakistani emergency-response mobile laboratory',
        'High-gloss Alaska Yellow (#F59E0B) and Arctic White dual-tone body styling',
        'Prominent Alaska Batteries branding and "BATTERY PEHLWAN EMERGENCY UNIT" insignia',
        'Sharp professional finish creating comedic contrast against real-world breakdown environments'
      ],
      props: [
        'Hero Alaska Graphite Battery with 1:1 cutaway casing & 9-Month Replacement Warranty seal',
        'High-speed digital oscilloscope and diagnostic telemetry tablet',
        'Heavy-duty insulated jumper clamps and spark-arrestor cables',
        'Brushed aluminum mobile diagnostic flight cases and emergency LED work-lights'
      ],
      artDirective: 'ONE UNIFIED VEHICLE (OPTION 1): The Battery Pehlwan branded mobile van is the consistent high-tech heroic enabler appearing across all 5 campaign films.'
    },
    {
      id: 101,
      filmKey: 'master',
      filmLabel: 'Master Vehicle • Option 2',
      title: 'Unified Battery Pehlwan Mobile Lab Van (Option 2 — Aero Graphic Livery)',
      subtitle: 'Streamlined commercial response van with sport aero Alaska side graphics',
      url: 'https://res.cloudinary.com/dawlj9ne4/image/upload/Battery_Pehlwan_Branded_Veh_jog7cv.png',
      altOptionUrl: 'https://res.cloudinary.com/dawlj9ne4/image/upload/Battery_Pehlwan_Branded_Veh_op3_g0tgpa.png',
      badge: 'Aero Livery Option 2',
      mainVehicle: [
        'Sport-aero commercial high-roof van configuration with extended rear cargo bay',
        'Full side-profile livery featuring dynamic speed-chevron Alaska brand graphics',
        'Rapid-access side gullwing doors exposing high-speed battery replacement charging bay',
        'Equipped with quick-crank mobile booster packs and graphite plate telemetry screens'
      ],
      vehicleLook: [
        'Dynamic high-contrast Alaska Solar Gold & Ultra-Gloss Black accent scheme',
        'Bold typographic Alaska logo across flank with reflective safety micro-prisms',
        'Matte graphite alloy wheels with all-terrain emergency response tires',
        'Crisp aerodynamic presence calibrated for rapid highway & city interventions'
      ],
      props: [
        'Ultra-fast rapid-charge diagnostic dock with dual 12V/24V outputs',
        'Titanium-finish battery carrier handles and magnetic terminal alignment probes',
        'Wireless Bluetooth battery health analysis wand connected to mobile tablet',
        'Emergency roadside traffic warning beacon pillars and Alaska floor mats'
      ],
      artDirective: 'AERO LIVERY OPTION 2: Sleeker, motorsport-inspired rapid response aesthetic for high-speed urban transit commercial sequences.'
    },
    {
      id: 102,
      filmKey: 'master',
      filmLabel: 'Master Vehicle • Option 3',
      title: 'Unified Battery Pehlwan Mobile Lab Van (Option 3 — Heavy Utility Livery)',
      subtitle: 'Heavy-duty rugged dual-tone response unit with high-visibility emergency styling',
      url: 'https://res.cloudinary.com/dawlj9ne4/image/upload/Battery_Pehlwan_Branded_Veh_op3_g0tgpa.png',
      altOptionUrl: 'https://res.cloudinary.com/dawlj9ne4/image/upload/Battery_Pehlwan_Branded_Veh_op1_esdu3i.png',
      badge: 'Heavy Utility Option 3',
      mainVehicle: [
        'Reinforced heavy-duty commercial chassis with integrated front recovery winch & bull-bar',
        'Dual rear barn-doors with heavy slide-out steel tray holding commercial & tractor batteries',
        'Overhead LED floodlight illumination bar for night & storm emergencies',
        'Built-in 220V inverter generator powering heavy field oscilloscopes and load testers'
      ],
      vehicleLook: [
        'Industrial-grade high-durability finish with high-visibility reflective hazard striping',
        'Solid Arctic White base with bold Alaska Gold power-wave accents along the wheelbase',
        'Textured non-slip aluminum side-steps and heavy-duty roof rack for extra spare cells',
        'Maximum authority and rugged reliability for tough rural and industrial deployments'
      ],
      props: [
        'Heavy-duty industrial carbon-pile battery load tester and digital impedance analyzer',
        'Heavy tractor & truck commercial battery lifting harness and safety clamps',
        'Protective technician utility gloves, safety glasses, and heavy torque wrenches',
        'Portable high-output emergency floodlight tripod with Alaska branding'
      ],
      artDirective: 'HEAVY UTILITY OPTION 3: Maximum rugged durability and high-capacity rescue capability suited for agricultural and commercial freight breakdown scenarios.'
    },
    {
      id: 1,
      filmKey: 'car',
      filmLabel: 'Film 01 — Car Sequence',
      title: 'Car Sequence: Luxury Sedan & Traffic Breakdown Props Grid',
      subtitle: 'Modern executive vehicle breakdown & roadside emergency toolkit grid',
      url: 'https://res.cloudinary.com/dawlj9ne4/image/upload/Car_Seq_uj7m0o.png',
      badge: 'Film 01 — Car',
      mainVehicle: [
        'Full front three-quarter view, side profile, front view, and rear three-quarter view',
        'Bonnet-open view with detailed engine-bay and battery compartment visible',
        'Close-up of battery terminals, connection cables, wheel and headlight detail'
      ],
      vehicleLook: [
        'New, premium, expensive Pakistani luxury sedan',
        'Dark metallic grey, black or deep navy body; clean and well-maintained',
        'No visible brand logos, no text decals, generic unreadable number plate'
      ],
      props: [
        'Luxury car key & remote fob, open bonnet hardware, battery terminal cables',
        'Basic roadside emergency toolkit & small hand tools',
        'Reflective warning triangle, traffic cones, police traffic baton & whistle'
      ],
      artDirective: 'Clean square composition, pure white background, isolated objects and vehicle views, realistic automotive rendering.'
    },
    {
      id: 2,
      filmKey: 'truck',
      filmLabel: 'Film 02 — Truck Sequence',
      title: 'Truck Sequence: Refrigerated Cargo Truck & Fishing Port Props Grid',
      subtitle: 'Heavy-duty marine seafood logistics & port cold-chain breakdown props',
      url: 'https://res.cloudinary.com/dawlj9ne4/image/upload/Truck_Seq_wdek71.png',
      badge: 'Film 02 — Truck',
      mainVehicle: [
        'Large refrigerated cargo delivery truck (Front 3/4, side profile, front, rear 3/4)',
        'Bonnet-open view, heavy-duty engine-bay, and commercial truck battery compartment',
        'Refrigeration unit mounted above cabin, heavy commercial wheel & tyre detail'
      ],
      vehicleLook: [
        'Authentic Pakistani refrigerated delivery truck in practical working condition',
        'Light white/off-white body with refrigerated cargo box',
        'Slightly weathered but well-maintained, no decorative truck-art overload'
      ],
      props: [
        'Stacked plastic fish crates, large crates with fresh catch, fishing nets, coiled rope',
        'Heavy metal cargo hooks, insulated ice boxes, crushed ice, fish baskets',
        'Wooden dock crates and large insulated seafood containers'
      ],
      artDirective: 'Premium square asset sheet on clean white background, isolated & evenly spaced items, realistic commercial vehicle concept render.'
    },
    {
      id: 3,
      filmKey: 'tractor',
      filmLabel: 'Film 03 — Tractor Sequence',
      title: 'Tractor Sequence: Agricultural Tractor & Baraat Props Grid',
      subtitle: 'Field tractor, farming tools & festive Punjabi wedding celebration props',
      url: 'https://res.cloudinary.com/dawlj9ne4/image/upload/Tractor_Seq_jd8v1u.png',
      badge: 'Film 03 — Tractor',
      mainVehicle: [
        'Punjabi agricultural tractor (Front 3/4, side profile, front view, rear 3/4)',
        'Bonnet-open view, engine and battery compartment detail, agricultural wheels',
        'Front grille detail and heavy-duty battery terminal connections'
      ],
      vehicleLook: [
        'Authentic modern Pakistani farm tractor, powerful working vehicle',
        'Clean enough for commercial shoot, slightly dusty from agricultural use',
        'No visible manufacturer logos, text decals, or unnecessary modifications'
      ],
      props: [
        'Farm: Traditional farming tools, metal spanner, tractor battery, coiled rope, wooden crate, wheat bundles',
        'Baraat: Punjabi dhol & sticks, colourful wedding safa/turban, decorative umbrella, floral garlands, traditional khussa footwear, flower petals'
      ],
      artDirective: 'Premium film vehicle and props development sheet, square composition, clean white background, rich material details.'
    },
    {
      id: 4,
      filmKey: 'bike',
      filmLabel: 'Film 04 — Bike Sequence',
      title: 'Motorcycle Sequence: Commuter Motorcycle & Interview Props Grid',
      subtitle: 'Everyday urban motorcycle & high-stakes job interview candidate essentials',
      url: 'https://res.cloudinary.com/dawlj9ne4/image/upload/Bike_cuffkf.png',
      badge: 'Film 04 — Bike',
      mainVehicle: [
        'Practical Pakistani commuter motorcycle (Front 3/4, side profile, front, rear 3/4)',
        'Detailed engine view, motorcycle battery compartment, battery removed, open side panel',
        'Wheel and tyre detail, handlebar and rearview mirrors detail'
      ],
      vehicleLook: [
        'Authentic everyday Pakistani commuter motorcycle, practical and slightly used',
        'Reliable working condition, no racing modifications, no sports-bike styling',
        'No visible manufacturer branding or text decals, generic number plate'
      ],
      props: [
        'Motorcycle safety helmet, job interview file folder, printed CV resume papers',
        'Official interview appointment letter, wristwatch, smartphone showing generic map',
        'Motorcycle kick-start lever detail, basic roadside tool kit, battery cables'
      ],
      artDirective: 'Clean premium square production-design sheet, isolated motorcycle and props on pure white background, professional automotive presentation.'
    },
    {
      id: 5,
      filmKey: 'ups',
      filmLabel: 'Film 05 — UPS Sequence',
      title: 'UPS / Wedding Home: Electrical & Wedding Home Props Grid',
      subtitle: 'Inverter unit, deep-cycle battery, wedding morning appliances & comedy plate box',
      url: 'https://res.cloudinary.com/dawlj9ne4/image/upload/Wedding_zgf47s.png',
      badge: 'Film 05 — UPS',
      mainVehicle: [
        'Modern household UPS / inverter unit and deep-cycle battery (hero product view)',
        'Battery cable and terminal details, inverter connection cables',
        'Electrical switchboard, extension board, and heavy-duty power plugs'
      ],
      vehicleLook: [
        'Pristine modern domestic power backup system with thick heavy plates construction',
        'Clean commercial household finish suitable for heritage Lahore home'
      ],
      props: [
        'Wedding Appliances: Electric kettle, blender, clothes iron, hair dryer, pedestal fan, ceiling fan, table lamp, string lights, light bulbs',
        'Wedding Preparation: Suitcase with groom clothes, folded kurta, waistcoat, traditional khussa, safa, ironing board, tea cups, garlands',
        'KEY COMEDY PROP: Large humorous household carton filled with ordinary household dinner plates for the final comedy scene'
      ],
      artDirective: 'Clean premium square production-design asset sheet, pure white background, isolated objects floating in neat editorial grid.'
    }
  ];

  const filteredVehicleProps = vehiclePropSheets.filter(v => {
    if (vehicleFilter === 'all') return true;
    return v.filmKey === vehicleFilter;
  });

  const locationsList = [
    {
      id: 'loc-1',
      title: 'Food Street / Badshahi Masjid Area',
      city: 'Old Lahore, Punjab',
      film: 'Film 01 — Car (Major Traffic Jam)',
      coordinates: '31.5881° N, 74.3106° E',
      type: 'Historic Monument Perimeter & Dense Urban Artery',
      permits: 'Walled City of Lahore Authority (WCLA) & City Traffic Police Lahore (CTPL)',
      baseCamp: 'Hazuri Bagh / Fort Road Staging Bay',
      lightingWindow: '06:00 AM – 11:30 AM (Morning Golden Sun & Heat Shimmer)',
      productionDesign: [
        'Major traffic congestion with bumper-to-bumper gridlock',
        'Luxury executive car stalled with bonnet open and heat shimmer',
        'Multiple commuter vehicles, motorcycles, auto-rickshaws',
        'Heavy public movement, pedestrians, street vendors',
        'Badshahi Mosque architecture visible in backdrop where possible'
      ],
      visualGoal: 'A major Pakistani landmark combined with an everyday battery emergency. The environment should feel: Busy, Chaotic, Premium, Cinematic.',
      keyVisual: 'Luxury car breakdown causes total traffic paralysis right against the majestic backdrop of Badshahi Mosque before Battery Expert and his technical crew make their arrival.',
      refImage: 'https://res.cloudinary.com/dawlj9ne4/image/upload/car_seq_location_daydas.png',
      icon: Car,
    },
    {
      id: 'loc-2',
      title: 'Ibrahim Hyderi Fishing Port',
      city: 'Karachi, Sindh',
      film: 'Film 02 — Truck (Fishing Port Logistics)',
      coordinates: '24.7933° N, 67.1352° E',
      type: 'Authentic Marine Fishing Harbor & Wooden Jetty',
      permits: 'Karachi Port Trust (KPT), Fishermen Cooperative & Coastal District Admin',
      baseCamp: 'Ibrahim Hyderi Marine Compound Staging Area',
      lightingWindow: '05:30 AM – 10:30 AM (Dawn Sea Mist & High Tide)',
      productionDesign: [
        'Hundreds of traditional carved wooden fishing boats docked',
        'Weathered wooden piers, hanging fishing nets & fish crates',
        'Active dock workers carrying ice blocks & seafood trays',
        'Refrigerated seafood transport truck with dead battery',
        'Small roadside charpai & authentic roadside tea/chai setup'
      ],
      visualGoal: 'The contrast between traditional fishing port and massive mobile battery laboratory should create immediate visual comedy.',
      keyVisual: 'Iftikhar Thakur casually drinking hot chai on a wooden charpai near the fishing boats while the truck seafood crisis develops, until the large Alaska mobile laboratory truck enters the harbor.',
      refImage: 'https://res.cloudinary.com/dawlj9ne4/image/upload/Truck_location_en8hv0.png',
      icon: Anchor,
    },
    {
      id: 'loc-3',
      title: 'Agricultural Fields near Kareem Block / Wahdat Road',
      city: 'Lahore, Punjab',
      film: 'Film 03 — Tractor (Baraat in the Field)',
      coordinates: '31.5085° N, 74.2882° E',
      type: 'Lush Agri Farmland & Vast Open Horizon',
      permits: 'Local Landowners Agreement & District Administration Lahore',
      baseCamp: 'Kareem Block Perimeter Agronomy Center',
      lightingWindow: '07:00 AM – 05:30 PM (Full Daylight, Magic Hour & Sunset)',
      productionDesign: [
        'Large open agricultural space with long panoramic horizon line',
        'Working agricultural tractor access with soil furrows',
        'Designated maneuvering space for the Alaska laboratory caravan',
        'Clear, defined pathway for dynamic Baraat procession movement & Dhol players',
        'Expansive open field for dynamic crane/drone final wide shot'
      ],
      visualGoal: 'The baraat must be visible in the distance before becoming part of the comedy. The field should allow: Baraat far away -> Baraat approaching -> Baraat becomes chorus -> Baraat disappears in the opposite direction.',
      keyVisual: 'The red tractor breakdown stops the lively Punjabi wedding Baraat in the middle of golden fields, turning the procession into a celebratory musical chorus when Alaska Battery Expert arrives.',
      refImage: 'https://res.cloudinary.com/dawlj9ne4/image/upload/Tractor_seq_1_kqpwwa.png',
      icon: Tractor,
    },
    {
      id: 'loc-4',
      title: 'Packages Mall — Outdoor Promenade Zone (Walton Road)',
      city: 'Lahore, Punjab',
      film: 'Film 04 — Bike (Interview Transit)',
      coordinates: '31.4745° N, 74.3562° E',
      type: 'Modern Urban Commercial Promenade & Glass Facade Plaza',
      permits: 'Packages Mall Management & Security Operations Directorate',
      baseCamp: 'Packages Mall North Logistics & Staging Concourse',
      lightingWindow: '07:30 AM – 12:30 PM (Crisp Morning Metropolitan Daylight)',
      productionDesign: [
        'Modern urban promenade with clean contemporary architectural lines',
        'Flow of smartly dressed young corporate professionals',
        'Controlled roadway / designated motorcycle transition lane',
        'Stressed job candidate in formal business suit',
        'Visible commercial environment with high-end glass storefronts'
      ],
      visualGoal: 'The clean, modern commercial location makes the absurd arrival of the Battery Expert and his mobile pit-crew all the more visually entertaining and impactful.',
      keyVisual: 'A suited young candidate is anxiously pushing a stalled 125cc motorcycle while constantly checking his watch, when the high-tech Alaska response unit swarms in with lightning speed.',
      refImage: 'https://res.cloudinary.com/dawlj9ne4/image/upload/Bike_Seq_Loc_qgltqe.png',
      icon: Building,
    },
    {
      id: 'loc-5',
      title: 'Fakir Khana Museum Haveli (or Heritage Residence)',
      city: 'Bhati Gate, Old Lahore',
      film: 'Film 05 — UPS / Inverter (Wedding Home Blackout)',
      coordinates: '31.5839° N, 74.3168° E',
      type: 'Historic 18th-Century Heritage Haveli & Living Courtyard',
      permits: 'Fakir Khana Trust & Heritage Directorate Agreement',
      baseCamp: 'Bhati Gate Courtyard & Technical Power Compound',
      lightingWindow: '03:00 PM – 11:30 PM (Dusk Warm Ambience to Dramatic Night Blackout)',
      productionDesign: [
        'The house must feel completely alive with frenetic wedding preparations',
        'Kitchen activity: brewing steaming tea, blenders roaring, food prep',
        'High-power appliances running: electric iron, hair dryers, ceiling fans',
        'Thousands of decorative fairy lights & marigold floral garlands (Haar)',
        'Baraat family members bustling with festive wedding clothes, gifts, open luggage',
        'Central heavy-duty UPS / Inverter setup connected to home distribution board'
      ],
      visualGoal: 'The entire house is buzzing and alive. Then: LIGHTS OUT. Everything instantly freezes in dead silence and comic shock. Alaska Battery Expert restores radiant illumination.',
      keyVisual: 'Complete home blackout freezes Thakur and the wedding household in comical midway poses, until the Battery Expert powers up the Alaska Inverter Battery, exploding the house back into vibrant light.',
      refImage: 'https://res.cloudinary.com/dawlj9ne4/image/upload/UPS_Location_ldzp72.png',
      icon: Home,
    },
    {
      id: 'loc-6',
      title: 'Evernew Studios (Studio Soundstage)',
      city: 'Multan Road, Lahore',
      film: 'Technical Battery Laboratory & Macro Product Inserts',
      coordinates: '31.4800° N, 74.3000° E',
      type: 'Professional Film Soundstage & Controlled Lighting Grid',
      permits: 'Evernew Studios Operations & Booking Management',
      baseCamp: 'Evernew Studios Soundstage Facility & Dressing Rooms',
      lightingWindow: '24/7 Controlled Studio Grid (5600K Clean Diagnostic Daylight)',
      productionDesign: [
        'Precision soundproof studio stage with motorized overhead lighting grid',
        'High-speed Phantom Flex 4K camera rig for 1000 FPS macro liquid & spark shots',
        'Specialized 1:1 scale Alaska graphite battery internal cutaway stage',
        'Cryogenic cold-steam injectors simulating super-cooling graphite technology',
        'High-voltage diagnostic oscilloscope benches and digital LED voltmeters'
      ],
      visualGoal: 'Hyper-stylized, razor-sharp technical diagnostic world showcasing the internal graphite engineering, instant cranking power, and 9-Month Replacement Warranty of Alaska Batteries.',
      keyVisual: 'Super slow-motion macro reveal of internal graphite plates and controlled pyrotechnic spark ignition upon terminal connection.',
      refImage: 'https://res.cloudinary.com/dawlj9ne4/image/upload/Studio_Seq_gsrnsm.png',
      icon: Camera,
    }
  ];

  const handleCopyContract = () => {
    navigator.clipboard.writeText(chapter.fullText);
    setCopiedContract(true);
    setTimeout(() => setCopiedContract(false), 2500);
  };

  return (
    <div className="space-y-8 font-sans">
      
      {/* 1. TOP DOCKET / TAB NAVIGATION BAR */}
      <div className="bg-zinc-900 text-white p-2 sm:p-2.5 rounded-2xl border border-zinc-800 shadow-md">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          
          <button
            onClick={() => setActiveTab('wardrobe')}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'wardrobe'
                ? 'bg-[#c69a53] text-black shadow-md font-extrabold'
                : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Wardrobe & Casting Sheets</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
              activeTab === 'wardrobe' ? 'bg-black/20 text-black' : 'bg-zinc-800 text-zinc-400'
            }`}>
              {characterSheets.length} Sheets
            </span>
          </button>

          <button
            onClick={() => setActiveTab('vehicles-props')}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'vehicles-props'
                ? 'bg-[#c69a53] text-black shadow-md font-extrabold'
                : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
            }`}
          >
            <Boxes className="w-4 h-4" />
            <span>Vehicle & Prop Grids</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
              activeTab === 'vehicles-props' ? 'bg-black/20 text-black' : 'bg-zinc-800 text-zinc-400'
            }`}>
              {vehiclePropSheets.length} Grids
            </span>
          </button>

          <button
            onClick={() => setActiveTab('films')}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'films'
                ? 'bg-[#c69a53] text-black shadow-md font-extrabold'
                : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
            }`}
          >
            <Film className="w-4 h-4" />
            <span>Master Rules by Film</span>
          </button>

          <button
            onClick={() => setActiveTab('mobile-labs')}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'mobile-labs'
                ? 'bg-[#c69a53] text-black shadow-md font-extrabold'
                : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Mobile Labs & Sets</span>
          </button>

          <button
            onClick={() => setActiveTab('color-priorities')}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'color-priorities'
                ? 'bg-[#c69a53] text-black shadow-md font-extrabold'
                : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>Color & Priorities</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Directives
            </span>
          </button>

          <button
            onClick={() => setActiveTab('locations')}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'locations'
                ? 'bg-[#c69a53] text-black shadow-md font-extrabold'
                : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Locations & Map</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
              activeTab === 'locations' ? 'bg-black/20 text-black' : 'bg-zinc-800 text-zinc-400'
            }`}>
              6 Hubs
            </span>
          </button>

          <button
            onClick={() => setActiveTab('moodboard')}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'moodboard'
                ? 'bg-[#c69a53] text-black shadow-md font-extrabold'
                : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Location Moodboard</span>
          </button>

          <button
            onClick={() => setActiveTab('contract')}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'contract'
                ? 'bg-[#c69a53] text-black shadow-md font-extrabold'
                : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Talent Agreement</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Legal
            </span>
          </button>

          <div className="ml-auto">
            <button
              onClick={onDownloadPdf}
              disabled={isGeneratingPdf}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md ${
                isGeneratingPdf
                  ? 'bg-zinc-700 text-zinc-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-extrabold hover:shadow-lg active:scale-98'
              }`}
              title="Download Complete Art, Vehicles, Locations & Talent Lookbook PDF"
            >
              <Download className={`w-4 h-4 ${isGeneratingPdf ? 'animate-bounce' : ''}`} />
              <span>{isGeneratingPdf ? 'Generating PDF...' : 'Download Full PDF'}</span>
            </button>
          </div>

        </div>
      </div>

      {/* 2. TAB CONTENT: WARDROBE & CASTING (All 10 Image Sheets with Specs) */}
      {activeTab === 'wardrobe' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Header Banner with Campaign Visual World Statement */}
          <div className="p-5 sm:p-6 bg-gradient-to-r from-zinc-900 via-zinc-850 to-zinc-900 text-white rounded-2xl border border-zinc-800 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#c69a53]">
                  <Sparkles className="w-3.5 h-3.5" /> ALASKA BATTERIES • BATTERY EXPERT
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white font-heading mt-1">
                  Production Design Master Sheet & 10 Wardrobe Sheets
                </h3>
              </div>

              {/* Quick Filter Buttons */}
              <div className="flex flex-wrap gap-1.5 bg-zinc-800/90 p-1.5 rounded-xl border border-zinc-700">
                {[
                  { id: 'all', label: 'All 16 Sheets' },
                  { id: 'master', label: 'Main Wardrobe' },
                  { id: 'car', label: 'Car Seq' },
                  { id: 'bike', label: 'Bike Seq' },
                  { id: 'truck', label: 'Truck Seq' },
                  { id: 'tractor', label: 'Tractor Seq' },
                  { id: 'ups', label: 'UPS Seq' },
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setCharacterFilter(f.id as any)}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                      characterFilter === f.id
                        ? 'bg-[#c69a53] text-black shadow-xs font-extrabold'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-700/50'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Campaign Visual World Principles Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-zinc-800 text-xs">
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase text-[#c69a53] tracking-wider block">
                  01. Campaign Visual World — Overall Look
                </span>
                <p className="text-zinc-300 leading-relaxed">
                  Contemporary Pakistani realism with heightened comic situations. The world feels: <strong className="text-white">Authentic, Cinematic, Premium, Warm, Lived-in, Highly detailed, and Recognizably Pakistani.</strong>
                </p>
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase text-[#c69a53] tracking-wider block">
                  02. Central Visual Device & Separation Rule
                </span>
                <p className="text-zinc-300 leading-relaxed">
                  Iftikhar Thakur appears as different characters in each film, while the <strong className="text-white">Battery Expert look remains visually consistent</strong>: Clean white lab coat, neutral shalwar qameez underneath, and <span className="text-amber-400 font-bold">ABSOLUTELY NO HEADWEAR</span>.
                </p>
              </div>
            </div>
          </div>

          {/* 16 Character Sheets Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredCharacters.map((char) => (
              <div
                key={char.id}
                onClick={() => {
                  if (char.url) onImageClick(char.id);
                }}
                className={`group flex flex-col bg-white rounded-2xl border border-zinc-200 shadow-sm hover:shadow-xl hover:border-[#c69a53]/80 transition-all duration-300 overflow-hidden ${
                  char.url ? 'cursor-pointer' : 'cursor-default'
                }`}
              >
                {/* Header Strip */}
                <div className="px-5 py-3.5 bg-zinc-50 border-b border-zinc-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#b8860b] block font-mono">
                      Sheet {char.id < 9 ? `0${char.id + 1}` : `${char.id + 1}`} • {char.filmLabel}
                    </span>
                    <h4 className="text-sm sm:text-base font-bold text-zinc-900 group-hover:text-[#b8860b] transition-colors">
                      {char.title}
                    </h4>
                  </div>
                  {char.url ? (
                    <span className="text-[11px] font-semibold text-zinc-500 bg-white border border-zinc-200 px-2.5 py-1 rounded-full flex items-center gap-1.5 group-hover:border-[#c69a53] group-hover:text-[#b8860b] transition-all shadow-2xs">
                      <ZoomIn className="w-3.5 h-3.5" /> Enlarge
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full flex items-center gap-1">
                      Spec Sheet Ready
                    </span>
                  )}
                </div>

                {/* Character Sheet Visual Image Frame */}
                <div className="relative w-full aspect-[4/3] bg-zinc-950 flex items-center justify-center p-2 sm:p-3 overflow-hidden">
                  {char.url ? (
                    <>
                      <img
                        src={char.url}
                        alt={char.title}
                        className="w-full h-full object-contain rounded-lg transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                        loading="lazy"
                      />
                      {/* Subtle Hover Overlay */}
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                        <span className="px-4 py-2 bg-zinc-900/90 text-white rounded-full text-xs font-semibold tracking-wide shadow-xl backdrop-blur-md flex items-center gap-2">
                          <ZoomIn className="w-4 h-4 text-[#c69a53]" />
                          <span>Click to Enlarge Sheet & Inspect</span>
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center p-6 space-y-3 bg-zinc-900/90 w-full h-full rounded-lg border border-zinc-800">
                      <div className="w-14 h-14 rounded-2xl bg-zinc-800/80 border border-[#c69a53]/40 flex items-center justify-center text-[#c69a53]">
                        <Camera className="w-7 h-7" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white block">Visual Reference Sheet</span>
                        <span className="text-[11px] text-zinc-400 block mt-0.5">Image link to be linked shortly • Specifications approved below</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Character Details & Specs */}
                <div className="p-4 sm:p-5 bg-white space-y-3.5 flex-1 flex flex-col justify-between">
                  <div className="space-y-2.5">
                    
                    {/* Role & Actor Bar */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-zinc-800">{char.actor}</span>
                      <span className="font-semibold text-amber-900 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 text-[11px]">
                        {char.role}
                      </span>
                    </div>

                    {/* Wardrobe Breakdown Bullet Points */}
                    <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-100 space-y-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">
                        Wardrobe Specifications:
                      </span>
                      <ul className="space-y-1 text-xs text-zinc-700">
                        {char.wardrobePoints.map((pt, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-[#c69a53] font-bold">•</span>
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Headwear & Visual Rule Highlights */}
                    <div className="space-y-1 text-xs">
                      <div className="p-2 bg-amber-50/80 border border-amber-200/80 rounded-lg text-amber-900 text-[11px]">
                        <strong>Headwear Rule: </strong>{char.headRule}
                      </div>
                      <p className="text-[11px] text-zinc-500 pt-1 leading-snug">
                        <strong>Performance Tone: </strong>{char.performance}
                      </p>
                    </div>

                  </div>

                  <div className="pt-2.5 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-400">
                    <span>Key Rule: {char.visualRule.split('.')[0]}</span>
                    <span className="font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      Approved Sheet
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* 2B. TAB CONTENT: VEHICLE & PROP GRIDS (Parallel Production Design Package) */}
      {activeTab === 'vehicles-props' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Header Banner */}
          <div className="p-5 sm:p-6 bg-gradient-to-r from-zinc-900 via-zinc-850 to-zinc-900 text-white rounded-2xl border border-zinc-800 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#c69a53]">
                  <Boxes className="w-3.5 h-3.5" /> PRODUCTION DESIGN • VEHICLE & PROPS PACKAGE
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white font-heading mt-1">
                  Vehicle & Prop Design Grids (Parallel to Wardrobe)
                </h3>
                <p className="text-xs text-zinc-400 mt-1 max-w-3xl">
                  Comprehensive 5-sequence production design asset sheets detailing hero vehicles, specialized technical hardware, diagnostic telemetry, and sequence-specific props.
                </p>
              </div>

              {/* Quick Sequence Filter Buttons */}
              <div className="flex flex-wrap gap-1.5 bg-zinc-800/90 p-1.5 rounded-xl border border-zinc-700">
                <button
                  onClick={() => setVehicleFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    vehicleFilter === 'all'
                      ? 'bg-[#c69a53] text-black font-extrabold shadow-xs'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  All ({vehiclePropSheets.length})
                </button>
                <button
                  onClick={() => setVehicleFilter('master')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    vehicleFilter === 'master'
                      ? 'bg-[#c69a53] text-black font-extrabold shadow-xs'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Pehlwan Van
                </button>
                <button
                  onClick={() => setVehicleFilter('car')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    vehicleFilter === 'car'
                      ? 'bg-[#c69a53] text-black font-extrabold shadow-xs'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Car
                </button>
                <button
                  onClick={() => setVehicleFilter('truck')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    vehicleFilter === 'truck'
                      ? 'bg-[#c69a53] text-black font-extrabold shadow-xs'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Truck
                </button>
                <button
                  onClick={() => setVehicleFilter('tractor')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    vehicleFilter === 'tractor'
                      ? 'bg-[#c69a53] text-black font-extrabold shadow-xs'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Tractor
                </button>
                <button
                  onClick={() => setVehicleFilter('bike')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    vehicleFilter === 'bike'
                      ? 'bg-[#c69a53] text-black font-extrabold shadow-xs'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Bike
                </button>
                <button
                  onClick={() => setVehicleFilter('ups')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    vehicleFilter === 'ups'
                      ? 'bg-[#c69a53] text-black font-extrabold shadow-xs'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  UPS
                </button>
              </div>
            </div>

            {/* Master Vehicle Consistency Mandate Box */}
            <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-start gap-3 text-xs text-amber-200">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-300">Unified Master Vehicle Architecture: </strong>
                One consistent Alaska Battery Pehlwan Mobile Emergency Van is deployed across all 5 commercial films to establish immediate brand identity and high-tech credibility. Individual sequence vehicles (Sedan, Cargo Truck, Farm Tractor, Commuter Motorcycle, UPS Inverter) represent the distressed consumer setting.
              </div>
            </div>
          </div>

          {/* Grid of Vehicle & Prop Sheets */}
          <div className="grid grid-cols-1 gap-6">
            {filteredVehicleProps.map((sheet) => {
              const galleryIdx = chapter.galleryImages?.findIndex(g => g.url === sheet.url);
              const activeIndex = galleryIdx !== -1 && galleryIdx !== undefined ? galleryIdx : 0;

              return (
                <div
                  key={sheet.id}
                  className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-all group"
                >
                  {/* Sheet Header */}
                  <div className="bg-zinc-900 text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800">
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-mono font-bold bg-[#c69a53] text-black px-2.5 py-0.5 rounded-md">
                        {sheet.filmLabel}
                      </span>
                      <h4 className="text-sm sm:text-base font-bold text-white tracking-tight">
                        {sheet.title}
                      </h4>
                    </div>
                    <span className="text-[11px] font-semibold text-zinc-300 bg-zinc-800 px-3 py-1 rounded-full border border-zinc-700">
                      {sheet.badge}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    
                    {/* Left Showcase (High-Res Asset Image with Zoom) */}
                    <div className="lg:col-span-5 flex flex-col gap-3">
                      <div
                        onClick={() => onImageClick(activeIndex)}
                        className="relative w-full aspect-square bg-zinc-950 rounded-xl overflow-hidden cursor-pointer border border-zinc-800 flex items-center justify-center group/img shadow-inner"
                      >
                        <img
                          src={sheet.url}
                          alt={sheet.title}
                          className="w-full h-full object-contain p-2 group-hover/img:scale-102 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <span className="px-3 py-1.5 bg-black/80 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 backdrop-blur-xs border border-white/20">
                            <ZoomIn className="w-3.5 h-3.5 text-[#c69a53]" /> Click to Inspect 4K Grid
                          </span>
                        </div>
                      </div>

                      {sheet.altOptionUrl && (
                        <div className="flex items-center justify-between text-xs bg-zinc-50 p-2.5 rounded-xl border border-zinc-200">
                          <span className="text-zinc-600 font-medium">Alternative Livery Concept:</span>
                          <button
                            onClick={() => {
                              const altIdx = chapter.galleryImages?.findIndex(g => g.url === sheet.altOptionUrl);
                              if (altIdx !== -1 && altIdx !== undefined) onImageClick(altIdx);
                            }}
                            className="text-[#b8860b] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" /> View Option 2 Livery
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Right Specifications (4-Box Grid) */}
                    <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      {/* Box 1: Main Vehicle & Diagnostics */}
                      <div className="bg-zinc-50 rounded-xl p-4 border border-zinc-200 space-y-2">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-900 uppercase tracking-wider">
                          <Car className="w-3.5 h-3.5 text-[#c69a53]" />
                          <span>Main Vehicle & Diagnostic Hardware</span>
                        </div>
                        <ul className="space-y-1.5 text-xs text-zinc-700">
                          {sheet.mainVehicle.map((pt, pIdx) => (
                            <li key={pIdx} className="flex items-start gap-1.5">
                              <span className="text-[#c69a53] font-bold mt-0.5">•</span>
                              <span className="leading-snug">{pt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Box 2: Vehicle Realism & Finishes */}
                      <div className="bg-zinc-50 rounded-xl p-4 border border-zinc-200 space-y-2">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-900 uppercase tracking-wider">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Vehicle Realism & Finishes</span>
                        </div>
                        <ul className="space-y-1.5 text-xs text-zinc-700">
                          {sheet.vehicleLook.map((pt, pIdx) => (
                            <li key={pIdx} className="flex items-start gap-1.5">
                              <span className="text-emerald-600 font-bold mt-0.5">•</span>
                              <span className="leading-snug">{pt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Box 3: Production Props */}
                      <div className="bg-zinc-50 rounded-xl p-4 border border-zinc-200 space-y-2">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-900 uppercase tracking-wider">
                          <Package className="w-3.5 h-3.5 text-amber-700" />
                          <span>Production & Narrative Props</span>
                        </div>
                        <ul className="space-y-1.5 text-xs text-zinc-700">
                          {sheet.props.map((pt, pIdx) => (
                            <li key={pIdx} className="flex items-start gap-1.5">
                              <span className="text-amber-700 font-bold mt-0.5">•</span>
                              <span className="leading-snug">{pt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Box 4: Art Department Directive */}
                      <div className="bg-amber-50/70 rounded-xl p-4 border border-amber-200 space-y-2 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 uppercase tracking-wider">
                            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                            <span>Art Department Directive</span>
                          </div>
                          <p className="text-xs text-amber-950 font-medium leading-relaxed mt-2">
                            {sheet.artDirective}
                          </p>
                        </div>
                        <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between text-[11px] text-amber-800">
                          <span>Status: Approved Grid</span>
                          <span className="font-mono font-bold">2026 Production Window</span>
                        </div>
                      </div>

                    </div>

                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* 3. TAB CONTENT: MASTER RULES BY FILM (Detailed Breakdown) */}
      {activeTab === 'films' && (
        <div className="space-y-6 animate-fadeIn">
          
          <div className="p-5 bg-gradient-to-r from-zinc-900 via-zinc-850 to-zinc-900 text-white rounded-2xl border border-zinc-800">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#c69a53]">
              <Film className="w-3.5 h-3.5" /> Official Production Design Breakdown
            </div>
            <h3 className="text-xl font-bold text-white font-heading mt-1">
              Film-by-Film Character Transformations & Wardrobe Separation Rules
            </h3>
            <p className="text-xs text-zinc-300 mt-1 max-w-2xl">
              The central visual device of the campaign is that Iftikhar Thakur appears as different characters in different situations, while the Battery Expert version remains visually consistent.
            </p>
          </div>

          {/* Master Look Banner */}
          <div className="bg-zinc-900 text-white p-6 rounded-2xl border border-zinc-800 shadow-md space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-amber-500/20 text-[#c69a53] rounded-xl border border-amber-500/30">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#c69a53]">
                    02. Main Talent Master Look
                  </span>
                  <h4 className="text-lg font-bold text-white">
                    A. Battery Expert — Master Look (Iftikhar Thakur)
                  </h4>
                </div>
              </div>
              <span className="text-xs font-bold px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full w-fit">
                Appears in All 5 Commercial Films
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-zinc-300">
              <div className="bg-zinc-800/80 p-4 rounded-xl border border-zinc-700 space-y-2">
                <strong className="text-white block text-sm">Wardrobe Direction:</strong>
                <ul className="space-y-1 text-zinc-300">
                  <li>• Clean white laboratory coat</li>
                  <li>• Crisp, practical and contemporary</li>
                  <li>• White or very light neutral shalwar qameez underneath</li>
                  <li>• Minimal styling, no tie, no medical costume clichés</li>
                  <li>• No gloves unless required for a technical action</li>
                </ul>
              </div>

              <div className="bg-zinc-800/80 p-4 rounded-xl border border-zinc-700 space-y-2">
                <strong className="text-white block text-sm">Head & Appearance:</strong>
                <div className="p-2.5 bg-red-950/60 border border-red-800/80 rounded-lg text-red-200 text-xs font-bold">
                  ⚠️ ABSOLUTELY NO CAP, NO TURBAN AND NO HEADWEAR.
                </div>
                <p className="text-zinc-300">
                  Recognizable Iftikhar Thakur face. Clean, professional presentation. Slightly serious, experienced, confident, technically authoritative.
                </p>
              </div>

              <div className="bg-zinc-800/80 p-4 rounded-xl border border-zinc-700 space-y-2">
                <strong className="text-white block text-sm">Performance & Key Visual Rule:</strong>
                <p className="text-zinc-300">
                  He should feel like a combination of senior surgeon, technical scientist, and emergency-response expert — but still unmistakably Iftikhar Thakur.
                </p>
                <div className="p-2.5 bg-amber-500/15 border border-amber-500/30 rounded-lg text-amber-300 font-bold">
                  Rule: The Battery Expert must always feel cleaner, sharper and more premium than the character version of Thakur.
                </div>
              </div>
            </div>
          </div>

          {/* Film 01 to Film 05 Detailed Grid */}
          <div className="space-y-4">
            
            {/* Film 01 - Car */}
            <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="p-2 bg-amber-50 rounded-lg text-amber-800 font-bold text-xs">
                    03.01
                  </span>
                  <h4 className="text-base font-bold text-zinc-900">
                    FILM 01 — CAR (Traffic Gridlock & Commute)
                  </h4>
                </div>
                <span className="text-xs text-zinc-500 font-mono">Location: Lahore Ring Road</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 space-y-2">
                  <strong className="text-zinc-900 block text-sm">Character Thakur: Traffic Policeman</strong>
                  <p className="text-zinc-700">
                    Authentic Pakistani traffic police uniform with official-style shirt, trousers, police cap, duty belt, naturally worn finish, and appropriate shoes.
                  </p>
                  <div className="text-zinc-600">
                    <strong>Personality: </strong>Stern, irritated, street-smart, confident.
                  </div>
                </div>

                <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 space-y-2">
                  <strong className="text-zinc-900 block text-sm">Battery Expert & Visual Separation:</strong>
                  <p className="text-zinc-700">
                    White laboratory coat, traditional light shalwar qameez underneath, NO police cap, NO headwear.
                  </p>
                  <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 font-bold">
                    Visual Separation: The Policeman and Battery Expert must never appear visually confused.
                  </div>
                </div>
              </div>
            </div>

            {/* Film 02 - Truck */}
            <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="p-2 bg-amber-50 rounded-lg text-amber-800 font-bold text-xs">
                    03.02
                  </span>
                  <h4 className="text-base font-bold text-zinc-900">
                    FILM 02 — TRUCK (Karachi Fish Harbor Logistics)
                  </h4>
                </div>
                <span className="text-xs text-zinc-500 font-mono">Location: Karachi Port Trust</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 space-y-2">
                  <strong className="text-zinc-900 block text-sm">Character Thakur: Truck Driver / Port Character</strong>
                  <p className="text-zinc-700">
                    Simple traditional shalwar qameez in earthy, practical fabric, weathered working look, comfortable sandals or traditional footwear.
                  </p>
                  <div className="p-2 bg-red-50 border border-red-200 rounded-lg text-red-900 font-bold">
                    Key Mandatory Rule: Truck Driver Thakur MUST ALWAYS wear the white Pathan cap.
                  </div>
                </div>

                <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 space-y-2">
                  <strong className="text-zinc-900 block text-sm">Battery Expert Contrast:</strong>
                  <p className="text-zinc-700">
                    White laboratory coat, traditional shalwar qameez underneath, NO Pathan cap, NO headwear.
                  </p>
                  <div className="text-zinc-600">
                    The crisp laboratory coat immediately establishes technical superiority against the rugged port environment.
                  </div>
                </div>
              </div>
            </div>

            {/* Film 03 - Tractor */}
            <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="p-2 bg-amber-50 rounded-lg text-amber-800 font-bold text-xs">
                    03.03
                  </span>
                  <h4 className="text-base font-bold text-zinc-900">
                    FILM 03 — TRACTOR (Wheat Harvest & Baraat)
                  </h4>
                </div>
                <span className="text-xs text-zinc-500 font-mono">Location: Sheikhupura Farms</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 space-y-2">
                  <strong className="text-zinc-900 block text-sm">Option 01: Punjabi Chaudhary</strong>
                  <ul className="space-y-1 text-zinc-700">
                    <li>• Vibrant red turban / safa with yellow polka dots</li>
                    <li>• Traditional fan-style front knot</li>
                    <li>• Mustard-yellow kurta & matching dhoti/lacha</li>
                    <li>• Red floral-print stole & traditional khussa</li>
                    <li>• Handlebar moustache & comic wrench prop</li>
                  </ul>
                </div>

                <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 space-y-2">
                  <strong className="text-zinc-900 block text-sm">Option 02: Traditional Boski Elder</strong>
                  <ul className="space-y-1 text-zinc-700">
                    <li>• Starched pristine white Cotton Boski Kurta Pajama</li>
                    <li>• Traditional starched Punjabi turban</li>
                    <li>• Handmade Tilla Khussa & carved cane</li>
                    <li>• Wise, grounded traditional grandfather aura</li>
                  </ul>
                </div>

                <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 space-y-2">
                  <strong className="text-zinc-900 block text-sm">Battery Expert Contrast:</strong>
                  <p className="text-zinc-700">
                    White laboratory coat, traditional shalwar qameez, NO turban, NO headwear.
                  </p>
                  <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 font-bold">
                    Clear visual shock when Battery Expert arrives without headwear in the rural field.
                  </div>
                </div>
              </div>
            </div>

            {/* Film 04 - Bike */}
            <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="p-2 bg-amber-50 rounded-lg text-amber-800 font-bold text-xs">
                    03.04
                  </span>
                  <h4 className="text-base font-bold text-zinc-900">
                    FILM 04 — BIKE (Morning Rush & Interview Transit)
                  </h4>
                </div>
                <span className="text-xs text-zinc-500 font-mono">Location: Blue Area Islamabad</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 space-y-2">
                  <strong className="text-zinc-900 block text-sm">Character Thakur: Typical Street Morning Man</strong>
                  <p className="text-zinc-700">
                    Casual Pakistani home clothing: simple vest or T-shirt, everyday shalwar, rubber slippers, and a toothbrush in the opening shot. The look feels instantly recognizable and real.
                  </p>
                </div>

                <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 space-y-2">
                  <strong className="text-zinc-900 block text-sm">Battery Expert:</strong>
                  <p className="text-zinc-700">
                    White laboratory coat, traditional shalwar qameez, NO headwear. Far more polished and authoritative than the ordinary morning character.
                  </p>
                </div>
              </div>
            </div>

            {/* Film 05 - UPS */}
            <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="p-2 bg-amber-50 rounded-lg text-amber-800 font-bold text-xs">
                    03.05
                  </span>
                  <h4 className="text-base font-bold text-zinc-900">
                    FILM 05 — UPS / INVERTER (Wedding Home Blackout)
                  </h4>
                </div>
                <span className="text-xs text-zinc-500 font-mono">Location: Model Town Haveli</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 space-y-2">
                  <strong className="text-zinc-900 block text-sm">Character Thakur: Wedding Guest</strong>
                  <p className="text-zinc-700">
                    Traditional formal Pakistani wedding outfit, tasteful waistcoat, light festive styling, elegant but not overly groomed. Fits naturally inside an old Lahore wedding home.
                  </p>
                </div>

                <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 space-y-2">
                  <strong className="text-zinc-900 block text-sm">Battery Expert:</strong>
                  <p className="text-zinc-700">
                    White laboratory coat, traditional shalwar qameez, NO headwear. Delivers instant power restoration with high-tech poise.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 04 - The Team */}
            <div className="bg-zinc-900 text-white rounded-2xl border border-zinc-800 p-6 shadow-md space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-500/20 text-[#c69a53] rounded-xl border border-amber-500/30">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#c69a53]">
                    04. The Technical Response Unit
                  </span>
                  <h4 className="text-base font-bold text-white">
                    The Alaska Battery Expert Team — Modern Battery Specialists
                  </h4>
                </div>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                The team should NOT look like hospital staff. They are modern battery technology specialists.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-zinc-800 p-3.5 rounded-xl border border-zinc-700 space-y-1">
                  <strong className="text-white block">Wardrobe Direction:</strong>
                  <ul className="space-y-1 text-zinc-300">
                    <li>• Contemporary technical uniforms with clean silhouettes</li>
                    <li>• Practical jackets or utility-style clothing</li>
                    <li>• Subtle Alaska branding on chest & sleeve</li>
                    <li>• Functional equipment belts & technical cases</li>
                  </ul>
                </div>
                <div className="bg-zinc-800 p-3.5 rounded-xl border border-zinc-700 space-y-1">
                  <strong className="text-white block">Visual Feel:</strong>
                  <p className="text-zinc-300">
                    Think: <strong>Premium mobile technology response unit</strong> (Not: Doctors in a hospital).
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* 4. TAB CONTENT: PRODUCTION DESIGN LANGUAGE — ALASKA MOBILE LABORATORY & SETS */}
      {activeTab === 'mobile-labs' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Header Banner */}
          <div className="p-5 sm:p-6 bg-gradient-to-r from-zinc-900 via-zinc-850 to-zinc-900 text-white rounded-2xl border border-zinc-800 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#c69a53]">
              <Truck className="w-3.5 h-3.5" /> Production Design Language
            </div>
            <h3 className="text-xl font-bold text-white font-heading">
              Alaska Mobile Laboratory — Film-Specific Arrivals
            </h3>
            <p className="text-xs text-zinc-300 max-w-2xl font-medium">
              Every Battery Expert arrival should be visually distinctive and location-specific. The arrival introduces a sudden, stylish, and high-tech spectacle that immediately elevates the scene.
            </p>
          </div>

          {/* 5 Distinct Mobile Laboratory Arrivals Grid */}
          <div className="space-y-4">
            <div className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
              <span>05. Film-by-Film Technical Arrival Configurations</span>
              <div className="h-px bg-zinc-200 flex-1"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              
              {/* Film 01 - CAR */}
              <div className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-sm space-y-3 hover:border-amber-400 transition-all">
                <div className="flex items-center justify-between border-b border-zinc-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="p-2 bg-amber-50 rounded-xl text-amber-900">
                      <Car className="w-4 h-4" />
                    </span>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">Film 01 • Car</span>
                      <h4 className="text-sm font-bold text-zinc-900">CAR</h4>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-zinc-100 text-zinc-600 rounded-md">Roadside</span>
                </div>
                <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-200/70 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 block">Arrival Setup:</span>
                  <p className="text-xs font-bold text-zinc-900">
                    Roadside mobile technical laboratory.
                  </p>
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Rapid-deployment diagnostic unit navigating congested traffic to stage an instantaneous roadside battery resuscitation with chrome workbenches and digital meters.
                </p>
              </div>

              {/* Film 02 - TRUCK */}
              <div className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-sm space-y-3 hover:border-amber-400 transition-all">
                <div className="flex items-center justify-between border-b border-zinc-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="p-2 bg-blue-50 rounded-xl text-blue-900">
                      <Truck className="w-4 h-4" />
                    </span>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block">Film 02 • Truck</span>
                      <h4 className="text-sm font-bold text-zinc-900">TRUCK</h4>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-zinc-100 text-zinc-600 rounded-md">Port Truck</span>
                </div>
                <div className="bg-blue-50/60 p-3 rounded-xl border border-blue-200/70 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-900 block">Arrival Setup:</span>
                  <p className="text-xs font-bold text-zinc-900">
                    Large Alaska-branded mobile laboratory truck.
                  </p>
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Massive converted industrial laboratory truck pulling directly onto Karachi fish harbor wooden docks, creating huge comic contrast against traditional wooden boats.
                </p>
              </div>

              {/* Film 03 - TRACTOR */}
              <div className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-sm space-y-3 hover:border-amber-400 transition-all">
                <div className="flex items-center justify-between border-b border-zinc-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="p-2 bg-emerald-50 rounded-xl text-emerald-900">
                      <Tractor className="w-4 h-4" />
                    </span>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">Film 03 • Tractor</span>
                      <h4 className="text-sm font-bold text-zinc-900">TRACTOR</h4>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-zinc-100 text-zinc-600 rounded-md">Field Caravan</span>
                </div>
                <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-200/70 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-900 block">Arrival Setup:</span>
                  <p className="text-xs font-bold text-zinc-900">
                    Sophisticated Alaska-branded laboratory caravan towed by a tractor.
                  </p>
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  High-tech cleanroom trailer caravan traversing the golden harvest field with solar testing panels and high-torque agricultural battery test harness.
                </p>
              </div>

              {/* Film 04 - BIKE */}
              <div className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-sm space-y-3 hover:border-amber-400 transition-all">
                <div className="flex items-center justify-between border-b border-zinc-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="p-2 bg-purple-50 rounded-xl text-purple-900">
                      <Zap className="w-4 h-4" />
                    </span>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 block">Film 04 • Bike</span>
                      <h4 className="text-sm font-bold text-zinc-900">BIKE</h4>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-zinc-100 text-zinc-600 rounded-md">Helicopter Seq</span>
                </div>
                <div className="bg-purple-50/60 p-3 rounded-xl border border-purple-200/70 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-900 block">Arrival Setup:</span>
                  <p className="text-xs font-bold text-zinc-900">
                    Dramatic high-production arrival — designed according to the final approved helicopter sequence.
                  </p>
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Cinematic aerial insertion sequence with high-speed tactical drop-rig delivering instant motorcycle ignition right before candidate's interview deadline.
                </p>
              </div>

              {/* Film 05 - HOME */}
              <div className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-sm space-y-3 md:col-span-2 lg:col-span-2 hover:border-amber-400 transition-all">
                <div className="flex items-center justify-between border-b border-zinc-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="p-2 bg-amber-50 rounded-xl text-amber-900">
                      <Home className="w-4 h-4" />
                    </span>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">Film 05 • UPS / Inverter</span>
                      <h4 className="text-sm font-bold text-zinc-900">HOME</h4>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-zinc-100 text-zinc-600 rounded-md">Wedding House</span>
                </div>
                <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-200/70 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 block">Arrival Setup:</span>
                  <p className="text-xs font-bold text-zinc-900">
                    Household power-response setup entering through the wedding house environment.
                  </p>
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Seamless residential power restoration unit wheeled through crowded festive courtyards, reviving wedding lights, appliances, and sound systems instantaneously upon blackout.
                </p>
              </div>

            </div>
          </div>

          {/* Sets, Props & Technical Specs Grid */}
          <div className="space-y-4 pt-4">
            <div className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
              <span>06. Set Construction, Hero Battery & Cinematography</span>
              <div className="h-px bg-zinc-200 flex-1"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Card 1: Mobile Roadside Battery Laboratory */}
              <div className="bg-zinc-900 text-white p-6 rounded-2xl border border-zinc-800 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-amber-500/20 text-[#c69a53] rounded-xl border border-amber-500/30">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#c69a53]">
                      Hero Set Piece
                    </span>
                    <h4 className="text-base font-bold text-white">
                      The Mobile Roadside Battery Laboratory
                    </h4>
                  </div>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  A customized rapid-deployment field laboratory carried by the Battery Expert’s specialized crew. Designed with high-polish brushed aluminum flight cases, digital voltage spectrum meters, neon LED status strips, and multi-pin battery testing harnesses.
                </p>
                <div className="bg-zinc-800/80 p-3.5 rounded-xl border border-zinc-700 space-y-2 text-xs">
                  <div className="font-bold text-zinc-200">Key Technical Set Props:</div>
                  <ul className="space-y-1.5 text-zinc-300">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#c69a53]"></span>
                      Hydraulic chrome testing table with emergency magnetic clamps
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#c69a53]"></span>
                      Dual high-voltage multi-meters with illuminated green/red LCD displays
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#c69a53]"></span>
                      Cryogenic cold-steam generator simulating super-cooling graphite technology
                    </li>
                  </ul>
                </div>
              </div>

              {/* Card 2: The Hero Alaska Graphite Battery */}
              <div className="bg-zinc-900 text-white p-6 rounded-2xl border border-zinc-800 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-amber-500/20 text-[#c69a53] rounded-xl border border-amber-500/30">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#c69a53]">
                      Hero Product Prop
                    </span>
                    <h4 className="text-base font-bold text-white">
                      The Alaska Graphite Master Battery Prop
                    </h4>
                  </div>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Precision 1:1 scale hero prop featuring high-gloss obsidian casing, gold-plated Alaska branding, glowing internal graphite cells with pulsating crimson fiber-optic lighting for macro camera closeups.
                </p>
                <div className="bg-zinc-800/80 p-3.5 rounded-xl border border-zinc-700 space-y-2 text-xs">
                  <div className="font-bold text-zinc-200">Visual Reveal Treatment:</div>
                  <ul className="space-y-1.5 text-zinc-300">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#c69a53]"></span>
                      Terminal Spark FX: Controlled pyrotechnic cinematic spark upon connection
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#c69a53]"></span>
                      9-Month Free Replacement Warranty golden seal embossed on top cover
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#c69a53]"></span>
                      Slow-Motion 120 FPS camera cutaway revealing pure graphite internal grid
                    </li>
                  </ul>
                </div>
              </div>

              {/* Card 3: Vehicle Fleet & Production Staging */}
              <div className="bg-zinc-900 text-white p-6 rounded-2xl border border-zinc-800 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-amber-500/20 text-[#c69a53] rounded-xl border border-amber-500/30">
                    <Car className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#c69a53]">
                      Fleet Logistics
                    </span>
                    <h4 className="text-base font-bold text-white">
                      Custom Vehicle Fleet & Camera Rigging
                    </h4>
                  </div>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  5 customized vehicles configured with low-angle tow rigs and process trailers for safety and dynamic cinematic motion capture:
                </p>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-zinc-300">
                  <div className="bg-zinc-800 p-2.5 rounded-lg border border-zinc-700">
                    <strong className="text-white block">Car Commercial:</strong>
                    Executive Black Sedan with open bonnet rig
                  </div>
                  <div className="bg-zinc-800 p-2.5 rounded-lg border border-zinc-700">
                    <strong className="text-white block">Truck Commercial:</strong>
                    Iconic Bedford J-Type with truck art & fish crates
                  </div>
                  <div className="bg-zinc-800 p-2.5 rounded-lg border border-zinc-700">
                    <strong className="text-white block">Tractor Commercial:</strong>
                    Red Agri Tractor with floral Baraat ribbons
                  </div>
                  <div className="bg-zinc-800 p-2.5 rounded-lg border border-zinc-700">
                    <strong className="text-white block">Bike Commercial:</strong>
                    125cc City Commuter with ride-share mount
                  </div>
                </div>
              </div>

              {/* Card 4: Cinematography & Lighting Schemes */}
              <div className="bg-zinc-900 text-white p-6 rounded-2xl border border-zinc-800 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-amber-500/20 text-[#c69a53] rounded-xl border border-amber-500/30">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#c69a53]">
                      Cinematography
                    </span>
                    <h4 className="text-base font-bold text-white">
                      Lighting Palette & Camera Package
                    </h4>
                  </div>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Dual aesthetic world contrast: Warm, dusty natural reality suddenly transformed by crisp, hyper-stylized diagnostic laboratory lighting.
                </p>
                <div className="bg-zinc-800/80 p-3.5 rounded-xl border border-zinc-700 space-y-2 text-xs">
                  <div className="flex justify-between items-center text-zinc-300">
                    <span>Camera Package:</span>
                    <strong className="text-[#c69a53]">ARRI Alexa Mini LF + Phantom Flex 4K</strong>
                  </div>
                  <div className="flex justify-between items-center text-zinc-300">
                    <span>Lenses:</span>
                    <strong className="text-[#c69a53]">Cooke Anamorphic /i Full Frame Plus</strong>
                  </div>
                  <div className="flex justify-between items-center text-zinc-300">
                    <span>Lighting Palette:</span>
                    <strong className="text-[#c69a53]">5600K Clean Lab vs 2700K Warm Golden Sunset</strong>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* 5. TAB CONTENT: COLOR DIRECTION & MAIN PRODUCTION PRIORITIES */}
      {activeTab === 'color-priorities' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Header Banner */}
          <div className="p-5 sm:p-6 bg-gradient-to-r from-zinc-900 via-zinc-850 to-zinc-900 text-white rounded-2xl border border-zinc-800 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#c69a53]">
              <Palette className="w-3.5 h-3.5" /> Aesthetic & Directorial Directives
            </div>
            <h3 className="text-xl font-bold text-white font-heading">
              07. Color Direction & 08. Main Production Priorities
            </h3>
            <p className="text-xs text-zinc-300 max-w-2xl font-medium">
              The campaign should feel rich and cinematic. Grounded in authentic Pakistani realism, elevated with sudden technical spectacle, and framed by controlled Alaska yellow brand identity.
            </p>
          </div>

          {/* Color Direction Breakdown (Base World vs Alaska Visual Identity) */}
          <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 bg-amber-50 rounded-xl text-amber-800">
                  <Palette className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-amber-700 block">Section 07</span>
                  <h4 className="text-base font-bold text-zinc-900">COLOR DIRECTION</h4>
                </div>
              </div>
              <span className="text-xs font-bold px-3 py-1 bg-zinc-900 text-amber-400 rounded-full">
                Rich & Cinematic
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Base World */}
              <div className="bg-zinc-50 p-5 rounded-xl border border-zinc-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span>
                    Base World
                  </h5>
                  <span className="text-[10px] uppercase font-mono text-zinc-500 font-bold">Natural Realm</span>
                </div>
                <ul className="space-y-2 text-xs text-zinc-700">
                  <li className="flex items-center gap-2.5 bg-white p-2.5 rounded-lg border border-zinc-200/80">
                    <span className="text-amber-700 font-bold">•</span>
                    <span><strong>Warm Pakistani sunlight:</strong> Golden-hour highlights, natural diffusion</span>
                  </li>
                  <li className="flex items-center gap-2.5 bg-white p-2.5 rounded-lg border border-zinc-200/80">
                    <span className="text-amber-700 font-bold">•</span>
                    <span><strong>Earthy natural tones:</strong> Terracotta bricks, harvest gold, harbor wood</span>
                  </li>
                  <li className="flex items-center gap-2.5 bg-white p-2.5 rounded-lg border border-zinc-200/80">
                    <span className="text-amber-700 font-bold">•</span>
                    <span><strong>Real environments:</strong> Lived-in, textured, authentic streetscapes</span>
                  </li>
                  <li className="flex items-center gap-2.5 bg-white p-2.5 rounded-lg border border-zinc-200/80">
                    <span className="text-amber-700 font-bold">•</span>
                    <span><strong>Controlled contrast:</strong> Soft roll-off shadows without muddy clipping</span>
                  </li>
                </ul>
              </div>

              {/* Alaska Visual Identity */}
              <div className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent p-5 rounded-xl border border-amber-300 space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="text-sm font-bold text-amber-950 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                    Alaska Visual Identity
                  </h5>
                  <span className="text-[10px] uppercase font-mono text-amber-800 font-bold">Brand Realm</span>
                </div>
                
                <div className="p-3 bg-amber-500/15 rounded-lg border border-amber-400/40 text-xs text-amber-950 font-semibold">
                  Use <strong>Alaska yellow</strong> as the strongest brand colour.
                </div>

                <div className="space-y-1.5 text-xs text-zinc-800">
                  <span className="text-[11px] font-bold text-amber-900 block">The Alaska yellow should appear through:</span>
                  <div className="grid grid-cols-2 gap-1.5 pt-1">
                    <div className="bg-white p-2 rounded-lg border border-amber-200 flex items-center gap-1.5 font-medium text-[11px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      Batteries
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-amber-200 flex items-center gap-1.5 font-medium text-[11px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      Vehicles
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-amber-200 flex items-center gap-1.5 font-medium text-[11px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      Laboratory branding
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-amber-200 flex items-center gap-1.5 font-medium text-[11px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      Equipment
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-amber-200 flex items-center gap-1.5 font-medium text-[11px] col-span-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      Technical details
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-zinc-900 text-white rounded-lg border border-zinc-800 text-[11px] space-y-1">
                  <span className="text-[#c69a53] font-bold block">Mandatory Color Rule:</span>
                  <p className="text-zinc-300">
                    The yellow must feel premium and controlled, not randomly scattered throughout the frame.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Section 08: Main Production Priorities */}
          <div className="bg-zinc-900 text-white rounded-2xl border border-zinc-800 p-6 shadow-md space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 bg-amber-500/20 text-[#c69a53] rounded-xl border border-amber-500/30">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#c69a53] block">Section 08</span>
                  <h4 className="text-base font-bold text-white">MAIN PRODUCTION PRIORITIES</h4>
                </div>
              </div>
              <span className="text-xs text-zinc-400 font-mono">Core Directives</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Priority 1 */}
              <div className="bg-zinc-800/90 p-4 rounded-xl border border-zinc-700 space-y-2">
                <div className="flex items-center gap-2 text-[#c69a53]">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Priority 01</span>
                </div>
                <h5 className="text-sm font-bold text-white">Every Location Must Feel Real</h5>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Do not over-design the real environment. The comedy thrives when the crisis is situated in deeply recognizable, unfiltered Pakistani life.
                </p>
              </div>

              {/* Priority 2 */}
              <div className="bg-zinc-800/90 p-4 rounded-xl border border-zinc-700 space-y-2">
                <div className="flex items-center gap-2 text-[#c69a53]">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Priority 02</span>
                </div>
                <h5 className="text-sm font-bold text-white">Battery Expert Must Feel Premium</h5>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  His entrance should always elevate the visual world. Clean lab coat, high-tech composure, and sudden technological authority.
                </p>
              </div>

              {/* Priority 3 */}
              <div className="bg-zinc-800/90 p-4 rounded-xl border border-zinc-700 space-y-2">
                <div className="flex items-center gap-2 text-[#c69a53]">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Priority 03</span>
                </div>
                <h5 className="text-sm font-bold text-white">Character Separation Is Critical</h5>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Different versions of Iftikhar Thakur must never be visually confused. Strictly enforce headwear, facial styling, and wardrobe distinctions.
                </p>
              </div>

              {/* Priority 4 */}
              <div className="bg-zinc-800/90 p-4 rounded-xl border border-zinc-700 space-y-2">
                <div className="flex items-center gap-2 text-[#c69a53]">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Priority 04</span>
                </div>
                <h5 className="text-sm font-bold text-white">Product Is Always Clear</h5>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  The Alaska Battery must receive a strong premium hero reveal with obsidian casing, golden seals, and dynamic terminal ignition.
                </p>
              </div>

            </div>

            {/* USP Visibility Matrix & Final Tone Box */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-2">
              
              {/* USP List */}
              <div className="lg:col-span-2 bg-zinc-800/60 p-5 rounded-xl border border-zinc-700 space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-bold uppercase tracking-widest text-[#c69a53] flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5" /> USP Must Remain Visible (Where Applicable)
                  </h5>
                  <span className="text-[10px] font-mono text-zinc-400">9 Core Technology USPs</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  {[
                    'Graphite Technology',
                    'Heat Resistance',
                    'Long Battery Life',
                    'Uptime',
                    'Reliability',
                    'Dependability',
                    'Warranty (9-Month)',
                    'Thick Plates',
                    'Long Backup'
                  ].map((usp, idx) => (
                    <div key={idx} className="bg-zinc-900/90 p-2.5 rounded-lg border border-zinc-700/80 flex items-center gap-2 text-zinc-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#c69a53]"></span>
                      <span className="font-semibold text-[11px]">{usp}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Final Tone Box */}
              <div className="bg-gradient-to-br from-amber-500/20 via-zinc-900 to-black p-5 rounded-xl border border-amber-500/40 flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 block mb-1">
                    Master Directorial Formula
                  </span>
                  <h5 className="text-base font-bold text-white font-heading">
                    Final Tone
                  </h5>
                </div>

                <div className="p-3.5 bg-black/60 rounded-lg border border-amber-500/30 text-xs font-bold text-amber-300 leading-relaxed">
                  Pakistani realism + cinematic scale + Iftikhar Thakur comedy + premium Alaska technology.
                </div>

                <p className="text-[11px] text-zinc-400">
                  Every commercial harmonizes commercial comedy appeal with high-tech authority.
                </p>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* 6. TAB CONTENT: LOCATIONS & PAKISTAN MAP */}
      {activeTab === 'locations' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Top Overview */}
          <div className="p-5 bg-gradient-to-r from-zinc-900 via-zinc-850 to-zinc-900 text-white rounded-2xl border border-zinc-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#c69a53]">
                <Compass className="w-3.5 h-3.5" /> Pakistan Production Territory
              </div>
              <h3 className="text-xl font-bold text-white font-heading mt-1">
                Multi-City Shooting Locations & Logistics Map
              </h3>
              <p className="text-xs text-zinc-300 mt-1 max-w-2xl">
                Strategically scouted across Karachi, Lahore, and Evernew Studios. All locations are subject to availability and may change later based on logistical, weather, or operational limitations.
              </p>
            </div>
            <div className="px-3.5 py-1.5 bg-amber-500/20 text-[#c69a53] border border-amber-500/40 rounded-xl text-xs font-bold shrink-0">
              6 Production Hubs (Subject to Availability)
            </div>
          </div>

          {/* Interactive Location Selector */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {locationsList.map((loc, idx) => {
              const Icon = loc.icon;
              const isActive = idx === activeLocationIndex;
              return (
                <button
                  key={loc.id}
                  onClick={() => setActiveLocationIndex(idx)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isActive
                      ? 'bg-zinc-900 text-white border-[#c69a53] shadow-md ring-2 ring-[#c69a53]/40'
                      : 'bg-white text-zinc-800 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`p-1.5 rounded-lg ${isActive ? 'bg-amber-500/20 text-[#c69a53]' : 'bg-zinc-100 text-zinc-600'}`}>
                      <Icon className="w-4 h-4" />
                    </span>
                    <span className={`text-[10px] font-mono font-bold ${isActive ? 'text-[#c69a53]' : 'text-zinc-400'}`}>
                      0{idx + 1}
                    </span>
                  </div>
                  <div>
                    <div className={`text-[10px] font-bold uppercase ${isActive ? 'text-zinc-400' : 'text-zinc-500'}`}>
                      {loc.city.split(',')[0]}
                    </div>
                    <div className="text-xs font-bold truncate mt-0.5">
                      {loc.title.split('/')[0]}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected Location Detailed Dossier Card */}
          {locationsList[activeLocationIndex] && (
            <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-md">
              <div className="grid grid-cols-1 lg:grid-cols-12">
                
                {/* Left Visual Preview */}
                <div 
                  onClick={() => {
                    const gIdx = chapter.galleryImages?.findIndex(g => g.url === locationsList[activeLocationIndex].refImage);
                    if (gIdx !== -1 && gIdx !== undefined) onImageClick(gIdx);
                  }}
                  className="lg:col-span-5 relative bg-zinc-950 min-h-[260px] flex items-center justify-center overflow-hidden cursor-pointer group/loc"
                >
                  <img
                    src={locationsList[activeLocationIndex].refImage}
                    alt={locationsList[activeLocationIndex].title}
                    className="w-full h-full object-cover min-h-[260px] opacity-90 group-hover/loc:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-between p-5 text-white">
                    <div className="flex justify-end">
                      <span className="px-2.5 py-1 bg-black/70 rounded-lg text-[10px] font-bold text-white flex items-center gap-1 border border-white/20 backdrop-blur-xs opacity-0 group-hover/loc:opacity-100 transition-opacity">
                        <ZoomIn className="w-3 h-3 text-[#c69a53]" /> Inspect 4K Scout Photo
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#c69a53]">
                        Location Dossier 0{activeLocationIndex + 1}
                      </span>
                      <h4 className="text-lg font-bold text-white">
                        {locationsList[activeLocationIndex].title}
                      </h4>
                      <span className="text-xs text-zinc-300 flex items-center gap-1.5 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-[#c69a53]" />
                        {locationsList[activeLocationIndex].city}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Details & Logistics */}
                <div className="lg:col-span-7 p-6 space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-zinc-100">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-zinc-400 block">Assigned Commercial Film:</span>
                        <span className="text-xs font-bold text-amber-900 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full inline-block mt-0.5">
                          {locationsList[activeLocationIndex].film}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-bold uppercase text-zinc-400 block">GPS Coordinates:</span>
                        <span className="text-xs font-mono font-bold text-zinc-800">
                          {locationsList[activeLocationIndex].coordinates}
                        </span>
                      </div>
                    </div>

                    {/* Production Design & Visual Goal Details */}
                    <div className="space-y-2.5">
                      <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3.5">
                        <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider block mb-1">
                          🎬 Visual & Comic Goal:
                        </span>
                        <p className="text-xs text-zinc-900 font-semibold leading-relaxed">
                          {locationsList[activeLocationIndex].visualGoal}
                        </p>
                      </div>

                      <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-3.5 space-y-2">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">
                          📐 Production Design & Set Logistics:
                        </span>
                        <ul className="space-y-1.5 text-xs text-zinc-700">
                          {locationsList[activeLocationIndex].productionDesign.map((item, pIdx) => (
                            <li key={pIdx} className="flex items-start gap-2">
                              <span className="text-[#b8860b] font-bold text-sm leading-none mt-0.5">•</span>
                              <span className="leading-snug">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-zinc-900 text-white rounded-xl p-3.5">
                        <span className="text-[10px] font-bold text-[#c69a53] uppercase tracking-wider block mb-1">
                          ⚡ Key Story Visual Action:
                        </span>
                        <p className="text-xs text-zinc-200 leading-relaxed">
                          {locationsList[activeLocationIndex].keyVisual}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-200">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase block">Official Permits:</span>
                        <span className="text-xs font-semibold text-zinc-800 mt-0.5 block">
                          {locationsList[activeLocationIndex].permits}
                        </span>
                      </div>
                      <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-200">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase block">Base Camp Staging:</span>
                        <span className="text-xs font-semibold text-zinc-800 mt-0.5 block">
                          {locationsList[activeLocationIndex].baseCamp}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-zinc-100 flex flex-wrap items-center justify-between text-xs text-zinc-500">
                    <span className="flex items-center gap-1.5">
                      <Camera className="w-3.5 h-3.5 text-[#b8860b]" />
                      <strong>Optimal Lighting: </strong> {locationsList[activeLocationIndex].lightingWindow}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      ✓ Location Scout Verified
                    </span>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Pakistan Production Matrix Table */}
          <div className="bg-white rounded-2xl border border-zinc-200 p-5 overflow-x-auto shadow-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#c69a53]" />
              Pakistan Multi-Hub Production Schedule
            </h4>
            <table className="w-full text-left text-xs border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-zinc-200 text-zinc-400 font-bold uppercase text-[10px]">
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Location & City</th>
                  <th className="py-2.5 px-3">Film Concept</th>
                  <th className="py-2.5 px-3">GPS Coordinates</th>
                  <th className="py-2.5 px-3">Permit Authority</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-zinc-700">
                {locationsList.map((loc, idx) => (
                  <tr key={loc.id} className="hover:bg-zinc-50/80 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-bold text-zinc-400">0{idx + 1}</td>
                    <td className="py-2.5 px-3 font-bold text-zinc-900">{loc.title.split('/')[0]} <span className="text-zinc-500 font-normal">({loc.city.split(',')[0]})</span></td>
                    <td className="py-2.5 px-3 text-amber-900 font-medium">{loc.film.split('(')[0]}</td>
                    <td className="py-2.5 px-3 font-mono text-[11px]">{loc.coordinates}</td>
                    <td className="py-2.5 px-3 text-zinc-600">{loc.permits.split('&')[0]}</td>
                    <td className="py-2.5 px-3">
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Permit Ready
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* 6. TAB CONTENT: LOCATION MOODBOARD */}
      {activeTab === 'moodboard' && (
        <div className="space-y-6 animate-fadeIn">
          
          <div className="p-5 bg-gradient-to-r from-zinc-900 via-zinc-850 to-zinc-900 text-white rounded-2xl border border-zinc-800">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#c69a53]">
              <Camera className="w-3.5 h-3.5" /> Curated Production Photography
            </div>
            <h3 className="text-xl font-bold text-white font-heading mt-1">
              Cinematic Reference Photography & Lighting Moodboard
            </h3>
            <p className="text-xs text-zinc-300 mt-1 max-w-2xl">
              High-definition environment visual references capturing the authentic atmosphere, dawn mist, agricultural wheat tones, and studio tech lighting for the campaign.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {locationsList.map((item, idx) => (
              <div
                key={item.id}
                className="group flex flex-col bg-white rounded-2xl border border-zinc-200 shadow-sm hover:shadow-xl hover:border-zinc-300 transition-all duration-300 overflow-hidden"
              >
                <div 
                  onClick={() => {
                    const gIdx = chapter.galleryImages?.findIndex(g => g.url === item.refImage);
                    if (gIdx !== -1 && gIdx !== undefined) onImageClick(gIdx);
                  }}
                  className="relative aspect-[16/10] bg-zinc-900 overflow-hidden cursor-pointer group/card"
                >
                  <img
                    src={item.refImage}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-between p-4 text-white">
                    <div className="flex justify-end">
                      <span className="px-2 py-0.5 bg-black/70 rounded-md text-[9px] font-bold text-white flex items-center gap-1 border border-white/20 opacity-0 group-hover/card:opacity-100 transition-opacity">
                        <ZoomIn className="w-2.5 h-2.5 text-[#c69a53]" /> Inspect 4K
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#c69a53]">
                        Ref 0{idx + 1} • {item.city}
                      </span>
                      <h5 className="text-sm font-bold text-white">
                        {item.title.split('/')[0]}
                      </h5>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white space-y-2 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-zinc-700 leading-relaxed font-medium">
                    {item.visualGoal}
                  </p>
                  <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-400">
                    <span className="font-semibold text-zinc-800">{item.film.split('(')[0]}</span>
                    <span>{item.lightingWindow.split('(')[0]}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* 7. TAB CONTENT: TALENT AGREEMENT CONTRACT */}
      {activeTab === 'contract' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Top Contract Action Header */}
          <div className="p-6 bg-white rounded-2xl border border-zinc-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-amber-500/15 rounded-md text-amber-900 border border-amber-500/30">
                  <FileText className="w-4 h-4 text-[#c69a53]" />
                </span>
                <h3 className="text-base sm:text-lg font-black text-zinc-900 uppercase tracking-tight font-heading">
                  Celebrity Talent Agreement — Mr. Iftikhar Ahmad Sheikh (Iftikhar Thakur)
                </h3>
              </div>
              <p className="text-xs text-zinc-500 mt-1">
                Official Modeling, Talent & Digital Likeness Agreement between Alaska Batteries, Iftikhar Thakur, and Nasharz Films.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyContract}
                className="px-3.5 py-2 text-xs font-bold rounded-xl border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
              >
                {copiedContract ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Contract Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-zinc-500" />
                    <span>Copy Agreement</span>
                  </>
                )}
              </button>

              <button
                onClick={onDownloadPdf}
                disabled={isGeneratingPdf}
                className="px-4 py-2 text-xs font-extrabold rounded-xl bg-[#c69a53] text-black hover:bg-[#b08542] transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
              >
                <Download className="w-4 h-4" />
                <span>Download Chapter PDF</span>
              </button>
            </div>
          </div>

          {/* Quick Legal Key Highlights Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl">
              <span className="text-[10px] font-bold uppercase text-zinc-400 block">Contract Term:</span>
              <strong className="text-xs text-zinc-900 mt-0.5 block">2 Years (2026 – 2028)</strong>
              <span className="text-[10px] text-zinc-500">Worldwide commercial usage</span>
            </div>
            <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl">
              <span className="text-[10px] font-bold uppercase text-zinc-400 block">Shoot Commitment:</span>
              <strong className="text-xs text-zinc-900 mt-0.5 block">5 Shoot Days</strong>
              <span className="text-[10px] text-zinc-500">TVC, digital, still & audio</span>
            </div>
            <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl">
              <span className="text-[10px] font-bold uppercase text-zinc-400 block">Professional Consideration:</span>
              <strong className="text-xs text-zinc-900 mt-0.5 block">PKR 3,000,000 Net</strong>
              <span className="text-[10px] text-zinc-500">+ 10% Agency Commission</span>
            </div>
            <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl">
              <span className="text-[10px] font-bold uppercase text-zinc-400 block">AI & Digital Rights:</span>
              <strong className="text-xs text-emerald-800 font-bold mt-0.5 block">Exclusive to Nasharz</strong>
              <span className="text-[10px] text-zinc-500">Full likeness & voice security</span>
            </div>
          </div>

          {/* Formatted Contract Document */}
          <div className="p-6 sm:p-8 bg-zinc-50 rounded-2xl border border-zinc-200 shadow-xs">
            <div className="max-w-4xl mx-auto space-y-6 text-zinc-800 text-xs sm:text-sm leading-relaxed font-sans">
              {chapter.fullText.split('\n\n').map((para, pIdx) => {
                const trimmed = para.trim();
                if (!trimmed) return null;

                if (trimmed.startsWith('MODELING, TALENT & DIGITAL LIKENESS AGREEMENT')) {
                  return (
                    <div key={pIdx} className="text-center py-4 border-b border-zinc-200">
                      <h2 className="text-lg sm:text-xl font-black text-zinc-900 uppercase tracking-tight">
                        {trimmed}
                      </h2>
                    </div>
                  );
                }

                if (/^[0-9]+\.\s+[A-Z\s&/]+$/m.test(trimmed)) {
                  return (
                    <h3 key={pIdx} className="text-sm sm:text-base font-black text-zinc-900 uppercase tracking-tight border-b border-zinc-200 pb-1 mt-6">
                      {trimmed}
                    </h3>
                  );
                }

                if (trimmed.startsWith('________________________________________')) {
                  return <hr key={pIdx} className="border-t border-zinc-200 my-6" />;
                }

                if (trimmed.includes('SIGNATURES & EXECUTION')) {
                  return (
                    <div key={pIdx} className="mt-8 pt-6 border-t-2 border-zinc-300">
                      <h4 className="text-sm font-black text-zinc-900 uppercase mb-4 tracking-wider">
                        {trimmed}
                      </h4>
                    </div>
                  );
                }

                return (
                  <p key={pIdx} className="text-zinc-700 whitespace-pre-line leading-relaxed">
                    {trimmed}
                  </p>
                );
              })}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
