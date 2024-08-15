import result from "./loadEnvs.js";
import express from "express";
import mainRouter from "./routes/index.js";
import cors from "cors";
import bodyparser from "body-parser";

const app = express();
//app.use(cors);
app.use(bodyparser.json());

app.use("/api/v1/", mainRouter);

app.listen(process.env.PORT, (err) => {
  if (err) console.log("cant listen error occured");
  else console.log("listening on port " + process.env.PORT);
});
