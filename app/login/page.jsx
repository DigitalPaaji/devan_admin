"use client";

import { base_url } from "@/components/utils";
import axios from "axios";
import {
  FiArrowLeft,
  FiCheckCircle,
  FiEye,
  FiEyeOff,
  FiLock,
  FiLogIn,
  FiMail,
  FiShield,
} from "react-icons/fi";
import React, { useRef, useState } from "react";
import { toast } from "react-toastify";

const OTP_LENGTH = 6;

const LoginPage = () => {
  const [token, setToken] = useState("");
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [sendOtp, setSendOtp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);

  const otpInputRefs = useRef([]);

  const [loginDetails, setLoginDetails] = useState({
    email: "",
    password: "",
  });

  const handleLoginInput = (event) => {
    const { name, value } = event.target;

    setLoginDetails((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    if (loginLoading) return;

    try {
      setLoginLoading(true);

      const response = await axios.post(
        `${base_url}/auth/login`,
        loginDetails
      );

      const data = response.data;

      if (!data.success) {
        toast.error(data.message || "Unable to send OTP");
        return;
      }

      setToken(data.token);
      setOtp(Array(OTP_LENGTH).fill(""));
      setSendOtp(true);

      toast.success(data.message || "OTP sent successfully");

      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 100);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Login failed. Please try again."
      );
    } finally {
      setLoginLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    const digit = value.replace(/\D/g, "").slice(-1);

    const updatedOtp = [...otp];
    updatedOtp[index] = digit;
    setOtp(updatedOtp);

    if (digit && index < OTP_LENGTH - 1) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, event) => {
    if (event.key === "Backspace") {
      if (otp[index]) {
        const updatedOtp = [...otp];
        updatedOtp[index] = "";
        setOtp(updatedOtp);
        return;
      }

      if (index > 0) {
        otpInputRefs.current[index - 1]?.focus();
      }
    }

    if (event.key === "ArrowLeft" && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }

    if (event.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpPaste = (event) => {
    event.preventDefault();

    const pastedOtp = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);

    if (!pastedOtp) return;

    const updatedOtp = Array(OTP_LENGTH).fill("");

    pastedOtp.split("").forEach((digit, index) => {
      updatedOtp[index] = digit;
    });

    setOtp(updatedOtp);

    const focusIndex = Math.min(pastedOtp.length, OTP_LENGTH - 1);

    setTimeout(() => {
      otpInputRefs.current[focusIndex]?.focus();
    }, 0);
  };

  const verifyOtp = async (event) => {
    event.preventDefault();

    const otpValue = otp.join("");

    if (otpValue.length !== OTP_LENGTH) {
      toast.error("Please enter the complete 6-digit OTP");
      return;
    }

    if (verifyLoading) return;

    try {
      setVerifyLoading(true);

      const response = await axios.post(
        `${base_url}/auth/verify`,
        {
          token,
          otp: otpValue,
        },
        {
          withCredentials: true,
        }
      );

      const data = response.data;

      if (!data.success) {
        toast.error(data.message || "OTP verification failed");
        return;
      }

      toast.success(data.message || "Login successful");

      // Redirect after successful verification
      window.location.href = "/";
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Invalid or expired OTP"
      );
    } finally {
      setVerifyLoading(false);
    }
  };

  const goBackToLogin = () => {
    setSendOtp(false);
    setToken("");
    setOtp(Array(OTP_LENGTH).fill(""));
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white px-4 py-10 text-black">
      {/* Background decoration */}
      <div className="pointer-events-none absolute left-[-100px] top-[-100px] h-80 w-80 rounded-full bg-slate-100 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-100px] right-[-100px] h-80 w-80 rounded-full bg-slate-100 blur-3xl" />

      <section className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-200/70 sm:p-9">
        <div className="mb-8 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-black text-white shadow-lg shadow-black/20">
            {sendOtp ? (
              <FiShield className="text-3xl" />
            ) : (
              <FiLock className="text-3xl" />
            )}
          </div>
        </div>

        {!sendOtp ? (
          <>
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-black">
                Welcome back
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Enter your account details to continue
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Email address
                </label>

                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-500" />

                  <input
                    type="email"
                    name="email"
                    value={loginDetails.email}
                    onChange={handleLoginInput}
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                    className="w-full rounded-xl border border-slate-300 bg-white py-3.5 pl-12 pr-4 text-black outline-none transition placeholder:text-slate-400 focus:border-black focus:ring-4 focus:ring-black/5"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Password
                </label>

                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-500" />

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={loginDetails.password}
                    onChange={handleLoginInput}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                    className="w-full rounded-xl border border-slate-300 bg-white py-3.5 pl-12 pr-12 text-black outline-none transition placeholder:text-slate-400 focus:border-black focus:ring-4 focus:ring-black/5"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((previous) => !previous)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xl text-slate-500 transition hover:text-black"
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-black px-5 py-3.5 font-semibold text-white shadow-lg shadow-black/15 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loginLoading ? (
                  <>
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Sending OTP...
                  </>
                ) : (
                  <>
                    Continue
                    <FiLogIn />
                  </>
                )}
              </button>
            </form>
          </>
        ) : (
          <>
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-black">
                Verify OTP
              </h1>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Enter the 6-digit verification code sent to
                <span className="block font-medium text-black">
                  {loginDetails.email}
                </span>
              </p>
            </div>

            <form onSubmit={verifyOtp}>
              <div
                className="grid grid-cols-6 gap-2 sm:gap-3"
                onPaste={handleOtpPaste}
              >
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(element) => {
                      otpInputRefs.current[index] = element;
                    }}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    aria-label={`OTP digit ${index + 1}`}
                    autoComplete={index === 0 ? "one-time-code" : "off"}
                    onChange={(event) =>
                      handleOtpChange(index, event.target.value)
                    }
                    onKeyDown={(event) =>
                      handleOtpKeyDown(index, event)
                    }
                    className="aspect-square min-w-0 rounded-xl border border-slate-300 bg-white text-center text-xl font-bold text-black caret-black outline-none transition focus:border-black focus:bg-slate-50 focus:ring-4 focus:ring-black/5 sm:text-2xl"
                  />
                ))}
              </div>

              <p className="mt-4 text-center text-xs text-slate-500">
                You can paste the complete OTP into any field
              </p>

              <button
                type="submit"
                disabled={verifyLoading || otp.join("").length !== OTP_LENGTH}
                className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-black px-5 py-3.5 font-semibold text-white shadow-lg shadow-black/15 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {verifyLoading ? (
                  <>
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <FiCheckCircle />
                    Verify and Login
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={goBackToLogin}
                className="mt-4 flex w-full items-center justify-center gap-2 py-2 text-sm font-medium text-slate-500 transition hover:text-black"
              >
                <FiArrowLeft />
                Change login details
              </button>
            </form>
          </>
        )}
      </section>
    </main>
  );
};

export default LoginPage;