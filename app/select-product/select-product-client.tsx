"use client";

import React, { useEffect, useState } from "react";
import CarProduct from "./car-product";
import {
  compareCartItems,
  createProcurementOrder,
  CartCompareResponse,
  AppComparisonResult,
} from "@/app/dashboard/cart-compare";
import {
  Shield,
  LayoutGrid,
  History,
  FileCheck,
  Search,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  X,
  Sparkles,
  Apple,
  Carrot,
  Smartphone,
  Shirt,
  Watch,
  Layers,
  ArrowLeft,
  Star,
  Eye,
  Plus,
  Minus,
  ShoppingCart,
  Trash2,
  ShoppingBag,
} from "lucide-react";

export interface Product {
  id: string;
  name: string;
  category: string;
  themeClass: "card-yellow" | "card-green" | "card-blue" | "card-lavender" | "card-cyan" | "card-pink";
  badgeText: string;
  description: string;
  unit: "kg" | "piece" | "L";
  imageUrl: string;
  features: string[];
  provider: string;
  rating: number;
  popular?: boolean;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: string;
  addedAt: string;
  priceSnapshot?: {
    storeId: string;
    storeName: string;
    unitPrice: number;
    totalItemPrice: number;
    mrp?: number;
    deeplink?: string;
    isLivePrice: boolean;
    capturedAt: string;
  };
}

export interface ProcurementOrder {
  id: string;
  reference: string;
  items: CartItem[];
  date: string;
  status: string;
}

