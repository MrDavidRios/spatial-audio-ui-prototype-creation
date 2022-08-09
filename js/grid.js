var __awaiter =
	(this && this.__awaiter) ||
	function (thisArg, _arguments, P, generator) {
		function adopt(value) {
			return value instanceof P
				? value
				: new P(function (resolve) {
						resolve(value);
				  });
		}
		return new (P || (P = Promise))(function (resolve, reject) {
			function fulfilled(value) {
				try {
					step(generator.next(value));
				} catch (e) {
					reject(e);
				}
			}
			function rejected(value) {
				try {
					step(generator['throw'](value));
				} catch (e) {
					reject(e);
				}
			}
			function step(result) {
				result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
			}
			step((generator = generator.apply(thisArg, _arguments || [])).next());
		});
	};
var _a;
import { getAdditionalSoundbiteNames, getContents, getRandomInt } from './elementContents.js';
import { getBias, playSound } from './spatial-audio/audioPlayer.js';
import { Direction } from './structs/Direction.js';
// 2D array with element type stored. Ex: p, h1, img
let gridContents = [...Array(3)].map((e) => Array(3).fill('empty'));
//https://stackoverflow.com/questions/16512182/how-to-create-empty-2d-array-in-javascript
let selectedCell;
let chosenElementType;
let chosenElementOption;
let mode = 'navigation';
let playFocusSound = true;
const gridDOMWrapper = document.getElementById('placementGrid');
const cellElements = Array.from(gridDOMWrapper.children);
// Spatial audio toggle
// Query Parameters
const params = new Proxy(new URLSearchParams(window.location.search), {
	get: (searchParams, prop) => searchParams.get(prop)
});
const layout = (_a = params.layout) !== null && _a !== void 0 ? _a : 'empty';
console.log(layout);
// Set up 2d array with empty cells (a representaion of what the grid cell looks like on the web page)
export function initializeDOMGrid() {
	let elIdx = 0;
	switch (layout) {
		case '1':
			gridContents = [
				['img', 'h1-p', 'empty'],
				['h1-p', 'h1-p', 'h1-p'],
				['img', 'img', 'empty']
			];
			break;
		case '2':
			gridContents = [
				['empty', 'h1', 'empty'],
				['empty', 'img', 'empty'],
				['h1-p', 'h1-p', 'h1-p']
			];
			break;
		case '3':
			gridContents = [
				['img', 'h1', 'empty'],
				['empty', 'h1-p', 'h1-p'],
				['empty', 'img', 'img']
			];
			break;
		default:
			break;
	}
	for (let row = 0; row < gridContents.length; row++) {
		for (let col = 0; col < gridContents[0].length; col++) {
			cellElements[elIdx].setAttribute('row', row.toString());
			cellElements[elIdx].setAttribute('col', col.toString());
			if (gridContents[row][col] !== 'empty') cellElements[elIdx].innerHTML = getContents(gridContents[row][col], getRandomInt(3));
			cellElements[elIdx].addEventListener('focus', () => {
				selectedCell = { column: col, row: row };
				if (playFocusSound) readElement(getCellElement(row, col), row, col);
			});
			elIdx++;
		}
	}
}
export function navigate(direction) {
	return __awaiter(this, void 0, void 0, function* () {
		// If the grid isn't selected, then select the first cell!
		if (selectedCell === undefined) {
			if (convertActiveCellToSelected()) navigate(direction);
			else selectCell(0, 0);
			return;
		}
		let result = null;
		switch (direction) {
			case Direction.Up:
				result = selectCell(selectedCell.row - 1, selectedCell.column);
				break;
			case Direction.Down:
				result = selectCell(selectedCell.row + 1, selectedCell.column);
				break;
			case Direction.Left:
				result = selectCell(selectedCell.row, selectedCell.column - 1);
				break;
			case Direction.Right:
				result = selectCell(selectedCell.row, selectedCell.column + 1);
				break;
		}
		if (result === 'nonexistent') {
			const bias = getBias(getCellElement(selectedCell.row, selectedCell.column));
			try {
				yield playSound(bias, './assets/sound/edge-of-screen.mp3');
			} catch (_a) {}
		}
	});
}
export function moveElement(direction) {
	return __awaiter(this, void 0, void 0, function* () {
		if (selectedCell === undefined) {
			if (convertActiveCellToSelected()) moveElement(direction);
			return;
		}
		let bias = getBias(getCellElement(selectedCell.row, selectedCell.column));
		const originalRow = selectedCell.row;
		const originalCol = selectedCell.column;
		switch (direction) {
			case Direction.Up:
				if (selectedCell.row - 1 < 0) {
					try {
						yield playSound(bias, './assets/sound/edge-of-screen.mp3');
					} catch (_a) {}
					return;
				}
				bias = getBias(getCellElement(selectedCell.row - 1, selectedCell.column));
				if (gridContents[selectedCell.row - 1][selectedCell.column] === 'empty') {
					gridContents[selectedCell.row - 1][selectedCell.column] = gridContents[selectedCell.row][selectedCell.column];
					getCellElement(selectedCell.row - 1, selectedCell.column).innerHTML = getCellElement(originalRow, originalCol).innerHTML;
					selectCell(selectedCell.row - 1, selectedCell.column, true);
					gridContents[originalRow][originalCol] = 'empty';
					getCellElement(originalRow, originalCol).innerHTML = '';
					try {
						yield playSound(bias, `./assets/sound/${gridContents[selectedCell.row][selectedCell.column]}.mp3`);
						yield playSound(bias, `./assets/sound/moved-up.mp3`);
					} catch (_b) {}
				} else {
					try {
						yield playSound(bias, './assets/sound/above-cell-taken.mp3');
					} catch (_c) {}
					return;
				}
				break;
			case Direction.Down:
				if (selectedCell.row + 1 >= gridContents.length) {
					try {
						yield playSound(bias, './assets/sound/edge-of-screen.mp3');
					} catch (_d) {}
					return;
				}
				bias = getBias(getCellElement(selectedCell.row + 1, selectedCell.column));
				if (gridContents[selectedCell.row + 1][selectedCell.column] === 'empty') {
					gridContents[selectedCell.row + 1][selectedCell.column] = gridContents[selectedCell.row][selectedCell.column];
					getCellElement(selectedCell.row + 1, selectedCell.column).innerHTML = getCellElement(originalRow, originalCol).innerHTML;
					selectCell(selectedCell.row + 1, selectedCell.column, true);
					gridContents[originalRow][originalCol] = 'empty';
					getCellElement(originalRow, originalCol).innerHTML = '';
					try {
						yield playSound(bias, `./assets/sound/${gridContents[selectedCell.row][selectedCell.column]}.mp3`);
						yield playSound(bias, `./assets/sound/moved-down.mp3`);
					} catch (_e) {}
				} else {
					try {
						yield playSound(bias, './assets/sound/below-cell-taken.mp3');
					} catch (_f) {}
					return;
				}
				break;
			case Direction.Left:
				if (selectedCell.column - 1 < 0) {
					try {
						yield playSound(bias, './assets/sound/edge-of-screen.mp3');
					} catch (_g) {}
					return;
				}
				bias = getBias(getCellElement(selectedCell.row, selectedCell.column - 1));
				if (gridContents[selectedCell.row][selectedCell.column - 1] === 'empty') {
					gridContents[selectedCell.row][selectedCell.column - 1] = gridContents[selectedCell.row][selectedCell.column];
					getCellElement(selectedCell.row, selectedCell.column - 1).innerHTML = getCellElement(originalRow, originalCol).innerHTML;
					selectCell(selectedCell.row, selectedCell.column - 1, true);
					gridContents[originalRow][originalCol] = 'empty';
					getCellElement(originalRow, originalCol).innerHTML = '';
					try {
						yield playSound(bias, `./assets/sound/${gridContents[selectedCell.row][selectedCell.column]}.mp3`);
						yield playSound(bias, `./assets/sound/moved-left.mp3`);
					} catch (_h) {}
				} else {
					try {
						yield playSound(bias, './assets/sound/left-cell-taken.mp3');
					} catch (_j) {}
					return;
				}
				break;
			case Direction.Right:
				if (selectedCell.column + 1 >= gridContents[0].length) {
					try {
						yield playSound(bias, './assets/sound/edge-of-screen.mp3');
					} catch (_k) {}
					return;
				}
				bias = getBias(getCellElement(selectedCell.row, selectedCell.column + 1));
				if (gridContents[selectedCell.row][selectedCell.column + 1] === 'empty') {
					gridContents[selectedCell.row][selectedCell.column + 1] = gridContents[selectedCell.row][selectedCell.column];
					getCellElement(selectedCell.row, selectedCell.column + 1).innerHTML = getCellElement(originalRow, originalCol).innerHTML;
					selectCell(selectedCell.row, selectedCell.column + 1, true);
					gridContents[originalRow][originalCol] = 'empty';
					getCellElement(originalRow, originalCol).innerHTML = '';
					try {
						yield playSound(bias, `./assets/sound/${gridContents[selectedCell.row][selectedCell.column]}.mp3`);
						yield playSound(bias, `./assets/sound/moved-right.mp3`);
					} catch (_l) {}
				} else {
					try {
						yield playSound(bias, './assets/sound/right-cell-taken.mp3');
					} catch (_m) {}
					return;
				}
				break;
		}
	});
}
export function placeElement(elementType, row, col) {
	return __awaiter(this, void 0, void 0, function* () {
		gridContents[row][col] = elementType;
		const element = getCellElement(row, col);
		element.innerHTML = getContents(elementType, chosenElementOption);
		setSelectedElementType('undefined');
		try {
			const bias = getBias(element);
			yield playSound(bias, './assets/sound/element-placed.mp3');
			yield playSound(bias, `./assets/sound/${elementType}.mp3`);
			if (elementType === 'h1-p') {
				yield readElement(element, row, col);
			} else yield playSound(bias, `./assets/sound/${element.lastElementChild.getAttribute('additionalSoundbite')}.mp3`);
			if (isGridFull()) {
				yield playSound({ x: 0, y: 0 }, './assets/sound/full-grid.mp3');
			}
		} catch (_a) {
			return;
		}
	});
}
export function selectCell(row, col, moving = false) {
	const elementToSelect = getCellElement(row, col);
	if (elementToSelect === null) return 'nonexistent';
	selectedCell = { column: col, row: row };
	if (moving) playFocusSound = false;
	elementToSelect.click();
	elementToSelect.focus();
	playFocusSound = true;
	return 'successful';
}
export function clearSelectedCell() {
	return __awaiter(this, void 0, void 0, function* () {
		convertActiveCellToSelected();
		if (selectedCell === undefined || gridContents[selectedCell.row][selectedCell.column] === 'empty') return;
		const elementType = gridContents[selectedCell.row][selectedCell.column];
		gridContents[selectedCell.row][selectedCell.column] = 'empty';
		const element = getCellElement(selectedCell.row, selectedCell.column);
		element.innerHTML = '';
		const bias = getBias(element);
		try {
			yield playSound(bias, `./assets/sound/${elementType}.mp3`);
			yield playSound(bias, `./assets/sound/deleted.mp3`);
		} catch (_a) {}
	});
}
function readElement(element, row, col) {
	var _a, _b, _c, _d;
	return __awaiter(this, void 0, void 0, function* () {
		const cellContents = gridContents[row][col];
		const soundFilePath = `./assets/sound/${cellContents}.mp3`;
		const additionalSoundFilePath =
			(_b = `./assets/sound/${(_a = element.firstElementChild) === null || _a === void 0 ? void 0 : _a.getAttribute('additionalSoundbite')}.mp3`) !== null && _b !== void 0 ? _b : undefined;
		const bias = getBias(element);
		try {
			switch (cellContents) {
				case 'empty':
					yield playSound(bias, soundFilePath);
					break;
				case 'img':
				case 'p':
					yield playSound(bias, soundFilePath);
					yield playSound(bias, additionalSoundFilePath);
					break;
				case 'h1':
					yield playSound(bias, additionalSoundFilePath);
					yield playSound(bias, soundFilePath);
					break;
				case 'h1-p':
					// Header Sounds
					yield playSound(bias, './assets/sound/h1.mp3');
					yield playSound(bias, `./assets/sound/${(_c = element.firstElementChild) === null || _c === void 0 ? void 0 : _c.getAttribute('additionalSoundbite')}.mp3`);
					// Text Sounds
					yield playSound(bias, './assets/sound/p.mp3');
					yield playSound(bias, `./assets/sound/${(_d = element.lastElementChild) === null || _d === void 0 ? void 0 : _d.getAttribute('additionalSoundbite')}.mp3`);
					break;
			}
		} catch (_e) {}
	});
}
let currentlyReadingAllElements = false;
let cancelReadAllElements = false;
/**
 * Reads all elements in sequential order. Has a customizable delay
 * @param delay (seconds)
 */
