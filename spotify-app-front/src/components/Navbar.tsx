import Dropdown from "./Dropdown";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <nav className="bg-white border-gray-200 dark:bg-neutral-900">
      <div className="w-full flex flex-wrap items-center justify-between mx-auto p-4">
        {/*this is the left aligned part of the navbar*/}
        <div className="flex items-center space-x-8 ml-6">
          <a className="flex items-center space-x-3">
            <span className="flex self-center text-2xl font-semibold dark:text-white">
              <button
                onClick={() => navigate("/PageSelect")}
                className="relative flex group  w-26 items-center px-5 rounded-lg transition-colors duration-500 hover:text-green-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-8 pr-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 0 0 2.25-2.25V6.75a2.25 2.25 0 0 0-2.25-2.25H6.75A2.25 2.25 0 0 0 4.5 6.75v10.5a2.25 2.25 0 0 0 2.25 2.25Zm.75-12h9v9h-9v-9Z"
                  />
                </svg>
                Spotify App
              </button>
            </span>
          </a>

          <div className={`hidden w-full md:block md:w-auto`}>
            <ul className="font-medium flex flex-col p-4 md:flex-row md:space-x-8">
              <li>
                <button
                  onClick={() => navigate("/SongAdd")}
                  className="hidden py-2 px-3 text-white rounded transition-colors duration-300 hover:bg-zinc-700 md:block"
                >
                  Add A Song
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/TopArtists")}
                  className="hidden py-2 px-3 text-white rounded transition-colors duration-300 hover:bg-zinc-700 md:block"
                >
                  Top Artists
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/UserPlaylist")}
                  className="hidden py-2 px-3 text-white rounded transition-colors duration-300 hover:bg-zinc-700 md:block"
                >
                  User Playlists
                </button>
              </li>
            </ul>
          </div>
        </div>
        {/*this is the left aligned part of the navbar*/}
        <div className="md:mr-4">
          <Dropdown />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
