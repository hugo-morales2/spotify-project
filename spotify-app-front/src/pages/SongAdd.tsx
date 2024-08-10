import { useContext, useEffect, useState } from "react";
import PageButton from "../components/PageButton";

import { PlaylistData, Playlist } from "../utils/interfaces";

import { API_BASE_URL } from "../utils/config";
import { Button, Form } from "react-bootstrap";
import { AuthContext } from "../utils/AuthContext";

const SongAdd = () => {
  const [playlistData, setPlaylistData] = useState<Playlist[]>([]);
  const userID = localStorage.getItem("userID");

  const { accessToken } = useContext(AuthContext);

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
        console.log("call was made and responded to ");
        return response.json();
      })
      .then((response) => handlePlaylistData(response));
  }, [accessToken]);

  return (
    <>
      <div>
        <PageButton name="Home" link="/PageSelect" />
      </div>
      <h1>Add a song!</h1>
      <Form>
        <Form.Group className="mb-2" controlId="playlistSelect">
          <Form.Label>Choose a playlist: </Form.Label>
          <Form.Select aria-label="Choose a playlist: ">
            <option>Choose a playlist</option>
            {playlistData.map((playlist, index) => (
              <option key={index}>{playlist.name}</option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3" controlId="songName">
          <Form.Label>Enter the name of a song: </Form.Label>
          <Form.Control type="text" />
        </Form.Group>

        <h2>OR</h2>

        <Form.Group className="mb-3" controlId="songID">
          <Form.Label>Enter the song's Spotify ID: </Form.Label>
          <Form.Control type="text" />
        </Form.Group>
        <Button variant="primary" type="submit">
          Add Song!
        </Button>
      </Form>
    </>
  );
};

export default SongAdd;
