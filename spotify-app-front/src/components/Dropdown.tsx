import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Dropdown = () => {
  const navigate = useNavigate();
  const [isOpen, setOpen] = useState(false);

  function toggleOpen() {
    setOpen(!isOpen);
  }
  return (
    <div className="relative">
      <button
        onClick={() => toggleOpen()}
        className="p-2 w-10 h-10 inline-flex text-sm text-gray-500 rounded-lg items-center justify-center hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
      >
        <svg
          className="w-5 h-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 17 14"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M1 1h15M1 7h15M1 13h15"
          />
        </svg>
      </button>
      {/*If you want the dropdown buttons to actually take you somewhere, add the correct path to the router.push function in the onClick*/}
      <div
        className={
          "absolute right-0 w-48 bg-neutral-800 text-zinc-400 mt-3 rounded-lg shadow-lg " +
          (isOpen ? "" : "hidden")
        }
      >
        <button
          onClick={() => navigate("/SongAdd")}
          className="block w-full text-left px-4 pt-3 pb-2 rounded-t-lg transition-colors duration-100 hover:bg-zinc-700 "
        >
          Add a song
        </button>
        <button
          onClick={() => navigate("/UserPlaylist")}
          className="block w-full text-left px-4 pt-2 pb-2 transition-colors duration-300 hover:bg-zinc-700"
        >
          User's saved playlists
        </button>
        <button
          onClick={() => navigate("/TopArtists")}
          className="block w-full text-left px-4 pt-2 pb-3 transition-colors duration-300 rounded-b-lg hover:bg-zinc-700"
        >
          Top artists
        </button>
      </div>
    </div>
  );
};

export default Dropdown;