export function readAllElements(delay = 0) {
	return __awaiter(this, void 0, void 0, function* () {
		const gridElements = gridDOMWrapper.children;
		currentlyReadingAllElements = true;
		for (let i = 0; i < gridElements.length; i++) {
			const row = parseInt(gridElements[i].getAttribute('row'));
			const col = parseInt(gridElements[i].getAttribute('col'));
			if (gridContents[row][col] === 'empty') continue;
			try {
				if (cancelReadAllElements) {
					cancelReadAllElements = false;
					currentlyReadingAllElements = false;
					break;
				}
				yield readElement(gridElements[i], row, col);
				yield new Promise((r) => setTimeout(r, delay * 1000));
			} catch (_a) {
				break;
			}
		}
		currentlyReadingAllElements = false;
	});
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
export function setSelectedElementType(elementType, option = 0) {
	return __awaiter(this, void 0, void 0, function* () {
		if (elementType === 'undefined') {
			chosenElementType = undefined;
			chosenElementOption = -1;
			mode = 'navigation';
			return;
		}
		chosenElementType = elementType;
		chosenElementOption = option;
		mode = 'placement';
		try {
			const bias = getBias(getCellElement(selectedCell.row, selectedCell.column));
			yield playSound(bias, `./assets/sound/${elementType}.mp3`);
			yield playSound(bias, `./assets/sound/selected.mp3`);
			const additionalSoundbiteNames = getAdditionalSoundbiteNames(elementType, option);
			yield playSound(bias, `./assets/sound/${additionalSoundbiteNames[0]}.mp3`);
			if (additionalSoundbiteNames.length > 1) yield playSound(bias, `./assets/sound/${additionalSoundbiteNames[1]}.mp3`);
		} catch (_a) {
			return;
		}
	});
}
// Helpers
function getCellElement(row, col) {
	return document.querySelector(`[row="${row}"][col="${col}"]`);
}
/** Attempts to convert document.activeElement to a selected cell.
 * - Returns true if successful, and false if unsuccessful.
 * - Only works if the active/focused document element is or is within a grid cell. */
function convertActiveCellToSelected() {
	if (cellElements.includes(document.activeElement)) {
		selectCell(parseInt(document.activeElement.getAttribute('row')), parseInt(document.activeElement.getAttribute('col')));
		return true;
	}
	return false;
}
// Event Listeners
document.addEventListener('enter-keypress', () =>
	__awaiter(void 0, void 0, void 0, function* () {
		convertActiveCellToSelected();
		if (selectedCell === undefined) return;
		if (mode === 'navigation') {
			// Navigation (read selected cell)
			try {
				yield readElement(getCellElement(selectedCell.row, selectedCell.column), selectedCell.row, selectedCell.column);
			} catch (_b) {
				return;
			}
		} else {
			if (chosenElementType === undefined) return;
			// Placement (place on cell)
			yield placeElement(chosenElementType, selectedCell.row, selectedCell.column);
		}
	})
);
document.addEventListener('escape-keypress', () => {
	if (currentlyReadingAllElements) {
		cancelReadAllElements = true;
		return;
	}
	document.activeElement.blur();
	selectedCell = undefined;
	setSelectedElementType('undefined');
});
