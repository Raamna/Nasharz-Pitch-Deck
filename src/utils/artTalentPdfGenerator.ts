import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Chapter, BrandingConfig } from '../types';
import { urduToRomanUrdu, generateChapterPDF } from './pdfGenerator';
import {
  loadBase64ImageFast,
  batchPreloadImages,
  fastPreloadDomImages,
  createSvgPlaceholder,
  CachedImageData
} from './imageLoader';

export interface PDFGenOptions {
  returnBlob?: boolean;
  customFileName?: string;
  onProgress?: (status: string, percent?: number) => void;
}

export interface PDFGenResult {
  blob: Blob;
  filename: string;
  folder: string;
}

/**
 * Preload all images inside an element using ultra-fast decoded bitmap checks
 */
async function preloadImages(element: HTMLElement): Promise<void> {
  await fastPreloadDomImages(element);
}

/**
 * Infallible Base64 Image Loader with multi-layer CORS bypass, memory caching,
 * blob decoding, and instant SVG fallback
 */
export async function loadBase64Image(
  rawUrl: string,
  fallbackTitle: string = 'Production Visual Reference'
): Promise<CachedImageData> {
  return loadBase64ImageFast(rawUrl, fallbackTitle);
}

// -------------------------------------------------------------
// DATA REPOSITORY FOR CHAPTER 07
// -------------------------------------------------------------
export const WARDROBE_SECTIONS = [
  {
    sectionNum: '01',
    filmKey: 'Master Overview',
    sectionTitle: 'Production Design Master Look & Primary Hero Uniforms',
    locationTag: 'Universal Diagnostic Laboratory',
    items: [
      {
        sheetNum: 'Sheet 01',
        title: '01. Pehlwan Thakur (Master Look)',
        badge: 'Hero Character',
        url: 'https://res.cloudinary.com/dawlj9ne4/image/upload/Battery_Pehlwan_Sheet_w2wp4c.png',
        actor: 'Iftikhar Thakur',
        role: 'Lead Energy Expert & Technical Authority',
        points: [
          'Clean premium white laboratory coat with sharp, well-tailored masculine fit',
          'Crisp shirt and nice tie underneath with formal pants and formal shoes (no traditional shalwar qameez)',
          'High-grade rubber technician gloves; strictly no stethoscope or medical equipment clichés',
          'Professional, knowledgeable, energetic, warm and trustworthy battery authority'
        ],
        headRule: 'CRITICAL: Absolutely no cap, absolutely no turban and absolutely no headwear under any circumstances.',
        performance: 'Combination of senior surgeon, technical scientist, and emergency-response expert — unmistakably Iftikhar Thakur.'
      },
      {
        sheetNum: 'Sheet 02',
        title: '02. Diagnostic team.',
        badge: 'Technical Ensemble',
        url: 'https://res.cloudinary.com/dawlj9ne4/image/upload/Battery_Pehlwan_Medical_Team_Sheet_v07k88.png',
        actor: 'Technical Specialists Ensemble',
        role: 'Mobile Technology Response Unit',
        points: [
          'Scrubs worn underneath clean premium white laboratory coats with contemporary technical silhouettes',
          'Traditional Pakistani styling subtly integrated with neutral base clothing and no commercial branding',
          'Practical utility trousers with premium technical footwear and equipment belts holding diagnostic probes',
          'Engineered as a synchronized mobile pit-crew for rapid roadside electrical interventions'
        ],
        headRule: 'Modern technical utility headgear / bareheaded (DO NOT look like hospital doctors).',
        performance: 'High-speed, disciplined, synchronized mobile technology pit-crew.'
      }
    ]
  },
  {
    sectionNum: '02',
    filmKey: 'Film 01: Car',
    sectionTitle: 'Film 01: Car Breakdown Sequence • Luxury Executive Cast',
    locationTag: 'Food Street / Ring Road Junction, Lahore',
    items: [
      {
        sheetNum: 'Sheet 03',
        title: 'Character Thakur: Traffic Policeman',
        badge: 'Film 01 — Car',
        url: 'https://res.cloudinary.com/dawlj9ne4/image/upload/Battery_Pehlwan_Traf_Policeman_Sheet_bmo9yi.png',
        actor: 'Iftikhar Thakur',
        role: 'Gridlock Traffic Policeman',
        points: [
          'Authentic Pakistani traffic police uniform (shirt & trousers) with official police cap and duty belt',
          'Clean but naturally worn appearance with appropriate shoes and metal whistle lanyard',
          'Special visual comedy sequence: silver-foil heat resistance suit',
          'Authoritative yet comedic body language directing gridlocked cars around stalled sedan'
        ],
        headRule: 'Must wear official police cap (creates stark visual separation from Battery Expert who has NO headwear).',
        performance: 'Stern, irritated, street-smart, comically confident in traffic gridlock.'
      },
      {
        sheetNum: 'Sheet 04',
        title: 'Traffic Policeman Uniform Color Options',
        badge: 'Wardrobe Reference',
        url: 'https://res.cloudinary.com/dawlj9ne4/image/upload/Battery_Pehlwan_Traf_Policeman_Color_Options_yhw9p8.png',
        actor: 'Wardrobe Department Reference',
        role: 'Provincial Uniform Color Palette & Insignia Variations',
        points: [
          'Authentic provincial traffic police color variations: Blue-grey, khaki, navy, and white trim insignia options',
          'Official high-visibility chest badges and reflective shoulder epaulettes',
          'Approved color palette ensures maximum contrast against urban streetscapes',
          'Standardized municipal traffic warden duty gear'
        ],
        headRule: 'Official peaked traffic warden cap matching selected provincial tunic color.',
        performance: 'Authoritative regulatory palette for high-traffic Lahore Ring Road / Food Street junction.'
      },
      {
        sheetNum: 'Sheet 05',
        title: 'Car Owner (Luxury Sedan Commuter)',
        badge: 'Supporting Cast',
        url: 'https://res.cloudinary.com/dawlj9ne4/image/upload/Battery_Pehlwan_Car_Owner_Sheet_y7jdpt.png',
        actor: 'Supporting Cast',
        role: 'Affluent Urban Professional',
        points: [
          'Well-groomed Pakistani man, late 30s to mid-40s, affluent urban professional',
          'He should look successful, sophisticated and slightly impatient, but still believable and relatable',
          'His wardrobe communicates ownership of an expensive car without celebrity or fashion model excess',
          'Modern corporate attire: tailored blazer, crisp shirt, classic leather strap wristwatch'
        ],
        headRule: 'Neatly groomed metropolitan professional haircut.',
        performance: 'Stressed urban commuter stranded in dead-battery gridlock on the way to an important engagement.'
      }
    ]
  },
  {
    sectionNum: '03',
    filmKey: 'Film 04: Bike',
    sectionTitle: 'Film 04: Bike Sequence • Corporate Rush Hour & Career Aspirant',
    locationTag: 'Packages Mall Boulevard / Main Market, Lahore',
    items: [
      {
        sheetNum: 'Sheet 06',
        title: '03. Senior executive in bike seq',
        badge: 'Film 04 — Bike',
        url: 'https://res.cloudinary.com/dawlj9ne4/image/upload/Battery_Pehlwan_Office_Executive_Sheet_k7dybx.png',
        actor: 'Iftikhar Thakur',
        role: 'Senior Executive Commuter',
        points: [
          'Senior office executive commuting during morning rush hour (formerly morning man)',
          'Classic tailored safari suit (outdoor colors must not be blue)',
          'Epaulettes, flap chest pockets, belted or structured jacket silhouette',
          'Polished leather shoes, frantic commuter watch-checking in morning'
        ],
        headRule: 'No headwear (natural groomed executive morning hair).',
        performance: 'Stressed senior executive desperate to beat the morning gridlock.'
      },
      {
        sheetNum: 'Sheet 07',
        title: 'Taxi Bike Rider',
        badge: 'Supporting Cast',
        url: 'https://res.cloudinary.com/dawlj9ne4/image/upload/Battery_Pehlwan_Taxi_Biker_Sheet_hwhgny.png',
        actor: 'Supporting Cast',
        role: 'Hardworking Urban Motorcycle Taxi Operator',
        points: [
          'Practical Pakistani taxi motorcycle rider, urban, hardworking and realistic',
          'Looks like an authentic everyday bike rider, not a fashion model or generic delivery rider',
          'Weathered windbreaker or lightweight utility jacket, everyday shalwar qameez or jeans',
          'Practical riding shoes, worn safety helmet, mobile phone handlebar mount'
        ],
        headRule: 'Worn everyday motorcycle safety helmet with quick-release chin strap.',
        performance: 'Street-savvy, energetic, resourceful daily bike taxi pilot navigating dense urban alleys.'
      },
      {
        sheetNum: 'Sheet 08',
        title: 'Supporting Cast: Job Interview Candidate',
        badge: 'Supporting Cast',
        url: 'https://res.cloudinary.com/dawlj9ne4/image/upload/Battery_Pehlwan_Interview_Candidate_Sheet_r01msw.png',
        actor: 'Supporting Cast',
        role: 'Anxious Job Interview Candidate',
        points: [
          'Tailored modern corporate charcoal/navy blazer, crisp ironed pastel blue/white shirt, silk tie, dark trousers',
          'Commuter leather backpack or clear CV portfolio folder',
          'Safety motorcycle helmet for transit shots',
          'Desperate to reach a career-defining job interview on time'
        ],
        headRule: 'Groomed corporate hairstyle under motorcycle helmet.',
        performance: 'Nervous tension, checking watch frantically as the minutes tick down.'
      }
    ]
  },
  {
    sectionNum: '04',
    filmKey: 'Film 02: Truck',
    sectionTitle: 'Film 02: Truck Sequence • Maritime Fishery Port Logistics',
    locationTag: 'Ibrahim Hyderi / Fish Harbor Jetty, Karachi',
    items: [
      {
        sheetNum: 'Sheet 09',
        title: '04. Fish Logistics seq thakur',
        badge: 'Film 02 — Truck',
        url: 'https://res.cloudinary.com/dawlj9ne4/image/upload/Battery_Pehlwan_Pathan_Thakur_Sheet_d2i9er.png',
        actor: 'Iftikhar Thakur',
        role: 'Fish Harbor Logistics Captain',
        points: [
          'Simple traditional Pakistani shalwar qameez in slightly loose, practical fit',
          'Light or earthy neutral fabric with traditional practical footwear',
          'White traditional Pathan cap; slightly weathered working-man appearance',
          'A simple ring on one finger; no embroidery on the waistcoat'
        ],
        headRule: 'KEY MANDATORY RULE: Truck Driver / Fisherman Thakur MUST always wear the white Pathan cap.',
        performance: 'Brave, resilient, protective of his fresh seafood cargo at Karachi port.'
      },
      {
        sheetNum: 'Sheet 10',
        title: '05. Truck driver',
        badge: 'Supporting Cast',
        url: 'https://res.cloudinary.com/dawlj9ne4/image/upload/Battery_Pehlwan_Truck_Driver_Sheet_kbbtsv.png',
        actor: 'Supporting Ensemble',
        role: 'Fish Port Cargo Workers & Transport Crew',
        points: [
          'Weathered utility workwear, Chappal or worn out leather shoes or waterproof rubber boots',
          'Handling ice crates, fresh fish catches, and heavy cargo lines under coastal sea breeze',
          'Lively comedic expressions shifting from panic to overjoyed relief'
        ],
        headRule: 'Practical cotton patkas or bareheaded harbor workwear.',
        performance: 'Hardworking, bustling dock workers racing against melting ice and spoiling cargo.'
      }
    ]
  },
  {
    sectionNum: '05',
    filmKey: 'Film 03: Tractor',
    sectionTitle: 'Film 03: Tractor Sequence • Punjabi Rural Baraat Procession',
    locationTag: 'Kareem Block Agricultural Fields & Farmland Corridor',
    items: [
      {
        sheetNum: 'Sheet 11',
        title: '06. In tractor seq Chaudhary thakur wears',
        badge: 'Film 03 — Tractor',
        url: 'https://res.cloudinary.com/dawlj9ne4/image/upload/Battery_Pehlwan_Chaudharsb_1_Sheet_zbnlik.png',
        actor: 'Iftikhar Thakur',
        role: 'Baraat Patriarch & Farm Landlord',
        points: [
          'Mustard-yellow kurta with matching dhoti, lacha or shalwar',
          'Red floral-print stole or sash with matching red waistcoat',
          'Traditional Punjabi pointed khussa footwear',
          'Driving decorated agricultural tractor trolley carrying the entire singing Baraat party'
        ],
        headRule: 'Vibrant red polka turban with vertical starched fan (Battery Expert wears NO turban, NO headwear).',
        performance: 'Bushy handlebar moustache, thick eyebrows, rustic Punjabi Chaudhary charisma.'
      },
      {
        sheetNum: 'Sheet 12',
        title: '07. TRACTOR THAKUR  OP2:',
        badge: 'Film 03 — Tractor',
        url: 'https://res.cloudinary.com/dawlj9ne4/image/upload/Battery_Pehlwan_ch_sb_Sheet_hi8350.png',
        actor: 'Iftikhar Thakur',
        role: 'Traditional Rural Grandfather',
        points: [
          'Starched pristine white cotton Boski kurta shalwar',
          'Traditional starched white turban with authentic handmade tilla khussa or black shoes',
          'Carved wooden cane with practical Punjabi landowner detailing',
          'Alternative styling option for Tractor film rural sequence'
        ],
        headRule: 'Traditional starched white turban.',
        performance: 'Wise, prestigious, authoritative village elder.'
      },
      {
        sheetNum: 'Sheet 13',
        title: 'Farmer & Agricultural Harvester Crew',
        badge: 'Supporting Cast',
        url: 'https://res.cloudinary.com/dawlj9ne4/image/upload/Battery_Pehlwan_Farmer_Sheet_dpryzu.png',
        actor: 'Supporting Ensemble',
        role: 'Agricultural Harvesters',
        points: [
          'Earthy Khaki/Olive breathable cotton kurta with traditional Punjabi Tehband (Lungi)',
          'Checkered gamchha / patka shoulder wrap with realistic harvest soil and field patina',
          'Grounded Punjabi rural realism in golden wheat harvest fields',
          'Spontaneous celebration and bhangra dance when tractor engine restarts'
        ],
        headRule: 'Traditional farmer patka wrap.',
        performance: 'Hardworking, genuine, joyful celebration when the tractor restarts.'
      }
    ]
  },
  {
    sectionNum: '06',
    filmKey: 'Film 05: UPS',
    sectionTitle: 'Film 05: UPS Sequence • Heritage Lahore Wedding Haveli',
    locationTag: 'Fakir Khana Haveli Courtyard',
    items: [
      {
        sheetNum: 'Sheet 14',
        title: 'Character Thakur: Festive Wedding Guest',
        badge: 'Film 05 — UPS',
        url: 'https://res.cloudinary.com/dawlj9ne4/image/upload/Battery_Pehlwan_Wedding_Guest_Sheet_yij1ox.png',
        actor: 'Iftikhar Thakur & Ensemble',
        role: 'Festive Wedding Guests (Baraat)',
        points: [
          'Traditional formal Pakistani wedding outfit with tasteful waistcoat',
          'Light festive styling, elegant but natural',
          'Must fit naturally inside an old Lahore wedding house celebration'
        ],
        headRule: 'Festive wedding styling without clinical lab elements.',
        performance: 'Ecstatic celebratory energy interrupted by blackout, then restored by Battery Expert.'
      },
      {
        sheetNum: 'Sheet 15',
        title: 'UPS Guy / Young Groom (Option A — Two Wardrobe Options)',
        badge: 'Supporting Cast',
        url: 'https://res.cloudinary.com/dawlj9ne4/image/upload/Battery_Pehlwan_UPS_Guy_1_Sheet_irwm7w.png',
        actor: 'Lead Supporting Cast',
        role: 'Stressed Groom Managing Wedding Morning (Kurta & Casual Options)',
        points: [
          'Young Pakistani groom, approximately mid-20s to mid-30s',
          'Two distinct wardrobe options: Traditional festive embroidered kurta pajama vs contemporary semi-formal casual shirt & trousers',
          'Energetic, busy and managing chaotic preparations on the morning of his wedding',
          'Natural, well-groomed appearance with realistic hair and trimmed beard'
        ],
        headRule: 'Well-groomed modern festive haircut.',
        performance: 'Juggling phone calls, relatives, and household electrical crisis on his big day.'
      },
      {
        sheetNum: 'Sheet 16',
        title: 'UPS Guy / Young Groom (Option B — Master Styling)',
        badge: 'Supporting Cast',
        url: 'https://res.cloudinary.com/dawlj9ne4/image/upload/Battery_Pehlwan_UPS_Guy_Sheet_ilqhb2.png',
        actor: 'Lead Supporting Cast',
        role: 'Stressed Groom Managing Wedding Morning (Master Styling)',
        points: [
          'Young Pakistani groom, approximately mid-20s to mid-30s',
          'He is energetic, busy and slightly stressed because he is personally managing the wedding arrangements',
          'He should look like he is constantly being pulled in different directions on the morning of his own wedding',
          'Natural, well-groomed appearance with realistic hair, beard or clean-shaven grooming'
        ],
        headRule: 'Well-groomed modern festive haircut.',
        performance: 'Juggling phone calls, relatives, and household electrical crisis on his big day.'
      },
      {
        sheetNum: 'Sheet 17',
        title: 'Mother of the Groom / Household Matriarch',
        badge: 'Supporting Cast',
        url: 'https://res.cloudinary.com/dawlj9ne4/image/upload/Battery_Pehlwan_UPS_Mother_Sheet_trglgq.png',
        actor: 'Supporting Cast',
        role: 'Commanding & Practical Pakistani Mother',
        points: [
          'Pakistani mother, approximately late 40s to late 50s',
          'Warm, commanding, practical and expressive',
          'She should look like the person who is managing the entire wedding household',
          'Natural Pakistani beauty, realistic skin texture, graceful but strong presence'
        ],
        headRule: 'Graceful festive dupatta drape over styled hair.',
        performance: 'Authoritative matriarch orchestrating wedding preparations with practical urgency.'
      }
    ]
  }
];

