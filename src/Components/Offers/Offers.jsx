import hero_img1 from "../../assets/hero_img1.jpeg";

const Offers = () => {
  return (
    <div className="flex-1 bg-blue-200 flex items-center justify-center m-4 p-4">
      <div className="flex flex-col justify-center items-center w-1/2 gap-6">
        <h1 className="text-6xl font-semibold">Exclusive</h1>
        <h2 className="text-5xl font-medium">Offers For You</h2>
        <p className="text-4xl font-normal">
          ONLY ON BEST PRODUCTS AND SERVICES
        </p>
        <button className="text-gray-900 hover:text-white bg-gray-200 hover:bg-gray-800 border border-gray-800 hover:border-transparent focus:ring-4 focus:ring-gray-300 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 inline-flex items-center">
          Check Now
        </button>
      </div>
      <div className="w-1/2">
        <img src={hero_img1} className="rounded-xl" alt="" />
      </div>
    </div>
  );
};

export default Offers;