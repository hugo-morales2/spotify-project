import {
  ChangeEvent,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";

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
import Card from "../components/Card";

const initialFormState = {
  songName: "",
  artistName: "",
  songID: "",
};

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
  const [trackData, setTrackData] = useState<[Tracks[]]>([[]]);

  const [selectedTrack, setSelectedTrack] = useState<Tracks>();

  // CHANGe

  // handle the submission of the song name/artist form -> goal is to obtain a song ID for use with the ID form
  function handleNameSubmit(event: React.FormEvent<HTMLFormElement>) {
    function handleSearchResponse(data: searchResponse) {
      let rowList: Tracks[] = [];
      let pageList: Tracks[][] = [];

      for (let i = 0; i < data.tracks.items.length; i++) {
        if (data.tracks.items[i].name.length >= 25) {
          data.tracks.items[i].name =
            data.tracks.items[i].name.substring(0, 25) + "...";
        }

        rowList.push(data.tracks.items[i]);

        if (i % 16 == 15) {
          pageList.push([...rowList]);
          rowList = [];
        }
      }
      // if there are items left not in a row after the loop finishes then add then to their own row

      setTrackData([data.tracks.items]);
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
            limit: "50",
          })
        : new URLSearchParams({
            q: "artist:" + nameFormState.artistName,
            type: "track",
            limit: "50",
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
  function handleIdSubmit() {
    if (!selectedPlaylistId) {
      alert("No playlist selected!");
      return;
    }
    if (selectedTrack == undefined) {
      alert("No track selected!");
      return;
    }

    // NEED TO ADD VALIDATION OF ID -> IMPLEMENT IN THE FORM BEFORE SUBMIT

    console.log(selectedPlaylistId);
    const access = "Bearer " + accessToken;

    const uris = { uris: ["spotify:track:" + selectedTrack.id] };

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

  return (
    <>
      <div className="flex flex-col my-4 mx-4 w-auto h-full">
        <div className="flex-col space-y-4 bg-stone-800 p-6 mx-4 rounded-t-md ">
          <h1>Add a song!</h1>
          <Form.Group className="mb-2" controlId="playlistSelect">
            <Form.Select
              className="rounded-full p-1.5 text-black bg-gray-300"
              onChange={(e) => setSelectedPlaylistId(e.target.value)}
              value={selectedPlaylistId}
            >
              <option className="text-gray-400 bg-neutral-800 hover:bg-zinc-700">
                Choose a playlist
              </option>
              {playlistData.map((playlist) => (
                <option
                  className="text-gray-400 bg-neutral-800 hover:bg-zinc-700"
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
            <button className="p-3 mt-3 rounded-md bg-zinc-900 transition-colors duration-300 hover:bg-zinc-700 border-gray-950 border-2">
              Search
            </button>
          </Form>
        </div>
        <div className=" mx-4 p-6 bg-stone-800 rounded-b-md">
          <div className="flex flex-col h-full justify-between  ">
            Songs:
            <div className="grid grid-cols-2 md:grid-cols-8 justify-center gap-4 mt-3 mb-12 text-center flex-grow">
              {trackData.map((track) => (
                <Card
                  key={track.id}
                  cardStyle="within"
                  className=""
                  m="2"
                  func={() => setSelectedTrack(track)}
                >
                  <button className="" key={track.id}>
                    {track.name} - {track.artists[0].name}
                  </button>
                </Card>
              ))}
            </div>
            <div className="flex justify-center mt-auto space-x-3">
              <button
                onClick={() => {
                  handleIdSubmit();
                }}
                className={
                  "p-3 rounded-md" +
                  (selectedTrack == undefined
                    ? " bg-zinc-900 transition-colors duration-300 hover:bg-zinc-700 border-gray-950 border-2"
                    : "bg-zinc-700 transition-colors duration-300 hover:bg-zinc-500 border-gray-950 border-2")
                }
              >
                {"Add " +
                  (selectedTrack != undefined ? selectedTrack.name : "Song")}
              </button>
              <button
                onClick={() => setSelectedTrack(undefined)}
                className="p-3 rounded-md bg-zinc-900 transition-colors duration-300 hover:bg-zinc-700 border-gray-950 border-2"
              >
                Clear Selection
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SongAdd;