export const VEHICLE_SECTIONS = [
  {
    sectionTitle: 'UNIFIED MOBILE LABORATORY • MASTER FLEET OPTIONS',
    sectionSubtitle: 'Unified high-tech emergency response van fleet deployed across all 5 commercial films',
    badge: 'Master Fleet (Options 1, 2, 3)',
    items: [
      {
        sheetNum: 'Van Opt 1',
        title: 'Unified Battery Pehlwan Mobile Lab Van (Option 1 — Master Livery)',
        badge: 'Master Livery Option 1',
        url: 'https://res.cloudinary.com/dawlj9ne4/image/upload/Battery_Pehlwan_Branded_Veh_op1_esdu3i.png',
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
        rule: 'ONE UNIFIED VEHICLE (OPTION 1): The Battery Pehlwan branded mobile van is the consistent high-tech heroic enabler appearing across all 5 campaign films.'
      },
      {
        sheetNum: 'Van Opt 2',
        title: 'Unified Battery Pehlwan Mobile Lab Van (Option 2 — Aero Graphic Livery)',
        badge: 'Aero Livery Option 2',
        url: 'https://res.cloudinary.com/dawlj9ne4/image/upload/Battery_Pehlwan_Branded_Veh_jog7cv.png',
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
        rule: 'AERO LIVERY OPTION 2: Sleeker, motorsport-inspired rapid response aesthetic for high-speed urban transit commercial sequences.'
      },
      {
        sheetNum: 'Van Opt 3',
        title: 'Unified Battery Pehlwan Mobile Lab Van (Option 3 — Heavy Utility Livery)',
        badge: 'Heavy Utility Option 3',
        url: 'https://res.cloudinary.com/dawlj9ne4/image/upload/Battery_Pehlwan_Branded_Veh_op3_g0tgpa.png',
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
        rule: 'HEAVY UTILITY OPTION 3: Maximum rugged durability and high-capacity rescue capability suited for agricultural and commercial freight breakdown scenarios.'
      }
    ]
  },
  {
    sectionTitle: 'FILM 01: CAR SEQUENCE • VEHICLE & PROPS GRID',
    sectionSubtitle: 'Luxury sedan breakdown and urban roadside emergency equipment',
    badge: 'Film 01 — Car',
    items: [
      {
        sheetNum: 'Grid 01',
        title: 'Car Sequence: Luxury Sedan & Traffic Breakdown Props Grid',
        badge: 'Film 01 — Car',
        url: 'https://res.cloudinary.com/dawlj9ne4/image/upload/Car_Seq_uj7m0o.png',
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
        rule: 'Clean square composition, pure white background, isolated objects and vehicle views, realistic automotive rendering.'
      }
    ]
  },
  {
    sectionTitle: 'FILM 02: TRUCK SEQUENCE • VEHICLE & FISHING PORT PROPS GRID',
    sectionSubtitle: 'Commercial refrigerated cargo truck and maritime port equipment',
    badge: 'Film 02 — Truck',
    items: [
      {
        sheetNum: 'Grid 02',
        title: 'Truck Sequence: Refrigerated Cargo Truck & Port Logistics Props Grid',
        badge: 'Film 02 — Truck',
        url: 'https://res.cloudinary.com/dawlj9ne4/image/upload/Truck_Seq_wdek71.png',
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
        rule: 'Premium square asset sheet on clean white background, isolated & evenly spaced items, realistic commercial vehicle concept render.'
      }
    ]
  },
  {
    sectionTitle: 'FILM 03: TRACTOR SEQUENCE • VEHICLE & BARAAT PROPS GRID',
    sectionSubtitle: 'Agricultural tractor and festive rural Punjabi baraat props',
    badge: 'Film 03 — Tractor',
    items: [
      {
        sheetNum: 'Grid 03',
        title: 'Tractor Sequence: Agricultural Tractor & Baraat Props Grid',
        badge: 'Film 03 — Tractor',
        url: 'https://res.cloudinary.com/dawlj9ne4/image/upload/Tractor_Seq_jd8v1u.png',
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
        rule: 'Premium film vehicle and props development sheet, square composition, clean white background, rich material details.'
      }
    ]
  },
  {
    sectionTitle: 'FILM 04: BIKE SEQUENCE • VEHICLE & INTERVIEW PROPS GRID',
    sectionSubtitle: 'Commuter motorcycle taxi and high-stakes job interview candidate props',
    badge: 'Film 04 — Bike',
    items: [
      {
        sheetNum: 'Grid 04',
        title: 'Motorcycle Sequence: Commuter Motorcycle & Interview Props Grid',
        badge: 'Film 04 — Bike',
        url: 'https://res.cloudinary.com/dawlj9ne4/image/upload/Bike_cuffkf.png',
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
        rule: 'Clean premium square production-design sheet, isolated motorcycle and props on pure white background, professional automotive presentation.'
      }
    ]
  },
  {
    sectionTitle: 'FILM 05: UPS SEQUENCE • ELECTRICAL & WEDDING PROPS GRID',
    sectionSubtitle: 'Household inverter, deep-cycle battery, wedding appliances & comedy props',
    badge: 'Film 05 — UPS',
    items: [
      {
        sheetNum: 'Grid 05',
        title: 'UPS / Wedding Home: Electrical & Wedding Home Props Grid',
        badge: 'Film 05 — UPS',
        url: 'https://res.cloudinary.com/dawlj9ne4/image/upload/Wedding_zgf47s.png',
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
        rule: 'Clean premium square production-design asset sheet, pure white background, isolated objects floating in neat editorial grid.'
      }
    ]
  }
];

