import { EstimateItem } from '../types';

export interface EstimateCalculationParams {
  days: number;
  locationsPerDay: number;
  studioShots: boolean;
}

export const ESTIMATE_CATEGORIES = [
  'PRE-PRODUCTION',
  'TALENT',
  'DIRECTOR',
  'STUDIO & LOCATION',
  'ART DIRECTION',
  'CAMERA, LIGHTS & EQUIPMENT',
  'MAKE UP & STYLING',
  'PRODUCTION TEAM',
  'FOOD & CATERING',
  'TRANSPORT',
  'POST-PRODUCTION'
] as const;

export const BASE_ESTIMATE_ITEMS: EstimateItem[] = [
  // 1. PRE-PRODUCTION
  { id: 'pre-1', category: 'PRE-PRODUCTION', description: 'Storyboard', rate: '—', units: 1, days: '—', amount: 75000, quantity: 1, unit: 'Job', included: true },
  { id: 'pre-2', category: 'PRE-PRODUCTION', description: 'Recce Meals', rate: '—', units: 1, days: '—', amount: 17000, quantity: 1, unit: 'Days', included: true },
  { id: 'pre-3', category: 'PRE-PRODUCTION', description: 'Recce Transport', rate: '—', units: 1, days: '—', amount: 12000, quantity: 1, unit: 'Days', included: true },
  { id: 'pre-4', category: 'PRE-PRODUCTION', description: 'Recce Fuel', rate: '—', units: 1, days: '—', amount: 10000, quantity: 1, unit: 'Days', included: true },

  // 2. TALENT
  { id: 'tal-1', category: 'TALENT', description: 'All Lead Talent', rate: 'At Actual', units: 1, days: '—', amount: 0, quantity: 1, unit: 'Package', isLeadTalent: true, isAtActual: true, included: true },
  { id: 'tal-2', category: 'TALENT', description: 'All Supporting Talent', rate: 'At Actual', units: 1, days: '—', amount: 0, quantity: 1, unit: 'Package', isAtActual: true, included: true },
  { id: 'tal-3', category: 'TALENT', description: 'Extras / Background Extras & Casting', rate: 'At Actual', units: 1, days: '—', amount: 0, quantity: 1, unit: 'Package', isAtActual: true, included: true },

  // 3. DIRECTOR
  { id: 'dir-1', category: 'DIRECTOR', description: "Director's Fee", rate: '—', units: 1, days: '—', amount: 550000, quantity: 1, unit: 'Project', included: true },
  { id: 'dir-2', category: 'DIRECTOR', description: 'Assistant Director', rate: '—', units: 1, days: '—', amount: 275000, quantity: 1, unit: 'Project', included: true },
  { id: 'dir-3', category: 'DIRECTOR', description: '2nd AD', rate: '—', units: 1, days: '—', amount: 55000, quantity: 1, unit: 'Days', included: true },

  // 4. STUDIO & LOCATION
  { id: 'loc-1', category: 'STUDIO & LOCATION', description: 'Studio Prep Rent', rate: '—', units: 1, days: '—', amount: 175000, quantity: 1, unit: 'Days', included: true },
  { id: 'loc-2', category: 'STUDIO & LOCATION', description: 'Studio Shoot Rent', rate: '—', units: 1, days: '—', amount: 275000, quantity: 1, unit: 'Days', included: true },
  { id: 'loc-3', category: 'STUDIO & LOCATION', description: 'Studio Fuel', rate: '—', units: 1, days: '—', amount: 55000, quantity: 1, unit: 'Days', included: true },
  { id: 'loc-4', category: 'STUDIO & LOCATION', description: 'Studio Staff', rate: '—', units: 1, days: '—', amount: 195000, quantity: 1, unit: 'Days', included: true },
  { id: 'loc-5', category: 'STUDIO & LOCATION', description: 'Location 1', rate: '—', units: 1, days: '—', amount: 375000, quantity: 1, unit: 'Days', included: true },
  { id: 'loc-6', category: 'STUDIO & LOCATION', description: 'Location 2', rate: '—', units: 1, days: '—', amount: 150000, quantity: 1, unit: 'Days', included: true },
  { id: 'loc-7', category: 'STUDIO & LOCATION', description: 'Shooting Permits', rate: '—', units: 1, days: '—', amount: 55000, quantity: 1, unit: 'Days', included: true },
  { id: 'loc-8', category: 'STUDIO & LOCATION', description: 'Location Manager Fee', rate: '—', units: 1, days: '—', amount: 75000, quantity: 1, unit: 'Days', included: true },

  // 5. ART DIRECTION
  { id: 'art-1', category: 'ART DIRECTION', description: 'Art Director', rate: '—', units: 1, days: '—', amount: 150000, quantity: 1, unit: 'Project', included: true },
  { id: 'art-2', category: 'ART DIRECTION', description: 'Assistant Art Director', rate: '—', units: 1, days: '—', amount: 75000, quantity: 1, unit: 'Days', included: true },
  { id: 'art-3', category: 'ART DIRECTION', description: 'Prop Master', rate: '—', units: 1, days: '—', amount: 35000, quantity: 1, unit: 'Days', included: true },
  { id: 'art-4', category: 'ART DIRECTION', description: 'Prop Assistants', rate: '—', units: 1, days: '—', amount: 17000, quantity: 1, unit: 'Days', included: true },
  { id: 'art-5', category: 'ART DIRECTION', description: 'Props Purchase & Rental', rate: '—', units: 1, days: '—', amount: 365000, quantity: 1, unit: 'Days', included: true },
  { id: 'art-6', category: 'ART DIRECTION', description: 'Set Material, Construction & Rental', rate: '—', units: 1, days: '—', amount: 65000, quantity: 1, unit: 'Days', included: true },
  { id: 'art-7', category: 'ART DIRECTION', description: 'Set Team Labour (Carpenter/Electrician/Painter)', rate: '—', units: 1, days: '—', amount: 165000, quantity: 1, unit: 'Days', included: true },
  { id: 'art-8', category: 'ART DIRECTION', description: 'Set Supervisors', rate: '—', units: 1, days: '—', amount: 75000, quantity: 1, unit: 'Days', included: true },

  // 6. CAMERA, LIGHTS & EQUIPMENT
  { id: 'cam-1', category: 'CAMERA, LIGHTS & EQUIPMENT', description: 'DOP', rate: '—', units: 1, days: '—', amount: 250000, quantity: 1, unit: 'Days', included: true },
  { id: 'cam-2', category: 'CAMERA, LIGHTS & EQUIPMENT', description: 'Camera Team', rate: '—', units: 1, days: '—', amount: 55000, quantity: 1, unit: 'Days', included: true },
  { id: 'cam-3', category: 'CAMERA, LIGHTS & EQUIPMENT', description: 'Focus Puller', rate: '—', units: 1, days: '—', amount: 75000, quantity: 1, unit: 'Days', included: true },
  { id: 'cam-4', category: 'CAMERA, LIGHTS & EQUIPMENT', description: 'Camera and Lenses', rate: '—', units: 1, days: '—', amount: 265000, quantity: 1, unit: 'Days', included: true },
  { id: 'cam-5', category: 'CAMERA, LIGHTS & EQUIPMENT', description: 'Special Lenses / Cooke I Lenses', rate: '—', units: 1, days: '—', amount: 150000, quantity: 1, unit: 'Days', included: true },
  { id: 'cam-6', category: 'CAMERA, LIGHTS & EQUIPMENT', description: 'Camera Stabilizer with Operator', rate: '—', units: 1, days: '—', amount: 55000, quantity: 1, unit: 'Days', included: true },
  { id: 'cam-7', category: 'CAMERA, LIGHTS & EQUIPMENT', description: 'Gaffer', rate: '—', units: 1, days: '—', amount: 75000, quantity: 1, unit: 'Days', included: true },
  { id: 'cam-8', category: 'CAMERA, LIGHTS & EQUIPMENT', description: 'Lights, Grips and Accessories', rate: '—', units: 1, days: '—', amount: 295000, quantity: 1, unit: 'Days', included: true },
  { id: 'cam-9', category: 'CAMERA, LIGHTS & EQUIPMENT', description: 'Lighting Team', rate: '—', units: 1, days: '—', amount: 135000, quantity: 1, unit: 'Days', included: true },
  { id: 'cam-10', category: 'CAMERA, LIGHTS & EQUIPMENT', description: 'Track / Dolly / Other Equipment', rate: '—', units: 1, days: '—', amount: 185000, quantity: 1, unit: 'Days', included: true },
  { id: 'cam-11', category: 'CAMERA, LIGHTS & EQUIPMENT', description: 'Generator', rate: '—', units: 1, days: '—', amount: 75000, quantity: 1, unit: 'Days', included: true },
  { id: 'cam-12', category: 'CAMERA, LIGHTS & EQUIPMENT', description: 'Generator Fuel', rate: '—', units: 1, days: '—', amount: 35000, quantity: 1, unit: 'Days', included: true },
  { id: 'cam-13', category: 'CAMERA, LIGHTS & EQUIPMENT', description: 'Hazer Machine / Smoke', rate: '—', units: 1, days: '—', amount: 150000, quantity: 1, unit: 'Days', included: true },
  { id: 'cam-14', category: 'CAMERA, LIGHTS & EQUIPMENT', description: 'On Location Audio Recording', rate: '—', units: 1, days: '—', amount: 75000, quantity: 1, unit: 'Days', included: true },

  // 7. MAKE UP & STYLING
  { id: 'mu-1', category: 'MAKE UP & STYLING', description: 'Wardrobe Stylist', rate: '—', units: 1, days: '—', amount: 75000, quantity: 1, unit: 'Days', included: true },
  { id: 'mu-2', category: 'MAKE UP & STYLING', description: 'Assistant Wardrobe Stylist', rate: '—', units: 1, days: '—', amount: 25000, quantity: 1, unit: 'Days', included: true },
  { id: 'mu-3', category: 'MAKE UP & STYLING', description: 'Wardrobe Helpers (Tailoring, Ironing, Helper)', rate: '—', units: 1, days: '—', amount: 20750, quantity: 1, unit: 'Days', included: true },
  { id: 'mu-4', category: 'MAKE UP & STYLING', description: 'Wardrobe Purchase & Rent', rate: '—', units: 1, days: '—', amount: 335000, quantity: 1, unit: 'Days', included: true },
  { id: 'mu-5', category: 'MAKE UP & STYLING', description: 'Make Up Artist', rate: '—', units: 1, days: '—', amount: 175000, quantity: 1, unit: 'Days', included: true },
  { id: 'mu-6', category: 'MAKE UP & STYLING', description: 'Make Up Assistant', rate: '—', units: 1, days: '—', amount: 35000, quantity: 1, unit: 'Days', included: true },

  // 8. PRODUCTION TEAM
  { id: 'prod-1', category: 'PRODUCTION TEAM', description: 'Line Producer', rate: '—', units: 1, days: '—', amount: 285000, quantity: 1, unit: 'Project', included: true },
  { id: 'prod-2', category: 'PRODUCTION TEAM', description: 'Production Manager', rate: '—', units: 1, days: '—', amount: 75000, quantity: 1, unit: 'Days', included: true },
  { id: 'prod-3', category: 'PRODUCTION TEAM', description: 'Production Supervisor', rate: '—', units: 1, days: '—', amount: 175000, quantity: 1, unit: 'Days', included: true },
  { id: 'prod-4', category: 'PRODUCTION TEAM', description: 'Production Support — Transport Supervisor', rate: '—', units: 1, days: '—', amount: 45000, quantity: 1, unit: 'Days', included: true },
  { id: 'prod-5', category: 'PRODUCTION TEAM', description: 'Production Support — Catering/Food Supervisor', rate: '—', units: 1, days: '—', amount: 45000, quantity: 1, unit: 'Days', included: true },
  { id: 'prod-6', category: 'PRODUCTION TEAM', description: 'Assistant Production Supervisor', rate: '—', units: 1, days: '—', amount: 55000, quantity: 1, unit: 'Days', included: true },
  { id: 'prod-7', category: 'PRODUCTION TEAM', description: 'Spot Boys & Runners', rate: '—', units: 1, days: '—', amount: 45000, quantity: 1, unit: 'Days', included: true },
  { id: 'prod-8', category: 'PRODUCTION TEAM', description: 'Assistant Producers', rate: '—', units: 1, days: '—', amount: 15000, quantity: 1, unit: 'Days', included: true },
  { id: 'prod-9', category: 'PRODUCTION TEAM', description: 'Production Assistant', rate: '—', units: 1, days: '—', amount: 15000, quantity: 1, unit: 'Days', included: true },

  // 9. FOOD & CATERING
  { id: 'food-1', category: 'FOOD & CATERING', description: 'Breakfast, Lunch & Dinner — Crew', rate: '—', units: 1, days: '—', amount: 175000, quantity: 1, unit: 'Days', included: true },
  { id: 'food-2', category: 'FOOD & CATERING', description: 'Breakfast, Lunch & Dinner — Client/Agency', rate: '—', units: 1, days: '—', amount: 55000, quantity: 1, unit: 'Days', included: true },
  { id: 'food-3', category: 'FOOD & CATERING', description: 'Breakfast, Lunch & Dinner — Director/AD/DOP/Art/Stylist', rate: '—', units: 1, days: '—', amount: 35500, quantity: 1, unit: 'Days', included: true },
  { id: 'food-4', category: 'FOOD & CATERING', description: 'Breakfast, Lunch & Dinner — Models', rate: '—', units: 1, days: '—', amount: 45000, quantity: 1, unit: 'Days', included: true },
  { id: 'food-5', category: 'FOOD & CATERING', description: 'Refreshments', rate: '—', units: 1, days: '—', amount: 55000, quantity: 1, unit: 'Days', included: true },
  { id: 'food-6', category: 'FOOD & CATERING', description: 'Production Setup & Decoration', rate: '—', units: 1, days: '—', amount: 25000, quantity: 1, unit: 'Days', included: true },

  // 10. TRANSPORT
  { id: 'tr-1', category: 'TRANSPORT', description: 'Client Car', rate: '—', units: 1, days: '—', amount: 25000, quantity: 1, unit: 'Days', included: true },
  { id: 'tr-2', category: 'TRANSPORT', description: 'Agency Car', rate: '—', units: 1, days: '—', amount: 25000, quantity: 1, unit: 'Days', included: true },
  { id: 'tr-3', category: 'TRANSPORT', description: 'Producer Car', rate: '—', units: 1, days: '—', amount: 25000, quantity: 1, unit: 'Days', included: true },
  { id: 'tr-4', category: 'TRANSPORT', description: 'Director Car', rate: '—', units: 1, days: '—', amount: 25000, quantity: 1, unit: 'Days', included: true },
  { id: 'tr-5', category: 'TRANSPORT', description: 'DOP Car', rate: '—', units: 1, days: '—', amount: 15000, quantity: 1, unit: 'Days', included: true },
  { id: 'tr-6', category: 'TRANSPORT', description: 'Art Director Car', rate: '—', units: 1, days: '—', amount: 15000, quantity: 1, unit: 'Days', included: true },
  { id: 'tr-7', category: 'TRANSPORT', description: 'Wardrobe Car', rate: '—', units: 1, days: '—', amount: 50000, quantity: 1, unit: 'Days', included: true },
  { id: 'tr-8', category: 'TRANSPORT', description: 'Make Up Car', rate: '—', units: 1, days: '—', amount: 5000, quantity: 1, unit: 'Days', included: true },
  { id: 'tr-9', category: 'TRANSPORT', description: 'Talent Car 1', rate: '—', units: 1, days: '—', amount: 25000, quantity: 1, unit: 'Days', included: true },
  { id: 'tr-10', category: 'TRANSPORT', description: 'Talent Car 2', rate: '—', units: 1, days: '—', amount: 15000, quantity: 1, unit: 'Days', included: true },
  { id: 'tr-11', category: 'TRANSPORT', description: 'Steadycam Car', rate: '—', units: 1, days: '—', amount: 15000, quantity: 1, unit: 'Days', included: true },
  { id: 'tr-12', category: 'TRANSPORT', description: 'Sound Recordist Car', rate: '—', units: 1, days: '—', amount: 15000, quantity: 1, unit: 'Days', included: true },
  { id: 'tr-13', category: 'TRANSPORT', description: 'Camera Van', rate: '—', units: 1, days: '—', amount: 15000, quantity: 1, unit: 'Days', included: true },
  { id: 'tr-14', category: 'TRANSPORT', description: 'Light Truck', rate: '—', units: 1, days: '—', amount: 15000, quantity: 1, unit: 'Days', included: true },
  { id: 'tr-15', category: 'TRANSPORT', description: 'Art Truck', rate: '—', units: 1, days: '—', amount: 55000, quantity: 1, unit: 'Days', included: true },
  { id: 'tr-16', category: 'TRANSPORT', description: 'Production Truck', rate: '—', units: 1, days: '—', amount: 65000, quantity: 1, unit: 'Days', included: true },
  { id: 'tr-17', category: 'TRANSPORT', description: 'Vanity Van', rate: '—', units: 1, days: '—', amount: 450000, quantity: 1, unit: 'Days', included: true },
  { id: 'tr-18', category: 'TRANSPORT', description: 'Fuel for All Transport', rate: '—', units: 1, days: '—', amount: 75000, quantity: 1, unit: 'Days', included: true },

  // 11. POST-PRODUCTION
  { id: 'post-1', category: 'POST-PRODUCTION', description: 'Edit', rate: '—', units: 1, days: '—', amount: 250000, quantity: 1, unit: 'Project', included: true },
  { id: 'post-2', category: 'POST-PRODUCTION', description: 'Color Grade', rate: '—', units: 1, days: '—', amount: 235000, quantity: 1, unit: 'Project', included: true },
  { id: 'post-3', category: 'POST-PRODUCTION', description: 'Online Post & Composite', rate: '—', units: 1, days: '—', amount: 450000, quantity: 1, unit: 'Project', included: true },
  { id: 'post-4', category: 'POST-PRODUCTION', description: 'Animation', rate: '—', units: 1, days: '—', amount: 250000, quantity: 1, unit: 'Project', included: true },
  { id: 'post-5', category: 'POST-PRODUCTION', description: 'Music, Sound Design & Studio', rate: '—', units: 1, days: '—', amount: 355000, quantity: 1, unit: 'Project', included: true },
  { id: 'post-6', category: 'POST-PRODUCTION', description: 'Voice Over Artist', rate: '—', units: 1, days: '—', amount: 75000, quantity: 1, unit: 'Project', included: true },
  { id: 'post-7', category: 'POST-PRODUCTION', description: 'Hard Drives', rate: '—', units: 1, days: '—', amount: 55000, quantity: 1, unit: 'Units', included: true },
];

