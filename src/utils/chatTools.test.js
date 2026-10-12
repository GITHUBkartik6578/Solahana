import { describe, expect, it } from 'vitest';
import { detectTool } from './chatTools';

describe('detectTool', () => {
  it('detects the HLV calculator', () => {
    ['HLV', 'hlv calculator', 'how much life cover do I need', 'Human Life Value', 'life insurance cover gap'].forEach((t) =>
      expect(detectTool(t)).toBe('hlv'));
  });
  it('detects the diagnostic', () => {
    ['diagnostic', 'Financial Health', 'financial health check', 'run a diagnosis'].forEach((t) =>
      expect(detectTool(t)).toBe('diagnostic'));
  });
  it('ignores everything else', () => {
    ['fees', 'tax planning', 'term plan', 'health cover', 'book a call', 'my name is Hlvan', 'hello', '', null].forEach((t) =>
      expect(detectTool(t)).toBeNull());
  });
});