export const LOCATION_SHEETS = [
  {
    sheetNum: 'Loc 01',
    title: 'Food Street / Badshahi Masjid Area — Major Traffic Gridlock',
    badge: 'Film 01 — Car',
    city: 'Old Lahore, Punjab',
    coordinates: '31.5881° N, 74.3106° E',
    url: 'https://res.cloudinary.com/dawlj9ne4/image/upload/car_seq_location_daydas.png',
    permits: 'WCLA & City Traffic Police Lahore (CTPL)',
    lightingWindow: '06:00 AM – 11:30 AM (Morning Golden Sun & Heat Shimmer)',
    productionDesign: [
      'Dense multi-lane bumper-to-bumper traffic congestion with heat shimmer',
      'Luxury executive car stalled with bonnet open causing roadblock',
      'Multiple commuter vehicles, motorcycles, yellow cabs, and auto-rickshaws',
      'Badshahi Mosque historic archway and minarets visible in cinematic background'
    ],
    visualGoal: 'Major Pakistani landmark combined with an everyday battery emergency. Busy, Chaotic, Premium, Cinematic.'
  },
  {
    sheetNum: 'Loc 02',
    title: 'Ibrahim Hyderi Fishing Port & Marine Wooden Jetty',
    badge: 'Film 02 — Truck',
    city: 'Karachi Coastal District, Sindh',
    coordinates: '24.7933° N, 67.1352° E',
    url: 'https://res.cloudinary.com/dawlj9ne4/image/upload/Truck_location_en8hv0.png',
    permits: 'Karachi Port Trust (KPT), Fishermen Cooperative & Coastal Admin',
    lightingWindow: '05:30 AM – 10:30 AM (Dawn Sea Mist & High Tide)',
    productionDesign: [
      'Hundreds of traditional carved wooden fishing boats docked along harbor',
      'Weathered wooden piers, hanging fishing nets, ice boxes & fresh fish crates',
      'Active dock workers carrying seafood trays and heavy cargo blocks',
      'Refrigerated seafood transport truck with dead battery alongside charpai tea setup'
    ],
    visualGoal: 'High contrast between traditional fishing port and massive Alaska mobile laboratory truck creates instant comedy.'
  },
  {
    sheetNum: 'Loc 03',
    title: 'Agricultural Farmland Fields & Harvest Horizon',
    badge: 'Film 03 — Tractor',
    city: 'Lahore Suburbs (Kareem Block / Wahdat Road Farmland)',
    coordinates: '31.5085° N, 74.2882° E',
    url: 'https://res.cloudinary.com/dawlj9ne4/image/upload/Tractor_seq_1_kqpwwa.png',
    permits: 'Local Landowners Agreement & District Administration Lahore',
    lightingWindow: '07:00 AM – 05:30 PM (Full Daylight, Magic Hour & Golden Sunset)',
    productionDesign: [
      'Large open agricultural space with long panoramic golden horizon line',
      'Working agricultural tractor access with deep soil furrows and wheat bundles',
      'Clear defined pathway for dynamic Baraat procession movement & live Dhol players',
      'Expansive open field for high-angle crane and drone celebratory wide shot'
    ],
    visualGoal: 'Baraat in the distance stops due to tractor breakdown, transforming into a festive musical chorus upon Pehlwan arrival.'
  },
  {
    sheetNum: 'Loc 04',
    title: 'Packages Mall Outdoor Promenade & Contemporary Glass Plaza',
    badge: 'Film 04 — Bike',
    city: 'Lahore Central (Walton Road Commercial Zone)',
    coordinates: '31.4745° N, 74.3562° E',
    url: 'https://res.cloudinary.com/dawlj9ne4/image/upload/Bike_Seq_Loc_qgltqe.png',
    permits: 'Packages Mall Management & Security Operations Directorate',
    lightingWindow: '07:30 AM – 12:30 PM (Crisp Morning Metropolitan Daylight)',
    productionDesign: [
      'Modern urban promenade with clean contemporary architectural glass lines',
      'Flow of smartly dressed young corporate professionals and office commuters',
      'Designated motorcycle transition roadway and pedestrian promenade lane',
      'Stressed job candidate in formal business suit desperately pushing commuter motorcycle'
    ],
    visualGoal: 'Clean, modern commercial promenade amplifies the comical high-speed pit-crew arrival of Battery Pehlwan.'
  },
  {
    sheetNum: 'Loc 05',
    title: 'Fakir Khana Museum Haveli & Historic Courtyard',
    badge: 'Film 05 — UPS / Home',
    city: 'Bhati Gate, Old Walled City Lahore',
    coordinates: '31.5839° N, 74.3168° E',
    url: 'https://res.cloudinary.com/dawlj9ne4/image/upload/UPS_Location_ldzp72.png',
    permits: 'Fakir Khana Trust & Heritage Directorate Agreement',
    lightingWindow: '03:00 PM – 11:30 PM (Dusk Warm Ambience to Dramatic Night Blackout)',
    productionDesign: [
      'Lively heritage household alive with frenetic wedding preparations and guests',
      'High-power appliances running: electric iron, blenders, hair dryers, ceiling fans',
      'Thousands of decorative fairy lights & vibrant marigold floral garlands (Haar)',
      'Central heavy-duty UPS / Inverter setup connected to main residential power board'
    ],
    visualGoal: 'Total blackout freezes household in comic mid-action shock; Alaska battery instantly restores radiant illumination.'
  },
  {
    sheetNum: 'Loc 06',
    title: 'Evernew Studios — Studio Soundstage & Macro Lab Set',
    badge: 'Technical & CGI Sequence',
    city: 'Multan Road, Lahore, Punjab',
    coordinates: '31.5204° N, 74.2968° E',
    url: 'https://res.cloudinary.com/dawlj9ne4/image/upload/Studio_Seq_gsrnsm.png',
    permits: 'Evernew Studios Management Lease Agreement & Technical Soundstage Booking',
    lightingWindow: 'Full 24-Hour Controlled High-Speed Studio Lighting (Dedo & Aputure High-CRI Rigs)',
    productionDesign: [
      'High-precision studio soundstage setup with acoustic sound-proofing & matte black seamless cyclorama',
      'Controlled high-speed phantom flex camera motion rig for ultra-slow motion macro sparking',
      '1:1 acrylic cross-section hero cutaway battery showcasing Alaska internal graphite plate lattice',
      'High-voltage diagnostic oscilloscope workbenches, spark arrestor cables, and digital LED voltmeters'
    ],
    visualGoal: 'Hyper-stylized, razor-sharp technical diagnostic world showcasing internal graphite engineering, instant cranking power, and 9-Month Replacement Warranty.'
  }
];

// Helper to create standard A4 page with header/footer
interface PageBox {
  pageEl: HTMLDivElement;
  contentArea: HTMLDivElement;
  footerArea: HTMLDivElement;
}

