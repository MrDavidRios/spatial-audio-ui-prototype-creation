import { clearSelectedCell, moveElement, navigate, readAllElements, setSelectedElementType } from './grid.js';
import { Direction } from './structs/Direction.js';

export function initializeHotkeys() {
	document.addEventListener('keydown', (e) => {
		switch (e.key.toLowerCase()) {
			case 'enter':
				if (e.ctrlKey) readAllElements(0.25);
				else document.dispatchEvent(new Event('enter-keypress'));
				break;
			// Arrow Keys
			case 'arrowup':
				if (e.shiftKey) moveElement(Direction.Up);
				else navigate(Direction.Up);
				break;
			case 'arrowdown':
				if (e.shiftKey) moveElement(Direction.Down);
				else navigate(Direction.Down);
				break;
			case 'arrowleft':
				if (e.shiftKey) moveElement(Direction.Left);
				else navigate(Direction.Left);
				break;
			case 'arrowright':
				if (e.shiftKey) moveElement(Direction.Right);
				else navigate(Direction.Right);
				break;
			case 'i':
				setSelectedElementType('img');
				break;
			case 'h':
				setSelectedElementType('h1');
				break;
			case 't':
			case 'p':
				setSelectedElementType('p');
				break;
			case 'delete':
				clearSelectedCell();
				break;
			case 'escape':
				document.dispatchEvent(new Event('escape-keypress'));
				break;
		}
	});
}
