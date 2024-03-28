import { useContext, useState } from "react";
import { BookingContex } from "../../Context/BookingContex";
import axios from "axios";

function createServiceReport(BookingData) {
  if (!BookingData || !BookingData.success || !BookingData.bookings) {
    // Check for bookings property
    return null; // Handle invalid or empty BookingData
  }

  const today = new Date();

  const upcomingBookings = BookingData.bookings.filter((booking) => {
    const bookingDate = new Date(booking.serviceDate);
    return bookingDate >= today;
  });

  const formattedBookings = upcomingBookings.map((booking) => {
    // Format serviceDate for better readability (optional)
    const formattedDate = new Date(booking.serviceDate).toLocaleDateString(
      "en-IN"
    );
    return {
      id: booking._id,
      serviceName: booking.serviceName,
      name: booking.name,
      email: booking.email,
      phone: booking.phone,
      serviceDate: formattedDate, // Use formattedDate if needed
      serviceTime: booking.serviceTime,
      comments: booking.comments,
      carType: booking.carType,
    };
  });

  const report = {
    bookingCount: upcomingBookings.length,
    services: formattedBookings,
  };

  return report;
}

const Booking = () => {
  const { BookingData, BookingLoading, BookingError, fetchBookingData } =
    useContext(BookingContex);
  const report = createServiceReport(BookingData);
  const [isCancelling, setIsCancelling] = useState(false); // Track cancellation state
  // console.log(BookingData);
  if (!report) {
    return <p>BookingError creating service report. Invalid BookingData.</p>;
  }
  // console.log(report);
  if (BookingLoading) {
    return <p>BookingLoading Orders...</p>; // Render BookingLoading indicator
  }

  if (BookingError) {
    return (
      <div>
        <p>BookingError fetching Orders: {BookingError}</p>
        <button onClick={fetchBookingData}>Retry</button>
      </div>
    ); // Handle BookingErrors gracefully with retry button
  }

  const { bookingCount, services } = report;

  const handelCancel = async (id) => {
    const axiosInstance = axios.create({ withCredentials: true });

    setIsCancelling(true); // Set loading state before deletion

    try {
      let url = `http://localhost:4000/api/v1/booking/${id}`;
      let DeleteResponse = await axiosInstance.delete(url);
      setIsCancelling(false); // Clear loading state after deletion

      if (DeleteResponse.status === 200) {
        // Reload data on successful deletion
        fetchBookingData();
      } else {
        console.error("Failed to cancel booking:", DeleteResponse.statusText);
        // Handle error scenarios here, e.g., display an error message
      }
    } catch (error) {
      setIsCancelling(false); // Clear loading state on error
      console.error("Error cancelling booking:", error);
      // Handle other errors here
    }
  };

  return (
    <div className="service-report w-full overflow-auto shadow-md rounded-lg p-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Up coming Appointments
      </h2>
      <p className="text-neutral-950 text-lg">
        <span className=" rounded shadow py-2 bg-amber-300 px-3">
          Total Bookings: {bookingCount}
        </span>
      </p>
      <table className="w-full table-auto mt-3 bg-white p-2">
        <thead>
          <tr className="text-left bg-gray-200 border-b border-gray-400 rounded">
            <th className="p-2">ID</th>
            <th className="p-2">Service Name</th>
            <th className="p-2">User Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Phone</th>
            <th className="p-2">Service Date</th>
            <th className="p-2">Service Time</th>
            <th className="p-2">Comments</th>
            <th className="p-2">Car Type</th>
            <th className="p-2">Cancel Booking</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service) => (
            <tr
              key={service.id}
              className="border-b border-gray-400 hover:bg-gray-100"
            >
              <td className="p-2">{service.id}</td>
              <td className="p-2">{service.serviceName}</td>
              <td className="p-2">{service.name}</td>
              <td className="p-2">{service.email}</td>
              <td className="p-2">{service.phone}</td>
              <td className="p-2">{service.serviceDate}</td>
              <td className="p-2">{service.serviceTime}</td>
              <td className="p-2">{service.comments}</td>
              <td className="p-2">{service.carType}</td>
              <td className="p-2">
                {isCancelling && (
                  <span className="text-xs font-medium text-gray-400">
                    Cancelling...
                  </span>
                )}
                <button
                  className="bg-red-500 rounded-lg p-2"
                  onClick={() => handelCancel(service.id)}
                  disabled={isCancelling} // Disable button while cancelling
                >
                  Cancel
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Booking;