function createA4Page(
  pageIdx: number,
  branding: BrandingConfig,
  chapterNumber: string,
  docTitle: string,
  docSubtitle: string,
  dateStr: string,
  summaryText: string
): PageBox {
  const pageEl = document.createElement('div');
  pageEl.style.width = '794px';
  pageEl.style.height = '1123px';
  pageEl.style.boxSizing = 'border-box';
  pageEl.style.padding = pageIdx === 0 ? '24px 34px 18px 34px' : '18px 34px 16px 34px';
  pageEl.style.backgroundColor = '#ffffff';
  pageEl.style.display = 'flex';
  pageEl.style.flexDirection = 'column';
  pageEl.style.justifyContent = 'space-between';
  pageEl.style.position = 'relative';
  pageEl.style.overflow = 'hidden';

  const headerContainer = document.createElement('div');
  headerContainer.style.marginBottom = '8px';

  if (pageIdx === 0) {
    headerContainer.innerHTML = `
      <div style="border-bottom: 1.5px solid #cbd5e1; padding-bottom: 10px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <img src="${branding.nasharzIcon}" style="height: 32px; width: auto; object-fit: contain;" alt="Nasharz Films" />
          <div style="border-left: 1.5px solid #cbd5e1; height: 24px;"></div>
          <div>
            <div style="font-size: 11px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: #0f172a;">Nasharz Films</div>
            <div style="font-size: 8.5px; color: #64748b; font-weight: 500;">Campaign Strategy & Executive Production</div>
          </div>
        </div>
        <div>
          <img src="${branding.alaskaLogo}" style="height: 34px; width: auto; object-fit: contain;" alt="Alaska Batteries" />
        </div>
      </div>

      <div style="margin-bottom: 8px;">
        <div style="font-size: 9.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: #c69a53; margin-bottom: 2px;">
          ALASKA BATTERIES / LAUNCH DECK • CHAPTER ${chapterNumber}
        </div>
        <h1 style="font-size: 21px; font-weight: 800; color: #09090b; margin: 0 0 4px 0; line-height: 1.15; letter-spacing: -0.02em;">
          ${docTitle} <span style="font-size: 14px; font-weight: 500; color: #64748b;">— ${docSubtitle}</span>
        </h1>
        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 9.5px; color: #64748b; padding: 2px 0;">
          <span>Prepared By: <strong style="color: #0f172a;">Aatif Rasheed</strong> <span style="color: #b8860b; font-weight: 600;">(Producer / Director)</span></span>
          <span>Client: <strong style="color: #0f172a;">Alaska Batteries</strong></span>
          <span>Date: <strong style="color: #334155;">${dateStr}</strong></span>
          <span>Ref: <strong style="color: #334155;">NF-AB-CH${chapterNumber}</strong></span>
        </div>
      </div>

      <div style="background-color: #faf8f5; border-left: 4px solid #c69a53; padding: 8px 12px; border-radius: 0 5px 5px 0; margin-bottom: 8px;">
        <div style="font-size: 8.5px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: #b8860b; margin-bottom: 2px;">
          Production Design Mandate
        </div>
        <p style="font-size: 10.5px; font-weight: 600; color: #1e293b; margin: 0; line-height: 1.45; font-style: italic;">
          "${summaryText}"
        </p>
      </div>
    `;
  } else {
    headerContainer.innerHTML = `
      <div style="border-bottom: 1.5px solid #cbd5e1; padding-bottom: 5px; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center; font-size: 9px; text-transform: uppercase; letter-spacing: 0.08em; color: #64748b;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <img src="${branding.nasharzIcon}" style="height: 16px; width: auto; object-fit: contain;" alt="NF" />
          <span style="font-weight: 700; color: #0f172a;">Nasharz Films</span>
          <span>/</span>
          <span>Alaska Batteries Deck</span>
        </div>
        <div style="font-weight: 700; color: #c69a53;">
          Chapter ${chapterNumber}: ${docTitle}
        </div>
      </div>
    `;
  }

  pageEl.appendChild(headerContainer);

  const contentArea = document.createElement('div');
  contentArea.style.flex = '1';
  contentArea.style.display = 'flex';
  contentArea.style.flexDirection = 'column';
  pageEl.appendChild(contentArea);

  const footerArea = document.createElement('div');
  footerArea.style.borderTop = '1.5px solid #cbd5e1';
  footerArea.style.paddingTop = '6px';
  footerArea.style.display = 'flex';
  footerArea.style.justifyContent = 'space-between';
  footerArea.style.alignItems = 'center';
  footerArea.style.fontSize = '8.5px';
  footerArea.style.color = '#64748b';
  footerArea.style.textTransform = 'uppercase';
  footerArea.style.letterSpacing = '0.06em';
  pageEl.appendChild(footerArea);

  return { pageEl, contentArea, footerArea };
}

/**
 * 1. STANDALONE WARDROBE LOOKBOOK PDF GENERATOR
 */
export async function generateWardrobeLookbookPDF(
  chapter: Chapter,
  branding: BrandingConfig,
  clientName: string = 'Alaska Batteries Client',
  options?: PDFGenOptions
): Promise<PDFGenResult | void> {
  const sandbox = document.createElement('div');
  sandbox.style.position = 'fixed';
  sandbox.style.left = '-9999px';
  sandbox.style.top = '0';
  sandbox.style.width = '794px';
  sandbox.style.zIndex = '-9999';
  sandbox.style.fontFamily = "'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  document.body.appendChild(sandbox);

  const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const pages: PageBox[] = [];

  const createPage = () => {
    const pageBox = createA4Page(
      pages.length,
      branding,
      '07',
      'Lead & Support Wardrobe Lookbook',
      'Character Specification & Styling Sheets',
      dateStr,
      'Authentic Pakistani realism with heightened comic vitality. Crisp Battery Expert lab uniforms versus 5 distinct Iftikhar Thakur regional comedic personas.'
    );
    sandbox.appendChild(pageBox.pageEl);
    pages.push(pageBox);
    return pageBox;
  };

  // Preload all wardrobe image assets with fast parallel cache
  const wardrobeUrls: string[] = [];
  const titleMap = new Map<string, string>();
  WARDROBE_SECTIONS.forEach(s => s.items.forEach(it => {
    if (it.url) {
      wardrobeUrls.push(it.url);
      titleMap.set(it.url, it.title || 'Wardrobe Lookbook Sheet');
    }
  }));
  if (branding.sealStamp) {
    wardrobeUrls.push(branding.sealStamp);
    titleMap.set(branding.sealStamp, 'Official Seal');
  }

  options?.onProgress?.('Loading wardrobe visual assets...', 10);
  const imageMetaMap = await batchPreloadImages(wardrobeUrls, titleMap);
  options?.onProgress?.('Preparing lookbook pages...', 30);

  let curPage = createPage();

  // Overview Banner
  const banner = document.createElement('div');
  banner.style.backgroundColor = '#18181b';
  banner.style.color = '#ffffff';
  banner.style.padding = '8px 14px';
  banner.style.borderRadius = '6px';
  banner.style.marginBottom = '10px';
  banner.style.borderLeft = '4px solid #c69a53';
  banner.innerHTML = `
    <div style="font-size: 8.5px; font-weight: 800; text-transform: uppercase; color: #c69a53; letter-spacing: 0.1em; margin-bottom: 2px;">
      Styling Directive & Separation Rule
    </div>
    <div style="font-size: 9.5px; line-height: 1.4; color: #e4e4e7;">
      <strong>Battery Expert (Pehlwan Thakur):</strong> Clean premium white lab coat with crisp shirt, tie, formal pants, formal shoes, and rubber gloves underneath (no traditional shalwar qameez). <span style="color: #fbbf24; font-weight: 700;">ABSOLUTELY NO CAP, TURBAN OR HEADWEAR</span>.<br/>
      <strong>Iftikhar Thakur Characters:</strong> 5 distinct regional comedic personas across films (Traffic Policeman, Truck Freight Driver, Punjabi Baraat Chacha, Stressed Commuter, Wedding Guest).
    </div>
  `;
  curPage.contentArea.appendChild(banner);

  let cardsOnCurPage = 0;

  // Flatten all wardrobe items
  const allItems: { secNum: string; filmKey: string; secTitle: string; item: any }[] = [];
  for (let sIdx = 0; sIdx < WARDROBE_SECTIONS.length; sIdx++) {
    const sec = WARDROBE_SECTIONS[sIdx];
    for (let iIdx = 0; iIdx < sec.items.length; iIdx++) {
      allItems.push({
        secNum: sec.sectionNum,
        filmKey: sec.filmKey,
        secTitle: sec.sectionTitle,
        item: sec.items[iIdx]
      });
    }
  }

  for (let idx = 0; idx < allItems.length; idx++) {
    const { secNum, filmKey, secTitle, item } = allItems[idx];

    if (cardsOnCurPage >= 2) {
      // Before creating a new page, add a footer continuity note if desired
      curPage = createPage();
      cardsOnCurPage = 0;
    }

    const meta = imageMetaMap.get(item.url);
    const imgSrc = meta?.dataUrl || item.url;
    const aspect = meta?.aspect && meta.aspect > 0.1 ? meta.aspect : (16 / 9);

    const card = document.createElement('div');
    card.style.marginBottom = '10px';
    card.style.border = '1px solid #cbd5e1';
    card.style.borderRadius = '8px';
    card.style.backgroundColor = '#ffffff';
    card.style.overflow = 'hidden';
    card.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.04)';

    const maxCardImgW = 686;
    const maxCardImgH = 260;
    let finalW = maxCardImgW;
    let finalH = Math.round(maxCardImgW / aspect);
    if (finalH > maxCardImgH) {
      finalH = maxCardImgH;
      finalW = Math.round(maxCardImgH * aspect);
    }
    if (finalW > maxCardImgW) {
      finalW = maxCardImgW;
      finalH = Math.round(maxCardImgW / aspect);
    }

    card.innerHTML = `
      <!-- Card Header Bar -->
      <div style="background-color: #f8fafc; border-bottom: 1px solid #e2e8f0; padding: 5px 12px; display: flex; justify-content: space-between; align-items: center;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 8.5px; font-weight: 800; color: #b8860b; background: #fefce8; border: 1px solid #fef08a; padding: 1.5px 6px; border-radius: 4px;">
            ${item.sheetNum}
          </span>
          <span style="font-size: 11px; font-weight: 800; color: #0f172a;">
            ${item.title}
          </span>
        </div>
        <span style="font-size: 8px; font-weight: 700; color: #475569; background: #f1f5f9; border: 1px solid #cbd5e1; padding: 2px 7px; border-radius: 9999px;">
          ${item.badge} • ${filmKey}
        </span>
      </div>

      <!-- Card Content Body -->
      <div style="padding: 8px 12px 10px 12px; background: #ffffff;">
        <!-- Character Sheet Image Showcase -->
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 5px; display: flex; align-items: center; justify-content: center; margin-bottom: 7px; min-height: 190px;">
          <img 
            src="${imgSrc}" 
            width="${finalW}" 
            height="${finalH}" 
            style="width: ${finalW}px; height: ${finalH}px; max-width: 100%; object-fit: contain; display: block; margin: 0 auto; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);" 
            alt="${item.title}" 
            crossorigin="anonymous" 
          />
        </div>

        <!-- Specifications & Directives Grid -->
        <div style="display: grid; grid-template-columns: 1.18fr 0.82fr; gap: 10px; align-items: start;">
          <!-- Left Column: Specs & Fabrics -->
          <div>
            <div style="font-size: 9px; color: #475569; margin-bottom: 3px;">
              <strong style="color: #0f172a;">Actor:</strong> ${item.actor} • <strong style="color: #0f172a;">Role:</strong> <span style="color: #b8860b; font-weight: 700;">${item.role}</span>
            </div>
            <div style="background-color: #faf8f5; border: 1px solid #f1ece4; border-radius: 5px; padding: 6px 8px;">
              <div style="font-size: 7.5px; font-weight: 800; text-transform: uppercase; color: #78716c; letter-spacing: 0.05em; margin-bottom: 2px;">Wardrobe Specifications & Fabrics</div>
              <ul style="margin: 0; padding-left: 12px; font-size: 8px; line-height: 1.35; color: #334155;">
                ${item.points.map((p: string) => `<li style="margin-bottom: 1.5px;">${p}</li>`).join('')}
              </ul>
            </div>
          </div>

          <!-- Right Column: Headwear Rule & Performance Directive -->
          <div style="display: flex; flex-direction: column; gap: 4px;">
            <div style="background-color: #fefce8; border: 1px solid #fef08a; border-radius: 5px; padding: 5px 8px;">
              <div style="font-size: 7.5px; font-weight: 800; text-transform: uppercase; color: #854d0e; letter-spacing: 0.05em; margin-bottom: 2px;">Headwear & Styling Directive</div>
              <div style="font-size: 8px; color: #713f12; line-height: 1.3; font-weight: 600;">${item.headRule}</div>
            </div>
            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 5px; padding: 5px 8px;">
              <div style="font-size: 7.5px; font-weight: 800; text-transform: uppercase; color: #64748b; letter-spacing: 0.05em; margin-bottom: 2px;">Performance & Character Note</div>
              <div style="font-size: 8px; color: #334155; line-height: 1.3;">${item.performance}</div>
            </div>
          </div>
        </div>
      </div>
    `;

    curPage.contentArea.appendChild(card);
    cardsOnCurPage++;

    // If this is the last card on a page (2nd card) or the absolute last card of the lookbook, add a bottom production note
    if (cardsOnCurPage === 2 || idx === allItems.length - 1) {
      const bottomProtocol = document.createElement('div');
      bottomProtocol.style.marginTop = '4px';
      bottomProtocol.style.backgroundColor = '#f8fafc';
      bottomProtocol.style.border = '1px solid #e2e8f0';
      bottomProtocol.style.borderRadius = '6px';
      bottomProtocol.style.padding = '5px 10px';
      bottomProtocol.style.display = 'flex';
      bottomProtocol.style.justifyContent = 'space-between';
      bottomProtocol.style.alignItems = 'center';
      bottomProtocol.innerHTML = `
        <div style="display: flex; align-items: center; gap: 6px;">
          <span style="font-size: 7.5px; font-weight: 800; text-transform: uppercase; color: #c69a53; letter-spacing: 0.06em;">✦ Wardrobe Department On-Set Standard:</span>
          <span style="font-size: 7.5px; color: #475569;">All uniforms steamed, duplicate backup sets on stand-by, strict continuity photography logged after every take.</span>
        </div>
        <span style="font-size: 7.5px; font-weight: 700; color: #0f172a; background: #e2e8f0; padding: 1px 6px; border-radius: 4px;">Verified Production Design</span>
      `;
      curPage.contentArea.appendChild(bottomProtocol);

      if (idx === allItems.length - 1) {
        const signoffCard = document.createElement('div');
        signoffCard.style.marginTop = '6px';
        signoffCard.style.backgroundColor = '#ffffff';
        signoffCard.style.border = '1px solid #e2e8f0';
        signoffCard.style.borderRadius = '6px';
        signoffCard.style.padding = '6px 12px';
        signoffCard.style.display = 'flex';
        signoffCard.style.justifyContent = 'space-between';
        signoffCard.style.alignItems = 'center';
        signoffCard.innerHTML = `
          <div>
            <div style="font-size: 9.5px; font-weight: 800; color: #0f172a;">Executive Wardrobe & Character Styling Sign-off</div>
            <div style="font-size: 8px; font-weight: 700; color: #b8860b; margin-top: 1px;">
              Prepared By: <span style="color: #0f172a;">Aatif Rasheed</span> • Producer / Director • Nasharz Films
            </div>
            <div style="font-size: 7px; color: #64748b; margin-top: 1px;">Proprietary character lookbook and on-set directives approved for Alaska Batteries 2026 Commercials.</div>
          </div>
          <div style="text-align: right; display: flex; flex-direction: column; align-items: flex-end;">
            <div style="font-size: 7px; text-transform: uppercase; letter-spacing: 0.08em; color: #b8860b; font-weight: 800; margin-bottom: 2px;">Official Executive Seal</div>
            <img src="${imageMetaMap.get(branding.sealStamp)?.dataUrl || branding.sealStamp}" style="height: 44px; width: auto; object-fit: contain;" alt="Official Stamp" />
          </div>
        `;
        curPage.contentArea.appendChild(signoffCard);
      }
    }
  }

  // Update footers
  const totalPages = pages.length;
  pages.forEach((p, idx) => {
    p.footerArea.innerHTML = `
      <span>Nasharz Films • Confidential</span>
      <span>Alaska Batteries Campaign • Wardrobe Lookbook</span>
      <span style="font-weight: 700; color: #b8860b;">Page ${idx + 1} of ${totalPages}</span>
    `;
  });

  try {
    if (document.fonts) await document.fonts.ready;
    await preloadImages(sandbox);

    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });
    for (let i = 0; i < pages.length; i++) {
      const canvas = await html2canvas(pages[i].pageEl, {
        scale: 1.6,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false
      });
      if (i > 0) pdf.addPage('a4', 'portrait');
      pdf.addImage(canvas.toDataURL('image/jpeg', 0.92), 'JPEG', 0, 0, 210, 297);
    }

    const filename = options?.customFileName || '01_Nasharz_Alaska_Wardrobe_Lookbook.pdf';
    if (options?.returnBlob) {
      return { blob: pdf.output('blob'), filename, folder: 'Chapter_07_Art_and_Talent' };
    } else {
      pdf.save(filename);
    }
  } finally {
    document.body.removeChild(sandbox);
  }
}

