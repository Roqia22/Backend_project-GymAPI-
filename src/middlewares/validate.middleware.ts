import type { NextFunction, Request, Response } from "express";

function checkEmailFormat(email: string): boolean {
    const eRegex = /^[^\s@.]+@(gmail|yahoo)\.com$/;

    return eRegex.test(email);
};

function StrongPasswordChecker(password: string): boolean {
    const pRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[@#$%]).{8,}$/;

    return pRegex.test(password);
};

export function validateSignUp(req: Request, res: Response, next: NextFunction){
  
  try{  const {email , password} = req.body;
    if(!checkEmailFormat(email)){
            return  res.status(400).json({'msg': "email formate not valid"})
    }
    if(password === email){
      return res.status(400).json({'msg': "password must be not have the email "})
    }
    if(!StrongPasswordChecker(password) ){
      return res.status(400).json({'msg': "password length must be at least 8 characters contain capital and small char & number 0 to 9 & {@#$%} "})
    }    
    next();
    }catch (error) {
  return res.status(404).json({
    message: `Register Failed`,});
  }
};

export function validateCreateClassSession(req: Request, res: Response, next: NextFunction){
  
  try{  const {title,timeSlot,capacity} = req.body;
    if(!title || !timeSlot ||  !capacity){
          return res.status(400).json({ message: "All fields are required" })
    }
    if(capacity <1) return res.status(400).json({ message: "Capacity must be greater than zero and integer" })
    if (timeSlot < new Date()) {
      return res.status(400).json({ message: "Session must be in the future" });
    }
    next();
  } catch (error) {
  return res.status(404).json({
    message: `created classSeccsion Failed`,
  });}
};