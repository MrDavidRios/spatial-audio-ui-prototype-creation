import React from 'react';
import * as audio from './audioButtons';
import './App.css';

function App() {
	return (
		<div id='wrapper'>
			<div id='fourGrid'>
				<div>
					<button onClick={audio.topLeft}>Top Left</button>
				</div>
				<div>
					<button onClick={audio.topRight}>Top Right</button>
				</div>
				<div>
					<button onClick={audio.bottomLeft}>Bottom Left</button>
				</div>
				<div>
					<button onClick={audio.bottomRight}>Bottom Right</button>
				</div>
			</div>
			<button id='centerBtn' onClick={audio.center}>
				Center
			</button>
		</div>
	);
}

export default App;