/**
 * 2. STANDALONE VEHICLES & PROPS FLEET PDF GENERATOR
 * FIXED DESIGN: Each vehicle option and film props sheet is designed as a dedicated, fully-filled A4 page
 * utilizing generous visual showcases, 3-column detailed specs, color swatches, and art directives
 * so that the page looks filled, balanced, prestigious and completely without blank bottom void.
 */
export async function generateVehiclesPropsPDF(
  chapter: Chapter,
  branding: BrandingConfig,
  clientName: string = 'Alaska Batteries Client',
  options?: PDFGenOptions
): Promise<PDFGenResult | void> {
  const sandbox = document.createElement('div');
  sandbox.style.position = 'fixed';
  sandbox.style.left = '-9999px';
  sandbox.style.top = '0';
  sandbox.style.width = '794px';
  sandbox.style.zIndex = '-9999';
  sandbox.style.fontFamily = "'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  document.body.appendChild(sandbox);

  const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const pages: PageBox[] = [];

  const createPage = () => {
    const pageBox = createA4Page(
      pages.length,
      branding,
      '07',
      'Vehicle Fleet & Props Design Grids',
      'Unified Mobile Laboratory Fleet & Film Props Matrix',
      dateStr,
      'Unified mobile diagnostic emergency response van fleet options deployed across all 5 commercial films, paired with film-by-film isolated prop grids.'
    );
    sandbox.appendChild(pageBox.pageEl);
    pages.push(pageBox);
    return pageBox;
  };

  // Preload vehicle images with fast parallel cache
  const vehicleUrls: string[] = [];
  const titleMap = new Map<string, string>();
  VEHICLE_SECTIONS.forEach(s => s.items.forEach(it => {
    if (it.url) {
      vehicleUrls.push(it.url);
      titleMap.set(it.url, it.title || 'Vehicle & Props Production Asset');
    }
  }));
  if (branding.sealStamp) {
    vehicleUrls.push(branding.sealStamp);
    titleMap.set(branding.sealStamp, 'Official Seal');
  }

  options?.onProgress?.('Loading vehicle & prop visual assets...', 15);
  const imageMetaMap = await batchPreloadImages(vehicleUrls, titleMap);
  options?.onProgress?.('Preparing fleet specification sheets...', 35);

  // Flatten all items into dedicated full-page presentation sheets
  const allVehicleItems: { secTitle: string; secSubtitle: string; badge: string; item: any }[] = [];
  VEHICLE_SECTIONS.forEach(sec => {
    sec.items.forEach(it => {
      allVehicleItems.push({
        secTitle: sec.sectionTitle,
        secSubtitle: sec.sectionSubtitle,
        badge: sec.badge,
        item: it
      });
    });
  });

  for (let idx = 0; idx < allVehicleItems.length; idx++) {
    const { secTitle, secSubtitle, badge, item } = allVehicleItems[idx];
    const pageBox = createPage();

    const meta = imageMetaMap.get(item.url);
    const imgSrc = meta?.dataUrl || item.url;
    const aspect = meta?.aspect && meta.aspect > 0.1 ? meta.aspect : 1;

    // Sizing for high-res hero showcase (fills wide printable area with sleek clean backdrop)
    const imgHeight = 280;
    const imgWidth = Math.min(680, Math.round(imgHeight * aspect));

    const sheetContainer = document.createElement('div');
    sheetContainer.style.display = 'flex';
    sheetContainer.style.flexDirection = 'column';
    sheetContainer.style.height = '100%';
    sheetContainer.style.justifyContent = 'space-between';

    sheetContainer.innerHTML = `
      <!-- 1. Top Section Banner & Title -->
      <div style="background-color: #18181b; border-left: 4px solid #c69a53; border-radius: 6px; padding: 7px 12px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
        <div>
          <div style="font-size: 8px; font-weight: 800; text-transform: uppercase; color: #c69a53; letter-spacing: 0.1em;">
            PRODUCTION DESIGN • FLEET & PROPS SPECIFICATION
          </div>
          <div style="font-size: 12px; font-weight: 800; color: #ffffff; margin-top: 1px;">
            ${item.title}
          </div>
          <div style="font-size: 8px; color: #a1a1aa; margin-top: 1px;">
            ${secSubtitle}
          </div>
        </div>
        <div style="font-size: 8.5px; font-weight: 800; color: #18181b; background: #c69a53; padding: 3px 9px; border-radius: 9999px; white-space: nowrap;">
          ${item.badge}
        </div>
      </div>

      <!-- 2. Hero Vehicle / Props Showcase Container (Centered, crisp, un-cropped) -->
      <div style="background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 8px; padding: 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 295px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); position: relative; margin-bottom: 8px;">
        <img 
          src="${imgSrc}" 
          width="${imgWidth}" 
          height="${imgHeight}" 
          style="max-width: 100%; max-height: 280px; width: auto; height: auto; object-fit: contain; display: block; margin: 0 auto; filter: drop-shadow(0 4px 10px rgba(0,0,0,0.12));" 
          alt="${item.title}" 
          crossorigin="anonymous" 
        />
        <div style="position: absolute; top: 8px; left: 10px; font-size: 7.5px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.08em; background: rgba(255,255,255,0.9); padding: 2px 6px; border-radius: 4px; border: 1px solid #cbd5e1;">
          ✦ High-Res Master Production Asset
        </div>
        <div style="position: absolute; bottom: 8px; right: 10px; font-size: 7.5px; font-weight: 700; color: #854d0e; background: rgba(254,252,232,0.95); padding: 2px 8px; border-radius: 4px; border: 1px solid #fef08a;">
          ${item.sheetNum}
        </div>
      </div>

      <!-- 3. Comprehensive 3-Column Specifications Matrix (Fills vertical middle) -->
      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-bottom: 8px;">
        <!-- Column 1: Chassis & Exterior -->
        <div style="background-color: #faf8f5; border: 1px solid #e7e0d6; border-radius: 6px; padding: 7px 9px;">
          <div style="font-size: 8px; font-weight: 800; text-transform: uppercase; color: #854d0e; letter-spacing: 0.06em; margin-bottom: 3px; display: flex; align-items: center; gap: 4px;">
            <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: #c69a53;"></span>
            Chassis & Exterior Livery
          </div>
          <ul style="margin: 0; padding-left: 10px; font-size: 8px; line-height: 1.35; color: #334155;">
            ${item.mainVehicle.map((p: string) => `<li style="margin-bottom: 2px;">${p}</li>`).join('')}
          </ul>
        </div>

        <!-- Column 2: Emergency Power & Diagnostic Bays -->
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 7px 9px;">
          <div style="font-size: 8px; font-weight: 800; text-transform: uppercase; color: #0369a1; letter-spacing: 0.06em; margin-bottom: 3px; display: flex; align-items: center; gap: 4px;">
            <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: #0284c7;"></span>
            Emergency Power & Diagnostic Tech
          </div>
          <ul style="margin: 0; padding-left: 10px; font-size: 8px; line-height: 1.35; color: #334155;">
            ${item.vehicleLook.map((p: string) => `<li style="margin-bottom: 2px;">${p}</li>`).join('')}
          </ul>
        </div>

        <!-- Column 3: On-Set Props & Rescue Equipment -->
        <div style="background-color: #faf8f5; border: 1px solid #e7e0d6; border-radius: 6px; padding: 7px 9px;">
          <div style="font-size: 8px; font-weight: 800; text-transform: uppercase; color: #92400e; letter-spacing: 0.06em; margin-bottom: 3px; display: flex; align-items: center; gap: 4px;">
            <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: #d97706;"></span>
            On-Set Props & Rescue Tools
          </div>
          <ul style="margin: 0; padding-left: 10px; font-size: 8px; line-height: 1.35; color: #334155;">
            ${item.props.map((p: string) => `<li style="margin-bottom: 2px;">${p}</li>`).join('')}
          </ul>
        </div>
      </div>

      <!-- 4. Bottom Palette Architecture & Staging Rule (Fills bottom area) -->
      <div style="display: grid; grid-template-columns: 0.9fr 1.1fr; gap: 8px; align-items: stretch;">
        <!-- Left: Color Swatches -->
        <div style="background-color: #18181b; border-radius: 6px; padding: 7px 10px; color: #ffffff; display: flex; flex-direction: column; justify-content: space-between;">
          <div style="font-size: 7.5px; font-weight: 800; text-transform: uppercase; color: #c69a53; letter-spacing: 0.08em; margin-bottom: 4px;">
            Art Department Livery Swatches
          </div>
          <div style="display: flex; gap: 8px; align-items: center;">
            <div style="display: flex; align-items: center; gap: 4px;">
              <div style="width: 14px; height: 14px; border-radius: 3px; background: #f59e0b; border: 1px solid #ffffff;"></div>
              <div style="font-size: 7.5px; color: #d4d4d8;">#F59E0B<br/><strong style="color: #ffffff;">Gold</strong></div>
            </div>
            <div style="display: flex; align-items: center; gap: 4px;">
              <div style="width: 14px; height: 14px; border-radius: 3px; background: #ffffff; border: 1px solid #cbd5e1;"></div>
              <div style="font-size: 7.5px; color: #d4d4d8;">#FFFFFF<br/><strong style="color: #ffffff;">Polar White</strong></div>
            </div>
            <div style="display: flex; align-items: center; gap: 4px;">
              <div style="width: 14px; height: 14px; border-radius: 3px; background: #18181b; border: 1px solid #71717a;"></div>
              <div style="font-size: 7.5px; color: #d4d4d8;">#18181B<br/><strong style="color: #ffffff;">Graphite</strong></div>
            </div>
            <div style="display: flex; align-items: center; gap: 4px;">
              <div style="width: 14px; height: 14px; border-radius: 3px; background: #eab308; border: 1px solid #fde047;"></div>
              <div style="font-size: 7.5px; color: #d4d4d8;">#EAB308<br/><strong style="color: #ffffff;">Hazard</strong></div>
            </div>
          </div>
        </div>

        <!-- Right: Art Department Directive & Staging Rule -->
        <div style="background-color: #fefce8; border: 1px solid #fef08a; border-radius: 6px; padding: 7px 10px; display: flex; flex-direction: column; justify-content: center;">
          <div style="font-size: 7.5px; font-weight: 800; text-transform: uppercase; color: #854d0e; letter-spacing: 0.08em; margin-bottom: 2px;">
            ✦ Production & Narrative Directive
          </div>
          <div style="font-size: 8px; line-height: 1.35; color: #713f12; font-weight: 600;">
            ${item.rule}
          </div>
        </div>
      </div>
    `;

    pageBox.contentArea.appendChild(sheetContainer);

    if (idx === allVehicleItems.length - 1) {
      const signoffCard = document.createElement('div');
      signoffCard.style.marginTop = '6px';
      signoffCard.style.backgroundColor = '#ffffff';
      signoffCard.style.border = '1px solid #e2e8f0';
      signoffCard.style.borderRadius = '6px';
      signoffCard.style.padding = '6px 12px';
      signoffCard.style.display = 'flex';
      signoffCard.style.justifyContent = 'space-between';
      signoffCard.style.alignItems = 'center';
      signoffCard.innerHTML = `
        <div>
          <div style="font-size: 9.5px; font-weight: 800; color: #0f172a;">Executive Vehicle Fleet & Props Authorization</div>
          <div style="font-size: 8px; font-weight: 700; color: #b8860b; margin-top: 1px;">
            Prepared By: <span style="color: #0f172a;">Aatif Rasheed</span> • Producer / Director • Nasharz Films
          </div>
          <div style="font-size: 7px; color: #64748b; margin-top: 1px;">Proprietary mobile laboratory & commercial prop staging fleet for Alaska Batteries 2026 Commercials.</div>
        </div>
        <div style="text-align: right; display: flex; flex-direction: column; align-items: flex-end;">
          <div style="font-size: 7px; text-transform: uppercase; letter-spacing: 0.08em; color: #b8860b; font-weight: 800; margin-bottom: 2px;">Official Executive Seal</div>
          <img src="${imageMetaMap.get(branding.sealStamp)?.dataUrl || branding.sealStamp}" style="height: 44px; width: auto; object-fit: contain;" alt="Official Stamp" />
        </div>
      `;
      pageBox.contentArea.appendChild(signoffCard);
    }
  }

  // Update footers
  const totalPages = pages.length;
  pages.forEach((p, idx) => {
    p.footerArea.innerHTML = `
      <span>Nasharz Films • Confidential</span>
      <span>Alaska Batteries Campaign • Vehicle & Props Fleet Lookbook</span>
      <span style="font-weight: 700; color: #b8860b;">Page ${idx + 1} of ${totalPages}</span>
    `;
  });

  try {
    if (document.fonts) await document.fonts.ready;
    await preloadImages(sandbox);

    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });
    for (let i = 0; i < pages.length; i++) {
      const canvas = await html2canvas(pages[i].pageEl, {
        scale: 1.6,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false
      });
      if (i > 0) pdf.addPage('a4', 'portrait');
      pdf.addImage(canvas.toDataURL('image/jpeg', 0.92), 'JPEG', 0, 0, 210, 297);
    }

    const filename = options?.customFileName || '02_Nasharz_Alaska_Vehicles_and_Props_Fleet.pdf';
    if (options?.returnBlob) {
      return { blob: pdf.output('blob'), filename, folder: 'Chapter_07_Art_and_Talent' };
    } else {
      pdf.save(filename);
    }
  } finally {
    document.body.removeChild(sandbox);
  }
}

