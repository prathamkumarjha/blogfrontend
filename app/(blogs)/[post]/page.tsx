"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { BlogPost } from "../page";
import Head from "next/head";
import Image from "next/image";
import { FaUser } from "react-icons/fa";
import { FaHandsClapping } from "react-icons/fa6";
import { RotatingLines } from "react-loader-spinner";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axiosinstance";
export default function Home({ params }: { params: { post: number } }) {
  const [blogData, setBlogData] = useState<BlogPost | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "short",
      year: "numeric",
    };
    return date.toLocaleDateString("en-GB", options);
  }

  useEffect(() => {
    async function fetchBlogData() {
      try {
        const response = await axios.get<BlogPost>(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/web/posts/${params.post}/`
        );
        setBlogData(response.data);
      } catch (error) {
        console.error("Error fetching blog data:", error);
        //@ts-expect-error unknown type of error
        setError(error.message || "Error fetching blog data.");
      }
    }

    fetchBlogData();
  }, [params]);

  if (error) return <div>Error loading blog data: {error}</div>;

  if (!blogData)
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

  const clap = async () => {
    try {
      const response = await axiosInstance.patch(
        `/api/web/posts/${blogData.id}/increaseClaps/`,
        {}
      );

      console.log("Claps increased successfully:", response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Error with Axios request:",
          error.response?.data || error.message
        );
      } else {
        console.error("Error:", error);
      }
    } finally {
      console.log("Clapped");
      router.refresh();
    }
  };

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content={blogData.summary} />
        <meta name="keywords" content={`${blogData.title}, blog, post`} />
      </Head>

      <div className="lg:px-80 md:px-40 sm:px-4 px-4 pb-8">
        <h1>{blogData.title}</h1>
        <span className="text-lg text-gray-500">{blogData.summary}</span>
        <div className="py-2 flex items-center space-x-2">
          <div className="border border-gray-800 rounded-full h-8 w-8 flex items-center justify-center overflow-hidden cursor-pointer p-1">
            <FaUser className="h-full w-full text-gray-500 " />
          </div>
          <div className="text-md">
            <div className="font-semibold text-gray-900">
              {blogData.author?.name}
            </div>
            <div className="text-gray-500">
              {formatDate(blogData.created_at)}
            </div>
          </div>
        </div>

        <div
          className="flex"
          onClick={() => {
            clap();
          }}
        >
          <FaHandsClapping className="mr-2 text-gray-500 hover:text-black cursor-pointer" />
          <div>{blogData.claps}</div>
        </div>
        <div className="w-full border-t border-gray-400">
          <div>
            <Image
              src={`${blogData.thumbnail}`.trim()}
              alt="Blog Thumbnail"
              height={800}
              width={400}
              className="w-full h-1/3"
            />
          </div>
        </div>
        <div
          className="flex-row items-center justify-center bg-mute border-b border-gray-400 pb-8"
          dangerouslySetInnerHTML={{ __html: blogData.content }}
        />
        <div className="flex text-center items-center mt-8">
          <span className="text-xl font-semibold mr-2">
            Written by {blogData.author.name}
          </span>
        </div>
      </div>
    </>
  );
}
