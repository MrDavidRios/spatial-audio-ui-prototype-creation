import { getContents } from './elementContents.js';
import { getBias, playSound, setPannerPosition } from './spatial-audio/audioPlayer.js';
import { Direction } from './structs/Direction.js';

// 2D array with element type stored. Ex: p, h1, img
let gridContents: string[][] = [..Array(3)].map((e) => Array(4).fill('empty'));
//https://stackoverflow.com/questions/16512182/how-to-create-empty-2d-array-in-javascript

let selectedCell: { column: number; row: number };
let chosenElementType: string;

let mode = 'navigation';

const gridDOMWrapper = document.getElementById('placementGrid');
const cellElements = Array.from(gridDOMWrapper.children) as HTMLElement[];

// Spatial audio toggle

// Query Parameters
const params: any = new Proxy(new URLSearchParams(window.location.search), {
	get: (searchParams: URLSearchParams, prop: string) => searchParams.get(prop)
});

const spatialAudioEnabled: boolean = params.spatialAudio !== 'false';
const layout: string = params.layout ?? 'empty';

console.log(layout);

// Set up 2d array with empty cells (a representaion of what the grid cell looks like on the web page)
export function initializeDOMGrid() {
	let elIdx = 0;

	switch (layout) {
		case '1':
			gridContents = [
				['img', 'h1', 'h1', 'img'],
				['h1', 'p', 'p', 'h1'],
				['p', 'img', 'img', 'p']
			];
			break;
		case '2':
			gridContents = [
				['h1', 'h1', 'h1', 'h1'],
				['p', 'img', 'img', 'p'],
				['p', 'img', 'img', 'p']
			];
			break;
		case '3':
			gridContents = [
				['h1', 'p', 'h1', 'p'],
				['h1', 'img', 'h1', 'img'],
				['p', 'p', 'p', 'p']
			];
			break;
		default:
			break;
	}

	for (let row = 0; row < gridContents.length; row++) {
		for (let col = 0; col < gridContents[0].length; col++) {
			cellElements[elIdx].setAttribute('row', row.toString());
			cellElements[elIdx].setAttribute('col', col.toString());

			if (gridContents[row][col] !== 'empty') cellElements[elIdx].innerHTML = getContents(gridContents[row][col]);

			elIdx++;
		}
	}
}

export function navigate(direction: Direction) {
	// If the grid isn't selected, then select the first cell!
	if (selectedCell === undefined) {
		if (convertActiveCellToSelected()) navigate(direction);
		else selectCell(0, 0);

		return;
	}

	switch (direction) {
		case Direction.Up:
			selectCell(selectedCell.row - 1, selectedCell.column);
			break;
		case Direction.Down:
			selectCell(selectedCell.row + 1, selectedCell.column);
			break;
		case Direction.Left:
			selectCell(selectedCell.row, selectedCell.column - 1);
			break;
		case Direction.Right:
			selectCell(selectedCell.row, selectedCell.column + 1);
			break;
	}
}

export async function placeElement(elementType: string, row: number, col: number) {
	gridContents[row][col] = elementType;

	const element = getCellElement(row, col);
	element.innerHTML = getContents(elementType);

	setSelectedElementType('undefined');

	try {
		await playSound('./assets/sound/element-placed.mp3');
		await playSound(`./assets/sound/${elementType}.mp3`);
		await playSound(`./assets/sound/${element.lastElementChild.getAttribute('additionalSoundbite')}.mp3`);

		if (isGridFull()) {
			if (spatialAudioEnabled) setPannerPosition();

			playSound('./assets/sound/full-grid.mp3').catch(() => {
				return;
			});
		}
	} catch {
		return;
	}
}

export function selectCell(row: number, col: number) {
	const elementToSelect = getCellElement(row, col);

	if (elementToSelect === null) return;

	selectedCell = { column: col, row: row };

	elementToSelect.click();
	elementToSelect.focus();
}

