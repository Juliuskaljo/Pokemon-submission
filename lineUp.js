document.addEventListener('DOMContentLoaded', async () => {
    const pokemonSearchButton = document.querySelector('.pokemon-search-button');
    const pokemonSearchInput = document.querySelector('.pokemon-search-input');
    const suggestionsList = document.querySelector('.suggestions');
    const toggleBtn = document.getElementById('toggleBtn');
    const reserveContainer = document.getElementById('reserveContainer');
    const messageContainer = document.getElementById('messageContainer');

    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1200');
    const data = await response.json();
    const pokemonNames = data.results.map(pokemon => pokemon.name);

    const lineupOneBoxes = [
        document.querySelector('.pokemon-box-one')
    ];

    const lineupTwoBoxes = [
        document.querySelector('.pokemon-box-two')
    ];

    const lineupThreeBoxes = [
        document.querySelector('.pokemon-box-three')
    ];

    let currentLineupOneBox = 0;
    let currentLineupTwoBox = 0;
    let currentLineupThreeBox = 0;

    toggleBtn.addEventListener('click', () => {
        const pokemonSearchHeader = document.getElementById('pokemonSearchHeader');
        const suggestionsList = document.getElementsByClassName('suggestions')[0];
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

    pokemonSearchInput.addEventListener('input', () => {
        const inputValue = pokemonSearchInput.value.toLowerCase();
        suggestionsList.innerHTML = '';
        if (!inputValue) {
            return;
        }

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

    pokemonSearchButton.addEventListener('click', async (event) => {
        event.preventDefault();
        const pokemName = pokemonSearchInput.value.toLowerCase();
        const url = `https://pokeapi.co/api/v2/pokemon/${pokemName}`;
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

                if (lineupOneBoxes.includes(box)) {
                    currentLineupOneBox = lineupOneBoxes.indexOf(box);
                } else if (lineupTwoBoxes.includes(box)) {
                    currentLineupTwoBox = lineupTwoBoxes.indexOf(box);
                } else if (lineupThreeBoxes.includes(box)) {
                    currentLineupThreeBox = lineupThreeBoxes.indexOf(box);
                }
            });

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
                showMessage('Pokemon added to Reserves', false);
            }
        } catch (error) {
            showMessage('Pokemon not found', false);
        }
    });
});
