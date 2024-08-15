import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { genChallenge, getCCAccessToken } from "../utils/ReactAuth";
import { CLIENT_ID, REDIRECT_URI } from "../utils/config";

import { AlbumData } from "../utils/interfaces";
import { Button } from "react-bootstrap";
const client_id = CLIENT_ID;
const redirect_uri = REDIRECT_URI;

const Welcome = () => {
  const navigate = useNavigate();
  const [featAlbum, setFeatAlbum] = useState<AlbumData | null>(null);

  const handleRedirect = async () => {
    // YOU NEED TO REFRESH THE ACCESS TOKEN. THIS LINE SHOULD BE IF THE ACCESS TOKEN EXISTS AND IS NOT EXPIRED
    if (!localStorage.getItem("access_token")) {
      const code_challenge = await genChallenge();
      const scope =
        "playlist-read-private playlist-read-collaborative user-read-private user-read-email playlist-modify-public playlist-modify-private";
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
    } else {
      navigate("/PageSelect");
    }
  };

  // const handleResponse = (resp: AlbumData) => {

  // };

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
    async function featuredAlbum() {
      const accessToken = await getCCAccessToken();

      console.log("Making the call with: " + accessToken);
      fetch(AlbumURL, {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      })
        .then((response) => response.json())
        .then((JSONresp) => setFeatAlbum(JSONresp));
    }

    featuredAlbum();
  }, []);

  return (
    <>
      <div className="featAlbum">Feat Album: {featAlbum?.name}</div>
      <h1>Spotify App</h1>
      <div className="card">
        <Button variant="secondary" onClick={handleRedirect}>
          Log in with Spotify
        </Button>
      </div>
    </>
  );
};

export default Welcome;
