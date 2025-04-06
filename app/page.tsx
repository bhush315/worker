"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Blogs {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

export default function Home() {
  const [blogs, setBlogs] = useState<Blogs[]>([]); // Initialize state to hold the fetched data
  const [isLoading, setIsLoading] = useState(true); // Set to true initially to show loading spinner

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/blogs/create", {
          cache: "no-store",
        });
        const result = await response.json();
        setBlogs(result.data); // Store the fetched data in the state
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false); // Hide loading indicator once fetch is complete
      }
    };

    fetchData(); // Fetch the data on mount
  }, []);

  return (
    <div className="p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {/* <h1 className="text-3xl font-semibold mb-6">VIEW BLOG</h1> */}

      {isLoading ? (
        // Show loading spinner while the data is being fetched
        <div className="flex justify-center items-center">
          <div className="w-16 h-16 border-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        </div>
      ) : blogs.length === 0 ? (
        // Show "No blogs available" only when there are no blogs and loading is complete
        <p className="text-lg text-gray-500">No blogs available</p>
      ) : (
        // Display the blogs once data is fetched
        blogs.map((blog) => (
          <Link href={`/blogviews/${blog.id}`} key={blog.id}>
            <div className="flex flex-col bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 mb-6">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900">{blog.name}</h2>
                <p className="text-sm text-gray-500">{blog.email}</p>
              </div>
              <div className="bg-gray-100 p-4">
                <p className="text-gray-700">{blog.createdAt}</p>
              </div>
            </div>
          </Link>
        ))
      )}
    </div>
  );
}
