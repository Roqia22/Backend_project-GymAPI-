import swaggerJSDoc from "swagger-jsdoc"
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Gym / Fitness Class Booking API",
      version: "1.0.0",
      description: "A booking system where a gym publishes class sessions and members book a spot, with trainers managing the schedule.",
    },
    servers: [
      {
        url: "/",
      },
    ],
  },

 apis: ["./src/**/*.ts"],
};

export const specs = swaggerJSDoc(options);

//Schema
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - full_name
 *         - email
 *         - password
 *       properties:
 *         full_name:
 *           type: string
 *           description: Full name of the user
 *
 *         email:
 *           type: string
 *           format: email
 *           description: Email address of the user
 *
 *         password:
 *           type: string
 *           format: password
 *           description: Password of the user
 *
 *         role:
 *           type: string
 *           enum:
 *             - member
 *             - trainer
 *           description: Role of the user
 *
 *       example:
 *         full_name: Yazeed Ahmed
 *         email: yazeed@yahoo.com
 *         password: Zezo1223@#
 *         role: trainer
 */


/**
 * @swagger
 * components:
 *   schemas:
 *     SignIn:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Email of the user
 *         password:
 *           type: string
 *           format: password
 *           description: Password of the user
 *       example:
 *         email: yazeed@yahoo.com
 *         password: Zezo1223@#
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ClassSession:
 *       type: object
 *       required:
 *         - title
 *         - timeSlot
 *         - capacity
 *       properties:
 *         title:
 *           type: string
 *           description: Title of the class session
 *         timeSlot:
 *           type: string
 *           format: date-time
 *           description: Date and time of the class session
 *
 *         capacity:
 *           type: integer
 *           minimum: 1
 *           description: Maximum number of members allowed in the session
 *
 *       example:
 *         title: Yoga
 *         timeSlot: "2026-08-24T15:00:00Z"
 *         capacity: 20
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Booking:
 *       type: object
 *       required:
 *         - member
 *         - session
 *       properties:
 *         member:
 *           type: string
 *           description: ID of the member who made the booking
 *
 *         session:
 *           type: string
 *           description: ID of the class session being booked
 *
 *         status:
 *           type: string
 *           enum:
 *             - booked
 *             - cancelled
 *           description: Current status of the booking
 *
 *       example:
 *         member: 68a123456789abcdef123456
 *         session: 68b987654321fedcba654321
 *         status: booked
 */


/**
 * @swagger
 * components:
 *   schemas:
 *     BookClassSession:
 *       type: object
 *       required:
 *         - sessionId
 *       properties:
 *         sessionId :
 *           type: string
 *           description: ID of the class session to book
 *       example:
 *         sessionId : 68b987654321fedcba654321
 */








//tags
/**
 * @swagger
 * tags:
 *   name: User
 *   description: User authorization and management
 */


/**
 * @swagger
 * tags:
 *   name: ClassSession
 *   description: Class session management
 */


/**
 * @swagger
 * tags:
 *   name: Booking
 *   description: Class session booking management
 */

