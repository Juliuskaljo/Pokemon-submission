// Väntar på att hemsidan ska ladda innan js körs

document.addEventListener('DOMContentLoaded', async () => {
    const pokemonSearchButton = document.querySelector('.pokemon-search-button');
    const pokemonSearchInput = document.querySelector('.pokemon-search-input');
	const suggestionsList = document.querySelector('.suggestions'); 

	const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1200'); 
    const data = await response.json(); 
    const pokemonNames = data.results.map(pokemon => pokemon.name);
	

	toggleBtn.addEventListener('click', () => {
		const pokemonSearchHeader = document.getElementById('pokemonSearchHeader');
		const pokemonSearchInput = document.getElementById('pokemonSearchInput');
		const suggestionsList = document.getElementsByClassName('suggestions') [0];
		const reserveContainer = document.getElementById('reserveContainer');
		const reserveHeader = document.getElementById('reservesHeader');
	
		if (pokemonSearchHeader.style.display !== 'none') {
			pokemonSearchHeader.style.display = 'none';
			pokemonSearchInput.style.display = 'none';
			pokemonSearchButton.style.display = 'none';
			suggestionsList.style.display = 'none';
			reserveContainer.style.display = 'flex';
			reserveHeader.style.display = 'flex';

		} else {
			pokemonSearchHeader.style.display = 'flex';
			pokemonSearchInput.style.display = 'flex';
			pokemonSearchButton.style.display = 'flex';
			suggestionsList.style.display = 'flex';
			reserveContainer.style.display = 'none';
			reserveHeader.style.display = 'none';
		}
	});

	// En eventlistener som lyssnar efter input i sökfältet
    pokemonSearchInput.addEventListener('input', () => {
		const inputValue = pokemonSearchInput.value.toLowerCase();
		suggestionsList.innerHTML = '';
		if (!inputValue) {
			return;
		}

		// En forEach som skapar en lista med pokemons som matchar det som skrivs in i sökfältet
		const suggestions = pokemonNames.filter(name => name.includes(inputValue));
		suggestions.forEach(suggestion => {
			const listItem = document.createElement('li');
			listItem.textContent = suggestion;
			listItem.addEventListener('click', () => {
				pokemonSearchInput.value = listItem.textContent;
				suggestionsList.innerHTML = '';
			});
			suggestionsList.appendChild(listItem);
		});
	});

const addPokeButtons = document.querySelectorAll('#addPoke');

addPokeButtons.forEach(button => {
    button.addEventListener('click', () => {
        pokemonSearchInput.focus();
    });
});

	let currentBox = 0;
const pokemonBoxes = [
    document.querySelector('.pokemon-box-one'),
    document.querySelector('.pokemon-box-two'),
    document.querySelector('.pokemon-box-three')
];
	
	// En eventlistener som lyssnar efter klick på sökknappen som också lägger till pokemonen i en låda
    pokemonSearchButton.addEventListener('click', async (event) => {
		event.preventDefault(); 
		const pokemName = pokemonSearchInput.value.toLowerCase();
		const url = `https://pokeapi.co/api/v2/pokemon/${pokemName}`;
		try {
			const response = await fetch(url);
			const data = await response.json();
			const pokemonName = document.createElement('h3');
			pokemonName.textContent = data.name;
			
			// hämtar sprite från api och lägger in i en img
			const pokemonImage = document.createElement('img');
			pokemonImage.src = data.sprites.front_default;

			const nicknameInput = document.createElement('input');
        nicknameInput.type = 'text';
        nicknameInput.placeholder = 'Nickname';
		nicknameInput.autocomplete = 'off';

		const kickButton = document.createElement('button');
        kickButton.textContent = 'Kick';
        kickButton.addEventListener('click', () => {
            kickButton.parentNode.innerHTML = '';
        });

			// kollar att lådorna är lediga, om inte så skrivs det ut i konsolen
			const reserveContainer = document.getElementById('reserveContainer');

			const box = pokemonBoxes.find(box => box.innerHTML === '');
			if (currentBox < pokemonBoxes.length) {
				pokemonBoxes[currentBox].innerHTML = '';
				pokemonBoxes[currentBox].appendChild(pokemonImage);
				pokemonBoxes[currentBox].appendChild(pokemonName);
				pokemonBoxes[currentBox].appendChild(nicknameInput);
				pokemonBoxes[currentBox].appendChild(kickButton);
				currentBox++;
			} else {
				const reserveBox = document.createElement('div');
    			reserveBox.className = 'reserve-box';
    			reserveBox.appendChild(pokemonImage);
    			reserveBox.appendChild(pokemonName);
    			reserveContainer.appendChild(reserveBox);
			}
		} catch (error) {
			
		}
	});
}); 