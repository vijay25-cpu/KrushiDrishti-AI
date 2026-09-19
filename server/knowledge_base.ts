/**
 * KRUSHIDRISHTI AI — Verified Agricultural Knowledge Base
 * Developed by Sopan Pandit Gavali
 * 
 * Verified agronomic repository covering crop species, common pathogens,
 * symptoms, etiology, IPM strategies, cultural controls, organic methods,
 * safe chemical guidance with mandatory safety intervals, and scientific sources.
 */

export interface VerifiedTreatment {
  type: 'cultural' | 'biological' | 'chemical' | 'preventive';
  title: { en: string; mr: string; hi: string };
  description: { en: string; mr: string; hi: string };
  safetyPrecautions: { en: string; mr: string; hi: string };
  dosage?: string;
  phiDays?: number; // Pre-harvest interval
}

export interface VerifiedDiseaseRecord {
  id: string;
  name: { en: string; mr: string; hi: string };
  scientificName: string;
  cropId: string;
  cropName: { en: string; mr: string; hi: string };
  pathogenType: 'Fungal' | 'Bacterial' | 'Viral' | 'Oomycete' | 'Physiological' | 'Pest-induced';
  symptoms: { en: string[]; mr: string[]; hi: string[] };
  causes: { en: string[]; mr: string[]; hi: string[] };
  favorableConditions: { en: string; mr: string; hi: string };
  prevention: { en: string[]; mr: string[]; hi: string[] };
  culturalPractices: { en: string[]; mr: string[]; hi: string[] };
  ipmStrategy: { en: string; mr: string; hi: string };
  treatments: VerifiedTreatment[];
  safetyWarnings: { en: string; mr: string; hi: string };
  source: string;
  lastReviewedDate: string;
}

export interface VerifiedCropRecord {
  id: string;
  commonName: { en: string; mr: string; hi: string };
  scientificName: string;
  family: string;
  category: 'Cereal' | 'Vegetable' | 'Fruit' | 'Cash Crop' | 'Pulse' | 'Spices' | 'Oilseed';
  optimalSeason: string;
  commonDiseases: string[];
}

export const VERIFIED_CROPS: VerifiedCropRecord[] = [
  {
    id: 'tomato',
    commonName: { en: 'Tomato', mr: 'टोमॅटो', hi: 'टमाटर' },
    scientificName: 'Solanum lycopersicum',
    family: 'Solanaceae',
    category: 'Vegetable',
    optimalSeason: 'Rabi & Kharif',
    commonDiseases: ['tomato_early_blight', 'tomato_late_blight', 'tomato_leaf_curl', 'tomato_bacterial_spot']
  },
  {
    id: 'potato',
    commonName: { en: 'Potato', mr: 'बटाटा', hi: 'आलू' },
    scientificName: 'Solanum tuberosum',
    family: 'Solanaceae',
    category: 'Vegetable',
    optimalSeason: 'Rabi (Winter)',
    commonDiseases: ['potato_early_blight', 'potato_late_blight', 'potato_scab']
  },
  {
    id: 'rice',
    commonName: { en: 'Rice / Paddy', mr: 'भात / धान', hi: 'चावल / धान' },
    scientificName: 'Oryza sativa',
    family: 'Poaceae',
    category: 'Cereal',
    optimalSeason: 'Kharif (Monsoon)',
    commonDiseases: ['rice_blast', 'rice_bacterial_blight', 'rice_sheath_blight']
  },
  {
    id: 'wheat',
    commonName: { en: 'Wheat', mr: 'गहू', hi: 'गेहूं' },
    scientificName: 'Triticum aestivum',
    family: 'Poaceae',
    category: 'Cereal',
    optimalSeason: 'Rabi (Winter)',
    commonDiseases: ['wheat_rust', 'wheat_powdery_mildew', 'wheat_leaf_blight']
  },
  {
    id: 'maize',
    commonName: { en: 'Maize / Corn', mr: 'मका', hi: 'मक्का' },
    scientificName: 'Zea mays',
    family: 'Poaceae',
    category: 'Cereal',
    optimalSeason: 'Kharif & Rabi',
    commonDiseases: ['maize_leaf_blight', 'maize_rust', 'maize_downy_mildew']
  },
  {
    id: 'cotton',
    commonName: { en: 'Cotton', mr: 'कापूस', hi: 'कपास' },
    scientificName: 'Gossypium hirsutum',
    family: 'Malvaceae',
    category: 'Cash Crop',
    optimalSeason: 'Kharif',
    commonDiseases: ['cotton_bacterial_blight', 'cotton_leaf_spot', 'cotton_grey_mildew']
  },
  {
    id: 'soybean',
    commonName: { en: 'Soybean', mr: 'सोयाबीन', hi: 'सोयाबीन' },
    scientificName: 'Glycine max',
    family: 'Fabaceae',
    category: 'Oilseed',
    optimalSeason: 'Kharif',
    commonDiseases: ['soybean_rust', 'soybean_yellow_mosaic', 'soybean_anthracnose']
  },
  {
    id: 'grape',
    commonName: { en: 'Grape', mr: 'द्राक्षे', hi: 'अंगूर' },
    scientificName: 'Vitis vinifera',
    family: 'Vitaceae',
    category: 'Fruit',
    optimalSeason: 'Perennial',
    commonDiseases: ['grape_downy_mildew', 'grape_powdery_mildew', 'grape_anthracnose']
  },
  {
    id: 'mango',
    commonName: { en: 'Mango', mr: 'आंबा', hi: 'आम' },
    scientificName: 'Mangifera indica',
    family: 'Anacardiaceae',
    category: 'Fruit',
    optimalSeason: 'Summer / Perennial',
    commonDiseases: ['mango_anthracnose', 'mango_powdery_mildew', 'mango_malformation']
  },
  {
    id: 'banana',
    commonName: { en: 'Banana', mr: 'केळी', hi: 'केला' },
    scientificName: 'Musa acuminata',
    family: 'Musaceae',
    category: 'Fruit',
    optimalSeason: 'All Season',
    commonDiseases: ['banana_sigatoka', 'banana_panama_wilt', 'banana_bunchy_top']
  },
  {
    id: 'chilli',
    commonName: { en: 'Chilli / Pepper', mr: 'मिरची', hi: 'मिर्च' },
    scientificName: 'Capsicum annuum',
    family: 'Solanaceae',
    category: 'Vegetable',
    optimalSeason: 'Kharif & Summer',
    commonDiseases: ['chilli_leaf_curl', 'chilli_anthracnose', 'chilli_powdery_mildew']
  },
  {
    id: 'onion',
    commonName: { en: 'Onion', mr: 'कांदा', hi: 'प्याज' },
    scientificName: 'Allium cepa',
    family: 'Amaryllidaceae',
    category: 'Vegetable',
    optimalSeason: 'Kharif, Late Kharif & Rabi',
    commonDiseases: ['onion_purple_blotch', 'onion_downy_mildew', 'onion_stemphyllium_blight']
  },
  {
    id: 'apple',
    commonName: { en: 'Apple', mr: 'सफरचंद', hi: 'सेब' },
    scientificName: 'Malus domestica',
    family: 'Rosaceae',
    category: 'Fruit',
    optimalSeason: 'Temperate / Perennial',
    commonDiseases: ['apple_scab', 'apple_powdery_mildew', 'apple_cedar_rust']
  },
  {
    id: 'guava',
    commonName: { en: 'Guava', mr: 'पेरू', hi: 'अमरूद' },
    scientificName: 'Psidium guajava',
    family: 'Myrtaceae',
    category: 'Fruit',
    optimalSeason: 'Perennial',
    commonDiseases: ['guava_wilt', 'guava_anthracnose', 'guava_canker']
  },
  {
    id: 'lemon',
    commonName: { en: 'Citrus / Lemon', mr: 'लिंबू', hi: 'नींबू' },
    scientificName: 'Citrus limon',
    family: 'Rutaceae',
    category: 'Fruit',
    optimalSeason: 'All season',
    commonDiseases: ['citrus_canker', 'citrus_greening', 'citrus_black_spot']
  },
  {
    id: 'sugarcane',
    commonName: { en: 'Sugarcane', mr: 'ऊस', hi: 'गन्ना' },
    scientificName: 'Saccharum officinarum',
    family: 'Poaceae',
    category: 'Cash Crop',
    optimalSeason: 'Annual / Perennial',
    commonDiseases: ['sugarcane_red_rot', 'sugarcane_smut', 'sugarcane_grassy_shoot']
  },
  {
    id: 'turmeric',
    commonName: { en: 'Turmeric', mr: 'हळद', hi: 'हल्दी' },
    scientificName: 'Curcuma longa',
    family: 'Zingiberaceae',
    category: 'Spices',
    optimalSeason: 'Kharif',
    commonDiseases: ['turmeric_leaf_blotch', 'turmeric_leaf_spot', 'turmeric_rhizome_rot']
  },
  {
    id: 'groundnut',
    commonName: { en: 'Groundnut / Peanut', mr: 'भुईमूग', hi: 'मूंगफली' },
    scientificName: 'Arachis hypogaea',
    family: 'Fabaceae',
    category: 'Oilseed',
    optimalSeason: 'Kharif & Summer',
    commonDiseases: ['groundnut_tikka_leaf_spot', 'groundnut_rust', 'groundnut_collar_rot']
  }
];