const PRODUCTS: Product[] = [
  // --- FRUITS ---
  {
    id: "prod-fruits-01",
    name: "Shimla Red Apples",
    category: "Fruits",
    themeClass: "card-yellow",
    badgeText: "Fruits",
    description: "Crisp, sweet, hand-picked fresh red apples directly from Shimla orchards.",
    unit: "kg",
    imageUrl: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop&q=80",
    features: ["100% Certified Organic", "Farm Direct Purity", "Rich in Fiber & Antioxidants"],
    provider: "Himalayan Orchards",
    rating: 4.9,
    popular: true,
  },
  {
    id: "prod-fruits-02",
    name: "Fresh Cavendish Bananas",
    category: "Fruits",
    themeClass: "card-yellow",
    badgeText: "Fruits",
    description: "Naturally ripened golden yellow bananas, packed with potassium and natural energy.",
    unit: "kg",
    imageUrl: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&auto=format&fit=crop&q=80",
    features: ["Zero Artificial Ripening", "Energy Boosting", "Eco-Friendly Packing"],
    provider: "Green Harvest Farms",
    rating: 4.8,
  },
  {
    id: "prod-fruits-03",
    name: "Alphonso Ripe Mangoes",
    category: "Fruits",
    themeClass: "card-pink",
    badgeText: "Fruits",
    description: "King of mangoes with rich aromatic sweetness and golden velvety pulp.",
    unit: "kg",
    imageUrl: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=600&auto=format&fit=crop&q=80",
    features: ["Ratnagiri Origin", "Naturally Sweet", "Premium Hand Selected"],
    provider: "Tropicana Harvest",
    rating: 5.0,
    popular: true,
  },
  {
    id: "prod-fruits-04",
    name: "Green Seedless Grapes",
    category: "Fruits",
    themeClass: "card-green",
    badgeText: "Fruits",
    description: "Juicy, crisp green seedless grapes harvested fresh from Maharashtra vineyards.",
    unit: "kg",
    imageUrl: "https://images.unsplash.com/photo-1596363505729-4190a9506133?w=600&auto=format&fit=crop&q=80",
    features: ["Pesticide Residue Free", "Sweet & Tangy", "Vine Harvested"],
    provider: "Nashik Valley Vineyards",
    rating: 4.7,
  },
  {
    id: "prod-fruits-05",
    name: "Nagpur Sweet Oranges",
    category: "Fruits",
    themeClass: "card-yellow",
    badgeText: "Fruits",
    description: "Citrus-rich juicy oranges brimming with natural Vitamin C and sweetness.",
    unit: "kg",
    imageUrl: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=600&auto=format&fit=crop&q=80",
    features: ["High Vitamin C", "Juicy & Refreshing", "Sun Ripened"],
    provider: "Nagpur Fruit Hub",
    rating: 4.8,
  },
  {
    id: "prod-fruits-06",
    name: "Fresh Tropical Pineapple",
    category: "Fruits",
    themeClass: "card-yellow",
    badgeText: "Fruits",
    description: "Sweet, tangy whole pineapple full of enzymes and vibrant tropical flavor.",
    unit: "kg",
    imageUrl: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=600&auto=format&fit=crop&q=80",
    features: ["Rich in Bromelain", "Farm Fresh Harvest", "Hand Inspected"],
    provider: "Kerala Agro Produce",
    rating: 4.6,
  },
  {
    id: "prod-fruits-07",
    name: "Ruby Red Pomegranate",
    category: "Fruits",
    themeClass: "card-pink",
    badgeText: "Fruits",
    description: "Plump ruby-red pomegranate arils loaded with antioxidants and iron.",
    unit: "kg",
    imageUrl: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&auto=format&fit=crop&q=80",
    features: ["Superfood Antioxidants", "Deep Red Arils", "Sweet Juiciness"],
    provider: "Deccan Fruit Exporters",
    rating: 4.9,
  },
  {
    id: "prod-fruits-08",
    name: "Juicy Red Watermelon",
    category: "Fruits",
    themeClass: "card-green",
    badgeText: "Fruits",
    description: "Hydrating, sweet red watermelon perfect for hot afternoons.",
    unit: "kg",
    imageUrl: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&auto=format&fit=crop&q=80",
    features: ["92% Hydration", "Sweet Red Pulp", "Farm Fresh"],
    provider: "Riverbed Organics",
    rating: 4.7,
  },
  {
    id: "prod-fruits-09",
    name: "Ripe Golden Papaya",
    category: "Fruits",
    themeClass: "card-yellow",
    badgeText: "Fruits",
    description: "Butter-soft ripe yellow papaya beneficial for digestion and daily health.",
    unit: "kg",
    imageUrl: "https://images.unsplash.com/photo-1517260739337-6799d239ce83?w=600&auto=format&fit=crop&q=80",
    features: ["Supports Digestion", "Rich in Papain", "Tree Ripened"],
    provider: "Sunland Orchards",
    rating: 4.6,
  },
  {
    id: "prod-fruits-10",
    name: "Fresh Green Kiwi",
    category: "Fruits",
    themeClass: "card-cyan",
    badgeText: "Fruits",
    description: "Imported fresh green kiwi packed with vitamin C and vital nutrients.",
    unit: "kg",
    imageUrl: "https://images.unsplash.com/photo-1585059819970-019688a245d8?w=600&auto=format&fit=crop&q=80",
    features: ["Imported Grade A", "High Fiber Content", "Tangy & Sweet"],
    provider: "Global Fresh Imports",
    rating: 4.8,
  },

  // --- VEGETABLES ---
  {
    id: "prod-veg-01",
    name: "Farm Fresh Red Tomatoes",
    category: "Vegetables",
    themeClass: "card-green",
    badgeText: "Vegetables",
    description: "Firm, juicy red tomatoes packed daily from sustainable local farms.",
    unit: "kg",
    imageUrl: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80",
    features: ["Zero Chemical Pesticides", "Harvested Daily", "Rich in Lycopene"],
    provider: "Pure Earth Organics",
    rating: 4.9,
    popular: true,
  },
  {
    id: "prod-veg-02",
    name: "Fresh Golden Potatoes",
    category: "Vegetables",
    themeClass: "card-green",
    badgeText: "Vegetables",
    description: "Clean, farm-harvested golden potatoes suitable for all cooking needs.",
    unit: "kg",
    imageUrl: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&auto=format&fit=crop&q=80",
    features: ["Unblemished Quality", "Long Shelf Life", "Earth Harvested"],
    provider: "BioGreen Markets",
    rating: 4.8,
  },
  {
    id: "prod-veg-03",
    name: "Fresh Red Onions",
    category: "Vegetables",
    themeClass: "card-green",
    badgeText: "Vegetables",
    description: "Flavorful Nashik red onions with tight skins and rich pungency.",
    unit: "kg",
    imageUrl: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&auto=format&fit=crop&q=80",
    features: ["Nashik Quality", "Pungent Flavor", "Graded Size"],
    provider: "AgriDirect Traders",
    rating: 4.7,
  },
  {
    id: "prod-veg-04",
    name: "Crisp Green Broccoli",
    category: "Vegetables",
    themeClass: "card-green",
    badgeText: "Vegetables",
    description: "Nutrient-dense green broccoli heads harvested fresh every morning.",
    unit: "kg",
    imageUrl: "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=600&auto=format&fit=crop&q=80",
    features: ["Hydroponic Growing", "Tightly Packed Heads", "Superfood Green"],
    provider: "Verdant Greens",
    rating: 4.9,
  },
  {
    id: "prod-veg-05",
    name: "Crunchy Orange Carrots",
    category: "Vegetables",
    themeClass: "card-green",
    badgeText: "Vegetables",
    description: "Sweet, crunchy orange carrots perfect for salads and cooking.",
    unit: "kg",
    imageUrl: "https://images.unsplash.com/photo-1598170845058-12ef4a45753b?w=600&auto=format&fit=crop&q=80",
    features: ["Rich in Beta-Carotene", "Sweet Taste", "Washed & Clean"],
    provider: "Fresh Root Organics",
    rating: 4.7,
  },
  {
    id: "prod-veg-06",
    name: "Green Bell Capsicum",
    category: "Vegetables",
    themeClass: "card-green",
    badgeText: "Vegetables",
    description: "Vibrant green bell peppers with a crisp crunch and mild sweet flavor.",
    unit: "kg",
    imageUrl: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=600&auto=format&fit=crop&q=80",
    features: ["Thick Skinned", "Crisp Texture", "Polyhouse Cultivated"],
    provider: "Greenhouse Fresh",
    rating: 4.8,
  },

  // --- ELECTRONICS ---
  {
    id: "prod-elec-01",
    name: "Wireless ANC Headphones",
    category: "ELectronics",
    themeClass: "card-blue",
    badgeText: "ELectronics",
    description: "Next-gen noise-cancelling wireless headphones with HD sound clarity.",
    unit: "piece",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
    features: ["Active Noise Cancellation", "40-Hour Battery Life", "Fast Bluetooth 5.3"],
    provider: "TechPulse Gear",
    rating: 4.9,
    popular: true,
  },
  {
    id: "prod-elec-02",
    name: "Ultra HD Smart Tablet",
    category: "ELectronics",
    themeClass: "card-cyan",
    badgeText: "ELectronics",
    description: "High-performance tablet display with stylus support and fast processor.",
    unit: "piece",
    imageUrl: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80",
    features: ["OLED Retina Display", "Pen Compatible", "128GB Storage"],
    provider: "Nexus Digital",
    rating: 4.8,
  },
  {
    id: "prod-elec-03",
    name: "Smart Fitness Watch Pro",
    category: "ELectronics",
    themeClass: "card-blue",
    badgeText: "ELectronics",
    description: "Advanced health tracking smartwatch with heart rate & SpO2 sensors.",
    unit: "piece",
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
    features: ["Waterproof 50m", "Heart Rate Monitor", "7-Day Battery"],
    provider: "PulseTech Style",
    rating: 4.8,
  },
  {
    id: "prod-elec-04",
    name: "Compact Bluetooth Speaker",
    category: "ELectronics",
    themeClass: "card-cyan",
    badgeText: "ELectronics",
    description: "Portable 360-degree bass speaker with rugged water-resistant body.",
    unit: "piece",
    imageUrl: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&auto=format&fit=crop&q=80",
    features: ["Deep Bass Audio", "IPX7 Waterproof", "15H Playtime"],
    provider: "SoundWave Tech",
    rating: 4.7,
  },

  // --- SHIRTS ---
  {
    id: "prod-shirts-01",
    name: "Egyptian Cotton Dress Shirt",
    category: "Shirts",
    themeClass: "card-lavender",
    badgeText: "Shirts",
    description: "100% Egyptian cotton breathable dress shirt with tailored modern fit.",
    unit: "piece",
    imageUrl: "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=600&auto=format&fit=crop&q=80",
    features: ["Wrinkle-Resistant", "Breathable Weave", "Tailored Fit"],
    provider: "Tailor & Stitch",
    rating: 4.8,
  },
  {
    id: "prod-shirts-02",
    name: "Casual Indigo Denim Shirt",
    category: "Shirts",
    themeClass: "card-yellow",
    badgeText: "Shirts",
    description: "Soft-washed premium indigo denim shirt for stylish everyday casual wear.",
    unit: "piece",
    imageUrl: "https://images.unsplash.com/photo-1589310243389-96a5483213a8?w=600&auto=format&fit=crop&q=80",
    features: ["Soft-Wash Denim", "Double Reinforced Stitch", "Versatile Style"],
    provider: "Urban Apparel",
    rating: 4.7,
  },
  {
    id: "prod-shirts-03",
    name: "Premium Navy Linen Polo",
    category: "Shirts",
    themeClass: "card-lavender",
    badgeText: "Shirts",
    description: "Cool linen-blend polo shirt designed for lightweight summer comfort.",
    unit: "piece",
    imageUrl: "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=600&auto=format&fit=crop&q=80",
    features: ["Linen Blend", "Ultra Breathable", "Ribbed Collar"],
    provider: "Classic Thread Co.",
    rating: 4.8,
  },

  // --- PANTS ---
  {
    id: "prod-pants-01",
    name: "Classic Stretch Chino Pants",
    category: "Pants",
    themeClass: "card-yellow",
    badgeText: "Pants",
    description: "4-way stretch flex chinos providing ultimate comfort from work to weekend.",
    unit: "piece",
    imageUrl: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&auto=format&fit=crop&q=80",
    features: ["4-Way Flex Stretch", "Fade-Resistant Wash", "Reinforced Pockets"],
    provider: "Denim Co. Studio",
    rating: 4.8,
  },
  {
    id: "prod-pants-02",
    name: "Slim Fit Blue Denim Jeans",
    category: "Pants",
    themeClass: "card-cyan",
    badgeText: "Pants",
    description: "Timeless indigo blue denim jeans crafted with durable stretch cotton.",
    unit: "piece",
    imageUrl: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop&q=80",
    features: ["Authentic Wash", "Durable Denim", "Modern Slim Cut"],
    provider: "Urban Outfitters",
    rating: 4.7,
  },
  {
    id: "prod-pants-03",
    name: "Athletic Performance Joggers",
    category: "Pants",
    themeClass: "card-cyan",
    badgeText: "Pants",
    description: "Moisture-wicking, flexible athletic joggers with zip security pockets.",
    unit: "piece",
    imageUrl: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=600&auto=format&fit=crop&q=80",
    features: ["Moisture Wicking", "Zip Pockets", "Ergonomic Fit"],
    provider: "Apex Sportswear",
    rating: 4.6,
  },

  // --- ACCESSORIES ---
  {
    id: "prod-acc-01",
    name: "Full-Grain Leather Wallet",
    category: "Accessories",
    themeClass: "card-pink",
    badgeText: "Accessories",
    description: "Hand-stitched full-grain leather wallet with integrated RFID protection.",
    unit: "piece",
    imageUrl: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&auto=format&fit=crop&q=80",
    features: ["RFID Blocking", "Full Grain Leather", "Gift Box Included"],
    provider: "Artisan Leathercraft",
    rating: 4.9,
    popular: true,
  },
  {
    id: "prod-acc-02",
    name: "Polarized Aviator Sunglasses",
    category: "Accessories",
    themeClass: "card-lavender",
    badgeText: "Accessories",
    description: "Classic metal frame aviator sunglasses featuring UV400 polarized lenses.",
    unit: "piece",
    imageUrl: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop&q=80",
    features: ["UV400 Protection", "Polarized Lenses", "Lightweight Frame"],
    provider: "OpticCraft Studio",
    rating: 4.8,
  },
  {
    id: "prod-acc-03",
    name: "Handcrafted Leather Belt",
    category: "Accessories",
    themeClass: "card-pink",
    badgeText: "Accessories",
    description: "Genuine leather belt with brushed stainless steel buckle for long-lasting durability.",
    unit: "piece",
    imageUrl: "https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=600&auto=format&fit=crop&q=80",
    features: ["100% Real Leather", "Steel Buckle", "Classic Dress Style"],
    provider: "Artisan Leathercraft",
    rating: 4.7,
  },
];

