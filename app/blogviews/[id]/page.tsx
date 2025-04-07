"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation"; // This is the correct hook for dynamic params in App Router

interface Blog {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export default function BlogPage() {
  const { id } = useParams(); // Using useParams to get dynamic route param
  const [blog, setBlog] = useState<Blog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const Router = useRouter(); // Using useRouter to programmatically navigate

  // Helper function to format the 'createdAt' field
  const formatDate = (dateString: string) => {
    const now = new Date();
    const createdAt = new Date(dateString);
    const diffInSeconds = Math.floor(
      (now.getTime() - createdAt.getTime()) / 1000
    );

    // Time difference in different units
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInSeconds < 60) {
      return "just now";
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes === 1 ? "" : "s"} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours === 1 ? "" : "s"} ago`;
    } else if (diffInDays < 30) {
      return `${diffInDays} day${diffInDays === 1 ? "" : "s"} ago`;
    } else {
      return createdAt.toLocaleDateString(); // Return the full date for older posts
    }
  };

  useEffect(() => {
    if (!id) return; // Return if the `id` is not available yet

    const fetchBlog = async () => {
      try {
        const response = await fetch(`/api/blogs/${id}`, { cache: "no-cache" });
        const result = await response.json();

        if (result.success) {
          setBlog(result.data); // Set the blog data
        } else {
          setError(result.error);
        }
      } catch (error) {
        setError("Failed to fetch blog" + error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlog();
  }, [id]); // Re-run the effect when `id` changes

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!blog) {
    return Router.push("/");
  }

  // Function to delete the blog
  const deleteBlog = async () => {
    try {
      await fetch(`/api/blogs/${blog.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      Router.push("/"); // Navigate back to the home page after deleting the blog
    } catch (error) {
      setError("Failed to delete blog" + error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold">{blog.name}</h1>
      <p className="text-lg text-gray-600">{blog.email}</p>
      <p className="mt-4 text-gray-500">
        <span className="flex space-x-4">
          <span className="text-amber-700">
            Created: {formatDate(blog.createdAt)}
          </span>
          <span className="text-green-700">
            Updated: {formatDate(blog.updatedAt)}
          </span>
        </span>
      </p>

      {/* Display the formatted date */}
      <p className="mt-4 space-x-4">
        <button
          onClick={() => Router.push("/")}
          className="cursor-pointer px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
        >
          Back to Home
        </button>
        <button
          onClick={() => Router.push(`/edit/${blog.id}`)}
          className="cursor-pointer px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition duration-200"
        >
          Edit Worker
        </button>
        <button
          onClick={deleteBlog}
          className="cursor-pointer px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200"
        >
          Delete Worker
        </button>
      </p>
      {/* Additional blog content can go here */}
    </div>
  );
}
