/**
 * Chart colours for the Financial Kundli. Series colours are the validated reference categorical palette (fixed order,
 * checked with the dataviz palette validator: CVD and normal-vision separation pass; three light slots sit below 3:1, so
 * every chart also has a legend and a "Show the numbers" table). Status colours are the reserved good / warning /
 * critical set and always come with an icon and a word, never colour alone. Axes and grid use the site's own greys.
 */
export const CHART_COLORS = Object.freeze({
  good: '#0ca30c',
  warningText: '#8a5a00',
  critical: '#d03b3b',
  goodTint: 'rgba(12, 163, 12, 0.16)',
  warningTint: 'rgba(250, 178, 25, 0.30)',
  criticalTint: 'rgba(208, 59, 59, 0.16)',
  marker: '#0F1F45',
  grid: '#E4E8F0',
  axisText: '#5B6B84',
  phaseTint: 'rgba(201, 160, 79, 0.09)',
  line1: '#2a78d6', // your money
  line2: '#eb6834', // goal cost
  // over-time chart: the first three validated slots (they pass all-pairs separation, so lines may cross safely)
  trend: { assets: '#2a78d6', liabilities: '#eb6834', netWorth: '#1baf7a' },
  own: '#2a78d6',
  owe: '#eb6834',
  // colour follows the entity, in the validated order
  cash: { fixed: '#2a78d6', emi: '#eb6834', other: '#1baf7a', investing: '#eda100', left: '#e87ba4' },
  assets: { LIQ: '#2a78d6', RET: '#eb6834', MF: '#1baf7a', FIX: '#eda100', GOLD: '#e87ba4', HOME: '#008300', PROP: '#6250d6', OTHER: '#e34948' },
});

/** White or near-black text for a label printed inside a coloured fill, by the fill's luminance. */
export function textOn(hex) {
  const n = parseInt(hex.slice(1), 16);
  const ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  const L = 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
  return L > 0.3 ? '#0b0b0b' : '#ffffff';
}
