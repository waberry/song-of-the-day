"use client";

import { useState } from "react";
import Link from "next/link";
import { FaUser, FaEnvelope, FaComment, FaMusic } from "react-icons/fa";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setSubmitResult("Thank you for your message. Our music experts will get back to you soon!");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="container mx-auto mt-10 p-4">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Contact Song of the Day</h1>
        <Link href="/" className="text-blue-500 hover:text-blue-700">
          Back to Home
        </Link>
      </div>
      <div className="rounded-lg bg-white p-8 shadow-lg">
        <p className="mb-6 text-gray-600">
          Have a question about our music guessing game? Want to suggest a feature or report an issue? We'd love to hear from you!
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <FaUser className="text-gray-400" />
              </div>
              <input
                type="text"
                name="name"
                id="name"
                className="block w-full rounded-md border-2 border-gray-300 py-3 pl-10 pr-3 text-base transition duration-150 ease-in-out focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <FaEnvelope className="text-gray-400" />
              </div>
              <input
                type="email"
                name="email"
                id="email"
                className="block w-full rounded-md border-2 border-gray-300 py-3 pl-10 pr-3 text-base transition duration-150 ease-in-out focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="message"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Message
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 pt-3">
                <FaComment className="text-gray-400" />
              </div>
              <textarea
                name="message"
                id="message"
                rows={6}
                className="block w-full rounded-md border-2 border-gray-300 py-3 pl-10 pr-3 text-base transition duration-150 ease-in-out focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Your message or feedback about Song of the Day"
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-sm transition duration-150 ease-in-out hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                "Sending..."
              ) : (
                <>
                  <FaMusic className="mr-2" />
                  Send Message
                </>
              )}
            </button>
          </div>
        </form>
        {submitResult && (
          <div className="mt-6 text-center text-lg text-green-600">
            {submitResult}
          </div>
        )}
      </div>
    </div>
  );
}