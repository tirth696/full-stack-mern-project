import { useState } from "react";
import axios from "axios";

// import { useNavigate } from "react-router-dom";
const ServiceDetailPage = (prop) => {
  //   const navigate = useNavigate();
  const [Booking, setBooking] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const axiosInstance = axios.create({
    withCredentials: true,
  });
  const [formData, setFormData] = useState({
    serviceName: prop.name,
    name: "",
    email: "",
    phone: "",
    serviceDate: null,
    serviceTime: "",
    carType: "",
    comments: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null); // Clear previous error messages
    setIsLoading(true);
    console.log(formData);

    try {
      if (!validateServiceDate(formData.serviceDate)) {
        setError("Service date cannot be in the past.");
        setIsLoading(false);
        return;
      }
      const response = await axiosInstance.post(
        "http://localhost:4000/api/v1/booking/new",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // ... (existing code)

      if (response.data && response.data.success) {
        // Success case: reset form data
        setFormData({
          serviceName: prop.name,
          name: "",
          email: "",
          phone: "",
          serviceDate: null,
          serviceTime: "",
          carType: "",
          comments: "",
        });
        setMessage("Service booking successfully!");
      } else {
        // Handle validation or other errors
        setError(response.data?.message || "Service booking failed.");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Service booking failed.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  const validateServiceDate = (serviceDate) => {
    const today = new Date();
    const selectedDate = new Date(serviceDate);

    return selectedDate >= today;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setMessage(null);
    // console.log(name);
    // console.log(value);
    setFormData((prevData) => ({
      ...prevData,
      [name]: value, // Handle file or text input
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col items-center">
          <img
            src={prop.image}
            alt={prop.name}
            className="w-[80%] h-[70dvh] mb-4 rounded-lg object-cover"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-4">{prop.name}</h1>
          <div className="flex items-center mb-2">
            {[...Array(prop.ratings)].map((_, index) => (
              <svg
                key={index}
                className="w-4 h-4 text-yellow-300"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 22 20"
              >
                <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
              </svg>
            ))}
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded ml-3">
              {prop.ratings}
            </span>
          </div>
          <p className="text-black text-sm mb-4">{prop.comments}</p>
          <div className="flex items-center mb-4">
            <span className="text-green-500">
              {" "}
              Booking Price : ${prop.price}
            </span>
          </div>
          <p className="text-sm text-black mb-4">category : {prop.category}</p>
          <button
            className={`bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg `}
            onClick={() => setBooking((pre) => !pre)}
          >
            Book Service
          </button>
          <br />
          <br />
          {message && ( // Conditionally display error message
            <span className="text-green-500 font-bold text-sm block mb-4">
              {message}
            </span>
          )}
        </div>
      </div>
      {Booking && (
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Service book</h1>
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            {error && ( // Conditionally display error message
              <span className="text-red-500 font-bold text-sm block mb-4">
                {error}
              </span>
            )}
            {message && ( // Conditionally display error message
              <span className="text-green-500 font-bold text-sm block mb-4">
                {message}
              </span>
            )}
            <div className="flex flex-col">
              <label htmlFor="name" className="text-sm font-medium mb-2">
                User Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="email" className="text-sm font-medium mb-2">
                email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="phone" className="text-sm font-medium mb-2">
                phone
              </label>
              <input
                type="number"
                minLength="10"
                maxLength="10"
                id="phone"
                name="phone"
                className="rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="serviceDate" className="text-sm font-medium mb-2">
                serviceDate
              </label>
              <input
                type="date"
                id="serviceDate"
                name="serviceDate"
                className="rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={formData.serviceDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="serviceTime" className="text-sm font-medium mb-2">
                serviceTime
              </label>
              <select
                className="rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                name="serviceTime"
                id="serviceTime"
                onChange={handleChange}
              >
                <option value="selectTime">Select Time</option>
                <option value="8-10">8-10</option>
                <option value="10-12">10-12</option>
                <option value="1-3">1-3</option>
                <option value="3-5">3-5</option>
                <option value="5-7">5-7</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label htmlFor="carType" className="text-sm font-medium mb-2">
                carType
              </label>
              <select
                className="rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                name="carType"
                id="carType"
                onChange={handleChange}
              >
                <option value="selectCarType">Select Car Type</option>
                <option value="sedan">sedan</option>
                <option value="hatchback">hatchback</option>
                <option value="suv">suv</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label htmlFor="comments" className="text-sm font-medium mb-2">
                comments
              </label>
              <textarea
                id="comments"
                name="comments"
                className="rounded-md border border-gray-300 p-2 h-24 resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
                onChange={handleChange}
                value={formData.comments}
              />
            </div>

            {error && (
              <span className="text-red-500 font-bold text-sm block mb-4">
                {error}
              </span>
            )}
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
              disabled={isLoading}
            >
              {isLoading ? "booking..." : "book Service"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ServiceDetailPage;
