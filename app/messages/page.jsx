import MessageCard from "@/components/MessageCard";
import connectDb from "@/config/database";
import Property from "@/models/Property";
import Message from "@/models/Message";
import { convertToSerializableObject } from "@/utils/convertToObject";
import { getSessionUser } from "@/utils/getSessionUser";
import { redirect } from "next/navigation";

const MessagesPage = async () => {
  await connectDb();

  // Check authentication
  const sessionUser = await getSessionUser();

  if (!sessionUser || !sessionUser.userId) {
    redirect("/");
  }

  const { userId } = sessionUser;

  // Get all read messages
  const readMessages = await Message.find({
    recipient: userId,
    read: true,
  })
    .sort({ createdAt: -1 })
    .populate("sender", "username")
    .populate("property", "name")
    .lean();

  // Get all unread messages
  const unReadMessages = await Message.find({
    recipient: userId,
    read: false,
  })
    .sort({ createdAt: -1 })
    .populate("sender", "username")
    .populate("property", "name")
    .lean();

  // Combine read and unread messages
  // Convert Mongoose documents into serializable objects
  const messages = [...unReadMessages, ...readMessages].map((messageDocs) => {
    const message = convertToSerializableObject(messageDocs);

    message.sender = convertToSerializableObject(message.sender);
    message.property = convertToSerializableObject(message.property);

    return message;
  });

  return (
    <section className="bg-blue-50">
      <div className="container m-auto py-24 max-w-6xl">
        <div className="bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0">
          <h1 className="text-3xl font-bold mb-4">Your Messages</h1>

          <div className="space-y-4">
            {messages.length === 0 ? (
              <p>You have no messages</p>
            ) : (
              messages.map((message) => (
                <MessageCard key={message._id} message={message} />
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MessagesPage;
