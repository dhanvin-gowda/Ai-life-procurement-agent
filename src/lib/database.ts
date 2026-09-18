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

export interface CartPriceSnapshot {
  storeId: string;
  storeName: string;
  unitPrice: number;
  totalItemPrice: number;
  mrp?: number;
  deeplink?: string;
  isLivePrice: boolean;
  capturedAt: Date;
}

export interface CartProductSnapshot {
  id: string;
  name: string;
  category: string;
  unit: string;
  imageUrl: string;
  provider: string;
  rating: number;
  themeClass?: string;
  badgeText?: string;
  description?: string;
  features?: string[];
}

export interface CartItemDocument {
  productId: string;
  product: CartProductSnapshot;
  quantity: string;
  addedAt: Date;
  priceSnapshot?: CartPriceSnapshot;
}

export interface CartDocument {
  userEmail: string;
  items: CartItemDocument[];
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

const cartPriceSnapshotSchema = new mongoose.Schema<CartPriceSnapshot>(
  {
    storeId: { type: String, required: true },
    storeName: { type: String, required: true },
    unitPrice: { type: Number, required: true, min: 0 },
    totalItemPrice: { type: Number, required: true, min: 0 },
    mrp: { type: Number, min: 0 },
    deeplink: { type: String },
    isLivePrice: { type: Boolean, required: true },
    capturedAt: { type: Date, required: true },
  },
  { _id: false }
);

const cartItemSchema = new mongoose.Schema<CartItemDocument>(
  {
    productId: { type: String, required: true },
    product: {
      id: { type: String, required: true },
      name: { type: String, required: true },
      category: { type: String, required: true },
      unit: { type: String, required: true },
      imageUrl: { type: String, required: true },
      provider: { type: String, required: true },
      rating: { type: Number, required: true },
      themeClass: { type: String },
      badgeText: { type: String },
      description: { type: String },
      features: [{ type: String }],
    },
    quantity: { type: String, required: true },
    addedAt: { type: Date, required: true },
    priceSnapshot: { type: cartPriceSnapshotSchema },
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema<CartDocument>(
  {
    userEmail: { type: String, required: true, unique: true, index: true },
    items: { type: [cartItemSchema], default: [] },
  },
  { timestamps: true }
);

export const cart =
  mongoose.models.Cart || mongoose.model<CartDocument>("Cart", cartSchema);
