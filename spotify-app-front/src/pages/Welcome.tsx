import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/welcome.css";

import { genChallenge, getCCAccessToken } from "../utils/ReactAuth";
import { CLIENT_ID, REDIRECT_URI, API_BASE_URL } from "../utils/config";

import { AlbumData, searchResponse, Artist } from "../utils/interfaces";

import BlackLogo from "../assets/blackLogo.png";
import WhiteLogo from "../assets/whiteLogo.png";

const client_id = CLIENT_ID;
const redirect_uri = REDIRECT_URI;

const Welcome = () => {
  const navigate = useNavigate();
  const [featAlbum, setFeatAlbum] = useState<AlbumData | null>(null);
  const [featArtist, setFeatArtist] = useState<Artist | null>(null);

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

  //
  //

  async function getRandomAlbum(access: string) {
    function choosePlaylist(resp: searchResponse) {
      const randomIndex = Math.floor(Math.random() * 15);
      console.log("bruvingon " + resp.albums.items[randomIndex]);
      setFeatAlbum(resp.albums.items[randomIndex]);
      setFeatArtist(resp.albums.items[randomIndex].artists[0]);
    }

    //
    const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");

    const params = new URLSearchParams({
      q: alphabet[Math.floor(Math.random() * alphabet.length)] + "%",
      type: "album",
    });

    // call to get the results of the user's search
    fetch(API_BASE_URL + "search?" + params.toString(), {
      method: "GET",
      headers: {
        Authorization: "Bearer " + access,
      },
    })
      .then((response) => response.json())
      .then((response) => choosePlaylist(response));
  }
  //
  //

  useEffect(() => {
    async function featuredAlbum() {
      const accessToken = await getCCAccessToken();
      getRandomAlbum(accessToken);
    }

    featuredAlbum();
  }, []);

  return (
    <>
      <div className="flex flex-col justify-center items-center h-full">
        <h1 className="mt-12">Spotify App</h1>
        <div>
          Featured Album: {featAlbum?.name} - {featArtist?.name}
        </div>

        <div className="flex justify-center">
          <button
            className="relative flex group my-6 w-26 items-center bg-white text-gray-900 px-5 py-3 rounded-lg transition-colors duration-300 hover:bg-spot-green hover:text-white"
            onClick={handleRedirect}
          >
            <img
              src={BlackLogo}
              className="w-6 h-6 mr-3 transition-opacity duration-300 group-hover:opacity-0"
            />
            <img
              src={WhiteLogo}
              className="w-6 h-6 mr-3 absolute transition-opacity duration-300 opacity-0 group-hover:opacity-100"
            />
            Log in with Spotify
          </button>
        </div>
      </div>
    </>
  );
};

export default Welcome;
