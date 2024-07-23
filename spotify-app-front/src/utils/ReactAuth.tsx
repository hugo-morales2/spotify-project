import {
  CLIENT_ID,
  REDIRECT_URI,
  API_BASE_URL,
  TOKEN_URL,
} from "../utils/config";
import { json } from "react-router-dom";

import { TokenResponse } from "./interfaces";

const generateRandomString = (length: number) => {
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], "");
};

const sha256 = async (plain: any) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return window.crypto.subtle.digest("SHA-256", data);
};

const base64encode = (input: any) => {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
};

export async function genChallenge() {
  const codeVerifier = generateRandomString(64);
  const hashed = await sha256(codeVerifier);
  const codeChallenge = base64encode(hashed);

  window.localStorage.setItem("code_verifier", codeVerifier);

  return codeChallenge;
}

// export async function authorize() {
//   console.log("start auth...");

//   function handleTokenResponse(response: TokenResponse) {
//     localStorage.setItem("access_token", response.access_token);
//     console.log("beep bada boop bap i now have the code");
//     console.log(JSON.stringify(response));
//   }

//   const urlParams = new URLSearchParams(window.location.search);
//   let code = urlParams.get("code");
//   if (!code) throw Error("Error: code");

//   let codeVerifier = localStorage.getItem("code_verifier");
//   console.log("code verifier: " + codeVerifier);
//   if (!codeVerifier) throw Error("Error: no code verifier");

//   fetch(TOKEN_URL, {
//     method: "POST",
//     body: new URLSearchParams({
//       grant_type: "authorization_code",
//       client_id: CLIENT_ID,
//       code,
//       redirect_uri: REDIRECT_URI,
//       code_verifier: codeVerifier,
//     }),
//     headers: {
//       "Content-Type": "application/x-www-form-urlencoded",
//     },
//   })
//     .then((resp) => resp.json())
//     .then((resp) => handleTokenResponse(resp));
// }
