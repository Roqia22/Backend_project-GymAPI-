import { Router } from "express";

import {
    createClass,
    getClasses,
    updateClass,
    deleteClass,
    searchClasses
} from "../controllers/classSession.controller.js";

export const router = Router();
router.post("/", createClass);
router.get("/", getClasses);
router.get("/search", searchClasses);
router.put("/:id", updateClass);
router.delete("/:id", deleteClass);
