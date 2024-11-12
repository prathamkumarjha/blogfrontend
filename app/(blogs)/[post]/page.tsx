"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { BlogPost } from "../page"; // Ensure BlogPost is typed correctly
import Head from "next/head";
import Image from "next/image";
import { FaUser } from "react-icons/fa";
import { FaHandsClapping } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { RotatingLines } from "react-loader-spinner"; // Correct import if necessary

export default function Home({ params }: { params: { post: number } }) {
  const [blogData, setBlogData] = useState<BlogPost | null>(null);
  const [error, setError] = useState<string | null>(null); // Store error message as string
  const router = useRouter();

  // Format the date to a more readable format
  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "short",
      year: "numeric",
    };
    return date.toLocaleDateString("en-GB", options);
  }

  // Fetch blog data using the post id
  useEffect(() => {
    async function fetchBlogData() {
      try {
        const response = await axios.get<BlogPost>(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/web/posts/${params.post}/`
        );
        setBlogData(response.data);
      } catch (error: any) {
        console.error("Error fetching blog data:", error);
        setError(error.message || "Error fetching blog data.");
      }
    }

    fetchBlogData();
  }, [params]);

  if (error) return <div>Error loading blog data: {error}</div>; // Show the actual error message

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
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/web/posts/reactions`,
        { blogpost_id: blogData.id }
      );
      setBlogData(response.data);
    } catch (error) {
      console.error("Error fetching blog data:", error);
    } finally {
      router.refresh();
      console.log("clapped");
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
              {blogData.author.name}
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
          <div>{blogData.likes_count}</div>
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
