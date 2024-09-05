import {
  ChangeEvent,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import PageButton from "../components/PageButton";

import {
  PlaylistData,
  Playlist,
  searchResponse,
  Tracks,
} from "../utils/interfaces";

import { API_BASE_URL } from "../utils/config";
import { Form } from "react-bootstrap";
import { AuthContext } from "../utils/AuthContext";
import formReducer from "../utils/reducers";
import { useLocation } from "react-router-dom";

const initialFormState = {
  songName: "",
  artistName: "",
  songID: "",
};

// not implemented yet
// const initialPlaylistSet = {
//   selectedPlaylistId: "",
//   selectedTrackId: "",
//   selectedTrackName: "",
// };

const SongAdd = () => {
  // auth info
  const userID = localStorage.getItem("userID");
  const { accessToken } = useContext(AuthContext);

  // For if this page was triggered with a playlist pre selected
  const location = useLocation();

  // user's playlists ~ required for all song add logic
  const [playlistData, setPlaylistData] = useState<Playlist[]>([]);

  // states required for display -> look into useMemo() hook
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(
    location.state?.setAlbum.id || ""
  );

  const [nameFormState, dispatch] = useReducer(formReducer, initialFormState);

  const [trackData, setTrackData] = useState<Tracks[]>([]);

  // CHANGe

  // handle the submission of the song name/artist form -> goal is to obtain a song ID for use with the ID form
  function handleNameSubmit(event: React.FormEvent<HTMLFormElement>) {
    function handleSearchResponse(data: searchResponse) {
      console.log(data.tracks.items.length + " items found: ");
      for (let i = 0; i < data.tracks.items.length; i++) {
        console.log(
          data.tracks.items[i].name +
            " by " +
            data.tracks.items[i].artists[0].name
        );
      }
      setTrackData(data.tracks.items);
    }

    event.preventDefault();
    const access = "Bearer " + accessToken;

    const params =
      nameFormState.songName != ""
        ? new URLSearchParams({
            q:
              "track:" +
              nameFormState.songName +
              " artist:" +
              nameFormState.artistName,
            type: "track",
          })
        : new URLSearchParams({
            q: "artist:" + nameFormState.artistName,
            type: "track",
          });

    // call to get the results of the user's search
    fetch(API_BASE_URL + "search?" + params.toString(), {
      method: "GET",
      headers: {
        Authorization: access,
      },
    })
      // response.status to get status -> for success/fail
      .then((response) => response.json())
      .then((response) => handleSearchResponse(response));
  }

  // handle the submission of the ID form -> should add a song directly to selected playlist
  function handleIdSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedPlaylistId) {
      alert("no playlist selected!");
      return;
    }

    // NEED TO ADD VALIDATION OF ID -> IMPLEMENT IN THE FORM BEFORE SUBMIT

    console.log(selectedPlaylistId);
    const access = "Bearer " + accessToken;

    const uris = { uris: ["spotify:track:" + nameFormState.songID] };

    fetch(API_BASE_URL + "playlists/" + selectedPlaylistId + "/tracks", {
      method: "POST",
      body: JSON.stringify(uris),
      headers: {
        Authorization: access,
      },
    }).then((response) => {
      if (response.status == 201) console.log("Success!");
      return response;
    });
  }

  function handlePlaylistData(data: PlaylistData) {
    const userPlaylists = data.items.filter(
      (playlist) => playlist.owner.id === userID
    );
    setPlaylistData(userPlaylists);
  }
  useEffect(() => {
    if (!accessToken) return;
    const access = "Bearer " + accessToken;

    // get the user's playlists
    fetch(API_BASE_URL + "users/" + userID + "/playlists", {
      headers: {
        Authorization: access,
      },
    })
      .then((response) => {
        //console.log("call was made and responded to ");
        return response.json();
      })
      .then((response) => handlePlaylistData(response));
  }, [accessToken]);

  function handleTextChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    console.log("text change");
    dispatch({
      type: "HANDLE INPUT TEXT",
      field: event.target.name,
      payload: event.target.value,
    });
  }

  function handleTrackSelect(trackID: string) {
    dispatch({
      type: "HANDLE INPUT TEXT",
      field: "songID",
      payload: trackID,
    });
  }

  return (
    <>
      <div className="space-y-4">
        <div>
          <PageButton name="Home" link="/PageSelect" />
        </div>
        <h1>Add a song!</h1>
        <Form.Group className="mb-2" controlId="playlistSelect">
          <Form.Select
            className="rounded-full p-1.5 text-black bg-gray-300"
            onChange={(e) => setSelectedPlaylistId(e.target.value)}
            value={selectedPlaylistId}
          >
            <option className="text-black bg-gray-300">
              Choose a playlist
            </option>
            {playlistData.map((playlist) => (
              <option
                className="text-black bg-gray-300"
                value={playlist.id}
                key={playlist.id}
              >
                {playlist.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form onSubmit={handleNameSubmit}>
          <Form.Group className="mb-3 space-x-2" controlId="songName">
            <Form.Control
              className="text-center rounded-full p-1.5 text-black bg-gray-300"
              type="text"
              placeholder="Song Name"
              name="songName"
              value={nameFormState.songName}
              onChange={(e) => handleTextChange(e)}
            />
            <Form.Control
              className="text-center rounded-full p-1.5 text-black bg-gray-300"
              type="text"
              placeholder="Artist Name"
              name="artistName"
              value={nameFormState.artistName}
              onChange={(e) => handleTextChange(e)}
            />
          </Form.Group>
          <button className="pageSelectButton bg-gray-600 p-3 rounded-full hover:bg-gray-500">
            Search
          </button>
        </Form>

        <div>
          <div className="mb-6">Songs:</div>
          <div className="flex flex-wrap gap-4 justify-center">
            {trackData.map((track) => (
              <div
                className="bg-gray-600 p-3 rounded-md hover:bg-gray-500"
                key={track.id}
                onClick={() => handleTrackSelect(track.id)}
              >
                {track.name} - {track.artists[0].name}
              </div>
            ))}
          </div>
        </div>

        <Form onSubmit={handleIdSubmit}>
          <Form.Group className="mb-3" controlId="songID">
            <div className="mb-3">Enter the song's Spotify ID: </div>
            <Form.Control
              className="text-center rounded-full p-1.5 text-black bg-gray-300"
              type="text"
              name="songID"
              value={nameFormState.songID}
              onChange={(e) => handleTextChange(e)}
            />
          </Form.Group>
          <button className="pageSelectButton w-26 bg-gray-600 p-3 rounded-full hover:bg-gray-500">
            Add Song!
          </button>
        </Form>
      </div>
    </>
  );
};

export default SongAdd;
