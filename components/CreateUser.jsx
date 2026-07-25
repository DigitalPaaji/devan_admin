"use client";

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { base_url } from "@/components/utils";
import {
  FiCalendar,
  FiCamera,
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
  FiMapPin,
  FiPhone,
  FiSave,
  FiUser,
  FiX,
} from "react-icons/fi";

const initialFormData = {
  fullname: "",
  email: "",
  phone: "",
  password: "",
  status: "true",
  gender: "",
  dateOfBirth: "",
  address: "",
};

const CreateUser = ({ setShowCreate, onUserCreated }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG, PNG and WEBP images are allowed");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Profile image must be smaller than 5 MB");
      event.target.value = "";
      return;
    }

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setProfileImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeProfileImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setProfileImage(null);
    setImagePreview("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loading) return;

    if (!formData.fullname.trim()) {
      toast.error("Full name is required");
      return;
    }

    if (!formData.email.trim()) {
      toast.error("Email address is required");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must contain at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();

      data.append("fullname", formData.fullname.trim());
      data.append("email", formData.email.trim().toLowerCase());
      data.append("password", formData.password);
      data.append("status", formData.status);

      if (formData.phone.trim()) {
        data.append("phone", formData.phone.trim());
      }

      if (formData.gender) {
        data.append("gender", formData.gender);
      }

      if (formData.dateOfBirth) {
        data.append("dateOfBirth", formData.dateOfBirth);
      }

      if (formData.address.trim()) {
        data.append("address", formData.address.trim());
      }

      if (profileImage) {
        data.append("image", profileImage);
      }

      const response = await axios.post(
        `${base_url}/user/create`,
        data,
        {
          withCredentials: true,
        }
      );

      const responseData = response.data;

      if (!responseData.success) {
        toast.error(
          responseData.message || "Failed to create user"
        );
        return;
      }

      toast.success(
        responseData.message || "User created successfully"
      );

      onUserCreated?.(responseData.user);
      setShowCreate(false);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Unable to create user"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-user-title"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-3 backdrop-blur-sm sm:p-5"
    >
      <button
        type="button"
        aria-label="Close modal"
        onClick={() => setShowCreate(false)}
        className="absolute inset-0 cursor-default"
      />

      <section className="custom-scrollbar relative z-10 max-h-[94vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950">
        {/* Header */}
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white/95 px-5 py-4 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/95 sm:px-7">
          <div>
            <h2
              id="create-user-title"
              className="text-xl font-bold text-black dark:text-white"
            >
              Create New User
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Enter the user’s profile and account information.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowCreate(false)}
            aria-label="Close"
            disabled={loading}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-black disabled:opacity-50 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            <FiX size={22} />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="p-5 sm:p-7">
          {/* Profile image */}
          <div className="mb-8 flex flex-col items-center">
            <div className="group relative">
              <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-slate-100 shadow-lg dark:border-slate-800 dark:bg-slate-900">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Profile preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <FiUser className="text-5xl text-slate-400" />
                )}
              </div>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                aria-label="Select profile image"
                className="absolute bottom-0 right-0 flex h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-black text-white shadow-lg transition hover:scale-105 dark:border-slate-950 dark:bg-white dark:text-black"
              >
                <FiCamera size={17} />
              </button>

              {imagePreview && (
                <button
                  type="button"
                  onClick={removeProfileImage}
                  aria-label="Remove profile image"
                  className="absolute right-0 top-0 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-white shadow-md"
                >
                  <FiX size={15} />
                </button>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              className="hidden"
            />

            <p className="mt-3 text-xs text-slate-500">
              JPG, PNG or WEBP. Maximum size 5 MB.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {/* Full name */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Full name <span className="text-red-500">*</span>
              </label>

              <div className="relative">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                <input
                  type="text"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm text-black outline-none transition placeholder:text-slate-400 focus:border-black focus:ring-4 focus:ring-black/5 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-white dark:focus:ring-white/5"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Email address <span className="text-red-500">*</span>
              </label>

              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="user@example.com"
                  autoComplete="email"
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm text-black outline-none transition placeholder:text-slate-400 focus:border-black focus:ring-4 focus:ring-black/5 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-white dark:focus:ring-white/5"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Phone number
              </label>

              <div className="relative">
                <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  autoComplete="tel"
                  className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm text-black outline-none transition placeholder:text-slate-400 focus:border-black focus:ring-4 focus:ring-black/5 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-white dark:focus:ring-white/5"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Password <span className="text-red-500">*</span>
              </label>

              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimum 6 characters"
                  autoComplete="new-password"
                  minLength={6}
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-12 text-sm text-black outline-none transition placeholder:text-slate-400 focus:border-black focus:ring-4 focus:ring-black/5 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-white dark:focus:ring-white/5"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((previous) => !previous)}
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-black dark:hover:text-white"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            {/* Gender */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Gender
              </label>

              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-black outline-none transition focus:border-black focus:ring-4 focus:ring-black/5 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-white"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer_not_to_say">
                  Prefer not to say
                </option>
              </select>
            </div>

            {/* Date of birth */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Date of birth
              </label>

              <div className="relative">
                <FiCalendar className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  max={new Date().toISOString().split("T")[0]}
                  className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm text-black outline-none transition focus:border-black focus:ring-4 focus:ring-black/5 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:scheme-dark dark:focus:border-white"
                />
              </div>
            </div>

            {/* Status */}
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Account status
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${
                    formData.status === "true"
                      ? "border-green-500 bg-green-50 dark:bg-green-500/10"
                      : "border-slate-200 dark:border-slate-700"
                  }`}
                >
                  <input
                    type="radio"
                    name="status"
                    value="true"
                    checked={formData.status === "true"}
                    onChange={handleChange}
                    className="accent-green-600"
                  />

                  <span>
                    <span className="block text-sm font-semibold text-black dark:text-white">
                      Active
                    </span>
                    <span className="text-xs text-slate-500">
                      User can access the account
                    </span>
                  </span>
                </label>

                <label
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${
                    formData.status === "false"
                      ? "border-red-500 bg-red-50 dark:bg-red-500/10"
                      : "border-slate-200 dark:border-slate-700"
                  }`}
                >
                  <input
                    type="radio"
                    name="status"
                    value="false"
                    checked={formData.status === "false"}
                    onChange={handleChange}
                    className="accent-red-600"
                  />

                  <span>
                    <span className="block text-sm font-semibold text-black dark:text-white">
                      Inactive
                    </span>
                    <span className="text-xs text-slate-500">
                      Account access is disabled
                    </span>
                  </span>
                </label>
              </div>
            </div>

            {/* Address */}
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Address
              </label>

              <div className="relative">
                <FiMapPin className="absolute left-4 top-4 text-slate-400" />

                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter the complete address"
                  rows={3}
                  className="w-full resize-none rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm text-black outline-none transition placeholder:text-slate-400 focus:border-black focus:ring-4 focus:ring-black/5 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-white dark:focus:ring-white/5"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 dark:border-slate-800 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => setShowCreate(false)}
              disabled={loading}
              className="rounded-xl border border-slate-300 px-6 py-3 text-sm font-semibold text-black transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-white dark:hover:bg-slate-800"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-black dark:hover:bg-slate-200"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white dark:border-black/30 dark:border-t-black" />
                  Creating...
                </>
              ) : (
                <>
                  <FiSave size={17} />
                  Create User
                </>
              )}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default CreateUser;