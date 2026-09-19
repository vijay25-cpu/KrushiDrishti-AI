export interface CropOption {
  id: string;
  nameEn: string;
  nameMr: string;
  nameHi: string;
  scientific: string;
}

export const CROP_OPTIONS: CropOption[] = [
  { id: 'auto', nameEn: 'Auto-Detect Crop (Any Plant)', nameMr: 'स्वयंचलित पीक ओळख (कोणतेही पीक)', nameHi: 'स्वचालित फसल पहचान (कोई भी पौधा)', scientific: '' },
  { id: 'tomato', nameEn: 'Tomato', nameMr: 'टोमॅटो', nameHi: 'टमाटर', scientific: 'Solanum lycopersicum' },
  { id: 'potato', nameEn: 'Potato', nameMr: 'बटाटा', nameHi: 'आलू', scientific: 'Solanum tuberosum' },
  { id: 'cotton', nameEn: 'Cotton', nameMr: 'कापूस', nameHi: 'कपास', scientific: 'Gossypium hirsutum' },
  { id: 'rice', nameEn: 'Rice / Paddy', nameMr: 'भात / तांदूळ', nameHi: 'चावल / धान', scientific: 'Oryza sativa' },
  { id: 'wheat', nameEn: 'Wheat', nameMr: 'गहू', nameHi: 'गेहूं', scientific: 'Triticum aestivum' },
  { id: 'grape', nameEn: 'Grape', nameMr: 'द्राक्ष', nameHi: 'अंगूर', scientific: 'Vitis vinifera' },
  { id: 'apple', nameEn: 'Apple', nameMr: 'सफरचंद', nameHi: 'सेब', scientific: 'Malus domestica' },
  { id: 'corn', nameEn: 'Corn / Maize', nameMr: 'मका', nameHi: 'मक्का', scientific: 'Zea mays' },
  { id: 'chilli', nameEn: 'Chilli / Pepper', nameMr: 'मिरची', nameHi: 'मिर्च', scientific: 'Capsicum annuum' },
  { id: 'onion', nameEn: 'Onion', nameMr: 'कांदा', nameHi: 'प्याज', scientific: 'Allium cepa' },
  { id: 'soybean', nameEn: 'Soybean', nameMr: 'सोयाबीन', nameHi: 'सोयाबीन', scientific: 'Glycine max' },
  { id: 'sugarcane', nameEn: 'Sugarcane', nameMr: 'ऊस', nameHi: 'गन्ना', scientific: 'Saccharum officinarum' },
];

export function formatLocalizedPlantName(plantName: string, lang: 'en' | 'mr' | 'hi' = 'en'): string {
  if (!plantName) return 'Unknown';
  if (plantName.toLowerCase() === 'unknown') {
    if (lang === 'mr') return 'अज्ञात पीक (Unknown)';
    if (lang === 'hi') return 'अज्ञात फसल (Unknown)';
    return 'Unknown Plant';
  }

  const match = CROP_OPTIONS.find(
    c => c.id !== 'auto' && (
      c.nameEn.toLowerCase() === plantName.toLowerCase() ||
      plantName.toLowerCase().includes(c.nameEn.toLowerCase()) ||
      c.scientific.toLowerCase() === plantName.toLowerCase()
    )
  );

  if (!match) return plantName;

  if (lang === 'mr') {
    return `${match.nameMr} (${match.nameEn})`;
  }
  if (lang === 'hi') {
    return `${match.nameHi} (${match.nameEn})`;
  }
  return match.nameEn;
}
