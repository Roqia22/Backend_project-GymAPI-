import { Router } from "express";
import { auth, authZ } from "../middlewares/validate.middleware.js";
import { signIn, signUp } from "../controllers/user.controller.js";

import {
  createClass,
  getClasses,
  updateClass,
  deleteClass,
  searchClasses,
} from "../controllers/classSession.controller.js";
import {
  bookClass,
  cancelBooking,
  viewSessionBookings,
} from "../controllers/bookings.controller.js";

export const router = Router();

router.post("/signup", signUp);
router.post("/signin", signIn);

router.post("/", createClass);
router.get("/", getClasses);
router.get("/search", searchClasses);
router.put("/:id", updateClass);
router.delete("/:id", deleteClass);

router.post("/bookings", auth, authZ("member"), bookClass);
router.patch("/bookings/:bookingId", auth, authZ("member"), cancelBooking);
router.get("/sessions/:sessionId", auth, authZ("trainer"), viewSessionBookings);
