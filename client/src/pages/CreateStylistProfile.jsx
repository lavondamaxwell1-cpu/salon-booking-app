import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createStylist } from "../api/stylists";
import { uploadImage } from "../api/upload";

function CreateStylistProfile() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState("");

  const [services, setServices] = useState([
    { name: "", price: "", duration: "" },
  ]);

  const [gallery, setGallery] = useState([{ title: "", image: "" }]);

  const [availability, setAvailability] = useState([
    { day: "Monday", times: [] },
  ]);

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const timeSlots = [
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
  ];

  function handleServiceChange(index, field, value) {
    const updatedServices = [...services];
    updatedServices[index][field] = value;
    setServices(updatedServices);
  }

  function addService() {
    setServices([...services, { name: "", price: "", duration: "" }]);
  }

  function removeService(index) {
    setServices(services.filter((_, i) => i !== index));
  }

  function handleGalleryChange(index, field, value) {
    const updatedGallery = [...gallery];
    updatedGallery[index][field] = value;
    setGallery(updatedGallery);
  }

  function addGalleryImage() {
    setGallery([...gallery, { title: "", image: "" }]);
  }

  function removeGalleryImage(index) {
    setGallery(gallery.filter((_, i) => i !== index));
  }

  function handleAvailabilityDayChange(index, value) {
    const updatedAvailability = [...availability];
    updatedAvailability[index].day = value;
    setAvailability(updatedAvailability);
  }

  function toggleAvailabilityTime(index, time) {
    const updatedAvailability = [...availability];
    const times = updatedAvailability[index].times;

    if (times.includes(time)) {
      updatedAvailability[index].times = times.filter((item) => item !== time);
    } else {
      updatedAvailability[index].times = [...times, time];
    }

    setAvailability(updatedAvailability);
  }

  function addAvailabilityDay() {
    setAvailability([...availability, { day: "Monday", times: [] }]);
  }

  function removeAvailabilityDay(index) {
    setAvailability(availability.filter((_, i) => i !== index));
  }

  async function handleProfileImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      setError("");

      const res = await uploadImage(file);
      setImage(res.data.imageUrl);
    } catch (error) {
      setError(error.response?.data?.message || "Image upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleGalleryUpload(index, file) {
    if (!file) return;

    try {
      setUploading(true);
      setError("");

      const res = await uploadImage(file);
      handleGalleryChange(index, "image", res.data.imageUrl);
    } catch (error) {
      setError(error.response?.data?.message || "Gallery image upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      await createStylist({
        name,
        specialty,
        bio,
        image,
        services,
        gallery,
        availability,
      });

      navigate("/stylists");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create profile");
    }
  }

  return (
    <div className="min-h-screen bg-pink-50 px-6 py-16">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-lg p-8">
        <p className="text-pink-500 font-semibold uppercase tracking-widest mb-3">
          Stylist Profile
        </p>

        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Create Your Profile
        </h1>

        {error && (
          <p className="bg-red-100 text-red-700 px-4 py-3 rounded-xl mb-5">
            {error}
          </p>
        )}

        {uploading && (
          <p className="bg-pink-100 text-pink-700 px-4 py-3 rounded-xl mb-5 font-semibold">
            Uploading image...
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <input
            type="text"
            placeholder="Stylist Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-pink-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
            required
          />

          <input
            type="text"
            placeholder="Specialty"
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            className="w-full border border-pink-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
            required
          />

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Upload Profile Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleProfileImageUpload}
              className="w-full border border-pink-100 rounded-xl px-4 py-3"
              required={!image}
            />

            {image && (
              <img
                src={image}
                alt="Profile preview"
                className="mt-4 w-40 h-40 object-cover rounded-2xl"
              />
            )}
          </div>

          <textarea
            rows="4"
            placeholder="Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full border border-pink-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
            required
          />

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Services</h2>

            <div className="space-y-4">
              {services.map((service, index) => (
                <div
                  key={index}
                  className="border border-pink-100 rounded-2xl p-4 space-y-3"
                >
                  <input
                    type="text"
                    placeholder="Service Name"
                    value={service.name}
                    onChange={(e) =>
                      handleServiceChange(index, "name", e.target.value)
                    }
                    className="w-full border border-pink-100 rounded-xl px-4 py-3"
                    required
                  />

                  <input
                    type="text"
                    placeholder="Price ex: $85"
                    value={service.price}
                    onChange={(e) =>
                      handleServiceChange(index, "price", e.target.value)
                    }
                    className="w-full border border-pink-100 rounded-xl px-4 py-3"
                    required
                  />

                  <input
                    type="text"
                    placeholder="Duration ex: 1.5 hrs"
                    value={service.duration}
                    onChange={(e) =>
                      handleServiceChange(index, "duration", e.target.value)
                    }
                    className="w-full border border-pink-100 rounded-xl px-4 py-3"
                    required
                  />

                  {services.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeService(index)}
                      className="text-red-500 font-semibold"
                    >
                      Remove Service
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addService}
              className="mt-4 border border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white px-5 py-2 rounded-full font-semibold transition"
            >
              Add Service
            </button>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Hairstyle Gallery
            </h2>

            <div className="space-y-4">
              {gallery.map((item, index) => (
                <div
                  key={index}
                  className="border border-pink-100 rounded-2xl p-4 space-y-3"
                >
                  <input
                    type="text"
                    placeholder="Style Title"
                    value={item.title}
                    onChange={(e) =>
                      handleGalleryChange(index, "title", e.target.value)
                    }
                    className="w-full border border-pink-100 rounded-xl px-4 py-3"
                    required
                  />

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleGalleryUpload(index, e.target.files[0])
                    }
                    className="w-full border border-pink-100 rounded-xl px-4 py-3"
                    required={!item.image}
                  />

                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.title || "Gallery preview"}
                      className="w-40 h-40 object-cover rounded-2xl"
                    />
                  )}

                  {gallery.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(index)}
                      className="text-red-500 font-semibold"
                    >
                      Remove Image
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addGalleryImage}
              className="mt-4 border border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white px-5 py-2 rounded-full font-semibold transition"
            >
              Add Gallery Image
            </button>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Availability
            </h2>

            <div className="space-y-4">
              {availability.map((item, index) => (
                <div
                  key={index}
                  className="border border-pink-100 rounded-2xl p-4 space-y-4"
                >
                  <select
                    value={item.day}
                    onChange={(e) =>
                      handleAvailabilityDayChange(index, e.target.value)
                    }
                    className="w-full border border-pink-100 rounded-xl px-4 py-3"
                  >
                    {daysOfWeek.map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {timeSlots.map((time) => (
                      <button
                        type="button"
                        key={time}
                        onClick={() => toggleAvailabilityTime(index, time)}
                        className={`px-4 py-2 rounded-full border font-semibold ${
                          item.times.includes(time)
                            ? "bg-pink-500 text-white border-pink-500"
                            : "text-pink-500 border-pink-300"
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>

                  {availability.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeAvailabilityDay(index)}
                      className="text-red-500 font-semibold"
                    >
                      Remove Day
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addAvailabilityDay}
              className="mt-4 border border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white px-5 py-2 rounded-full font-semibold transition"
            >
              Add Availability Day
            </button>
          </div>

          <button
            disabled={uploading}
            className="w-full bg-pink-500 hover:bg-pink-600 text-white py-4 rounded-full text-lg font-semibold transition disabled:opacity-60"
          >
            Create Profile
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateStylistProfile;
