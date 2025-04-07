 

"use client";
import React, { useState, useEffect } from "react";

// This will allow you to access the dynamic params from the URL
import { useParams } from "next/navigation";

const EditPage = ({ params }: { params: { id: string } }) => {
  const { id } = useParams(); // Use `useParams` to access the dynamic ID parameter
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Fetch the initial blog data when the page loads
  useEffect(() => {
    if (!id) return;

    const fetchBlog = async () => {
      setLoading(true); // Set loading state when fetching
      try {
        const response = await fetch(`/api/blogs/${id}`);
        const result = await response.json();

        if (result.success) {
          setFormData({ name: result.data.name, email: result.data.email });
        } else {
          setError("Blog not found");
        }
      } catch (error) {
        setError("Failed to fetch blog data");
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    };

    fetchBlog(); // Fetch the blog data when component mounts
  }, [id]); // Only re-run the effect if `id` changes

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default form submission behavior
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(`/api/blogs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        setSuccess(true); // Display success message
      } else {
        setError(data.error); // Set error message if the update fails
      }
    } catch (error) {
      setError("Failed to update blog");
    } finally {
      setLoading(false); // Set loading to false after submission
    }
  };

  return (
    <div className="p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-3xl font-semibold mb-6">Edit Blog</h1>
      <form
        onSubmit={handleEdit}
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
            Content:
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
          {loading ? "Updating..." : "Update Blog"}
        </button>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        {success && (
          <p className="text-green-500 text-sm mt-2">
            Blog updated successfully!
          </p>
        )}
      </form>
    </div>
  );
};

export default EditPage;
