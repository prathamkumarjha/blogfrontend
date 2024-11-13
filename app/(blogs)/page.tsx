"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FaHandsClapping } from "react-icons/fa6";
import Image from "next/image";
import { RotatingLines } from "react-loader-spinner";
export interface user {
  id: number;
  name: string;
  email: string;
  image: string;
}

export interface BlogPost {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  author: user;
  is_deleted: boolean;
  claps: number;
  thumbnail: string;
  summary: string;
  // user: user;
}

export default function Home() {
  const [blogData, setBlogData] = useState<BlogPost[] | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchBlogData() {
      try {
        console.log(process.env.NEXT_PUBLIC_BACKEND_URL);
        const response = await axios.get<BlogPost[]>(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/web/posts/`
        );
        setBlogData(response.data);
      } catch (error) {
        console.error("Error fetching blog data:", error);
        setError(error as Error);
      }
    }

    fetchBlogData();
  }, []);

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "short",
      year: "numeric",
    };

    return date.toLocaleDateString("en-GB", options);
  }

  const router = useRouter();

  const onClick = (id: number) => {
    router.push(`/${id}`);
  };

  if (error) return <div>Error loading blog data.</div>;
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

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center w-full max-w-2xl">
        {blogData.map((post) => (
          <div
            key={post.id}
            className="border-b-2 border-gray-200 cursor-pointer w-full px-4 py-2 mb-2"
            onClick={() => onClick(post.id)}
          >
            <div>
              <div className="text-lg font-semibold">
                <span className="text-gray-500">Written by</span>
                {post.author.name}
              </div>
            </div>

            <div className="flex  justify-between">
              <div>
                <h2>{post.title}</h2>
                <h4 className="text-gray-500 mt-0 pt-0">{post.summary}</h4>
              </div>
              <div className="flex justify-between space-x-4">
                {/* <h2 className="text-lg font-semibold">{post.title}</h2> */}
                <Image
                  src={`${post.thumbnail}`.trim()}
                  alt="Blog Thumbnail"
                  width={800}
                  height={200}
                  className="rounded-md h-20 w-20"
                />
              </div>
            </div>

            <div className="text-gray-600 flex space-x-4">
              <div className="flex">
                <FaHandsClapping className="mr-2" />
                {post.claps}
              </div>
              <div>{formatDate(post.created_at)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
