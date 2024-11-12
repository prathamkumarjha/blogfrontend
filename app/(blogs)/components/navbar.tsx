"use client";
import { useState, useRef, useEffect } from "react";
import { FaUser } from "react-icons/fa";
import { useRouter } from "next/navigation";

interface navInterface {
  userName?: string;
  signedIn: boolean;
}

const Nav: React.FC<navInterface> = ({ userName, signedIn }) => {
  const [showPopover, setShowPopover] = useState(false);
  const popoverRef = useRef(null);
  const router = useRouter();
  // Toggle popover on profile icon click
  const togglePopover = () => {
    setShowPopover(!showPopover);
  };

  // Close popover if clicked outside
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

  return (
    <div className="shadow-md bg-white flex items-center justify-between p-2 px-4">
      <div className="flex items-center space-x-4 text-4xl font-extrabold text-red-700">
        Kandhari
      </div>

      {/* Profile Icon and Popover */}
      <div className="relative">
        <div
          className="border border-gray-800 rounded-full h-8 w-8 flex items-center justify-center overflow-hidden cursor-pointer"
          onClick={togglePopover}
        >
          <FaUser className="h-full w-full text-gray-500 pt-1" />
        </div>

        {/* Popover Content */}
        {showPopover && signedIn && (
          <div
            ref={popoverRef}
            className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 shadow-lg rounded-md p-4 z-10"
          >
            <p className="text-gray-700 font-semibold">
              {signedIn ? userName : ""}
            </p>
            <p className="text-sm text-gray-500">user@example.com</p>
            <hr className="my-2" />
            <button className="text-red-600 w-full text-left">Logout</button>
          </div>
        )}
        {showPopover && !signedIn && (
          <div
            ref={popoverRef}
            className="absolute right-0 mt-2 bg-white border border-gray-300 shadow-lg rounded-md p-4 z-10 flex flex-col space-y-2"
          >
            <div className="text-center text-md  font-bold w-auto whitespace-nowrap ">
              Get started with{" "}
              <span className="text-red-800 text-lg">kandhari tales</span>
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
      {/* Additional navbar content (links, buttons, etc.) can go here */}
    </div>
  );
};

export default Nav;
