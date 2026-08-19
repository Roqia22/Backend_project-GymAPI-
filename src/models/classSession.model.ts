import mongoose, {Schema} from "mongoose";

const classSessionSchema = new Schema({
    title: {
        type : String,
        required : true
    },
    trainer:{
        type : Schema.Types.ObjectId,
        ref: "User",
        required :true
    },
    timeSlot:{
        type: Date,
        required: true
    
    },
    capacity :{
        type: Number,
        required: true,
        min: 1

    }
});
const ClassSession = mongoose.model("ClassSession", classSessionSchema);
export default ClassSession;
