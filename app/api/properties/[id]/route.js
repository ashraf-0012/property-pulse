// import connectDb from "@/config/database";
// import Property from "@/models/Property";

// export const GET = async (request,{params}) => {
//     try{
//         await connectDb
//         const property = await Property.findById({params.id})
//         if(!property)return new Response("property not found", {status:200})

//         return new Response(properties, {status:200})
//     }catch(error){
//         return new Response("Something went wrong",  {status:400})
//     }
// }