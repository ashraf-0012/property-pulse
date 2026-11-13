import PropertyCard from "@/components/PropertyCard";
// import properties from "@/properties_9ja.json";
import Link from "next/link";
import connectDb from "@/config/database";
import Property from "@/models/Property";

const HomeProperties = async () => {
  await connectDb();
  const recentProperties = await Property.find({})
    .sort({ createdAt: -1 })
    .limit(3);

  // const shuffledProperties = properties.sort(() => Math.random() - 0.5);
  // const recentProperties = shuffledProperties.slice(0, 3);

  return (
    <>
      {/* // <!-- Recent Properties --> */}
      <section className="px-4 py-6">
        <div className="container-xl lg:container m-auto">
          <h2 className="text-3xl font-bold text-blue-500 mb-6 text-center">
            Recent Properties
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* <!-- Listing 1 --> */}
            {recentProperties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        </div>
      </section>

      <section className="m-auto max-w-lg my-10 px-6">
        <Link
          href="/properties"
          className="block bg-black text-white text-center py-4 px-6 rounded-xl hover:bg-gray-700"
        >
          View All Properties
        </Link>
      </section>
    </>
  );
};

export default HomeProperties;
