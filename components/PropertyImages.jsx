"use client";

import { useState } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";

const PropertyImages = ({ images }) => {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const slides = images.map((image) => ({
    src: image,
  }));

  const handleOpen = (imageIndex) => {
    setIndex(imageIndex);
    setOpen(true);
  };

  return (
    <>
      <section className="bg-blue-50 p-4">
        {images.length === 1 ? (
          <Image
            src={images[0]}
            alt="Property image"
            onClick={() => handleOpen(0)}
            className="object-cover h-[400px] mx-auto rounded-xl cursor-pointer"
            width={1800}
            height={400}
            priority
          />
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {images.map((image, index) => (
              <div
                key={index}
                className={`${
                  images.length === 3 && index === 2
                    ? "col-span-2"
                    : "col-span-1"
                }`}
              >
                <Image
                  src={image}
                  alt={`Property image ${index + 1}`}
                  onClick={() => handleOpen(index)}
                  className="object-cover h-[400px] w-full rounded-xl cursor-pointer"
                  width={1800}
                  height={400}
                  priority
                />
              </div>
            ))}
          </div>
        )}
      </section>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={index}
        slides={slides}
        plugins={[Zoom]}
      />
    </>
  );
};

export default PropertyImages;
