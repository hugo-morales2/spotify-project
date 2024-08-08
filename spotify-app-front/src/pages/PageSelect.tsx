import { useContext, useEffect } from "react";
//import { useNavigate } from "react-router-dom";

import { Container, Row, Col } from "react-bootstrap";
import PageButton from "../components/PageButton";
import { AuthContext } from "../utils/AuthContext";
import { API_BASE_URL } from "../utils/config";
import { UserData } from "../utils/interfaces";

const pageSelect = () => {
  const { accessToken, getAccessToken } = useContext(AuthContext);

  function handleUserData(data: UserData) {
    localStorage.setItem("userID", data.id);
  }

  useEffect(() => {
    if (!accessToken) {
      getAccessToken();
      return;
    }
    console.log("Access Token: " + accessToken);
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
      <h1>Home</h1>
      <Container>
        <Row>
          <Col>
            <PageButton name={"Add a Song"} link={"/SongAdd"} />
            <PageButton name={"Check User Playlists"} link={"/UserPlaylist"} />
            <PageButton name={"Top Artists"} link={"/TopArtists"} />
            <PageButton name={"Back to Welcome"} link={"/"} />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default pageSelect;
