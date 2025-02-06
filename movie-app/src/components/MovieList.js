import React, { useState, useEffect, useMemo } from "react";
import Select from "react-select";
import "./MovieList.css";

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [genres, setGenres] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 10;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [sortBy, setSortBy] = useState("title");

  useEffect(() => {
    fetch("https://raw.githubusercontent.com/prust/wikipedia-movie-data/master/movies.json")
      .then(response => {
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        return response.json();
      })
      .then(data => {
        setMovies(data);
        setGenres([...new Set(data.flatMap(movie => movie.genres))]);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const filteredMovies = useMemo(() => {
    return movies
      .filter(movie =>
        movie.title.toLowerCase().includes(searchTitle.toLowerCase()) &&
        (selectedGenres.length === 0 || movie.genres.some(genre => selectedGenres.includes(genre)))
      )
      .sort((a, b) => (a[sortBy] > b[sortBy] ? 1 : -1));
  }, [searchTitle, selectedGenres, movies, sortBy]);

  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = filteredMovies.slice(indexOfFirstMovie, indexOfLastMovie);

  const nextPage = () => {
    if (currentPage < Math.ceil(filteredMovies.length / moviesPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (loading) return <p>Loading movies...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className={darkMode ? "dark-mode" : ""}>
      <h1>Movie List</h1>
      <button onClick={() => setDarkMode(!darkMode)}>Toggle Dark Mode</button>

      <input
        type="text"
        placeholder="Search by title..."
        value={searchTitle}
        onChange={(e) => setSearchTitle(e.target.value)}
      />

      <Select
        options={genres.map(genre => ({ label: genre, value: genre }))}
        isMulti
        onChange={(selectedOptions) => setSelectedGenres(selectedOptions.map(option => option.value))}
      />

      <select onChange={(e) => setSortBy(e.target.value)}>
        <option value="title">Sort by Title</option>
        <option value="year">Sort by Year</option>
      </select>

      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Year</th>
            <th>Cast</th>
            <th>Genres</th>
            <th>Thumbnail</th>
          </tr>
        </thead>
        <tbody>
          {currentMovies.map((movie, index) => (
            <tr key={index}>
              <td>{movie.title}</td>
              <td>{movie.year}</td>
              <td>{movie.cast ? movie.cast.join(", ") : "N/A"}</td>
              <td>{movie.genres.join(", ")}</td>
              <td>{movie.thumbnail ? <img src={movie.thumbnail} alt={movie.title} width="50" /> : "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={prevPage} disabled={currentPage === 1}>Previous</button>
      <button onClick={nextPage} disabled={currentPage === Math.ceil(filteredMovies.length / moviesPerPage)}>Next</button>
    </div>
  );
};

export default MovieList;
