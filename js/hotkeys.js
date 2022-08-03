import { clearSelectedCell, moveElement, navigate, readAllElements, setSelectedElementType } from './grid.js';
import { logKeypress } from './logging.js';
import { Direction } from './structs/Direction.js';
export function initializeHotkeys() {
    let isKeyDown = false;
    document.addEventListener('keydown', (e) => {
        if (isKeyDown)
            return;
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
            case 'i':
                setSelectedElementType('img');
                logKeypress(e.key);
                break;
            case 'h':
                setSelectedElementType('h1');
                logKeypress(e.key);
                break;
            case 't':
            case 'p':
                setSelectedElementType('p');
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
    });
    document.addEventListener('keyup', () => {
        isKeyDown = false;
    });
}
