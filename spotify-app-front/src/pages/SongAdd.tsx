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
import { Button, Card, Dropdown, DropdownButton, Form } from "react-bootstrap";
import { AuthContext } from "../utils/AuthContext";
import formReducer from "../utils/reducers";

const initialFormState = {
  songName: "",
  artistName: "",
  songID: "",
};

// not implemented yet
const initialPlaylistSet = {
  selectedPlaylistId: "",
  selectedTrackId: "",
  selectedTrackName: "",
};

const SongAdd = () => {
  // auth info
  const userID = localStorage.getItem("userID");
  const { accessToken } = useContext(AuthContext);

  // user's playlists ~ required for all song add logic
  const [playlistData, setPlaylistData] = useState<Playlist[]>([]);

  // states required for display -> look into useMemo() hook
  const [selectedPlaylistId, setSelectedPlaylistId] = useState("");

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
    const params = new URLSearchParams({
      q:
        "track:" +
        nameFormState.songName +
        " artist:" +
        nameFormState.artistName,
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
      <div>
        <PageButton name="Home" link="/PageSelect" />
      </div>
      <h1>Add a song!</h1>
      <Form.Group className="mb-2" controlId="playlistSelect">
        <Form.Label>Choose a playlist: </Form.Label>
        <Form.Select
          aria-label="Choose a playlist: "
          onChange={(e) => setSelectedPlaylistId(e.target.value)}
        >
          <option>Choose a playlist</option>
          {playlistData.map((playlist) => (
            <option value={playlist.id} key={playlist.id}>
              {playlist.name}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <Form onSubmit={handleNameSubmit}>
        <Form.Group className="mb-3" controlId="songName">
          <Form.Label>Enter a song and/or artist: </Form.Label>
          <Form.Control
            type="text"
            placeholder="Song Name"
            name="songName"
            value={nameFormState.songName}
            onChange={(e) => handleTextChange(e)}
          />
          <Form.Control
            type="text"
            placeholder="Artist Name"
            name="artistName"
            value={nameFormState.artistName}
            onChange={(e) => handleTextChange(e)}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Search
        </Button>
      </Form>

      <Card style={{ width: "18rem" }}>
        {/* <Card.Img variant="top" src="holder.js/100px180" /> */}
        <Card.Body>
          <DropdownButton id="dropdown-basic-button" title="Songs">
            {trackData.map((track) => (
              <Dropdown.Item
                key={track.id}
                onClick={() => handleTrackSelect(track.id)}
              >
                {track.name}
              </Dropdown.Item>
            ))}
          </DropdownButton>
        </Card.Body>
      </Card>

      <h2>OR</h2>
      <Form onSubmit={handleIdSubmit}>
        <Form.Group className="mb-3" controlId="songID">
          <Form.Label>Enter the song's Spotify ID: </Form.Label>
          <Form.Control
            type="text"
            name="songID"
            value={nameFormState.songID}
            onChange={(e) => handleTextChange(e)}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Add Song!
        </Button>
      </Form>
    </>
  );
};

export default SongAdd;