/**
 * 3. STANDALONE LOCATION SCOUTING & SETS DOSSIER PDF GENERATOR
 */
export async function generateLocationsDossierPDF(
  chapter: Chapter,
  branding: BrandingConfig,
  clientName: string = 'Alaska Batteries Client',
  options?: PDFGenOptions
): Promise<PDFGenResult | void> {
  const sandbox = document.createElement('div');
  sandbox.style.position = 'fixed';
  sandbox.style.left = '-9999px';
  sandbox.style.top = '0';
  sandbox.style.width = '794px';
  sandbox.style.zIndex = '-9999';
  sandbox.style.fontFamily = "'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  document.body.appendChild(sandbox);

  const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const pages: PageBox[] = [];

  const createPage = () => {
    const pageBox = createA4Page(
      pages.length,
      branding,
      '07',
      'Shooting Locations & Sets Dossier',
      'Location Scouting, Permissions & Turnkey Matrix',
      dateStr,
      '5 Verified commercial shooting locations across Lahore & Karachi, plus Evernew Studios technical macro stage, with full GPS coordinates and permits.'
    );
    sandbox.appendChild(pageBox.pageEl);
    pages.push(pageBox);
    return pageBox;
  };

  // Preload location images
  const locationUrls: string[] = LOCATION_SHEETS.map(it => it.url).filter(Boolean);
  if (branding.sealStamp) locationUrls.push(branding.sealStamp);

  const imageMetaMap = new Map<string, { dataUrl: string; aspect: number }>();
  await Promise.all(
    [...new Set(locationUrls)].map(async (u) => {
      const locObj = LOCATION_SHEETS.find(l => l.url === u);
      const res = await loadBase64Image(u, locObj?.title || 'Location Scouting Reference');
      if (res && res.dataUrl) imageMetaMap.set(u, res);
    })
  );

  // Each location sheet gets its own dedicated full-page presentation
  for (let idx = 0; idx < LOCATION_SHEETS.length; idx++) {
    const loc = LOCATION_SHEETS[idx];
    const pageBox = createPage();

    const meta = imageMetaMap.get(loc.url);
    const imgSrc = meta?.dataUrl || loc.url;
    const aspect = meta?.aspect && meta.aspect > 0.1 ? meta.aspect : (16 / 9);

    const imgHeight = 280;
    const imgWidth = Math.min(680, Math.round(imgHeight * aspect));

    const locContainer = document.createElement('div');
    locContainer.style.display = 'flex';
    locContainer.style.flexDirection = 'column';
    locContainer.style.height = '100%';
    locContainer.style.justifyContent = 'space-between';

    locContainer.innerHTML = `
      <!-- Location Header Bar -->
      <div style="background-color: #18181b; border-left: 4px solid #c69a53; border-radius: 6px; padding: 7px 12px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
        <div>
          <div style="font-size: 8px; font-weight: 800; text-transform: uppercase; color: #c69a53; letter-spacing: 0.1em;">
            LOCATION SCOUTING DOSSIER • COMMERCIAL SEQUENCE
          </div>
          <div style="font-size: 12px; font-weight: 800; color: #ffffff; margin-top: 1px;">
            ${loc.title}
          </div>
          <div style="font-size: 8px; color: #a1a1aa; margin-top: 1px;">
            ${loc.city} • GPS: ${loc.coordinates}
          </div>
        </div>
        <div style="font-size: 8.5px; font-weight: 800; color: #18181b; background: #c69a53; padding: 3px 9px; border-radius: 9999px; white-space: nowrap;">
          ${loc.badge}
        </div>
      </div>

      <!-- Location Hero Photo Showcase Container -->
      <div style="background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 8px; padding: 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 295px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); position: relative; margin-bottom: 8px;">
        <img 
          src="${imgSrc}" 
          width="${imgWidth}" 
          height="${imgHeight}" 
          style="max-width: 100%; max-height: 280px; width: auto; height: auto; object-fit: contain; display: block; margin: 0 auto; filter: drop-shadow(0 4px 10px rgba(0,0,0,0.12));" 
          alt="${loc.title}" 
          crossorigin="anonymous" 
        />
        <div style="position: absolute; top: 8px; left: 10px; font-size: 7.5px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.08em; background: rgba(255,255,255,0.9); padding: 2px 6px; border-radius: 4px; border: 1px solid #cbd5e1;">
          ✦ Verified Scouting Dossier
        </div>
        <div style="position: absolute; bottom: 8px; right: 10px; font-size: 7.5px; font-weight: 700; color: #854d0e; background: rgba(254,252,232,0.95); padding: 2px 8px; border-radius: 4px; border: 1px solid #fef08a;">
          ${loc.sheetNum}
        </div>
      </div>

      <!-- Logistics & Production Design Matrix -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 8px;">
        <!-- Left: Logistics & Timing -->
        <div style="background-color: #faf8f5; border: 1px solid #e7e0d6; border-radius: 6px; padding: 8px 10px;">
          <div style="font-size: 8px; font-weight: 800; text-transform: uppercase; color: #854d0e; letter-spacing: 0.06em; margin-bottom: 3px;">
            Logistics, Lighting & Permits
          </div>
          <div style="font-size: 8px; color: #0f172a; font-weight: 700; margin-bottom: 2px;">
            Territory: <span style="font-weight: 500;">${loc.city}</span>
          </div>
          <div style="font-size: 8px; color: #0f172a; font-weight: 700; margin-bottom: 2px;">
            Permits: <span style="font-weight: 500;">${loc.permits}</span>
          </div>
          <div style="font-size: 8px; color: #854d0e; font-weight: 700; margin-top: 4px; background: #fefce8; padding: 4px 6px; border-radius: 4px; border: 1px solid #fef08a;">
            Sun Window: <span style="color: #713f12; font-weight: 600;">${loc.lightingWindow}</span>
          </div>
        </div>

        <!-- Right: Set Dressing Highlights -->
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px 10px;">
          <div style="font-size: 8px; font-weight: 800; text-transform: uppercase; color: #0369a1; letter-spacing: 0.06em; margin-bottom: 3px;">
            Art Department & Set Dressing
          </div>
          <ul style="margin: 0; padding-left: 10px; font-size: 8px; line-height: 1.35; color: #334155;">
            ${loc.productionDesign.map(p => `<li style="margin-bottom: 2px;">${p}</li>`).join('')}
          </ul>
        </div>
      </div>

      <!-- Narrative Goal Callout -->
      <div style="background-color: #f8fafc; border-left: 4px solid #c69a53; border-radius: 0 6px 6px 0; padding: 7px 10px;">
        <div style="font-size: 7.5px; font-weight: 800; text-transform: uppercase; color: #b8860b; letter-spacing: 0.08em; margin-bottom: 2px;">
          Cinematic Goal & Visual Atmosphere
        </div>
        <div style="font-size: 8.5px; color: #334155; line-height: 1.35; font-style: italic;">
          "${loc.visualGoal}"
        </div>
      </div>
    `;

    pageBox.contentArea.appendChild(locContainer);
  }

  // Summary Matrix Page
  const summaryPage = createPage();
  const summaryBlock = document.createElement('div');
  summaryBlock.style.display = 'flex';
  summaryBlock.style.flexDirection = 'column';
  summaryBlock.style.height = '100%';
  summaryBlock.style.justifyContent = 'space-between';

  summaryBlock.innerHTML = `
    <div>
      <div style="background-color: #18181b; border-left: 4px solid #c69a53; border-radius: 6px; padding: 7px 12px; margin-bottom: 10px;">
        <div style="font-size: 8px; font-weight: 800; text-transform: uppercase; color: #c69a53; letter-spacing: 0.1em;">
          PRODUCTION LOGISTICS • SUMMARY MATRIX
        </div>
        <div style="font-size: 12px; font-weight: 800; color: #ffffff; margin-top: 1px;">
          Multi-City Shooting Permissions & Staging Operations
        </div>
      </div>

      <table style="width: 100%; border-collapse: collapse; font-size: 8px; color: #334155; margin-bottom: 12px;">
        <thead>
          <tr style="background-color: #f1f5f9; text-align: left; color: #0f172a; font-weight: 800; font-size: 7.5px; text-transform: uppercase;">
            <th style="padding: 6px 8px; border: 1px solid #cbd5e1;">Film Sequence</th>
            <th style="padding: 6px 8px; border: 1px solid #cbd5e1;">Selected Location</th>
            <th style="padding: 6px 8px; border: 1px solid #cbd5e1;">City / Area</th>
            <th style="padding: 6px 8px; border: 1px solid #cbd5e1;">Permit Authority</th>
            <th style="padding: 6px 8px; border: 1px solid #cbd5e1;">Key Art & Staging Plan</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 6px 8px; border: 1px solid #e2e8f0; font-weight: 700; color: #0f172a;">Film 01 — Car</td>
            <td style="padding: 6px 8px; border: 1px solid #e2e8f0;">Food Street / Badshahi Area</td>
            <td style="padding: 6px 8px; border: 1px solid #e2e8f0;">Lahore Walled City</td>
            <td style="padding: 6px 8px; border: 1px solid #e2e8f0;">WCLA & CTPL • Hazuri Bagh Staging</td>
            <td style="padding: 6px 8px; border: 1px solid #e2e8f0;">High-density traffic gridlock with Badshahi Mosque archway backdrop.</td>
          </tr>
          <tr style="background-color: #fafafa;">
            <td style="padding: 6px 8px; border: 1px solid #e2e8f0; font-weight: 700; color: #0f172a;">Film 02 — Truck</td>
            <td style="padding: 6px 8px; border: 1px solid #e2e8f0;">Ibrahim Hyderi Fish Harbor</td>
            <td style="padding: 6px 8px; border: 1px solid #e2e8f0;">Karachi Port Jetty</td>
            <td style="padding: 6px 8px; border: 1px solid #e2e8f0;">KPT & Fishermen Coop • Marine Bay</td>
            <td style="padding: 6px 8px; border: 1px solid #e2e8f0;">Active maritime cargo wharf, ice crates, heavy commercial truck fleet.</td>
          </tr>
          <tr>
            <td style="padding: 6px 8px; border: 1px solid #e2e8f0; font-weight: 700; color: #0f172a;">Film 03 — Tractor</td>
            <td style="padding: 6px 8px; border: 1px solid #e2e8f0;">Kareem Block Agricultural Fields</td>
            <td style="padding: 6px 8px; border: 1px solid #e2e8f0;">Lahore Suburbs</td>
            <td style="padding: 6px 8px; border: 1px solid #e2e8f0;">Landowners & District Admin</td>
            <td style="padding: 6px 8px; border: 1px solid #e2e8f0;">Lush golden wheat harvest corridor, decorated baraat tractor trolleys.</td>
          </tr>
          <tr style="background-color: #fafafa;">
            <td style="padding: 6px 8px; border: 1px solid #e2e8f0; font-weight: 700; color: #0f172a;">Film 04 — Bike</td>
            <td style="padding: 6px 8px; border: 1px solid #e2e8f0;">Packages Mall Promenade / Walton</td>
            <td style="padding: 6px 8px; border: 1px solid #e2e8f0;">Lahore Central</td>
            <td style="padding: 6px 8px; border: 1px solid #e2e8f0;">Mall Security & Operations Directorate</td>
            <td style="padding: 6px 8px; border: 1px solid #e2e8f0;">Morning corporate rush hour boulevard, contemporary architectural glass facade.</td>
          </tr>
          <tr>
            <td style="padding: 6px 8px; border: 1px solid #e2e8f0; font-weight: 700; color: #0f172a;">Film 05 — UPS</td>
            <td style="padding: 6px 8px; border: 1px solid #e2e8f0;">Fakir Khana Museum Haveli</td>
            <td style="padding: 6px 8px; border: 1px solid #e2e8f0;">Old Lahore (Bhati Gate)</td>
            <td style="padding: 6px 8px; border: 1px solid #e2e8f0;">Fakir Khana Trust & Heritage Directorate</td>
            <td style="padding: 6px 8px; border: 1px solid #e2e8f0;">Historic courtyard decorated for wedding, sudden blackout to full illumination.</td>
          </tr>
          <tr style="background-color: #fafafa;">
            <td style="padding: 6px 8px; border: 1px solid #e2e8f0; font-weight: 700; color: #0f172a;">CGI / Macro Lab</td>
            <td style="padding: 6px 8px; border: 1px solid #e2e8f0;">Evernew Studios Soundstage</td>
            <td style="padding: 6px 8px; border: 1px solid #e2e8f0;">Multan Road, Lahore</td>
            <td style="padding: 6px 8px; border: 1px solid #e2e8f0;">Evernew Studios Management Lease</td>
            <td style="padding: 6px 8px; border: 1px solid #e2e8f0;">Controlled soundstage cyclorama, high-speed Phantom macro spark and graphite battery cutaway rig.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Official Seal & Sign-off Box -->
    <div style="border-top: 1.5px dashed #cbd5e1; padding-top: 10px; display: flex; justify-content: space-between; align-items: flex-end;">
      <div>
        <div style="font-size: 10px; font-weight: 800; color: #0f172a;">Nasharz Films Location Management</div>
        <div style="font-size: 9px; font-weight: 700; color: #b8860b; margin-top: 1px;">
          Prepared By: <span style="color: #0f172a;">Aatif Rasheed</span> • Producer / Director
        </div>
        <div style="font-size: 8px; color: #64748b; margin-top: 2px;">Turnkey location agreements secured for Alaska Batteries 2026 Campaign.</div>
      </div>
      <div style="text-align: right; display: flex; flex-direction: column; align-items: flex-end;">
        <div style="font-size: 7.5px; text-transform: uppercase; letter-spacing: 0.08em; color: #b8860b; font-weight: 700; margin-bottom: 2px;">Official Authorization</div>
        <img src="${branding.sealStamp}" style="height: 50px; width: auto; object-fit: contain;" alt="Official Stamp" />
      </div>
    </div>
  `;

  summaryPage.contentArea.appendChild(summaryBlock);

  // Update footers
  const totalPages = pages.length;
  pages.forEach((p, idx) => {
    p.footerArea.innerHTML = `
      <span>Nasharz Films • Confidential</span>
      <span>Alaska Batteries Campaign • Location Scouting Dossier</span>
      <span style="font-weight: 700; color: #b8860b;">Page ${idx + 1} of ${totalPages}</span>
    `;
  });

  try {
    if (document.fonts) await document.fonts.ready;
    await preloadImages(sandbox);

    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });
    for (let i = 0; i < pages.length; i++) {
      const canvas = await html2canvas(pages[i].pageEl, {
        scale: 1.6,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false
      });
      if (i > 0) pdf.addPage('a4', 'portrait');
      pdf.addImage(canvas.toDataURL('image/jpeg', 0.92), 'JPEG', 0, 0, 210, 297);
    }

    const filename = options?.customFileName || '03_Nasharz_Alaska_Location_Scouting_Dossiers.pdf';
    if (options?.returnBlob) {
      return { blob: pdf.output('blob'), filename, folder: 'Chapter_07_Art_and_Talent' };
    } else {
      pdf.save(filename);
    }
  } finally {
    document.body.removeChild(sandbox);
  }
}

