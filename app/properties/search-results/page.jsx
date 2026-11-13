import connectDb from "@/config/database";
import Property from "@/models/Property";
import PropertySearchForm from "@/components/PropertySearchForm";
import PropertyCard from "@/components/PropertyCard";
import { convertToSerializableObject } from "@/utils/convertToObject";

const SearchResultPage = async ({ searchParams }) => {
  const { location, propertyType } = await searchParams;
  await connectDb();

  const locationPattern = new RegExp(location, "i");

  let query = {
    $or: [
      { name: locationPattern },
      { description: locationPattern },
      { name: locationPattern },
      { "location.street": locationPattern },
      { "location.city": locationPattern },
      { "location.state": locationPattern },
      { "location.zipcode": locationPattern },
    ],
  };

  if (propertyType && propertyType !== "All") {
    const typePattern = new RegExp(propertyType, "i");
    query.type = typePattern;
  }

  const propertiesQueryResults = await Property.find(query).lean();

  const properties = convertToSerializableObject(propertiesQueryResults);

  return (
    <div>
      {/* <!-- Search --> */}
      <PropertySearchForm />
      {/* <!-- All Listings --> */}
      <section className="px-4 py-6">
        <div className="container-xl lg:container m-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* <!-- Listing Card --> */}
            {properties.length === 0 ? (
              <h1>No search property</h1>
            ) : (
              properties.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* <!-- Pagination --> */}
      <section className="container mx-auto flex justify-center items-center my-8">
        <button className="mr-2 px-2 py-1 border border-gray-300 rounded">
          Previous
        </button>
        <span className="mx-2">Page 1 of 10</span>
        <button className="ml-2 px-2 py-1 border border-gray-300 rounded">
          Next
        </button>
      </section>
    </div>
  );
};

export default SearchResultPage;
