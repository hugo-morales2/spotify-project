import { useEffect, useState } from "react";

import { genChallenge } from "../utils/ReactAuth";
import { CLIENT_ID, REDIRECT_URI, API_BASE_URL } from "../utils/config";

import { AlbumData } from "../utils/interfaces";

const client_id = CLIENT_ID;
const redirect_uri = REDIRECT_URI;

const Welcome = () => {
  const [data, setData] = useState<AlbumData | null>(null);

  const handleRedirect = async () => {
    const code_challenge = await genChallenge();
    const scope =
      "user-read-private user-read-email playlist-modify-public playlist-modify-private";
    const authUrl = new URL("https://accounts.spotify.com/authorize");

    const params = {
      response_type: "code",
      client_id: client_id,
      scope: scope,
      code_challenge_method: "S256",
      code_challenge: code_challenge,
      redirect_uri: redirect_uri,
    };

    authUrl.search = new URLSearchParams(params).toString();
    window.location.href = authUrl.toString();
  };

  const handleResponse = (resp: AlbumData) => {
    setData(resp);
  };

  const KdotAlbums = [
    "79ONNoS4M9tfIA1mYLBYVX",
    "4alcGHjstaALJHHiljfy3H",
    "0kL3TYRsSXnu0iJvFO3rud",
    "3DGQ1iZ9XKUQxAUWjfC34w",
    "7ycBtnsMtyVbbwTfJwRjSP",
  ];
  let AlbumURL =
    "https://api.spotify.com/v1/albums/" +
    KdotAlbums[Math.floor(Math.random() * KdotAlbums.length)];

  useEffect(() => {
    let accessToken = localStorage.getItem("my_access");

    fetch(AlbumURL, {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    })
      .then((response) => response.json())
      .then((JSONresp) => handleResponse(JSONresp));
  }, []);

  return (
    <>
      <div className="featAlbum">Feat Album: {data?.name}</div>
      <h1>Spotify App</h1>
      <div className="card">
        <button onClick={handleRedirect}>Log in with Spotify</button>
      </div>
    </>
  );
};

export default Welcome;
