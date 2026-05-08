import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { getMyStylistProfile } from "../api/stylists";
import {
  getStylistAppointments,
  updateAppointmentDateTime,
  updateAppointmentStatus,
} from "../api/appointments";
import socket from "../api/socket";
function StylistCalendar() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  function formatDate(dateObj) {
    return dateObj.toISOString().split("T")[0];
  }

  function formatTime(dateObj) {
    return dateObj.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  }
  function addMinutes(dateTimeString, minutes) {
    const date = new Date(dateTimeString);
    date.setMinutes(date.getMinutes() + minutes);
    return date.toISOString();
  }
  function convertToDateTime(date, time) {
    const [hourMinute, period] = time.split(" ");
    let [hours, minutes] = hourMinute.split(":");

    hours = Number(hours);
    minutes = Number(minutes);

    if (period === "PM" && hours !== 12) {
      hours += 12;
    }

    if (period === "AM" && hours === 12) {
      hours = 0;
    }

    return `${date}T${String(hours).padStart(2, "0")}:${String(
      minutes,
    ).padStart(2, "0")}:00`;
  }
  async function handleEventResize(info) {
    const appointmentId = info.event.id;
    const newDate = formatDate(info.event.start);
    const newTime = formatTime(info.event.start);

    const durationMinutes = (info.event.end - info.event.start) / (1000 * 60);

    try {
      await updateAppointmentDateTime(
        appointmentId,
        newDate,
        newTime,
        durationMinutes,
      );
    } catch (error) {
      setError(error.response?.data?.message || "Failed to resize appointment");
      info.revert();
    }
  }
  async function fetchAppointments() {
    try {
      const res = await getStylistAppointments();

      let blockedDateEvents = [];

      try {
        const profileRes = await getMyStylistProfile();

        blockedDateEvents =
          profileRes.data.blockedDates?.map((date) => ({
            id: `blocked-${date}`,
            title: "Unavailable",
            start: date,
            allDay: true,
            display: "background",
            backgroundColor: "#fecdd3",
          })) || [];
      } catch {
        console.log("No stylist profile found yet");
      }

      const calendarEvents = res.data.map((appointment) => {
        const start = convertToDateTime(appointment.date, appointment.time);

        let color = "#f59e0b";

        if (appointment.status === "Canceled") {
          color = "#ef4444";
        } else if (appointment.status === "Completed") {
          color = "#3b82f6";
        } else if (appointment.paymentStatus === "Paid") {
          color = "#22c55e";
        }

        return {
          id: appointment._id,
          title: `${appointment.service} - ${
            appointment.customer?.name || "Customer"
          }`,
          start,
          end: addMinutes(start, appointment.durationMinutes || 60),
          backgroundColor: color,
          borderColor: color,
          extendedProps: {
            appointment,
          },
        };
      });

      setEvents([...calendarEvents, ...blockedDateEvents]);
    } catch (error) {
      console.log("CALENDAR ERROR:", error.response?.data || error.message);
      setError(error.response?.data?.message || "Failed to load calendar");
    }
  }

  useEffect(() => {
    async function loadAppointments() {
      await fetchAppointments();
    }

    loadAppointments();

   socket.on("connect", () => {
     console.log("SOCKET CONNECTED:", socket.id);
   });
    
    socket.on("appointmentUpdated", fetchAppointments);
    socket.on("appointmentCanceled", fetchAppointments);

    return () => {
      socket.on("appointmentCreated", () => {
        console.log("APPOINTMENT CREATED EVENT RECEIVED");
        fetchAppointments();
      });
      socket.off("appointmentUpdated", fetchAppointments);
      socket.off("appointmentCanceled", fetchAppointments);
    };
  }, []);
  async function handleEventDrop(info) {
    const appointmentId = info.event.id;
    const newDate = formatDate(info.event.start);
    const newTime = formatTime(info.event.start);
    const profileRes = await getMyStylistProfile();

    if (profileRes.data.blockedDates?.includes(newDate)) {
      setError("This date is blocked. Choose another date.");
      info.revert();
      return;
    }

    try {
      await updateAppointmentDateTime(appointmentId, newDate, newTime);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update appointment");
      info.revert();
    }
  }
  async function handleStatusUpdate(id, status) {
    try {
      await updateAppointmentStatus(id, status);

      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === id
            ? {
                ...event,
                backgroundColor:
                  status === "Completed"
                    ? "#3b82f6"
                    : status === "Canceled"
                      ? "#ef4444"
                      : event.backgroundColor,
                borderColor:
                  status === "Completed"
                    ? "#3b82f6"
                    : status === "Canceled"
                      ? "#ef4444"
                      : event.borderColor,
                extendedProps: {
                  ...event.extendedProps,
                  appointment: {
                    ...event.extendedProps.appointment,
                    status,
                  },
                },
              }
            : event,
        ),
      );

      setSelectedAppointment((prev) => (prev ? { ...prev, status } : prev));
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update appointment");
    }
  }

  return (
    <div className="min-h-screen bg-pink-50 px-6 py-16">
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-lg p-6">
        <p className="text-pink-500 font-semibold uppercase tracking-widest mb-3">
          Stylist Schedule
        </p>

        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Appointment Calendar
        </h1>

        {error && (
          <p className="bg-red-100 text-red-700 px-4 py-3 rounded-xl mb-6">
            {error}
          </p>
        )}

        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          events={events}
          editable={true}
          eventDrop={handleEventDrop}
          height="auto"
          eventClick={(info) => {
            setSelectedAppointment(info.event.extendedProps.appointment);
          }}
          eventResize={handleEventResize}
        />
      </div>
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-6 z-50">
          <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Appointment Details
            </h2>

            <div className="space-y-3 text-gray-700">
              <p>
                <span className="font-bold">Service:</span>{" "}
                {selectedAppointment.service}
              </p>

              <p>
                <span className="font-bold">Customer:</span>{" "}
                {selectedAppointment.customer?.name || "Customer"}
              </p>

              <p>
                <span className="font-bold">Email:</span>{" "}
                {selectedAppointment.customer?.email || "No email"}
              </p>

              <p>
                <span className="font-bold">Date:</span>{" "}
                {selectedAppointment.date}
              </p>

              <p>
                <span className="font-bold">Time:</span>{" "}
                {selectedAppointment.time}
              </p>

              <p>
                <span className="font-bold">Status:</span>{" "}
                {selectedAppointment.status}
              </p>

              <p>
                <span className="font-bold">Payment:</span>{" "}
                {selectedAppointment.paymentStatus}
              </p>

              {selectedAppointment.notes && (
                <p>
                  <span className="font-bold">Notes:</span>{" "}
                  {selectedAppointment.notes}
                </p>
              )}
            </div>

            <button
              onClick={() => setSelectedAppointment(null)}
              className="mt-6 w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-full font-semibold transition"
            >
              Close
            </button>
            <div className="grid grid-cols-2 gap-3 mt-6">
              <button
                onClick={() =>
                  handleStatusUpdate(selectedAppointment._id, "Completed")
                }
                className="bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-full font-semibold transition"
              >
                Complete
              </button>

              <button
                onClick={() =>
                  handleStatusUpdate(selectedAppointment._id, "Canceled")
                }
                className="bg-red-500 hover:bg-red-600 text-white py-3 rounded-full font-semibold transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StylistCalendar;
