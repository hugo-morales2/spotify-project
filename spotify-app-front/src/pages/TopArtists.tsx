import { useContext, useEffect, useReducer, useState } from "react";
import { AuthContext } from "../utils/AuthContext";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../utils/config";
import { Artist, searchResponse, genreStateForm } from "../utils/interfaces";
import { genreBlockReducer } from "../utils/reducers";

const TopArtists = () => {
  const navigate = useNavigate();
  const { accessToken } = useContext(AuthContext);
  const [selectedArtist, setSelectedArtist] = useState<Artist>();

  function handleArtistSelection(artist: Artist) {
    setSelectedArtist(artist);
    navigate("/ArtistPage", { state: { setArtist: artist } });
  }

  const isGenreKey = (key: string): key is keyof genreStateForm => {
    return key in initialGenreState;
  };

  const initialGenreState: genreStateForm = {
    pop: [],
    rock: [],
    indie: [],
    hiphop: [],
    rnb: [],
  };

  const genreMap = {
    pop: "Pop",
    rock: "Rock",
    indie: "Indie",
    hiphop: "Hip-Hop",
    rnb: "R&B",
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
      q: "genre:" + genreMap[genre],
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
      <div className="flex flex-col mt-4 text-center justify-center items-center h-full">
        <h1>Top Artists: </h1>
        <div className="flex flex-row ">
          {Object.entries(genreState).map(([genre, artists]) => (
            <div
              key={genre}
              className="bg-stone-900 text-zinc-300 rounded-xl px-5 py-3 mb-3 mt-6 mx-3 flex-1 flex flex-col justify-between"
            >
              <div className="flex flex-col w-full justify-between">
                <span className="font-bold mb-2">
                  Top {isGenreKey(genre) && genreMap[genre]} Artists:
                </span>
                {Array.isArray(artists) &&
                  artists.length > 0 &&
                  artists.map((artist: Artist, index: number) => (
                    <button
                      onClick={() => handleArtistSelection(artist)}
                      className="w-full hover:bg-slate-400 hover:rounded-md"
                      key={index}
                    >
                      {artist.name}
                    </button>
                  ))}
              </div>

              <button className="bg-neutral-700 p-2 rounded-xl hover:bg-gray-800 mt-6">
                View more
              </button>
            </div>
          ))}
        </div>
        {selectedArtist != undefined && <div>{selectedArtist.name}</div>}
      </div>
    </>
  );
};

export default TopArtists;
