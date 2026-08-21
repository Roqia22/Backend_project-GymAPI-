import { Router } from "express";
import { auth, authZ } from "../middlewares/auth.middleware.js";
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

import { userRole } from "../models/users.model.js";
import { validateCreateClassSession, validateSignUp } from "../middlewares/validate.middleware.js";

export const router = Router();




/**
 * @swagger
 * /gym/signUp:
 *   post:
 *     tags:
 *       - User
 *     summary: Sign Up to the gym Api Management
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Sign Up Successfully
 *         content: 
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Sign Up failed check your info
 *       500:
 *         description: Some server error!
 */

router.post("/signUp",validateSignUp, signUp);


/**
 * @swagger
 * /gym/signIn:
 *   post:
 *     tags:
 *       - User
 *     summary: Sign In to the gym API
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignIn'
 *     responses:
 *       200:
 *         description: Sign In Successfully
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Some server error
 */
router.post("/signIn", signIn);


/**
 * @swagger
 * /gym/classes:
 *   post:
 *     tags:
 *       - ClassSession
 *     summary: Create a class session by trainer only
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ClassSession'
 *     responses:
 *       201:
 *         description: Class session created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ClassSession'
 *       401:
 *         description: Unauthorized - authentication required
 *       403:
 *         description: Forbidden - only trainers can create class sessions
 *       404:
 *         description: failed to created session check credentials
 *       500:
 *         description: Some server error
 */

router.post(
  "/classes",
  auth,
  authZ(userRole.TRAINER),
  validateCreateClassSession,
  createClass
);

/**
 * @swagger
 * /gym/classes/all:
 *   get:
 *     tags:
 *       - ClassSession
 *     summary: get  class sessions by trainer only
 *     responses:
 *       201:
 *         description: Your Class sessions Info
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ClassSession'
 *       401:
 *         description: Unauthorized - authentication required
 *       500:
 *         description: Some server error
 */
router.get("/classes/all",auth, authZ(userRole.TRAINER), getClasses); //must show all his sessions


/**
 * @swagger
 * /gym/classes/search:
 *   get:
 *     tags:
 *       - ClassSession
 *     summary: Search and filter available class sessions
 *     description: Members can search and filter class sessions by title, trainer, day, time, and availability.
 *     parameters:
 *       - in: query
 *         name: title
 *         required: false
 *         schema:
 *           type: string
 *         description: Search by class title
 *
 *       - in: query
 *         name: trainer
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter by trainer ID
 *
 *       - in: query
 *         name: day
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter classes by date
 *
 *       - in: query
 *         name: time
 *         required: false
 *         schema:
 *           type: string
 *           example: "18:00"
 *         description: Filter classes by time
 *
 *       - in: query
 *         name: available
 *         required: false
 *         schema:
 *           type: string
 *           enum:
 *             - "true"
 *             - "false"
 *         description: Return only classes that have available spots
 *     responses:
 *       200:
 *         description: Classes retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ClassSession'
 *
 *       401:
 *         description: Unauthorized - authentication required
 *
 *       403:
 *         description: Forbidden - only members can search for classes
 *
 *       500:
 *         description: Failed to search classes
 */

router.get("/classes/search",auth, authZ(userRole.MEMBER), searchClasses);//want to be updated

/**
 * @swagger
 * /gym/classes/{id}:
 *   patch:
 *     tags:
 *       - ClassSession
 *     summary: Update a class session by its trainer
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the class session
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ClassSession'
 *     responses:
 *       200:
 *         description: Class session updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ClassSession'
 *       401:
 *         description: Unauthorized - authentication required
 *       403:
 *         description: Forbidden - only the trainer who owns the session can update it
 *       404:
 *         description: Class session not found
 *       500:
 *         description: Some server error
 */

router.patch(
  "/classes/:id",
  auth,
  authZ(userRole.TRAINER),
  updateClass
); // own session

/**
 * @swagger
 * /gym/classes/{id}:
 *   delete:
 *     tags:
 *       - ClassSession
 *     summary: delete a class session by its trainer
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the class session
 *     responses:
 *       200:
 *         description: Class session deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ClassSession'
 *       401:
 *         description: Unauthorized - authentication required
 *       403:
 *         description: Forbidden - only the trainer who owns the session can delete it
 *       404:
 *         description: Class session not found
 *       500:
 *         description: Some server error
 */
router.delete("/classes/:id",auth, authZ(userRole.TRAINER), deleteClass);//own session


/**
 * @swagger
 * /gym/bookings:
 *   post:
 *     tags:
 *       - Booking
 *     summary: Book a class session by member only
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookClassSession'
 *     responses:
 *       201:
 *         description: Class session booked successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *
 *       401:
 *         description: Unauthorized - authentication required
 *
 *       403:
 *         description: Forbidden - only members can book class sessions
 *
 *       404:
 *         description: Class session not found or Class session is full or member already booked this session
 *       500:
 *         description: Some server error
 */

router.post(
  "/bookings",
  auth,
  authZ(userRole.MEMBER),
  bookClass
); // member sends only session ID


/**
 * @swagger
 * /gym/bookings/{bookingId}/cancel:
 *   patch:
 *     tags:
 *       - Booking
 *     summary: Cancel Book a session by Member only
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the Book session
 *     responses:
 *       200:
 *         description:  Book Canceled successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BookClassSession'
 *       401:
 *         description: Unauthorized - authentication required
 *       403:
 *         description: Forbidden - only Member can cancel their booking  only
 *       404:
 *         description: Booking  not found
 *       500:
 *         description: Some server error
 */
router.patch("/bookings/:bookingId/cancel", auth, authZ(userRole.MEMBER), cancelBooking); //own book only


/**
 * @swagger
 * /gym/sessions/{sessionId}:
 *   get:
 *     tags:
 *       - Booking
 *     summary: View bookings for a class session by the trainer
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the class session
 *     responses:
 *       200:
 *         description: Bookings retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Booking'
 *       401:
 *         description: Unauthorized - authentication required
 *       403:
 *         description: Forbidden - only the trainer who owns the session can view its bookings
 *       404:
 *         description: Class session not found
 *       500:
 *         description: Some server error
 */

router.get(
  "/sessions/:sessionId",
  auth,
  authZ(userRole.TRAINER),
  viewSessionBookings
); // own session
