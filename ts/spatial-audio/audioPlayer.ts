import { getFile } from './fileutils.js';

let audioCtx = new AudioContext();

const panner = audioCtx.createPanner();

let pitchConst = 350;

/** Sets the position of the PannerNode. */
export function setPannerPosition(x: number = 0, y: number = 0, z: number = 5): void {
	panner.positionX.value = x * 50;
	panner.positionY.value = y;
	panner.positionZ.value = z;

	//console.log('Panner Position', panner.positionX.value, panner.positionY.value, panner.positionZ.value);
	//console.log('Listener Position', audioCtx.listener.positionX.value, audioCtx.listener.positionY.value, audioCtx.listener.positionZ.value);
}

let lastSoundSource: { sourceNode: AudioBufferSourceNode; id: number };
let soundPromiseRejectMethods: Map<number, Function> = new Map();
let soundsPlayed = 0;

/** Plays a sound file in a spatialized manner given the file path of the audio file. (e.g. 'h1.mp3') */
export async function playSound(audioFilePath: string): Promise<void> {
	return new Promise(async (resolve, reject) => {
		await audioCtx.resume();

		const id = soundsPlayed++;

		soundPromiseRejectMethods.set(id, reject);

		//Prevent multiple sounds from playing at the same time
		try {
			if (lastSoundSource !== undefined) {
				lastSoundSource.sourceNode.stop();

				//Reject last sound's promise
				soundPromiseRejectMethods.get(lastSoundSource.id)(lastSoundSource.id);
				soundPromiseRejectMethods.delete(lastSoundSource.id);

				lastSoundSource = undefined;
			}
		} catch {
			//Possible error: InvalidStateNode (DOMException) Thrown if the node has not been started by calling start(). (https://developer.mozilla.org/en-US/docs/Web/API/AudioScheduledSourceNode/stop)
			//This error isn't important. A try/catch block is used to help keep the console neater until a better method of solving this issue is found.
		}

		//Gets audio file from imported path
		const audioFile = await getFile(audioFilePath, 'dirAudio');

		let source = audioCtx.createBufferSource();
		lastSoundSource = { sourceNode: source, id: id };

		source.buffer = await audioCtx.decodeAudioData(await audioFile.arrayBuffer());

		source.onended = () => {
			lastSoundSource = undefined;
			resolve();
		};

		//Modifies pitch based on provided y-value
		source.detune.value = pitchConst * panner.positionY.value;

		var gainNode = audioCtx.createGain();
		gainNode.gain.value = 1 + 0.1 * Math.abs(panner.positionX.value); //Gain increases as distance from center increases to help balance out volume levels

		source.connect(gainNode).connect(panner).connect(audioCtx.destination);

		source.start(0);
	});
}

/** Gets the horizontal/vertical bias of an onscreen element. Returns x/y biases bounded by -1 & 1. (0 signifies center of screen) */
export function getBias(element: HTMLElement, roundToTenth = true): { x: number; y: number } {
	const rect = element.getBoundingClientRect();

	//Get midpoint of element (https://javascript.info/coordinates)
	const midpoint = { x: rect.left + rect.width / 2, y: rect.bottom - rect.height / 2 };

	const bias = { x: midpoint.x / window.innerWidth, y: midpoint.y / window.innerHeight };

	let xBias = -1 + 2 * bias.x;
	let yBias = 1 - 2 * bias.y;

	if (roundToTenth) {
		xBias = Math.round(xBias * 10) / 10;
		yBias = Math.round(yBias * 10) / 10;
	}

	return { x: xBias, y: yBias };
}
