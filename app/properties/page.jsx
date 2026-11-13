import PropertyCard from "@/components/PropertyCard";
import Property from "@/models/Property";
import connectDb from "@/config/database";
import PropertySearchForm from "@/components/PropertySearchForm";
import Pagination from "@/components/Pagination";

const PropertiesPage = async ({ searchParams }) => {
  const { page = 1, pagesize = 3 } = await searchParams;

  await connectDb();

  const skip = (page - 1) * pagesize;

  const total = await Property.countDocuments({});

  const properties = await Property.find({}).skip(skip).limit(pagesize).lean();

  return (
    <div>
      <PropertySearchForm />

      <section className="px-4 py-6">
        <div className="container-xl lg:container m-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {properties.length === 0 ? (
              <h1>No property found</h1>
            ) : (
              properties.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))
            )}
          </div>
        </div>
      </section>

      <Pagination
        page={parseInt(page)}
        pagesize={parseInt(pagesize)}
        totalItems={total}
      />
    </div>
  );
};

export default PropertiesPage;
