import mongoose from "mongoose";

function buildMongoURI(): string {
  // Prefer a complete URI supplied via environment
  if (process.env.MONGODB_URI) {
    return process.env.MONGODB_URI;
  }

  const password = process.env.MONGODB_PASSWORD;
  if (!password) {
    throw new Error(
      "Neither MONGODB_URI nor MONGODB_PASSWORD environment variable is set"
    );
  }

  // URI-encode the password so reserved characters don't break parsing
  return `mongodb+srv://shobhithamallege_db_user:${encodeURIComponent(password)}@ailifeprocurementagent.yinf1lc.mongodb.net/`;
}

// Cache an in-flight connection promise so concurrent cold-start requests
// don't race to call mongoose.connect() multiple times.
let connectionPromise: Promise<void> | null = null;

export async function connectDB(): Promise<void> {
  const state = mongoose.connection.readyState;
  // 1 = connected, 2 = connecting (promise already in flight)
  if (state === 1) return;

  if (state === 2 && connectionPromise) {
    return connectionPromise;
  }

  // Disconnected (0) or disconnecting (3) — start a fresh connection
  connectionPromise = mongoose
    .connect(buildMongoURI())
    .then(() => {
      console.log("MongoDB connected successfully");
    })
    .catch((err) => {
      // Reset so the next request retries
      connectionPromise = null;
      console.error("MongoDB connection error:", err);
      throw err;
    });

  return connectionPromise;
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
