const soundElementHTML = `<div additionalSoundbite="element">
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-volume-2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
</div>`;
const rowInput = document.getElementById('rowInput');
const columnInput = document.getElementById('columnInput');
const updateButton = document.querySelector('button');
const mainElement = document.querySelector('main');
const getCookieValue = (name) => { var _a; return ((_a = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')) === null || _a === void 0 ? void 0 : _a.pop()) || undefined; };
const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
console.log(getCookieValue('rowAmount'), getCookieValue('columnAmount'));
rowInput.value = getCookieValue('rowAmount') ? getCookieValue('rowAmount') : rowInput.value;
columnInput.value = getCookieValue('columnAmount') ? getCookieValue('columnAmount') : columnInput.value;
let rowAmount = clamp(parseInt(rowInput.value), 0, 10);
let columnAmount = clamp(parseInt(columnInput.value), 0, 10);
// Initialization
mainElement.setAttribute('style', `grid-template-columns: repeat(${columnAmount}, minmax(0, 1fr)); grid-template-rows: repeat(${rowAmount}, minmax(0, 1fr));`);
for (let i = 0; i < rowAmount * columnAmount; i++) {
    mainElement.innerHTML += soundElementHTML;
}
function updateGridLayout() {
    rowAmount = parseInt(rowInput.value);
    columnAmount = parseInt(columnInput.value);
    setCookie('rowAmount', rowInput.value, 1);
    setCookie('columnAmount', columnInput.value, 1);
    document.location.reload();
}
function setCookie(name, value, days) {
    var expires = '';
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = '; expires=' + date.toUTCString();
    }
    document.cookie = name + '=' + (value || '') + expires + '; path=/';
}
updateButton.addEventListener('click', () => updateGridLayout());