/**
 * 4. STANDALONE CELEBRITY TALENT AGREEMENT PDF GENERATOR
 */
export async function generateTalentAgreementPDF(
  chapter: Chapter,
  branding: BrandingConfig,
  clientName: string = 'Alaska Batteries Client',
  options?: PDFGenOptions
): Promise<PDFGenResult | void> {
  const sandbox = document.createElement('div');
  sandbox.style.position = 'fixed';
  sandbox.style.left = '-9999px';
  sandbox.style.top = '0';
  sandbox.style.width = '794px';
  sandbox.style.zIndex = '-9999';
  sandbox.style.fontFamily = "'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  document.body.appendChild(sandbox);

  const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const pages: PageBox[] = [];

  const createPage = () => {
    const pageBox = createA4Page(
      pages.length,
      branding,
      '07',
      'Celebrity Talent Agreement',
      'Iftikhar Thakur • Likeness & Brand Ambassador Authorization',
      dateStr,
      'Executed 2-year exclusive category brand ambassador contract, likeness rights, territory exclusivity across Pakistan & GCC, and signatory seals.'
    );
    sandbox.appendChild(pageBox.pageEl);
    pages.push(pageBox);
    return pageBox;
  };

  const p1 = createPage();
  const contractContent = document.createElement('div');
  contractContent.style.display = 'flex';
  contractContent.style.flexDirection = 'column';
  contractContent.style.height = '100%';
  contractContent.style.justifyContent = 'space-between';

  contractContent.innerHTML = `
    <div>
      <div style="background-color: #18181b; border-left: 4px solid #c69a53; border-radius: 6px; padding: 8px 12px; margin-bottom: 10px;">
        <div style="font-size: 8px; font-weight: 800; text-transform: uppercase; color: #c69a53; letter-spacing: 0.1em;">
          OFFICIAL TALENT AGREEMENT • LEGAL SUMMARY
        </div>
        <div style="font-size: 12px; font-weight: 800; color: #ffffff; margin-top: 1px;">
          Iftikhar Thakur — Brand Ambassador & Character Variants Contract
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 10px;">
        <div style="background-color: #faf8f5; border: 1px solid #f1ece4; border-radius: 6px; padding: 8px;">
          <div style="font-size: 8.5px; font-weight: 800; text-transform: uppercase; color: #b8860b; margin-bottom: 3px;">Principal Artist Representation</div>
          <div style="font-size: 8px; line-height: 1.4; color: #334155;">
            <strong>Artist Name:</strong> Mr. Iftikhar Ahmad Sheikh (p/k/a Iftikhar Thakur)<br/>
            <strong>Campaign Role:</strong> Brand Ambassador & Character Variants<br/>
            <strong>Exclusivity:</strong> Exclusive to Alaska Batteries across all battery categories for Pakistan & GCC territories.
          </div>
        </div>

        <div style="background-color: #faf8f5; border: 1px solid #f1ece4; border-radius: 6px; padding: 8px;">
          <div style="font-size: 8.5px; font-weight: 800; text-transform: uppercase; color: #b8860b; margin-bottom: 3px;">Term & Deliverables</div>
          <div style="font-size: 8px; line-height: 1.4; color: #334155;">
            <strong>Term Length:</strong> 2 Years from first campaign transmission date.<br/>
            <strong>Film Commitments:</strong> 5 Commercial TVCs + Digital Shorts + OOH Key Art.<br/>
            <strong>Media Usage:</strong> TV, Digital, Social Media, Billboards, Print & In-Store POS.
          </div>
        </div>
      </div>

      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px; margin-bottom: 10px;">
        <div style="font-size: 8.5px; font-weight: 800; text-transform: uppercase; color: #0f172a; margin-bottom: 3px;">Key Contractual Directives & Covenants</div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 7.5px; line-height: 1.35; color: #475569;">
          <div>
            1. <strong>Exclusivity Covenant:</strong> The Artist shall not endorse, perform in, or promote any competing energy, battery, or inverter brand during the 24-month agreement term.<br/>
            2. <strong>Character Versatility:</strong> The Artist is committed to performing all 5 distinct comedic character variants without creative refusal.
          </div>
          <div>
            3. <strong>Shoot Availability:</strong> The Artist guarantees 4 dedicated full shoot days in Lahore & Karachi plus 1 audio dubbing session.<br/>
            4. <strong>Morality & Brand Integrity:</strong> The Artist agrees to uphold standard brand safety standards throughout the tenure of the campaign.
          </div>
        </div>
      </div>
    </div>

    <!-- Official Dual Signatures Box -->
    <div style="border-top: 1.5px dashed #cbd5e1; padding-top: 12px; display: grid; grid-template-columns: 1fr 1fr; gap: 16px; align-items: flex-end;">
      <div>
        <div style="font-size: 8px; text-transform: uppercase; letter-spacing: 0.08em; color: #64748b; font-weight: 700; margin-bottom: 4px;">Artist / Talent Management</div>
        <div style="height: 35px; border-bottom: 1px solid #0f172a; display: flex; align-items: flex-end; padding-bottom: 2px;">
          <span style="font-family: 'Brush Script MT', cursive, sans-serif; font-size: 16px; color: #0f172a;">Iftikhar Thakur</span>
        </div>
        <div style="font-size: 8.5px; font-weight: 700; color: #0f172a; margin-top: 2px;">Iftikhar Ahmad Sheikh (Iftikhar Thakur)</div>
        <div style="font-size: 7.5px; color: #64748b;">Principal Artist & Brand Ambassador</div>
      </div>

      <div style="text-align: right; display: flex; flex-direction: column; align-items: flex-end;">
        <div style="font-size: 8px; text-transform: uppercase; letter-spacing: 0.08em; color: #b8860b; font-weight: 700; margin-bottom: 2px;">Production Executive Seal</div>
        <img src="${branding.sealStamp}" style="height: 55px; width: auto; object-fit: contain;" alt="Official Stamp" />
        <div style="font-size: 8.5px; font-weight: 700; color: #0f172a; margin-top: 2px;">Aatif Rasheed</div>
        <div style="font-size: 7.5px; color: #64748b;">Producer / Director • Nasharz Films</div>
      </div>
    </div>
  `;

  p1.contentArea.appendChild(contractContent);

  // Update footers
  pages.forEach((p, idx) => {
    p.footerArea.innerHTML = `
      <span>Nasharz Films • Confidential</span>
      <span>Alaska Batteries Campaign • Celebrity Talent Agreement</span>
      <span style="font-weight: 700; color: #b8860b;">Page ${idx + 1} of ${pages.length}</span>
    `;
  });

  try {
    if (document.fonts) await document.fonts.ready;
    await preloadImages(sandbox);

    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });
    for (let i = 0; i < pages.length; i++) {
      const canvas = await html2canvas(pages[i].pageEl, {
        scale: 1.6,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false
      });
      if (i > 0) pdf.addPage('a4', 'portrait');
      pdf.addImage(canvas.toDataURL('image/jpeg', 0.92), 'JPEG', 0, 0, 210, 297);
    }

    const filename = options?.customFileName || '04_Nasharz_Alaska_Talent_Agreement_and_Casting.pdf';
    if (options?.returnBlob) {
      return { blob: pdf.output('blob'), filename, folder: 'Chapter_07_Art_and_Talent' };
    } else {
      pdf.save(filename);
    }
  } finally {
    document.body.removeChild(sandbox);
  }
}

/**
 * 5. COMPLETE CHAPTER 07 COMBINED MASTER LOOKBOOK PDF
 * Generates the full consolidated PDF covering all sections:
 * - Master Character Lookbook & Wardrobe Casting
 * - Pehlwan Mobile Diagnostic Van & Hero Props
 * - 5 Film Vehicle & Prop Grids (Car, Truck, Tractor, Bike, UPS Wedding)
 * - Mobile Labs, Tech Diagnostics, & Film Set Requirements
 * - Color & Wardrobe Hierarchy Directives
 * - 6-Hub Turnkey Location Scouting Matrix & Technical Soundstage
 * - Celebrity Talent Representation & Exclusivity Agreement
 * - Dual Legal Execution, Signatures, & Official Executive Seal Stamp
 */
export async function generateChapter07CompletePDF(
  chapter: Chapter,
  branding: BrandingConfig,
  clientName: string = 'Alaska Batteries Client',
  options?: PDFGenOptions
): Promise<PDFGenResult | void> {
  const customFileName = options?.customFileName || '05_Nasharz_Alaska_Chapter07_Master_Lookbook_Complete.pdf';
  return generateChapterPDF(chapter, branding, clientName, {
    ...options,
    customFileName
  });
}
