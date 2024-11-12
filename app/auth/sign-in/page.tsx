"use client";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";
const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
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

  const [passwordVisible, setPasswordVisible] = useState(false);
  const onSubmit: SubmitHandler<FormData> = (data) => {
    console.log("form data", data);
  };
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat bg-opacity-50"
      style={{
        backgroundImage: `url('/authbg.jpg')`,
      }}
    >
      <div className="w-full max-w-md p-8 bg-black rounded-lg shadow-lg bg-opacity-85">
        <h2 className="text-3xl font-semibold text-center text-white mb-8">
          Sign In
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

          <div className="relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300"
            >
              Password
            </label>
            <input
              id="password"
              type={passwordVisible ? "text" : "password"}
              {...register("password")}
              className="w-full p-3 mt-1 text-white rounded bg-gray-700 border border-gray-600 focus:border-red-500 focus:ring-red-500"
              placeholder="Password"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            >
              {passwordVisible ? (
                <FaEyeSlash className="h-5 w-5 text-center mt-6" />
              ) : (
                <FaEye className="h-5 w-5 text-center mt-6" />
              )}
            </button>
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 mt-4 text-lg font-semibold text-white bg-green-600 rounded hover:bg-green-700 transition"
          >
            Sign In
          </button>
        </form>

        <p
          className="mt-6 text-sm text-center text-gray-400 cursor-pointer"
          onClick={() => {
            router.push("/auth/sign-up");
          }}
        >
          New to Kandhari tales?{" "}
          <span className="hover:underline hover:text-white">Sign up now</span>
        </p>
      </div>
    </div>
  );
}
