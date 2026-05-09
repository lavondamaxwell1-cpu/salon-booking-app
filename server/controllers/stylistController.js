import Stylist from "../models/Stylist.js";

export async function createStylist(req, res) {
  const existingStylist = await Stylist.findOne({
    user: req.user._id,
  });

  if (existingStylist) {
    return res.status(400).json({
      message: "You already have a stylist profile",
    });
  }

  const stylist = await Stylist.create({
    ...req.body,
    user: req.user._id,
  });

  res.status(201).json(stylist);
}

export async function getStylists(req, res) {
  const stylists = await Stylist.find().sort({ createdAt: -1 });
  res.json(stylists);
}

export async function getStylistById(req, res) {
  const stylist = await Stylist.findById(req.params.id);

  if (!stylist) {
    return res.status(404).json({ message: "Stylist not found" });
  }

  res.json(stylist);
}

export async function getMyStylistProfile(req, res) {
  const stylist = await Stylist.findOne({ user: req.user._id });

  if (!stylist) {
    return res.status(404).json({ message: "Stylist profile not found" });
  }

  res.json(stylist);
}

export async function updateMyStylistProfile(req, res) {
  const stylist = await Stylist.findOne({ user: req.user._id });

  if (!stylist) {
    return res.status(404).json({ message: "Stylist profile not found" });
  }

  stylist.name = req.body.name || stylist.name;
  stylist.specialty = req.body.specialty || stylist.specialty;
  stylist.bio = req.body.bio || stylist.bio;
  stylist.image = req.body.image || stylist.image;
  stylist.services = req.body.services || stylist.services;
  stylist.gallery = req.body.gallery || stylist.gallery;
  stylist.availability = req.body.availability || stylist.availability;
  stylist.blockedDates = req.body.blockedDates || stylist.blockedDates;

  const updatedStylist = await stylist.save();

  res.json(updatedStylist);
}