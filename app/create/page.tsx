"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const CreateBlog = () => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch("/api/blogs/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json(); // Get the response JSON

      if (!response.ok) {
        // Handle the case where the response is not ok (validation or server error)
        setError(result.error || "An unknown error occurred");
        return;
      }

      // If successful, navigate to the homepage
      router.push("/");
      setSuccess(true);
      setLoading(false);
      setFormData({ name: "", email: "" });
    } catch (error) {
      // Catch any unexpected errors (like network errors)
      setError("An unexpected error occurred");
      console.error("Error creating blog:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <form
        onSubmit={handleSubmit}
        className="text-black max-w-xl mx-auto bg-white p-8 rounded-lg shadow-lg"
      >
        <div>
          <label
            htmlFor="name"
            className="block text-lg font-medium text-gray-700 mb-2"
          >
            Name:
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={handleChange}
            name="name"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-lg font-medium text-gray-700 mb-2"
          >
            Email:
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={handleChange}
            name="email"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          />
        </div>

        <button
          type="submit"
          className="cursor-pointer w-full py-3 mt-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          disabled={loading}
        >
          {loading ? "Loading..." : "Create"}
        </button>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        {success && (
          <p className="text-green-500 text-sm mt-2">
            Blog created successfully!
          </p>
        )}
      </form>
    </div>
  );
};

export default CreateBlog;
