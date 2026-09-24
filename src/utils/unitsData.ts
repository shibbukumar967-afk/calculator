import { UnitCategory, UnitDefinition } from '../types';

export const UNIT_CATEGORIES: { id: UnitCategory; name: string; nameHi: string; icon: string }[] = [
  { id: 'length', name: 'Length', nameHi: 'लंबाई', icon: 'Ruler' },
  { id: 'weight', name: 'Weight / Mass', nameHi: 'वजन / द्रव्यमान', icon: 'Scale' },
  { id: 'temperature', name: 'Temperature', nameHi: 'तापमान', icon: 'Thermometer' },
  { id: 'area', name: 'Area', nameHi: 'क्षेत्रफल', icon: 'Square' },
  { id: 'volume', name: 'Volume', nameHi: 'आयतन', icon: 'Box' },
  { id: 'speed', name: 'Speed', nameHi: 'गति', icon: 'Gauge' },
  { id: 'storage', name: 'Digital Storage', nameHi: 'डिजिटल डेटा', icon: 'HardDrive' },
  { id: 'time', name: 'Time', nameHi: 'समय', icon: 'Clock' },
];

export const UNITS_DATA: Record<UnitCategory, UnitDefinition[]> = {
  length: [
    { id: 'm', name: 'Meter', nameHi: 'मीटर', symbol: 'm', toBase: (v) => v, fromBase: (v) => v },
    { id: 'km', name: 'Kilometer', nameHi: 'किलोमीटर', symbol: 'km', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    { id: 'cm', name: 'Centimeter', nameHi: 'सेंटीमीटर', symbol: 'cm', toBase: (v) => v / 100, fromBase: (v) => v * 100 },
    { id: 'mm', name: 'Millimeter', nameHi: 'मिलीमीटर', symbol: 'mm', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    { id: 'mi', name: 'Mile', nameHi: 'मील', symbol: 'mi', toBase: (v) => v * 1609.344, fromBase: (v) => v / 1609.344 },
    { id: 'yd', name: 'Yard', nameHi: 'गज (यार्ड)', symbol: 'yd', toBase: (v) => v * 0.9144, fromBase: (v) => v / 0.9144 },
    { id: 'ft', name: 'Foot', nameHi: 'फुट', symbol: 'ft', toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
    { id: 'in', name: 'Inch', nameHi: 'इंच', symbol: 'in', toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
  ],
  weight: [
    { id: 'kg', name: 'Kilogram', nameHi: 'किलोग्राम', symbol: 'kg', toBase: (v) => v, fromBase: (v) => v },
    { id: 'g', name: 'Gram', nameHi: 'ग्राम', symbol: 'g', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    { id: 'mg', name: 'Milligram', nameHi: 'मिलीग्राम', symbol: 'mg', toBase: (v) => v / 1000000, fromBase: (v) => v * 1000000 },
    { id: 'lb', name: 'Pound', nameHi: 'पाउंड', symbol: 'lb', toBase: (v) => v * 0.45359237, fromBase: (v) => v / 0.45359237 },
    { id: 'oz', name: 'Ounce', nameHi: 'औंस', symbol: 'oz', toBase: (v) => v * 0.02834952, fromBase: (v) => v / 0.02834952 },
    { id: 't', name: 'Metric Ton', nameHi: 'टन', symbol: 't', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    { id: 'quintal', name: 'Quintal', nameHi: 'क्विंटल', symbol: 'q', toBase: (v) => v * 100, fromBase: (v) => v / 100 },
  ],
  temperature: [
    { id: 'c', name: 'Celsius', nameHi: 'सेल्सियस', symbol: '°C', toBase: (v) => v, fromBase: (v) => v },
    { id: 'f', name: 'Fahrenheit', nameHi: 'फ़ारेनहाइट', symbol: '°F', toBase: (v) => (v - 32) * (5 / 9), fromBase: (v) => v * (9 / 5) + 32 },
    { id: 'k', name: 'Kelvin', nameHi: 'केल्विन', symbol: 'K', toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
  ],
  area: [
    { id: 'sqm', name: 'Square Meter', nameHi: 'वर्ग मीटर', symbol: 'm²', toBase: (v) => v, fromBase: (v) => v },
    { id: 'sqkm', name: 'Square Kilometer', nameHi: 'वर्ग किलोमीटर', symbol: 'km²', toBase: (v) => v * 1000000, fromBase: (v) => v / 1000000 },
    { id: 'sqft', name: 'Square Foot', nameHi: 'वर्ग फुट', symbol: 'ft²', toBase: (v) => v * 0.092903, fromBase: (v) => v / 0.092903 },
    { id: 'sqyd', name: 'Square Yard (Gaj)', nameHi: 'वर्ग गज', symbol: 'yd²', toBase: (v) => v * 0.836127, fromBase: (v) => v / 0.836127 },
    { id: 'acre', name: 'Acre', nameHi: 'एकड़', symbol: 'ac', toBase: (v) => v * 4046.86, fromBase: (v) => v / 4046.86 },
    { id: 'hectare', name: 'Hectare', nameHi: 'हेक्टेयर', symbol: 'ha', toBase: (v) => v * 10000, fromBase: (v) => v / 10000 },
    { id: 'bigha', name: 'Bigha (Standard)', nameHi: 'बीघा', symbol: 'bigha', toBase: (v) => v * 2529.28, fromBase: (v) => v / 2529.28 },
  ],
  volume: [
    { id: 'l', name: 'Liter', nameHi: 'लीटर', symbol: 'L', toBase: (v) => v, fromBase: (v) => v },
    { id: 'ml', name: 'Milliliter', nameHi: 'मिलीलीटर', symbol: 'mL', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    { id: 'cum', name: 'Cubic Meter', nameHi: 'घन मीटर', symbol: 'm³', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    { id: 'gal', name: 'US Gallon', nameHi: 'गैलन (US)', symbol: 'gal', toBase: (v) => v * 3.78541, fromBase: (v) => v / 3.78541 },
    { id: 'cup', name: 'Cup', nameHi: 'कप', symbol: 'cup', toBase: (v) => v * 0.236588, fromBase: (v) => v / 0.236588 },
    { id: 'floz', name: 'Fluid Ounce', nameHi: 'तरल औंस', symbol: 'fl oz', toBase: (v) => v * 0.0295735, fromBase: (v) => v / 0.0295735 },
  ],
  speed: [
    { id: 'kmh', name: 'Kilometer / Hour', nameHi: 'किमी / घंटा', symbol: 'km/h', toBase: (v) => v, fromBase: (v) => v },
    { id: 'mph', name: 'Miles / Hour', nameHi: 'मील / घंटा', symbol: 'mph', toBase: (v) => v * 1.60934, fromBase: (v) => v / 1.60934 },
    { id: 'ms', name: 'Meter / Second', nameHi: 'मीटर / सेकंड', symbol: 'm/s', toBase: (v) => v * 3.6, fromBase: (v) => v / 3.6 },
    { id: 'knot', name: 'Knot', nameHi: 'समुद्री मील (नॉट)', symbol: 'kn', toBase: (v) => v * 1.852, fromBase: (v) => v / 1.852 },
  ],
  storage: [
    { id: 'mb', name: 'Megabyte', nameHi: 'मेगाबाइट', symbol: 'MB', toBase: (v) => v, fromBase: (v) => v },
    { id: 'byte', name: 'Byte', nameHi: 'बाइट', symbol: 'B', toBase: (v) => v / (1024 * 1024), fromBase: (v) => v * (1024 * 1024) },
    { id: 'kb', name: 'Kilobyte', nameHi: 'किलोबाइट', symbol: 'KB', toBase: (v) => v / 1024, fromBase: (v) => v * 1024 },
    { id: 'gb', name: 'Gigabyte', nameHi: 'गीगाबाइट', symbol: 'GB', toBase: (v) => v * 1024, fromBase: (v) => v / 1024 },
    { id: 'tb', name: 'Terabyte', nameHi: 'टेराबाइट', symbol: 'TB', toBase: (v) => v * 1024 * 1024, fromBase: (v) => v / (1024 * 1024) },
  ],
  time: [
    { id: 's', name: 'Second', nameHi: 'सेकंड', symbol: 's', toBase: (v) => v, fromBase: (v) => v },
    { id: 'ms', name: 'Millisecond', nameHi: 'मिलीसेकंड', symbol: 'ms', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    { id: 'min', name: 'Minute', nameHi: 'मिनट', symbol: 'min', toBase: (v) => v * 60, fromBase: (v) => v / 60 },
    { id: 'hr', name: 'Hour', nameHi: 'घंटा', symbol: 'hr', toBase: (v) => v * 3600, fromBase: (v) => v / 3600 },
    { id: 'day', name: 'Day', nameHi: 'दिन', symbol: 'day', toBase: (v) => v * 86400, fromBase: (v) => v / 86400 },
    { id: 'wk', name: 'Week', nameHi: 'सप्ताह', symbol: 'wk', toBase: (v) => v * 604800, fromBase: (v) => v / 604800 },
    { id: 'yr', name: 'Year (365d)', nameHi: 'वर्ष', symbol: 'yr', toBase: (v) => v * 31536000, fromBase: (v) => v / 31536000 },
  ],
};
