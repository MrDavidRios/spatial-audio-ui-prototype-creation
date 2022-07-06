/**
 * Behavior to model:
 * - Left + Right arrow keys -> previous/next element
 */

//Order of navigation:
//header -> h1
//nav -> links
//hr
//header, text, img, x3
//header, text x2
//img
//header, text x2
//header

let allTabbableElements: NodeListOf<HTMLElement>;

export function initTabbableElements() {
	allTabbableElements = document.querySelectorAll('[tabindex="0"]');

	let idx = 0;
	allTabbableElements.forEach((element) => {
		element.setAttribute('idx', `${idx++}`);
	});
}

document.addEventListener('keydown', (e) => {
	const activeIdx = parseInt(document.activeElement?.getAttribute('idx') ?? '-1');

	const activeElementName = document.activeElement.nodeName.toLowerCase();

	if (activeElementName === 'input') return;

	if (activeIdx === -1 && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
		(document.querySelector(`[idx="0"]`) as HTMLElement)?.focus();
		return;
	}

	if (e.key === 'ArrowLeft') {
		const navigatedElement: HTMLElement = document.querySelector(`[idx="${activeIdx - 1}"]`) as HTMLElement;
		navigatedElement?.focus();
		navigatedElement?.click();
	} else if (e.key === 'ArrowRight') {
		const navigatedElement: HTMLElement = document.querySelector(`[idx="${activeIdx + 1}"]`) as HTMLElement;
		navigatedElement?.focus();
		navigatedElement?.click();
	}
});
