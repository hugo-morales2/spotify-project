import { useContext } from "react";
import PageButton from "../components/PageButton";
import { AuthContext } from "../utils/AuthContext";

const TopArtists = () => {
  //const {accessToken, setAccessToken} = useContext(AuthContext)
  return (
    <>
      <div>TopArtists</div>
      <PageButton name="Home" link="/PageSelect" />
    </>
  );
};

export default TopArtists;
