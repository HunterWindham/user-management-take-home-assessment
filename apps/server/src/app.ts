import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { errorHandler } from "./middleware/errorHandler";
import userRoutes from "./routes/userRoutes";

export const createServer = () => {
    const app = express();

    app.use(cors());
    app.use(bodyParser.json());
    
    app.get("/", (req: Request, res: Response) => {
      console.log('triggering  "/" endpoint...');
    
      // define company name
      const companyName = "RentRedi";
      console.log("companyName = ", companyName);
    
      // send response
      res.send(`Welcome to the ${companyName} interview!`);
    });
    
    app.use("/users", userRoutes);
    
    // errorHandler has to be the last middleware to function correctly.
    app.use(errorHandler);

    return app;
};
