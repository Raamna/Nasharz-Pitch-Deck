import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Chapter, BrandingConfig, EstimateItem } from '../types';

/**
 * Preload all images inside an element so html2canvas renders them reliably
 */
async function preloadImages(element: HTMLElement): Promise<void> {
  const images = Array.from(element.querySelectorAll('img'));
  await Promise.all(
    images.map(
      img =>
        new Promise<void>((resolve) => {
          if (img.complete && img.naturalHeight !== 0) {
            resolve();
            return;
          }
          img.onload = () => resolve();
          img.onerror = () => resolve(); // Resolve on error too to prevent blocking
        })
    )
  );
}

/**
 * Convert Urdu script text to Roman Urdu (transliteration, not English translation)
 * solely for PDF generation so that canvas/html2canvas avoids broken/disconnected Urdu Arabic ligatures.
 */
export function urduToRomanUrdu(text: string): string {
  if (!text) return text;

  let converted = text;

  // 1. Phrase / Line level mapping (exact contextual matches in scripts, taglines, and narratives)
  const PHRASE_MAP: [RegExp, string][] = [
    // Headings & Brand
    [/Corporate Social Message\s*[—–-]\s*[“"']?ہر قدم[”"']?/gi, 'Corporate Social Message — "Har Qadam"'],
    [/“ہر قدم”/g, '"Har Qadam"'],
    [/”ہر قدم“/g, '"Har Qadam"'],
    [/ہر قدم/g, 'Har Qadam'],
    [/سُپر ہر قدم/g, 'Super Har Qadam'],
    [/سپر ہر قدم/g, 'Super Har Qadam'],
    [/ہر لمحہ اعتماد/g, 'Har Lamha Aitemaad'],
    [/اعتماد کا نیا نام/g, 'Aitemaad Ka Naya Naam'],
    [/الاسکا بیٹریز/g, 'Alaska Batteries'],
    [/الاسکا/g, 'Alaska'],
    [/اعتماد/g, 'Aitemaad'],

    // Onomatopoeia & Sounds
    [/کڑاک!\s*چٹاک!\s*پٹاک!/g, 'Kadaak! Chataak! Pataak!'],
    [/کڑاک!/g, 'Kadaak!'],
    [/چٹاک!/g, 'Chataak!'],
    [/پٹاک!/g, 'Pataak!'],
    [/کڑاک/g, 'Kadaak'],
    [/چٹاک/g, 'Chataak'],
    [/پٹاک/g, 'Pataak'],

    // Character names & Speakers
    [/موٹا شخص:/g, 'Mota Shakhs:'],
    [/افتخار ٹھاکر:/g, 'Iftikhar Thakur:'],

    // Dialogue Lines in Script
    [/“استاد جی، گاڑی کب تک تیار ہوگی؟/g, '“Ustaad ji, gaari kab tak tayyar hogi?'],
    [/استاد جی، گاڑی کب تک تیار ہوگی؟/g, 'Ustaad ji, gaari kab tak tayyar hogi?'],
    [/پیدل یہاں تک آیا ہوں، میری تو حالت خراب ہوگئی!”/g, 'Paidal yahan tak aaya hoon, meri to haalat kharaab hogayi!”'],
    [/پیدل یہاں تک آیا ہوں، میری تو حالت خراب ہوگئی!/g, 'Paidal yahan tak aaya hoon, meri to haalat kharaab hogayi!'],
    [/“مسئلہ سارا بیٹری کا ہے\.\.\.”/g, '“Masla saara battery ka hai...”'],
    [/مسئلہ سارا بیٹری کا ہے\.\.\./g, 'Masla saara battery ka hai...'],
    [/“اس بیٹری کا!”/g, '“Iss battery ka!”'],
    [/اس بیٹری کا!/g, 'Iss battery ka!'],
    [/“ہیں استاد جی؟”/g, '“Hain ustaad ji?”'],
    [/ہیں استاد جی؟/g, 'Hain ustaad ji?'],
    [/“وہ دیکھو!”/g, '“Woh dekho!”'],
    [/وہ دیکھو!/g, 'Woh dekho!'],

    // Jingle Lyrics
    [/یہ چٹخ پٹک، یہ دھوم دھڑک/g, 'Yeh chatakh patak, yeh dhoom dharak'],
    [/لچک مچک کو دور جھٹک/g, 'Lachak machak ko door jhatak'],
    [/مشین کو چھوڑ، تھوڑا بھاگ دوڑ/g, 'Machine ko chhor, thora bhaag dor'],
    [/اٹھ گھوم نکل/g, 'Uth ghoom nikal'],
    [/ذرا دور نکل/g, 'Zara door nikal'],
    [/قصبے کوچے، ڈگر ڈگر/g, 'Qasbay koochay, dagar dagar'],
    [/مان لے، یہ ٹھان لے/g, 'Maan lay, yeh thaan lay'],
    [/اڑان تیری اوپر اوپر/g, 'Uraan teri oopar oopar'],
    [/سن ہوا کے گن/g, 'Sun hawa kay gun'],
    [/سورج کی دھن/g, 'Sooraj ki dhun'],
    [/کھل کھل کر اڑ/g, 'Khul khul kar urr'],
    [/آسماں سے جڑ/g, 'Aasmaan say jorr'],

    // Closing Dialogue & VO
    [/“اپنی لائف میں جادو جگانا ہے،/g, '“Apni life mein jaadoo jagaana hai,'],
    [/اپنی لائف میں جادو جگانا ہے،/g, 'Apni life mein jaadoo jagaana hai,'],
    [/تو اپنی بیٹری کو رکھو ہمیشہ چارج!”/g, 'to apni battery ko rakho hamesha charge!”'],
    [/تو اپنی بیٹری کو رکھو ہمیشہ چارج!/g, 'to apni battery ko rakho hamesha charge!'],
    [/جیسے الاسکا کی گریفائٹ ٹیکنالوجی\.\.\.”/g, '“Jaisay Alaska ki Graphite Technology...”'],
    [/جیسے الاسکا کی گریفائٹ ٹیکنالوجی\.\.\./g, 'Jaisay Alaska ki Graphite Technology...'],
    [/“\s*کرتی ہے حفاظت/g, '“...karti hai hifaazat'],
    [/کرتی ہے حفاظت/g, 'karti hai hifaazat'],
    [/“اور ۹ ماہ کی مفت تبدیلی کی وارنٹی دیتی ہے اعتماد۔”/g, '“Aur 9 maah ki muft tabdeeli ki warranty deti hai aitemaad.”'],
    [/اور ۹ ماہ کی مفت تبدیلی کی وارنٹی دیتی ہے اعتماد۔/g, 'Aur 9 maah ki muft tabdeeli ki warranty deti hai aitemaad.'],
    [/“کیوں کہ دھڑکن میں ہوگا دم،/g, '“Kyun keh dharakn mein hoga dam,'],
    [/کیوں کہ دھڑکن میں ہوگا دم،/g, 'Kyun keh dharakn mein hoga dam,'],
    [/تو ہر لمحہ اعتماد۔”/g, 'to har lamha aitemaad.”'],
    [/تو ہر لمحہ اعتماد۔/g, 'to har lamha aitemaad.'],

    // Route 3A Juggalbandi / Rap Jingle Lyrics
    [/شہری لائف جینا/g, 'Shehri life jeena'],
    [/اینا کوئی آسان نہیں/g, 'Aena koi aasaan nahin'],
    [/وہ رل جاندے/g, 'Woh rul jaanday'],
    [/جنہیں سچ کی پہچان نہیں/g, 'Jinhain sach ki pehchaan nahin'],
    [/دفتر کو لیٹ/g, 'Daftar ko late'],
    [/ساری پلاننگ ملیا میٹ/g, 'Saari planning maliya mete'],
    [/گھٹیا کوالٹی کے بھی/g, 'Ghatiya quality kay bhi'],
    [/مہنگے ہیں ریٹ/g, 'Mehangay hain rate'],
    [/لائف نہیں رکتی یہاں۔۔۔ چلتی ہی جاتی ہے/g, 'Life nahin rukti yahan... chalti hi jaati hai'],
    [/اینی فاسٹ لائف میں۔۔۔ الاسکا ہی کام آتی ہے/g, 'Aeni fast life mein... Alaska hi kaam aati hai'],
    [/الاسکا پہ اعتماد/g, 'Alaska pe aitmaad'],
    [/سڑکوں پہ اڑی جانا/g, 'Sadkon pe udi jaana'],
    [/الاسکا کا ہوجونال/g, 'Alaska ka hojo naal'],
    [/کدی نہیں گھبرانا/g, 'Kadi nahin ghabraana'],
    [/اپنا ذاتی گھر ہو/g, 'Apna zaati ghar ho'],
    [/کرائے کا مکان ہو/g, 'Kiraaye ka makaan ho'],
    [/چار منزل فلیٹوں میں/g, 'Chaar manzil flaton mein'],
    [/رہنے کا سامان ہو/g, 'Rehnay ka saamaan ho'],
    [/علاقے کا بازار ہو/g, 'Ilaaqay ka bazaar ho'],
    [/یا چوک کی دکان ہو/g, 'Ya chowk ki dukaan ho'],
    [/لائٹ چلی جانے پر/g, 'Light chali jaanay par'],
    [/لائف رک جاتی ہو/g, 'Life ruk jaati ho'],
    [/اندھیرا ستائے/g, 'Andhera sataaye'],
    [/ہوا بھی نہیں آتی ہو/g, 'Hawa bhi nahin aati ho'],
    [/ایسے میں الاسکا ہی/g, 'Aisay mein Alaska hi'],
    [/خوشیاں پھیلاتی ہے/g, 'Khushiyan phailaati hai'],
    [/سارے بلب پنکھے/g, 'Saaray bulb pankhay'],
    [/ٹی وی چلاتی ہے/g, 'TV chalaati hai']
  ];

  for (const [pattern, replacement] of PHRASE_MAP) {
    converted = converted.replace(pattern, replacement);
  }

  // 2. Common standalone Urdu terms
  const WORD_MAP: [RegExp, string][] = [
    [/\bبیٹری\b/g, 'Battery'],
    [/\bوارنٹی\b/g, 'Warranty'],
    [/\bٹیکنالوجی\b/g, 'Technology'],
    [/\bگریفائٹ\b/g, 'Graphite'],
    [/\bگاڑی\b/g, 'Gaari'],
    [/\bاستاد\b/g, 'Ustaad'],
    [/\bٹھاکر\b/g, 'Thakur'],
    [/\bافتخار\b/g, 'Iftikhar']
  ];

  for (const [pattern, replacement] of WORD_MAP) {
    converted = converted.replace(pattern, replacement);
  }

  // 3. Fallback character-level transliteration for any lingering Arabic/Urdu unicode characters
  const URDU_CHAR_MAP: Record<string, string> = {
    'ا': 'a', 'آ': 'aa', 'ب': 'b', 'پ': 'p', 'ت': 't', 'ٹ': 't', 'ث': 's',
    'ج': 'j', 'چ': 'ch', 'ح': 'h', 'خ': 'kh', 'د': 'd', 'ڈ': 'd', 'ذ': 'z',
    'ر': 'r', 'ڑ': 'r', 'ز': 'z', 'ژ': 'zh', 'س': 's', 'ش': 'sh', 'ص': 's',
    'ض': 'z', 'ط': 't', 'ظ': 'z', 'ع': 'a', 'غ': 'gh', 'ف': 'f', 'ق': 'q',
    'ک': 'k', 'گ': 'g', 'ل': 'l', 'م': 'm', 'ن': 'n', 'ں': 'n', 'و': 'o',
    'ہ': 'h', 'ۂ': 'h', 'ۃ': 't', 'ھ': 'h', 'ء': '', 'ی': 'i', 'ے': 'ay',
    'ئ': 'y', '۰': '0', '۱': '1', '۲': '2', '۳': '3', '۴': '4', '۵': '5',
    '۶': '6', '۷': '7', '۸': '8', '۹': '9', '،': ',', '؛': ';', '؟': '?'
  };

  converted = converted.replace(/[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/g, (char) => {
    return URDU_CHAR_MAP[char] !== undefined ? URDU_CHAR_MAP[char] : '';
  });

  return converted;
}

/**
 * Parses raw text into discrete semantic HTML block elements preserving exact line structure
 */
function parseTextToBlocks(rawText: string): HTMLElement[] {
  const blocks: HTMLElement[] = [];
  const convertedText = urduToRomanUrdu(rawText);
  const lines = convertedText.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    if (!trimmed) {
      if (blocks.length > 0) {
        const lastBlock = blocks[blocks.length - 1];
        const isLastSpacer = lastBlock.dataset.isSpacer === 'true';
        const isLastHeading =
          lastBlock.dataset.isRouteHeader === 'true' ||
          lastBlock.dataset.isConceptHeading === 'true' ||
          lastBlock.dataset.pageBreakAfter === 'true';
        if (!isLastSpacer && !isLastHeading) {
          const spacer = document.createElement('div');
          spacer.style.height = '4px';
          spacer.dataset.isSpacer = 'true';
          blocks.push(spacer);
        }
      }
      continue;
    }

    // Separator line (e.g. "___________________" or "===================" or "...................")
    if (/^([_=.-])\1{4,}$/.test(trimmed)) {
      const sep = document.createElement('div');
      sep.style.margin = '10px 0 6px 0';
      sep.style.height = '3px';
      sep.style.backgroundColor = '#1c2024';
      sep.style.borderRadius = '2px';
      sep.style.opacity = '0.95';
      sep.dataset.pageBreakAfter = 'true';
      blocks.push(sep);
      continue;
    }

    // Route Header banner: e.g. "ALASKA BATTERIES — TVC ROUTE 1", "ALASKA BATTERIES — TVC ROUTE 2", "ALASKA BATTERIES — TVC ROUTE 3", "ALASKA BATTERIES — TVC ROUTE 3A", "CAMPAIGN FILM CONCEPTS"
    const isRouteHeader = /^(ALASKA BATTERIES\s*[—–-]\s*TVC ROUTE|TVC ROUTE\s+[0-9]+[A-Z]?|CAMPAIGN FILM CONCEPTS)/i.test(trimmed);
    if (isRouteHeader) {
      const rh = document.createElement('div');
      rh.style.background = '#f1f5f9';
      rh.style.borderLeft = '4.5px solid #b8860b';
      rh.style.padding = '8px 14px';
      rh.style.borderRadius = '0 6px 6px 0';
      rh.style.fontWeight = '800';
      rh.style.fontSize = '14px';
      rh.style.lineHeight = '1.3';
      rh.style.letterSpacing = '0.04em';
      rh.style.textTransform = 'uppercase';
      rh.style.color = '#0f172a';
      rh.style.marginTop = '12px';
      rh.style.marginBottom = '4px';
      rh.textContent = trimmed;
      rh.dataset.isRouteHeader = 'true';
      blocks.push(rh);
      continue;
    }

    // Concept Title: e.g. "CONCEPT 1:", "Concept 1A", "CONCEPT 2", "CONCEPT 3", "CONCEPT 3A", "CONCEPT 1: \"BATTERY EXPERT\"", "CONCEPT 2: \"AITEMAAD KA NAYA NAAM\""
    const isConceptHeading = /^(CONCEPT\s+([0-9]+[A-Z]?)|Concept\s+([0-9]+[A-Z]?))/i.test(trimmed);
    if (isConceptHeading) {
      const ch = document.createElement('div');
      ch.style.background = '#1c2024';
      ch.style.borderLeft = '5px solid #b8860b';
      ch.style.padding = '8px 14px';
      ch.style.borderRadius = '0 6px 6px 0';
      ch.style.fontWeight = '900';
      ch.style.fontSize = '14px';
      ch.style.lineHeight = '1.25';
      ch.style.letterSpacing = '0.04em';
      ch.style.textTransform = 'uppercase';
      ch.style.color = '#fef08a';
      ch.style.marginTop = '6px';
      ch.style.marginBottom = '8px';
      ch.textContent = trimmed;
      ch.dataset.isConceptHeading = 'true';
      blocks.push(ch);
      continue;
    }

    // Down arrow / Flow marker
    if (trimmed === '↓' || trimmed === '↓ ' || trimmed === '→') {
      const arrow = document.createElement('div');
      arrow.style.textAlign = 'center';
      arrow.style.color = '#c69a53';
      arrow.style.fontSize = '16px';
      arrow.style.fontWeight = 'bold';
      arrow.style.margin = '6px 0';
      arrow.textContent = trimmed;
      blocks.push(arrow);
      continue;
    }

    // Main section heading: e.g. "1. COMPETITOR ANALYSIS..." or "CONFIDENTIAL - CREATIVE BRIEF"
    const isMainHeading =
      (/^[0-9]+\.\s+[A-Z\s&/—–:-]{3,}/.test(trimmed) ||
      /^(CONFIDENTIAL|CAMPAIGN|STORYBOARD|ART DIRECTION|PRODUCTION|ESTIMATE|KEY DELIVERABLES|PAKISTANI BATTERY|BRAND FOUNDATION|TAGLINE \/ SLOGAN|STRATEGIC CONCLUSION|CONCEPT\s+[0-9]|ROUTE\s+[0-9]|ALASKA BATTERIES|MODELING,\s+TALENT|SIGNATURES)/i.test(trimmed)) &&
      trimmed.length < 90;

    if (isMainHeading) {
      const h = document.createElement('div');
      h.style.background = '#f1f5f9';
      h.style.borderLeft = '4.5px solid #c69a53';
      h.style.padding = '10px 16px';
      h.style.borderRadius = '0 6px 6px 0';
      h.style.fontWeight = '800';
      h.style.fontSize = '14.5px';
      h.style.lineHeight = '1.35';
      h.style.letterSpacing = '0.02em';
      h.style.textTransform = 'uppercase';
      h.style.color = '#0f172a';
      h.style.marginTop = '16px';
      h.style.marginBottom = '9px';
      h.textContent = trimmed;
      blocks.push(h);
      continue;
    }

    // Scene Headings & Jingle Sections (e.g. "OPEN — WORKSHOP", "CORE IDEA", "THE SECOND BATTERY", "JINGLE", "COMPLETE JINGLE", "THE FILM", "PART 01", "PRODUCT SCOPE")
    const isSceneOrJingleHeading = /^(OPEN|THE GURU|THE EXPERT TEST|THE PHELWAN TEST|THE PHELWAN ARRIVAL|\(THE ARRIVAL\)|THE ARRIVAL|THE PROBLEM|THE TWIST|\(Twist\)|RESOLUTION|ALASKA REVEAL|\(ALASKA REVEAL\)|THE SECOND BATTERY|JINGLE|COMPLETE JINGLE|COMPLETE MASTER JINGLE|Jingle & Dialogue Options|& Dialogue Options|Dialogue Options|Ending Dialogues|Option\s+[A-C]|Option-[A-C]|THE ENERGY BUILDS|RETURN TO THE WORKSHOP|PRODUCT REVEAL|END FRAME|END SLIDE|End Logo|End Tail|CORE IDEA|CUT TO|THE FILM|PART 01|PART 02|PRODUCT SCOPE|CURRENT PRESENTATION|FUTURE EXPANSION|LIGHTS OUT|JUGGALBANDI & RAP)\b/i.test(trimmed);
    if (isSceneOrJingleHeading) {
      const sh = document.createElement('div');
      sh.style.fontWeight = '800';
      sh.style.fontSize = '14px';
      sh.style.lineHeight = '1.35';
      sh.style.color = '#92400e';
      sh.style.letterSpacing = '0.03em';
      sh.style.textTransform = 'uppercase';
      sh.style.marginTop = '14px';
      sh.style.marginBottom = '6px';
      sh.style.display = 'flex';
      sh.style.alignItems = 'center';
      sh.style.gap = '8px';

      const dot = document.createElement('span');
      dot.style.display = 'inline-block';
      dot.style.width = '7px';
      dot.style.height = '7px';
      dot.style.borderRadius = '50%';
      dot.style.backgroundColor = '#b8860b';
      dot.style.flexShrink = '0';

      const textSpan = document.createElement('span');
      textSpan.textContent = trimmed;

      sh.appendChild(dot);
      sh.appendChild(textSpan);
      blocks.push(sh);
      continue;
    }

    // Character dialogue speakers with inline dialogue (e.g. "POLICE THAKUR: \"Battery?\"", "Thakur: \"Jab battery ka ho kabaara...\"")
    const speakerWithDialogueMatch = trimmed.match(/^([A-Za-z0-9.\s&—/()–-]+):\s*(.+)$/);
    if (speakerWithDialogueMatch && speakerWithDialogueMatch[1].length <= 35 && !speakerWithDialogueMatch[1].toLowerCase().includes('http') && !trimmed.startsWith('•')) {
      const spk = speakerWithDialogueMatch[1].trim();
      const dlg = speakerWithDialogueMatch[2].trim();
      const row = document.createElement('div');
      row.style.fontSize = '13px';
      row.style.lineHeight = '1.55';
      row.style.marginBottom = '5px';
      row.style.paddingLeft = '10px';
      row.style.borderLeft = '2.5px solid #d97706';
      row.innerHTML = `<strong style="color: #92400e; font-weight: 800; text-transform: uppercase; font-size: 11.5px; letter-spacing: 0.04em;">${spk}:</strong> <span style="color: #0f172a; font-weight: 600;">${dlg}</span>`;
      blocks.push(row);
      continue;
    }

    // Standalone dialogue speaker line (e.g. "POLICE THAKUR:", "Thakur:", "DRIVER:")
    const isSpeakerStandalone = /^([A-Za-z0-9.\s&—/()–-]+):\s*$/i.test(trimmed) && trimmed.length <= 40;
    if (isSpeakerStandalone) {
      const spk = document.createElement('div');
      spk.style.fontWeight = '800';
      spk.style.fontSize = '12.5px';
      spk.style.lineHeight = '1.3';
      spk.style.color = '#92400e';
      spk.style.marginTop = '10px';
      spk.style.marginBottom = '3px';
      spk.style.textTransform = 'uppercase';
      spk.style.letterSpacing = '0.04em';
      spk.textContent = trimmed;
      blocks.push(spk);
      continue;
    }

    // Subheadings: e.g. "Perception Ranking (Top Market Perceptions):" or "☀️ Hot / Summer (Apr – Jun):"
    const isSubhead =
      /^[A-Z0-9\s☀️🌧️❄️🌾•&/()–-]+:$/.test(trimmed) ||
      /^(•\s+Q[1-4]|☀️|🌧️|❄️|🌾|Perception Ranking|Heritage|Estimated Market Share|Desired Future State|Target Audience|Tone of Voice|Key USPs|Concept [0-9]|Frame sequence breakdown|The current territories)/i.test(
        trimmed
      ) ||
      /^(TRUTH|VISION|PURPOSE|BELIEF|BRAND POSITIONING|PERSONALITY|VOICE|TAGLINE)\s*\(/i.test(trimmed);

    if (isSubhead) {
      const sub = document.createElement('div');
      sub.style.fontWeight = '700';
      sub.style.fontSize = '13.5px';
      sub.style.lineHeight = '1.4';
      sub.style.color = '#0f172a';
      sub.style.marginTop = '11px';
      sub.style.marginBottom = '6px';
      sub.style.display = 'flex';
      sub.style.alignItems = 'center';
      sub.style.gap = '7px';

      const bullet = document.createElement('span');
      bullet.style.display = 'inline-block';
      bullet.style.width = '6px';
      bullet.style.height = '6px';
      bullet.style.borderRadius = '50%';
      bullet.style.backgroundColor = '#c69a53';
      bullet.style.flexShrink = '0';

      const label = document.createElement('span');
      label.textContent = trimmed;

      sub.appendChild(bullet);
      sub.appendChild(label);
      blocks.push(sub);
      continue;
    }

    // Numbered list item: e.g. "1. Osaka (Perceived #1 Market Leader)"
    const isNumbered = /^[0-9]+[\.\)]\s+/.test(trimmed);
    if (isNumbered) {
      const numMatch = trimmed.match(/^([0-9]+[\.\)])\s*(.*)$/);
      const numPrefix = numMatch ? numMatch[1] : '•';
      const itemText = numMatch ? numMatch[2] : trimmed;

      const numItem = document.createElement('div');
      numItem.style.fontSize = '13px';
      numItem.style.lineHeight = '1.6';
      numItem.style.color = '#334155';
      numItem.style.paddingLeft = '26px';
      numItem.style.marginBottom = '4.5px';
      numItem.style.position = 'relative';

      numItem.innerHTML = `<span style="position: absolute; left: 0; font-weight: 700; color: #b8860b; width: 20px;">${numPrefix}</span> <span>${itemText}</span>`;
      blocks.push(numItem);
      continue;
    }

    // Bullet / List items
    const isBullet = /^[•\-\*]\s+/.test(trimmed);
    if (isBullet) {
      const cleanText = trimmed.replace(/^[•\-\*]\s+/, '');
      const li = document.createElement('div');
      li.style.fontSize = '13px';
      li.style.lineHeight = '1.6';
      li.style.color = '#334155';
      li.style.paddingLeft = '18px';
      li.style.marginBottom = '4.5px';
      li.style.position = 'relative';

      li.innerHTML = `<span style="position: absolute; left: 2px; color: #c69a53; font-weight: bold;">•</span> <span>${cleanText}</span>`;
      blocks.push(li);
      continue;
    }

    // Key-Value insight statements (e.g. "Truth: I can’t afford to stop.", "Positioning: Alaska is...")
    const isKeyValue = /^(Truth|Vision|Purpose|Belief|Positioning|Brand Positioning|Brand Promise|Tagline|Personality|Voice|Key USP|Trigger|Alaska Product|Demand Drivers|Required Battery Types|Core Human Need|Battery Opportunity):\s*(.+)$/i.test(trimmed);
    if (isKeyValue) {
      const match = trimmed.match(/^([^:]+):\s*(.+)$/);
      if (match) {
        const kv = document.createElement('div');
        kv.style.fontSize = '13px';
        kv.style.lineHeight = '1.6';
        kv.style.marginBottom = '5px';
        kv.innerHTML = `<span style="font-weight: 700; color: #0f172a;">${match[1]}:</span> <span style="color: #334155;">${match[2]}</span>`;
        blocks.push(kv);
        continue;
      }
    }

    // Em-dash territory / concept lines (e.g. "Badhte Raho — progress / growth")
    const isEmDashItem = /^([A-Za-z0-9\s\(\)\'\’]+)\s+[—–]\s+(.*)$/.test(trimmed);
    if (isEmDashItem) {
      const emMatch = trimmed.match(/^([A-Za-z0-9\s\(\)\'\’]+)\s+[—–]\s+(.*)$/);
      if (emMatch) {
        const item = document.createElement('div');
        item.style.fontSize = '13px';
        item.style.lineHeight = '1.6';
        item.style.color = '#334155';
        item.style.paddingLeft = '16px';
        item.style.marginBottom = '5px';
        item.style.position = 'relative';
        item.innerHTML = `<span style="position: absolute; left: 0; color: #c69a53; font-weight: bold;">▪</span> <strong style="color: #0f172a; font-weight: 700;">${emMatch[1]}</strong> <span style="color: #64748b;">—</span> <span>${emMatch[2]}</span>`;
        blocks.push(item);
        continue;
      }
    }

    // Dialogue quotes in script: e.g. "“Masla sara battery ka hai...”"
    const isDialogueQuote = /^([“"'].+[”"']|Karraak!|Chatak!|Patak!|Beat\.)/i.test(trimmed);
    if (isDialogueQuote) {
      const dq = document.createElement('div');
      dq.style.fontSize = '13.5px';
      dq.style.lineHeight = '1.6';
      dq.style.color = trimmed.startsWith('“') || trimmed.startsWith('"') ? '#0f172a' : '#475569';
      dq.style.fontWeight = trimmed.startsWith('“') || trimmed.startsWith('"') ? '600' : '500';
      dq.style.fontStyle = trimmed.startsWith('“') || trimmed.startsWith('"') ? 'normal' : 'italic';
      dq.style.marginBottom = '4.5px';
      dq.textContent = trimmed;
      blocks.push(dq);
      continue;
    }

    // Regular line / statement (Preserves each written line on its own row)
    const p = document.createElement('div');
    p.style.fontSize = '13px';
    p.style.lineHeight = '1.6';
    p.style.color = '#334155';
    p.style.marginBottom = '4.5px';
    p.textContent = trimmed;
    blocks.push(p);
  }

  return blocks;
}

export async function generateChapterPDF(
  chapter: Chapter,
  branding: BrandingConfig,
  clientName: string = 'Alaska Batteries Client'
) {
  // Master offscreen container
  const sandbox = document.createElement('div');
  sandbox.style.position = 'fixed';
  sandbox.style.left = '-9999px';
  sandbox.style.top = '0';
  sandbox.style.width = '794px';
  sandbox.style.zIndex = '-9999';
  sandbox.style.fontFamily = "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  sandbox.style.color = '#0f172a';
  document.body.appendChild(sandbox);

  // Hidden measuring stage with exact content width (794 - 44*2 = 706px)
  const measureStage = document.createElement('div');
  measureStage.style.width = '706px';
  measureStage.style.visibility = 'hidden';
  measureStage.style.position = 'absolute';
  measureStage.style.left = '0';
  measureStage.style.top = '0';
  sandbox.appendChild(measureStage);

  const measureElementHeight = (el: HTMLElement): number => {
    measureStage.appendChild(el);
    const height = el.getBoundingClientRect().height;
    measureStage.removeChild(el);
    return Math.ceil(height) + 4; // Add slight safety margin
  };

  const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const romanTitle = urduToRomanUrdu(chapter.title);
  const romanSummary = urduToRomanUrdu(chapter.summary);
  const romanKeyPoints = (chapter.keyPoints || []).map(kp => urduToRomanUrdu(kp));

  interface PageStructure {
    pageEl: HTMLDivElement;
    contentArea: HTMLDivElement;
    footerArea: HTMLDivElement;
  }
  const pages: PageStructure[] = [];

  const createNewPage = (pageIdx: number): PageStructure => {
    const pageEl = document.createElement('div');
    pageEl.style.width = '794px';
    pageEl.style.height = '1123px';
    pageEl.style.boxSizing = 'border-box';
    pageEl.style.padding = pageIdx === 0 ? '36px 44px 24px 44px' : '30px 44px 24px 44px';
    pageEl.style.backgroundColor = '#ffffff';
    pageEl.style.display = 'flex';
    pageEl.style.flexDirection = 'column';
    pageEl.style.justifyContent = 'space-between';
    pageEl.style.position = 'relative';
    pageEl.style.overflow = 'hidden';

    // Header container
    const headerContainer = document.createElement('div');
    headerContainer.style.marginBottom = '8px';

    if (pageIdx === 0) {
      // PAGE 1: Executive Cover Header
      headerContainer.innerHTML = `
        <div style="border-bottom: 1.5px solid #cbd5e1; padding-bottom: 12px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <img src="${branding.nasharzIcon}" style="height: 34px; width: auto; object-fit: contain;" alt="Nasharz Films" />
            <div style="border-left: 1.5px solid #cbd5e1; height: 26px;"></div>
            <div>
              <div style="font-size: 12px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: #0f172a;">Nasharz Films</div>
              <div style="font-size: 9px; color: #64748b; font-weight: 500;">Campaign Strategy & Executive Production</div>
            </div>
          </div>
          <div>
            <img src="${branding.alaskaLogo}" style="height: 36px; width: auto; object-fit: contain;" alt="Alaska Batteries" />
          </div>
        </div>

        <div style="margin-bottom: 10px;">
          <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: #c69a53; margin-bottom: 3px;">
            ALASKA BATTERIES / LAUNCH DECK • CHAPTER ${chapter.number}
          </div>
          <h1 style="font-size: 24px; font-weight: 800; color: #09090b; margin: 0 0 6px 0; line-height: 1.15; letter-spacing: -0.02em;">
            ${romanTitle} <span style="font-size: 16px; font-weight: 500; color: #64748b;">— ${chapter.category}</span>
          </h1>
          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 10px; color: #64748b; padding: 4px 0; margin-top: 2px;">
            <span>Prepared By: <strong style="color: #0f172a;">Aatif Rasheed</strong> <span style="color: #b8860b; font-weight: 600;">(Producer / Director)</span></span>
            <span>Client: <strong style="color: #0f172a;">Alaska Batteries</strong></span>
            <span>Date: <strong style="color: #334155;">${dateStr}</strong></span>
            <span>Ref: <strong style="color: #334155;">NF-AB-CH${chapter.number}</strong></span>
          </div>
        </div>

        <div style="background-color: #faf8f5; border-left: 4px solid #c69a53; padding: 10px 14px; border-radius: 0 5px 5px 0; margin-bottom: 10px;">
          <div style="font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: #b8860b; margin-bottom: 3px;">
            Executive Summary
          </div>
          <p style="font-size: 11.5px; font-weight: 600; color: #1e293b; margin: 0; line-height: 1.5; font-style: italic;">
            "${romanSummary}"
          </p>
        </div>
      `;
    } else {
      // PAGE 2+: Running Header
      headerContainer.innerHTML = `
        <div style="border-bottom: 1.5px solid #cbd5e1; padding-bottom: 6px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center; font-size: 9.5px; text-transform: uppercase; letter-spacing: 0.08em; color: #64748b;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <img src="${branding.nasharzIcon}" style="height: 18px; width: auto; object-fit: contain;" alt="NF" />
            <span style="font-weight: 700; color: #0f172a;">Nasharz Films</span>
            <span>/</span>
            <span>Alaska Batteries Deck</span>
          </div>
          <div style="font-weight: 700; color: #c69a53;">
            Chapter ${chapter.number}: ${romanTitle}
          </div>
        </div>
      `;
    }

    pageEl.appendChild(headerContainer);

    // Content body area
    const contentArea = document.createElement('div');
    contentArea.style.flex = '1';
    contentArea.style.display = 'flex';
    contentArea.style.flexDirection = 'column';
    pageEl.appendChild(contentArea);

    // Footer container
    const footerArea = document.createElement('div');
    footerArea.style.borderTop = '1.5px solid #cbd5e1';
    footerArea.style.paddingTop = '8px';
    footerArea.style.display = 'flex';
    footerArea.style.justifyContent = 'space-between';
    footerArea.style.alignItems = 'center';
    footerArea.style.fontSize = '9px';
    footerArea.style.color = '#64748b';
    footerArea.style.textTransform = 'uppercase';
    footerArea.style.letterSpacing = '0.06em';
    pageEl.appendChild(footerArea);

    sandbox.appendChild(pageEl);

    const struct: PageStructure = { pageEl, contentArea, footerArea };
    pages.push(struct);
    return struct;
  };

  const isStoryboard = chapter.id === 'storyboards' || chapter.number === '06';
  const isArtTalent = chapter.id === 'art-talent' || chapter.number === '07';

  // Helper: Convert any remote image to high quality base64 data URL with multiple fallbacks
  const loadBase64Image = async (
    rawUrl: string
  ): Promise<{ dataUrl: string; width: number; height: number; aspect: number }> => {
    if (!rawUrl) return { dataUrl: '', width: 1920, height: 1080, aspect: 16 / 9 };
    // Extract Google Drive file ID if present
    const driveIdMatch = rawUrl.match(/\/d\/([a-zA-Z0-9_-]+)/) || rawUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    const driveId = driveIdMatch ? driveIdMatch[1] : null;

    const urlCandidates: string[] = [rawUrl];
    if (driveId) {
      urlCandidates.push(`https://lh3.googleusercontent.com/d/${driveId}`);
      urlCandidates.push(`https://drive.google.com/thumbnail?id=${driveId}&sz=w2560`);
      urlCandidates.push(`https://lh3.googleusercontent.com/u/0/d/${driveId}=w2560`);
    }

    // Strategy 1: HTMLImageElement -> Canvas (respects browser cache & CORS)
    for (const candidate of urlCandidates) {
      try {
        const res = await new Promise<{ dataUrl: string; width: number; height: number; aspect: number } | null>(
          (resolve) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            let resolved = false;

            const timer = setTimeout(() => {
              if (!resolved) {
                resolved = true;
                resolve(null);
              }
            }, 4000);

            img.onload = () => {
              if (resolved) return;
              resolved = true;
              clearTimeout(timer);
              try {
                const w = img.naturalWidth || 1920;
                const h = img.naturalHeight || 1080;
                const canvas = document.createElement('canvas');
                canvas.width = w;
                canvas.height = h;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                  ctx.fillStyle = '#ffffff';
                  ctx.fillRect(0, 0, w, h);
                  ctx.drawImage(img, 0, 0);
                  const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
                  resolve({ dataUrl, width: w, height: h, aspect: w / h });
                  return;
                }
              } catch {
                // Tainted canvas
              }
              resolve(null);
            };

            img.onerror = () => {
              if (!resolved) {
                resolved = true;
                clearTimeout(timer);
                resolve(null);
              }
            };

            img.src = candidate;
          }
        );
        if (res && res.dataUrl) return res;
      } catch {
        // continue
      }
    }

    // Strategy 2: Fetch Blob -> FileReader
    for (const candidate of urlCandidates) {
      try {
        const resp = await fetch(candidate, { mode: 'cors' });
        if (resp.ok) {
          const blob = await resp.blob();
          const reader = new FileReader();
          const base64 = await new Promise<string>((res) => {
            reader.onloadend = () => res(reader.result as string);
            reader.readAsDataURL(blob);
          });
          if (base64 && base64.startsWith('data:image')) {
            const tempImg = new Image();
            tempImg.src = base64;
            await new Promise((res) => {
              tempImg.onload = () => res(null);
              tempImg.onerror = () => res(null);
            });
            const w = tempImg.naturalWidth || 1920;
            const h = tempImg.naturalHeight || 1080;
            return { dataUrl: base64, width: w, height: h, aspect: w / h };
          }
        }
      } catch {
        // continue
      }
    }

    return { dataUrl: rawUrl, width: 1920, height: 1080, aspect: 16 / 9 };
  };

  if (isStoryboard && chapter.galleryImages && chapter.galleryImages.length > 0) {
    // -------------------------------------------------------------
    // STORYBOARD DEDICATED PDF FLOW:
    // 1. Title Cover Page: Centered title text
    // 2. Storyboard Pages: Raw full-page original uncropped images
    // 3. Concluding End Page: Key points / summary & official seal stamp
    // -------------------------------------------------------------

    // Extract storyboard metadata (Concept Name / Product)
    const activeFolder = chapter.folders && chapter.folders.length > 0 ? chapter.folders[0] : null;
    const titleVal = urduToRomanUrdu(activeFolder?.name || 'Storyboard Master');
    const productVal = activeFolder?.product || (titleVal.toLowerCase().includes('msb') ? 'Alaska Batteries Master Storyboard' : 'ALASKA BATTERIES');

    // Preload first image dimensions
    const firstImgData = await loadBase64Image(chapter.galleryImages[0].url);
    const isLandscape = firstImgData.aspect >= 1.0;
    
    const baseW = isLandscape ? 1123 : 794;
    const baseH = isLandscape ? 794 : 1123;

    // Direct Storyboard PDF item list
    interface SbPdfPage {
      type: 'title' | 'image' | 'end';
      title?: string;
      dataUrl?: string;
      domElement?: HTMLDivElement;
      aspect?: number;
      widthMm?: number;
      heightMm?: number;
      orientation?: 'portrait' | 'landscape';
    }
    const sbPages: SbPdfPage[] = [];

    // -------------------------------------------------------------
    // 1. TITLE COVER PAGE
    // -------------------------------------------------------------
    const titlePageEl = document.createElement('div');
    titlePageEl.style.width = `${baseW}px`;
    titlePageEl.style.height = `${baseH}px`;
    titlePageEl.style.boxSizing = 'border-box';
    titlePageEl.style.backgroundColor = '#eae8e3';
    titlePageEl.style.color = '#18181b';
    titlePageEl.style.display = 'flex';
    titlePageEl.style.flexDirection = 'column';
    titlePageEl.style.justifyContent = 'center';
    titlePageEl.style.alignItems = 'center';
    titlePageEl.style.textAlign = 'center';
    titlePageEl.style.padding = '48px';
    titlePageEl.style.position = 'relative';
    titlePageEl.style.overflow = 'hidden';

    titlePageEl.innerHTML = `
      <!-- Top branding -->
      <div style="position: absolute; top: 36px; left: 48px; right: 48px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(0,0,0,0.08); padding-bottom: 14px;">
        <img src="${branding.blackLogo || branding.nasharzIcon}" style="height: 34px; width: auto; object-fit: contain;" alt="Nasharz Films" />
        <img src="${branding.alaskaLogo}" style="height: 36px; width: auto; object-fit: contain;" alt="Alaska" />
      </div>

      <!-- Centered Title Block -->
      <div style="max-width: 700px; margin: 0 auto; display: flex; flex-direction: column; align-items: center; justify-content: center;">
        <div style="font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.18em; color: #b8860b; margin-bottom: 12px;">
          Alaska Batteries Campaign
        </div>

        <h1 style="font-size: 38px; font-weight: 900; letter-spacing: -0.02em; color: #18181b; margin: 0 0 16px 0; text-transform: uppercase; line-height: 1.15; font-family: 'Inter', system-ui, sans-serif;">
          Storyboard Presentation
        </h1>

        <div style="width: 58px; height: 4px; background: #b8860b; border-radius: 9999px; margin-bottom: 24px;"></div>

        <!-- Concept Details Card -->
        <div style="background: #f4f3f0; border: 1.5px solid #dcd8d0; border-radius: 18px; padding: 24px 42px; display: flex; flex-direction: column; gap: 12px; min-width: 360px; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
          <div style="font-size: 20px; font-weight: 800; color: #18181b; letter-spacing: -0.01em;">
            <span style="color: #b8860b; font-weight: 700; font-size: 15px; text-transform: uppercase; letter-spacing: 0.1em; display: inline-block; min-width: 90px;">Title:</span>
            ${titleVal}
          </div>

          <div style="height: 1px; background: #e2ded5; width: 100%;"></div>

          <div style="font-size: 20px; font-weight: 800; color: #18181b; letter-spacing: -0.01em;">
            <span style="color: #b8860b; font-weight: 700; font-size: 15px; text-transform: uppercase; letter-spacing: 0.1em; display: inline-block; min-width: 90px;">Product:</span>
            ${productVal.toUpperCase()}
          </div>
        </div>
      </div>

      <!-- Bottom presentation metadata -->
      <div style="position: absolute; bottom: 32px; left: 48px; right: 48px; display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: #71717a; border-top: 1px solid rgba(0,0,0,0.08); padding-top: 12px;">
        <span>Prepared for: <strong style="color: #18181b;">Alaska Batteries</strong></span>
        <span>Prepared by: <strong style="color: #18181b;">Aatif Rasheed</strong> (Nasharz Films)</span>
        <span>Total Storyboard Sheets: <strong style="color: #b8860b;">${chapter.galleryImages.length}</strong></span>
      </div>
    `;
    sandbox.appendChild(titlePageEl);
    sbPages.push({
      type: 'title',
      domElement: titlePageEl,
      orientation: isLandscape ? 'landscape' : 'portrait'
    });

    // -------------------------------------------------------------
    // 2. STORYBOARD ORIGINAL SHEETS (Pure images, no headers/footers)
    // -------------------------------------------------------------
    for (let gIdx = 0; gIdx < chapter.galleryImages.length; gIdx++) {
      const img = chapter.galleryImages[gIdx];
      const imgData = gIdx === 0 && firstImgData.dataUrl ? firstImgData : await loadBase64Image(img.url);
      sbPages.push({
        type: 'image',
        title: img.title || `Sheet ${gIdx + 1}`,
        dataUrl: imgData.dataUrl,
        aspect: imgData.aspect,
        orientation: imgData.aspect >= 1.0 ? 'landscape' : 'portrait'
      });
    }

    // -------------------------------------------------------------
    // 3. CONCLUDING END PAGE
    // -------------------------------------------------------------
    const endPageEl = document.createElement('div');
    endPageEl.style.width = `${baseW}px`;
    endPageEl.style.height = `${baseH}px`;
    endPageEl.style.boxSizing = 'border-box';
    endPageEl.style.backgroundColor = '#eae8e3';
    endPageEl.style.color = '#18181b';
    endPageEl.style.display = 'flex';
    endPageEl.style.flexDirection = 'column';
    endPageEl.style.justifyContent = 'flex-start';
    endPageEl.style.padding = isLandscape ? '32px 44px' : '40px 40px';
    endPageEl.style.position = 'relative';
    endPageEl.style.overflow = 'hidden';

    endPageEl.innerHTML = `
      <!-- Header -->
      <div style="border-bottom: 1.5px solid #d5d1c8; padding-bottom: 10px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <img src="${branding.nasharzIcon}" style="height: 32px; width: auto; object-fit: contain;" alt="Nasharz Films" />
          <div style="border-left: 1.5px solid #d5d1c8; height: 24px;"></div>
          <div>
            <div style="font-size: 12px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: #18181b;">Nasharz Films</div>
            <div style="font-size: 9px; color: #71717a; font-weight: 500;">Executive Production & Campaign Summary</div>
          </div>
        </div>
        <img src="${branding.alaskaLogo}" style="height: 34px; width: auto; object-fit: contain;" alt="Alaska" />
      </div>

      <!-- Main Summary & Key Deliverables -->
      <div style="display: flex; flex-direction: column; gap: 14px;">
        <div style="background-color: #f4f3f0; border: 1.5px solid #dcd8d0; border-left: 5px solid #b8860b; padding: 14px 18px; border-radius: 8px; box-shadow: 0 1px 4px rgba(0,0,0,0.03);">
          <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: #b8860b; margin-bottom: 5px;">
            ✦ Production Summary & Narrative Arc
          </div>
          <p style="font-size: 13px; color: #27272a; line-height: 1.55; margin: 0; font-weight: 500;">
            ${romanSummary}
          </p>
        </div>

        ${
          romanKeyPoints && romanKeyPoints.length > 0
            ? `
          <div style="background-color: #f4f3f0; border: 1px solid #dcd8d0; border-radius: 8px; padding: 14px 18px;">
            <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: #18181b; margin-bottom: 10px; display: flex; align-items: center; gap: 6px;">
              <span style="color: #b8860b;">✦</span> Key Campaign Points & Production Deliverables
            </div>
            <div style="display: grid; grid-template-columns: ${isLandscape ? '1fr 1fr' : '1fr'}; gap: 8px 16px;">
              ${romanKeyPoints
                .map(
                  (kp) => `
                <div style="font-size: 11.5px; color: #3f3f46; display: flex; align-items: flex-start; gap: 6px; line-height: 1.4;">
                  <span style="color: #b8860b; font-weight: 800;">•</span>
                  <span>${kp}</span>
                </div>
              `
                )
                .join('')}
            </div>
          </div>
        `
            : ''
        }
      </div>

      <!-- Official Sign-off & Seal Stamp right after content ends -->
      <div style="margin-top: 18px; border-top: 1.5px dashed #c8c3b8; padding-top: 14px; display: flex; justify-content: space-between; align-items: flex-start;">
        <div>
          <div style="font-size: 12px; font-weight: 800; color: #18181b;">Nasharz Films Confidential Presentation</div>
          <div style="font-size: 10.5px; font-weight: 700; color: #b8860b; margin-top: 3px;">
            Prepared By: <span style="color: #18181b;">Aatif Rasheed</span> • Producer / Director
          </div>
          <div style="font-size: 9.5px; color: #71717a; margin-top: 2px;">Produced by Nasharz Films for Alaska Batteries</div>
          <div style="font-size: 8.5px; color: #a1a1aa; margin-top: 2px;">Proprietary campaign strategy prepared strictly for Alaska Batteries executive review.</div>
        </div>
        <div style="text-align: right; display: flex; flex-direction: column; align-items: flex-end;">
          <div style="font-size: 8.5px; text-transform: uppercase; letter-spacing: 0.08em; color: #b8860b; font-weight: 700; margin-bottom: 3px;">Executive Authorization</div>
          <img src="${branding.sealStamp}" style="height: 64px; width: auto; object-fit: contain; filter: contrast(1.05);" alt="Official Stamp" />
        </div>
      </div>
    `;
    sandbox.appendChild(endPageEl);
    sbPages.push({
      type: 'end',
      domElement: endPageEl,
      orientation: isLandscape ? 'landscape' : 'portrait'
    });

    // -------------------------------------------------------------
    // RENDER TO PDF
    // -------------------------------------------------------------
    try {
      if (document.fonts) {
        await document.fonts.ready;
      }
      await preloadImages(sandbox);

      const defaultOrientation = isLandscape ? 'landscape' : 'portrait';
      const pdf = new jsPDF({
        orientation: defaultOrientation,
        unit: 'mm',
        format: 'a4',
        compress: true
      });

      const a4LandscapeW = 297;
      const a4LandscapeH = 210;
      const a4PortraitW = 210;
      const a4PortraitH = 297;

      for (let pIdx = 0; pIdx < sbPages.length; pIdx++) {
        const p = sbPages[pIdx];
        const isPageLandscape = p.orientation === 'landscape';
        const pageW = isPageLandscape ? a4LandscapeW : a4PortraitW;
        const pageH = isPageLandscape ? a4LandscapeH : a4PortraitH;

        if (pIdx > 0) {
          pdf.addPage('a4', p.orientation || defaultOrientation);
        }

        if (p.type === 'title' || p.type === 'end') {
          if (p.domElement) {
            const canvas = await html2canvas(p.domElement, {
              scale: 2,
              useCORS: true,
              allowTaint: true,
              logging: false
            });
            const imgData = canvas.toDataURL('image/jpeg', 0.95);
            pdf.addImage(imgData, 'JPEG', 0, 0, pageW, pageH);
          }
        } else if (p.type === 'image') {
          // Always set clean white background for storyboard canvas
          pdf.setFillColor(255, 255, 255);
          pdf.rect(0, 0, pageW, pageH, 'F');

          if (p.dataUrl) {
            const pageAspect = pageW / pageH;
            const imgAspect = p.aspect || 1.0;
            let drawW = pageW;
            let drawH = pageH;
            let offsetX = 0;
            let offsetY = 0;

            if (imgAspect > pageAspect) {
              drawW = pageW;
              drawH = pageW / imgAspect;
              offsetY = (pageH - drawH) / 2;
            } else {
              drawH = pageH;
              drawW = pageH * imgAspect;
              offsetX = (pageW - drawW) / 2;
            }

            pdf.addImage(p.dataUrl, 'JPEG', offsetX, offsetY, drawW, drawH);
          }
        }
      }

      pdf.save(`Nasharz_Alaska_Storyboard_${titleVal.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
      return;
    } catch (err) {
      console.error('Error generating clean Storyboard PDF:', err);
      window.print();
      return;
    } finally {
      document.body.removeChild(sandbox);
    }

  } else if (isArtTalent) {
    // -------------------------------------------------------------
    // ART & TALENT (CHAPTER 07) DEDICATED SECTIONED PDF FLOW:
    // Organized with proper section headings by sequence (Bike, Car, Truck, Tractor, UPS)
    // All images preloaded to base64 with fixed proportions to prevent cropping/splitting!
    // -------------------------------------------------------------

    interface ArtTalentItem {
      sheetNum: string;
      title: string;
      badge: string;
      url: string;
      actor: string;
      role: string;
      points: string[];
      headRule: string;
      performance: string;
    }

    interface ArtTalentSection {
      sectionNum: string;
      sectionTitle: string;
      subtitle: string;
      filmKey: string;
      locationTag: string;
      items: ArtTalentItem[];
    }

    const sections: ArtTalentSection[] = [
      {
        sectionNum: 'SECTION 01',
        sectionTitle: 'MAIN WARDROBE & TECHNICAL ENSEMBLE',
        subtitle: 'Master Brand Look & Rapid Technical Response Unit',
        filmKey: 'Master Look',
        locationTag: 'All Commercials & Mobile Labs',
        items: [
          {
            sheetNum: 'Sheet 01',
            title: 'Master Look: Battery Expert (Iftikhar Thakur)',
            badge: 'Lead Technical Authority',
            url: 'https://res.cloudinary.com/dawlj9ne4/image/upload/Battery_Pehlwan_Sheet_w2wp4c.png',
            actor: 'Iftikhar Thakur',
            role: 'Senior Energy Authority & Emergency Response Specialist',
            points: [
              'Clean white laboratory coat (crisp, practical, contemporary)',
              'White or very light neutral shalwar qameez underneath',
              'Minimal styling, no tie, no medical costume clichés',
              'No gloves unless required for a technical action',
              'CRITICAL: Absolutely no cap, no turban and no headwear'
            ],
            headRule: 'CRITICAL: Absolutely no cap, no turban and no headwear.',
            performance: 'Senior surgeon meets emergency technology specialist, unmistakably Iftikhar Thakur.'
          },
          {
            sheetNum: 'Sheet 02',
            title: 'The Alaska Battery Expert Team (Technical Specialists)',
            badge: 'Mobile Technical Unit',
            url: 'https://res.cloudinary.com/dawlj9ne4/image/upload/Battery_Pehlwan_Medical_Team_Sheet_v07k88.png',
            actor: 'Technical Specialists Ensemble',
            role: 'Mobile Diagnostic & Rapid Response Specialists',
            points: [
              'Contemporary technical uniforms with clean silhouettes',
              'Practical jackets or utility-style clothing with subtle Alaska branding',
              'Functional equipment belts and technical diagnostic flight cases',
              'Modern technical specialists — DO NOT look like hospital staff'
            ],
            headRule: 'Modern technical utility headgear / bareheaded.',
            performance: 'High-speed, disciplined, synchronized mobile technology pit-crew.'
          }
        ]
      },
      {
        sectionNum: 'SECTION 02',
        sectionTitle: 'FILM 01 — CAR SEQUENCE (URBAN GRIDLOCK)',
        subtitle: 'Traffic Warden Crisis & Heat Resistance Demonstration',
        filmKey: 'Film 01 — Car',
        locationTag: 'Food Street / Ring Road Junction, Lahore',
        items: [
          {
            sheetNum: 'Sheet 03',
            title: 'Character Thakur: Traffic Policeman',
            badge: 'Car Sequence',
            url: 'https://res.cloudinary.com/dawlj9ne4/image/upload/Battery_Pehlwan_Traf_Policeman_Sheet_bmo9yi.png',
            actor: 'Iftikhar Thakur',
            role: 'Gridlock Traffic Policeman',
            points: [
              'Authentic Pakistani traffic police uniform (shirt & trousers)',
              'Official Police cap and duty belt',
              'Clean but naturally worn appearance with appropriate shoes',
              'Special sequence: silver-foil heat resistance suit for comedy scene'
            ],
            headRule: 'Must wear official police cap (creates stark visual separation from Battery Expert).',
            performance: 'Stern, irritated, street-smart, comically confident in traffic gridlock.'
          },
          {
            sheetNum: 'Sheet 04',
            title: 'Traffic Policeman Uniform Color Options & Insignia',
            badge: 'Wardrobe Reference',
            url: 'https://res.cloudinary.com/dawlj9ne4/image/upload/Battery_Pehlwan_Traf_Policeman_Color_Options_yhw9p8.png',
            actor: 'Wardrobe Department Reference',
            role: 'Provincial Uniform Color Palette & Insignia Variations',
            points: [
              'Authentic provincial traffic police color variations: Blue-grey, khaki, navy, and white trim insignia options',
              'Official high-visibility chest badges and reflective shoulder epaulettes',
              'Approved color palette ensures maximum contrast against urban streetscapes'
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
              'His wardrobe should communicate that he owns an expensive car without making him look like a celebrity, politician or fashion model',
              'Modern corporate attire: tailored blazer, crisp shirt, leather strap watch'
            ],
            headRule: 'Neatly groomed metropolitan professional haircut.',
            performance: 'Stressed urban commuter stranded in dead-battery gridlock on the way to an important engagement.'
          }
        ]
      },
      {
        sectionNum: 'SECTION 03',
        sectionTitle: 'FILM 04 — BIKE SEQUENCE (MORNING COMMUTE)',
        subtitle: 'High-Stakes Office Rush & Ride-Hail Commute Challenge',
        filmKey: 'Film 04 — Bike',
        locationTag: 'Packages Mall Boulevard / Main Market, Lahore',
        items: [
          {
            sheetNum: 'Sheet 06',
            title: 'Character Thakur: Office Executive in Safari Suit',
            badge: 'Bike Sequence',
            url: 'https://res.cloudinary.com/dawlj9ne4/image/upload/Battery_Pehlwan_Office_Executive_Sheet_k7dybx.png',
            actor: 'Iftikhar Thakur',
            role: 'Senior Executive Commuter (Formerly Morning Man)',
            points: [
              'Senior office executive commuting during morning rush hour',
              'Classic tailored safari suit (beige/khaki or grey-blue)',
              'Epaulettes, flap chest pockets, belted or structured jacket silhouette',
              'Polished leather shoes, frantic commuter watch-checking'
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
              'The character is a practical Pakistani taxi motorcycle rider, urban, hardworking and realistic',
              'He should look like an authentic everyday bike rider, not a fashion model, delivery rider or generic construction worker',
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
        sectionNum: 'SECTION 04',
        sectionTitle: 'FILM 02 — TRUCK SEQUENCE (KARACHI FISH HARBOR)',
        subtitle: 'Commercial Fleet Transport & Ice-Preserved Perishable Cargo',
        filmKey: 'Film 02 — Truck',
        locationTag: 'Ibrahim Hyderi / Fish Harbor Jetty, Karachi',
        items: [
          {
            sheetNum: 'Sheet 09',
            title: 'Character Thakur: Fisherman & Port Logistics Captain',
            badge: 'Truck Sequence',
            url: 'https://res.cloudinary.com/dawlj9ne4/image/upload/Battery_Pehlwan_Pathan_Thakur_Sheet_d2i9er.png',
            actor: 'Iftikhar Thakur',
            role: 'Fish Harbor Logistics Captain',
            points: [
              'Simple traditional shalwar qameez in earthy, practical fabric',
              'Embroidered waistcoat details, brass ring keys, weathered working look',
              'KEY MANDATORY RULE: Truck Driver / Fisherman Thakur MUST always wear the white Pathan cap',
              'Battery Expert contrasts with white lab coat, NO Pathan cap, and NO headwear'
            ],
            headRule: 'KEY MANDATORY RULE: Truck Driver Thakur must always wear the white Pathan cap.',
            performance: 'Brave, resilient, protective of his fresh seafood cargo at Karachi port.'
          },
          {
            sheetNum: 'Sheet 10',
            title: 'Truck Driver & Port Cargo Crew',
            badge: 'Supporting Ensemble',
            url: 'https://res.cloudinary.com/dawlj9ne4/image/upload/Battery_Pehlwan_Truck_Driver_Sheet_kbbtsv.png',
            actor: 'Supporting Ensemble',
            role: 'Fish Port Cargo Workers & Transport Crew',
            points: [
              'Weathered utility workwear, rolled-up sleeves, waterproof rubber boots',
              'Heavy ice crates, wet fish containers, sea-spray salt patina',
              'Grounded Karachi fish harbor maritime atmosphere'
            ],
            headRule: 'Practical cotton patkas or bareheaded harbor workwear.',
            performance: 'Hardworking, bustling dock workers racing against melting ice and spoiling cargo.'
          }
        ]
      },
      {
        sectionNum: 'SECTION 05',
        sectionTitle: 'FILM 03 — TRACTOR SEQUENCE (PUNJABI AGRICULTURAL BARAAT)',
        subtitle: 'Rural Wedding Procession & Heavy Agricultural Machinery',
        filmKey: 'Film 03 — Tractor',
        locationTag: 'Kareem Block Agricultural Fields & Village Track',
        items: [
          {
            sheetNum: 'Sheet 11',
            title: 'Character Thakur: Chaudhary Sb (Option A — Red Polka Turban)',
            badge: 'Tractor Sequence',
            url: 'https://res.cloudinary.com/dawlj9ne4/image/upload/Battery_Pehlwan_Chaudharsb_1_Sheet_zbnlik.png',
            actor: 'Iftikhar Thakur',
            role: 'Baraat Patriarch & Farm Landlord',
            points: [
              'Vibrant red turban / safa with golden-yellow polka-dot pattern',
              'Traditional fan-style front knot (Turra / Shamla)',
              'Mustard-yellow kurta with matching dhoti or lacha',
              'Red floral-print stole, traditional tilla khussa',
              'Bushy handlebar moustache, thick eyebrows, rustic Punjabi Chaudhary personality'
            ],
            headRule: 'Vibrant red polka turban (Battery Expert wears NO turban, NO headwear).',
            performance: 'Bushy handlebar moustache, thick eyebrows, rustic Punjabi Chaudhary charisma.'
          },
          {
            sheetNum: 'Sheet 12',
            title: 'Character Thakur: Chaudhary Sb (Option B — Traditional Boski Elder)',
            badge: 'Tractor Sequence',
            url: 'https://res.cloudinary.com/dawlj9ne4/image/upload/Battery_Pehlwan_ch_sb_Sheet_hi8350.png',
            actor: 'Iftikhar Thakur',
            role: 'Traditional Rural Grandfather',
            points: [
              'Starched pristine white Cotton Boski Kurta Pajama',
              'Traditional starched white/cream turban',
              'Authentic handmade Tilla Khussa & carved cane',
              'Authoritative village patriarch presence'
            ],
            headRule: 'Traditional starched turban.',
            performance: 'Wise, prestigious, authoritative village elder.'
          },
          {
            sheetNum: 'Sheet 13',
            title: 'Farmer & Agricultural Harvester Crew',
            badge: 'Supporting Ensemble',
            url: 'https://res.cloudinary.com/dawlj9ne4/image/upload/Battery_Pehlwan_Farmer_Sheet_dpryzu.png',
            actor: 'Supporting Ensemble',
            role: 'Agricultural Harvesters',
            points: [
              'Earthy Khaki/Olive breathable cotton kurta, Punjabi Tehband (Lungi)',
              'Checkered gamchha / patka shoulder wrap',
              'Realistic harvest soil and field patina, genuine Punjabi agricultural realism'
            ],
            headRule: 'Traditional farmer patka wrap.',
            performance: 'Hardworking, genuine, joyful celebration when the tractor restarts.'
          }
        ]
      },
      {
        sectionNum: 'SECTION 06',
        sectionTitle: 'FILM 05 — UPS / HOME INVERTER SEQUENCE (HAVELI BLACKOUT)',
        subtitle: 'Haveli Wedding Morning Crisis & Emergency Power Backup',
        filmKey: 'Film 05 — UPS / Home',
        locationTag: 'Fakir Khana Museum Haveli, Walled City Lahore',
        items: [
          {
            sheetNum: 'Sheet 14',
            title: 'Character Thakur: Festive Wedding Guest',
            badge: 'UPS Sequence',
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
            title: 'UPS Guy / Young Groom (Option B — Master Look)',
            badge: 'Supporting Cast',
            url: 'https://res.cloudinary.com/dawlj9ne4/image/upload/Battery_Pehlwan_UPS_Guy_Sheet_ilqhb2.png',
            actor: 'Lead Supporting Cast',
            role: 'Stressed Groom Managing Wedding Morning (Master Styling)',
            points: [
              'Young Pakistani groom, approximately mid-20s to mid-30s',
              'He is energetic, busy and slightly stressed because he is personally managing the wedding arrangements',
              'He should look like he is constantly being pulled in different directions on the morning of his own wedding — checking preparations, arranging things and managing the chaos',
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
              'She should look like the person who is managing the entire wedding household and knows exactly what everyone should be doing',
              'Natural Pakistani beauty, realistic skin texture, graceful but strong presence'
            ],
            headRule: 'Graceful festive dupatta drape over styled hair.',
            performance: 'Authoritative matriarch orchestrating wedding preparations with practical urgency.'
          }
        ]
      }
    ];

    // Parallel Production Design Suite: Vehicle & Props Design Grids across all sequences
    const vehicleSections = [
      {
        sectionTitle: 'UNIFIED MOBILE LABORATORY • MASTER VEHICLE OPTIONS (FLEET)',
        sectionSubtitle: 'Unified high-tech emergency response van fleet options deployed across all 5 commercial films',
        badge: 'Master Laboratory Fleet',
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
            sheetNum: 'Grid 02',
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
            sheetNum: 'Grid 03',
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
            sheetNum: 'Grid 04',
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
            sheetNum: 'Grid 05',
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
            sheetNum: 'Grid 06',
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

    // Location Concept & Scouting Reference Sheets for all 5 sequences
    const locationSheets = [
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

    // Preload ALL images in parallel to Base64 data URLs with full dimension metadata
    const allImageUrls: string[] = [];
    sections.forEach(sec => {
      sec.items.forEach(it => {
        if (it.url) allImageUrls.push(it.url);
      });
    });
    vehicleSections.forEach(sec => {
      sec.items.forEach(it => {
        if (it.url) allImageUrls.push(it.url);
      });
    });
    locationSheets.forEach(it => {
      if (it.url) allImageUrls.push(it.url);
    });
    if (branding.sealStamp) allImageUrls.push(branding.sealStamp);

    interface ImageMeta {
      dataUrl: string;
      width: number;
      height: number;
      aspect: number;
    }
    const imageMetaMap = new Map<string, ImageMeta>();
    await Promise.all(
      [...new Set(allImageUrls)].map(async (url) => {
        try {
          const res = await loadBase64Image(url);
          if (res && res.dataUrl) {
            imageMetaMap.set(url, res);
          }
        } catch {
          // fallback to raw URL
        }
      })
    );

    // Setup pagination engine with smart section break management
    let currentPage = createNewPage(0);
    let currentHeight = 0;
    let maxContentHeight = 730; // Page 1 has title & cover metadata

    const appendElementWithPagination = (el: HTMLElement, isSectionHeader = false) => {
      const h = measureElementHeight(el);
      // For section headers, guarantee enough space for header + at least one full character card (~370px)
      const requiredSpace = isSectionHeader ? h + 370 : h;

      if (currentHeight + requiredSpace > maxContentHeight && currentHeight > 0) {
        currentPage = createNewPage(pages.length);
        currentHeight = 0;
        maxContentHeight = 920;
      }
      currentPage.contentArea.appendChild(el);
      currentHeight += h;
    };

    // 1. Chapter Title & Visual Principles Overview Block
    const overviewBlock = document.createElement('div');
    overviewBlock.style.marginBottom = '12px';
    overviewBlock.style.backgroundColor = '#18181b';
    overviewBlock.style.color = '#ffffff';
    overviewBlock.style.padding = '12px 16px';
    overviewBlock.style.borderRadius = '8px';
    overviewBlock.style.border = '1px solid #27272a';
    overviewBlock.innerHTML = `
      <div style="font-size: 9.5px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: #c69a53; margin-bottom: 4px;">
        01. Campaign Visual World & Central Separation Rule
      </div>
      <div style="font-size: 10.5px; line-height: 1.45; color: #d4d4d8;">
        <strong>Overall Look:</strong> Contemporary Pakistani realism with heightened comic situations. Authentic, Cinematic, Premium, Warm, Lived-in, and Recognizably Pakistani.<br/>
        <strong>Separation Rule:</strong> Iftikhar Thakur plays different character variants per film, whereas the <strong>Battery Expert</strong> wears a crisp white lab coat, light neutral shalwar qameez underneath, and <strong style="color: #fbbf24;">ABSOLUTELY NO CAP, TURBAN OR HEADWEAR</strong>.
      </div>
    `;
    appendElementWithPagination(overviewBlock);

    // 2. Render all character sections
    sections.forEach((sec) => {
      // Section Header Element
      const secHeaderEl = document.createElement('div');
      secHeaderEl.style.marginBottom = '10px';
      secHeaderEl.style.marginTop = '8px';
      secHeaderEl.style.backgroundColor = '#18181b';
      secHeaderEl.style.borderRadius = '8px';
      secHeaderEl.style.padding = '8px 14px';
      secHeaderEl.style.borderLeft = '4px solid #c69a53';
      secHeaderEl.style.display = 'flex';
      secHeaderEl.style.justifyContent = 'space-between';
      secHeaderEl.style.alignItems = 'center';
      secHeaderEl.innerHTML = `
        <div>
          <div style="font-size: 8px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.12em; color: #c69a53;">
            ${sec.sectionNum} • ${sec.filmKey.toUpperCase()}
          </div>
          <div style="font-size: 12.5px; font-weight: 800; color: #ffffff; letter-spacing: -0.01em; margin-top: 1px;">
            ${sec.sectionTitle}
          </div>
        </div>
        <div style="font-size: 8.5px; color: #a1a1aa; font-weight: 600; text-align: right;">
          ${sec.items.length} Character Sheets • ${sec.locationTag}
        </div>
      `;
      appendElementWithPagination(secHeaderEl, true);

      // Character Cards
      sec.items.forEach((item) => {
        const card = document.createElement('div');
        card.style.marginBottom = '12px';
        card.style.border = '1px solid #e2e8f0';
        card.style.borderRadius = '8px';
        card.style.backgroundColor = '#ffffff';
        card.style.overflow = 'hidden';
        card.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.04)';

        const meta = imageMetaMap.get(item.url);
        const imgSrc = meta?.dataUrl || item.url;
        const aspect = meta?.aspect && !isNaN(meta.aspect) && meta.aspect > 0.1 ? meta.aspect : (16 / 9);

        // Calculate exact un-squeezed pixel width and height respecting natural aspect ratio
        const maxCardImgW = 676;
        const maxCardImgH = 220;

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
          <div style="background-color: #f8fafc; border-bottom: 1px solid #e2e8f0; padding: 6px 12px; display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 9px; font-weight: 800; color: #b8860b; background: #fefce8; border: 1px solid #fef08a; padding: 1px 6px; border-radius: 4px;">
                ${item.sheetNum}
              </span>
              <span style="font-size: 11.5px; font-weight: 800; color: #0f172a;">
                ${item.title}
              </span>
            </div>
            <span style="font-size: 8.5px; font-weight: 700; color: #475569; background: #f1f5f9; border: 1px solid #cbd5e1; padding: 2px 7px; border-radius: 9999px;">
              ${item.badge}
            </span>
          </div>

          <!-- Card Content Body -->
          <div style="padding: 10px 12px 10px 12px; background: #ffffff;">
            <!-- Character Sheet Showcase (Exact Aspect Ratio, Non-Distorted, Centered) -->
            <div style="background-color: #0c0a09; border: 1px solid #1c1917; border-radius: 6px; padding: 5px; display: flex; align-items: center; justify-content: center; min-height: ${finalH + 10}px; margin-bottom: 8px;">
              <img 
                src="${imgSrc}" 
                width="${finalW}" 
                height="${finalH}" 
                style="width: ${finalW}px; height: ${finalH}px; max-width: 100%; display: block; margin: 0 auto; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.4);" 
                alt="${item.title}" 
                crossorigin="anonymous" 
              />
            </div>

            <!-- Details & Specifications Grid -->
            <div style="display: grid; grid-template-columns: 1.15fr 0.85fr; gap: 10px; align-items: start;">
              <!-- Left Column: Actor, Role & Wardrobe Specs -->
              <div>
                <div style="font-size: 9.5px; color: #475569; margin-bottom: 4px;">
                  <strong style="color: #0f172a;">Actor:</strong> ${item.actor} • <strong style="color: #0f172a;">Role:</strong> <span style="color: #b8860b; font-weight: 700;">${item.role}</span>
                </div>
                <div style="background-color: #faf8f5; border: 1px solid #f1ece4; border-radius: 5px; padding: 6px 8px;">
                  <div style="font-size: 8px; font-weight: 800; text-transform: uppercase; color: #78716c; letter-spacing: 0.05em; margin-bottom: 2px;">Wardrobe Specifications</div>
                  <ul style="margin: 0; padding-left: 12px; font-size: 8.5px; line-height: 1.35; color: #334155;">
                    ${item.points.map(p => `<li style="margin-bottom: 1.5px;">${p}</li>`).join('')}
                  </ul>
                </div>
              </div>

              <!-- Right Column: Headwear Rule & Performance Directive -->
              <div style="display: flex; flex-direction: column; gap: 4px;">
                <div style="background-color: #fefce8; border: 1px solid #fef08a; border-radius: 5px; padding: 5px 8px;">
                  <div style="font-size: 8px; font-weight: 800; text-transform: uppercase; color: #854d0e; letter-spacing: 0.05em; margin-bottom: 2px;">Headwear & Styling Directive</div>
                  <div style="font-size: 8.5px; color: #713f12; line-height: 1.3; font-weight: 600;">${item.headRule}</div>
                </div>
                <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 5px; padding: 5px 8px;">
                  <div style="font-size: 8px; font-weight: 800; text-transform: uppercase; color: #64748b; letter-spacing: 0.05em; margin-bottom: 2px;">Performance & Character Note</div>
                  <div style="font-size: 8.5px; color: #334155; line-height: 1.3;">${item.performance}</div>
                </div>
              </div>
            </div>
          </div>
        `;
        appendElementWithPagination(card);
      });
    });

    // -------------------------------------------------------------
    // VEHICLE & PROPS DESIGN GRIDS (Parallel Production Design Package)
    // -------------------------------------------------------------
    vehicleSections.forEach((sec) => {
      const secHeader = document.createElement('div');
      secHeader.style.marginBottom = '10px';
      secHeader.style.marginTop = '12px';
      secHeader.style.backgroundColor = '#18181b';
      secHeader.style.borderRadius = '8px';
      secHeader.style.padding = '8px 14px';
      secHeader.style.borderLeft = '4px solid #c69a53';
      secHeader.style.display = 'flex';
      secHeader.style.justifyContent = 'space-between';
      secHeader.style.alignItems = 'center';
      secHeader.innerHTML = `
        <div>
          <div style="font-size: 8px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.12em; color: #c69a53;">
            PRODUCTION DESIGN • VEHICLE & PROPS PACKAGE
          </div>
          <div style="font-size: 12.5px; font-weight: 800; color: #ffffff; letter-spacing: -0.01em; margin-top: 1px;">
            ${sec.sectionTitle}
          </div>
          <div style="font-size: 8.5px; color: #d4d4d8; margin-top: 1px;">
            ${sec.sectionSubtitle}
          </div>
        </div>
        <div style="font-size: 8.5px; color: #18181b; background: #c69a53; font-weight: 800; padding: 3px 8px; border-radius: 9999px;">
          ${sec.badge}
        </div>
      `;
      appendElementWithPagination(secHeader, true);

      sec.items.forEach((item) => {
        const card = document.createElement('div');
        card.style.marginBottom = '12px';
        card.style.border = '1px solid #cbd5e1';
        card.style.borderRadius = '8px';
        card.style.backgroundColor = '#ffffff';
        card.style.overflow = 'hidden';
        card.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.04)';

        const meta = imageMetaMap.get(item.url);
        const imgSrc = meta?.dataUrl || item.url;
        const aspect = meta?.aspect && !isNaN(meta.aspect) && meta.aspect > 0.1 ? meta.aspect : 1;

        // Calculate un-squeezed pixel width and height respecting natural aspect ratio (usually square 1:1 or 4:3)
        const maxCardImgW = 676;
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
          <div style="background-color: #f8fafc; border-bottom: 1px solid #e2e8f0; padding: 6px 12px; display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 9px; font-weight: 800; color: #b8860b; background: #fefce8; border: 1px solid #fef08a; padding: 1px 6px; border-radius: 4px;">
                ${item.sheetNum}
              </span>
              <span style="font-size: 11.5px; font-weight: 800; color: #0f172a;">
                ${item.title}
              </span>
            </div>
            <span style="font-size: 8.5px; font-weight: 700; color: #475569; background: #f1f5f9; border: 1px solid #cbd5e1; padding: 2px 7px; border-radius: 9999px;">
              ${item.badge}
            </span>
          </div>

          <!-- Card Content Body -->
          <div style="padding: 10px 12px 10px 12px; background: #ffffff;">
            <!-- Vehicle & Prop Sheet Showcase -->
            <div style="background-color: #0c0a09; border: 1px solid #1c1917; border-radius: 6px; padding: 6px; display: flex; align-items: center; justify-content: center; min-height: ${finalH + 12}px; margin-bottom: 8px;">
              <img 
                src="${imgSrc}" 
                width="${finalW}" 
                height="${finalH}" 
                style="width: ${finalW}px; height: ${finalH}px; max-width: 100%; display: block; margin: 0 auto; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.4);" 
                alt="${item.title}" 
                crossorigin="anonymous" 
              />
            </div>

            <!-- Details & Specifications Grid -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; align-items: start;">
              <!-- Left Column: Main Vehicle & Vehicle Look -->
              <div style="display: flex; flex-direction: column; gap: 6px;">
                <div style="background-color: #faf8f5; border: 1px solid #f1ece4; border-radius: 5px; padding: 6px 8px;">
                  <div style="font-size: 8px; font-weight: 800; text-transform: uppercase; color: #78716c; letter-spacing: 0.05em; margin-bottom: 2px;">Main Vehicle & Diagnostic Hardware</div>
                  <ul style="margin: 0; padding-left: 12px; font-size: 8.5px; line-height: 1.35; color: #334155;">
                    ${item.mainVehicle.map((p: string) => `<li style="margin-bottom: 1.5px;">${p}</li>`).join('')}
                  </ul>
                </div>

                <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 5px; padding: 6px 8px;">
                  <div style="font-size: 8px; font-weight: 800; text-transform: uppercase; color: #64748b; letter-spacing: 0.05em; margin-bottom: 2px;">Vehicle Realism & Finishes</div>
                  <ul style="margin: 0; padding-left: 12px; font-size: 8.5px; line-height: 1.35; color: #334155;">
                    ${item.vehicleLook.map((p: string) => `<li style="margin-bottom: 1.5px;">${p}</li>`).join('')}
                  </ul>
                </div>
              </div>

              <!-- Right Column: Props & Production Directives -->
              <div style="display: flex; flex-direction: column; gap: 6px;">
                <div style="background-color: #faf8f5; border: 1px solid #f1ece4; border-radius: 5px; padding: 6px 8px;">
                  <div style="font-size: 8px; font-weight: 800; text-transform: uppercase; color: #b8860b; letter-spacing: 0.05em; margin-bottom: 2px;">Production & Narrative Props</div>
                  <ul style="margin: 0; padding-left: 12px; font-size: 8.5px; line-height: 1.35; color: #334155;">
                    ${item.props.map((p: string) => `<li style="margin-bottom: 1.5px;">${p}</li>`).join('')}
                  </ul>
                </div>

                <div style="background-color: #fefce8; border: 1px solid #fef08a; border-radius: 5px; padding: 6px 8px;">
                  <div style="font-size: 8px; font-weight: 800; text-transform: uppercase; color: #854d0e; letter-spacing: 0.05em; margin-bottom: 2px;">Art Department Directive</div>
                  <div style="font-size: 8.5px; color: #713f12; line-height: 1.3; font-weight: 600;">${item.rule}</div>
                </div>
              </div>
            </div>
          </div>
        `;
        appendElementWithPagination(card);
      });
    });

    // -------------------------------------------------------------
    // SECTION 07: PRODUCTION DESIGN & MOBILE LABORATORIES
    // -------------------------------------------------------------
    const prodDesignHeader = document.createElement('div');
    prodDesignHeader.style.marginBottom = '10px';
    prodDesignHeader.style.marginTop = '8px';
    prodDesignHeader.style.backgroundColor = '#18181b';
    prodDesignHeader.style.borderRadius = '8px';
    prodDesignHeader.style.padding = '8px 14px';
    prodDesignHeader.style.borderLeft = '4px solid #c69a53';
    prodDesignHeader.style.display = 'flex';
    prodDesignHeader.style.justifyContent = 'space-between';
    prodDesignHeader.style.alignItems = 'center';
    prodDesignHeader.innerHTML = `
      <div>
        <div style="font-size: 8px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.12em; color: #c69a53;">
          SECTION 07 • PRODUCTION DESIGN LANGUAGE
        </div>
        <div style="font-size: 12.5px; font-weight: 800; color: #ffffff; letter-spacing: -0.01em; margin-top: 1px;">
          Mobile Diagnostic Units & Color Architecture
        </div>
      </div>
      <div style="font-size: 8.5px; color: #a1a1aa; font-weight: 600;">
        5 Vehicle Units • 6 Production Priorities • 9 USPs
      </div>
    `;
    appendElementWithPagination(prodDesignHeader, true);

    const mobileLabsBlock = document.createElement('div');
    mobileLabsBlock.style.marginBottom = '10px';
    mobileLabsBlock.style.border = '1px solid #e2e8f0';
    mobileLabsBlock.style.borderRadius = '8px';
    mobileLabsBlock.style.padding = '10px 12px';
    mobileLabsBlock.style.backgroundColor = '#ffffff';
    mobileLabsBlock.innerHTML = `
      <div style="font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: #b8860b; margin-bottom: 6px;">
        Mobile Diagnostic Response Units by Sequence
      </div>
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px;">
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 7px 9px;">
          <div style="font-size: 9.5px; font-weight: 800; color: #0f172a;">1. Film 01 (Car): Specialized High-Tech Diagnostic Van</div>
          <div style="font-size: 8.5px; color: #475569; margin-top: 2px;">Matte metallic finish, motorized slide-out battery tester trays, rapid LED diagnostic scopes.</div>
        </div>
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 7px 9px;">
          <div style="font-size: 9.5px; font-weight: 800; color: #0f172a;">2. Film 02 (Truck): Heavy Commercial Marine Support Unit</div>
          <div style="font-size: 8.5px; color: #475569; margin-top: 2px;">Reinforced steel crane arm, heavy-duty marine battery testing harness for wet port logistics.</div>
        </div>
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 7px 9px;">
          <div style="font-size: 9.5px; font-weight: 800; color: #0f172a;">3. Film 03 (Tractor): All-Terrain Agricultural Mobile Workshop</div>
          <div style="font-size: 8.5px; color: #475569; margin-top: 2px;">Dust-sealed field unit with high-torque cranking test meters for rural farmlands.</div>
        </div>
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 7px 9px;">
          <div style="font-size: 9.5px; font-weight: 800; color: #0f172a;">4. Film 04 (Bike): Rapid Motorcycle Emergency Unit</div>
          <div style="font-size: 8.5px; color: #475569; margin-top: 2px;">High-speed agile city scooter with rapid battery swap racks and diagnostic pods.</div>
        </div>
      </div>
    `;
    appendElementWithPagination(mobileLabsBlock);

    // -------------------------------------------------------------
    // SECTION 08: SHOOTING LOCATIONS MATRIX
    // -------------------------------------------------------------
    const locationsHeader = document.createElement('div');
    locationsHeader.style.marginBottom = '10px';
    locationsHeader.style.marginTop = '8px';
    locationsHeader.style.backgroundColor = '#18181b';
    locationsHeader.style.borderRadius = '8px';
    locationsHeader.style.padding = '8px 14px';
    locationsHeader.style.borderLeft = '4px solid #c69a53';
    locationsHeader.style.display = 'flex';
    locationsHeader.style.justifyContent = 'space-between';
    locationsHeader.style.alignItems = 'center';
    locationsHeader.innerHTML = `
      <div>
        <div style="font-size: 8px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.12em; color: #c69a53;">
          SECTION 08 • SHOOTING LOCATIONS & PRODUCTION TERRITORY
        </div>
        <div style="font-size: 12.5px; font-weight: 800; color: #ffffff; letter-spacing: -0.01em; margin-top: 1px;">
          Location Concept Grids & Multi-City Scouting Dossiers
        </div>
        <div style="font-size: 8.5px; color: #d4d4d8; margin-top: 1px;">
          5 Verified Commercial Film Locations (Lahore & Karachi) • Turnkey Permissions Matrix
        </div>
      </div>
      <div style="font-size: 8.5px; color: #18181b; background: #c69a53; font-weight: 800; padding: 3px 8px; border-radius: 9999px;">
        5 Location Grids
      </div>
    `;
    appendElementWithPagination(locationsHeader, true);

    // Render each Location Concept Sheet Card with un-squeezed photo and full production data
    locationSheets.forEach((loc) => {
      const locCard = document.createElement('div');
      locCard.style.marginBottom = '12px';
      locCard.style.border = '1px solid #cbd5e1';
      locCard.style.borderRadius = '8px';
      locCard.style.backgroundColor = '#ffffff';
      locCard.style.overflow = 'hidden';
      locCard.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.04)';

      const meta = imageMetaMap.get(loc.url);
      const imgSrc = meta?.dataUrl || loc.url;
      const aspect = meta?.aspect && !isNaN(meta.aspect) && meta.aspect > 0.1 ? meta.aspect : 1;

      const maxCardImgW = 676;
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

      locCard.innerHTML = `
        <!-- Location Header Bar -->
        <div style="background-color: #f8fafc; border-bottom: 1px solid #e2e8f0; padding: 6px 12px; display: flex; justify-content: space-between; align-items: center;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 9px; font-weight: 800; color: #b8860b; background: #fefce8; border: 1px solid #fef08a; padding: 1px 6px; border-radius: 4px;">
              ${loc.sheetNum}
            </span>
            <span style="font-size: 11.5px; font-weight: 800; color: #0f172a;">
              ${loc.title}
            </span>
          </div>
          <span style="font-size: 8.5px; font-weight: 700; color: #475569; background: #f1f5f9; border: 1px solid #cbd5e1; padding: 2px 7px; border-radius: 9999px;">
            ${loc.badge}
          </span>
        </div>

        <!-- Location Content Body -->
        <div style="padding: 10px 12px; background: #ffffff;">
          <!-- Location Concept Photo Showcase -->
          <div style="background-color: #0c0a09; border: 1px solid #1c1917; border-radius: 6px; padding: 6px; display: flex; align-items: center; justify-content: center; min-height: ${finalH + 12}px; margin-bottom: 8px;">
            <img 
              src="${imgSrc}" 
              width="${finalW}" 
              height="${finalH}" 
              style="width: ${finalW}px; height: ${finalH}px; max-width: 100%; display: block; margin: 0 auto; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.4);" 
              alt="${loc.title}" 
              crossorigin="anonymous" 
            />
          </div>

          <!-- Location Details & Specifications Grid -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; align-items: start;">
            <!-- Left: Location Logistics & Permissions -->
            <div style="display: flex; flex-direction: column; gap: 4px;">
              <div style="background-color: #faf8f5; border: 1px solid #f1ece4; border-radius: 5px; padding: 6px 8px;">
                <div style="font-size: 8px; font-weight: 800; text-transform: uppercase; color: #78716c; letter-spacing: 0.05em; margin-bottom: 3px;">Territory, City & GPS Coordinates</div>
                <div style="font-size: 8.5px; color: #0f172a; font-weight: 700; margin-bottom: 2px;">${loc.city}</div>
                <div style="font-size: 8px; color: #64748b; font-family: monospace;">GPS: ${loc.coordinates}</div>
                <div style="font-size: 8px; color: #854d0e; margin-top: 3px; font-weight: 600;">Permits: ${loc.permits}</div>
              </div>
              <div style="background-color: #fefce8; border: 1px solid #fef08a; border-radius: 5px; padding: 5px 8px;">
                <div style="font-size: 8px; font-weight: 800; text-transform: uppercase; color: #854d0e; letter-spacing: 0.05em; margin-bottom: 2px;">Optimal Lighting & Sun Window</div>
                <div style="font-size: 8.5px; color: #713f12; line-height: 1.35; font-weight: 600;">${loc.lightingWindow}</div>
              </div>
            </div>

            <!-- Right: Production Design Highlights & Visual Goal -->
            <div style="display: flex; flex-direction: column; gap: 4px;">
              <div style="background-color: #faf8f5; border: 1px solid #f1ece4; border-radius: 5px; padding: 6px 8px;">
                <div style="font-size: 8px; font-weight: 800; text-transform: uppercase; color: #78716c; letter-spacing: 0.05em; margin-bottom: 3px;">Set Dressing & Production Design Highlights</div>
                <ul style="margin: 0; padding-left: 12px; font-size: 8.5px; line-height: 1.35; color: #334155;">
                  ${loc.productionDesign.map(p => `<li style="margin-bottom: 1.5px;">${p}</li>`).join('')}
                </ul>
              </div>
              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 5px; padding: 5px 8px;">
                <div style="font-size: 8px; font-weight: 800; text-transform: uppercase; color: #64748b; letter-spacing: 0.05em; margin-bottom: 2px;">Cinematic Tone & Narrative Goal</div>
                <div style="font-size: 8.5px; color: #334155; line-height: 1.35; font-weight: 500;">${loc.visualGoal}</div>
              </div>
            </div>
          </div>
        </div>
      `;
      appendElementWithPagination(locCard);
    });

    const locationsBlock = document.createElement('div');
    locationsBlock.style.marginBottom = '10px';
    locationsBlock.style.border = '1px solid #e2e8f0';
    locationsBlock.style.borderRadius = '8px';
    locationsBlock.style.padding = '10px 12px';
    locationsBlock.style.backgroundColor = '#ffffff';
    locationsBlock.innerHTML = `
      <div style="font-size: 9px; font-weight: 800; text-transform: uppercase; color: #0f172a; letter-spacing: 0.05em; margin-bottom: 6px;">
        Production Logistics & Permissions Summary Matrix
      </div>
      <table style="width: 100%; border-collapse: collapse; font-size: 8.5px; color: #334155;">
        <thead>
          <tr style="background-color: #f1f5f9; text-align: left; color: #0f172a; font-weight: 800; font-size: 8px; text-transform: uppercase;">
            <th style="padding: 5px 8px; border: 1px solid #cbd5e1;">Film Sequence</th>
            <th style="padding: 5px 8px; border: 1px solid #cbd5e1;">Selected Location</th>
            <th style="padding: 5px 8px; border: 1px solid #cbd5e1;">City / Area</th>
            <th style="padding: 5px 8px; border: 1px solid #cbd5e1;">Permit Authority & Staging Bay</th>
            <th style="padding: 5px 8px; border: 1px solid #cbd5e1;">Key Art & Production Highlights</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 5px 8px; border: 1px solid #e2e8f0; font-weight: 700; color: #0f172a;">Film 01 — Car</td>
            <td style="padding: 5px 8px; border: 1px solid #e2e8f0;">Food Street / Badshahi Area</td>
            <td style="padding: 5px 8px; border: 1px solid #e2e8f0;">Lahore Walled City</td>
            <td style="padding: 5px 8px; border: 1px solid #e2e8f0;">WCLA & CTPL • Hazuri Bagh Staging</td>
            <td style="padding: 5px 8px; border: 1px solid #e2e8f0;">High-density traffic gridlock with Badshahi Mosque archway backdrop.</td>
          </tr>
          <tr style="background-color: #fafafa;">
            <td style="padding: 5px 8px; border: 1px solid #e2e8f0; font-weight: 700; color: #0f172a;">Film 02 — Truck</td>
            <td style="padding: 5px 8px; border: 1px solid #e2e8f0;">Ibrahim Hyderi Fish Harbor</td>
            <td style="padding: 5px 8px; border: 1px solid #e2e8f0;">Karachi Port Jetty</td>
            <td style="padding: 5px 8px; border: 1px solid #e2e8f0;">KPT & Fishermen Coop • Marine Bay</td>
            <td style="padding: 5px 8px; border: 1px solid #e2e8f0;">Active maritime cargo wharf, ice crates, heavy commercial truck fleet.</td>
          </tr>
          <tr>
            <td style="padding: 5px 8px; border: 1px solid #e2e8f0; font-weight: 700; color: #0f172a;">Film 03 — Tractor</td>
            <td style="padding: 5px 8px; border: 1px solid #e2e8f0;">Kareem Block Agricultural Fields</td>
            <td style="padding: 5px 8px; border: 1px solid #e2e8f0;">Lahore Suburbs</td>
            <td style="padding: 5px 8px; border: 1px solid #e2e8f0;">Landowners & District Admin</td>
            <td style="padding: 5px 8px; border: 1px solid #e2e8f0;">Lush golden wheat harvest corridor, decorated baraat tractor trolleys.</td>
          </tr>
          <tr style="background-color: #fafafa;">
            <td style="padding: 5px 8px; border: 1px solid #e2e8f0; font-weight: 700; color: #0f172a;">Film 04 — Bike</td>
            <td style="padding: 5px 8px; border: 1px solid #e2e8f0;">Packages Mall Promenade / Walton</td>
            <td style="padding: 5px 8px; border: 1px solid #e2e8f0;">Lahore Central</td>
            <td style="padding: 5px 8px; border: 1px solid #e2e8f0;">Mall Security & Operations Directorate</td>
            <td style="padding: 5px 8px; border: 1px solid #e2e8f0;">Morning corporate rush hour boulevard, contemporary architectural glass facade.</td>
          </tr>
          <tr>
            <td style="padding: 5px 8px; border: 1px solid #e2e8f0; font-weight: 700; color: #0f172a;">Film 05 — UPS / Home</td>
            <td style="padding: 5px 8px; border: 1px solid #e2e8f0;">Fakir Khana Museum Haveli</td>
            <td style="padding: 5px 8px; border: 1px solid #e2e8f0;">Old Lahore (Bhati Gate)</td>
            <td style="padding: 5px 8px; border: 1px solid #e2e8f0;">Fakir Khana Trust & Heritage Directorate</td>
            <td style="padding: 5px 8px; border: 1px solid #e2e8f0;">Historic courtyard decorated for wedding, sudden blackout to full illumination.</td>
          </tr>
          <tr style="background-color: #fafafa;">
            <td style="padding: 5px 8px; border: 1px solid #e2e8f0; font-weight: 700; color: #0f172a;">CGI / Technical Lab</td>
            <td style="padding: 5px 8px; border: 1px solid #e2e8f0;">Evernew Studios Soundstage</td>
            <td style="padding: 5px 8px; border: 1px solid #e2e8f0;">Multan Road, Lahore</td>
            <td style="padding: 5px 8px; border: 1px solid #e2e8f0;">Evernew Studios Management Lease</td>
            <td style="padding: 5px 8px; border: 1px solid #e2e8f0;">Controlled soundstage cyclorama, high-speed Phantom macro spark and graphite battery cutaway rig.</td>
          </tr>
        </tbody>
      </table>
    `;
    appendElementWithPagination(locationsBlock);

    // -------------------------------------------------------------
    // SECTION 09: CELEBRITY TALENT AGREEMENT & SIGN-OFF
    // -------------------------------------------------------------
    const talentHeader = document.createElement('div');
    talentHeader.style.marginBottom = '10px';
    talentHeader.style.marginTop = '8px';
    talentHeader.style.backgroundColor = '#18181b';
    talentHeader.style.borderRadius = '8px';
    talentHeader.style.padding = '8px 14px';
    talentHeader.style.borderLeft = '4px solid #c69a53';
    talentHeader.style.display = 'flex';
    talentHeader.style.justifyContent = 'space-between';
    talentHeader.style.alignItems = 'center';
    talentHeader.innerHTML = `
      <div>
        <div style="font-size: 8px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.12em; color: #c69a53;">
          SECTION 09 • CELEBRITY TALENT & LIKENESS AGREEMENT
        </div>
        <div style="font-size: 12.5px; font-weight: 800; color: #ffffff; letter-spacing: -0.01em; margin-top: 1px;">
          Executed Agreement & Executive Authorization
        </div>
      </div>
      <div style="font-size: 8.5px; color: #a1a1aa; font-weight: 600;">
        Iftikhar Thakur • Category Exclusivity Secured
      </div>
    `;
    appendElementWithPagination(talentHeader, true);

    const contractBlock = document.createElement('div');
    contractBlock.style.marginBottom = '10px';
    contractBlock.style.border = '1px solid #e2e8f0';
    contractBlock.style.borderRadius = '8px';
    contractBlock.style.padding = '10px 12px';
    contractBlock.style.backgroundColor = '#ffffff';
    contractBlock.innerHTML = `
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
        <div style="background-color: #faf8f5; border: 1px solid #f1ece4; border-radius: 6px; padding: 8px;">
          <div style="font-size: 9px; font-weight: 800; text-transform: uppercase; color: #b8860b; margin-bottom: 4px;">Principal Artist Representation</div>
          <div style="font-size: 8.5px; line-height: 1.4; color: #334155;">
            <strong>Artist Name:</strong> Mr. Iftikhar Ahmad Sheikh (p/k/a Iftikhar Thakur)<br/>
            <strong>Campaign Role:</strong> Brand Ambassador & Character Variants<br/>
            <strong>Exclusivity:</strong> Exclusive to Alaska Batteries across all battery categories for Pakistan & GCC territories.
          </div>
        </div>
        <div style="background-color: #faf8f5; border: 1px solid #f1ece4; border-radius: 6px; padding: 8px;">
          <div style="font-size: 9px; font-weight: 800; text-transform: uppercase; color: #b8860b; margin-bottom: 4px;">Production Scope & Media Rights</div>
          <div style="font-size: 8.5px; line-height: 1.4; color: #334155;">
            <strong>Shooting Schedule:</strong> 5 Commercial Films + Stills + BTS Digital Assets<br/>
            <strong>Media Term:</strong> 2 Years (2026–2028) All-Media Pakistan & GCC Commercial Rights<br/>
            <strong>Status:</strong> Executed & Confirmed for March 2026 Production Window.
          </div>
        </div>
      </div>
    `;
    appendElementWithPagination(contractBlock);

    // Executive Sign-off Box
    const signoffBox = document.createElement('div');
    signoffBox.style.marginTop = '10px';
    signoffBox.style.paddingTop = '10px';
    signoffBox.style.borderTop = '1.5px dashed #cbd5e1';
    signoffBox.style.display = 'flex';
    signoffBox.style.justifyContent = 'space-between';
    signoffBox.style.alignItems = 'flex-end';
    signoffBox.innerHTML = `
      <div>
        <div style="font-size: 11px; font-weight: 800; color: #0f172a;">Nasharz Films Confidential Presentation</div>
        <div style="font-size: 10px; font-weight: 700; color: #b8860b; margin-top: 1px;">
          Prepared By: <span style="color: #0f172a;">Aatif Rasheed</span> • Producer / Director
        </div>
        <div style="font-size: 8.5px; color: #64748b; margin-top: 2px;">Proprietary production lookbook prepared strictly for Alaska Batteries.</div>
      </div>
      <div style="text-align: right; display: flex; flex-direction: column; align-items: flex-end;">
        <div style="font-size: 8px; text-transform: uppercase; letter-spacing: 0.08em; color: #b8860b; font-weight: 700; margin-bottom: 2px;">Executive Authorization</div>
        <img src="${imageMetaMap.get(branding.sealStamp)?.dataUrl || branding.sealStamp}" style="height: 55px; width: auto; object-fit: contain;" alt="Official Stamp" />
      </div>
    `;
    appendElementWithPagination(signoffBox);

    // Update Footers with actual total page count
    const totalPages = pages.length;
    pages.forEach((p, idx) => {
      p.footerArea.innerHTML = `
        <span>Nasharz Films • Confidential</span>
        <span>Alaska Batteries 2026 Campaign • Art & Talent Lookbook</span>
        <span style="font-weight: 700; color: #b8860b;">Page ${idx + 1} of ${totalPages}</span>
      `;
    });

    try {
      if (document.fonts) await document.fonts.ready;
      await preloadImages(sandbox);

      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });
      for (let i = 0; i < pages.length; i++) {
        const pageEl = pages[i].pageEl;
        const canvas = await html2canvas(pageEl, {
          scale: 1.5,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          logging: false
        });
        if (i > 0) pdf.addPage('a4', 'portrait');
        pdf.addImage(canvas.toDataURL('image/jpeg', 0.92), 'JPEG', 0, 0, 210, 297);
      }

      pdf.save(`Nasharz_Alaska_Chapter07_Art_and_Talent.pdf`);
      return;
    } catch (err) {
      console.error('Error generating Art & Talent PDF:', err);
      window.print();
      return;
    } finally {
      document.body.removeChild(sandbox);
    }

  } else {
    // -------------------------------------------------------------
    // STANDARD CHAPTER MULTI-PAGE FLOW
    // -------------------------------------------------------------
    let currentPage = createNewPage(0);
    let currentHeight = 0;
    let maxContentHeight = 720;

    // Parse all text into atomic block elements (using pdfFullText if provided, automatically transliterated to Roman Urdu)
    const textToRender = chapter.pdfFullText || chapter.fullText;
    const blocks = parseTextToBlocks(textToRender);

    // Distribute blocks cleanly across discrete pages with intelligent section grouping
    for (let bIdx = 0; bIdx < blocks.length; bIdx++) {
      const block = blocks[bIdx];
      const blockHeight = measureElementHeight(block);

      // 1. Major Route Header: If we already have substantial content on the page, start a fresh page so the whole route starts at the top
      if (block.dataset.isRouteHeader === 'true' && currentHeight > 100) {
        currentPage = createNewPage(pages.length);
        currentHeight = 0;
        maxContentHeight = 920;
      }

      // 2. Standalone Concept Heading (e.g. Concept 1A when after a full script):
      // Only break if the page already has significant content (currentHeight > 380) so it never breaks right below a Route Header
      if (block.dataset.isConceptHeading === 'true' && currentHeight > 380) {
        currentPage = createNewPage(pages.length);
        currentHeight = 0;
        maxContentHeight = 920;
      }

      // 3. If standard content overflow occurs
      if (currentHeight + blockHeight > maxContentHeight && currentHeight > 0) {
        currentPage = createNewPage(pages.length);
        currentHeight = 0;
        maxContentHeight = 920;
      }

      currentPage.contentArea.appendChild(block);
      currentHeight += blockHeight;

      // 4. If this was a separation line marking the end of a concept / route, push subsequent content to the next page
      if (block.dataset.pageBreakAfter === 'true' && bIdx < blocks.length - 1) {
        // Lookahead: only break if there is actually more meaningful content after this separator
        const remainingBlocks = blocks.slice(bIdx + 1);
        const hasSubsequentContent = remainingBlocks.some(b => (b.textContent || '').trim().length > 0);
        if (hasSubsequentContent) {
          currentPage = createNewPage(pages.length);
          currentHeight = 0;
          maxContentHeight = 920;
        }
      }
    }

    // Gallery Images (if present e.g. for Art & Talent)
    if (chapter.galleryImages && chapter.galleryImages.length > 0) {
      const loadImageDimensions = (url: string): Promise<{ width: number; height: number; aspect: number }> => {
        return new Promise((resolve) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => {
            const w = img.naturalWidth || 1200;
            const h = img.naturalHeight || 900;
            resolve({ width: w, height: h, aspect: w / h });
          };
          img.onerror = () => {
            resolve({ width: 1200, height: 900, aspect: 1200 / 900 });
          };
          img.src = url;
        });
      };

      for (let gIdx = 0; gIdx < chapter.galleryImages.length; gIdx++) {
        const img = chapter.galleryImages[gIdx];
        const dims = await loadImageDimensions(img.url);

        const availableHeight = 420;
        const targetWidth = 690;
        let finalWidth = targetWidth;
        let finalHeight = Math.round(targetWidth / dims.aspect);

        if (finalHeight > availableHeight) {
          finalHeight = availableHeight;
          finalWidth = Math.round(availableHeight * dims.aspect);
        }

        const badgeLabel = 'Concept Artwork';

        const imgCard = document.createElement('div');
        imgCard.style.marginTop = '14px';
        imgCard.style.marginBottom = '14px';
        imgCard.style.border = '1px solid #e2e8f0';
        imgCard.style.borderRadius = '12px';
        imgCard.style.overflow = 'hidden';
        imgCard.style.backgroundColor = '#ffffff';
        imgCard.style.boxShadow = '0 1px 4px rgba(0,0,0,0.03)';
        imgCard.innerHTML = `
          <div style="width: 100%; background: #f8fafc; display: flex; align-items: center; justify-content: center; padding: 10px 0; border-bottom: 1px solid #f1f5f9;">
            <img 
              src="${img.url}" 
              width="${finalWidth}"
              height="${finalHeight}"
              style="width: ${finalWidth}px; height: ${finalHeight}px; max-width: 100%; border-radius: 8px; display: block; margin: 0 auto;" 
              crossorigin="anonymous" 
            />
          </div>
          <div style="padding: 10px 16px; background: #ffffff; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 12px; font-weight: 700; color: #0f172a; letter-spacing: -0.01em;">${urduToRomanUrdu(img.title)}</span>
            <span style="font-size: 9px; font-weight: 600; color: #b8860b; text-transform: uppercase; letter-spacing: 0.06em; background: #fdf8ed; border: 1px solid #fae8c8; padding: 3px 9px; border-radius: 9999px;">${badgeLabel}</span>
          </div>
        `;

        const imgHeight = measureElementHeight(imgCard);
        if (currentHeight + imgHeight > maxContentHeight && currentHeight > 0) {
          currentPage = createNewPage(pages.length);
          currentHeight = 0;
          maxContentHeight = 920;
        }

        currentPage.contentArea.appendChild(imgCard);
        currentHeight += imgHeight;
      }
    }

    // Key Deliverables Card (if present)
    if (romanKeyPoints && romanKeyPoints.length > 0) {
      const delivCard = document.createElement('div');
      delivCard.style.marginTop = '14px';
      delivCard.style.marginBottom = '10px';
      delivCard.style.backgroundColor = '#f8fafc';
      delivCard.style.border = '1.5px solid #e2e8f0';
      delivCard.style.borderRadius = '10px';
      delivCard.style.padding = '12px 16px';

      delivCard.innerHTML = `
        <div style="font-size: 12.5px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em; color: #0f172a; margin-bottom: 8px; display: flex; align-items: center; gap: 7px;">
          <span style="color: #c69a53; font-size: 14px;">✦</span> Key Campaign Deliverables
        </div>
        <div style="display: grid; grid-template-columns: 1fr; gap: 6px;">
          ${romanKeyPoints
            .map(
              kp => `
            <div style="font-size: 12.5px; color: #334155; display: flex; align-items: flex-start; gap: 7px; line-height: 1.5;">
              <span style="color: #c69a53; font-weight: 700; font-size: 14px;">•</span>
              <span>${kp}</span>
            </div>
          `
            )
            .join('')}
        </div>
      `;

      const delivHeight = measureElementHeight(delivCard);
      if (currentHeight + delivHeight > maxContentHeight && currentHeight > 0) {
        currentPage = createNewPage(pages.length);
        currentHeight = 0;
        maxContentHeight = 920;
      }

      currentPage.contentArea.appendChild(delivCard);
      currentHeight += delivHeight;
    }

    // Executive Stamp & Sign-off Box placed immediately after the last content line
    const signoffBox = document.createElement('div');
    signoffBox.style.marginTop = '20px';
    signoffBox.style.paddingTop = '14px';
    signoffBox.style.marginBottom = '6px';
    signoffBox.style.borderTop = '1.5px dashed #cbd5e1';
    signoffBox.style.display = 'flex';
    signoffBox.style.justifyContent = 'space-between';
    signoffBox.style.alignItems = 'flex-end';

    signoffBox.innerHTML = `
      <div>
        <div style="font-size: 12px; font-weight: 800; color: #0f172a;">Nasharz Films Confidential Presentation</div>
        <div style="font-size: 11px; font-weight: 700; color: #b8860b; margin-top: 3px;">
          Prepared By: <span style="color: #0f172a;">Aatif Rasheed</span> • Producer / Director
        </div>
        <div style="font-size: 10px; color: #64748b; margin-top: 2px;">Produced by Nasharz Films for Alaska Batteries</div>
        <div style="font-size: 9.5px; color: #94a3b8; margin-top: 2px;">Proprietary campaign strategy prepared strictly for Alaska Batteries executive review.</div>
      </div>
      <div style="text-align: right; display: flex; flex-direction: column; align-items: flex-end;">
        <div style="font-size: 9.5px; text-transform: uppercase; letter-spacing: 0.08em; color: #b8860b; font-weight: 700; margin-bottom: 4px;">Executive Authorization</div>
        <img src="${branding.sealStamp}" style="height: 64px; width: auto; object-fit: contain; filter: contrast(1.05);" alt="Official Stamp" />
      </div>
    `;

    const signoffHeight = measureElementHeight(signoffBox);
    if (currentHeight + signoffHeight > maxContentHeight && currentHeight > 0) {
      currentPage = createNewPage(pages.length);
      currentHeight = 0;
      maxContentHeight = 920;
    }

    currentPage.contentArea.appendChild(signoffBox);
  }

  // Update all page footers with accurate total page count
  const totalPages = pages.length;
  pages.forEach((p, idx) => {
    p.footerArea.innerHTML = `
      <span>Nasharz Films • Confidential</span>
      <span>Alaska Batteries 2026 Campaign</span>
      <span style="font-weight: 700; color: #b8860b;">Page ${idx + 1} of ${totalPages}</span>
    `;
  });

  try {
    if (document.fonts) {
      await document.fonts.ready;
    }
    // Wait for all images in the document to be fully loaded
    await preloadImages(sandbox);

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    for (let i = 0; i < pages.length; i++) {
      const pageEl = pages[i].pageEl;
      const canvas = await html2canvas(pageEl, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      if (i > 0) {
        pdf.addPage('a4', 'portrait');
      }
      pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);
    }

    pdf.save(`Nasharz_Alaska_Batteries_Chapter_${chapter.number}_${chapter.id}.pdf`);
  } catch (err) {
    console.error('Error generating clean PDF:', err);
    window.print();
  } finally {
    document.body.removeChild(sandbox);
  }
}

export async function generateEstimatePDF(
  estimates: EstimateItem[],
  branding: BrandingConfig,
  clientName: string = 'Client',
  options?: {
    days?: number;
    locationsPerDay?: number;
    studioShots?: boolean;
    clientAddress?: string;
    clientNTN?: string;
    whtRate?: number;
    srbRate?: number;
    estimateNumber?: string;
  }
) {
  // Master sandbox configured with crisp high-DPI font smoothing
  const sandbox = document.createElement('div');
  sandbox.style.position = 'fixed';
  sandbox.style.left = '-9999px';
  sandbox.style.top = '0';
  sandbox.style.width = '794px';
  sandbox.style.zIndex = '-9999';
  sandbox.style.fontFamily = "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro Display', 'Helvetica Neue', Helvetica, Arial, sans-serif";
  sandbox.style.setProperty('-webkit-font-smoothing', 'antialiased');
  sandbox.style.color = '#000000';
  document.body.appendChild(sandbox);

  const whtRate = options?.whtRate !== undefined ? options.whtRate : 0;
  const srbRate = options?.srbRate !== undefined ? options.srbRate : 0;
  const clientAddr = options?.clientAddress || 'Alaska Battery. 7th Floor, B-3 Tower, Jinnah Avenue, New Blue Area, Islamabad';
  const clientNTN = options?.clientNTN || '';
  const estimateNo = options?.estimateNumber || 'NCW/EST/555/2026';

  // Financial summary calculations
  const hardCosts = estimates
    .filter((e) => e.included && !e.isLeadTalent && typeof e.amount === 'number')
    .reduce((acc, item) => acc + (item.amount || 0), 0);

  const subtotalWithoutTax = hardCosts;
  const wht = Math.round(subtotalWithoutTax * (whtRate / 100));
  const sst = Math.round(subtotalWithoutTax * (srbRate / 100));
  const grandTotal = subtotalWithoutTax + wht + sst;

  const dateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  const renderItemRow = (item: EstimateItem, isEven: boolean) => `
    <tr style="border-bottom: 1px solid #f1f5f9; background-color: ${isEven ? '#ffffff' : '#fafafa'}; font-size: 9.5px; -webkit-font-smoothing: antialiased;">
      <td style="padding: 5px 6px; font-weight: 500; color: #1e293b;">
        ${urduToRomanUrdu(item.description)}
      </td>
      <td style="padding: 5px 6px; text-align: center; color: #64748b; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, monospace;">${item.rate || '—'}</td>
      <td style="padding: 5px 6px; text-align: center; color: #64748b; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, monospace;">${item.units !== undefined ? item.units : 1}</td>
      <td style="padding: 5px 6px; text-align: center; color: #64748b; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, monospace;">${item.days !== undefined ? item.days : '—'}</td>
      <td style="padding: 5px 6px; text-align: right; font-weight: 600; color: #0f172a; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, monospace;">
        ${item.isAtActual ? 'At Actual' : `PKR ${(item.amount || 0).toLocaleString()}`}
      </td>
    </tr>
  `;

  const renderCategoryBlock = (catName: string, itemsList: EstimateItem[]) => {
    if (itemsList.length === 0) return '';
    return `
      <tr style="background-color: #ffffff;">
        <td colspan="5" style="padding: 9px 6px 4px 6px; font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: #94a3b8;">
          ${catName}
        </td>
      </tr>
      ${itemsList.map((item, idx) => renderItemRow(item, idx % 2 === 0)).join('')}
    `;
  };

  const getItemsFor = (catName: string) => estimates.filter((i) => i.category === catName && i.included);

  const tableHeader = `
    <thead>
      <tr style="border-bottom: 1.5px solid #cbd5e1; font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.06em;">
        <th style="padding: 6px 6px; text-align: left; width: 45%;">DESCRIPTION</th>
        <th style="padding: 6px 6px; text-align: center; width: 14%;">RATE (PKR)</th>
        <th style="padding: 6px 6px; text-align: center; width: 11%;">UNITS</th>
        <th style="padding: 6px 6px; text-align: center; width: 11%;">DAYS</th>
        <th style="padding: 6px 6px; text-align: right; width: 19%;">AMOUNT (PKR)</th>
      </tr>
    </thead>
  `;

  const TOTAL_PAGES = 4;

  const makePage = (contentHtml: string, pageNum: number, isFirstPage: boolean = false) => {
    const pageEl = document.createElement('div');
    pageEl.style.width = '794px';
    pageEl.style.height = '1123px';
    pageEl.style.boxSizing = 'border-box';
    pageEl.style.padding = '36px 44px 28px 44px';
    pageEl.style.backgroundColor = '#ffffff';
    pageEl.style.display = 'flex';
    pageEl.style.flexDirection = 'column';
    pageEl.style.justifyContent = 'space-between';
    pageEl.style.position = 'relative';
    pageEl.style.overflow = 'hidden';
    pageEl.style.setProperty('-webkit-font-smoothing', 'antialiased');

    const runningHeader = isFirstPage
      ? `
        <div style="margin-bottom: 12px;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <img src="${branding.nasharzIcon}" style="height: 38px; width: auto; object-fit: contain;" alt="Nasharz Films" />
              <div>
                <div style="font-size: 14px; font-weight: 700; letter-spacing: 0.04em; color: #000000; text-transform: uppercase;">NASHARZ FILMS</div>
                <div style="font-size: 8.5px; color: #64748b;">Creative Production House</div>
                <div style="font-size: 8px; color: #64748b;">nasharz@gmail.com</div>
                <div style="font-size: 8px; color: #64748b;">www.nasharzfilms.com</div>
              </div>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 22px; font-weight: 700; letter-spacing: 0.02em; color: #000000;">ESTIMATE</div>
              <div style="font-size: 9px; font-weight: 700; color: #0f172a; margin-top: 1px;">NTN# 2403251-4 | SRB# S2403251-4</div>
            </div>
          </div>

          <div style="border-top: 1.5px solid #000000; padding-top: 10px; margin-bottom: 12px; display: grid; grid-template-columns: 1.3fr 0.7fr; gap: 20px; font-size: 8.5px;">
            <div>
              <div style="color: #64748b; font-weight: 600; text-transform: uppercase; font-size: 8px; margin-bottom: 1px;">ESTIMATE NO.</div>
              <div style="font-weight: 800; color: #000000; font-size: 10.5px; margin-bottom: 8px; font-family: ui-monospace, SFMono-Regular, monospace;">${estimateNo}</div>

              <div style="color: #64748b; font-weight: 600; text-transform: uppercase; font-size: 8px; margin-bottom: 1px;">PREPARED FOR</div>
              <div style="font-weight: 700; color: #000000; font-size: 9px; line-height: 1.35; margin-bottom: 2px;">${clientAddr}</div>
              <div style="color: #0f172a; font-weight: 700; font-size: 9px; margin-top: 2px;">CLIENT NTN: <span style="font-family: ui-monospace, SFMono-Regular, monospace; font-weight: 800; color: #000000;">${clientNTN || '—'}</span></div>
            </div>

            <div style="text-align: right;">
              <div style="color: #64748b; font-weight: 600; text-transform: uppercase; font-size: 8px; margin-bottom: 1px;">DATE</div>
              <div style="font-weight: 700; color: #000000; font-size: 9.5px; margin-bottom: 8px;">${dateStr}</div>

              <div style="color: #64748b; font-weight: 600; text-transform: uppercase; font-size: 8px; margin-bottom: 1px;">PREPARED BY</div>
              <div style="font-weight: 700; color: #000000; font-size: 9px;">Aatif Rasheed</div>
              <div style="color: #64748b; font-size: 8px;">Producer / Director / NASHARZ FILMS</div>
              <div style="color: #64748b; font-size: 8px;">nasharz@gmail.com</div>
            </div>
          </div>
        </div>
      `
      : `
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; margin-bottom: 10px; font-size: 8px; color: #64748b;">
          <span>${dateStr} • ${estimateNo}</span>
          <span style="font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #0f172a;">ESTIMATE — Alaska Battery Campaign</span>
        </div>
      `;

    pageEl.innerHTML = `
      <div>
        ${runningHeader}
        ${contentHtml}
      </div>

      <div style="border-top: 1px solid #f1f5f9; padding-top: 6px; display: flex; justify-content: space-between; align-items: center; font-size: 8px; color: #94a3b8;">
        <span>Nasharz Films • Confidential</span>
        <span>Alaska Batteries Campaign Estimate</span>
        <span style="font-weight: 600; color: #0f172a;">Page ${pageNum} of ${TOTAL_PAGES}</span>
      </div>
    `;

    sandbox.appendChild(pageEl);
    return pageEl;
  };

  // PAGE 1 HTML: Pre-Production, Talent, Director, Studio & Location, Art Direction
  const p1Content = `
    <table style="width: 100%; border-collapse: collapse;">
      ${tableHeader}
      <tbody>
        ${renderCategoryBlock('PRE-PRODUCTION', getItemsFor('PRE-PRODUCTION'))}
        ${renderCategoryBlock('TALENT', getItemsFor('TALENT'))}
        ${renderCategoryBlock('DIRECTOR', getItemsFor('DIRECTOR'))}
        ${renderCategoryBlock('STUDIO & LOCATION', getItemsFor('STUDIO & LOCATION'))}
        ${renderCategoryBlock('ART DIRECTION', getItemsFor('ART DIRECTION'))}
      </tbody>
    </table>
  `;
  const p1El = makePage(p1Content, 1, true);

  // PAGE 2 HTML: Camera & Lights, Make-up & Styling, Production Team
  const p2Content = `
    <table style="width: 100%; border-collapse: collapse;">
      ${tableHeader}
      <tbody>
        ${renderCategoryBlock('CAMERA, LIGHTS & EQUIPMENT', getItemsFor('CAMERA, LIGHTS & EQUIPMENT'))}
        ${renderCategoryBlock('MAKE UP & STYLING', getItemsFor('MAKE UP & STYLING'))}
        ${renderCategoryBlock('PRODUCTION TEAM', getItemsFor('PRODUCTION TEAM'))}
      </tbody>
    </table>
  `;
  const p2El = makePage(p2Content, 2, false);

  // PAGE 3 HTML: Food & Catering, Transport, Post-Production
  const p3Content = `
    <table style="width: 100%; border-collapse: collapse;">
      ${tableHeader}
      <tbody>
        ${renderCategoryBlock('FOOD & CATERING', getItemsFor('FOOD & CATERING'))}
        ${renderCategoryBlock('TRANSPORT', getItemsFor('TRANSPORT'))}
        ${renderCategoryBlock('POST-PRODUCTION', getItemsFor('POST-PRODUCTION'))}
      </tbody>
    </table>
  `;
  const p3El = makePage(p3Content, 3, false);

  // PAGE 4 HTML: Totals Block + Terms & Conditions + Stamp directly at the end of content
  const p4Content = `
    <!-- TOTALS BLOCK -->
    <div style="border: 1.5px solid #0f172a; border-radius: 6px; padding: 12px 16px; margin-bottom: 12px; background-color: #fafafa;">
      <div style="display: flex; justify-content: space-between; font-size: 10.5px; font-weight: 700; color: #000000; margin-bottom: 5px;">
        <span>HARD COSTS TOTAL (SUBTOTAL WITHOUT TAX)</span>
        <span style="font-family: ui-monospace, SFMono-Regular, monospace; font-weight: 800;">PKR ${hardCosts.toLocaleString()}</span>
      </div>

      <div style="display: flex; justify-content: space-between; font-size: 9px; color: #64748b; margin-bottom: 3px;">
        <span>+ WHT @ ${whtRate}%</span>
        <span style="font-family: ui-monospace, SFMono-Regular, monospace;">${whtRate > 0 ? `PKR ${wht.toLocaleString()}` : 'PKR 0 (Not Added)'}</span>
      </div>

      <div style="display: flex; justify-content: space-between; font-size: 9px; color: #64748b; margin-bottom: 5px;">
        <span>+ SRB @ ${srbRate}%</span>
        <span style="font-family: ui-monospace, SFMono-Regular, monospace;">${srbRate > 0 ? `PKR ${sst.toLocaleString()}` : 'PKR 0 (Not Added)'}</span>
      </div>

      <div style="display: flex; justify-content: space-between; font-size: 11.5px; font-weight: 800; color: #000000; border-top: 1.5px solid #000000; padding-top: 8px; margin-bottom: 4px;">
        <span>GRAND TOTAL (PKR) — ${whtRate === 0 && srbRate === 0 ? 'EXCL. TAXES' : 'INCL. APPLIED TAXES'}</span>
        <span style="font-family: ui-monospace, SFMono-Regular, monospace;">PKR ${grandTotal.toLocaleString()}</span>
      </div>

      <div style="font-size: 7.5px; color: #64748b; font-style: italic;">
        * All Applicable Taxes (GST, WHT, SRB etc.) Payable by Client. Challan receipts of WHT and SRB shall be required.
      </div>
    </div>

    <!-- P.S. CELEBRITY NOTICE & REFERENCE DISCLAIMER -->
    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px 12px; margin-bottom: 12px; font-size: 8px; line-height: 1.45; color: #334155;">
      <div style="margin-bottom: 4px;">
        <strong style="color: #0f172a; text-transform: uppercase;">P.S. Notice:</strong> Celebrity / Known Talent costs (remuneration, personal styling/glam crew, travel, lodging, per diem, and rider expenses) are strictly <u>EXCLUDED</u> from this cost estimate and will be billed separately at actuals based on confirmed talent selection.
      </div>
      <div>
        <strong style="color: #0f172a; text-transform: uppercase;">Reference Disclaimer:</strong> This cost estimate is generated for your reference only and Nasharz Films (PH) reserves all rights to refuse, revise, or adjust final confirmation subject to schedule, script modifications, or operational requirements.
      </div>
    </div>

    <!-- TERMS & CONDITIONS (2-column layout to fit cleanly) -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; font-size: 7.5px; color: #334155; line-height: 1.4; margin-bottom: 12px;">
      <div>
        <div style="margin-bottom: 6px;">
          <div style="font-weight: 700; text-transform: uppercase; color: #000000; margin-bottom: 2px;">TERMS & CONDITIONS</div>
          <div>1. All Prices are quoted by "Nasharz Films".</div>
          <div>2. Above estimated quote has been meticulously crafted with the project requirements in mind.</div>
          <div>3. PH reserves the right to modify, combine, or enhance any project-specific details as needed.</div>
        </div>

        <div style="margin-bottom: 6px;">
          <div style="font-weight: 700; text-transform: uppercase; color: #000000; margin-bottom: 2px;">PAYMENT TERMS</div>
          <div>1. 75% to be paid as advance at least 7 days prior to shooting date.</div>
          <div>2. 25% payment to be paid at the 1st cut.</div>
          <div>3. Challan receipts of WHT and SRB shall be required.</div>
        </div>

        <div>
          <div style="font-weight: 700; text-transform: uppercase; color: #000000; margin-bottom: 2px;">PROJECT CANCELLATION & DELAYS</div>
          <div>1. 50% of total fee incurred in case of cancellation post-confirmation.</div>
          <div>2. Weather or force majeure reschedule costs will be client's responsibility.</div>
        </div>
      </div>

      <div>
        <div style="margin-bottom: 6px;">
          <div style="font-weight: 700; text-transform: uppercase; color: #000000; margin-bottom: 2px;">CREATIVE & PRODUCTION</div>
          <div>1. Brand artwork and sung lines provided by agency prior to shoot.</div>
          <div>2. Quote does not include release material or music adapts.</div>
          <div>3. Quote includes up to 1 creative revision cycle only.</div>
          <div>4. Photography is billed separately at actuals.</div>
        </div>

        <div>
          <div style="font-weight: 700; text-transform: uppercase; color: #000000; margin-bottom: 2px;">TALENT & TRAVEL NOTICE</div>
          <div>1. Celebrity talent fees charged at actual usage.</div>
          <div>2. Travel, stay, and per diem for celebrity not included.</div>
          <div>3. Travel/lodging expenses for client/agency billed separately.</div>
        </div>
      </div>
    </div>

    <!-- OFFICIAL AUTHORIZATION & SEAL (Placed directly at the end of content) -->
    <div style="border-top: 1px solid #cbd5e1; padding-top: 10px; display: flex; justify-content: space-between; align-items: flex-end;">
      <div>
        <div style="position: relative; margin-bottom: 4px;">
          <img src="${branding.sealStamp}" style="height: 68px; width: auto; object-fit: contain;" alt="Official Stamp" />
        </div>
        <div style="font-size: 10.5px; font-weight: 700; color: #000000;">Aatif Rasheed</div>
        <div style="font-size: 8.5px; color: #64748b; font-weight: 500;">Authorised Signatory • NASHARZ FILMS</div>
      </div>

      <div style="text-align: right; font-size: 8px; color: #64748b; line-height: 1.45;">
        <div style="font-weight: 700; color: #000000; font-size: 8.5px;">NASHARZ FILMS</div>
        <div>nasharz@gmail.com • www.nasharzfilms.com</div>
        <div>Official Sealed & Approved Production Estimate</div>
      </div>
    </div>
  `;
  const p4El = makePage(p4Content, 4, false);

  const pageEls = [p1El, p2El, p3El, p4El];

  try {
    if (document.fonts) {
      await document.fonts.ready;
    }
    await preloadImages(sandbox);

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    for (let i = 0; i < pageEls.length; i++) {
      const page = pageEls[i];
      // Use scale: 3 for ultra-sharp crisp text rendering
      const canvas = await html2canvas(page, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      if (i > 0) {
        pdf.addPage('a4', 'portrait');
      }
      pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);
    }

    const cleanNumber = estimateNo.replace(/[^a-zA-Z0-9]/g, '_');
    pdf.save(`Nasharz_Films_Estimate_${cleanNumber}.pdf`);
  } catch (err) {
    console.error('Error generating official Estimate PDF:', err);
    window.print();
  } finally {
    document.body.removeChild(sandbox);
  }
}


