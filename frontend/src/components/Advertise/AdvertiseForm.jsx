import React, { useState } from "react";

const AdvertiseForm = ({ onNext }) => {
  const [form, setForm] = useState({
    projectName: "",
    website: "",
    telegram: "",
    banner: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      setForm((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !form.projectName ||
      !form.website ||
      !form.telegram ||
      !form.banner
    ) {
      alert("Please fill all fields.");
      return;
    }

    onNext(form);
  };

  return (
    <div className="bg-[#131722] border border-gray-800 rounded-xl p-6">
      <h2 className="text-xl font-bold text-white mb-6">
        Advertise Your Project
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Project Name */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">
            Project Name
          </label>

          <input
            type="text"
            name="projectName"
            value={form.projectName}
            onChange={handleChange}
            placeholder="Enter project name"
            className="w-full bg-[#1e232e] border border-gray-700 rounded-lg px-4 py-3 text-white outline-none focus:border-green-500"
          />
        </div>

        {/* Website */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">
            Website
          </label>

          <input
            type="url"
            name="website"
            value={form.website}
            onChange={handleChange}
            placeholder="https://example.com"
            className="w-full bg-[#1e232e] border border-gray-700 rounded-lg px-4 py-3 text-white outline-none focus:border-green-500"
          />
        </div>

        {/* Telegram */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">
            Telegram
          </label>

          <input
            type="text"
            name="telegram"
            value={form.telegram}
            onChange={handleChange}
            placeholder="@telegram"
            className="w-full bg-[#1e232e] border border-gray-700 rounded-lg px-4 py-3 text-white outline-none focus:border-green-500"
          />
        </div>

        {/* Banner */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">
            Upload Banner
          </label>

          <input
            type="file"
            name="banner"
            accept="image/*"
            onChange={handleChange}
            className="w-full bg-[#1e232e] border border-gray-700 rounded-lg px-4 py-3 text-gray-300 file:bg-green-600 file:text-white file:border-0 file:px-3 file:py-2 file:rounded file:mr-4"
          />

          {form.banner && (
            <p className="text-green-400 text-xs mt-2">
              Selected: {form.banner.name}
            </p>
          )}
        </div>

        {/* Button */}
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-500 text-white font-semibold py-3 rounded-lg transition"
        >
          Continue →
        </button>
      </form>
    </div>
  );
};

export default AdvertiseForm;