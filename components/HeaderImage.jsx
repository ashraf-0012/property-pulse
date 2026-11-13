import Image from "next/image";

const HeaderImage = ({ property }) => {
  return (
    <section>
      <div className="container-xl m-auto">
        <div className="grid grid-cols-1">
          <Image
            src={property.images[0]}
            alt=""
            sizes="100vw"
            width={0}
            height={0}
            className="object-cover h-[400px] w-full"
          />
        </div>
      </div>
    </section>
  );
};

export default HeaderImage;
