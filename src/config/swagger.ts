import swaggerJSDoc from "swagger-jsdoc";


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








