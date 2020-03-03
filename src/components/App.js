import React, { useEffect, useReducer } from 'react';
import '../App.css';
import Header from './Header'
import Movie from './Movie'
import Search from './Search'

const MOVIE_API_URL = "https://www.omdbapi.com/?s=man&apikey=4a3b711b";

const initialState = {
  loading: true,
  movies: [],
  errorMessage: null
};

const reduce = ( state, action ) => {
  switch ( action.type ) {
    case "SEARCH_MOVIES_REQUEST":
      return {
        ...state,
        loading: true,
        errorMessage: null
      };
    case "SEARCH_MOVIES_SUCESS":
      return {
        ...state,
        loading: false,
        movies: action.payload
      }
    case "SEARCH_MOVIES_FAILURE":
      return {
        ...state,
        loading: false,
        errorMessage: action.error
      }
    default:
      return state;
  }
}

const App = () => {
  const [state, dispatch] = useReducer( reduce, initialState )

  useEffect( () => {
    fetch( MOVIE_API_URL )
      .then( response => response.json() )
      .then( JsonResponse => {
        dispatch( {
          type: "SEARCH_MOVIES_SUCESS",
          payload: JsonResponse.Search
        } )
      } );
  }, [] )

  const search = searchValue => {
    dispatch( {
      type: "SEARCH_MOVIES_REQUEST"
    } )

    fetch( `https://www.omdbapi.com/?s=${searchValue}&apikey=4a3b711b` )
      .then( response => response.json() )
      .then( JsonResponse => {
        if ( JsonResponse.Response === "True" ) {
          dispatch( {
            type: "SEARCH_MOVIES_SUCESS",
            payload: JsonResponse.Search
          } )
        } else {
          dispatch( {
            type: "SEARCH_MOVIES_FAILURE",
            error: JsonResponse.Error
          } )
        }
      } )
  }

  const { movies, errorMessage, loading } = state;

  return (
    <div className="App">
      <Header text="HookeD" />
      <Search search={search} />
      <p className="App-intro">Compartilhando um pouco de nossos filmes</p>
      <div className="movies">
        {loading && !errorMessage ? (
          <span>Loading...</span>
        ) : errorMessage ? (
          <div className="errorMessage">{errorMessage}</div>
        ) : (
              movies.map( ( movie, index ) => (
                <Movie key={`${index} - ${movie.Title}`} movie={movie} />
              ) )
            )}
      </div>
    </div>

  )
}

export default App;
