import { useEffect, useRef, useState } from "react";

import { UserData, PlaylistData, Playlist } from "../utils/interfaces";

import { API_BASE_URL } from "../utils/config";
import { authorize } from "../utils/ReactAuth";

const SongAdd = () => {
  const [playlistData, setPlaylistData] = useState<Playlist[]>([]);

  function handleUserData(data: UserData) {
    localStorage.setItem("user_id", data.id);
  }

  function handlePlaylistData(data: PlaylistData) {
    setPlaylistData(data.items);
  }

  const working = useRef(false);

  useEffect(() => {
    // this will work until we have to refresh the token
    if (working.current == true) {
      console.log("useEffect ignored");
      return;
    }

    // authorize the app and get the access token
    const auth = async () => {
      // the logic here will eventually be: if the token has expired, then don't run this. Else, run it.
      // change when you can
      if (localStorage.getItem("access_token") == null) {
        working.current = true;
        const token_resp = await authorize();

        if (token_resp.access_token != undefined) {
          localStorage.setItem("access_token", token_resp.access_token);
          console.log(
            "Access token put in local memory: " + token_resp.access_token
          );
        }
      } else {
        console.log("Nothing happened: there is already a valid access token");
      }

      const at = localStorage.getItem("access_token");
      if (!at) throw Error("Access token is null");
    };

    // The rest of the calls after the auth
    auth().then(() => {
      const access = "Bearer " + localStorage.getItem("access_token");
      // get the user playlists
      fetch(API_BASE_URL + "me", {
        headers: {
          Authorization: access,
        },
      })
        .then((response) => response.json())
        .then((response) => handleUserData(response));

      // get the user's playlists
      const userID = localStorage.getItem("user_id");
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
  }, []);

  return (
    <>
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
