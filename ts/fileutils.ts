export async function getFile(url: string, name: string) {
	let response = await fetch(url);
	let data = await response.blob();

	let metadata = {
		type: 'image/mp3'
	};

	let file = new File([data], name + '.mp3', metadata);

	return file;
}
