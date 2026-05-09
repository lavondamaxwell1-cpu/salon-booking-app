import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyStylistProfile, updateMyStylistProfile } from "../api/stylists";
import { uploadImage } from "../api/upload";

function EditStylistProfile() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState("");
  const [services, setServices] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [blockedDates, setBlockedDates] = useState([]);
  const [newBlockedDate, setNewBlockedDate] = useState("");
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

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await getMyStylistProfile();

        setName(res.data.name);
        setSpecialty(res.data.specialty);
        setBio(res.data.bio);
        setImage(res.data.image);
        setServices(res.data.services || []);
        setGallery(res.data.gallery || []);
        setAvailability(res.data.availability || []);
        setBlockedDates(res.data.blockedDates || []);

      } catch (error) {
        console.log("UPLOAD ERROR:", error.response?.data || error.message);
        setError(
          error.response?.data?.message ||
            error.response?.data?.error ||
            "Image upload failed",
        );
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);function addBlockedDate() {
    if (!newBlockedDate) return;

    if (!blockedDates.includes(newBlockedDate)) {
      setBlockedDates([...blockedDates, newBlockedDate]);
    }

    setNewBlockedDate("");
  }

  function removeBlockedDate(date) {
    setBlockedDates(blockedDates.filter((item) => item !== date));
  }

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

  async function handleProfileImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      setError("");

      const res = await uploadImage(file);
      setImage(res.data.imageUrl);
    } catch (error) {
      setError(error.response?.data?.message || "Profile image upload failed");
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
      await updateMyStylistProfile({
        name,
        specialty,
        bio,
        image,
        services,
        gallery,
        blockedDates,
      });

      navigate("/stylists");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update profile");
    }
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
  if (loading) {
    return (
      <div className="min-h-screen bg-pink-50 flex items-center justify-center">
        <p className="text-pink-500 font-semibold text-xl">
          Loading profile...
        </p>
      </div>
    );
  }

  if (error === "Stylist profile not found") {
    return (
      <div className="min-h-screen bg-pink-50 flex items-center justify-center px-6">
        <div className="bg-white rounded-3xl shadow-lg p-10 text-center max-w-md">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            No Profile Yet
          </h1>

          <p className="text-gray-500 mb-6">
            Create your stylist profile before editing it.
          </p>

          <button
            onClick={() => navigate("/create-stylist-profile")}
            className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-full font-semibold transition"
          >
            Create Profile
          </button>
        </div>
      </div>
    );
  }

 return (
   <div className="min-h-screen bg-pink-50 px-4 sm:px-6 py-8 sm:py-16">
     <div className="max-w-3xl mx-auto bg-white rounded-2xl sm:rounded-3xl shadow-lg p-5 sm:p-8">
       {/* HEADER */}
       <p className="text-pink-500 font-semibold uppercase tracking-widest mb-2 text-sm sm:text-base">
         Stylist Profile
       </p>

       <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 sm:mb-8">
         Edit Your Profile
       </h1>

       {/* ERROR */}
       {error && (
         <p className="bg-red-100 text-red-700 px-4 py-3 rounded-xl mb-5 text-sm sm:text-base">
           {error}
         </p>
       )}

       {/* UPLOADING */}
       {uploading && (
         <p className="bg-pink-100 text-pink-700 px-4 py-3 rounded-xl mb-5 font-semibold text-sm sm:text-base">
           Uploading image...
         </p>
       )}

       <form onSubmit={handleSubmit} className="space-y-8">
         {/* BASIC INFO */}
         <input
           type="text"
           placeholder="Stylist Name"
           value={name}
           onChange={(e) => setName(e.target.value)}
           className="w-full border border-pink-100 rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-pink-400"
           required
         />

         <input
           type="text"
           placeholder="Specialty"
           value={specialty}
           onChange={(e) => setSpecialty(e.target.value)}
           className="w-full border border-pink-100 rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-pink-400"
           required
         />

         {/* PROFILE IMAGE */}
         <div>
           <label className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base">
             Replace Profile Image
           </label>

           <input
             type="file"
             accept="image/*"
             onChange={handleProfileImageUpload}
             className="w-full border border-pink-100 rounded-xl px-4 py-3 text-sm sm:text-base"
           />

           {image && (
             <img
               src={image}
               alt="Profile preview"
               className="mt-4 w-full max-w-[160px] h-40 object-cover rounded-2xl"
             />
           )}
         </div>

         {/* BIO */}
         <textarea
           rows="4"
           placeholder="Bio"
           value={bio}
           onChange={(e) => setBio(e.target.value)}
           className="w-full border border-pink-100 rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-pink-400"
           required
         />

         {/* SERVICES */}
         <div>
           <h2 className="text-2xl font-bold text-gray-900 mb-4">Services</h2>

           <div className="space-y-4">
             {services.map((service, index) => (
               <div
                 key={service._id || index}
                 className="border border-pink-100 rounded-2xl p-4 space-y-3"
               >
                 <input
                   type="text"
                   placeholder="Service Name"
                   value={service.name}
                   onChange={(e) =>
                     handleServiceChange(index, "name", e.target.value)
                   }
                   className="w-full border border-pink-100 rounded-xl px-4 py-3 text-sm sm:text-base"
                   required
                 />

                 <input
                   type="text"
                   placeholder="Price ex: $85"
                   value={service.price}
                   onChange={(e) =>
                     handleServiceChange(index, "price", e.target.value)
                   }
                   className="w-full border border-pink-100 rounded-xl px-4 py-3 text-sm sm:text-base"
                   required
                 />

                 <input
                   type="text"
                   placeholder="Duration ex: 1.5 hrs"
                   value={service.duration}
                   onChange={(e) =>
                     handleServiceChange(index, "duration", e.target.value)
                   }
                   className="w-full border border-pink-100 rounded-xl px-4 py-3 text-sm sm:text-base"
                   required
                 />

                 {services.length > 1 && (
                   <button
                     type="button"
                     onClick={() => removeService(index)}
                     className="text-red-500 font-semibold text-sm sm:text-base"
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
             className="mt-4 w-full sm:w-auto border border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white px-5 py-3 rounded-full font-semibold transition"
           >
             Add Service
           </button>
         </div>

         {/* GALLERY */}
         <div>
           <h2 className="text-2xl font-bold text-gray-900 mb-4">
             Hairstyle Gallery
           </h2>

           <div className="space-y-4">
             {gallery.map((item, index) => (
               <div
                 key={item._id || index}
                 className="border border-pink-100 rounded-2xl p-4 space-y-3"
               >
                 <input
                   type="text"
                   placeholder="Style Title"
                   value={item.title}
                   onChange={(e) =>
                     handleGalleryChange(index, "title", e.target.value)
                   }
                   className="w-full border border-pink-100 rounded-xl px-4 py-3 text-sm sm:text-base"
                   required
                 />

                 <input
                   type="file"
                   accept="image/*"
                   onChange={(e) =>
                     handleGalleryUpload(index, e.target.files[0])
                   }
                   className="w-full border border-pink-100 rounded-xl px-4 py-3 text-sm sm:text-base"
                 />

                 {item.image && (
                   <img
                     src={item.image}
                     alt={item.title || "Gallery preview"}
                     className="w-full max-w-[160px] h-40 object-cover rounded-2xl"
                   />
                 )}

                 {gallery.length > 1 && (
                   <button
                     type="button"
                     onClick={() => removeGalleryImage(index)}
                     className="text-red-500 font-semibold text-sm sm:text-base"
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
             className="mt-4 w-full sm:w-auto border border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white px-5 py-3 rounded-full font-semibold transition"
           >
             Add Gallery Image
           </button>
         </div>

         {/* AVAILABILITY */}
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
                   className="w-full border border-pink-100 rounded-xl px-4 py-3 text-sm sm:text-base"
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
                       className={`px-4 py-2 rounded-full border text-sm sm:text-base font-semibold ${
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
                     className="text-red-500 font-semibold text-sm sm:text-base"
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
             className="mt-4 w-full sm:w-auto border border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white px-5 py-3 rounded-full font-semibold transition"
           >
             Add Availability Day
           </button>
         </div>

         {/* BLOCKED DATES */}
         <div>
           <h2 className="text-2xl font-bold text-gray-900 mb-4">
             Blocked / Vacation Dates
           </h2>

           <div className="flex flex-col sm:flex-row gap-3">
             <input
               type="date"
               value={newBlockedDate}
               onChange={(e) => setNewBlockedDate(e.target.value)}
               className="flex-1 border border-pink-100 rounded-xl px-4 py-3 text-sm sm:text-base"
             />

             <button
               type="button"
               onClick={addBlockedDate}
               className="w-full sm:w-auto bg-pink-500 hover:bg-pink-600 text-white px-5 py-3 rounded-xl font-semibold transition"
             >
               Add
             </button>
           </div>

           <div className="mt-4 space-y-2">
             {blockedDates.length === 0 ? (
               <p className="text-gray-500 text-sm sm:text-base">
                 No blocked dates yet.
               </p>
             ) : (
               blockedDates.map((date) => (
                 <div
                   key={date}
                   className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-pink-50 rounded-xl px-4 py-3"
                 >
                   <span className="font-semibold text-gray-700 text-sm sm:text-base break-words">
                     {date}
                   </span>

                   <button
                     type="button"
                     onClick={() => removeBlockedDate(date)}
                     className="text-red-500 font-semibold text-sm sm:text-base"
                   >
                     Remove
                   </button>
                 </div>
               ))
             )}
           </div>
         </div>

         {/* SUBMIT */}
         <button
           disabled={uploading}
           className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold transition disabled:opacity-60"
         >
           Save Changes
         </button>
       </form>
     </div>
   </div>
 );
}

export default EditStylistProfile;
