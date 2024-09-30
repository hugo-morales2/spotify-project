import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { PlaylistData, Playlist, Tracks } from "../utils/interfaces";

import { API_BASE_URL } from "../utils/config";
import { AuthContext } from "../utils/AuthContext";
import Card from "../components/Card";

const UserPlaylist = () => {
  const navigate = useNavigate();
  const { accessToken } = useContext(AuthContext);
  const [playlistData, setPlaylistData] = useState<Playlist[]>([]);

  const [trackData, setTrackData] = useState<Tracks[]>();

  // should put this in the context
  const userDisplayName = localStorage.getItem("display_name");

  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist>();

  const userID = localStorage.getItem("userID");

  function handleAddSong() {
    navigate("/SongAdd", { state: { setAlbum: selectedPlaylist } });
  }

  function playlistSelection(event: any) {
    const access = "Bearer " + accessToken;

    for (let i = 0; i < playlistData.length; i++) {
      if (playlistData[i].id == event.target.value) {
        fetch(playlistData[i].tracks.href, {
          headers: {
            Authorization: access,
          },
        })
          .then((response) => response.json())
          .then((response) => {
            var trackList: Tracks[] = [];
            for (let i = 0; i < response.items.length; i++) {
              trackList.push(response.items[i].track);
            }
            setTrackData(trackList);
          });
        setSelectedPlaylist(playlistData[i]);
      }
    }
    //setSelectedPlaylist(event.target);
  }

  function handlePlaylistData(data: PlaylistData) {
    setPlaylistData(data.items);
  }

  useEffect(() => {
    if (!accessToken) return;

    const access = "Bearer " + accessToken;

    // get the user's playlists
    fetch(API_BASE_URL + "users/" + userID + "/playlists", {
      headers: {
        Authorization: access,
      },
    })
      .then((response) => {
        console.log(
          `Received response from ${
            API_BASE_URL + "users/" + userID + "/playlists"
          }`
        );
        return response.json();
      })
      .then((response) => handlePlaylistData(response));

    // });
  }, [accessToken]);

  return (
    <>
      <div className="flex flex-col py-8 mt-6 px-6 mx-20 justify-center items-center h-full rounded-lg bg-zinc-900">
        <h1 className="mb-6"> {userDisplayName}'s saved playlists: </h1>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 justify-center gap-4 mt-3 mb-12 text-center flex-grow">
          {playlistData.map((playlist, index) => (
            <>
              <div
                className="flex-grow h-full"
                onClick={(e) => playlistSelection(e)}
              >
                <Card key={index} cardStyle="within" className="" m="2">
                  <button className="" key={index}>
                    {playlist.name} - {playlist.owner.display_name}
                  </button>
                </Card>
              </div>
            </>
          ))}
        </div>
        {trackData != undefined && (
          <div className="mt-10 mx-auto p-5 w-2/3 bg-gray-400 rounded-lg">
            {trackData != undefined &&
              trackData.length != 0 &&
              trackData?.map((track, index) => (
                <div key={index}>
                  {track.name} - {track.artists[0].name}
                </div>
              ))}
            {trackData != undefined && trackData.length == 0 && (
              <div>This playlist is empty!</div>
            )}
            {trackData != undefined && (
              <button
                onClick={() => handleAddSong()}
                className="bg-gray-500 py-3 px-5 mt-4 rounded-full hover:bg-gray-600 focus:bg-slate-700"
              >
                Add Song to this playlist!
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default UserPlaylist;
