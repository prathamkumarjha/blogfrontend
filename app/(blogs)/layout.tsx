"use client";
import React from "react";
import Nav from "./components/navbar";
import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axiosinstance";
import { RotatingLines } from "react-loader-spinner";

interface NavLayoutProps {
  children: React.ReactNode; // Correctly define the 'children' prop type
}

export interface userDataProps {
  email: string;
  id: number;
  image?: string;
  name: string;
}

const Layout: React.FC<NavLayoutProps> = ({ children }) => {
  const [userData, setUserData] = useState<userDataProps | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  // const [error, setError] = useState<string | null>(null);

  console.log("this is userData", userData);
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axiosInstance.get("/api/web/auth/profile/");
        setUserData(response.data);
      } catch (err: any) {
        setUserData(null);
        // setError("Failed to fetch user data.");
        console.error("Error fetching user data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) {
    return (
      <div className="w-full flex justify-center">
        <RotatingLines
          visible={true}
          //@ts-expect-error dont know what is the problem
          color="blue"
          height="96"
          width="96"
          strokeWidth="5"
          animationDuration="0.75"
          ariaLabel="rotating-lines-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
      </div>
    );
  }

  // if (error) {
  //   return <div>{error}</div>;
  // }

  return (
    <div>
      <Nav userData={userData} setUserData={setUserData} />
      {children} {/* Render the children */}
    </div>
  );
};

export default Layout;
