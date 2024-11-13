"use client";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type FormData = z.infer<typeof formSchema>;

export default function Page() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const [message, setMessage] = useState<string>("");

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    console.log("form data", data);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/web/auth/forgotPassword/`,
        data
      );

      if (response) {
        console.log("Response:", response);
        console.log(response.data.message);
        setMessage(response.data.message);
        router.push(`/auth/otp/${data.email}`);
      }
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  const router = useRouter();

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat bg-opacity-50"
      style={{
        backgroundImage: `url('/authbg.jpg')`,
      }}
    >
      <div className="w-full max-w-md p-8 bg-black rounded-lg shadow-lg bg-opacity-85">
        <h2 className="text-3xl font-semibold text-center text-white mb-8">
          Forgot password
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register("email")}
              className="w-full p-3 mt-1 text-gray-900 rounded bg-gray-700 border border-gray-600 focus:border-red-500 focus:ring-red-500"
              placeholder="Email"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 mt-4 text-lg font-semibold text-white bg-green-600 rounded hover:bg-green-700 transition"
          >
            Submit
          </button>
        </form>

        <div></div>

        <p
          className="mt-6 text-sm text-center text-gray-400 cursor-pointer"
          onClick={() => {
            router.push("/auth/sign-up");
          }}
        >
          New to Kandhari tales?{" "}
          <span className="hover:underline hover:text-white">Sign up now</span>
        </p>

        {message != "" ? (
          <div className="text-green-600 bg-green-200 p-4 rounded-lg flex justify-center">
            {message}
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
