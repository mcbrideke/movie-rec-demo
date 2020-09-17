import React, { useEffect, useState } from "react";
import { Button, Card, CardActionArea, CardActions,  Select, CardContent, Typography, FormLabel, Input  } from '@material-ui/core';

import Genres from "./genres.json";
import Actors from "./actors.json";
import Keywords from "./keywords.json";

const apiKey = '95ae7f5873f8ed7d551d67d546cbfbf0';

const genreOptions = Genres.map(genre => (
    <option key={genre.id} value={genre.id}>{genre.name}</option>
));
const actorOptions = Actors.map(actor => (
    <option key={actor.id} value={actor.id}>{actor.name}</option>
));
const keywordOptions = Keywords.map(keyword => (
    <option key={keyword.id} value={keyword.id}>{keyword.name}</option>
));

function App() {
  const [movieList, setMovieList] = useState([]);
  const [showText, setShowText] = useState(false);
  const [movieInfo, setMovieInfo] = useState({
    genre: "",
    keyword: "",
    release: "",
    actor: ""
  });


  function setMovies(newMovie) {
    const checkList = movieList.filter(item => item.id === newMovie.results[0].id);
    if(checkList.length===0)
    {
      setMovieList([...movieList, newMovie.results[0]]);
    }
  }


  function removeFromList(id) {
    setMovieList(prevItems => prevItems.filter(item => item.id !== id))
  }

  const movieItemElements = movieList.slice(0).reverse().map(item => (
    <div style={{marginTop:"20px"}}>
    <Card key={item.id} style={{width:"70%"}}>
      <CardActionArea>
        <img
          src={`https://image.tmdb.org/t/p/w500/${item.poster_path}`}
          style={{height:"140px"}}
          alt="movie poster"
        />
        <CardContent>
          <Typography component="h2">
            {item.title}
          </Typography>
          <Typography component="p">
          {item.overview}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button onClick={() => removeFromList(item.id)} size="small" color="primary">
        delete
        </Button>
      </CardActions>
  </Card>
  </div>
  ))

  function searchMovie() {
    fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${movieInfo.genre}&with_cast=${movieInfo.actor}&with_keywords=${movieInfo.keyword}&${movieInfo.release}`)
      .then(res => res.json())
      .then((data) => {
        if (data.results.length > 0)
          setMovies(data);
        else {
          alert("no results found");
        }
      })
  }

  function handleChange(e) {
    const value = e.target.value;
    const name = e.target.name;
    setMovieInfo({
      ...movieInfo,
      [name]: value
    });
  }

  function handleSubmit(e) {
    //console.log(movieInfo);
    searchMovie();
    e.preventDefault();
  }
  const textList = movieList.slice(0).reverse().map(item => (
    <div>
      <p>{item.title}</p>
    </div>
  ));

  //console.log(movieList);

  return (
    <div>
      <h1>Movie Recommendations</h1>
  
      <form onSubmit={handleSubmit}>
        <FormLabel>
          Pick your favorite genre:
          <Select name="genre" value={movieInfo.genre} onChange={handleChange}>
            {genreOptions}
          </Select>
        </FormLabel><br/>
        <FormLabel>
          Pick your favorite actor:
          <Select name="actor" value={movieInfo.actor} onChange={handleChange}>
            {actorOptions}
          </Select>
        </FormLabel><br/>
        <FormLabel>
          New movie or classic:
          <Select name="release" value={movieInfo.release} onChange={handleChange}>
            <option value=""></option>
            <option value={`primary_release_date.gte=2000-01-01T00:00:00.000Z`}>new</option>
            <option value={`primary_release_date.lte=2000-01-01T00:00:00.000Z`}>classic</option>
          </Select>
        </FormLabel><br/>
        <FormLabel>
          Pick a keyword:
          <Select name="keyword" value={movieInfo.keyword} onChange={handleChange}>
            {keywordOptions}
          </Select>
        </FormLabel><br/>
        <Input type="submit" value="Submit" />
      </form>
      <Button onClick={() => setShowText(!showText)} size="small" color="primary">
        Show Text List
      </Button>
      <div>{showText && textList}</div>
      {movieItemElements}
    </div>
  )
}

export default App
