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
          <div className="relative w-full max-w-5xl h-[300px] md:h-[400px] mx-auto">
            <Image
              src={images[0]}
              alt="Property image"
              onClick={() => handleOpen(0)}
              fill
              sizes="(max-width: 768px) 100vw, 1024px"
              className="object-cover rounded-xl cursor-pointer"
              priority
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {images.map((image, index) => (
              <div
                key={index}
                className={`relative h-[250px] md:h-[400px] ${
                  images.length === 3 && index === 2
                    ? "md:col-span-2"
                    : "col-span-1"
                }`}
              >
                <Image
                  src={image}
                  alt={`Property image ${index + 1}`}
                  onClick={() => handleOpen(index)}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover rounded-xl cursor-pointer"
                  priority={index < 2}
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
