export function getContents(elementType: string) {
	const option = getRandomInt(3);

	switch (elementType) {
		case 'p':
			if (option === 0) return '<p additionalSoundbite="personal-projects-p">I have worked on two separate projects in the past year.</p>';

			if (option === 1) return '<p additionalSoundbite="work-history-p">I was a senior developer in x company for the last 10 years.</p>';

			//If option === 2
			return '<p additionalSoundbite="hobbies-p">My hobbies include woodworking, pottery, and reading.</p>';
		case 'h1':
			if (option === 0) return '<h1 additionalSoundbite="personal-projects">Personal Projects</h1>';

			if (option === 1) return '<h1 additionalSoundbite="work-history">Work History</h1>';

			//If option === 2
			return '<h1 additionalSoundbite="hobbies">Hobbies</h1>';
		case 'img':
			if (option === 0)
				return '<img alt="A beige golden retriever puppy" src="https://www.princeton.edu/sites/default/files/styles/half_2x/public/images/2022/02/KOA_Nassau_2697x1517.jpg?itok=iQEwihUn" additionalSoundbite="my-dog"></img>';

			if (option === 1) return '<img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" additionalSoundbite="profile-picture"></img>';

			//If option === 2
			return '<img src="https://storage.googleapis.com/nextivawebsites-wordpressfiles-voip/var/www/virtual/nextiva.com/voip/How-to-Get-More-Productivity-From-a-Larger-Team-scaled.jpg" additionalSoundbite="workspace"></img>';
		default:
			console.error('Invalid element type:', elementType);
			break;
	}
}

function getRandomInt(max: number) {
	return Math.floor(Math.random() * max);
}
