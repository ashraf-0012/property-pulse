import { FaPaperPlane } from "react-icons/fa";
import { useFormStatus } from "react-dom";

export const SubmitMessageButton = () => {
  const { pending } = useFormStatus();
  return (
    <div>
      <button
        type="submit"
        disabled={pending}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded w-full flex items-center justify-center gap-2"
      >
        <FaPaperPlane />
        {pending ? "Sending..." : "Send Message"}
      </button>
    </div>
  );
};
