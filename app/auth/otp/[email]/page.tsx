"use client";
import OTPInput from "../components/otp";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { useRouter } from "next/navigation";
const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password must be at least 6 characters long" }),
    confirm_password: z
      .string()
      .min(8, { message: "Password must be at least 6 characters long" }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function Page({ params }: { params: { email: string } }) {
  const [resetPassword, setResetPassword] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };
  const toggleConfirmPasswordVisiblity = () => {
    setConfirmPasswordVisible((prev) => !prev);
  };
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    console.log("Password reset data:", data, token);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/web/auth/resetPassword/`,
        {
          password: data.password,
          confirm_password: data.confirm_password,
          token: token,
        }
      );
      console.log("Password Reset Successful:", response.data);
      router.push("/auth/sign-in");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Error in password reset:",
          error.response?.data?.message
        );
      } else {
        console.error("Error in reset password:", error);
      }
      setError("something went wrong");
    }
    // Handle password reset logic here
  };

  return resetPassword ? (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat bg-opacity-50"
      style={{
        backgroundImage: `url('/authbg.jpg')`,
      }}
    >
      <div className="w-full max-w-md p-8 bg-black rounded-lg shadow-lg bg-opacity-85">
        <h2 className="text-3xl font-semibold text-center text-white mb-8">
          Reset Password
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

          <div className="relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300"
            >
              Confirm password
            </label>
            <input
              id="confirm password"
              type={confirmPasswordVisible ? "text" : "password"}
              {...register("confirm_password")}
              className="w-full p-3 mt-1 text-white rounded bg-gray-700 border border-gray-600 focus:border-red-500 focus:ring-red-500"
              placeholder="Password"
            />
            <button
              type="button"
              onClick={toggleConfirmPasswordVisiblity}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            >
              {confirmPasswordVisible ? (
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
            Submit
          </button>
        </form>
      </div>
      {error != "" ? (
        <div className="text-red-500 bg-red-200 p-4 rounded-lg flex justify-center">
          {error}
        </div>
      ) : (
        ""
      )}
    </div>
  ) : (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat bg-opacity-50"
      style={{
        backgroundImage: `url('/authbg.jpg')`,
      }}
    >
      <div className="w-full max-w-md p-8 bg-black rounded-lg shadow-lg bg-opacity-85">
        <h2 className="text-3xl font-semibold text-center text-white mb-8">
          Enter OTP
        </h2>

        <form className="space-y-6">
          <div className="w-full flex justify-center">
            <OTPInput
              email={params.email}
              setResetPassword={setResetPassword}
              setToken={setToken}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
