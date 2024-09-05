import { createContext, useEffect, useRef, useState } from "react";
import { TOKEN_URL, CLIENT_ID } from "./config";
import { TokenResponse, AuthContextProps } from "./interfaces";
import { authorize } from "./ReactAuth";

// this file is a context that is used to make the access token and user ID accessible to all components

// make sure to move this back to interfaces
export interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  setRefreshToken: (token: string | null) => void;
  setAccessToken: (token: string | null) => void;
  getAccessToken: () => void;
}

const defaultAuthContext: AuthContextType = {
  accessToken: null,
  refreshToken: null,
  setRefreshToken: () => null,
  setAccessToken: () => null,
  getAccessToken: () => null,
};

export const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export function AppAuth({ children }: AuthContextProps) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  const working = useRef(false);

  function handleTokenResponse({ access_token, refresh_token }: TokenResponse) {
    setAccessToken(access_token);
    setRefreshToken(refresh_token);
  }

  async function getAccessToken() {
    if (working.current == true) return;

    if (!accessToken) {
      working.current = true;
      const token_resp = await authorize();

      localStorage.setItem("access_token", token_resp.access_token);
      localStorage.setItem("refresh_token", token_resp.refresh_token);
      setAccessToken(token_resp.access_token);
      setRefreshToken(token_resp.refresh_token);
    } else {
      console.log("Nothing happened: there is already a valid access token");
    }
  }

  async function fetchNewToken(refresh_token: string | null) {
    if (!refresh_token) throw Error("no refresh token");

    const response = await fetch(TOKEN_URL, {
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
    const json_response = await response.json();
    return handleTokenResponse(json_response);
  }

  useEffect(() => {
    // gotta do this because the tokens don't persist through refreshes
    setAccessToken(localStorage.getItem("access_token"));
    setRefreshToken(localStorage.getItem("refresh_token"));

    // refresh token logic
    if (refreshToken) {
      const timeoutID = setTimeout(() => {
        console.log("Access token expired - refreshing token");
        fetchNewToken(refreshToken);
      }, 3600 * 1000 - 5000);

      return () => clearTimeout(timeoutID);
    }
  }, [accessToken, refreshToken]);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        setAccessToken,
        refreshToken,
        setRefreshToken,
        getAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
