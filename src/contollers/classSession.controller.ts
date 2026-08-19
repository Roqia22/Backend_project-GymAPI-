import { Request , Response} from "express";
import ClassSession from "../models/classSession.model.js";

export const createClass = async (req:Request , res:Response)=>{
    try{
        const newClass = await ClassSession.create(req.body);

        res.status(201).json(newClass);
    }catch (error){
        res.status(500).json({
            message: "Failed to create class"
        });
    }
    
};

export const getClasses = async (req: Request, res:Response )=>{
try {
    const classes = await ClassSession.find().populate("trainer" );
    res.status(200).json(classes);
}catch (error){
       res.status(400).json ({
        message:"Failed to get class"
       });
}
};

export const updateClass = async (req:Request, res:Response)=>{
try{
    const updatedClass = await ClassSession.findByIdAndUpdate(
         req.params.id, req.body,
        {new: true, runValidators: true});
    if (!updatedClass){
        return res.status(404).json({
            message:"Class not found"
        });
        res.status(200).json(updatedClass);
    }
}catch (error){
        res.status(400).json({
            message:"Failed to update class"
        });
    }
};
export const deleteClass= async (req:Request, res:Response)=>{
try{
    const deletedClass = await ClassSession.findByIdAndDelete(
        req.params.id
    );
    if(!deletedClass){
        return res.status(404).json({
            message:"Class not found"
        });
    }
    res.status(200).json({
        message:"Class deleted successfully"
    });
}catch(error){
    res.status(400).json({
        message:"Failed to delete class"
    });
}

};
export const searchClasses = async (req:Request , res:Response) =>{
    try {
        const {title, trainer} = req.query;
        const filter : any ={};
        if(title){
            filter.title={ $regex: title, $options: "i"};
        }
        if(trainer){
            filter.trainer=trainer;
        }
        const classes = await ClassSession.find(filter).populate("trainer");
        res.status(200).json(classes);
    }catch(error){
        res.status(500).json({
            message:"Failed to search classes"
        });
    }
};