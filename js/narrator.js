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
let tabbableElements;
export function initTabbableElements() {
    tabbableElements = [
        [document.querySelector('header').querySelector('h1')],
        Array.from(getGrandchildren(document.getElementById('row1'))),
        Array.from(getGrandchildren(document.getElementById('row2'))),
        Array.from(getGrandchildren(document.getElementById('row3')))
    ];
    let idx = 0;
    for (let row = 0; row < tabbableElements.length; row++) {
        for (let horizontalIdx = 0; horizontalIdx < tabbableElements[row].length; horizontalIdx++) {
            const element = tabbableElements[row][horizontalIdx];
            const column = row === 0 ? 0 : Array.from(element.parentNode.parentNode.children).indexOf(element.parentNode);
            element.setAttribute('idx', idx.toString());
            element.setAttribute('row', row.toString());
            element.setAttribute('column', column.toString());
            idx++;
        }
    }
}
let alertOpen = false;
document.addEventListener('alert-open', () => {
    alertOpen = true;
});
document.addEventListener('alert-closed', () => {
    alertOpen = false;
});
document.addEventListener('keydown', (e) => {
    var _a, _b, _c, _d, _e;
    if (alertOpen)
        return;
    const rowIdx = (_b = (_a = document.activeElement) === null || _a === void 0 ? void 0 : _a.getAttribute('row')) !== null && _b !== void 0 ? _b : -1;
    const columnIdx = (_d = (_c = document.activeElement) === null || _c === void 0 ? void 0 : _c.getAttribute('column')) !== null && _d !== void 0 ? _d : -1;
    let idx = parseInt(((_e = document.activeElement) !== null && _e !== void 0 ? _e : document.querySelector('[idx="0"]')).getAttribute('idx'));
    if (!document.activeElement.hasAttribute('idx'))
        idx = 0;
    const currentPos = rowIdx === -1 || columnIdx === -1 ? { row: 0, column: 0 } : { row: parseInt(rowIdx), column: parseInt(columnIdx) };
    const activeElementName = document.activeElement.nodeName.toLowerCase();
    if (activeElementName === 'input')
        return;
    if (!(e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'ArrowDown'))
        return;
    let navigatedElement;
    // Horizontal Navigation
    if (e.key === 'ArrowLeft')
        navigatedElement = getLeftElement(document.activeElement, currentPos.row, currentPos.column);
    else if (e.key === 'ArrowRight')
        navigatedElement = getRightElement(document.activeElement, currentPos.row, currentPos.column);
    // Vertical Navigation
    if (e.key === 'ArrowUp')
        navigatedElement = getElementAbove(document.activeElement, currentPos.row, currentPos.column);
    else if (e.key === 'ArrowDown')
        navigatedElement = getElementBelow(document.activeElement, currentPos.row, currentPos.column);
    // Focus upon and click the element that was navigated to
    navigatedElement === null || navigatedElement === void 0 ? void 0 : navigatedElement.focus();
    // navigatedElement?.click();
});
// Horizontal Navigation
function getLeftElement(currentElement, row, column) {
    var _a, _b;
    const lastSibling = currentElement === currentElement.parentNode.lastElementChild && currentElement.parentNode.childElementCount > 1;
    if (lastSibling)
        return (_a = document.querySelector(`[row="${row}"][column="${column - 1}"]`)) === null || _a === void 0 ? void 0 : _a.parentNode.lastElementChild;
    return (_b = document.querySelector(`[row="${row}"][column="${column - 1}"]`)) === null || _b === void 0 ? void 0 : _b.parentNode.firstElementChild;
}
function getRightElement(currentElement, row, column) {
    var _a, _b;
    const lastSibling = currentElement === currentElement.parentNode.lastElementChild && currentElement.parentNode.childElementCount > 1;
    if (lastSibling)
        return (_a = document.querySelector(`[row="${row}"][column="${column + 1}"]`)) === null || _a === void 0 ? void 0 : _a.parentNode.lastElementChild;
    return (_b = document.querySelector(`[row="${row}"][column="${column + 1}"]`)) === null || _b === void 0 ? void 0 : _b.parentNode.firstElementChild;
}
// Vertical Navigation
function getElementAbove(currentElement, row, column) {
    var _a;
    if (row === 1)
        column = 0;
    if (currentElement === currentElement.parentNode.lastElementChild && currentElement.parentNode.childElementCount > 1)
        return currentElement.previousElementSibling;
    return (_a = document.querySelector(`[row="${row - 1}"][column="${column}"]`)) === null || _a === void 0 ? void 0 : _a.parentNode.lastElementChild;
}
function getElementBelow(currentElement, row, column) {
    var _a;
    if (currentElement === currentElement.parentNode.firstElementChild && currentElement.parentNode.childElementCount > 1)
        return currentElement.nextElementSibling;
    return (_a = document.querySelector(`[row="${row + 1}"][column="${column}"]`)) === null || _a === void 0 ? void 0 : _a.parentNode.firstElementChild;
}
function getGrandchildren(element) {
    const children = Array.from(element.children);
    const grandchildren = [].concat.apply([], children.map((e) => Array.from(e.children)));
    return grandchildren;
}
