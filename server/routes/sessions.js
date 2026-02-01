const express = require("express");
const MilkingSession = require("../models/MilkingSession");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { start_time, end_time, duration, milk_quantity } = req.body;

    if (!start_time || !end_time || !duration || milk_quantity === undefined) {
      return res.status(400).json({ message: "Missing required session fields." });
    }

    const session = await MilkingSession.create({
      start_time,
      end_time,
      duration,
      milk_quantity
    });

    return res.status(201).json({
      id: session._id,
      start_time: session.start_time,
      end_time: session.end_time,
      duration: session.duration,
      milk_quantity: session.milk_quantity
    });
  } catch (error) {
    return res.status(500).json({ message: "Unable to save session." });
  }
});

router.get("/", async (req, res) => {
  try {
    const sessions = await MilkingSession.find().sort({ start_time: -1 }).lean();

    return res.json(
      sessions.map((session) => ({
        id: session._id,
        start_time: session.start_time,
        end_time: session.end_time,
        duration: session.duration,
        milk_quantity: session.milk_quantity
      }))
    );
  } catch (error) {
    return res.status(500).json({ message: "Unable to fetch sessions." });
  }
});

module.exports = router;
