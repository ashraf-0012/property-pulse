import HeaderImage from "@/components/HeaderImage";
import PropertySearchForm from "@/components/PropertySearchForm";
import connectDb from "@/config/database";
import Property from "@/models/Property";
import PropertyImages from "@/components/PropertyImages";
import Link from "next/link";
import { convertToSerializableObject } from "@/utils/convertToObject";
import {
  FaArrowLeft,
  FaBed,
  FaBath,
  FaTimes,
  FaCheck,
  FaRulerCombined,
  FaMoneyBill,
  FaMapMaker,
} from "react-icons/fa";
import Sidebar from "@/components/Sidebar";

const PropertyPage = async ({ params, searchParams }) => {
  const { id } = await params;
  const { category } = await searchParams;
  await connectDb();
  const propertyDocs = await Property.findById(id).lean();
  const property = convertToSerializableObject(propertyDocs);

  if (!property) {
    return (
      <h1 className="text-center text-2xl font-bold mt-10">
        Property Not Found
      </h1>
    );
  }
  return (
    <>
      {/* <!-- Search --> */}
      <PropertySearchForm />

      {/* <!-- Property Header Image --> */}
      <HeaderImage property={property} />

      {/* <!-- Go Back --> */}
      <section>
        <div className="container m-auto py-6 px-6">
          <Link
            href="/properties"
            className="text-blue-500 hover:text-blue-600 flex items-center"
          >
            <i className="fas fa-arrow-left mr-2"></i> Back to Properties
          </Link>
        </div>
      </section>

      {/* <!-- Property Info --> */}
      <section className="bg-blue-50">
        <div className="container m-auto py-10 px-6">
          <div className="grid grid-cols-1 md:grid-cols-70/30 w-full gap-6">
            <main>
              <div className="bg-white p-6 rounded-lg shadow-md text-center md:text-left">
                <div className="text-gray-500 mb-4">{property.type}</div>
                <h1 className="text-3xl font-bold mb-4">{property.name}</h1>
                <div className="text-gray-500 mb-4 flex align-middle justify-center md:justify-start">
                  <i className="fa-solid fa-location-dot text-lg text-orange-700 mr-2"></i>
                  <p className="text-orange-700">
                    {property.location.street}, {property.location.city},{" "}
                    {property.location.state}
                  </p>
                </div>

                <h3 className="text-lg font-bold my-6 bg-gray-800 text-white p-2">
                  Rates & Options
                </h3>
                <div className="flex flex-col md:flex-row justify-around">
                  <div className="flex items-center justify-center mb-4 border-b border-gray-200 md:border-b-0 pb-4 md:pb-0">
                    <div className="text-gray-500 mr-2 font-bold">Nightly</div>
                    {property.rates.nightly ? (
                      <div className="text-2xl font-bold text-blue-500">
                        N{property.rates.nightly.toLocaleString()}
                      </div>
                    ) : (
                      <FaTimes className=" text-red-700" />
                    )}
                  </div>
                  <div className="flex items-center justify-center mb-4 border-b border-gray-200 md:border-b-0 pb-4 md:pb-0">
                    <div className="text-gray-500 mr-2 font-bold">Weekly</div>
                    {property.rates.weekly ? (
                      <div className="text-2xl font-bold text-blue-500">
                        N{property.rates.weekly.toLocaleString()}
                      </div>
                    ) : (
                      <FaTimes className=" text-red-700" />
                    )}
                  </div>
                  <div className="flex items-center justify-center mb-4 pb-4 md:pb-0">
                    <div className="text-gray-500 mr-2 font-bold">Monthly</div>
                    {property.rates.monthly ? (
                      <div className="text-2xl font-bold text-blue-500">
                        N{property.rates.monthly.toLocaleString()}
                      </div>
                    ) : (
                      <FaTimes className=" text-red-700" />
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md mt-6">
                <h3 className="text-lg font-bold mb-6">
                  Description & Details
                </h3>
                <div className="flex justify-center gap-4 text-blue-500 mb-4 text-xl space-x-9">
                  <p>
                    <FaBed className="fa-solid inline mr-2" /> {property.beds}
                    <span className="hidden sm:inline">Beds</span>
                  </p>
                  <p>
                    <FaBath className="fa-solid inline mr-2" /> {property.baths}
                    <span className="hidden sm:inline">Baths</span>
                  </p>
                  <p>
                    <FaRulerCombined className="fa-solid inline mr-2" />
                    {property.square_feet}
                    <span className="hidden sm:inline">sqft</span>
                  </p>
                </div>
                <p className="text-gray-500 mb-4">{property.description}</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md mt-6">
                <h3 className="text-lg font-bold mb-6">Amenities</h3>

                <ul
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
                 list-none"
                >
                  {property.amenities.map((amenity, index) => (
                    <li key={index}>
                      <FaCheck className="text-green-600 mr-2 inline-block" />
                      {amenity}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md mt-6">
                <div id="map"></div>
              </div>
            </main>

            {/* <!-- Sidebar --> */}
            <Sidebar property={property} />
          </div>
        </div>
      </section>

      <PropertyImages images={property.images} />
    </>
  );
};

export default PropertyPage;
