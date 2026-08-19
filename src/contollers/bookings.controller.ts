import type { Request, Response } from "express";
import Booking from "../models/bookings.model.js"
import ClassSession from "../models/temp-sessions.model.js"

const bookClass = async (req: Request, res: Response) => {
    try{
  const { sessionId } = req.body;
  const memberId = req.user!.id;
  const session= await ClassSession.findById(sessionId)
  if(!session){
    return res.status(404).json({
        message :"Class session not found"
    })
  } 
   if (new Date(session.timeSlot) < new Date()) {
      return res.status(400).json({ message: "Session must be in the future" });
    }
  const booked=await Booking.findOne({
    member: memberId,
  session: sessionId,
  status: "booked"
  })
  if(booked){
    return res.status(400).json({ message: "You already booked this session" });
  }
  const bookings=await Booking.find({ 
  session: sessionId,
  status: "booked"})
  if(bookings.length>=session.capacity){
    return res.status(400).json({ message: "This session is fully booked" });

  }
  const  booking=await Booking.create({
    member: memberId,
  session: sessionId
  })
  
    return res.status(201).json(booking);
  
}
catch(error){
    return res.status(500).json({ message: "Error Booking" ,error});

}  
};

export { bookClass };
