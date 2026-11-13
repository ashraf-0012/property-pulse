"use client";

import { FaPaperPlane } from "react-icons/fa";
import { useActionState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import addMessage from "@/app/actions/addMessage";
import { SubmitMessageButton } from "./SubmitMessageButton";

const PropertyContactForm = ({ property }) => {
  const [state, formAction] = useActionState(addMessage, {});
  const { data: session } = useSession();

  useEffect(() => {
    if (state.error) {
      toast.error(state.error);
    }

    if (state.submitted) {
      toast.success("Message sent successfully");
    }
  }, [state]);

  if (state.submitted) {
    return <p className="text-green-500 mb-4">Your message has been sent.</p>;
  }

  return (
    session && (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-6">Contact Property Manager</h3>

        <form action={formAction}>
          {/* Property ID */}
          <input type="hidden" name="property" defaultValue={property._id} />

          {/* Property owner's ID */}
          <input type="hidden" name="recipient" defaultValue={property.owner} />

          {/* Name */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 mb-2">
              Name
            </label>

            <input
              type="text"
              id="name"
              name="name"
              className="w-full px-3 py-2 border rounded"
              placeholder="Your name"
              required
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-2">
              Email
            </label>

            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-3 py-2 border rounded"
              placeholder="Your email"
              required
            />
          </div>

          {/* Phone */}
          <div className="mb-4">
            <label htmlFor="phone" className="block text-gray-700 mb-2">
              Phone
            </label>

            <input
              type="tel"
              id="phone"
              name="phone"
              className="w-full px-3 py-2 border rounded"
              placeholder="Your phone number"
            />
          </div>

          {/* Message */}
          <div className="mb-4">
            <label htmlFor="message" className="block text-gray-700 mb-2">
              Message
            </label>

            <textarea
              id="message"
              name="body"
              className="w-full px-3 py-2 border rounded"
              rows="4"
              placeholder="Enter your message"
              required
            ></textarea>
          </div>

          <SubmitMessageButton />
        </form>
      </div>
    )
  );
};

export default PropertyContactForm;
