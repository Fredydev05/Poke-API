const listaPokemon = document.querySelector("#listaPokemon");
const navList = document.querySelector(".nav-list")
const btnHeader = document.querySelectorAll(".btn-header");
let URL = "https://pokeapi.co/api/v2/pokemon/";



for (let i=1; i<=151; i++){
    fetch(URL + i)
        .then(response => response.json())
        .then(data => mostrarPokemon(data))

}
    
function mostrarPokemon(pokemon){
    let tipo = pokemon.types.map(type => `<p class="${type.type.name} tipo">${type.type.name}</p>`)
    tipo.join(``);
    let pokeID = pokemon.id.toString();
    console.log(pokeID)
    if(pokeID.length === 1){
        pokeID = "00" + pokeID;
    }else if(pokeID.length === 2){
        pokeID = "0" + pokeID;
    }


    const div = document.createElement("div");
    div.classList.add("pokemon");
    div.innerHTML = `
        <p class="pokemon-id-back">#${pokeID}</p>
        <div class="pokemon-imagen">
            <img
            src="${pokemon.sprites.other["official-artwork"].front_default}"
            alt="${pokemon.name}"/>
        </div>
        <div class="pokemon-info">
            <div class="nombre-contenedor">
                <p class="pokemon-id">#${pokeID}</p>
                <h2 class="pokemon-nombre">${pokemon.name}</h2>
            </div>
            <div class="pokemon-tipos">
                ${tipo}
            </div>
            <div class="pokemon-stats">
                <p class="stat">${pokemon.height}m</p>
                <p class="stat">${pokemon.weight}kg</p>
            </div>
        </div>
    `;
    listaPokemon.append(div);
}


btnHeader.forEach(boton => boton.addEventListener("click", (event) =>{
    const btnID = event.currentTarget.id;

    listaPokemon.innerHTML = "";
        
    for (let i=1; i<=151; i++){
        fetch(URL + i)
            .then(response => response.json())
            .then(data => {
                if(btnID === "ver-todos"){
                    mostrarPokemon(data);
                }else{
                    const tipos = data.types.map(type => type.type.name );

                    if(tipos.some(tipo => tipo.includes(btnID))){
                        mostrarPokemon(data)
                    }
                }
                
            })
    }
}))

const showBtn = document.querySelector(".show-nav");
showBtn.addEventListener("click",  () => showNavBtn());

function showNavBtn(){
    if(navList.classList.contains("none") || navList.classList.contains("hidden-list")){
        navList.classList.remove("none");
        navList.classList.remove("hidden-list");
        navList.classList.add("show-list");
    }else{
        navList.classList.add("hidden-list");
        setTimeout(() => {
        navList.classList.add("none");
        }, "400");          
        navList.classList.remove("show-list");
    }
}


const search = document.querySelector(".search-input");
const URL2 = "https://pokeapi.co/api/v2/pokemon?limit=151"; 
let allPokemons = [];

fetch(URL2)
    .then(response => response.json())
    .then(data => {
        allPokemons = data.results; 
    })
    .catch(error => console.error("Error:", error));

function debounce(func, delay) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

function buscarPokemon() {
    let searchPoke = search.value.toLowerCase(); 
    listaPokemon.innerHTML = ""; 

    const filteredPokemons = allPokemons.filter(pokemon => 
        pokemon.name.toLowerCase().includes(searchPoke)
    );

    filteredPokemons.forEach(pokemon => {
        fetch(pokemon.url)
            .then(response => response.json())
            .then(data => mostrarPokemon(data))
            .catch(error => console.error("Error:", error));
    });
}

search.addEventListener("keyup", debounce(buscarPokemon, 300));
