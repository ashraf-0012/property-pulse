"use client";

import {
  FacebookShareButton,
  WhatsappShareButton,
  EmailShareButton,
  XShareButton,
  FacebookIcon,
  WhatsappIcon,
  XIcon,
  EmailIcon,
} from "react-share";

const SharedButton = ({ property }) => {
  const shareUrl = `${process.env.NEXT_PUBLIC_DOMAIN}/properties/${property._id}`;

  const hashtag = `${property.type.replace(/\s/g, "")}ForRent`;

  return (
    <>
      <h3 className="text-xl font-bold text-center pt-2">
        Share This Property
      </h3>

      <div className="flex gap-3 justify-center pb-5">
        <FacebookShareButton
          url={shareUrl}
          quote={property.name}
          hashtag={`#${hashtag}`}
        >
          <FacebookIcon size={40} />
        </FacebookShareButton>

        <WhatsappShareButton
          url={shareUrl}
          title={property.name}
          separator="::"
        >
          <WhatsappIcon size={40} />
        </WhatsappShareButton>

        <XShareButton url={shareUrl} text={property.name} hashtags={[hashtag]}>
          <XIcon size={40} />
        </XShareButton>

        <EmailShareButton
          url={shareUrl}
          subject={property.name}
          body={`Check out this property listing: ${shareUrl}`}
        >
          <EmailIcon size={40} />
        </EmailShareButton>
      </div>
    </>
  );
};

export default SharedButton;
