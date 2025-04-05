import { describe, it, expect } from 'vitest';
import { getTagColor, getTextColor } from './utils';

describe('Color utilities', () => {
	it('should generate consistent tag colors', () => {
		const color1 = getTagColor('fruity');
		const color2 = getTagColor('fruity');
		expect(color1).toBe(color2);
		expect(color1).toMatch(/^#[0-9a-f]{6}$/i);
	});

	it('should return contrasting text color', () => {
		expect(getTextColor('#000000')).toBe('#ffffff'); // black bg → white text
		expect(getTextColor('#ffffff')).toBe('#000000'); // white bg → black text
	});
});
