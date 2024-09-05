import { useContext, useEffect, useReducer } from "react";
import PageButton from "../components/PageButton";
import { AuthContext } from "../utils/AuthContext";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../utils/config";
import { Artist, searchResponse, genreStateForm } from "../utils/interfaces";
import { genreBlockReducer } from "../utils/reducers";

const TopArtists = () => {
  const navigate = useNavigate();
  const { accessToken } = useContext(AuthContext);

  const initialGenreState: genreStateForm = {
    pop: [],
    rock: [],
    indie: [],
    hiphop: [],
    rnb: [],
  };

  const [genreState, dispatch] = useReducer(
    genreBlockReducer,
    initialGenreState
  );

  async function getGenreArtists(genre: keyof genreStateForm) {
    function handleSearchResponse(resp: searchResponse) {
      // should get the artists and put them in a list format, which will then be put
      // in the reducer to change each genre block's list of artists
      const artists: Artist[] = resp.artists.items;

      dispatch({
        type: "HANDLE ARTISTS",
        field: genre,
        payload: artists,
      });
    }
    const params = new URLSearchParams({
      q: "genre:" + genre,
      type: "artist",
    });
    fetch(API_BASE_URL + "search?" + params.toString(), {
      method: "GET",
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    })
      .then((response) => response.json())
      .then((response) => handleSearchResponse(response));
  }

  useEffect(() => {
    const isGenreKey = (key: string): key is keyof genreStateForm => {
      return key in initialGenreState;
    };

    Object.keys(genreState).forEach((key) => {
      if (isGenreKey(key)) {
        getGenreArtists(key); // No type assertion needed
      }
    });
    // Object.keys(genreState).forEach((key) => {
    //   getGenreArtists(key)
    // })
  }, []);

  return (
    <>
      <PageButton name="Home" link="/PageSelect" />
      <div>
        <div className="bg-slate-500 rounded-xl px-5 py-3 my-3 mx-auto">
          Top Pop Artists:
          {genreState.pop.length > 0 &&
            genreState.pop.map((artist: Artist, index: number) => (
              <div key={index}>
                {index + 1} : {artist.name}
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default TopArtists;
