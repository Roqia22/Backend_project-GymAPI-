import mongoose, { Schema } from "mongoose";

const bookingSchema = new Schema({
  member: {
    type: Schema.Types.ObjectId,
    ref: "User", // users model
    required: true
  },
  session: {
    type: Schema.Types.ObjectId,
    ref: "ClassSession", // sessions model
    required: true
  },

  status: {
    type: String,
    enum: ["booked", "cancelled"],
    default: "booked"
  },
});

export default mongoose.model("Booking", bookingSchema);
