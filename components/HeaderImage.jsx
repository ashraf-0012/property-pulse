import Image from "next/image";

const HeaderImage = ({ property }) => {
  return (
    <section>
      <div className="container-xl m-auto">
        <div className="relative w-full h-[300px] md:h-[400px]">
          <Image
            src={property.images[0]}
            alt={property.name}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default HeaderImage;
