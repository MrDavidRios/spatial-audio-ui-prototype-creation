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
let tabbableElements: HTMLElement[][];

let maxColumn = 1;

export function initTabbableElements() {
	tabbableElements = [
		[document.querySelector('header').querySelector('h1')],
		Array.from(getGrandchildren(document.getElementById('row1'))),
		Array.from(getGrandchildren(document.getElementById('row2'))),
		Array.from(getGrandchildren(document.getElementById('row3')))
	];

	maxColumn = tabbableElements[0].length;

	let idx = 0;
	for (let row = 0; row < tabbableElements.length; row++) {
		for (let horizontalIdx = 0; horizontalIdx < tabbableElements[row].length; horizontalIdx++) {
			const element = tabbableElements[row][horizontalIdx];

			const column = row === 0 ? 0 : Array.from(element.parentNode.parentNode.children).indexOf(element.parentNode as HTMLElement);

			element.setAttribute('idx', idx.toString());
			element.setAttribute('row', row.toString());
			element.setAttribute('column', column.toString());

			idx++;
		}
	}
}

document.addEventListener('keydown', (e) => {
	const rowIdx = document.activeElement?.getAttribute('row') ?? -1;
	const columnIdx = document.activeElement?.getAttribute('column') ?? -1;
	let idx = parseInt((document.activeElement ?? document.querySelector('[idx="0"]')).getAttribute('idx'));

	if (!document.activeElement.hasAttribute('idx')) idx = 0;

	const currentPos: { row: number; column: number } = rowIdx === -1 || columnIdx === -1 ? { row: 0, column: 0 } : { row: parseInt(rowIdx), column: parseInt(columnIdx) };

	const activeElementName = document.activeElement.nodeName.toLowerCase();

	if (activeElementName === 'input') return;

	if (!(e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'ArrowDown')) return;

	let navigatedElement: HTMLElement;

	// Horizontal Navigation
	if (e.key === 'ArrowLeft') navigatedElement = getPreviousElement(idx);
	else if (e.key === 'ArrowRight') navigatedElement = getNextElement(idx);

	// Vertical Navigation
	if (e.key === 'ArrowUp') navigatedElement = getElementAbove(document.activeElement as HTMLElement, currentPos.row, currentPos.column);
	else if (e.key === 'ArrowDown') navigatedElement = getElementBelow(document.activeElement as HTMLElement, currentPos.row, currentPos.column);

	// Focus upon and click the element that was navigated to
	navigatedElement?.focus();
	navigatedElement?.click();
});

// Horizontal Navigation
function getPreviousElement(currentIdx: number): HTMLElement {
	return document.querySelector(`[idx="${currentIdx - 1}"]`);
}

function getNextElement(currentIdx: number): HTMLElement {
	return document.querySelector(`[idx="${currentIdx + 1}"]`);
}

// Vertical Navigation
function getElementAbove(currentElement: HTMLElement, row: number, column: number): HTMLElement {
	if (row === 1) column = 0;

	if (currentElement === currentElement.parentNode.lastElementChild && currentElement.parentNode.childElementCount > 1) return currentElement.previousElementSibling as HTMLElement;

	return document.querySelector(`[row="${row - 1}"][column="${column}"]`)?.parentNode.lastElementChild as HTMLElement;
}
function getElementBelow(currentElement: HTMLElement, row: number, column: number): HTMLElement {
	if (currentElement === currentElement.parentNode.firstElementChild && currentElement.parentNode.childElementCount > 1) return currentElement.nextElementSibling as HTMLElement;

	return document.querySelector(`[row="${row + 1}"][column="${column}"]`)?.parentNode.firstElementChild as HTMLElement;
}

function getGrandchildren(element: HTMLElement): HTMLElement[] {
	const children = Array.from(element.children) as HTMLElement[];
	const grandchildren = [].concat.apply(
		[],
		children.map((e: HTMLElement) => Array.from(e.children) as HTMLElement[])
	);

	return grandchildren;
}
