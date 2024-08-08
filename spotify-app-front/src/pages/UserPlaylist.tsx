import PageButton from "../components/PageButton";
import { useContext, useEffect, useState } from "react";

import { UserData, PlaylistData, Playlist } from "../utils/interfaces";

import { API_BASE_URL } from "../utils/config";
import { AuthContext } from "../utils/AuthContext";

const UserPlaylist = () => {
  const { accessToken } = useContext(AuthContext);
  const [playlistData, setPlaylistData] = useState<Playlist[]>([]);
  const userID = localStorage.getItem("userID");

  function handlePlaylistData(data: PlaylistData) {
    setPlaylistData(data.items);
  }

  useEffect(() => {
    const access = "Bearer " + accessToken;

    // get the user's playlists
    fetch(API_BASE_URL + "users/" + userID + "/playlists", {
      headers: {
        Authorization: access,
      },
    })
      .then((response) => {
        console.log(
          `Received response from ${
            API_BASE_URL + "users/" + userID + "/playlists"
          }`
        );
        return response.json();
      })
      .then((response) => handlePlaylistData(response));

    // });
  }, []);

  return (
    <>
      <div>
        <PageButton name="Home" link="/PageSelect" />
      </div>
      <h1> User's Saved Playlists: </h1>
      <div>
        {playlistData.map((item, index) => (
          <div key={index}>
            {index + 1} : {item.name}
          </div>
        ))}
      </div>
    </>
  );
};

export default UserPlaylist;
