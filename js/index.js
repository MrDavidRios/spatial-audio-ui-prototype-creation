import { getBias, playSound, setPannerPosition } from './audioPlayer.js';
import { initTabbableElements } from './narrator.js';
document.querySelectorAll('*').forEach((node) => {
    node.addEventListener('click', (e) => {
        readElement(node);
        e.stopPropagation();
    });
    node.addEventListener('keypress', (e) => {
        e.stopPropagation();
        if (e.key == 'Enter')
            readElement(node);
    });
    switch (node.nodeName.toLowerCase()) {
        case 'h1':
        case 'h2':
        case 'h3':
        case 'a':
        case 'p':
        case 'img':
        case 'hr':
        case 'button':
        case 'input':
            node.setAttribute('tabindex', '0');
            break;
    }
});
initTabbableElements();
//Prevent reloading the page when clicking on the link. This would previously cut off played audio.
document.querySelectorAll('a').forEach((node) => {
    node.addEventListener('click', (e) => {
        e.preventDefault();
    });
});
const elementsWithSound = ['h1', 'h2', 'h3', 'p', 'a', 'button', 'img', 'hr', 'header', 'main', 'nav', 'div'];
export function readElement(element) {
    const elementType = element.nodeName.toLowerCase();
    const soundFilePath = `../assets/${elementType}.mp3`;
    const bias = getBias(element);
    console.log(bias);
    const filename = `${element.getAttribute('additionalSoundBite')}.mp3`;
    const additionalSoundFilePath = `../assets/${elementType === 'a' ? 'link-titles' : ''}/${filename}`;
    const containsAdditionalSoundbite = !additionalSoundFilePath.includes('null.mp3');
    //Set panner position
    if (elementsWithSound.includes(elementType))
        setPannerPosition(bias.x, bias.y);
    //Play sound file
    switch (elementType) {
        case 'h1':
        case 'h2':
        case 'h3':
        case 'button':
            if (containsAdditionalSoundbite) {
                playSound(additionalSoundFilePath).then(() => {
                    playSound(soundFilePath);
                });
            }
            else
                playSound(soundFilePath);
            break;
        case 'p':
        case 'a':
        case 'img':
            if (containsAdditionalSoundbite) {
                playSound(soundFilePath).then(() => {
                    playSound(additionalSoundFilePath);
                });
            }
            else
                playSound(soundFilePath);
            break;
        case 'hr':
            playSound('../assets/separator.mp3');
            break;
        case 'header':
            playSound('../assets/banner-landmark.mp3');
            break;
        case 'main':
            playSound('../assets/main-landmark.mp3');
            break;
        case 'nav':
            playSound('../assets/navigation-landmark.mp3');
            break;
        case 'div':
            if (containsAdditionalSoundbite)
                playSound(additionalSoundFilePath);
            break;
    }
}
