import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  price: {
    type: String,
    required: true,
  },

  duration: {
    type: String,
    required: true,
  },
});

const gallerySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  image: {
    type: String,
    required: true,
  },
});
const availabilitySchema = new mongoose.Schema({
  day: {
    type: String,
    required: true,
  },

  times: [
    {
      type: String,
    },
  ],
});
const stylistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    name: {
      type: String,
      required: true,
    },

    specialty: {
      type: String,
      required: true,
    },

    bio: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      required: true,
    },

    services: [serviceSchema],

    gallery: [gallerySchema],
    availability: [availabilitySchema],
    blockedDates: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  },
);


const Stylist = mongoose.model("Stylist", stylistSchema);

export default Stylist;
