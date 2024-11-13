"use client";
import { useState, useRef, useEffect } from "react";
import { FaUser } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { userDataProps } from "../layout";
import Image from "next/image";
import SearchBar from "./searchBar";

interface NavProps {
  userData: userDataProps | null;
  setUserData: React.Dispatch<React.SetStateAction<userDataProps | null>>; // Correct type for setUserData
}
const Nav: React.FC<NavProps> = ({ userData, setUserData }) => {
  const [showPopover, setShowPopover] = useState(false);
  const popoverRef = useRef(null);
  const router = useRouter();

  const togglePopover = () => {
    setShowPopover(!showPopover);
  };

  const LogoutButton = () => {
    const handleLogout = () => {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");

      setShowPopover(false);
      setUserData(null);
      router.refresh();
    };

    return (
      <button className="text-red-600 w-full text-left" onClick={handleLogout}>
        Logout
      </button>
    );
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        popoverRef.current &&
        //@ts-expect-error never error
        !popoverRef.current.contains(event.target as Node)
      ) {
        setShowPopover(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  console.log("userData from navbar", userData);

  return (
    <div className="shadow-md bg-white flex items-center justify-between p-2 px-4 space-x-4">
      <div className="flex items-center space-x-4 text-4xl font-extrabold text-red-700">
        Kandhari
      </div>
      <div className="w-full">
        {/* <input
          type="text"
          placeholder="Search for any title or summary"
          className="w-full rounded-full p-4 bg-gray-200"
        /> */}
        <SearchBar />
      </div>

      <div className="relative">
        <div
          className="border border-gray-800 rounded-full h-8 w-8 flex items-center justify-center overflow-hidden cursor-pointer"
          onClick={togglePopover}
        >
          {userData?.image ? (
            <Image
              src={`${userData.image}`}
              alt="userImage"
              height={500}
              width={500}
              className="h-full w-full text-gray-500 pt-1"
            />
          ) : (
            <FaUser className="h-full w-full text-gray-500 pt-1" />
          )}
        </div>

        {showPopover && userData && (
          <div
            ref={popoverRef}
            className="absolute right-0 mt-2 w-60 bg-white border border-gray-300 shadow-lg rounded-md p-4 z-10"
          >
            <div className="text-red-800 text-xl font-bold text-center flex justify-center w-full border-b-2  border-gray-200 mb-2 pb-2">
              Kandhari Tales
            </div>
            <p
              className="text-gray-700 font-semibold truncate"
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {userData?.name}
            </p>
            <p
              className="text-sm text-gray-500"
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {userData.email}
            </p>
            <hr className="my-2" />
            <LogoutButton /> {/* Include the LogoutButton component here */}
          </div>
        )}
        {showPopover && !userData && (
          <div
            ref={popoverRef}
            className="absolute right-0 mt-2 bg-white border border-gray-300 shadow-lg rounded-md p-4 z-10 flex flex-col space-y-2"
          >
            <div className="text-center text-md font-bold w-auto whitespace-nowrap">
              Get started with{" "}
              <span className="text-red-800 text-lg">Kandhari Tales</span>
            </div>
            <button
              className="w-full text-center border-2 border-black h-10 rounded-full hover:bg-gray-200"
              onClick={() => {
                router.push("/auth/sign-in");
              }}
            >
              Log-in
            </button>
            <button
              className="text-center w-full text-white rounded-full bg-green-600 h-10 hover:bg-opacity-80"
              onClick={() => {
                router.push("/auth/sign-up");
              }}
            >
              Sign-up
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Nav;