export const VERIFIED_DISEASES: Record<string, VerifiedDiseaseRecord> = {
  'tomato_early_blight': {
    id: 'tomato_early_blight',
    name: {
      en: 'Early Blight',
      mr: 'करपा (अर्ली ब्लाईट)',
      hi: 'अगेती झुलसा (अर्ली ब्लाइट)'
    },
    scientificName: 'Alternaria solani',
    cropId: 'tomato',
    cropName: { en: 'Tomato', mr: 'टोमॅटो', hi: 'टमाटर' },
    pathogenType: 'Fungal',
    symptoms: {
      en: [
        'Dark brown to black circular spots on older bottom leaves first',
        'Characteristic concentric rings producing a target-board pattern',
        'Yellow chlorotic halos surrounding necrotic lesions',
        'Premature defoliation exposing developing fruits to sunscald'
      ],
      mr: [
        'खालच्या जुन्या पानांवर काळे-तपकिरी गोलाकार ठिपके पडणे',
        'ठिपक्यांवर लक्षवेधी चक्रीय वलये (टार्गेट बोर्ड पॅटर्न) तयार होणे',
        'ठिपक्यांच्या भोवती पिवळसर वलय दिसणे',
        'पाने पिवळी पडून लवकर गळणे, ज्यामुळे फळांचे नुकसान होते'
      ],
      hi: [
        'निचली पुरानी पत्तियों पर गहरे भूरे या काले गोल धब्बे',
        'धब्बों पर छल्लेदार चक्र (टारगेट बोर्ड) जैसे लक्षण दिखाई देना',
        'धब्बों के चारों ओर पीला घेरा बनना',
        'पत्तियां पीली होकर समय से पहले गिरना'
      ]
    },
    causes: {
      en: [
        'Fungal pathogen Alternaria solani surviving in crop residue or infected solanaceous seeds',
        'High relative humidity (>85%) accompanied by warm temperatures (24°C - 30°C)',
        'Frequent rain splashes or overhead sprinkler irrigation dispersing fungal conidia'
      ],
      mr: [
        'अल्टरनेरिया सोलानी बुरशीचा प्रादुर्भाव',
        'हवेत ८५% पेक्षा जास्त आर्द्रता आणि २४ ते ३० अंश से. तापमान',
        'पानांवर पाणी साचून राहणे किंवा तुषार सिंचनामुळे बुरशीचे बीजाणू पसरणे'
      ],
      hi: [
        'अल्टरनेरिया सोलानी कवक का संक्रमण',
        'अधिक नमी (८५% से ज्यादा) और अनुकूल तापमान (२४-३० डिग्री)',
        'पत्तियों पर पानी ठहरना और बारिश के छींटों से फैलाव'
      ]
    },
    favorableConditions: {
      en: 'Warm temperatures (24-30°C) with alternating wet and dry periods; dense foliage without aeration.',
      mr: 'उबदार तापमान (२४-३० अंश से.) आणि दमट हवामान, दाट झाडांमध्ये खेळती हवा नसणे.',
      hi: 'गर्म तापमान (२४-३० डिग्री) और नमी का बढ़ना, खेत में वायु संचार की कमी।'
    },
    prevention: {
      en: [
        'Maintain 2 to 3 years crop rotation with non-solanaceous crops (e.g. maize, pulses)',
        'Use certified disease-free seeds and certified resistant cultivars',
        'Mulch soil surface with organic or silver/black plastic mulch to prevent soil splashing',
        'Drip irrigation rather than overhead sprinklers to keep foliage dry'
      ],
      mr: [
        'टोमॅटो किंवा वांगी-बटाट्यानंतर मका, कडधान्ये यांसारखी पिके घेऊन फेरपालट करा',
        'प्रमाणित निरोगी बियाणे वापरा',
        'माती उडणे रोखण्यासाठी मल्चिंग पेपरचा वापर करा',
        'तुषार सिंचनाऐवजी ठिबक सिंचनाचा वापर करा जेणेकरून पाने कोरडी राहतील'
      ],
      hi: [
        'सोलनेसी कुल से इतर फसलों के साथ २-३ साल का फसल चक्र अपनाएं',
        'प्रमाणित व रोगमुक्त बीजों का उपयोग करें',
        'मल्चिंग का प्रयोग करें ताकि मिट्टी के छींटे पत्तियों पर न पड़ें',
        'टपक (ड्रिप) सिंचाई का उपयोग करें ताकि पत्तियां सूखी रहें'
      ]
    },
    culturalPractices: {
      en: [
        'Prune lower leaves up to 30 cm from the ground to improve canopy air circulation',
        'Remove and incinerate or deeply bury severely infected lower foliage',
        'Stake and trellis indeterminate tomato plants to elevate canopy from wet soil'
      ],
      mr: [
        'जमिनीपासून ३० सें.मी. उंचीपर्यंतची खालची पाने छाटून हवा खेळती ठेवा',
        'रोगग्रस्त पाने गोळा करून शेताबाहेर जाळून टाका किंवा जमिनीत गाडा',
        'झाडांना बांबू व तारेच्या सहाय्याने आधार द्या'
      ],
      hi: [
        'जमीन से ३० सेमी तक की निचली पत्तियां हटा दें ताकि हवा का बहाव ठीक रहे',
        'संक्रमित पत्तियों को खेत से बाहर निकालकर नष्ट करें',
        'पौधों को डंडियों के सहारे बांधकर ऊपर रखें'
      ]
    },
    ipmStrategy: {
      en: 'Integrated approach prioritizing crop sanitation, resistant rootstocks, biological prophylaxis with Trichoderma viride, and threshold-based fungicide application.',
      mr: 'एकात्मिक कीड व रोग व्यवस्थापन: स्वच्छता, ट्रायकोडर्मा विरिडीची बीजप्रक्रिया, आणि प्रादुर्भाव वाढल्यासच शिफारशीत बुरशीनाशकांचा वापर.',
      hi: 'एकीकृत रोग प्रबंधन: खेत की स्वच्छता, ट्राइकोडर्मा से बीजोपचार और आवश्यकता पड़ने पर ही कवकनाशी का छिड़काव।'
    },
    treatments: [
      {
        type: 'biological',
        title: {
          en: 'Trichoderma harzianum Foliar Spray',
          mr: 'ट्रायकोडर्मा हरझियानम फवारणी',
          hi: 'ट्राइकोडर्मा हरजियानम पर्णीय छिड़काव'
        },
        description: {
          en: 'Foliar application of Trichoderma harzianum or Bacillus subtilis (5-10 ml/L) at first notice of leaf spots.',
          mr: 'ट्रायकोडर्मा हरझियानम किंवा बॅसिलस सबटिलिस ५ ग्रॅम/लिटर पाण्यात मिसळून फवारावे.',
          hi: 'ट्राइकोडर्मा या बैसिलस सबटिलिस ५ ग्राम प्रति लीटर पानी में मिलाकर छिड़कें।'
        },
        safetyPrecautions: {
          en: 'Safe for pollinators and beneficial soil microbes. Store bio-agent in cool dry place.',
          mr: 'मधमाश्या व मित्रकिटकांना पूर्णपणे सुरक्षित. थंड जागी साठवा.',
          hi: 'मित्र कीटों और पर्यावरण के लिए सुरक्षित। ठंडी जगह पर रखें।'
        }
      },
      {
        type: 'chemical',
        title: {
          en: 'Mancozeb 75% WP or Chlorothalonil',
          mr: 'मँकोझेब ७५% डब्ल्यूपी बुरशीनाशक',
          hi: 'मैंकोजेब ७५% डब्ल्यूपी कवकनाशी'
        },
        description: {
          en: 'Contact protectant spray with Mancozeb (2.5 g/L) or Chlorothalonil (2 g/L) at early symptom threshold.',
          mr: 'मँकोझेब ७५% डब्ल्यूपी २ ते २.५ ग्रॅम प्रति लिटर पाण्यात मिसळून संपूर्ण झाडावर फवारणी करावी.',
          hi: 'मैंकोजेब ७५% डब्ल्यूपी २ से २.५ ग्राम प्रति लीटर पानी में घोल बनाकर छिड़कें।'
        },
        dosage: '2.5 g / Liter of water',
        phiDays: 7,
        safetyPrecautions: {
          en: 'Wear gloves, mask, and goggles. Do not spray during wind or peak bee foraging hours. Observe 7 days pre-harvest interval.',
          mr: 'फवारणी करताना संरक्षक मास्क व हातमोजे वापरा. काढणीपूर्वी किमान ७ दिवस फवारणी थांबवा.',
          hi: 'छिड़काव करते समय मास्क और दस्ताने पहनें। तुड़ाई से ७ दिन पहले छिड़काव बंद करें।'
        }
      }
    ],
    safetyWarnings: {
      en: 'Always consult local university agricultural extension or certified agronomist before high-potency chemical intervention. Read pesticide labels thoroughly.',
      mr: 'कोणतेही रासायनिक औषध वापरण्यापूर्वी कृषी विद्यापीठाची शिफारस व तज्ज्ञांचा सल्ला घ्या. सुरक्षा सूचनांचे पालन करा.',
      hi: 'रासायनिक कीटनाशक उपयोग से पहले कृषि विशेषज्ञ की सलाह अवश्य लें और लेबल निर्देशों का पालन करें।'
    },
    source: 'ICAR-Indian Institute of Vegetable Research & FAO Plant Production & Protection Guidelines',
    lastReviewedDate: '2026-08-15'
  },
  'tomato_late_blight': {
    id: 'tomato_late_blight',
    name: {
      en: 'Late Blight',
      mr: 'लेट ब्लाईट / काळा करपा',
      hi: 'पछेती झुलसा (लेट ब्लाइट)'
    },
    scientificName: 'Phytophthora infestans',
    cropId: 'tomato',
    cropName: { en: 'Tomato', mr: 'टोमॅटो', hi: 'टमाटर' },
    pathogenType: 'Oomycete',
    symptoms: {
      en: [
        'Water-soaked irregular greasy spots on leaf tips and margins',
        'Rapid expansion into large dark brown lesions with pale green borders',
        'Delicate white fungal-like downy growth on leaf undersides in high humidity',
        'Dark brown sunken firm rot on green and ripe fruits'
      ],
      mr: [
        'पानांच्या कडांवर पाणीदार ओलसर काळे डाग पडणे',
        'ढगाळ वातावरणात डाग वेगाने पसरून पाने काळवंडणे',
        'पानाच्या मागच्या बाजूला पांढरी बुरशीची लव दिसणे',
        'फळांवर चॉकलेटी खड्डे पडून फळे कुजणे'
      ],
      hi: [
        'पत्तियों के सिरों पर पानी जैसे भीगे हुए अनियमित धब्बे',
        'नमी वाले मौसम में धब्बों का तेजी से बढ़ना और पत्तियों का झुलसना',
        'पत्तियों की निचली सतह पर सफेद फफूंद दिखाई देना',
        'कच्चे व पके फलों पर भूरे रंग के धब्बे व सड़न'
      ]
    },
    causes: {
      en: [
        'Oomycete pathogen Phytophthora infestans airborne sporangia',
        'Cool temperatures (15°C - 21°C) with persistent fog, dew, or rain (>90% RH)'
      ],
      mr: [
        'फायटोफ्थोरा इन्फेस्टन्स बुरशीचा हवेमार्फत प्रसार',
        'थंड व अत्यंत दमट हवामान (१५ ते २१ अंश से. आणि धुक्याची स्थिती)'
      ],
      hi: [
        'फाइटोफ्थोरा इन्फेस्टन्स रोगज़नक़ का वायु द्वारा प्रसार',
        'ठंडा और अत्यधिक नम मौसम (१५-२१ डिग्री और लगातार कोहरा)'
      ]
    },
    favorableConditions: {
      en: 'Persistent free moisture, high humidity (>90%), cool nights (10-15°C) and moderate days (15-22°C).',
      mr: 'सतत धुके किंवा पाऊस, ९०% पेक्षा जास्त आर्द्रता आणि १५-२० अंश तापमान.',
      hi: 'लगातार बारिश या कोहरा, ९०% से अधिक आर्द्रता और ठंडा मौसम।'
    },
    prevention: {
      en: [
        'Destroy volunteer potato and tomato plants around the field',
        'Ensure wide row spacing (minimum 60-75 cm) for airflow',
        'Avoid late evening irrigation'
      ],
      mr: [
        'शेताच्या बांधावरील तण व जंगली वनस्पती नष्ट करा',
        'दोन ओळींमध्ये पुरेसे अंतर ठेवा जेणेकरून हवा खेळती राहील',
        'संध्याकाळी उशिरा पाणी देणे टाळा'
      ],
      hi: [
        'खेत के आसपास के खरपतवार नष्ट करें',
        'पौधों के बीच पर्याप्त दूरी रखें',
        'शाम के समय सिंचाई से बचें'
      ]
    },
    culturalPractices: {
      en: [
        'Inspect fields daily during cloudy/misty weather',
        'Remove and bag heavily infected plants immediately to prevent spore dispersal'
      ],
      mr: [
        'धुके व ढगाळ हवामानात दररोज पिकाची पाहणी करा',
        'तीव्र प्रादुर्भाव झालेली झाडे पिशवीत भरून शेताबाहेर नष्ट करा'
      ],
      hi: [
        'कोहरे के मौसम में नियमित खेत का निरीक्षण करें',
        'रोगग्रस्त पौधों को तुरंत हटाकर नष्ट करें'
      ]
    },
    ipmStrategy: {
      en: 'Preventive sprays prior to cold humid weather front; switch to systemic fungicides if outbreak starts.',
      mr: 'हवामान थंड व ढगाळ होण्यापूर्वी प्रतिबंधात्मक उपाययोजना; प्रादुर्भाव झाल्यास त्वरित सिस्टेमिक औषध फवारणी.',
      hi: 'मौसम बदलने से पहले ही सुरक्षात्मक छिड़काव और प्रकोप होने पर अनुशंसित फफूंदनाशी का उपयोग।'
    },
    treatments: [
      {
        type: 'chemical',
        title: {
          en: 'Metalaxyl + Mancozeb (Ridomil MZ)',
          mr: 'मेटालॅक्सिल + मँकोझेब (रिडोमिल एमझेड)',
          hi: 'मेटालेक्सिल + मैंकोजेब (रिडोमिल एमजेड)'
        },
        description: {
          en: 'Systemic + contact spray (2 g/L) immediately upon symptom detection in cool wet conditions.',
          mr: 'मेटालॅक्सिल ८% + मँकोझेब ६४% डब्ल्यूपी २ ते २.५ ग्रॅम प्रति लिटर पाण्यात मिसळून फवारावे.',
          hi: 'मेटालेक्सिल ८% + मैंकोजेब ६४% डब्ल्यूपी २ ग्राम प्रति लीटर पानी में मिलाकर तुरंत छिड़कें।'
        },
        dosage: '2.0 - 2.5 g / Liter',
        phiDays: 10,
        safetyPrecautions: {
          en: 'Rotate chemical classes to prevent oomycete resistance. Strictly observe 10 days pre-harvest interval.',
          mr: 'रोगप्रतिकारक क्षमता वाढू नये म्हणून औषध आलटून-पालटून वापरा. १० दिवसांचा प्रतीक्षा काळ पाळा.',
          hi: 'फफूंदनाशी बदल-बदल कर प्रयोग करें। तुड़ाई से १० दिन पहले प्रयोग बंद करें।'
        }
      }
    ],
    safetyWarnings: {
      en: 'Late blight progresses destructively within 48-72 hours. Immediate action and agronomic consultation required.',
      mr: 'लेट ब्लाईट २४ ते ४८ तासांत संपूर्ण शेतात पसरू शकतो. ताबडतोब योग्य उपाययोजना करा.',
      hi: 'यह रोग बहुत तेजी से फैलता है। तुरंत कृषि विशेषज्ञ की राय लेकर उचित कदम उठाएं।'
    },
    source: 'CABI Plantwise & ICAR National Research Centre',
    lastReviewedDate: '2026-07-20'
  },
  'rice_blast': {
    id: 'rice_blast',
    name: {
      en: 'Rice Blast',
      mr: 'तांदळाचा करपा (राईस ब्लास्ट)',
      hi: 'धान का झोंका रोग (राइस ब्लास्ट)'
    },
    scientificName: 'Magnaporthe oryzae (Pyricularia oryzae)',
    cropId: 'rice',
    cropName: { en: 'Rice / Paddy', mr: 'भात / धान', hi: 'चावल / धान' },
    pathogenType: 'Fungal',
    symptoms: {
      en: [
        'Spindle-shaped or diamond-shaped lesions with gray/white centers and brownish borders on leaf blades',
        'Lesions coalesce causing entire leaves to desiccate (Leaf Blast)',
        'Dark necrotic lesions on collar of flag leaf (Collar Blast)',
        'Blackened, rotting panicle neck leading to empty white heads (Neck Blast)'
      ],
      mr: [
        'पानांवर मधोमध पांढरे किंवा राखाडी आणि कडेने तपकिरी रंगाचे डोळ्याच्या आकाराचे ठिपके',
        'ठिपके एकमेकांत मिसळून संपूर्ण पान वाळून जाणे',
        'पोंगा व पानाचा जोड काळा पडणे',
        'लोंबीच्या मानेवर काळा डाग पडून दाणे न भरणे (मानमोडी/नेक ब्लास्ट)'
      ],
      hi: [
        'पत्तियों पर आंख के आकार के धब्बे जिनका केंद्र राख जैसे रंग का और किनारे भूरे होते हैं',
        'धब्बों के मिलने से पत्तियां झुलसकर सूख जाती हैं',
        'बाली की गर्दन पर काले धब्बे जिससे बालियां टूट जाती हैं और दाना नहीं बनता (गर्दन तोड़)'
      ]
    },
    causes: {
      en: [
        'Magnaporthe oryzae airborne ascospores',
        'Excessive nitrogenous fertilizer application without balanced potassium',
        'High humidity (>90%) with prolonged dew periods (10+ hours leaf wetness)'
      ],
      mr: [
        'मॅग्नापोर्थे ओरायझी बुरशीचा प्रादुर्भाव',
        'युरियाचा (नत्र) अतिवापर आणि पालाशची कमतरता',
        'पानांवर सतत १० तासांपेक्षा जास्त दव साचून राहणे'
      ],
      hi: [
        'कवक मैगनापोर्थी ओराइजी का संक्रमण',
        'यूरिया का अत्यधिक उपयोग और पोटाश का असंतुलन',
        'हवा में अधिक नमी और लगातार ओस का बना रहना'
      ]
    },
    favorableConditions: {
      en: 'Cloudy weather, 20-26°C temperature, night humidity >90%, high dose of nitrogen.',
      mr: 'ढगाळ वातावरण, २०-२६ अंश से. तापमान, रात्रीची अति आर्द्रता व जादा नत्र.',
      hi: 'बादल छाए रहना, २०-२६ डिग्री तापमान, रात में अत्यधिक नमी।'
    },
    prevention: {
      en: [
        'Apply nitrogen in 3 split doses with balanced potash (NPK ratio recommended for variety)',
        'Seed treatment with Carbendazim 50% WP @ 2g/kg seed or Pseudomonas fluorescens @ 10g/kg',
        'Maintain proper water depth without excessive drainage or flooding stress'
      ],
      mr: [
        'युरिया खताची मात्रा शिफारशीनुसार २ ते ३ हप्त्यांत विभागून द्या',
        'पेरणीपूर्वी बियाण्यावर कार्बेन्डाझिम २ ग्रॅम किंवा स्युडोमोनास १० ग्रॅम प्रति किलो चोळावे',
        'शेतात पाण्याचे योग्य नियोजन ठेवा'
      ],
      hi: [
        'यूरिया को तीन बार में दें और पोटाश का उचित प्रयोग करें',
        'कार्बेंडाजिम या स्यूडोमोनास से बीजोपचार अवश्य करें',
        'खेत में पानी का समुचित प्रबंधन रखें'
      ]
    },
    culturalPractices: {
      en: [
        'Destroy weed hosts such as Echinochloa colona along paddy bunds',
        'Plant certified resistant paddy cultivars (e.g. Swarna Sub1, IR64 resistant selections)'
      ],
      mr: [
        'बांधावरील सावा व इतर गवत काढून स्वच्छता ठेवा',
        'रोगप्रतिकारक भाताच्या वाणांची निवड करा'
      ],
      hi: [
        'खेत की मेड़ों पर से घास-फूस साफ रखें',
        'रोगरोधी किस्मों का चयन करें'
      ]
    },
    ipmStrategy: {
      en: 'Seed bio-priming, split fertilizer scheduling, monitoring flag leaf symptoms, and timely curative spray at panicle emergence.',
      mr: 'बीजप्रक्रिया, संतुलित खते, आणि लोंबी बाहेर पडण्याच्या काळात त्वरित फवारणी.',
      hi: 'बीजोपचार, संतुलित खाद और बालियां निकलने से पहले ही आवश्यक छिड़काव।'
    },
    treatments: [
      {
        type: 'chemical',
        title: {
          en: 'Tricyclazole 75% WP',
          mr: 'ट्रायसायक्लॅझोल ७५% डब्ल्यूपी',
          hi: 'ट्राइसाइक्लाजोल ७५% डब्ल्यूपी'
        },
        description: {
          en: 'Spray Tricyclazole 75% WP @ 0.6 g/L water at first sign of leaf blast or just prior to heading for neck blast.',
          mr: 'ट्रायसायक्लॅझोल ७५% डब्ल्यूपी ०.६ ग्रॅम प्रति लिटर पाण्यात मिसळून फवारावे.',
          hi: 'ट्राइसाइक्लाजोल ०.६ ग्राम प्रति लीटर पानी में मिलाकर छिड़काव करें।'
        },
        dosage: '0.6 g / Liter',
        phiDays: 30,
        safetyPrecautions: {
          en: 'Ensure operator wears protective suit and mask. Adhere strictly to 30 days PHI for exported grain safety.',
          mr: 'फवारणी करताना तोंडाला मास्क लावा. निर्यातीसाठी ३० दिवसांचा प्रतीक्षा काळ पाळा.',
          hi: 'सुरक्षात्मक वस्त्र पहनें और तुड़ाई से ३० दिन पहले छिड़काव न करें।'
        }
      }
    ],
    safetyWarnings: {
      en: 'Neck blast can result in up to 80% grain loss if not protected during boot stage. Take prompt agronomic guidance.',
      mr: 'मानमोडी रोगामुळे ८०% पर्यंत भात पिकाचे नुकसान होऊ शकते. वेळीच योग्य तज्ज्ञांचा सल्ला घ्या.',
      hi: 'गर्दन तोड़ रोग से भारी नुकसान हो सकता है। समय रहते उपचार करें।'
    },
    source: 'ICAR-National Rice Research Institute (NRRI) & IRRI Rice Knowledge Bank',
    lastReviewedDate: '2026-08-01'
  },
  'grape_downy_mildew': {
    id: 'grape_downy_mildew',
    name: {
      en: 'Downy Mildew of Grape',
      mr: 'द्राक्षावरील केवडा (डाऊनी मिल्ड्यू)',
      hi: 'अंगूर का मृदुरोमिल आसिता (डाउनी मिल्ड्यू)'
    },
    scientificName: 'Plasmopara viticola',
    cropId: 'grape',
    cropName: { en: 'Grape', mr: 'द्राक्षे', hi: 'अंगूर' },
    pathogenType: 'Oomycete',
    symptoms: {
      en: [
        'Translucent yellowish oily spots ("oil spots") on upper leaf surfaces',
        'White cottony downy growth on the corresponding lower surface of oil spots',
        'Affected inflorescence and young berries turn brownish, wither and drop off',
        'Older infected berries turn dull leathery gray-brown'
      ],
      mr: [
        'पानाच्या वरील भागावर पिवळसर तेलासारखे डाग (ऑईल स्पॉट्स) पडणे',
        'पानाच्या खाली त्याच डागांवर पांढऱ्या रंगाची मऊ बुरशीची लव येणे',
        'घड व फुलोरा काळा पडून जळणे किंवा मणी गळणे',
        'मोठे मणी चामड्यासारखे टणक होऊन तपकिरी पडणे'
      ],
      hi: [
        'पत्ती की ऊपरी सतह पर तेल जैसे पीले पारदर्शी धब्बे',
        'निचली सतह पर सफेद मखमली फफूंद की परत',
        'फूलों के गुच्छे और छोटे दाने भूरे होकर सूखना',
        'दाने कड़े होकर चमड़े जैसे हो जाना'
      ]
    },
    causes: {
      en: [
        'Plasmopara viticola oospores overwintering in fallen leaves and soil',
        '10-10-24 Rule: 10 mm rain + 10°C minimum temperature + 24 hours of leaf wetness triggers primary infection'
      ],
      mr: [
        'जमिनीतील व सुकलेल्या पानावरील प्लास्मोपारा विटिकोला बुरशीचे बीजाणू',
        '१०-१०-२४ नियम: १० मिमी पाऊस, किमान १० अंश तापमान आणि २४ तास ओलावा'
      ],
      hi: [
        'कवक प्लास्मोपारा विटिकोला का संक्रमण',
        'बारिश, ठंड और पत्तियों पर लगातार नमी बने रहना'
      ]
    },
    favorableConditions: {
      en: 'High humidity (>95%), moderate temperature (20-25°C), cloudy overcast skies with water film on vine canopy.',
      mr: '९५% पेक्षा जास्त आर्द्रता, २०-२५ अंश तापमान, ढगाळ हवामान आणि वेलींवर सतत पाणी राहणे.',
      hi: 'अधिक आर्द्रता (>९५%), २०-२५ डिग्री तापमान और बेलों पर पानी का जमाव।'
    },
    prevention: {
      en: [
        'Canopy management: prune excess shoots and lateral leaves to allow sunlight and wind penetration',
        'Collect and burn all fallen infected vineyard leaves and prunings',
        'Ensure effective sub-surface drainage in vineyard soils'
      ],
      mr: [
        'कॅनोपी मॅनेजमेंट: अतिरिक्त फुटवे व पाने काढून सूर्यप्रकाश व हवा खेळती ठेवा',
        'बागेतील गळलेली पाने व छाटणीचे अवशेष गोळा करून जाळून नष्ट करा',
        'बागेत चर खोदून पाण्याचा चांगला निचरा करा'
      ],
      hi: [
        'कैनोपी प्रबंधन: अतिरिक्त टहनियां काटकर धूप और हवा का आवागमन सुनिश्चित करें',
        'गिरी हुई पत्तियों को इकट्ठा कर जलाएं',
        'खेत में जल निकासी का उत्तम प्रबंध रखें'
      ]
    },
    culturalPractices: {
      en: [
        'Maintain proper trellis height and canopy training',
        'Avoid excessive gibberellic acid or high vegetative nitrogen that results in overcrowded canopies'
      ],
      mr: [
        'मंडप व तारांवर वेलींचे योग्य अंतर ठेवा',
        'नत्राचा (युरिया) अतिवापर टाळा जेणेकरून दाट पाने होणार नाहीत'
      ],
      hi: [
        'बेलों को उचित ऊंचाई पर रखें',
        'अत्यधिक यूरिया के उपयोग से बचें'
      ]
    },
    ipmStrategy: {
      en: 'Predictive disease modeling (weather stations), Bordeaux mixture protectant before rains, dimethomorph or cymoxanil curatives upon early oil-spot appearance.',
      mr: 'हवामानाचा अंदाज घेऊन पावसापूर्वी बोर्डो मिश्रण फवारणी; लक्षणे दिसल्यास सायमॉक्सॅनिल किंवा डायमेथोमॉर्फची फवारणी.',
      hi: 'मौसम के पूर्वानुमान अनुसार बोर्डो मिश्रण का छिड़काव और रोग दिखने पर अनुमोदित फफूंदनाशी का प्रयोग।'
    },
    treatments: [
      {
        type: 'preventive',
        title: {
          en: 'Bordeaux Mixture (1% Neutral)',
          mr: 'बोर्डो मिश्रण (१%)',
          hi: 'बोर्डो मिश्रण (१%)'
        },
        description: {
          en: 'Copper sulphate (1 kg) + quicklime (1 kg) in 100 L water sprayed thoroughly before onset of monsoon or cloudy spell.',
          mr: '१ किलो मोरचूद + १ किलो कळीचा चुना १०० लिटर पाण्यात मिसळून १% बोर्डो मिश्रण प्रतिबंधक म्हणून फवारावे.',
          hi: '१ किलो कॉपर सल्फेट + १ किलो चूना १०० लीटर पानी में मिलाकर सुरक्षात्मक छिड़काव करें।'
        },
        dosage: '1% solution (pH neutral ~7.0)',
        safetyPrecautions: {
          en: 'Do not mix in iron or galvanized containers. Test pH with litmus or knife blade. Safe traditional protectant.',
          mr: 'लोखंडी किंवा जस्त भांड्यात मिश्रण बनवू नका. प्लास्टिक किंवा लाकडी भांडे वापरा.',
          hi: 'लोहे के बर्तनों में न बनाएं। प्लास्टिक बाल्टी का उपयोग करें।'
        }
      }
    ],
    safetyWarnings: {
      en: 'Downy mildew can decimate grape cluster yield in 3 days during cloudy rains. Monitor grape advisories from NRC Grapes.',
      mr: 'डाऊनी मिल्ड्यूमुळे काही दिवसांत द्राक्ष बागेचे प्रचंड नुकसान होऊ शकते. राष्ट्रीय द्राक्ष संशोधन केंद्र (NRC Grapes) चे सल्ले नियमित पहा.',
      hi: 'अंगूर अनुसंधान केंद्र की सलाह के अनुसार समयबद्ध उपचार करें।'
    },
    source: 'ICAR-National Research Centre for Grapes (NRCG), Pune & OIV Guidelines',
    lastReviewedDate: '2026-08-20'
  },
  'cotton_bacterial_blight': {
    id: 'cotton_bacterial_blight',
    name: {
      en: 'Bacterial Blight / Angular Leaf Spot',
      mr: 'कापसावरील करपा / काळा कोपरा (अँगुलर लीफ स्पॉट)',
      hi: 'कपास का जीवाणु झुलसा / कोणीय पत्ती धब्बा'
    },
    scientificName: 'Xanthomonas citri pv. malvacearum',
    cropId: 'cotton',
    cropName: { en: 'Cotton', mr: 'कापूस', hi: 'कपास' },
    pathogenType: 'Bacterial',
    symptoms: {
      en: [
        'Angular water-soaked spots restricted by veinlets on the leaf lamina',
        'Spots turn reddish-brown to dark brown with age',
        'Black elongated sunken lesions on petioles and stems ("Black Arm" phase)',
        'Water-soaked circular spots on bolls causing premature boll rotting ("Boll Rot")'
      ],
      mr: [
        'पानांच्या शिरांमुळे मर्यादित राहिलेले त्रिकोणी / कोनी पाणीदार डाग',
        'कालांतराने डाग तांबूस तपकिरी किंवा काळे पडणे',
        'खोडावर व फांद्यांवर लांबट काळे डाग पडून फांद्या मोडणे (ब्लॅक आर्म)',
        'बोंडांवर काळे गोल चट्टे पडून बोंडे सडणे व कापसाची प्रत खराब होणे'
      ],
      hi: [
        'पत्तियों की नसों के बीच कोणीय जल-सिक्त धब्बे',
        'धब्बों का रंग बाद में लाल-भूरा या गहरा काला होना',
        'तने और शाखाओं पर काले घाव (ब्लैक आर्म)',
        'कपास के गूलर (टिंडों) पर काले धब्बे और सड़न'
      ]
    },
    causes: {
      en: [
        'Seed-borne bacterium Xanthomonas citri pv. malvacearum',
        'Warm humid conditions (30-35°C, RH >80%) with driven rain splashes'
      ],
      mr: [
        'बियाण्याद्वारे येणारे झांथोमोनस जिवाणू',
        'उबदार व दमट हवामान (३० ते ३५ अंश) आणि जोरदार पाऊस'
      ],
      hi: [
        'जैंथोमोनास जीवाणु का बीज व वर्षा द्वारा संक्रमण',
        'गर्म व नम वातावरण (३०-३५ डिग्री)'
      ]
    },
    favorableConditions: {
      en: 'Intermittent rainfall with wind, warm days (30-35°C), and high humidity.',
      mr: 'वारा आणि पावसाच्या सरी, ३०-३५ अंश उबदार तापमान आणि हवेत आर्द्रता.',
      hi: 'हवा के साथ बारिश, गर्म दिन और उमस।'
    },
    prevention: {
      en: [
        'Delinting of cotton seed with concentrated sulphuric acid (100 ml/kg seed) followed by water washing',
        'Seed treatment with Streptocycline (100 mg/kg seed) + Copper Oxychloride (2 g/kg seed)',
        'Growing resistant Bt cotton hybrids certified for bacterial blight tolerance'
      ],
      mr: [
        'बियाणे गंधकाम्लाने डिलिंटिंग करून निर्जंतुक करा',
        'स्ट्रेप्टोसायक्लिन १ ग्रॅम प्रति १० किलो बियाण्यास बीजप्रक्रिया करा',
        'प्रतिकारक्षम वाणांची लागवड करा'
      ],
      hi: [
        'बीज का तेजाब द्वारा रेशारहित शोधन करें',
        'स्ट्रेप्टोसाइक्लिन से बीजोपचार करें',
        'रोगरोधी किस्मों की बुआई करें'
      ]
    },
    culturalPractices: {
      en: [
        'Deep summer ploughing to expose infected debris to solar heat',
        'Destruction of ratoon cotton and alternate host weeds'
      ],
      mr: [
        'उन्हाळ्यात शेताची खोल नांगरट करून माती तापू द्या',
        'शेतातील अवशेष व बांधावरील तण नष्ट करा'
      ],
      hi: [
        'गर्मियों में गहरी जुताई करें',
        'पुराने अवशेषों को जलाकर नष्ट करें'
      ]
    },
    ipmStrategy: {
      en: 'Acid-delinting of fuzzy seed, foliar spray of Copper Oxychloride blended with bactericide upon angular spot symptoms.',
      mr: 'डिलिंटेड बियाणे वापरणे आणि प्रादुर्भाव दिसताच कॉपर ऑक्सीक्लोराईड व स्ट्रेप्टोसायक्लिनची एकत्रित फवारणी.',
      hi: 'डिलिंटेड बीज का उपयोग और लक्षण दिखते ही कॉपर ऑक्सीक्लोराइड व जीवाणुनाशी का छिड़काव।'
    },
    treatments: [
      {
        type: 'chemical',
        title: {
          en: 'Copper Oxychloride 50% WP + Streptocycline',
          mr: 'कॉपर ऑक्सीक्लोराईड + स्ट्रेप्टोसायक्लिन',
          hi: 'कॉपर ऑक्सीक्लोराइड + स्ट्रेप्टोसाइक्लिन'
        },
        description: {
          en: 'Copper Oxychloride (2.5 g) + Streptocycline (100 mg) per liter of water as foliar spray.',
          mr: 'कॉपर ऑक्सीक्लोराईड २५ ग्रॅम + स्ट्रेप्टोसायक्लिन १ ग्रॅम १० लिटर पाण्यात मिसळून फवारावे.',
          hi: 'कॉपर ऑक्सीक्लोराइड २५ ग्राम + स्ट्रेप्टोसाइक्लिन १ ग्राम प्रति १० लीटर पानी में घोलकर छिड़कें।'
        },
        dosage: '2.5 g COC + 0.1 g Streptocycline / Liter',
        phiDays: 21,
        safetyPrecautions: {
          en: 'Always wear protective PPE. Do not mix antibiotics with unapproved alkaline chemicals.',
          mr: 'सुरक्षात्मक साधने वापरा. इतर अल्कलाईन औषधांसोबत मिसळू नका.',
          hi: 'सुरक्षा उपकरण पहनें। अन्य रसायनों के साथ मिलाने से पहले जांचें।'
        }
      }
    ],
    safetyWarnings: {
      en: 'Black arm stage causes severe stem snapping during winds. Early intervention is essential.',
      mr: 'ब्लॅक आर्म अवस्थेत झाडे वाऱ्याने मोडू शकतात. वेळेवर फवारणी आवश्यक आहे.',
      hi: 'ब्लैक आर्म अवस्था में तने टूट सकते हैं। समय पर उपचार करें।'
    },
    source: 'ICAR-Central Institute for Cotton Research (CICR), Nagpur',
    lastReviewedDate: '2026-07-28'
  },
  'onion_purple_blotch': {
    id: 'onion_purple_blotch',
    name: {
      en: 'Purple Blotch of Onion',
      mr: 'कांद्यावरील जांभळा करपा (पर्पल ब्लॉच)',
      hi: 'प्याज का बैंगनी धब्बा रोग (पर्पल ब्लॉच)'
    },
    scientificName: 'Alternaria porri',
    cropId: 'onion',
    cropName: { en: 'Onion', mr: 'कांद्या', hi: 'प्याज' },
    pathogenType: 'Fungal',
    symptoms: {
      en: [
        'Small, sunken, whitish flecks on foliage with purple or violet centers',
        'Lesions enlarge rapidly with distinct concentric dark purple zones',
        'Infection on flower stalks (scapes) causes girdling and lodging before seed maturity',
        'Bulb neck rot during storage with yellowish-red watery soft breakdown'
      ],
      mr: [
        'पानांवर पांढुरके खड्डे पडणे व त्यांचा मध्यभाग जांभळा किंवा तांबूस दिसणे',
        'डाग वेगाने मोठे होऊन पानांवर जांभळी वलये तयार होणे',
        'फुलांच्या दांड्यावर (डोंगळे) डाग पडून दांडे मोडणे व बी न भरणे',
        'साठवणीत कांद्याची मान सडणे व दुर्गंधी येणे'
      ],
      hi: [
        'पत्तियों पर सफेद धब्बे जिनका केंद्र बैंगनी रंग का होता है',
        'धब्बे बढ़कर पत्तियों को सुखा देते हैं',
        'बीज वाले डंठल पर धब्बे पड़ने से डंठल टूट जाते हैं',
        'भंडारण में प्याज की गर्दन में सड़न'
      ]
    },
    causes: {
      en: [
        'Fungal pathogen Alternaria porri persisting on onion debris and volunteer sets',
        'Warm and wet weather with heavy dews (21-30°C, RH >85%)'
      ],
      mr: [
        'अल्टरनेरिया पोरी बुरशीचा प्रादुर्भाव',
        'उष्ण व दमट हवामान, अति दव आणि ८५% पेक्षा जास्त आर्द्रता'
      ],
      hi: [
        'अल्टरनेरिया पोरी फफूंद का संक्रमण',
        'उमस भरा मौसम और लगातार ओस (२१-३० डिग्री)'
      ]
    },
    favorableConditions: {
      en: 'Prolonged dew or rainfall, temperature 25°C, thrips injury predisposing leaves to fungal entry.',
      mr: 'सतत दव किंवा रिमझिम पाऊस, २५ अंश तापमान आणि फुलकिडे (थ्रिप्स) चा प्रादुर्भाव.',
      hi: 'लगातार नमी, २५ डिग्री तापमान और थ्रिप्स कीट का प्रकोप जो घाव बनाता है।'
    },
    prevention: {
      en: [
        'Control onion thrips (Thrips tabaci) effectively as their feeding punctures allow fungal ingress',
        'Crop rotation with non-allium crops for 2-3 years',
        'Raised bed planting with optimal drainage'
      ],
      mr: [
        'फुलकिड्यांचा (थ्रिप्स) वेळीच बंदोबस्त करा कारण त्यांच्या जखमांतून बुरशी शिरते',
        'कांद्याऐवजी इतर पिकांची २-३ वर्षे फेरपालट करा',
        'गादी वाफ्यावर (रेझ्ड बेड) लागवड करा'
      ],
      hi: [
        'थ्रिप्स कीट का नियंत्रण करें ताकि पत्तियों पर घाव न बनें',
        '२-३ साल का फसल चक्र अपनाएं',
        'उठे हुए क्यारियों (बेड) पर रोपाई करें'
      ]
    },
    culturalPractices: {
      en: [
        'Maintain proper planting geometry (15 x 10 cm)',
        'Cure harvested bulbs in shade for 10-15 days with foliage intact before de-topping'
      ],
      mr: [
        'लागवडीमध्ये १५ x १० सें.मी. योग्य अंतर ठेवा',
        'काढणीनंतर कांदे सावलीत वाळवून माना सुकल्यावरच कांदा कापा'
      ],
      hi: [
        'पौधों के बीच उचित दूरी रखें',
        'खुदाई के बाद प्याज को छाया में अच्छी तरह सुखाएं'
      ]
    },
    ipmStrategy: {
      en: 'Vector (thrips) management + prophylactic Difenoconazole or Mancozeb sprays with spreader-sticker (spreader essential on waxy onion leaves).',
      mr: 'थ्रिप्स नियंत्रण + स्टिकर (डिंक) मिसळून मँकोझेब किंवा डिफेनोकोनॅझोलची प्रतिबंधक फवारणी.',
      hi: 'थ्रिप्स का नियंत्रण + पत्तियों पर चिपकने वाला पदार्थ (स्टिकर) मिलाकर कवकनाशी का छिड़काव।'
    },
    treatments: [
      {
        type: 'chemical',
        title: {
          en: 'Difenoconazole 25% EC or Tebuconazole',
          mr: 'डिफेनोकोनॅझोल २५% ईसी (स्कोअर) किंवा टेबुकोनॅझोल',
          hi: 'डिफेनोकोनाजोल २५% ईसी या टेबुकोनाजोल'
        },
        description: {
          en: 'Difenoconazole 25% EC @ 1 ml/L or Tebuconazole @ 1 ml/L mixed with a non-ionic wetting agent/sticker.',
          mr: 'डिफेनोकोनॅझोल १ मि.ली. प्रति लिटर पाण्यात स्टिकर (०.५ मि.ली./लिटर) मिसळून फवारावे.',
          hi: 'डिफेनोकोनाजोल १ मिली प्रति लीटर पानी में स्टिकर के साथ मिलाकर छिड़कें।'
        },
        dosage: '1.0 ml / Liter with sticker',
        phiDays: 14,
        safetyPrecautions: {
          en: 'Always mix a wetting agent/sticker due to waxy onion cuticle. Observe 14-day pre-harvest waiting period.',
          mr: 'कांद्याच्या मेचट पानांवर औषध टिकण्यासाठी स्टिकर वापरणे आवश्यक आहे. १४ दिवसांचा अंतर पाळा.',
          hi: 'प्याज की चिकनी पत्तियों के लिए स्टिकर जरूर मिलाएं। तुड़ाई से १४ दिन पहले प्रयोग बंद करें।'
        }
      }
    ],
    safetyWarnings: {
      en: 'Purple blotch can reduce bulb weight by up to 50% and ruin storage life. Timely sticker-assisted spray is crucial.',
      mr: 'जांभळ्या करपामुळे कांद्याचे उत्पादन ५०% पर्यंत घटू शकते. वेळेवर फवारणी करा.',
      hi: 'बैंगनी धब्बे से प्याज का उत्पादन और भंडारण क्षमता दोनों घटती है। समय पर छिड़काव करें।'
    },
    source: 'ICAR-Directorate of Onion and Garlic Research (DOGR), Rajgurunagar, Pune',
    lastReviewedDate: '2026-08-10'
  }
};
