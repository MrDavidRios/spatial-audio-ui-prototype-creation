import React, { useState } from 'react';
import Slider from 'react-input-slider';
import * as audio from './audioButtons';
import './App.css';

function App() {
	const [state, setState] = useState({ pitchOffset: 150 });

	return (
		<div id='wrapper'>
			<div id='slider'>
				Pitch Offset: {state.pitchOffset} cents
				<Slider
					axis='x'
					x={state.pitchOffset}
					xmax={1000}
					onChange={({ x }) =>
						setState({
							pitchOffset: x
						})
					}
				/>
			</div>
			<div id='fourGrid'>
				<div>
					<button onClick={() => audio.topLeft(state.pitchOffset)}>Top Left</button>
				</div>
				<div>
					<button onClick={() => audio.topRight(state.pitchOffset)}>Top Right</button>
				</div>
				<div>
					<button onClick={() => audio.bottomLeft(state.pitchOffset)}>Bottom Left</button>
				</div>
				<div>
					<button onClick={() => audio.bottomRight(state.pitchOffset)}>Bottom Right</button>
				</div>
			</div>
			<button id='centerBtn' onClick={() => audio.center(state.pitchOffset)}>
				Center
			</button>
		</div>
	);
}

export default App;
