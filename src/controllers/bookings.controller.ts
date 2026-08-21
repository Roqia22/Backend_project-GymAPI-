import type { Request, Response } from "express";
import mongoose from "mongoose";
import Booking from "../models/bookings.model.js";
import ClassSession from "../models/classSession.model.js";
import WaitList from "../models/waitList.model.js";
import { AuthRequest } from "../middlewares/ِAuth.middleware.js";

const bookClass = async (req: AuthRequest, res: Response) => {
  try {   
    const { sessionId } = req.body;
    const memberId = req.user!.id;
    const session = await ClassSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({
        message: "Class session not found",
      });
    }
    if (new Date(session.timeSlot) < new Date()) {
      return res.status(400).json({ message: "Session must be in the future" });
    }
    const booked = await Booking.findOne({
      member: memberId,
      session: sessionId,
      status: "booked",
    });
  
   
    if (booked) {
      return res
        .status(400)
        .json({ message: "You already booked this session" });
    }
    const bookings = await Booking.find({
      session: sessionId,
      status: "booked",
    });
    if (bookings.length >= session.capacity) {
      const alreadyWaiting = await WaitList.findOne({
        member: memberId,
        session: sessionId,
      });
      if (!alreadyWaiting) {
        await WaitList.create({ member: memberId, session: sessionId });
      }
  
      return res
        .status(201)
        .json({
          message:
            "This session is fully booked, You were added to the wait list",
        });
    }
    const booking = await Booking.create({
      member: memberId,
      session: sessionId,
    });
    return res.status(201).json(booking);
  } catch (error) {
    return res.status(500).json({ message: "Error booking class", error });
  }
};

const cancelBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { bookingId } = req.params;
    const memberId = req.user!.id;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }
    if (memberId !== booking.member.toString()) {
      return res.status(403).json({
        message: "You can only access your own bookings",
      });
    }
    const session = await ClassSession.findById(booking.session);

    if (session && new Date(session.timeSlot) < new Date()) {
      return res.status(400).json({ message: "Session must be in the future" });
    }
    if (booking.status === "cancelled") {
      return res.status(400).json({
        message: "This booking is already cancelled",
      });
    }

    booking.status = "cancelled";
   
    await booking.save();
    const waiting = await WaitList.findOne({ session: booking.session });
    if (waiting) {
      await Booking.create({
        member: waiting.member,
        session: booking.session,
      });
      await WaitList.deleteOne({ _id: waiting._id });
    }

  
    return res.status(200).json(booking);
  } catch (error) {
    return res.status(500).json({ message: "Error cancelling booking", error });
  }
};

const viewSessionBookings = async (req: AuthRequest, res: Response) => {
  try {
    const { sessionId } = req.params as { sessionId: string };

    const trainerId = req.user!.id;

    const session = await ClassSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({
        message: "Class session not found",
      });
    }

    if (trainerId !== session.trainer.toString()) {
      return res.status(403).json({
        message: "You can only access your own sessions",
      });
    }
    const bookings = await Booking.find({
      session: new mongoose.Types.ObjectId(sessionId),
      status: "booked",
    }).populate("member", "fullName email");

    return res.status(200).json(bookings);
  } catch (error) {
    return res.status(500).json({ message: "Error viewing bookings", error });
  }
};

export { bookClass, cancelBooking, viewSessionBookings };