export function clearSelectedCell() {
	convertActiveCellToSelected();

	if (selectedCell === undefined) return;

	gridContents[selectedCell.row][selectedCell.column] = 'empty';
	getCellElement(selectedCell.row, selectedCell.column).innerHTML = '';
}

function readElement(element: HTMLElement, row: number, col: number): Promise<void> {
	return new Promise((resolve, reject) => {
		const cellContents = gridContents[row][col];

		const soundFilePath = `./assets/sound/${cellContents}.mp3`;
		const additionalSoundFilePath = `./assets/sound/${element.firstElementChild?.getAttribute('additionalSoundbite')}.mp3` ?? undefined;

		const bias = getBias(element);

		if (spatialAudioEnabled) setPannerPosition(bias.x, bias.y);

		switch (cellContents) {
			case 'empty':
				playSound(soundFilePath)
					.then(() => resolve())
					.catch((e) => {
						console.log('rejected', e);
						reject();
					});
				break;
			case 'img':
			case 'p':
				playSound(soundFilePath)
					.then(() => {
						playSound(additionalSoundFilePath)
							.then(() => resolve())
							.catch((e) => {
								console.log('rejected', e);
								reject();
							});
					})
					.catch((e) => {
						console.log('rejected', e);
						reject();
					});
				break;
			case 'h1':
				playSound(additionalSoundFilePath)
					.then(() => {
						playSound(soundFilePath)
							.then(() => resolve())
							.catch((e) => {
								console.log('rejected', e);
								reject();
							});
					})
					.catch((e) => {
						console.log('rejected', e);
						reject();
					});
				break;
		}
	});
}

/**
 * Reads all elements in sequential order. Has a customizable delay
 * @param delay (seconds)
 */
export async function readAllElements(delay = 0) {
	const gridElements = gridDOMWrapper.children;

	for (let i = 0; i < gridElements.length; i++) {
		const row = parseInt(gridElements[i].getAttribute('row'));
		const col = parseInt(gridElements[i].getAttribute('col'));

		try {
			await readElement(gridElements[i] as HTMLElement, row, col);

			await new Promise((r) => setTimeout(r, delay * 1000));
		} catch {
			break;
		}
	}
}

function isGridFull() {
	for (let row = 0; row < gridContents.length; row++) {
		for (let col = 0; col < gridContents[0].length; col++) {
			if (gridContents[row][col] == 'empty') {
				return false;
			}
		}
	}

	return true;
}

export function setSelectedElementType(elementType: string) {
	if (elementType === 'undefined') {
		chosenElementType = undefined;
		mode = 'navigation';
		return;
	}

	chosenElementType = elementType;
	mode = 'placement';
}

// Helpers
function getCellElement(row: number, col: number): HTMLElement {
	return document.querySelector(`[row="${row}"][col="${col}"]`);
}

/** Attempts to convert document.activeElement to a selected cell.
 * - Returns true if successful, and false if unsuccessful.
 * - Only works if the active/focused document element is or is within a grid cell. */
function convertActiveCellToSelected(): boolean {
	if (cellElements.includes(document.activeElement as HTMLElement)) {
		selectCell(parseInt(document.activeElement.getAttribute('row')), parseInt(document.activeElement.getAttribute('col')));
		return true;
	}

	return false;
}

// Event Listeners
document.addEventListener('enter-keypress', () => {
	convertActiveCellToSelected();

	if (selectedCell === undefined) return;

	if (mode === 'navigation') {
		// Navigation (read selected cell)
		try {
			readElement(getCellElement(selectedCell.row, selectedCell.column), selectedCell.row, selectedCell.column).catch(() => {});
		} catch {
			return;
		}
	} else {
		if (chosenElementType === undefined) return;

		// Placement (place on cell)
		placeElement(chosenElementType, selectedCell.row, selectedCell.column);
	}
});

document.addEventListener('escape-keypress', () => {
	(document.activeElement as HTMLElement).blur();
	selectedCell = undefined;
	setSelectedElementType('undefined');
});
