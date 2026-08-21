import { Request, Response } from "express";
import ClassSession from "../models/classSession.model.js";
import { AuthRequest } from "../middlewares/auth.middleware.js";
import Booking from "../models/bookings.model.js";

export const createClass = async (req: AuthRequest, res: Response) => {
  try {
    const trainerId = req.user!.id;
    const { title, timeSlot, capacity } = req.body;

    const existingSession = await ClassSession.findOne({
      trainer: trainerId,
      timeSlot,
    });

    if (existingSession) {
      return res.status(400).json({
        message: "You already have a class at this time",
      });
    }

    const newClass = await ClassSession.create({
      title,
      trainer: trainerId,
      timeSlot: new Date(timeSlot),
      capacity,
    });

    return res.status(201).json({
    message: "Class session created successfully :)",
    data: newClass 
    });

  } catch (error) {
    const message = error instanceof Error ? error.message : "";

    return res.status(500).json({
      message: `Problem in server: ${message}`,
    });
  }
};

export const getClasses = async (req: AuthRequest, res: Response) => {
  try {
    const trainerId = req.user!.id;
    const cSessions = await ClassSession.find({
      trainer: trainerId,
    });
    if (cSessions.length === 0) {
      return res.status(404).json({
        message: "you don't have classes yet",
      });
    }
    res.status(200).json(cSessions);
  } catch (error) {
    const message = error instanceof Error ? error.message : "";

    return res.status(500).json({
      message: `Problem in server: ${message}`,
    });
  }
};

export const updateClass = async (req: AuthRequest, res: Response) => {
  try {
    const trainerId = req.user!.id;

    const cSession = await ClassSession.findById(req.params.id);

    if (!cSession) {
      return res.status(404).json({
        message: "Class not found",
      });
    }

    if (cSession.trainer.toString() !== trainerId) {
      return res.status(403).json({
        message: "You can only Update your own class sessions",
      });
    }

    const CSessionData = {
      title: req.body.title,
      timeSlot: req.body.timeSlot,
      capacity: req.body.capacity,
    };

    const updatedClass = await ClassSession.findByIdAndUpdate(
      req.params.id,
      CSessionData,
      { new: true, runValidators: true },
    );
    if (!updatedClass) {
      return res.status(404).json({
        message: "Class not found",
      });
    }
    res.status(200).json({
      message: "class has been updated successfuly"
      , updatedClass});
  } catch (error) {
    const message = error instanceof Error ? error.message : "";

    return res.status(500).json({
      message: `Problem in server: ${message}`,
    });
  }
};

export const deleteClass = async (req: AuthRequest, res: Response) => {
  try {
    const trainerId = req.user!.id;

    const cSession = await ClassSession.findById(req.params.id);

    if (!cSession) {
      return res.status(404).json({
        message: "Class not found",
      });
    }

    if (cSession.trainer.toString() !== trainerId) {
      return res.status(403).json({
        message: "You can only delete your own class sessions",
      });
    }
    const checkBookingExist = await Booking.findOne({
      session: cSession._id,
      status: "booked",
    });

    if (checkBookingExist) {
      return res.status(400).json({
        message:
          "You cannot delete this session because members have already booked it",
      });
    }
    const deletedClass = await ClassSession.findByIdAndDelete(req.params.id);

    if (!deletedClass) {
      return res.status(404).json({
        message: "Class not found",
      });
    }

    return res.status(200).json({
      message: "Class deleted successfully",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";

    return res.status(500).json({
      message: `Problem in server: ${message}`,
    });
  }
};

export const searchClasses = async (req:Request , res:Response) => { 
    try { 
        const {title, trainer, day, time , available} = req.query; 
        const filter : any ={}; 
        if(title){ 
            filter.title={ $regex: title, $options: "i"}; 
        } 
        if(trainer){ 
            filter.trainer=trainer; 
        } 
        if (day){ 
            const startOfDay = new Date(day as string); 
            startOfDay.setHours(0,0,0,0); 

            const endOfDay = new Date(day as string); 
            endOfDay.setHours(23,59,59,999); 

            filter.timeSlot={ 
                $gte:startOfDay, 
                $lte:endOfDay 
            }; 

        } 
        if(time){ 
            const[hours,minutes]=(time as string).split(":").map(Number); 
            filter.timeSlot={ 
                $expr:{ 
                    $and:[ 
                        { 
                            $eq:[{$hour:"$timeSlot"}, hours] 
                        }, 
                        { 
                            $eq:[{$minute:"$timeSlot"}, minutes] 
                        }, 
                    ] 
                } 
            }; 
        } 
      const classes = await ClassSession.find(filter).populate("trainer"); 
      if (available) {
  const availableClasses = [];

  for (const cSession of classes) {
    const bookedCount = await Booking.countDocuments({
      session: cSession._id,
      status: "booked"
    });

    if (bookedCount < cSession.capacity) {
      availableClasses.push(cSession);
    }
  }

  return res.status(200).json(availableClasses);
}
        res.status(200).json(classes); 
    }catch(error){ 
        res.status(500).json({ 
            message:"Failed to search classes" 
        }); 
    } 
};      