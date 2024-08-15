import env from "dotenv";

const result = env.config();
if (result.error) {
  throw new Error("cannot load env vars" + result.error);
} else {
  console.log("env vars parsed successfully:");
}

export default result;
