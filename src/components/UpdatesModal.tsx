import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Film,
  Image as ImageIcon,
  CheckCircle2,
  ArrowRight,
  Calendar,
  Shirt,
  Truck,
  MapPin,
  FileText,
  Layers,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Zap,
  Music,
  Users,
  Car,
  Award
} from 'lucide-react';

interface UpdatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateChapter: (chapterId: string, conceptTab?: string) => void;
}

type UpdateTabType = 'overview' | 'wardrobe' | 'vehicles' | 'locations' | 'contract' | 'scripts' | 'storyboards';

export const UpdatesModal: React.FC<UpdatesModalProps> = ({
  isOpen,
  onClose,
  onNavigateChapter,
}) => {
  const [activeTab, setActiveTab] = useState<UpdateTabType>('overview');

  if (!isOpen) return null;

  // Key wardrobe highlights
  const wardrobeHighlights = [
    {
      seq: 'Main Look',
      title: 'Battery Pehlwan (Master Look)',
      actor: 'Iftikhar Thakur',
      desc: 'Clean structured white lab coat, crisp shirt, tie, formal trousers, formal shoes, rubber gloves. Strictly no cap, no turban, no stethoscope.',
      img: 'https://res.cloudinary.com/dawlj9ne4/image/upload/Battery_Pehlwan_Sheet_w2wp4c.png',
      tabKey: 'wardrobe'
    },
    {
      seq: 'Main Unit',
      title: 'Alaska Rapid Response Medical/Tech Team',
      actor: 'Supporting Cast',
      desc: 'Uniformed laboratory specialists in clean white lab coats with tech badges, supporting Battery Pehlwan during the diagnostic intervention.',
      img: 'https://res.cloudinary.com/dawlj9ne4/image/upload/Battery_Pehlwan_Medical_Team_Sheet_v07k88.png',
      tabKey: 'wardrobe'
    },
    {
      seq: 'Film 01 • Car',
      title: 'Traffic Policeman & Luxury Car Owner',
      actor: 'Iftikhar Thakur & Model',
      desc: 'Authentic Pakistani traffic police uniform with insignia and official color options, contrasting against high-end executive commuter styling.',
      img: 'https://res.cloudinary.com/dawlj9ne4/image/upload/Battery_Pehlwan_Traf_Policeman_Sheet_bmo9yi.png',
      tabKey: 'wardrobe'
    },
    {
      seq: 'Film 02 • Bike',
      title: 'Office Executive & Taxi Biker',
      actor: 'Iftikhar Thakur & Model',
      desc: 'Tailored safari suit for the late executive, contrasting with vibrant helmet, windcheater and ride-hail commuter gear.',
      img: 'https://res.cloudinary.com/dawlj9ne4/image/upload/Battery_Pehlwan_Office_Executive_Sheet_k7dybx.png',
      tabKey: 'wardrobe'
    },
    {
      seq: 'Film 03 • Truck',
      title: 'Fisherman Captain & Port Logistics Driver',
      actor: 'Iftikhar Thakur & Crew',
      desc: 'Weathered coastal coastal workwear with utility vest and port cargo boots at the Ibrahim Hyderi fishing jetty.',
      img: 'https://res.cloudinary.com/dawlj9ne4/image/upload/Battery_Pehlwan_Pathan_Thakur_Sheet_d2i9er.png',
      tabKey: 'wardrobe'
    },
    {
      seq: 'Film 04 • Tractor',
      title: 'Chaudhary Thakur (Option 1 & 2) & Agri Crew',
      actor: 'Iftikhar Thakur & Farm Crew',
      desc: 'Prestigious rural landlord attire with embroidered waistcoat, festive turban or traditional Boski, paired with hardworking harvest crew workwear.',
      img: 'https://res.cloudinary.com/dawlj9ne4/image/upload/Battery_Pehlwan_ch_sb_Sheet_hi8350.png',
      tabKey: 'wardrobe'
    },
    {
      seq: 'Film 05 • UPS',
      title: 'Festive Wedding Guest & Groom / Mother',
      actor: 'Iftikhar Thakur & Cast',
      desc: 'Richly decorated festive sherwani and traditional wedding attire inside a historic haveli setting.',
      img: 'https://res.cloudinary.com/dawlj9ne4/image/upload/Battery_Pehlwan_Wedding_Guest_Sheet_yij1ox.png',
      tabKey: 'wardrobe'
    }
  ];

  // Key vehicle highlights
  const vehicleHighlights = [
    {
      type: 'Hero Mobile Lab',
      title: 'Battery Pehlwan Emergency Response Van',
      desc: 'Unified mobile diagnostic laboratory featuring 3 distinct livery options (Master Livery, Aero Graphic, Heavy Utility) serving as the iconic recurring visual across all 5 commercial films.',
      img: 'https://res.cloudinary.com/dawlj9ne4/image/upload/Battery_Pehlwan_Branded_Veh_op1_esdu3i.png',
      tabKey: 'vehicle-props'
    },
    {
      type: 'Film 01 • Luxury Car',
      title: 'Executive Sedan & Winter Morning Props',
      desc: 'High-end modern executive sedan stranded in cold morning traffic, with battery swap tools and diagnostic meters.',
      img: 'https://res.cloudinary.com/dawlj9ne4/image/upload/Car_Seq_uj7m0o.png',
      tabKey: 'vehicle-props'
    },
    {
      type: 'Film 02 • Commuter Bike',
      title: 'Taxi Motorcycle & Street Props Grid',
      desc: 'Standard Pakistani commuter motorcycle with ride-hail taxi accessories, street microphones, and quick-start battery.',
      img: 'https://res.cloudinary.com/dawlj9ne4/image/upload/Bike_cuffkf.png',
      tabKey: 'vehicle-props'
    },
    {
      type: 'Film 03 • Port Cargo Truck',
      title: 'Heavy Refrigerated Logistics Cargo Truck',
      desc: 'Heavy commercial logistics truck loaded with perishable seafood containers at Karachi coastal jetty.',
      img: 'https://res.cloudinary.com/dawlj9ne4/image/upload/Truck_Seq_wdek71.png',
      tabKey: 'vehicle-props'
    },
    {
      type: 'Film 04 • Agri Tractor',
      title: 'Heavy Agricultural Tractor & Farmland Props',
      desc: 'High-power agricultural tractor decorated for morning baraat in rural harvest fields.',
      img: 'https://res.cloudinary.com/dawlj9ne4/image/upload/Tractor_Seq_jd8v1u.png',
      tabKey: 'vehicle-props'
    },
    {
      type: 'Film 05 • Haveli UPS Unit',
      title: 'Wedding Home UPS & Electrical Continuity Grid',
      desc: 'Deep cycle backup inverter system, heavy graphite plates, and bridal home lighting props.',
      img: 'https://res.cloudinary.com/dawlj9ne4/image/upload/Wedding_zgf47s.png',
      tabKey: 'vehicle-props'
    }
  ];

  // Key locations highlights
  const locationHighlights = [
    {
      num: '01',
      film: 'Film 01 • Car',
      name: 'Food Street / Badshahi Masjid Area',
      city: 'Old Lahore',
      desc: 'Iconic heritage streetscape with architectural warmth, morning mist, and urban density.',
      img: 'https://res.cloudinary.com/dawlj9ne4/image/upload/car_seq_location_daydas.png',
      tabKey: 'locations-map'
    },
    {
      num: '02',
      film: 'Film 02 • Truck',
      name: 'Ibrahim Hyderi Fishing Port & Jetty',
      city: 'Karachi Coastal Belt',
      desc: 'Atmospheric seaport with wooden boats, fishing nets, morning fog, and heavy cargo activity.',
      img: 'https://res.cloudinary.com/dawlj9ne4/image/upload/Truck_location_en8hv0.png',
      tabKey: 'locations-map'
    },
    {
      num: '03',
      film: 'Film 03 • Tractor',
      name: 'Agri Farmland Fields & Harvest Horizon',
      city: 'Lahore Rural Belt',
      desc: 'Sprawling mustard and wheat fields with expansive skies and golden hour agricultural lighting.',
      img: 'https://res.cloudinary.com/dawlj9ne4/image/upload/Tractor_seq_1_kqpwwa.png',
      tabKey: 'locations-map'
    },
    {
      num: '04',
      film: 'Film 04 • Bike',
      name: 'Packages Mall Promenade & Glass Plaza',
      city: 'Walton Road, Lahore',
      desc: 'Ultra-modern urban plaza with polished granite, glass curtain walls, and contemporary business aesthetic.',
      img: 'https://res.cloudinary.com/dawlj9ne4/image/upload/Bike_Seq_Loc_qgltqe.png',
      tabKey: 'locations-map'
    },
    {
      num: '05',
      film: 'Film 05 • UPS',
      name: 'Fakir Khana Haveli Heritage Residence',
      city: 'Walled City, Lahore',
      desc: 'Historic aristocratic mansion with intricate carved woodwork, grand courtyards, and festive bridal decor.',
      img: 'https://res.cloudinary.com/dawlj9ne4/image/upload/UPS_Location_ldzp72.png',
      tabKey: 'locations-map'
    },
    {
      num: '06',
      film: 'Diagnostic Sequence',
      name: 'Evernew Studios Soundstage & Technical Lab',
      city: 'Multan Road, Lahore',
      desc: 'Controlled acoustic studio soundstage for specialized product lighting, high-speed macro shots, and lab rigs.',
      img: 'https://res.cloudinary.com/dawlj9ne4/image/upload/Studio_Seq_gsrnsm.png',
      tabKey: 'locations-map'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-[#eae8e3] border border-zinc-300 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 text-white flex items-center justify-between border-b border-amber-500/30 shrink-0">
          <div className="flex items-center gap-3">
            <span className="p-2 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-[#c69a53] uppercase tracking-widest">
                  Campaign Master Updates & Lookbook
                </span>
                <span className="bg-amber-400 text-black text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                  NEW RELEASES
                </span>
              </div>
              <h2 className="text-base sm:text-xl font-extrabold text-white font-heading">
                What's New in the Campaign Deck
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800 transition-colors cursor-pointer"
            title="Close Updates Hub"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Interactive Top Sub-Tabs Navigation Bar */}
        <div className="bg-[#dfdcd5] border-b border-zinc-300 px-4 sm:px-6 py-2 overflow-x-auto no-scrollbar shrink-0 flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'overview'
                ? 'bg-zinc-900 text-amber-400 shadow-xs'
                : 'text-zinc-700 hover:text-zinc-950 hover:bg-zinc-200/80'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('wardrobe')}
            className={`px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'wardrobe'
                ? 'bg-[#c69a53] text-black shadow-xs'
                : 'text-zinc-700 hover:text-zinc-950 hover:bg-zinc-200/80'
            }`}
          >
            <Shirt className="w-3.5 h-3.5" />
            <span>Wardrobe & Casting</span>
            <span className="bg-black/15 text-[10px] px-1.5 py-0.2 rounded-md font-extrabold">17</span>
          </button>

          <button
            onClick={() => setActiveTab('vehicles')}
            className={`px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'vehicles'
                ? 'bg-[#c69a53] text-black shadow-xs'
                : 'text-zinc-700 hover:text-zinc-950 hover:bg-zinc-200/80'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Vehicles & Props</span>
            <span className="bg-black/15 text-[10px] px-1.5 py-0.2 rounded-md font-extrabold">6</span>
          </button>

          <button
            onClick={() => setActiveTab('locations')}
            className={`px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'locations'
                ? 'bg-[#c69a53] text-black shadow-xs'
                : 'text-zinc-700 hover:text-zinc-950 hover:bg-zinc-200/80'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Locations & Maps</span>
            <span className="bg-black/15 text-[10px] px-1.5 py-0.2 rounded-md font-extrabold">6</span>
          </button>

          <button
            onClick={() => setActiveTab('contract')}
            className={`px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'contract'
                ? 'bg-[#c69a53] text-black shadow-xs'
                : 'text-zinc-700 hover:text-zinc-950 hover:bg-zinc-200/80'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Talent Contract</span>
            <span className="bg-amber-600/20 text-amber-900 text-[10px] px-1.5 py-0.2 rounded-md font-extrabold">2-Yr</span>
          </button>

          <button
            onClick={() => setActiveTab('scripts')}
            className={`px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'scripts'
                ? 'bg-zinc-900 text-amber-400 shadow-xs'
                : 'text-zinc-700 hover:text-zinc-950 hover:bg-zinc-200/80'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>TVC Scripts & Jingles</span>
            <span className="bg-black/15 text-[10px] px-1.5 py-0.2 rounded-md font-extrabold">5 Films</span>
          </button>

          <button
            onClick={() => setActiveTab('storyboards')}
            className={`px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'storyboards'
                ? 'bg-zinc-900 text-amber-400 shadow-xs'
                : 'text-zinc-700 hover:text-zinc-950 hover:bg-zinc-200/80'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Storyboards</span>
            <span className="bg-black/15 text-[10px] px-1.5 py-0.2 rounded-md font-extrabold">25 Sheets</span>
          </button>
        </div>

        {/* Modal Scrollable Content Area */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6 text-sm text-zinc-800">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-amber-500 text-black rounded-xl font-black">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-zinc-900 text-base">
                      Complete Campaign Production Package
                    </h3>
                    <p className="text-xs text-zinc-600">
                      The presentation deck has been updated with master commercial scripts, full storyboard suites, wardrobe sheets, vehicle packages, location dossiers, and the official ambassador contract.
                    </p>
                  </div>
                </div>
              </div>

              {/* Grid of Update Modules */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Module 1: Wardrobe & Casting */}
                <div className="p-4 bg-white/90 rounded-2xl border border-zinc-200 shadow-xs flex flex-col justify-between hover:border-amber-400 transition-all">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-extrabold text-[#b8860b] uppercase tracking-wider flex items-center gap-1.5">
                        <Shirt className="w-3.5 h-3.5" /> Chapter 07 • Art & Talent
                      </span>
                      <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        17 Look Sheets
                      </span>
                    </div>
                    <h4 className="font-extrabold text-zinc-900 text-sm mb-1">
                      Wardrobe & Character Transformations
                    </h4>
                    <p className="text-xs text-zinc-600 mb-3 leading-relaxed">
                      Complete costume guidelines for Iftikhar Thakur across 5 commercial films, medical team styling, policeman color palettes, and strict headwear mandates.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 pt-2 border-t border-zinc-100">
                    <button
                      onClick={() => setActiveTab('wardrobe')}
                      className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold rounded-xl transition-all cursor-pointer"
                    >
                      Quick Preview
                    </button>
                    <button
                      onClick={() => {
                        onClose();
                        onNavigateChapter('art-talent', 'wardrobe');
                      }}
                      className="px-3 py-1.5 bg-[#c69a53] hover:bg-[#b08542] text-black text-xs font-black rounded-xl transition-all flex items-center gap-1 ml-auto cursor-pointer"
                    >
                      <span>Open Lookbook</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Module 2: Vehicles & Props */}
                <div className="p-4 bg-white/90 rounded-2xl border border-zinc-200 shadow-xs flex flex-col justify-between hover:border-amber-400 transition-all">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-extrabold text-[#b8860b] uppercase tracking-wider flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5" /> Chapter 07 • Art & Talent
                      </span>
                      <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        6 Production Grids
                      </span>
                    </div>
                    <h4 className="font-extrabold text-zinc-900 text-sm mb-1">
                      Hero Vehicles & Mobile Labs
                    </h4>
                    <p className="text-xs text-zinc-600 mb-3 leading-relaxed">
                      Battery Pehlwan Emergency Van liveries (3 options), executive luxury sedan, heavy refrigerated cargo truck, agricultural tractor, motorcycle, and wedding UPS grid.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 pt-2 border-t border-zinc-100">
                    <button
                      onClick={() => setActiveTab('vehicles')}
                      className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold rounded-xl transition-all cursor-pointer"
                    >
                      Quick Preview
                    </button>
                    <button
                      onClick={() => {
                        onClose();
                        onNavigateChapter('art-talent', 'vehicle-props');
                      }}
                      className="px-3 py-1.5 bg-[#c69a53] hover:bg-[#b08542] text-black text-xs font-black rounded-xl transition-all flex items-center gap-1 ml-auto cursor-pointer"
                    >
                      <span>Open Vehicles</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Module 3: Locations Matrix */}
                <div className="p-4 bg-white/90 rounded-2xl border border-zinc-200 shadow-xs flex flex-col justify-between hover:border-amber-400 transition-all">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-extrabold text-[#b8860b] uppercase tracking-wider flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" /> Chapter 07 • Art & Talent
                      </span>
                      <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        6 Scouted Locations
                      </span>
                    </div>
                    <h4 className="font-extrabold text-zinc-900 text-sm mb-1">
                      Production Locations & Base Camps
                    </h4>
                    <p className="text-xs text-zinc-600 mb-3 leading-relaxed">
                      Food Street Badshahi Masjid, Ibrahim Hyderi Port Karachi, Farmland Fields, Packages Mall Promenade, Fakir Khana Haveli & Evernew Soundstage.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 pt-2 border-t border-zinc-100">
                    <button
                      onClick={() => setActiveTab('locations')}
                      className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold rounded-xl transition-all cursor-pointer"
                    >
                      Quick Preview
                    </button>
                    <button
                      onClick={() => {
                        onClose();
                        onNavigateChapter('art-talent', 'locations-map');
                      }}
                      className="px-3 py-1.5 bg-[#c69a53] hover:bg-[#b08542] text-black text-xs font-black rounded-xl transition-all flex items-center gap-1 ml-auto cursor-pointer"
                    >
                      <span>Open Locations</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Module 4: Talent Agreement */}
                <div className="p-4 bg-white/90 rounded-2xl border border-zinc-200 shadow-xs flex flex-col justify-between hover:border-amber-400 transition-all">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-extrabold text-[#b8860b] uppercase tracking-wider flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5" /> Chapter 07 • Legal & Talent
                      </span>
                      <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        2-Year Exclusive
                      </span>
                    </div>
                    <h4 className="font-extrabold text-zinc-900 text-sm mb-1">
                      Ambassador Agreement (Iftikhar Thakur)
                    </h4>
                    <p className="text-xs text-zinc-600 mb-3 leading-relaxed">
                      Official legal agreement covering 2026–2028 term, 5 production shoot days, worldwide commercial usage, and AI/digital likeness exclusivity protection.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 pt-2 border-t border-zinc-100">
                    <button
                      onClick={() => setActiveTab('contract')}
                      className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold rounded-xl transition-all cursor-pointer"
                    >
                      Quick Preview
                    </button>
                    <button
                      onClick={() => {
                        onClose();
                        onNavigateChapter('art-talent', 'talent-contract');
                      }}
                      className="px-3 py-1.5 bg-[#c69a53] hover:bg-[#b08542] text-black text-xs font-black rounded-xl transition-all flex items-center gap-1 ml-auto cursor-pointer"
                    >
                      <span>Open Agreement</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Module 5: TVC Concepts & Scripts */}
                <div className="p-4 bg-white/90 rounded-2xl border border-zinc-200 shadow-xs flex flex-col justify-between hover:border-amber-400 transition-all">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-extrabold text-[#b8860b] uppercase tracking-wider flex items-center gap-1.5">
                        <Film className="w-3.5 h-3.5" /> Chapter 05 • Concepts
                      </span>
                      <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        5 Film Suite
                      </span>
                    </div>
                    <h4 className="font-extrabold text-zinc-900 text-sm mb-1">
                      Master "Battery Phelwan" TVC Suite
                    </h4>
                    <p className="text-xs text-zinc-600 mb-3 leading-relaxed">
                      Complete Urdu dialogic scripts for Car, Truck, Tractor, Bike, and UPS commercials, plus 3 Punjabi Jingles (Option A, B, C) and closing punchlines.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 pt-2 border-t border-zinc-100">
                    <button
                      onClick={() => setActiveTab('scripts')}
                      className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold rounded-xl transition-all cursor-pointer"
                    >
                      Quick Preview
                    </button>
                    <button
                      onClick={() => {
                        onClose();
                        onNavigateChapter('concepts', 'final-concepts');
                      }}
                      className="px-3 py-1.5 bg-zinc-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1 ml-auto cursor-pointer"
                    >
                      <span>Open Scripts</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#c69a53]" />
                    </button>
                  </div>
                </div>

                {/* Module 6: Storyboards */}
                <div className="p-4 bg-white/90 rounded-2xl border border-zinc-200 shadow-xs flex flex-col justify-between hover:border-amber-400 transition-all">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-extrabold text-[#b8860b] uppercase tracking-wider flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5" /> Chapter 06 • Storyboards
                      </span>
                      <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        25 HD Sheets
                      </span>
                    </div>
                    <h4 className="font-extrabold text-zinc-900 text-sm mb-1">
                      Commercial Film Storyboards & PDFs
                    </h4>
                    <p className="text-xs text-zinc-600 mb-3 leading-relaxed">
                      Complete visual framing for Main TVC, Bike, Car, Truck, Tractor, UPS, with interactive zoom, magnifying pan, and vector production PDFs.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 pt-2 border-t border-zinc-100">
                    <button
                      onClick={() => setActiveTab('storyboards')}
                      className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold rounded-xl transition-all cursor-pointer"
                    >
                      Quick Preview
                    </button>
                    <button
                      onClick={() => {
                        onClose();
                        onNavigateChapter('storyboards');
                      }}
                      className="px-3 py-1.5 bg-zinc-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1 ml-auto cursor-pointer"
                    >
                      <span>Open Storyboards</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#c69a53]" />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: WARDROBE & CASTING */}
          {activeTab === 'wardrobe' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-zinc-200">
                <div>
                  <h3 className="font-extrabold text-zinc-900 text-base flex items-center gap-2">
                    <Shirt className="w-5 h-5 text-[#b8860b]" /> Wardrobe, Costume & Character Transformations
                  </h3>
                  <p className="text-xs text-zinc-500">
                    17 High-resolution character sheets mapping Iftikhar Thakur's dual transformations across every commercial film.
                  </p>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onNavigateChapter('art-talent', 'wardrobe');
                  }}
                  className="px-4 py-2 bg-[#c69a53] hover:bg-[#b08542] text-black text-xs font-extrabold rounded-xl transition-all flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs"
                >
                  <span>Open Full Chapter 07 Lookbook</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Character Sheets Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {wardrobeHighlights.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-xs hover:border-amber-400 transition-all flex flex-col"
                  >
                    <div className="relative aspect-[4/3] bg-zinc-950 overflow-hidden">
                      <img
                        src={item.img}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        style={{ objectPosition: 'center 20%' }}
                        loading="lazy"
                      />
                      <span className="absolute top-2 left-2 bg-black/80 backdrop-blur-xs text-[#c69a53] text-[9px] font-extrabold px-2 py-0.5 rounded uppercase">
                        {item.seq}
                      </span>
                    </div>
                    <div className="p-3.5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="text-[10px] font-bold text-[#b8860b] mb-0.5">{item.actor}</div>
                        <h4 className="font-extrabold text-zinc-900 text-xs mb-1.5">{item.title}</h4>
                        <p className="text-[11px] text-zinc-600 leading-relaxed mb-3">{item.desc}</p>
                      </div>
                      <button
                        onClick={() => {
                          onClose();
                          onNavigateChapter('art-talent', item.tabKey);
                        }}
                        className="w-full py-1.5 bg-zinc-100 hover:bg-amber-100 text-zinc-800 hover:text-amber-950 font-bold text-[11px] rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <span>View in Full Lookbook</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: VEHICLES & PROPS */}
          {activeTab === 'vehicles' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-zinc-200">
                <div>
                  <h3 className="font-extrabold text-zinc-900 text-base flex items-center gap-2">
                    <Truck className="w-5 h-5 text-[#b8860b]" /> Hero Vehicles & Production Props Grids
                  </h3>
                  <p className="text-xs text-zinc-500">
                    6 Production design packages including the Unified Battery Pehlwan Van and sequence-specific transport.
                  </p>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onNavigateChapter('art-talent', 'vehicle-props');
                  }}
                  className="px-4 py-2 bg-[#c69a53] hover:bg-[#b08542] text-black text-xs font-extrabold rounded-xl transition-all flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs"
                >
                  <span>Open Full Vehicles & Props</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Vehicles Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {vehicleHighlights.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-xs hover:border-amber-400 transition-all flex flex-col"
                  >
                    <div className="relative aspect-[4/3] bg-zinc-950 overflow-hidden">
                      <img
                        src={item.img}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        style={{ objectPosition: 'center center' }}
                        loading="lazy"
                      />
                      <span className="absolute top-2 left-2 bg-black/80 backdrop-blur-xs text-[#c69a53] text-[9px] font-extrabold px-2 py-0.5 rounded uppercase">
                        {item.type}
                      </span>
                    </div>
                    <div className="p-3.5 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-extrabold text-zinc-900 text-xs mb-1.5">{item.title}</h4>
                        <p className="text-[11px] text-zinc-600 leading-relaxed mb-3">{item.desc}</p>
                      </div>
                      <button
                        onClick={() => {
                          onClose();
                          onNavigateChapter('art-talent', item.tabKey);
                        }}
                        className="w-full py-1.5 bg-zinc-100 hover:bg-amber-100 text-zinc-800 hover:text-amber-950 font-bold text-[11px] rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <span>View Details</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: LOCATIONS & MAPS */}
          {activeTab === 'locations' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-zinc-200">
                <div>
                  <h3 className="font-extrabold text-zinc-900 text-base flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#b8860b]" /> Production Shooting Locations & Base Camps
                  </h3>
                  <p className="text-xs text-zinc-500">
                    6 Strategically scouted locations across Lahore, Karachi, and Evernew Soundstage with permits and logistical specs.
                  </p>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onNavigateChapter('art-talent', 'locations-map');
                  }}
                  className="px-4 py-2 bg-[#c69a53] hover:bg-[#b08542] text-black text-xs font-extrabold rounded-xl transition-all flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs"
                >
                  <span>Open Locations Matrix</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Locations Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {locationHighlights.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-xs hover:border-amber-400 transition-all flex flex-col"
                  >
                    <div className="relative aspect-[4/3] bg-zinc-950 overflow-hidden">
                      <img
                        src={item.img}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        style={{ objectPosition: 'center center' }}
                        loading="lazy"
                      />
                      <span className="absolute top-2 left-2 bg-black/80 backdrop-blur-xs text-[#c69a53] text-[9px] font-extrabold px-2 py-0.5 rounded uppercase">
                        {item.film}
                      </span>
                    </div>
                    <div className="p-3.5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="text-[10px] font-bold text-[#b8860b] mb-0.5 flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {item.city}
                        </div>
                        <h4 className="font-extrabold text-zinc-900 text-xs mb-1.5">{item.name}</h4>
                        <p className="text-[11px] text-zinc-600 leading-relaxed mb-3">{item.desc}</p>
                      </div>
                      <button
                        onClick={() => {
                          onClose();
                          onNavigateChapter('art-talent', item.tabKey);
                        }}
                        className="w-full py-1.5 bg-zinc-100 hover:bg-amber-100 text-zinc-800 hover:text-amber-950 font-bold text-[11px] rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <span>View Location Dossier</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: TALENT CONTRACT */}
          {activeTab === 'contract' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-zinc-200">
                <div>
                  <h3 className="font-extrabold text-zinc-900 text-base flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#b8860b]" /> Celebrity Talent Agreement (Iftikhar Thakur)
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Comprehensive legal terms for 2-year national brand ambassadorship (2026–2028).
                  </p>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onNavigateChapter('art-talent', 'talent-contract');
                  }}
                  className="px-4 py-2 bg-[#c69a53] hover:bg-[#b08542] text-black text-xs font-extrabold rounded-xl transition-all flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs"
                >
                  <span>Open Full Contract & Legal Clauses</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Key Contract Summary Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                <div className="p-4 bg-white rounded-2xl border border-zinc-200">
                  <div className="p-2 bg-amber-100 text-amber-900 rounded-xl w-fit mb-2">
                    <Calendar className="w-4 h-4 text-amber-700" />
                  </div>
                  <h4 className="font-extrabold text-zinc-900 text-xs mb-1">Term Duration</h4>
                  <p className="text-xs text-zinc-600">Two (2) Years from date of execution (2026–2028) with structured renewal terms.</p>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-zinc-200">
                  <div className="p-2 bg-amber-100 text-amber-900 rounded-xl w-fit mb-2">
                    <Film className="w-4 h-4 text-amber-700" />
                  </div>
                  <h4 className="font-extrabold text-zinc-900 text-xs mb-1">Shoot Days</h4>
                  <p className="text-xs text-zinc-600">Five (5) dedicated production shoot days covering all 5 TVC commercial films.</p>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-zinc-200">
                  <div className="p-2 bg-amber-100 text-amber-900 rounded-xl w-fit mb-2">
                    <ShieldCheck className="w-4 h-4 text-amber-700" />
                  </div>
                  <h4 className="font-extrabold text-zinc-900 text-xs mb-1">Category Exclusivity</h4>
                  <p className="text-xs text-zinc-600">Strict non-compete across all automotive, lead-acid, tubular, and solar battery brands in Pakistan.</p>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-zinc-200">
                  <div className="p-2 bg-amber-100 text-amber-900 rounded-xl w-fit mb-2">
                    <Zap className="w-4 h-4 text-amber-700" />
                  </div>
                  <h4 className="font-extrabold text-zinc-900 text-xs mb-1">AI & Digital Likeness</h4>
                  <p className="text-xs text-zinc-600">Explicit legal safeguards against unauthorized AI clone generation without express written consent.</p>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-zinc-200">
                  <div className="p-2 bg-amber-100 text-amber-900 rounded-xl w-fit mb-2">
                    <Award className="w-4 h-4 text-amber-700" />
                  </div>
                  <h4 className="font-extrabold text-zinc-900 text-xs mb-1">Commercial Media Scope</h4>
                  <p className="text-xs text-zinc-600">Worldwide rights across Television, Digital, Social, Out-of-Home Billboards, Print, and Trade activations.</p>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-zinc-200">
                  <div className="p-2 bg-amber-100 text-amber-900 rounded-xl w-fit mb-2">
                    <FileText className="w-4 h-4 text-amber-700" />
                  </div>
                  <h4 className="font-extrabold text-zinc-900 text-xs mb-1">Official Signatories</h4>
                  <p className="text-xs text-zinc-600">Executed between Alaska Batteries (Client), Nasharz Films (Production House), and Mr. Iftikhar Ahmad Sheikh (Talent).</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: TVC SCRIPTS & JINGLES */}
          {activeTab === 'scripts' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-zinc-200">
                <div>
                  <h3 className="font-extrabold text-zinc-900 text-base flex items-center gap-2">
                    <Film className="w-5 h-5 text-[#b8860b]" /> Master "Battery Phelwan" TVC Suite (Chapter 05)
                  </h3>
                  <p className="text-xs text-zinc-500">
                    5 Commercial films starring Iftikhar Thakur with full Urdu dialogue scripts and 3 Punjabi Jingle options.
                  </p>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onNavigateChapter('concepts', 'final-concepts');
                  }}
                  className="px-4 py-2 bg-zinc-900 hover:bg-black text-white text-xs font-extrabold rounded-xl transition-all flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs"
                >
                  <span className="text-[#c69a53]">Open Master Scripts</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#c69a53]" />
                </button>
              </div>

              {/* Scripts List */}
              <div className="space-y-3">
                <div className="p-4 bg-white rounded-2xl border border-zinc-200 flex items-start gap-3.5">
                  <span className="p-2 bg-amber-100 text-amber-900 rounded-xl font-black text-xs shrink-0">01</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-zinc-900 text-sm">Car Battery — "Pehelwan Reveal"</h4>
                      <span className="text-[10px] font-bold bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded">Luxury Sedan</span>
                    </div>
                    <p className="text-xs text-zinc-600 mt-1">
                      Traffic policeman Thakur assists an executive stranded with a dead battery on a cold morning, before the Battery Pehlwan emergency response unit arrives to swap the battery.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-zinc-200 flex items-start gap-3.5">
                  <span className="p-2 bg-amber-100 text-amber-900 rounded-xl font-black text-xs shrink-0">02</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-zinc-900 text-sm">Truck Battery — "Fish Cargo"</h4>
                      <span className="text-[10px] font-bold bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded">Heavy Logistics</span>
                    </div>
                    <p className="text-xs text-zinc-600 mt-1">
                      Karachi fishing port captain faces spoiled seafood crisis when cargo truck fails to start; Battery Pehlwan performs an urgent high-stakes battery surgery.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-zinc-200 flex items-start gap-3.5">
                  <span className="p-2 bg-amber-100 text-amber-900 rounded-xl font-black text-xs shrink-0">03</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-zinc-900 text-sm">Tractor Battery — "Baraat Field"</h4>
                      <span className="text-[10px] font-bold bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded">Agri Power</span>
                    </div>
                    <p className="text-xs text-zinc-600 mt-1">
                      Chaudhary Thakur's baraat procession is blocked by an unstarted harvest tractor in the fields; resolved with heavy graphite power.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-zinc-200 flex items-start gap-3.5">
                  <span className="p-2 bg-amber-100 text-amber-900 rounded-xl font-black text-xs shrink-0">04</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-zinc-900 text-sm">Bike Battery — "Job Interview"</h4>
                      <span className="text-[10px] font-bold bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded">Two-Wheeler</span>
                    </div>
                    <p className="text-xs text-zinc-600 mt-1">
                      Nervous job candidate rides a taxi bike that breaks down on the promenade; rescued by Pehlwan's instant start technology.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-zinc-200 flex items-start gap-3.5">
                  <span className="p-2 bg-amber-100 text-amber-900 rounded-xl font-black text-xs shrink-0">05</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-zinc-900 text-sm">UPS Battery — "Wedding Morning"</h4>
                      <span className="text-[10px] font-bold bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded">Home Backup</span>
                    </div>
                    <p className="text-xs text-zinc-600 mt-1">
                      Power failure disrupts wedding grooming inside historic Haveli; restored seamlessly by Alaska deep cycle inverter power.
                    </p>
                  </div>
                </div>

                {/* Jingles Banner */}
                <div className="p-4 bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-amber-500/15 border border-amber-500/30 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Music className="w-5 h-5 text-amber-800" />
                    <div>
                      <h5 className="font-extrabold text-amber-950 text-xs">3 Punjabi Jingle Audio Routes</h5>
                      <p className="text-[11px] text-amber-900">Option A ("Pehlwan Alaska"), Option B ("Damdaar Current"), Option C ("Har Lamha Aitemaad").</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: STORYBOARDS */}
          {activeTab === 'storyboards' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-zinc-200">
                <div>
                  <h3 className="font-extrabold text-zinc-900 text-base flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-[#b8860b]" /> Visual Commercial Storyboards (Chapter 06)
                  </h3>
                  <p className="text-xs text-zinc-500">
                    25 High-Definition visual storyboard sheets mapping camera progression, pacing, and vector PDFs.
                  </p>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onNavigateChapter('storyboards');
                  }}
                  className="px-4 py-2 bg-zinc-900 hover:bg-black text-white text-xs font-extrabold rounded-xl transition-all flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs"
                >
                  <span className="text-[#c69a53]">Open Full Storyboard Gallery</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#c69a53]" />
                </button>
              </div>

              {/* Storyboard Collections */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: 'Main TVC Master Board', count: '5 Sheets', img: 'https://lh3.googleusercontent.com/d/1V34IZzvcW8e1Hi1P891n4N0DXmqh8698' },
                  { name: 'Car Battery Film', count: '5 Sheets', img: 'https://lh3.googleusercontent.com/d/1Hv7Vu1IgLujmqJCuXoROTZQI8T81H6Fe' },
                  { name: 'Truck Logistics Film', count: '5 Sheets', img: 'https://lh3.googleusercontent.com/d/1vg9_oO5mgFVtfYBnhurA49x3UXss0PW4' },
                  { name: 'Agri Tractor Film', count: '5 Sheets', img: 'https://lh3.googleusercontent.com/d/1NTtmKqHWwF6ZCNw_9LuLxjRLFVkDt0uJ' },
                  { name: 'UPS Wedding Film', count: '5 Sheets', img: 'https://lh3.googleusercontent.com/d/1Q3j1LeNDLNw4X7OplZON3tXbmag2eTSG' },
                  { name: 'Master Storyboard (MSB)', count: '6 Sheets', img: 'https://lh3.googleusercontent.com/d/1lxlow_AiObvWLeMoGlrRizLxwfYO9Duk' }
                ].map((board, idx) => (
                  <div key={idx} className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-xs">
                    <div className="aspect-[16/9] bg-zinc-900 overflow-hidden">
                      <img src={board.img} alt={board.name} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                    <div className="p-3 flex items-center justify-between">
                      <div>
                        <h4 className="font-extrabold text-zinc-900 text-xs">{board.name}</h4>
                        <span className="text-[10px] text-zinc-500">{board.count}</span>
                      </div>
                      <button
                        onClick={() => {
                          onClose();
                          onNavigateChapter('storyboards');
                        }}
                        className="px-2.5 py-1 bg-zinc-100 hover:bg-amber-100 text-zinc-800 text-[11px] font-bold rounded-lg transition-colors cursor-pointer"
                      >
                        View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-zinc-200/90 border-t border-zinc-300 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-zinc-600 font-medium">
            <Calendar className="w-3.5 h-3.5 text-zinc-500" />
            <span>Master Release Sync • Production Lookbook & Contracts Included</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-1.5 bg-zinc-900 hover:bg-black text-white text-xs font-extrabold rounded-xl transition-all cursor-pointer shadow-xs"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
