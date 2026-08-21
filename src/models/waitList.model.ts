import mongoose, { Schema } from "mongoose";

const waitListSchema = new Schema({
  member: {
    type: Schema.Types.ObjectId,
    ref: "User", 
    required: true
  },
  session: {
    type: Schema.Types.ObjectId,
    ref: "ClassSession", 
    required: true
  },

});

export default  mongoose.model("WaitList", waitListSchema);