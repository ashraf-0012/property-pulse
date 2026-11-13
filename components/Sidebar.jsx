import React from "react";
import BookmarkButton from "./BookmarkButton";
import SharedButton from "./SharedButton";
import PropertyContactForm from "./PropertyContactForm";

const Sidebar = ({ property }) => {
  return (
    <aside className="space-y-4">
      <BookmarkButton property={property} />
      <SharedButton property={property} />
      {/* <!-- Contact Form --> */}
      <PropertyContactForm property={property} />
    </aside>
  );
};

export default Sidebar;
