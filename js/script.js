// Variables globales 
let allMovies = []; // Para almacenar todas las películas

// Al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    fetchMovies(); // Cargar películas al iniciar
});

// Función para obtener la lista de películas
function fetchMovies() {
    fetch('https://japceibal.github.io/japflix_api/movies-data.json')
        .then(response => response.json())
        .then(data => {
            allMovies = data; // Almacenar todas las películas
            console.log(allMovies); // Puedes comentar esto después de confirmar que funciona
        })
        .catch(error => console.error('Error fetching movies:', error));
}

// Función para mostrar películas filtradas
function displayMovies(movies) {
    const lista = document.getElementById("lista");
    lista.innerHTML = ''; // Limpiar la lista

    movies.forEach(movie => {
        const li = document.createElement("li");
        li.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");

        // Crear contenido para la película
        li.innerHTML = `
            <div>
                <h5>${movie.title}</h5>
                <span>${movie.tagline}</span>
                <div>${getStars(movie.vote_average)}</div> <!-- Mostrar estrellas -->
            </div>
        `;

        // Agregar evento de clic a la película
        li.addEventListener("click", () => {
            showMovieDetails(movie); // Mostrar detalles de la película
        });

        lista.appendChild(li);
    });
}

// Función para mostrar detalles de la película
function showMovieDetails(movie) {
    document.getElementById("movieTitle").innerText = movie.title;
    document.getElementById("movieOverview").innerText = movie.overview;

    // Obtener géneros
    const genres = movie.genres.map(genre => genre.name).join(", ");
    document.getElementById("movieGenres").innerText = genres;

    // Mostrar detalles adicionales
    document.getElementById("releaseYear").innerText = movie.release_date.split('-')[0]; // Año de lanzamiento
    document.getElementById("duration").innerText = `${movie.runtime} minutos`; // Duración
    document.getElementById("budget").innerText = `$${movie.budget.toLocaleString()}`; // Presupuesto
    document.getElementById("revenue").innerText = `$${movie.revenue.toLocaleString()}`; // Ganancias

    // Mostrar el contenedor de detalles
    document.getElementById("movieDetails").style.display = 'block';
}

// Función para obtener estrellas según el voto
function getStars(vote_average) {
    const stars = Math.round(vote_average / 2); // Convertir a una escala de 0-5
    let starsHTML = '';
    for (let i = 0; i < 5; i++) {
        if (i < stars) {
            starsHTML += '<span class="fa fa-star checked"></span>'; // Estrella llena
        } else {
            starsHTML += '<span class="fa fa-star"></span>'; // Estrella vacía
        }
    }
    return starsHTML;
}

// Agregar un evento al botón de búsqueda
document.getElementById("btnBuscar").addEventListener("click", function() {
    const searchTerm = document.getElementById("inputBuscar").value.toLowerCase().trim();

    // Ocultar el mensaje de error al inicio
    document.getElementById("error-message").style.display = 'none';

    if (searchTerm) {
        const filteredMovies = allMovies.filter(movie => {
            return (
                movie.title.toLowerCase().includes(searchTerm) ||
                (movie.genres && movie.genres.some(genre => genre.name.toLowerCase().includes(searchTerm))) ||
                (movie.tagline && movie.tagline.toLowerCase().includes(searchTerm)) ||
                (movie.overview && movie.overview.toLowerCase().includes(searchTerm))
            );
        });
        displayMovies(filteredMovies); // Mostrar películas filtradas

        // Limpiar el campo de entrada
        document.getElementById("inputBuscar").value = ''; // Aquí se vacía el input
    } else {
        // Mostrar mensaje de error
        const errorMessage = document.getElementById("error-message");
        errorMessage.innerText = "Por favor ingrese un título"; // Mensaje de error
        errorMessage.style.display = 'block'; // Mostrar el mensaje
        displayMovies([]); // Si no hay término de búsqueda, mostrar vacío
    }
});
