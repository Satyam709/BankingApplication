import mongoose from "mongoose";
import mongo from "mongoose";

async function connect(params) {
  try {
    await mongo.connect(
      `mongodb+srv://satyam:${process.env.DB_PASS}@banking-data.gq5y2.mongodb.net/bankingDb?retryWrites=true&w=majority&appName=banking-data`
    );
    console.log("database connected successfully");
  } catch (error) {
    throw new Error("failed to connect" + error);
  }
}

connect();
console.log("connecting");

const userScehema = new mongo.Schema({
  firstname: {
    type: String,
    required: true,
    trim: true,
    maxLength: 50,
  },
  lastname: {
    type: String,
    required: true,
    trim: true,
    maxLength: 50,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxLength: 50,
  },
  password: {
    type: String,
    minLength: 8,
  },
});

const User = new mongo.model("User", userScehema);

const bankSchema = new mongo.Schema({
  
  balance: {
    type: Number,
    required: true,
  },

  userId :{
    type : mongoose.Types.ObjectId,
    ref:"User",
    required:true
  }
});

const BankAccount = new mongo.model("Acoounts",bankSchema);

export { User ,BankAccount};
