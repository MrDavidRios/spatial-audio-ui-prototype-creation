import { getBias, playSound, setPannerPosition } from './audioPlayer.js';
import { initTabbableElements } from './narrator.js';
document.querySelectorAll('*').forEach((node) => {
	node.addEventListener('click', (e) => {
		readElement(node);
		e.stopPropagation();
	});
	node.addEventListener('keypress', (e) => {
		e.stopPropagation();
		if (e.key == 'Enter') readElement(node);
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
	const soundFilePath = `./assets/sound/${elementType}.mp3`;
	const bias = getBias(element);
	console.log(bias);
	const filename = `${element.getAttribute('additionalSoundBite')}.mp3`;
	const additionalSoundFilePath = `./assets/sound/${getBaseFilePath(elementType)}/${filename}`;
	const containsAdditionalSoundbite = !additionalSoundFilePath.includes('null.mp3');
	//Set panner position
	if (elementsWithSound.includes(elementType)) setPannerPosition(bias.x, bias.y);
	//Play sound file (can log sound cancellation through catch() callback if necessary)
	switch (elementType) {
		case 'h1':
		case 'h2':
		case 'h3':
		case 'button':
			if (containsAdditionalSoundbite) {
				playSound(additionalSoundFilePath)
					.then(() => {
						playSound(soundFilePath).catch((e) => {
							console.log('rejected', e);
						});
					})
					.catch((e) => {
						console.log('rejected', e);
					});
			} else
				playSound(soundFilePath).catch((e) => {
					console.log('rejected', e);
				});
			break;
		case 'p':
		case 'a':
		case 'img':
			playSound(soundFilePath)
				.then(() => {
					if (containsAdditionalSoundbite)
						playSound(additionalSoundFilePath).catch((e) => {
							console.log('rejected', e);
						});
				})
				.catch((e) => {
					console.log('rejected', e);
				});
			break;
		case 'hr':
			playSound('./assets/sound/separator.mp3').catch(() => {});
			break;
		case 'header':
			playSound('./assets/sound/banner-landmark.mp3').catch(() => {});
			break;
		case 'main':
			playSound('./assets/sound/main-landmark.mp3').catch(() => {});
			break;
		case 'nav':
			playSound('./assets/sound/navigation-landmark.mp3').catch(() => {});
			break;
		case 'div':
			if (containsAdditionalSoundbite) playSound(additionalSoundFilePath).catch(() => {});
			break;
	}
}
function getBaseFilePath(elementType) {
	switch (elementType) {
		case 'a':
			return 'link-titles';
		case 'h1':
		case 'h2':
		case 'h3':
			return 'header-titles';
		case 'p':
			return 'captions';
		case 'img':
			return 'alt-text';
		default:
			return '';
	}
}
