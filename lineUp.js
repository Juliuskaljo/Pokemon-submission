// Väntar på att hemsidan ska ladda innan js körs

document.addEventListener('DOMContentLoaded', async () => {
    const pokemonSearchButton = document.querySelector('.pokemon-search-button');
    const pokemonSearchInput = document.querySelector('.pokemon-search-input');
	const suggestionsList = document.querySelector('.suggestions'); 

	const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1200'); 
    const data = await response.json(); 
    const pokemonNames = data.results.map(pokemon => pokemon.name); 

	// En eventlistener som lyssnar efter input i sökfältet
    pokemonSearchInput.addEventListener('input', () => {
        const inputValue = pokemonSearchInput.value.toLowerCase();
        const suggestions = pokemonNames.filter(name => name.includes(inputValue));
		suggestionsList.innerHTML = ''; 
        suggestions.forEach(suggestion => {
            const listItem = document.createElement('li');
            listItem.textContent = suggestion;
            suggestionsList.appendChild(listItem);
        });
		
        // Display these suggestions to the user
    });

	pokemonSearchInput.addEventListener('blur', () => {
		suggestionsList.innerHTML = '';
	});

	let currentBox = 0;
const pokemonBoxes = [
    document.querySelector('.pokemon-box-one'),
    document.querySelector('.pokemon-box-two'),
    document.querySelector('.pokemon-box-three')
];

    pokemonSearchButton.addEventListener('click', async (event) => {
		event.preventDefault(); 
		const pokemName = pokemonSearchInput.value.toLowerCase();
		const url = `https://pokeapi.co/api/v2/pokemon/${pokemName}`;
		try {
			const response = await fetch(url);
			const data = await response.json();
			const pokemonName = document.createElement('h3');
			pokemonName.textContent = data.name;
			if (currentBox < pokemonBoxes.length) {
				pokemonBoxes[currentBox].innerHTML = '';
				pokemonBoxes[currentBox].appendChild(pokemonName);
				currentBox++;
			} else {
				console.log('All boxes are filled');
			}
		} catch (error) {
			console.log(error);
		}
	});
});