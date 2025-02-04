import React from "react";

const MovieModal = ({ movie, onClose }) => {
  if (!movie) return null;

  return (
    <div
      className="fixed inset-0 flex justify-center items-center bg-black/60 z-50"
      onClick={onClose} // Clicking outside the modal closes it
    >
      <div
        className="movie-card relative flex flex-row shadow-lg max-w-[85%] max-h[90%]"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <button
          className="absolute top-4 right-4 cursor-pointer"
          onClick={onClose}
        >
          <span className="text-white">&#10005;</span>
        </button>
        <div className="flex flex-col md:gap-[2rem] md:flex-row">
          <div className="flex justify-center">
            <img
              className="mt-2 w-35 md:w-75 sm:max-w-[350px] sm:w-50 block mx-auto"
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
                  : "/No-Poster-1.png"
              }
              alt={movie.title}
            />
          </div>
          <div className="mt-2 max-w-[350px] md:max-w-[500px] sm:max-w-[400px] flex flex-col gap-2 md:gap-6">
            <h2 className="text-md md:text-3xl font-bold">{movie.title}</h2>
            <div>
              <div className="rating">
                <img src="star.svg" alt="Star Icon" />
                <p>
                  {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
                </p>
              </div>
            </div>
            <p className="mt-2 text-sm md:text-md lg:text-lg text-white tracking-wide">
              {movie.overview}
            </p>
            <p className="mt-2 text-white text-sm md:text-md">
              Released:{" "}
              <span className="font-semibold">
                {movie.release_date || "N/A"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieModal;
