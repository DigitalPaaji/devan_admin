"use client";

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { base_url } from "@/components/utils";
import {
  FiBriefcase,
  FiCalendar,
  FiCamera,
  FiEye,
  FiEyeOff,
  FiLink,
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
  password: "",
  phone: "",
  designation: "",
  qualification: "",
  specialization: "",
  expertise: "",
  experienceYears: "",
  organization: "",
  department: "",
  registrationNo: "",
  status: "true",
  about: "",
  gender: "",
  dateOfBirth: "",
  address: "",
  city: "",
  state: "",
  linkedinUrl: "",
};

const inputClass =
  "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-black outline-none transition placeholder:text-slate-400 focus:border-black focus:ring-4 focus:ring-black/5 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-white dark:focus:ring-white/5";

const Field = ({ label, required, icon: Icon, children }) => (
  <div>
    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      {Icon && (
        <Icon className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-slate-400" />
      )}
      {children}
    </div>
  </div>
);

const CreateExpert = ({ setShowCreate, onExpertCreated }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const handleChange = ({ target: { name, value } }) => {
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast.error("Only JPG, PNG and WEBP images are allowed");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Profile image must be smaller than 5 MB");
      event.target.value = "";
      return;
    }

    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setProfileImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeProfileImage = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setProfileImage(null);
    setImagePreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (loading) return;

    if (formData.password.length < 6) {
      toast.error("Password must contain at least 6 characters");
      return;
    }

    if (formData.experienceYears && Number(formData.experienceYears) < 0) {
      toast.error("Experience years cannot be negative");
      return;
    }

    try {
      setLoading(true);
      const data = new FormData();

      Object.entries(formData).forEach(([key, rawValue]) => {
        if (key === "expertise") return;
        const value = typeof rawValue === "string" ? rawValue.trim() : rawValue;
        if (value !== "") data.append(key, value);
      });

      const expertise = formData.expertise
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      data.set("email", formData.email.trim().toLowerCase());
      data.set("expertise", JSON.stringify(expertise));
      if (profileImage) data.append("image", profileImage);

      const response = await axios.post(`${base_url}/experts/create`, data, {
        withCredentials: true,
      });

      if (!response.data?.success) {
        toast.error(response.data?.message || "Failed to create expert");
        return;
      }

      toast.success(response.data.message || "Expert created successfully");
      onExpertCreated?.(response.data.expert);
      setShowCreate(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to create expert");
    } finally {
      setLoading(false);
    }
  };

  const textInput = (name, placeholder, props = {}) => {
    const { icon, ...inputProps } = props;

    return (
      <input
      {...inputProps}
      name={name}
      value={formData[name]}
      onChange={handleChange}
      placeholder={placeholder}
      className={`${inputClass} ${icon ? "pl-11" : ""}`}
    />
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-3 backdrop-blur-sm sm:p-5">
      <button
        type="button"
        aria-label="Close modal"
        onClick={() => setShowCreate(false)}
        className="absolute inset-0 cursor-default"
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-expert-title"
        className="custom-scrollbar relative z-10 max-h-[94vh] w-full max-w-5xl overflow-y-auto rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950"
      >
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white/95 px-5 py-4 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/95 sm:px-7">
          <div>
            <h2 id="create-expert-title" className="text-xl font-bold text-black dark:text-white">
              Create New Expert
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Add account, professional and personal information.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowCreate(false)}
            disabled={loading}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <FiX size={22} />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="p-5 sm:p-7">
          <div className="mb-8 flex flex-col items-center">
            <div className="relative">
              <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-slate-100 shadow-lg dark:border-slate-800 dark:bg-slate-900">
                {imagePreview ? (
                  <img src={imagePreview} alt="Expert preview" className="h-full w-full object-cover" />
                ) : (
                  <FiUser className="text-5xl text-slate-400" />
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 flex h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-black text-white shadow-lg dark:border-slate-950 dark:bg-white dark:text-black"
              >
                <FiCamera size={17} />
              </button>
              {imagePreview && (
                <button
                  type="button"
                  onClick={removeProfileImage}
                  className="absolute right-0 top-0 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-white"
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
            <p className="mt-3 text-xs text-slate-500">JPG, PNG or WEBP. Maximum 5 MB.</p>
          </div>

          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-500">Account details</h3>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Full name" required icon={FiUser}>
              {textInput("fullname", "Dr. Expert Name", { type: "text", required: true, icon: true })}
            </Field>
            <Field label="Email address" required icon={FiMail}>
              {textInput("email", "expert@example.com", { type: "email", required: true, icon: true })}
            </Field>
            <Field label="Phone number" icon={FiPhone}>
              {textInput("phone", "+91 98765 43210", { type: "tel", icon: true })}
            </Field>
            <Field label="Password" required icon={FiLock}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                minLength={6}
                required
                placeholder="Minimum 6 characters"
                className={`${inputClass} pl-11 pr-12`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </Field>
          </div>

          <h3 className="mb-4 mt-8 text-sm font-bold uppercase tracking-wider text-slate-500">Professional details</h3>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Designation" icon={FiBriefcase}>{textInput("designation", "CSSD Manager", { icon: true })}</Field>
            <Field label="Qualification">{textInput("qualification", "M.Sc, B.Sc Nursing")}</Field>
            <Field label="Specialization">{textInput("specialization", "Sterilization and infection control")}</Field>
            <Field label="Experience (years)">{textInput("experienceYears", "10", { type: "number", min: 0, max: 80 })}</Field>
            <Field label="Organization">{textInput("organization", "Hospital or institution name")}</Field>
            <Field label="Department">{textInput("department", "CSSD")}</Field>
            <Field label="Registration number">{textInput("registrationNo", "Professional registration number")}</Field>
            <Field label="LinkedIn URL" icon={FiLink}>{textInput("linkedinUrl", "https://linkedin.com/in/...", { type: "url", icon: true })}</Field>
            <div className="sm:col-span-2">
              <Field label="Expertise">
                {textInput("expertise", "Sterilization, Infection Control, CSSD Management")}
              </Field>
              <p className="mt-1.5 text-xs text-slate-500">Separate multiple expertise areas with commas.</p>
            </div>
            <div className="sm:col-span-2">
              <Field label="About">
                <textarea name="about" value={formData.about} onChange={handleChange} maxLength={500} rows={4} placeholder="Short professional biography" className={`${inputClass} resize-none`} />
              </Field>
              <p className="mt-1 text-right text-xs text-slate-500">{formData?.about?.length}/500</p>
            </div>
          </div>

          <h3 className="mb-4 mt-8 text-sm font-bold uppercase tracking-wider text-slate-500">Personal details</h3>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Gender">
              <select name="gender" value={formData.gender} onChange={handleChange} className={inputClass}>
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
              </select>
            </Field>
            <Field label="Date of birth" icon={FiCalendar}>
              {textInput("dateOfBirth", "", { type: "date", max: new Date().toISOString().split("T")[0], icon: true })}
            </Field>
            <Field label="City">{textInput("city", "City")}</Field>
            <Field label="State">{textInput("state", "State")}</Field>
            <div className="sm:col-span-2">
              <Field label="Address" icon={FiMapPin}>
                <textarea name="address" value={formData.address} onChange={handleChange} maxLength={500} rows={3} placeholder="Complete address" className={`${inputClass} resize-none pl-11`} />
              </Field>
            </div>
          </div>

          <div className="mt-8">
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Account status</label>
            <div className="grid grid-cols-2 gap-3">
              {[{ value: "true", label: "Active", color: "green" }, { value: "false", label: "Inactive", color: "red" }].map((option) => (
                <label
                  key={option.value}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 ${
                    formData.status === option.value
                      ? option.color === "green" ? "border-green-500 bg-green-50 dark:bg-green-500/10" : "border-red-500 bg-red-50 dark:bg-red-500/10"
                      : "border-slate-200 dark:border-slate-700"
                  }`}
                >
                  <input type="radio" name="status" value={option.value} checked={formData.status === option.value} onChange={handleChange} />
                  <span className="text-sm font-semibold text-black dark:text-white">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 dark:border-slate-800 sm:flex-row sm:justify-end">
            <button type="button" onClick={() => setShowCreate(false)} disabled={loading} className="rounded-xl border border-slate-300 px-6 py-3 text-sm font-semibold dark:border-slate-700 dark:text-white">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="flex items-center justify-center gap-2 rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white disabled:opacity-60 dark:bg-white dark:text-black">
              {loading ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white dark:border-black/30 dark:border-t-black" />Creating...</> : <><FiSave size={17} />Create Expert</>}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default CreateExpert;