import { CLIENT_ID, REDIRECT_URI, TOKEN_URL } from "../utils/config";
import { TokenResponse, Access } from "./interfaces";

// get the access token (client credentials flow)
export async function getCCAccessToken() {
  function handleResponse(response: Access) {
    //console.log(JSON.stringify(response));
    return response.data.access_token;
  }

  const resp = await fetch("http://127.0.0.1:5000");

  const accessToken = await resp.json();
  return handleResponse(accessToken);
}

// generate the code
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

  localStorage.setItem("code_verifier", codeVerifier);

  return codeChallenge;
}

// Get the access token (authorization code flow)
export async function authorize() {
  function handleTokenResponse(response: TokenResponse) {
    // console.log("Access Token: ");
    localStorage.setItem("access_token", response.access_token);
    localStorage.setItem("refresh_token", response.refresh_token);

    return response;
  }

  const urlParams = new URLSearchParams(window.location.search);
  let code = urlParams.get("code");
  if (!code) throw Error("Error: code");

  let codeVerifier = localStorage.getItem("code_verifier");
  if (!codeVerifier) throw Error("Error: no code verifier");

  const response = await fetch(TOKEN_URL, {
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
  const json_reponse = await response.json();
  return handleTokenResponse(json_reponse);
}
