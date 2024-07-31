import { createContext, useContext, useEffect, useState } from "react";
import { TOKEN_URL, CLIENT_ID } from "./config";
import { TokenResponse } from "./interfaces";

export const AuthContext = createContext();

export const AppAuth = ({ children }) => {
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState(null);
  const [expiresIn, setExpiresIn] = useState(0);

  function handleTokenResponse({
    access_token,
    expires_in,
    refresh_token,
  }: TokenResponse) {

    localStorage.setItem("access_token", access_token);
    localStorage.setItem("refresh_token", refresh_token);
    setRefreshToken(refresh_token)
    
  }

  async function fetchNewToken(refresh_token: string | null) {
    if (!refresh_token) throw Error("no refresh token");

    const newToken = await fetch(TOKEN_URL, {
      method: "POST",
      body: new URLSearchParams({
        grant_type: "refresh_token",
        client_id: CLIENT_ID,
        refresh_token: refresh_token,
      }),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    const json_reponse = await newToken.json();
    return handleTokenResponse(json_reponse);
  }

  useEffect(() => {
    if (refreshToken) {
      const timeoutID = setTimeout(() => {fetchNewToken(refreshToken)}, (3600 * 1000) - 5000)
    }

  }, []);

  return <AuthContext.Provider value={{accessToken, setAccessToken, setExpiresIn}}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
