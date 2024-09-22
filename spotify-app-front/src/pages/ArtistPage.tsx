import { useLocation } from "react-router-dom";
import { AlbumData, Artist } from "../utils/interfaces";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../utils/AuthContext";
import { API_BASE_URL } from "../utils/config";

import Navbar from "../components/Navbar";
// need to make this interface because the response from get artists albums doesn't include the tracks, so i can't use the AlbumData interface I already have defined
interface album {
  album_type: string;
  id: string;
  name: string;
}

interface albumResponse {
  items: album[];
  total: number;
}

const ArtistPage = () => {
  const location = useLocation();
  const { accessToken } = useContext(AuthContext);

  const [tempAlbum, setTempAlbum] = useState<AlbumData>();

  // this is the list of the albumData objects
  const [albumDataList, setAlbumDataList] = useState<AlbumData[]>([]);
  const aList: AlbumData[] = [];

  // currently dont need the set current artist, but perhaps we will add a mechanism to change the artist in the future
  const [currentArtist, setCurrentArtist] = useState<Artist>(
    location.state.setArtist
  );

  function handleAlbumResponse(resp: AlbumData) {
    aList.push(resp);
    setTempAlbum(resp);
  }

  async function getArtistAlbums(artistId: string) {
    function handleAlbumListResponse(resp: albumResponse) {
      const albumList = resp.items;

      for (let i = 0; i < albumList.length; i++) {
        console.log(albumList[i].name);
      }

      fetch(API_BASE_URL + "albums/" + albumList[0].id, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      })
        .then((response) => response.json())
        .then((response) => handleAlbumResponse(response));
    }

    fetch(API_BASE_URL + "artists/" + artistId + "/albums", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    })
      .then((response) => response.json())
      .then((response) => handleAlbumListResponse(response));
  }

  useEffect(() => {
    getArtistAlbums(currentArtist.id);
  }, []);

  return (
    <>
      <div className="flex flex-col mt-4 text-center justify-center items-center h-full">
        <h1>{currentArtist.name}</h1>
        <div>Artist popularity: {currentArtist.popularity}</div>
        {tempAlbum?.tracks.items.map((song, index) => (
          <div key={index}>{song.name}</div>
        ))}
      </div>
    </>
  );
};

export default ArtistPage;
