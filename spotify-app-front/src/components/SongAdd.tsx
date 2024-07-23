import { useEffect, useState } from "react";

//import { authorize } from "../utils/ReactAuth";
import { UserData, PlaylistData, TokenResponse } from "../utils/interfaces";

import {
  API_BASE_URL,
  TOKEN_URL,
  REDIRECT_URI,
  CLIENT_ID,
} from "../utils/config";

const SongAdd = () => {
  const [playlistData, setPlaylistData] = useState<PlaylistData | null>(null);
  const [accessToken, setAccessToken] = useState<string>("");
  function handleUserData(data: UserData) {
    localStorage.setItem("user_id", data.id);
  }

  function handlePlaylistData(data: PlaylistData) {
    setPlaylistData(data);
  }

  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");

  if (!code) throw Error("Error: code");
  console.log("Code outside function: " + code);

  useEffect(() => {
    // const abortController = new AbortController();

    // authorize the app and get the access token
    const authF = async function auth(code: string) {
      console.log("start auth...");
      //async function authorize() {
      // function handleTokenResponse(response: TokenResponse) {
      //   localStorage.setItem("access_token", response.access_token);
      //   console.log("beep bada boop bap i now have the code");
      //   console.log(JSON.stringify(response));
      // }

      console.log(`code inside async auth(): ${code}`);

      let codeVerifier = localStorage.getItem("code_verifier");
      // console.log("code verifier: " + codeVerifier);
      if (!codeVerifier) throw Error("Error: no code verifier");

      console.log(
        `codeverifier inside async auth(): ${codeVerifier} before calling ${TOKEN_URL}`
      );

      const r = await fetch(TOKEN_URL, {
        method: "POST",
        body: new URLSearchParams({
          grant_type: "authorization_code",
          client_id: CLIENT_ID,
          code,
          redirect_uri: REDIRECT_URI,
          code_verifier: codeVerifier,
        }),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      // .then((resp) => resp.json())
      // .then((resp) => handleTokenResponse(resp));
      //}
      //authorize();

      const jr = await r.json();

      console.log("end async auth... returning");

      // return jr.access_token;
      // handleTokenResponse(jr);
      setAccessToken(jr.access_token);
      return jr;
    };

    console.log("songAdd, before auth(code).then");

    authF(code);
    // authF(code).then((at) => {
    //   console.log(`at: >>>>> ${JSON.stringify(at)}`);
    //   setAccessToken(at.access_token);
    //   console.log("songAdd, inside auth(code)");
    //   // const access = "Bearer " + localStorage.getItem("access_token");
    //   const access = "Bearer " + accessToken;

    //   console.log("==== calling me, access: " + accessToken);

    //   // get the user playlists
    //   fetch(API_BASE_URL + "me", {
    //     headers: {
    //       Authorization: accessToken,
    //     },
    //   })
    //     .then((response) => response.json())
    //     .then((response) => handleUserData(response));

    //   console.log("====== calling playlists, access: " + accessToken);

    //   // get the user's playlists
    //   const userID = localStorage.getItem("user_id");
    //   fetch(API_BASE_URL + "users/" + userID + "/playlists", {
    //     headers: {
    //       Authorization: access,
    //     },
    //   })
    //     .then((response) => {
    //       console.log(
    //         `Received response from ${
    //           API_BASE_URL + "users/" + userID + "/playlists"
    //         }`
    //       );
    //       return response.json();
    //     })
    //     .then((response) => handlePlaylistData(response));
    // });
    // return () => abortController.abort();
  }, [accessToken]);

  return (
    <>
      <h1> User Playlists: </h1>
      <div>{JSON.stringify(playlistData)}</div>
    </>
  );
};

export default SongAdd;
