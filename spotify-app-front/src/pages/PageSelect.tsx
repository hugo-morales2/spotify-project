import { useContext, useEffect, useState } from "react";
//import { useNavigate } from "react-router-dom";

import { Container, Row, Col } from "react-bootstrap";
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
      <Container fluid="lg">
        <Row>
          <Col>
            <PageButton name={"Add a Song"} link={"/SongAdd"} />
            <PageButton name={"Check User Playlists"} link={"/UserPlaylist"} />
            <PageButton name={"Top Artists"} link={"/TopArtists"} />
          </Col>
        </Row>
        <Row>
          <PageButton name={"Back to Welcome"} link={"/"} />
        </Row>
      </Container>
    </>
  );
};

export default pageSelect;
