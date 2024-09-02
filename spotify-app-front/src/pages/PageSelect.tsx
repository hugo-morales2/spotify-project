import { useContext, useEffect, useState } from "react";
//import { useNavigate } from "react-router-dom";

import PageButton from "../components/PageButton";
import { AuthContext } from "../utils/AuthContext";
import { API_BASE_URL } from "../utils/config";
import { UserData } from "../utils/interfaces";

const pageSelect = () => {
  const [displayName, setDisplayName] = useState("");

  const { getAccessToken, accessToken } = useContext(AuthContext);

  //const isAuthorized = useRef(false);

  function handleUserData(data: UserData) {
    localStorage.setItem("userID", data.id);
    localStorage.setItem("display_name", data.display_name);
    setDisplayName(data.display_name);
  }

  useEffect(() => {
    if (!localStorage.getItem("userID") && !accessToken) {
      getAccessToken();
      return;
    }

    if (!accessToken) {
      return;
    }

    //code for getting the user's ID
    const access = "Bearer " + accessToken;
    fetch(API_BASE_URL + "me", {
      headers: {
        Authorization: access,
      },
    })
      .then((userResponse) => userResponse.json())
      .then((user) => {
        handleUserData(user);
      });
  }, [accessToken]);

  return (
    <>
      <div className="userName">{displayName}</div>
      <h1>Home</h1>
      <div className="flex flex-col space-y-4 my-8">
        <div className="flex space-x-4">
          <PageButton name={"Add a Song"} link={"/SongAdd"} />
          <PageButton name={"My Playlists"} link={"/UserPlaylist"} />
          <PageButton name={"Top Artists"} link={"/TopArtists"} />
        </div>

        <PageButton name={"Back to Welcome"} link={"/"} />
      </div>
    </>
  );
};

export default pageSelect;
