import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { UserData, PlaylistData, Playlist } from "../utils/interfaces";

import { API_BASE_URL } from "../utils/config";

const SongAdd = () => {
  const [playlistData, setPlaylistData] = useState<Playlist[]>([]);
  const navigate = useNavigate();

  function handlePlaylistData(data: PlaylistData) {
    setPlaylistData(data.items);
  }

  async function handleUserData(data: UserData) {
    localStorage.setItem("user_id", data.id);
  }

  useEffect(() => {
    // this will work until we have to refresh the token
    async function auth() {
      return localStorage.getItem("access_token");
    }

    // what to do after auth:
    auth().then(async (resp) => {
      const access = "Bearer " + resp;
      // get the userID and put it into localStorage
      fetch(API_BASE_URL + "me", {
        headers: {
          Authorization: access,
        },
      })
        .then((userResponse) => userResponse.json())
        .then((user) => {
          handleUserData(user);

          // get the user's playlists
          const userID = user.id;
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
        });
    });
  }, []);

  return (
    <>
      <div>
        <button onClick={() => navigate("/PageSelect")}></button>
      </div>
      <h1> User Playlists: </h1>
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

export default SongAdd;
