
// Här laddas DOM-innehållet innan js körs
document.addEventListener('DOMContentLoaded', async () => { 
	// Här hämtas alla element som vi behöver från html
    const pokemonSearchButton = document.querySelector('.pokemon-search-button');
    const pokemonSearchInput = document.querySelector('.pokemon-search-input');
    const suggestionsList = document.querySelector('.suggestions');
    const toggleBtn = document.getElementById('toggleBtn');
    const reserveContainer = document.getElementById('reserveContainer');
    const messageContainer = document.getElementById('messageContainer');

	// Här hämtas alla pokemon-namn från pokeapi
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1200');
    const data = await response.json();
    const pokemonNames = data.results.map(pokemon => pokemon.name);

	// Här skapar jag variabler för varje box i lineupen
    const lineupOneBoxes = [
        document.querySelector('.pokemon-box-one')
    ];

    const lineupTwoBoxes = [
        document.querySelector('.pokemon-box-two')
    ];

    const lineupThreeBoxes = [
        document.querySelector('.pokemon-box-three')
    ];

	// Här skapar jag variabler för att kunna se vilken box som är näst på tur
    let currentLineupOneBox = 0;
    let currentLineupTwoBox = 0;
    let currentLineupThreeBox = 0;

	// Här skapar jag en eventlistener för att kunna växla vy mellan lineup och reserves
    toggleBtn.addEventListener('click', () => {
        const pokemonSearchHeader = document.getElementById('pokemonSearchHeader');
        const suggestionsList = document.getElementsByClassName('suggestions')[0];
        const reserveHeader = document.getElementById('reservesHeader');

		// Här kollar jag om lineup är synligt, om den är det så göms den och reserves visas
        if (pokemonSearchHeader.style.display !== 'none') {
            pokemonSearchHeader.style.display = 'none';
            pokemonSearchInput.style.display = 'none';
            pokemonSearchButton.style.display = 'none';
            suggestionsList.style.display = 'none';
            reserveContainer.style.display = 'flex';
            reserveHeader.style.display = 'flex';
			toggleBtn.textContent = 'Search';
        } else {
            pokemonSearchHeader.style.display = 'flex';
            pokemonSearchInput.style.display = 'flex';
            pokemonSearchButton.style.display = 'flex';
            suggestionsList.style.display = 'flex';
            reserveContainer.style.display = 'none';
            reserveHeader.style.display = 'none';
			toggleBtn.textContent = 'Edit Line-Up';
        }
    });

	// Här skapar jag en eventlistener för att kunna söka efter pokemon
    pokemonSearchInput.addEventListener('input', () => {
        const inputValue = pokemonSearchInput.value.toLowerCase();
        suggestionsList.innerHTML = '';
        if (!inputValue) {
            return;
        }

	// Här filtrerar jag pokemon-namnen så att de som inte matchar inputen inte visas
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

	// Här skapar jag en eventlistener för att kunna lägga till pokemon i lineup
    const addPokeButtons = document.querySelectorAll('#addPoke');
    addPokeButtons.forEach(button => {
        button.addEventListener('click', () => {
            pokemonSearchInput.focus();
        });
    });

	// Här skapar jag en funktion för att visa meddelanden
    function showMessage(message, isFullTeam) {
        messageContainer.textContent = message;

		const isLineupFull = currentLineupOneBox === lineupOneBoxes.length &&
                            currentLineupTwoBox === lineupTwoBoxes.length &&
                            currentLineupThreeBox === lineupThreeBoxes.length;

        if (isFullTeam || isLineupFull) {
            setTimeout(() => {
                messageContainer.textContent = '';
            }, 1800);
        } else {
            setTimeout(() => {
                messageContainer.textContent = 'You have an open slot in your team.';
            }, 1800);
        }
    }

	// Här skapar jag en eventlistener för att kunna söka och lägga till pokemons
    pokemonSearchButton.addEventListener('click', async (event) => {
        event.preventDefault();
        const pokemName = pokemonSearchInput.value.toLowerCase();
        const url = `https://pokeapi.co/api/v2/pokemon/${pokemName}`;

		// Här hämtas pokemon-bilder från pokeapi
        try {
            const response = await fetch(url);
            const data = await response.json();
            const pokemonName = document.createElement('h3');
            pokemonName.textContent = data.name;

            const pokemonImage = document.createElement('img');
            pokemonImage.src = data.sprites.front_default;

            const nicknameInput = document.createElement('input');
            nicknameInput.type = 'text';
            nicknameInput.placeholder = 'Nickname';
            nicknameInput.autocomplete = 'off';

            const kickButton = document.createElement('button');
            kickButton.textContent = 'Kick';
            kickButton.addEventListener('click', () => {
                const box = kickButton.parentNode;
                box.innerHTML = '';

				// Här kollar jag vilken box som pokemonen ligger i och tar bort den från den boxen
                if (lineupOneBoxes.includes(box)) {
                    currentLineupOneBox = lineupOneBoxes.indexOf(box);
                } else if (lineupTwoBoxes.includes(box)) {
                    currentLineupTwoBox = lineupTwoBoxes.indexOf(box);
                } else if (lineupThreeBoxes.includes(box)) {
                    currentLineupThreeBox = lineupThreeBoxes.indexOf(box);
                }
            });

			// Här kollar jag vilken box som pokemonen ska läggas till i och lägger till den i den boxen
            if (currentLineupOneBox < lineupOneBoxes.length) {
                lineupOneBoxes[currentLineupOneBox].innerHTML = '';
                lineupOneBoxes[currentLineupOneBox].appendChild(pokemonImage);
                lineupOneBoxes[currentLineupOneBox].appendChild(pokemonName);
                lineupOneBoxes[currentLineupOneBox].appendChild(nicknameInput);
                lineupOneBoxes[currentLineupOneBox].appendChild(kickButton);
                currentLineupOneBox++;
                showMessage('Pokemon added to Lineup', false);
            } else if (currentLineupTwoBox < lineupTwoBoxes.length) {
                lineupTwoBoxes[currentLineupTwoBox].innerHTML = '';
                lineupTwoBoxes[currentLineupTwoBox].appendChild(pokemonImage);
                lineupTwoBoxes[currentLineupTwoBox].appendChild(pokemonName);
                lineupTwoBoxes[currentLineupTwoBox].appendChild(nicknameInput);
                lineupTwoBoxes[currentLineupTwoBox].appendChild(kickButton);
                currentLineupTwoBox++;
                showMessage('Pokemon added to Lineup', false);
            } else if (currentLineupThreeBox < lineupThreeBoxes.length) {
                lineupThreeBoxes[currentLineupThreeBox].innerHTML = '';
                lineupThreeBoxes[currentLineupThreeBox].appendChild(pokemonImage);
                lineupThreeBoxes[currentLineupThreeBox].appendChild(pokemonName);
                lineupThreeBoxes[currentLineupThreeBox].appendChild(nicknameInput);
                lineupThreeBoxes[currentLineupThreeBox].appendChild(kickButton);
                currentLineupThreeBox++;
                showMessage('Pokemon added to Lineup', false);
            } else {
                const reserveBox = document.createElement('div');
                reserveBox.className = 'reserve-box';
                reserveBox.appendChild(pokemonImage);
                reserveBox.appendChild(pokemonName);
                reserveContainer.appendChild(reserveBox);
				showMessage('Your team is full, added to reserves', false);
            }
        } catch (error) {
            showMessage('Pokemon not found', false);
        }
    });
});