export default function SelectProductClient() {
  const [activeTab, setActiveTab] = useState<string>("select-product");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Track active cards that reveal quantity bar after click
  const [activeCardIds, setActiveCardIds] = useState<string[]>([]);

  // Quantity Map: productId -> string value (default "1")
  const [quantities, setQuantities] = useState<Record<string, string>>({});

  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Procurement Logs State
  const [procurementLogs, setProcurementLogs] = useState<ProcurementOrder[]>([
    {
      id: "proc-sample-1",
      reference: "PROC-849201",
      items: [
        {
          id: "prod-fruits-01",
          product: PRODUCTS[0],
          quantity: "5",
          addedAt: "10:30 AM",
        },
        {
          id: "prod-elec-01",
          product: PRODUCTS[10],
          quantity: "2",
          addedAt: "10:32 AM",
        },
      ],
      date: "Sep 17, 2026",
      status: "Approved",
    },
  ]);

  // Toast Notification Message State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/cart")
      .then(async (response) => {
        if (!response.ok) return null;
        return response.json();
      })
      .then((data) => {
        if (!cancelled && data?.items) {
          setCartItems(data.items.map((item: CartItem) => ({ ...item, id: item.product.id })));
        }
      })
      .catch((error) => console.error("Cart load error:", error));

    return () => {
      cancelled = true;
    };
  }, []);

  // Application modal local state
  const [isProcuring, setIsProcuring] = useState(false);
  const [procurementRef, setProcurementRef] = useState("");

  const categories = [
    "All",
    "Fruits",
    "Vegetables",
    "ELectronics",
    "Shirts",
    "Pants",
    "Accessories",
  ];

  const categoryMeta: Record<string, { label: string; theme: "card-yellow" | "card-green" | "card-blue" | "card-lavender" | "card-cyan" | "card-pink"; desc: string }> = {
    Fruits: { label: "Fruits", theme: "card-yellow", desc: "Fresh organic apples, bananas, mangoes, grapes & exotic fruits" },
    Vegetables: { label: "Vegetables", theme: "card-green", desc: "Crisp farm tomatoes, potatoes, broccoli, spinach & fresh greens" },
    ELectronics: { label: "ELectronics", theme: "card-blue", desc: "Headphones, smart tablets, smartwatches & audio gear" },
    Shirts: { label: "Shirts", theme: "card-lavender", desc: "Egyptian cotton dress shirts, denim & linen polos" },
    Pants: { label: "Pants", theme: "card-yellow", desc: "Stretch chinos, denim jeans & performance joggers" },
    Accessories: { label: "Accessories", theme: "card-pink", desc: "Leather wallets, sunglasses, belts & smart accessories" },
  };

  const renderCategoryIcon = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes("fruit")) {
      return <Apple style={{ width: "26px", height: "26px", color: "#d97706" }} />;
    }
    if (cat.includes("veg")) {
      return <Carrot style={{ width: "26px", height: "26px", color: "#16a34a" }} />;
    }
    if (cat.includes("elec")) {
      return <Smartphone style={{ width: "26px", height: "26px", color: "#2563eb" }} />;
    }
    if (cat.includes("shirt")) {
      return <Shirt style={{ width: "26px", height: "26px", color: "#9333ea" }} />;
    }
    if (cat.includes("pant")) {
      return <Layers style={{ width: "26px", height: "26px", color: "#0891b2" }} />;
    }
    if (cat.includes("access")) {
      return <Watch style={{ width: "26px", height: "26px", color: "#db2777" }} />;
    }
    return <Sparkles style={{ width: "26px", height: "26px", color: "#4e6df2" }} />;
  };

  // Category Quantity Constraint Helper: Returns true if quantity must be an integer (no decimals allowed)
  const isIntegerOnlyCategory = (category: string, unit?: string) => {
    if (unit === "piece") return true;
    const cat = category.toLowerCase();
    return (
      cat.includes("electronics") ||
      cat.includes("shirt") ||
      cat.includes("pant") ||
      cat.includes("accessor")
    );
  };

  // Toast Notification Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3200);
  };

  // Quantity Helper Logic
  const getQuantity = (productId: string) => {
    return quantities[productId] !== undefined ? quantities[productId] : "1";
  };

  const handleInputChange = (productId: string, rawValue: string) => {
    const product = PRODUCTS.find((p) => p.id === productId);
    const isInteger = product ? isIntegerOnlyCategory(product.category, product.unit) : false;

    let sanitizedValue = rawValue;
    if (isInteger) {
      // Disallow decimals: strip everything except digits 0-9
      sanitizedValue = rawValue.replace(/[^0-9]/g, "");
    } else {
      // Allow digits and at most one decimal point
      sanitizedValue = rawValue.replace(/[^0-9.]/g, "").replace(/(\..*?)\..*/g, "$1");
    }

    setQuantities((prev) => ({
      ...prev,
      [productId]: sanitizedValue,
    }));
  };

  const handleIncrement = (productId: string) => {
    const product = PRODUCTS.find((p) => p.id === productId);
    const isInteger = product ? isIntegerOnlyCategory(product.category, product.unit) : false;
    const currentStr = getQuantity(productId);

    if (isInteger) {
      const currentNum = parseInt(currentStr, 10) || 0;
      const nextNum = Math.max(1, currentNum + 1);
      setQuantities((prev) => ({
        ...prev,
        [productId]: String(nextNum),
      }));
    } else {
      const currentNum = parseFloat(currentStr) || 0;
      const nextNum = Math.round((currentNum + 1) * 100) / 100;
      setQuantities((prev) => ({
        ...prev,
        [productId]: String(nextNum),
      }));
    }
  };

  const handleDecrement = (productId: string) => {
    const product = PRODUCTS.find((p) => p.id === productId);
    const isInteger = product ? isIntegerOnlyCategory(product.category, product.unit) : false;
    const currentStr = getQuantity(productId);

    if (isInteger) {
      const currentNum = parseInt(currentStr, 10) || 1;
      const nextNum = Math.max(1, currentNum - 1);
      setQuantities((prev) => ({
        ...prev,
        [productId]: String(nextNum),
      }));
    } else {
      const currentNum = parseFloat(currentStr) || 1;
      const nextNum = Math.max(0.1, Math.round((currentNum - 1) * 100) / 100);
      setQuantities((prev) => ({
        ...prev,
        [productId]: String(nextNum),
      }));
    }
  };

  // --- CART MANAGEMENT HANDLERS ---
  const handleAddToCart = async (product: Product, customQty?: string) => {
    const qtyStr = customQty || getQuantity(product.id) || "1";
    const isInt = isIntegerOnlyCategory(product.category, product.unit);

    let sanitizedQty = qtyStr;
    if (isInt) {
      const parsed = parseInt(qtyStr, 10);
      sanitizedQty = String(isNaN(parsed) || parsed < 1 ? 1 : parsed);
    } else {
      const parsed = parseFloat(qtyStr);
      sanitizedQty = String(isNaN(parsed) || parsed <= 0 ? 1 : Math.round(parsed * 100) / 100);
    }

    const nextItem = {
      id: product.id,
      product,
      quantity: sanitizedQty,
      addedAt: new Date().toISOString(),
    };

    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        const curNum = isInt
          ? parseInt(updated[existingIndex].quantity, 10) || 0
          : parseFloat(updated[existingIndex].quantity) || 0;
        const addNum = isInt
          ? parseInt(sanitizedQty, 10) || 1
          : parseFloat(sanitizedQty) || 1;

        const newTotal = curNum + addNum;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: String(isInt ? Math.max(1, newTotal) : Math.round(newTotal * 100) / 100),
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            id: product.id,
            product,
            quantity: sanitizedQty,
            addedAt: nextItem.addedAt,
          },
        ];
      }
    });

    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product, quantity: sanitizedQty }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.error || `Cart save failed (${response.status})`
        );
      }
      const data = await response.json();
      setCartItems(data.items.map((item: CartItem) => ({ ...item, id: item.product.id })));
    } catch (error) {
      console.error("Cart save error:", error);
      showToast(
        error instanceof Error ? error.message : "Unable to save item. Please try again."
      );
    }

    showToast(`Added ${sanitizedQty} ${product.unit} of ${product.name} to Cart`);
  };

  const handleUpdateCartQuantity = async (productId: string, newQtyStr: string) => {
    const product = PRODUCTS.find((p) => p.id === productId);
    if (!product) return;
    const isInt = isIntegerOnlyCategory(product.category, product.unit);

    let sanitized = newQtyStr;
    if (isInt) {
      sanitized = newQtyStr.replace(/[^0-9]/g, "");
    } else {
      sanitized = newQtyStr.replace(/[^0-9.]/g, "").replace(/(\..*?)\..*/g, "$1");
    }

    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: sanitized, priceSnapshot: undefined }
          : item
      )
    );

    if (Number(sanitized) > 0) {
      try {
        const response = await fetch("/api/cart", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId, quantity: sanitized }),
        });
        if (!response.ok) throw new Error("Cart update failed");
      } catch (error) {
        console.error("Cart update error:", error);
      }
    }
  };

  const handleRemoveFromCart = async (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
    try {
      await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
    } catch (error) {
      console.error("Cart removal error:", error);
    }
    showToast("Item removed from cart");
  };

  const handleClearCart = async () => {
    setCartItems([]);
    try {
      await fetch("/api/cart", { method: "DELETE" });
    } catch (error) {
      console.error("Cart clear error:", error);
    }
    showToast("Cart cleared");
  };

  const handleCheckoutCart = async () => {
    if (cartItems.length === 0) return;
    setIsProcuring(true);

    try {
      const newOrder = await createProcurementOrder(cartItems);
      setProcurementLogs((prev) => [newOrder as any, ...prev]);
      await handleClearCart();
      setProcurementRef(newOrder.reference);
      setIsProcuring(false);
      setActiveTab("procurements");
      showToast(`Procurement Order ${newOrder.reference} successfully submitted!`);
    } catch (err) {
      console.error(err);
      setIsProcuring(false);
    }
  };

  // --- 11-APP QUICK COMMERCE COMPARE HANDLER ---
  const [isComparing, setIsComparing] = useState(false);
  const [comparisonReport, setComparisonReport] = useState<CartCompareResponse | null>(null);

  const handleCompareCart = async () => {
    if (cartItems.length === 0) return;
    setIsComparing(true);
    try {
      const data = await compareCartItems(cartItems);
      setComparisonReport(data);
      const lowestPriceResult = data.results.find(
        (result) => result.appName === data.lowestPriceApp
      );
      if (lowestPriceResult) {
        await Promise.all(
          lowestPriceResult.itemBreakdown.map((item) =>
            fetch("/api/cart", {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                productId: item.productId,
                priceSnapshot: {
                  storeId: lowestPriceResult.appId,
                  storeName: lowestPriceResult.appName,
                  unitPrice: item.unitPrice,
                  totalItemPrice: item.totalItemPrice,
                  mrp: item.mrp,
                  deeplink: item.deeplink,
                  isLivePrice: item.isLivePrice === true,
                },
              }),
            })
          )
        );
      }
      showToast("Real-time prices compared across all 11 Quick Commerce apps!");
    } catch (err) {
      console.error("Cart comparison error:", err);
      showToast("Failed to compare prices. Please try again.");
    } finally {
      setIsComparing(false);
    }
  };

  const handleOrderViaApp = async (app: AppComparisonResult) => {
    if (cartItems.length === 0) return;
    setIsProcuring(true);

    try {
      const newOrder = await createProcurementOrder(cartItems, app.appName);
      setProcurementLogs((prev) => [newOrder as any, ...prev]);
      await handleClearCart();
      setComparisonReport(null);
      setIsProcuring(false);
      setActiveTab("procurements");
      showToast(`Successfully ordered via ${app.appName}! Order Code: ${newOrder.reference}`);
    } catch (err) {
      console.error(err);
      setIsProcuring(false);
    }
  };

  // Client-side filtering logic
  const filteredProducts = PRODUCTS.filter((product) => {
    const matchesCategory =
      selectedCategory === "All" ||
      product.category.toLowerCase() === selectedCategory.toLowerCase() ||
      product.badgeText.toLowerCase() === selectedCategory.toLowerCase();

    const matchesSearch =
      searchQuery === "" ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.provider.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const handleCategoryCardClick = (categoryName: string) => {
    setSelectedCategory(categoryName);
  };

  const handleOpenProductModal = (product: Product) => {
    setSelectedProduct(product);
  };

  return (
    <div className="app-shell">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div>
          <div className="brand">
            <Shield className="brand-mark" />
            <span>AI Life Agent</span>
          </div>

          <nav className="navigation">
            <button
              className={`nav-item ${activeTab === "select-product" ? "active" : ""}`}
              onClick={() => setActiveTab("select-product")}
            >
              <LayoutGrid />
              <span>Select Product</span>
            </button>

            <button
              className={`nav-item ${activeTab === "cart" ? "active" : ""}`}
              onClick={() => setActiveTab("cart")}
            >
              <ShoppingCart />
              <span>Cart</span>
              {cartItems.length > 0 && (
                <span className="nav-badge">{cartItems.length}</span>
              )}
            </button>

            <button
              className={`nav-item ${activeTab === "procurements" ? "active" : ""}`}
              onClick={() => setActiveTab("procurements")}
            >
              <FileCheck />
              <span>Procurement Log</span>
              {procurementLogs.length > 0 && (
                <span className="nav-badge" style={{ background: "#10b981" }}>
                  {procurementLogs.length}
                </span>
              )}
            </button>

            <button
              className={`nav-item ${activeTab === "history" ? "active" : ""}`}
              onClick={() => setActiveTab("history")}
            >
              <History />
              <span>Quotes History</span>
            </button>
          </nav>
        </div>

        <button className="profile-button" title="Account Details">
          <div className="avatar">U</div>
          <span className="profile-name">User Account</span>
          <ChevronRight />
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <header className="page-header">
          <p className="eyebrow">SMART PROCUREMENT AGENT</p>
          <h1>
            {activeTab === "select-product" &&
              (selectedCategory === "All"
                ? "Select Category or Product"
                : `${selectedCategory} Catalog`)}
            {activeTab === "cart" && "Procurement Cart"}
            {activeTab === "procurements" && "Procurement Order Logs"}
            {activeTab === "history" && "Quotes & Audit History"}
          </h1>
          <p className="subtitle">
            {activeTab === "select-product" &&
              (selectedCategory === "All"
                ? "Click on any category card below (Fruits, Vegetables, Electronics, Shirts, Pants, Accessories) to view detailed items and procurement options."
                : `Showing list of ${selectedCategory.toLowerCase()} available for procurement.`)}
            {activeTab === "cart" &&
              "Review selected products, adjust quantities, and confirm your procurement order."}
            {activeTab === "procurements" &&
              "Track approved and submitted procurement orders with reference codes."}
            {activeTab === "history" &&
              "Historical archive of vendor price quotes and agent evaluations."}
          </p>
        </header>

        {/* TAB 1: SELECT PRODUCT CATALOG VIEW */}
        {activeTab === "select-product" && (
          <>
            {/* Filter and Search Bar */}
            <div style={{ marginBottom: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
                <div
                  style={{
                    position: "relative",
                    flex: "1 1 240px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Search
                    style={{
                      position: "absolute",
                      left: "14px",
                      width: "16px",
                      height: "16px",
                      color: "#94a3b8",
                    }}
                  />
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Search products (e.g., Apple, Tomato, Headphones)..."
                    style={{ paddingLeft: "40px" }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {selectedCategory !== "All" && (
                  <button
                    onClick={() => setSelectedCategory("All")}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "10px 16px",
                      borderRadius: "11px",
                      background: "#f1f5f9",
                      border: "1px solid #cbd5e1",
                      color: "#334155",
                      fontSize: "13px",
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <ArrowLeft style={{ width: "16px", height: "16px" }} />
                    <span>All Categories</span>
                  </button>
                )}
              </div>

              {/* Category Pill Tabs */}
              <div
                style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "4px" }}
                className="no-scrollbar"
              >
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      padding: "7px 18px",
                      borderRadius: "999px",
                      fontSize: "13px",
                      fontWeight: 600,
                      border: "none",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      transition: "all 150ms ease",
                      background: selectedCategory === cat ? "#4e6df2" : "#f1f5f9",
                      color: selectedCategory === cat ? "#ffffff" : "#475569",
                      boxShadow: selectedCategory === cat ? "0 4px 12px rgba(78, 109, 242, 0.25)" : "none",
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* TOP LEVEL CATEGORY OVERVIEW CARDS */}
            {selectedCategory === "All" && searchQuery === "" && (
              <div style={{ marginBottom: "36px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                  <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#1e293b", letterSpacing: "-0.2px" }}>
                    BROWSE CATEGORIES
                  </h2>
                  <span style={{ fontSize: "12px", color: "#64748b", fontWeight: 500 }}>
                    Click a card to reveal items
                  </span>
                </div>

                <div className="category-grid">
                  {Object.entries(categoryMeta).map(([catKey, meta]) => {
                    const count = PRODUCTS.filter((p) => p.category.toLowerCase() === catKey.toLowerCase()).length;
                    return (
                      <div
                        key={catKey}
                        className={`category-card ${meta.theme}`}
                        onClick={() => handleCategoryCardClick(catKey)}
                        style={{ position: "relative" }}
                      >
                        <div className="art-wrap">
                          <div
                            className="product-art"
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                              textAlign: "center",
                              padding: "8px",
                            }}
                          >
                            <div
                              style={{
                                width: "52px",
                                height: "52px",
                                borderRadius: "16px",
                                background: "#ffffff",
                                display: "grid",
                                placeItems: "center",
                                marginBottom: "10px",
                                boxShadow: "0 6px 16px rgba(0,0,0,0.06)",
                              }}
                            >
                              {renderCategoryIcon(catKey)}
                            </div>

                            <span style={{ fontSize: "16px", fontWeight: 800, color: "#0f172a" }}>
                              {meta.label}
                            </span>
                            <span style={{ fontSize: "11px", color: "#64748b", marginTop: "4px" }}>
                              {count} Products Available
                            </span>
                          </div>
                        </div>

                        <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                          <div className="category-label" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <span>Explore {meta.label}</span>
                            <ChevronRight style={{ width: "14px", height: "14px" }} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SECTION HEADER FOR PRODUCT LIST */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px", marginTop: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <h2 style={{ fontSize: "17px", fontWeight: 700, color: "#0f172a" }}>
                  {selectedCategory === "All" ? "All Product Items" : `${selectedCategory} Items`}
                </h2>
                <span
                  style={{
                    background: "#e0f2fe",
                    color: "#0369a1",
                    fontSize: "11px",
                    fontWeight: 700,
                    padding: "3px 10px",
                    borderRadius: "999px",
                  }}
                >
                  {filteredProducts.length} Items Found
                </span>
              </div>
            </div>

            {/* PRODUCT ITEM CARDS GRID */}
            {filteredProducts.length > 0 ? (
              <div className="product-items-grid">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="product-item-card"
                    onClick={() => handleOpenProductModal(product)}
                  >
                    <div className="item-image-wrapper">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="item-image"
                        loading="lazy"
                      />
                    </div>

                    <div className="item-content">
                      <div>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
                          <span style={{ fontSize: "10px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                            {product.category}
                          </span>
                          <div style={{ display: "flex", alignItems: "center", gap: "3px", fontSize: "11px", fontWeight: 700, color: "#d97706" }}>
                            <Star style={{ width: "12px", height: "12px", fill: "#d97706" }} />
                            <span>{product.rating}</span>
                          </div>
                        </div>

                        <h3 className="item-title">{product.name}</h3>
                        <p className="item-description">{product.description}</p>
                      </div>

                      {/* CARD FOOTER AREA: SELECT PRODUCT BUTTON TO POP UP MODAL */}
                      <div style={{ marginTop: "12px", display: "flex", gap: "8px" }}>
                        <button
                          style={{
                            background: "#4e6df2",
                            color: "#ffffff",
                            border: "none",
                            borderRadius: "10px",
                            padding: "10px 14px",
                            fontSize: "12px",
                            fontWeight: 600,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            width: "100%",
                            justifyContent: "center",
                            transition: "all 0.15s ease",
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenProductModal(product);
                          }}
                        >
                          <Plus style={{ width: "15px", height: "15px" }} />
                          <span>Select Product</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "48px 20px", background: "#f8fafc", borderRadius: "16px", border: "1px dashed #cbd5e1" }}>
                <p style={{ fontSize: "15px", fontWeight: 600, color: "#475569" }}>No products found matching "{searchQuery}"</p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All");
                  }}
                  style={{
                    marginTop: "12px",
                    padding: "8px 16px",
                    background: "#4e6df2",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Reset Search & Category
                </button>
              </div>
            )}
          </>
        )}

        {/* TAB 2: CART VIEW */}
        {activeTab === "cart" && (
          <CarProduct
            cartItems={cartItems}
            isIntegerOnlyCategory={isIntegerOnlyCategory}
            onUpdateQuantity={handleUpdateCartQuantity}
            onRemoveItem={handleRemoveFromCart}
            onClearCart={handleClearCart}
            onCheckout={handleCheckoutCart}
            onCompare={handleCompareCart}
            isProcuring={isProcuring}
            isComparing={isComparing}
            onBrowseCatalog={() => setActiveTab("select-product")}
          />
        )}

        {/* TAB 3: PROCUREMENT LOG VIEW */}
        {activeTab === "procurements" && (
          <div>
            {procurementLogs.length === 0 ? (
              <div className="empty-cart-card">
                <FileCheck style={{ width: "36px", height: "36px", color: "#94a3b8", margin: "0 auto 12px" }} />
                <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#0f172a" }}>No Procurement Orders Yet</h3>
                <p style={{ fontSize: "13px", color: "#64748b", marginTop: "4px" }}>
                  Submitted procurement orders will appear here.
                </p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {procurementLogs.map((log) => (
                  <div key={log.id} style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "20px", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", borderBottom: "1px solid #f1f5f9", paddingBottom: "12px" }}>
                      <div>
                        <span style={{ fontSize: "11px", fontWeight: 700, color: "#4e6df2" }}>PROCUREMENT REFERENCE</span>
                        <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#0f172a" }}>{log.reference}</h3>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <span style={{ background: "#dcfce7", color: "#16a34a", fontSize: "11px", fontWeight: 700, padding: "4px 10px", borderRadius: "999px" }}>
                          {log.status}
                        </span>
                        <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>{log.date}</div>
                      </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {log.items.map((item, idx) => (
                        <div key={idx} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "13px", color: "#1e293b" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#4e6df2" }} />
                            <span>{item.product.name}</span>
                            <span style={{ fontSize: "11px", color: "#64748b" }}>({item.product.provider})</span>
                          </div>
                          <strong>{item.quantity} {item.product.unit}</strong>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: QUOTES HISTORY VIEW */}
        {activeTab === "history" && (
          <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "32px", textAlign: "center" }}>
            <History style={{ width: "40px", height: "40px", color: "#94a3b8", margin: "0 auto 12px" }} />
            <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#0f172a" }}>Quotes History & Supplier Archive</h3>
            <p style={{ fontSize: "13px", color: "#64748b", marginTop: "4px" }}>
              Vendor quotations, bidding logs, and historical pricing trends are stored here.
            </p>
          </div>
        )}

        {/* POPPED-UP DETAIL CARD MODAL */}
        {selectedProduct && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 50,
              background: "rgba(15, 23, 42, 0.55)",
              backdropFilter: "blur(6px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px",
            }}
          >
            <div
              className="login-card"
              style={{
                maxWidth: "520px",
                width: "100%",
                padding: "28px",
                maxHeight: "90vh",
                overflowY: "auto",
              }}
            >
              {/* Modal Header */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "16px",
                }}
              >
                <div>
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      color: "#0ea5c9",
                      letterSpacing: "1.2px",
                    }}
                  >
                    {selectedProduct.category}
                  </span>
                  <h2 style={{ fontSize: "21px", fontWeight: 800, color: "#0f172a", marginTop: "2px" }}>
                    {selectedProduct.name}
                  </h2>
                  <p style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>
                    Sourced from {selectedProduct.provider} • Rating ⭐ {selectedProduct.rating}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedProduct(null)}
                  style={{
                    background: "#f1f5f9",
                    border: "none",
                    borderRadius: "50%",
                    width: "32px",
                    height: "32px",
                    display: "grid",
                    placeItems: "center",
                    cursor: "pointer",
                    color: "#64748b",
                  }}
                >
                  <X style={{ width: "18px", height: "18px" }} />
                </button>
              </div>

              {/* Product Large Preview Image */}
              <div
                style={{
                  width: "100%",
                  height: "200px",
                  borderRadius: "16px",
                  overflow: "hidden",
                  marginBottom: "20px",
                  position: "relative",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
                }}
              >
                <img
                  src={selectedProduct.imageUrl}
                  alt={selectedProduct.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>

              <p style={{ fontSize: "13.5px", color: "#334155", lineHeight: 1.5, marginBottom: "20px" }}>
                {selectedProduct.description}
              </p>

              <div style={{ background: "#f8fafc", borderRadius: "14px", padding: "16px", marginBottom: "20px" }}>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "#475569", marginBottom: "10px", letterSpacing: "0.5px" }}>
                  PRODUCT HIGHLIGHTS & QUALITY GUARANTEE
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {selectedProduct.features.map((feat, idx) => (
                    <div key={idx} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#1e293b" }}>
                      <CheckCircle2 style={{ width: "16px", height: "16px", color: "#10b981", flexShrink: 0 }} />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* STANDALONE 4-BOX BUTTON LAYOUT IN POP-UP MODAL */}
              <div style={{ marginBottom: "24px", textAlign: "center" }}>
                <label style={{ fontSize: "11px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", display: "block", marginBottom: "8px", letterSpacing: "0.5px" }}>
                  SELECT QUANTITY ({selectedProduct.unit.toUpperCase()})
                  {isIntegerOnlyCategory(selectedProduct.category, selectedProduct.unit) && (
                    <span style={{ marginLeft: "8px", color: "#4e6df2", textTransform: "none", fontWeight: 600 }}>
                      (Whole units only)
                    </span>
                  )}
                </label>

                <div className="qty-row-layout">
                  {/* Box 1: [-] Button */}
                  <button
                    className="qty-box qty-box-btn qty-box-minus"
                    onClick={() => handleDecrement(selectedProduct.id)}
                    title="Decrease Quantity"
                  >
                    <Minus style={{ width: "18px", height: "18px" }} />
                  </button>

                  {/* Box 2: [ 1 ] Quantity Div */}
                  <div className="qty-box qty-box-input">
                    <input
                      type="text"
                      inputMode={isIntegerOnlyCategory(selectedProduct.category, selectedProduct.unit) ? "numeric" : "decimal"}
                      className="qty-input"
                      value={getQuantity(selectedProduct.id)}
                      onChange={(e) => handleInputChange(selectedProduct.id, e.target.value)}
                      onBlur={() => {
                        const val = getQuantity(selectedProduct.id);
                        const isInt = isIntegerOnlyCategory(selectedProduct.category, selectedProduct.unit);
                        if (isInt) {
                          const parsed = parseInt(val, 10);
                          handleInputChange(selectedProduct.id, String(isNaN(parsed) || parsed < 1 ? 1 : parsed));
                        } else {
                          const parsed = parseFloat(val);
                          handleInputChange(selectedProduct.id, String(isNaN(parsed) || parsed <= 0 ? 1 : parsed));
                        }
                      }}
                      placeholder="1"
                    />
                  </div>

                  {/* Box 3: [ piece/kg ] Unit Div */}
                  <div className="qty-box qty-box-unit">
                    <span>{selectedProduct.unit}</span>
                  </div>

                  {/* Box 4: [+] Button */}
                  <button
                    className="qty-box qty-box-btn qty-box-plus"
                    onClick={() => handleIncrement(selectedProduct.id)}
                    title="Increase Quantity"
                  >
                    <Plus style={{ width: "18px", height: "18px" }} />
                  </button>
                </div>
              </div>

              {/* Action Button: Add to Cart */}
              <div style={{ paddingTop: "16px", borderTop: "1px solid #e2e8f0" }}>
                <button
                  className="btn-signin"
                  style={{ marginTop: 0, width: "100%", padding: "14px 24px" }}
                  onClick={() => {
                    handleAddToCart(selectedProduct, getQuantity(selectedProduct.id));
                    setSelectedProduct(null);
                  }}
                >
                  <ShoppingCart style={{ width: "18px", height: "18px" }} />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 11-APP PRICE COMPARISON REPORT MODAL */}
        {comparisonReport && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 60,
              background: "rgba(15, 23, 42, 0.65)",
              backdropFilter: "blur(8px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px",
            }}
          >
            <div
              className="login-card"
              style={{
                maxWidth: "880px",
                width: "100%",
                padding: "28px",
                maxHeight: "90vh",
                overflowY: "auto",
              }}
            >
              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "#4e6df2", background: "#eef2ff", padding: "3px 10px", borderRadius: "999px" }}>
                      QUICKCOMMERCE API ACTIVE
                    </span>
                    <span style={{ fontSize: "11px", color: "#64748b" }}>
                      Key: {comparisonReport.apiKeyMasked}
                    </span>
                  </div>
                  <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#0f172a", marginTop: "4px" }}>
                    11-App Price & Speed Comparison
                  </h2>
                  <p style={{ fontSize: "13px", color: "#64748b", marginTop: "2px" }}>
                    Evaluated real-time pricing, fees, delivery speed, and reviews across all major quick-commerce apps.
                  </p>
                </div>

                <button
                  onClick={() => setComparisonReport(null)}
                  style={{
                    background: "#f1f5f9",
                    border: "none",
                    borderRadius: "50%",
                    width: "34px",
                    height: "34px",
                    display: "grid",
                    placeItems: "center",
                    cursor: "pointer",
                    color: "#64748b",
                  }}
                >
                  <X style={{ width: "18px", height: "18px" }} />
                </button>
              </div>

              {/* Best Value & Fastest Banner Cards */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
                <div style={{ background: "#ecfdf5", border: "1px solid #a7f3d0", borderRadius: "14px", padding: "16px", display: "flex", alignItems: "center", gap: "14px" }}>
                  <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "#10b981", color: "#fff", display: "grid", placeItems: "center", fontWeight: 800 }}>
                    ₹
                  </div>
                  <div>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "#047857", textTransform: "uppercase" }}>BEST VALUE / LOWEST PRICE</span>
                    <div style={{ fontSize: "16px", fontWeight: 800, color: "#064e3b" }}>{comparisonReport.lowestPriceApp}</div>
                    <span style={{ fontSize: "11px", color: "#059669" }}>Cheapest grand total for all selected items</span>
                  </div>
                </div>

                <div style={{ background: "#f3e8ff", border: "1px solid #d8b4fe", borderRadius: "14px", padding: "16px", display: "flex", alignItems: "center", gap: "14px" }}>
                  <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "#8b5cf6", color: "#fff", display: "grid", placeItems: "center", fontWeight: 800 }}>
                    ⚡
                  </div>
                  <div>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "#6d28d9", textTransform: "uppercase" }}>FASTEST DELIVERY</span>
                    <div style={{ fontSize: "16px", fontWeight: 800, color: "#4c1d95" }}>{comparisonReport.fastestApp} (8 Mins)</div>
                    <span style={{ fontSize: "11px", color: "#7c3aed" }}>Express door drop speed</span>
                  </div>
                </div>
              </div>

              {/* 11 Apps Comparison List */}
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#334155", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  ALL 11 APP COMPARISONS ({comparisonReport.results.length} APPS EVALUATED)
                </h3>

                {comparisonReport.results.map((app) => (
                  <div
                    key={app.appId}
                    style={{
                      background: "#ffffff",
                      border: app.isBestValue ? "2px solid #10b981" : "1px solid #e2e8f0",
                      borderRadius: "16px",
                      padding: "18px 20px",
                      boxShadow: "0 4px 14px rgba(15, 23, 42, 0.04)",
                      position: "relative",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
                      {/* App Title & Badges */}
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: "220px" }}>
                        <div
                          style={{
                            width: "44px",
                            height: "44px",
                            borderRadius: "12px",
                            background: app.themeColor,
                            color: "#ffffff",
                            fontSize: "18px",
                            fontWeight: 800,
                            display: "grid",
                            placeItems: "center",
                            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                          }}
                        >
                          {app.appLogo}
                        </div>

                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <h4 style={{ fontSize: "16px", fontWeight: 800, color: "#0f172a" }}>{app.appName}</h4>
                            {app.isBestValue && (
                              <span style={{ fontSize: "10px", fontWeight: 800, color: "#047857", background: "#d1fae5", padding: "2px 8px", borderRadius: "999px" }}>
                                BEST PRICE
                              </span>
                            )}
                            {app.isFastest && (
                              <span style={{ fontSize: "10px", fontWeight: 800, color: "#6d28d9", background: "#f3e8ff", padding: "2px 8px", borderRadius: "999px" }}>
                                FASTEST
                              </span>
                            )}
                          </div>
                          <span style={{ fontSize: "12px", color: "#64748b" }}>
                            Delivery Speed: <strong style={{ color: "#0f172a" }}>{app.deliveryTime}</strong> • Rating ⭐ {app.rating}
                          </span>
                        </div>
                      </div>

                      {/* Pricing Summary */}
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: "20px", fontWeight: 800, color: "#0f172a" }}>
                          ₹{app.grandTotal.toLocaleString()}
                        </div>
                        <div style={{ fontSize: "11px", color: "#64748b" }}>
                          Subtotal ₹{app.subtotal} + Fee ₹{app.deliveryFee + app.handlingFee}
                        </div>
                      </div>

                      {/* Select/Order Button */}
                      <button
                        onClick={() => handleOrderViaApp(app)}
                        style={{
                          background: app.isBestValue ? "#10b981" : "#4e6df2",
                          color: "#ffffff",
                          border: "none",
                          borderRadius: "10px",
                          padding: "10px 18px",
                          fontSize: "12.5px",
                          fontWeight: 700,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          transition: "all 0.15s ease",
                        }}
                      >
                        <span>Order via {app.appName}</span>
                        <ArrowRight style={{ width: "14px", height: "14px" }} />
                      </button>
                    </div>

                    {/* Item Price Breakdown & Live Links */}
                    {app.itemBreakdown && app.itemBreakdown.length > 0 && (
                      <div style={{ marginTop: "10px", display: "flex", flexWrap: "wrap", gap: "8px" }}>
                        {app.itemBreakdown.map((item, idx) => (
                          <div
                            key={idx}
                            style={{
                              background: "#f8fafc",
                              border: "1px solid #e2e8f0",
                              padding: "5px 10px",
                              borderRadius: "8px",
                              fontSize: "11.5px",
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                              color: "#334155",
                            }}
                          >
                            <span style={{ fontWeight: 600 }}>{item.productName}</span>
                            <span style={{ color: "#059669", fontWeight: 700 }}>₹{item.unitPrice}</span>
                            {item.quantity && <span style={{ color: "#64748b" }}>({item.quantity} {item.unit})</span>}
                            {item.deeplink && (
                              <a
                                href={item.deeplink}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: "#3b82f6", textDecoration: "none", fontSize: "11px", fontWeight: 700 }}
                              >
                                ↗ View on Store
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Overall App Review Box */}
                    <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px solid #f1f5f9", background: "#f8fafc", borderRadius: "10px", padding: "10px 14px" }}>
                      <div style={{ fontSize: "11px", fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        OVERALL APP REVIEW & AVAILABILITY ({app.availabilityPercentage}% IN STOCK)
                      </div>
                      <p style={{ fontSize: "12.5px", color: "#334155", marginTop: "3px", lineHeight: 1.4 }}>
                        "{app.overallReview}"
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Floating Toast Notification */}
        {toastMessage && (
          <div className="toast-notification">
            <CheckCircle2 style={{ width: "18px", height: "18px", color: "#10b981" }} />
            <span>{toastMessage}</span>
          </div>
        )}
      </main>
    </div>
  );
}
