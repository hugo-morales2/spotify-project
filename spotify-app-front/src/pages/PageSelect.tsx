import { useEffect, useRef } from "react";
//import { useNavigate } from "react-router-dom";

import { authorize } from "../utils/ReactAuth";
import { Container, Row, Col } from "react-bootstrap";
import PageButton from "../components/PageButton";

const pageSelect = () => {
  const working = useRef(false);
  //const navigate = useNavigate();

  useEffect(() => {
    async function auth1() {
      if (working.current == true) {
        console.log("useEffect ignored");
        return;
      }

      // the logic here will eventually be: if the token has expired, then don't run this. Else, run it.
      // change when you can
      if (localStorage.getItem("access_token") == null) {
        working.current = true;
        const token_resp = await authorize();

        if (token_resp.access_token != undefined) {
          localStorage.setItem("access_token", token_resp.access_token);
          localStorage.setItem("refresh_token", token_resp.refresh_token);
          console.log(
            "Access token put in local memory: " + token_resp.access_token
          );
        }
      } else {
        console.log("Nothing happened: there is already a valid access token");
      }

      const at = localStorage.getItem("access_token");
      if (!at) throw Error("Access token is null");
      return at;
    }

    auth1();
  });

  // authorize the app and get the access token

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
