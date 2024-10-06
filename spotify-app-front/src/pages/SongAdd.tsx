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
  const [trackData, setTrackData] = useState<Tracks[][]>();

  const [selectedTrack, setSelectedTrack] = useState<Tracks>();
  const [currentPage, setCurrentPage] = useState<Tracks[]>([]);
  const pageIndex = useRef(0);

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
      if (rowList.length > 0) {
        pageList.push([...rowList]);
      }

      setTrackData(pageList);
      setCurrentPage(pageList[0]);
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
    console.log(pageIndex.current);
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

    if (trackData) setCurrentPage(trackData[0]);
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
      <div className="flex flex-col my-4 mx-4 w-auto h-full ">
        <div className="flex flex-col space-y-4 bg-stone-800 p-6 mx-4 rounded-t-md items-center ">
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

          <Form
            className="flex flex-col justify-center items-center place-content-center place-items-center"
            onSubmit={handleNameSubmit}
          >
            <div>
              <Form.Group className="mb-3 space-x-2" controlId="songName">
                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                  <div>
                    <Form.Control
                      className="text-center rounded-full p-1.5 text-black bg-gray-300"
                      type="text"
                      placeholder="Song Name"
                      name="songName"
                      value={nameFormState.songName}
                      onChange={(e) => handleTextChange(e)}
                    />
                  </div>
                  <div>
                    <Form.Control
                      className="text-center rounded-full p-1.5 text-black bg-gray-300"
                      type="text"
                      placeholder="Artist Name"
                      name="artistName"
                      value={nameFormState.artistName}
                      onChange={(e) => handleTextChange(e)}
                    />
                  </div>
                </div>
              </Form.Group>
            </div>
            <div>
              <button className="p-3 mt-3 rounded-md bg-zinc-900 transition-colors duration-300 hover:bg-zinc-700 border-gray-950 border-2">
                Search
              </button>
            </div>
          </Form>
        </div>
        <hr className="h-px mx-10 my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>
        <div className=" mx-4 p-6 bg-stone-800 rounded-b-md">
          <div className="flex flex-col h-full justify-between  ">
            Songs:
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 justify-center gap-4 mt-3 mb-12 text-center flex-grow">
              {currentPage.map((track) => (
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
            <div className="flex justify-center mt-auto items-center space-x-2">
              <button
                onClick={() => {
                  if (trackData) {
                    if (pageIndex.current >= 1) {
                      pageIndex.current -= 1;
                    }
                    setCurrentPage(trackData[pageIndex.current]);
                  }
                }}
                className="flex h-full p-3 rounded-md aspect-square w-12 items-center justify-center bg-zinc-900 transition-colors duration-300 hover:bg-zinc-700 border-gray-950 border-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6 self-center"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 19.5 8.25 12l7.5-7.5"
                  />
                </svg>
              </button>
              <button
                onClick={() => {
                  handleIdSubmit();
                }}
                className={
                  "px-3 h-12 rounded-md text-sm " +
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
                className="p-3 flex md:hidden rounded-md text-sm bg-zinc-900 transition-colors duration-300 hover:bg-zinc-700 border-gray-950 border-2"
              >
                Clear Selection
              </button>
              <button
                onClick={() => {
                  if (trackData) {
                    if (pageIndex.current <= trackData.length - 2) {
                      pageIndex.current += 1;
                    }
                    setCurrentPage(trackData[pageIndex.current]);
                  }
                }}
                className="flex h-full p-3  rounded-md aspect-square w-12 items-center justify-center bg-zinc-900 transition-colors duration-300 hover:bg-zinc-700 border-gray-950 border-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6 self-center"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m8.25 4.5 7.5 7.5-7.5 7.5"
                  />
                </svg>
              </button>
            </div>
            <div className="hidden md:flex ml-auto mr-4">
              <button
                onClick={() => setSelectedTrack(undefined)}
                className="p-3 rounded-md text-sm bg-zinc-900 transition-colors duration-300 hover:bg-zinc-700 border-gray-950 border-2"
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
