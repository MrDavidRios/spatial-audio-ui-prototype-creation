import { clearSelectedCell, moveElement, navigate, readAllElements, setSelectedElementType } from './grid.js';
import { logKeypress } from './logging.js';
import { Direction } from './structs/Direction.js';
export function initializeHotkeys() {
    let isKeyDown = false;
    let lastKeypress = '';
    let headerBlockIdx = 0;
    let headerIdx = 0;
    let imgIdx = 0;
    let textIdx = 0;
    document.addEventListener('keydown', (e) => {
        isKeyDown = true;
        console.log(e.key.toLowerCase());
        switch (e.key.toLowerCase()) {
            case 'enter':
                if (e.ctrlKey)
                    readAllElements(0.25);
                else
                    document.dispatchEvent(new Event('enter-keypress'));
                logKeypress(e.key);
                break;
            // Arrow Keys
            case 'arrowup':
                if (e.shiftKey)
                    moveElement(Direction.Up);
                else
                    navigate(Direction.Up);
                logKeypress(e.key);
                break;
            case 'arrowdown':
                if (e.shiftKey)
                    moveElement(Direction.Down);
                else
                    navigate(Direction.Down);
                logKeypress(e.key);
                break;
            case 'arrowleft':
                if (e.shiftKey)
                    moveElement(Direction.Left);
                else
                    navigate(Direction.Left);
                logKeypress(e.key);
                break;
            case 'arrowright':
                if (e.shiftKey)
                    moveElement(Direction.Right);
                else
                    navigate(Direction.Right);
                logKeypress(e.key);
                break;
            case 'c':
                if (lastKeypress === 'c')
                    headerBlockIdx++;
                else
                    headerBlockIdx = 0;
                setSelectedElementType('h1-p', headerBlockIdx);
                logKeypress(e.key);
                break;
            case 'i':
                if (lastKeypress === 'i')
                    imgIdx++;
                else
                    imgIdx = 0;
                setSelectedElementType('img', imgIdx);
                logKeypress(e.key);
                break;
            case 'h':
                if (lastKeypress === 'h')
                    headerIdx++;
                else
                    headerIdx = 0;
                setSelectedElementType('h1', headerIdx);
                logKeypress(e.key);
                break;
            case 'p':
                if (lastKeypress === 'p')
                    textIdx++;
                else
                    textIdx = 0;
                setSelectedElementType('p', textIdx);
                logKeypress(e.key);
                break;
            case 'backspace':
            case 'delete':
                clearSelectedCell();
                logKeypress(e.key);
                break;
            case 'escape':
                document.dispatchEvent(new Event('escape-keypress'));
                logKeypress(e.key);
                break;
        }
        lastKeypress = e.key.toLowerCase();
    });
    document.addEventListener('keyup', () => {
        isKeyDown = false;
    });
}
