import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI ||
  `mongodb+srv://shobhithamallege_db_user:${process.env.MONGODB_PASSWORD}@ailifeprocurementagent.yinf1lc.mongodb.net/`;

// Cache the connection across hot-reloads in development
let isConnected = false;

export async function connectDB(): Promise<void> {
  if (isConnected) return;

  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI or MONGODB_PASSWORD environment variable is not set");
  }

  try {
    await mongoose.connect(MONGODB_URI);
    isConnected = true;
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    throw err;
  }
}

interface UserDocument {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema<UserDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const user =
  mongoose.models.logindetails ||
  mongoose.model<UserDocument>("logindetails", userSchema);

export { user };
