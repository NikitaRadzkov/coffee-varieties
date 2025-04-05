export function getTagColor(note: string): string {
	const colors = [
		'#e3f2fd',
		'#e8f5e9',
		'#fff8e1',
		'#fce4ec',
		'#f3e5f5',
		'#e0f7fa',
		'#fffde7',
		'#efebe9',
		'#e8eaf6',
		'#f1f8e9',
		'#fff3e0',
		'#f9fbe7'
	];

	let hash = 0;
	for (let i = 0; i < note.length; i++) {
		hash = note.charCodeAt(i) + ((hash << 5) - hash);
	}
	const index = Math.abs(hash) % colors.length;

	return colors[index];
}

export function getTextColor(bgColor: string): string {
	const r = parseInt(bgColor.slice(1, 3), 16);
	const g = parseInt(bgColor.slice(3, 5), 16);
	const b = parseInt(bgColor.slice(5, 7), 16);
	const brightness = (r * 299 + g * 587 + b * 114) / 1000;
	return brightness > 128 ? '#000000' : '#ffffff';
}
