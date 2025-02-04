import React, { useState, useEffect } from "react";
import Search from "./components/Search";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";
import { useDebounce } from "react-use";
import { updateSearchCount } from "./appwrite";
import { getTrendingMovies } from "./appwrite";
import MovieModal from "./components/MovieModal";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [errMessage, setErrMessage] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);

  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);
  const fetchMovies = async (query = "") => {
    setIsLoading(true);
    setErrMessage("");
    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURI(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS);
      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }
      const data = await response.json();
      if (data.Response === "False") {
        setErrMessage(data.Error || "Failed to fetch movies");
        setMovieList([]);
        return;
      }
      setMovieList(data.results || []);

      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }
    } catch (err) {
      console.log(`Error fetching movies: ${err}`);
      setErrMessage("Error fetching movies");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMovieDetails = async (movieId) => {
    const url = `https://api.themoviedb.org/3/movie/${movieId}?`;

    try {
      const response = await fetch(url, API_OPTIONS);
      if (!response.ok) {
        throw new Error(`Failed to fetch movie details (${response.status})`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching movie ID ${movieId}:`, error);
      return null;
    }
  };

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();
      // Fetch additional details for each trending movie
      const movieDetailsPromises = movies.map(async (movie) => {
        const details = await fetchMovieDetails(movie.movie_id);
        return {
          ...movie,
          ...details, // Spread the full movie details (poster, overview, etc.)
        };
      });
      const fullTrendingMovies = await Promise.all(movieDetailsPromises);
      setTrendingMovies(fullTrendingMovies);
    } catch (error) {
      console.error(`Error fetching trending movies: ${error}`);
    }
  };
  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    loadTrendingMovies();
  }, []);

  useEffect(() => {
    console.log("Selected Movie Updated:", selectedMovie);
  }, [selectedMovie]);

  return (
    <main>
      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
      <div className="pattern">
        <div className="wrapper">
          <header>
            <img src="./hero-img.png" alt="Hero Banner" />
            <h1>
              Discover Your Favorite{" "}
              <span className="text-gradient">Movie</span> Start Watching Now!
            </h1>
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </header>
          {trendingMovies.length > 0 && (
            <section className="trending">
              <h2>Trending Movies</h2>
              <ul>
                {trendingMovies.map((movie, index) => (
                  <li key={movie.$id}>
                    <p>{index + 1}</p>
                    <img
                      className="cursor-pointer"
                      src={
                        movie.poster_url ? movie.poster_url : "/No-Poster-1.png"
                      }
                      alt={movie.title || "No Title"}
                      onClick={() => setSelectedMovie(movie)}
                    />
                  </li>
                ))}
              </ul>
            </section>
          )}
          <section className="all-movies">
            <h2>All Movies</h2>
            {isLoading ? (
              <div className="text-white">
                <Spinner />
              </div>
            ) : errMessage ? (
              <p className="text-red-500">{errMessage}</p>
            ) : (
              <ul>
                {movieList.map((movie) => (
                  <div key={movie.id} onClick={() => setSelectedMovie(movie)}>
                    <MovieCard movie={movie} />
                  </div>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default App;
