import { getFile } from './fileutils';

let audioCtx = new AudioContext();

const topLeftAudioPath = require('./sounds/topleft.mp3');
const topRightAudioPath = require('./sounds/topright.mp3');
const bottomLeftAudioPath = require('./sounds/bottomleft.mp3');
const bottomRightAudioPath = require('./sounds/bottomright.mp3');
const centerAudioPath = require('./sounds/center.mp3');

const panner = audioCtx.createPanner();

let pitchConst = 300;

export function topLeft(pitchOffset: number) {
	pitchConst = pitchOffset;

	setPannerPosition(-1, 1);

	playSound(topLeftAudioPath);
}

export function topRight(pitchOffset: number) {
	pitchConst = pitchOffset;

	setPannerPosition(1, 1);

	playSound(topRightAudioPath);
}

export function bottomLeft(pitchOffset: number) {
	pitchConst = pitchOffset;

	setPannerPosition(-1, -1);

	playSound(bottomLeftAudioPath);
}

export function bottomRight(pitchOffset: number) {
	pitchConst = pitchOffset;

	setPannerPosition(1, -1);

	playSound(bottomRightAudioPath);
}

export function center(pitchOffset: number) {
	pitchConst = pitchOffset;

	setPannerPosition();

	playSound(centerAudioPath);
}

function setPannerPosition(x: number = 0, y: number = 0, z: number = 0) {
	panner.positionX.value = x;
	panner.positionY.value = y;
	panner.positionZ.value = z;
}

async function playSound(audioFilePath: string) {
	audioCtx.resume();

	//Gets audio file from imported path
	const audioFile = await getFile(audioFilePath, 'dirAudio');

	let source = audioCtx.createBufferSource();
	source.buffer = await audioCtx.decodeAudioData(await audioFile.arrayBuffer());

	//Modifies pitch based on provided y-value
	source.detune.value = pitchConst * panner.positionY.value;

	source.connect(panner).connect(audioCtx.destination);

	source.start(0);
}
