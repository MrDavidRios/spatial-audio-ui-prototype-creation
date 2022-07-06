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
let allTabbableElements;
export function initTabbableElements() {
    allTabbableElements = document.querySelectorAll('[tabindex="0"]');
    let idx = 0;
    allTabbableElements.forEach((element) => {
        element.setAttribute('idx', `${idx++}`);
    });
}
document.addEventListener('keydown', (e) => {
    var _a, _b, _c;
    const activeIdx = parseInt((_b = (_a = document.activeElement) === null || _a === void 0 ? void 0 : _a.getAttribute('idx')) !== null && _b !== void 0 ? _b : '-1');
    const activeElementName = document.activeElement.nodeName.toLowerCase();
    if (activeElementName === 'input')
        return;
    if (activeIdx === -1 && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
        (_c = document.querySelector(`[idx="0"]`)) === null || _c === void 0 ? void 0 : _c.focus();
        return;
    }
    if (e.key === 'ArrowLeft') {
        const navigatedElement = document.querySelector(`[idx="${activeIdx - 1}"]`);
        navigatedElement === null || navigatedElement === void 0 ? void 0 : navigatedElement.focus();
        navigatedElement === null || navigatedElement === void 0 ? void 0 : navigatedElement.click();
    }
    else if (e.key === 'ArrowRight') {
        const navigatedElement = document.querySelector(`[idx="${activeIdx + 1}"]`);
        navigatedElement === null || navigatedElement === void 0 ? void 0 : navigatedElement.focus();
        navigatedElement === null || navigatedElement === void 0 ? void 0 : navigatedElement.click();
    }
});