/**
 * Calculates budget target and adjusts line items according to user parameters:
 * - Day 1: 7.5 Million PKR (Pre-prod, production, full post-production included)
 * - Day 2: 5.5 Million PKR (Post-production cost exempted/same as Day 1) -> Total 13.0M
 * - Day 3+: 5.25 Million PKR per additional day from Day 3 onwards
 */
export function calculateEstimateItems(params: EstimateCalculationParams): EstimateItem[] {
  const days = Math.max(1, Math.round(params.days || 1));
  const locationsPerDay = Math.max(1, Math.round(params.locationsPerDay || 1));
  const studioShots = params.studioShots;

  // Calculate Target Hard Cost:
  // 1 Day = 7.5 mil
  // 2 Days = 7.5 mil + 5.5 mil = 13.0 mil
  // 3 Days onwards = 7.5 mil + 5.5 mil + (days - 2) * 5.25 mil
  let targetHardCost = 7500000;
  if (days === 2) {
    targetHardCost += 5500000;
  } else if (days >= 3) {
    targetHardCost += 5500000 + (days - 2) * 5250000;
  }

  // Work on items array, replacing static location entries with dynamic locations matching locationsPerDay
  const items: EstimateItem[] = [];

  BASE_ESTIMATE_ITEMS.forEach((item) => {
    // If it's a static Location entry, skip - we will insert dynamic locations
    if (
      item.category === 'STUDIO & LOCATION' &&
      (item.id === 'loc-5' || item.id === 'loc-6' || item.description.startsWith('Location '))
    ) {
      return;
    }

    // Insert dynamic locations right before Shooting Permits (loc-7)
    if (item.category === 'STUDIO & LOCATION' && item.id === 'loc-7') {
      for (let i = 1; i <= locationsPerDay; i++) {
        items.push({
          id: `loc-num-${i}`,
          category: 'STUDIO & LOCATION',
          description: `Location ${i}`,
          rate: '—',
          units: 1,
          days: days,
          amount: i === 1 ? 375000 : 150000,
          quantity: days,
          unit: 'Days',
          included: true,
        });
      }
    }

    // Clone base item
    const cloned = { ...item };

    // Adjust Studio items if no studio shots
    if (!studioShots && cloned.category === 'STUDIO & LOCATION' && cloned.description.toLowerCase().startsWith('studio')) {
      cloned.amount = 0;
      cloned.included = false;
    }

    // Set unit/day indicators where appropriate
    if (cloned.unit === 'Days' || cloned.unit === 'Day') {
      cloned.days = days;
      cloned.quantity = days;
    }

    items.push(cloned);
  });

  // Post-Production hard cost total remains strictly constant and does NOT increase when shoot days increase
  const postProdItems = items.filter((it) => it.category === 'POST-PRODUCTION' && it.included);
  const postProdTotal = postProdItems.reduce((sum, it) => sum + (it.amount || 0), 0);

  // The remaining target budget belongs strictly to production / shoot / pre-prod costs
  const shootTargetHardCost = Math.max(0, targetHardCost - postProdTotal);

  // Filter items that are scalable: included, non-talent, non-post-production, and have an initial amount > 0
  const scalableShootItems = items.filter(
    (it) => it.included && !it.isLeadTalent && it.category !== 'POST-PRODUCTION' && it.amount > 0
  );
  const currentShootTotal = scalableShootItems.reduce((sum, it) => sum + it.amount, 0);

  if (currentShootTotal > 0 && shootTargetHardCost > 0) {
    const scaleFactor = shootTargetHardCost / currentShootTotal;

    let runningSum = 0;
    scalableShootItems.forEach((it, index) => {
      if (index === scalableShootItems.length - 1) {
        // Last shoot item absorbs remainder so shoot total matches shootTargetHardCost exactly
        it.amount = Math.max(5000, shootTargetHardCost - runningSum);
      } else {
        const scaled = Math.round((it.amount * scaleFactor) / 500) * 500;
        it.amount = scaled;
        runningSum += scaled;
      }
    });
  }

  return items;
}
