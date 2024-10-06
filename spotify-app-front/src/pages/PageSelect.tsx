import { useContext, useEffect, useState } from "react";
//import { useNavigate } from "react-router-dom";

import { AuthContext } from "../utils/AuthContext";
import { API_BASE_URL } from "../utils/config";
import { UserData } from "../utils/interfaces";
import Card from "../components/Card";

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
      <div className="flex flex-col md:flex-row my-4 mx-10 flex-grow md:space-x-6 space-y-6 md:space-y-0">
        {/*Left side - large div*/}
        <div className="w-full md:w-1/2 flex flex-col bg-stone-800 rounded-lg flex-grow my-2">
          <div className="basis-2/5 rounded-t-lg bg-neutral-400 ">bruv</div>
          <div className="my-5 ml-6 text-2xl font-semibold text-color-neutral-400">
            Featured Artist:
          </div>
          <div className="mx-8">
            Lorem ipsum odor amet, consectetuer adipiscing elit. Risus lobortis
            nam posuere habitant turpis. Lobortis feugiat magna aliquam,
            maecenas sapiem ornare. Gravida eleifend ligula primis sociosqu ante
            nunc suspendisse enim adipiscing. Lacinia per hac aliquet ornare dui
            dis lectus. Dapibus curae metus cubilia porttitor tincidunt nullam.
            Purus euismod massa eget et blandit habitant facilisis sem. Taciti a
            curabitur; natoque amet diam eros. Nunc ullamcorper pulvinar etiam
            senectus aenean. Non facilisi ridiculus sapien praesent interdum
            posuere. Massa ornare finibus ex penatibus tellus curae. Vehicula ad
            mi orci interdum sapien senectus montes faucibus? Ipsum montes
            turpis molestie adipiscing scelerisque posuere elit. Metus rutrum
            rutrum lacinia etiam aliquam taciti velit. Eget lobortis primis
            sociosqu fringilla metus habitasse quam fames. Ligula sem dapibus mi
            nulla; primis lectus magnis. Ut congue mi fusce odio mus mi sapien
            natoque. Vehicula ad mi orci interdum sapien senectus montes
            faucibus? Ipsum montes turpis molestie adipiscing scelerisque
            posuere elit. Metus rutrum rutrum lacinia etiam aliquam taciti
            velit. Eget lobortis primis sociosqu fringilla metus habitasse quam
            fames.
          </div>
          <div className="flex justify-center mt-auto ">
            <button className="p-3 mt-6 md:mt-0 mb-4 rounded-md bg-zinc-900 transition-colors duration-300 hover:bg-zinc-700 border-gray-950 border-2">
              Artist Page
            </button>
          </div>
        </div>
        <div className="w-full md:w-1/2 items-start flex flex-col  space-y-4">
          <div className="flex flex-col bg-stone-800 rounded-lg flex-grow mb-2">
            {/* this is the top part */}
            <div className="flex flex-row rounded-t-lg basis-5/6">
              <div className="m-4 rounded-lg h-5/6 md:basis-5/12 bg-neutral-400">
                bruv
              </div>
              <div className="flex flex-col md:basis-7/12">
                <div className="mt-6 mb-3 ml-4 text-2xl font-semibold text-color-neutral-400">
                  Song Of The Day
                </div>
                <div className="p-4 mt-1 mr-3 mb-4 md:mb-0 h-full">
                  Lorem ipsum odor amet, consectetuer adipiscing elit. Risus
                  lobortis nam posuere habitant turpis. Lobortis feugiat magna
                  aliquam, maecenas sapien ornare. Gravida eleifend ligula
                  primis sociosqu ante nunc suspendisse enim adipiscing. Lacinia
                  per hac aliquet ornare dui dis lectus. Dapibus curae metus
                  cubilia porttitor tincidunt nullam. Purus euismod massa eget
                  et blandit habitant facilisis sem. Taciti a curabitur; natoque
                  amet diam eros. Nunc ullamcorper pulvinar etiam senectus
                  aenean. Non facilisi ridiculus sapien praesent interdum
                  posuere. Massa ornare finibus ex penatibus tellus curae.
                </div>
              </div>
            </div>
            {/* this is the bottom part */}
            <div className="flex flex-row rounded-b-lg bg-stone-700 md:basis-1/6 h-20">
              <div className="text-center place-content-center hover:bg-blue-600 transition-colors duration-300 rounded-bl-lg flex-1">
                Pop
              </div>
              <div className="text-center place-content-center hover:bg-amber-700 transition-colors duration-300 flex-1">
                Hip-hop
              </div>
              <div className="text-center place-content-center hover:bg-pink-700 transition-colors duration-300 flex-1">
                Rock
              </div>
              <div className="text-center place-content-center hover:bg-teal-500 transition-colors duration-300 flex-1">
                R&B
              </div>
              <div className="text-center place-content-center hover:bg-red-600 transition-colors duration-300 flex-1">
                Electronic
              </div>
              <div className="text-center place-content-center hover:bg-green-600 transition-colors duration-300 rounded-br-lg flex-1">
                Indie
              </div>
            </div>
          </div>
          <div className="flex flex-row justify-center place-items-center bg-stone-800 rounded-lg flex-grow mt-2 space-x-4">
            <Card className="h-20 w-20" cardStyle="unbounded">
              luh
            </Card>
            <Card className="h-20 w-20" cardStyle="within" m="2">
              bruh
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};
//<div className="userName">{displayName}</div>

export default pageSelect;
