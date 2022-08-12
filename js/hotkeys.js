import { clearSelectedCell, moveElement, navigate, readAllElements, setSelectedElementType } from './grid.js';
import { logKeypress } from './logging.js';
import { Direction } from './structs/Direction.js';
export function initializeHotkeys() {
    let lastKeypress = '';
    let headerBlockIdx = 0;
    let headerIdx = 0;
    let imgIdx = 0;
    let textIdx = 0;
    document.addEventListener('keydown', (e) => {
        logKeypress(e.key);
        switch (e.key.toLowerCase()) {
            case 'enter':
                if (e.ctrlKey)
                    readAllElements(0.25);
                else
                    document.dispatchEvent(new Event('enter-keypress'));
                break;
            // Arrow Keys
            case 'arrowup':
                if (e.shiftKey)
                    moveElement(Direction.Up);
                else
                    navigate(Direction.Up);
                break;
            case 'arrowdown':
                if (e.shiftKey)
                    moveElement(Direction.Down);
                else
                    navigate(Direction.Down);
                break;
            case 'arrowleft':
                if (e.shiftKey)
                    moveElement(Direction.Left);
                else
                    navigate(Direction.Left);
                break;
            case 'arrowright':
                if (e.shiftKey)
                    moveElement(Direction.Right);
                else
                    navigate(Direction.Right);
                break;
            case 'c':
                if (lastKeypress === 'c')
                    headerBlockIdx++;
                else
                    headerBlockIdx = 0;
                setSelectedElementType('h1-p', headerBlockIdx % 3);
                break;
            case 'i':
                if (lastKeypress === 'i')
                    imgIdx++;
                else
                    imgIdx = 0;
                setSelectedElementType('img', imgIdx % 3);
                break;
            case 'h':
                if (lastKeypress === 'h')
                    headerIdx++;
                else
                    headerIdx = 0;
                setSelectedElementType('h1', headerIdx % 3);
                break;
            case 'p':
                if (lastKeypress === 'p')
                    textIdx++;
                else
                    textIdx = 0;
                setSelectedElementType('p', textIdx % 3);
                break;
            case 'backspace':
            case 'delete':
                clearSelectedCell();
                break;
            case 'escape':
                document.dispatchEvent(new Event('escape-keypress'));
                break;
        }
        lastKeypress = e.key.toLowerCase();
    });
}
