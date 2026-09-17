"use client";

import React, { useState } from "react";
import {
  Shield,
  LayoutGrid,
  HeartHandshake,
  History,
  FileCheck,
  Search,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  X,
  Sparkles,
  DollarSign,
  Award,
  Apple,
  Carrot,
  Smartphone,
  Shirt,
  Watch,
  ShoppingBag,
  Layers,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  category: string;
  themeClass: "card-yellow" | "card-green" | "card-blue" | "card-lavender" | "card-cyan" | "card-pink";
  badgeText: string;
  description: string;
  monthlyPremium: number;
  maxCoverage: string;
  features: string[];
  provider: string;
  rating: number;
  popular?: boolean;
}

const PRODUCTS: Product[] = [
  {
    id: "prod-fruits-01",
    name: "Fresh Organic Fruits",
    category: "Fruits",
    themeClass: "card-yellow",
    badgeText: "Fruits",
    description: "Hand-picked organic apples, bananas, berries, and seasonal fresh fruits directly from local orchards.",
    monthlyPremium: 25,
    maxCoverage: "5 kg Pack",
    features: ["100% Certified Organic", "Farm Direct Purity", "Eco-Friendly Packaging"],
    provider: "Green Valley Farms",
    rating: 4.9,
    popular: true,
  },
  {
    id: "prod-fruits-02",
    name: "Exotic Fruit Basket",
    category: "Fruits",
    themeClass: "card-pink",
    badgeText: "Fruits",
    description: "Premium selection of dragon fruit, mangoes, passion fruit, and ripe kiwi delivered fresh.",
    monthlyPremium: 45,
    maxCoverage: "Deluxe Crate",
    features: ["Imported Exotic Varieties", "Rich in Vitamins", "Same-Day Hand Delivery"],
    provider: "Tropicana Harvest",
    rating: 4.8,
  },
  {
    id: "prod-veg-03",
    name: "Farm Fresh Vegetables",
    category: "Vegetables",
    themeClass: "card-green",
    badgeText: "Vegetables",
    description: "Crisp farm-fresh broccoli, carrots, spinach, tomatoes, and organic greens packed daily.",
    monthlyPremium: 20,
    maxCoverage: "Weekly Supply",
    features: ["Zero Chemical Pesticides", "Harvested Daily", "Hydroponic Selection"],
    provider: "Pure Earth Organics",
    rating: 4.9,
    popular: true,
  },
  {
    id: "prod-veg-04",
    name: "Organic Garden Veggies",
    category: "Vegetables",
    themeClass: "card-green",
    badgeText: "Vegetables",
    description: "100% certified pesticide-free organic vegetables sourced from sustainable local farms.",
    monthlyPremium: 35,
    maxCoverage: "Family Basket",
    features: ["Sustainable Farming", "Nutrient Sealed", "Custom Mix Options"],
    provider: "BioGreen Markets",
    rating: 4.7,
  },
  {
    id: "prod-elec-05",
    name: "Smart ELectronics Pro",
    category: "ELectronics",
    themeClass: "card-blue",
    badgeText: "ELectronics",
    description: "Next-gen noise-cancelling wireless headphones, smart sensors, and high-speed audio gear.",
    monthlyPremium: 145,
    maxCoverage: "2-Year Warranty",
    features: ["Active Noise Cancellation", "40-Hour Battery Life", "Fast Bluetooth 5.3"],
    provider: "TechPulse Gear",
    rating: 4.9,
    popular: true,
  },
  {
    id: "prod-elec-06",
    name: "Ultra HD Smart Tablet",
    category: "ELectronics",
    themeClass: "card-cyan",
    badgeText: "ELectronics",
    description: "Portable high-performance tablet display with stylus support and fast wireless charging.",
    monthlyPremium: 180,
    maxCoverage: "128GB Storage",
    features: ["OLED Retina Display", "Pen & Keyboard Compatible", "Ultra Fast Processor"],
    provider: "Nexus Digital",
    rating: 4.8,
  },
  {
    id: "prod-shirts-07",
    name: "Premium Cotton Shirts",
    category: "Shirts",
    themeClass: "card-lavender",
    badgeText: "Shirts",
    description: "100% Egyptian cotton breathable dress shirts and casual button-downs with tailored fit.",
    monthlyPremium: 55,
    maxCoverage: "Pack of 3",
    features: ["Wrinkle-Resistant Fabric", "Breathable Weave", "Tailored Modern Fit"],
    provider: "Tailor & Stitch",
    rating: 4.8,
  },
  {
    id: "prod-shirts-08",
    name: "Casual Denim & Polo Shirts",
    category: "Shirts",
    themeClass: "card-yellow",
    badgeText: "Shirts",
    description: "Comfortable soft-wash polo shirts and stylish indigo denim shirts for everyday wear.",
    monthlyPremium: 40,
    maxCoverage: "Pack of 2",
    features: ["Soft-Wash Finish", "Durable Stitching", "Versatile Color Palette"],
    provider: "Urban Apparel",
    rating: 4.7,
  },
  {
    id: "prod-pants-09",
    name: "Classic Chino & Denim Pants",
    category: "Pants",
    themeClass: "card-yellow",
    badgeText: "Pants",
    description: "Stretch-fit casual chinos, classic blue denim jeans, and relaxed formal trousers.",
    monthlyPremium: 65,
    maxCoverage: "Custom Length",
    features: ["4-Way Flex Stretch", "Fade-Resistant Wash", "Reinforced Pockets"],
    provider: "Denim Co. Studio",
    rating: 4.8,
  },
  {
    id: "prod-pants-10",
    name: "Athletic Performance Pants",
    category: "Pants",
    themeClass: "card-cyan",
    badgeText: "Pants",
    description: "Lightweight moisture-wicking joggers and flexible training pants for active lifestyles.",
    monthlyPremium: 50,
    maxCoverage: "Sport Series",
    features: ["Moisture-Wicking Tech", "Zippered Security Pockets", "Ergonomic Cut"],
    provider: "Apex Sportswear",
    rating: 4.6,
  },
  {
    id: "prod-acc-11",
    name: "Luxury Leather Accessories",
    category: "Accessories",
    themeClass: "card-pink",
    badgeText: "Accessories",
    description: "Genuine full-grain leather wallets, key organizers, sleek belts, and travel pouches.",
    monthlyPremium: 75,
    maxCoverage: "Lifetime Craft Warranty",
    features: ["RFID Blocking Leather", "Hand-stitched Detailing", "Gift Box Included"],
    provider: "Artisan Leathercraft",
    rating: 4.9,
    popular: true,
  },
  {
    id: "prod-acc-12",
    name: "Smart Watch & Accessories",
    category: "Accessories",
    themeClass: "card-lavender",
    badgeText: "Accessories",
    description: "Fitness tracking smart timepiece with magnetic wristbands and polarized sunglasses.",
    monthlyPremium: 110,
    maxCoverage: "Pro Bundle",
    features: ["Heart Rate & SpO2 Monitor", "Waterproof 50m Rating", "UV400 Sunglasses Included"],
    provider: "PulseTech Style",
    rating: 4.8,
  },
];

export default function SelectProductClient() {
  const [activeTab, setActiveTab] = useState<string>("select-product");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Application modal local state
  const [isProcuring, setIsProcuring] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
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

  const renderCategoryIcon = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes("fruit")) {
      return <Apple style={{ width: "24px", height: "24px", color: "#d97706" }} />;
    }
    if (cat.includes("veg")) {
      return <Carrot style={{ width: "24px", height: "24px", color: "#16a34a" }} />;
    }
    if (cat.includes("elec")) {
      return <Smartphone style={{ width: "24px", height: "24px", color: "#2563eb" }} />;
    }
    if (cat.includes("shirt")) {
      return <Shirt style={{ width: "24px", height: "24px", color: "#9333ea" }} />;
    }
    if (cat.includes("pant")) {
      return <Layers style={{ width: "24px", height: "24px", color: "#0891b2" }} />;
    }
    if (cat.includes("access")) {
      return <Watch style={{ width: "24px", height: "24px", color: "#db2777" }} />;
    }
    return <Sparkles style={{ width: "24px", height: "24px", color: "#4e6df2" }} />;
  };

  // Pure client-side filtering logic
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

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setSubmissionSuccess(false);
  };

  const handleConfirmProcurement = () => {
    if (!selectedProduct) return;
    setIsProcuring(true);

    setTimeout(() => {
      setProcurementRef(`PROC-${Math.floor(100000 + Math.random() * 900000)}`);
      setSubmissionSuccess(true);
      setIsProcuring(false);
    }, 600);
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
              className={`nav-item ${activeTab === "procurements" ? "active" : ""}`}
              onClick={() => setActiveTab("procurements")}
            >
              <FileCheck />
              <span>Procurement Log</span>
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
          <h1>Select Product</h1>
          <p className="subtitle">
            Browse products across Fruits, Vegetables, ELectronics, Shirts, Pants, and Accessories.
          </p>
        </header>

        {/* Filter and Search Bar */}
        <div style={{ marginBottom: "28px", display: "flex", flexDirection: "column", gap: "16px" }}>
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
                placeholder="Search products or providers..."
                style={{ paddingLeft: "40px" }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
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
                  padding: "6px 16px",
                  borderRadius: "999px",
                  fontSize: "12px",
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

        {/* Product Cards Grid using exact globals.css design */}
        <div className="category-grid">
          {filteredProducts.map((product) => {
            const isSelected = selectedProduct?.id === product.id;

            return (
              <div
                key={product.id}
                className={`category-card ${product.themeClass} ${isSelected ? "selected" : ""}`}
                onClick={() => handleSelectProduct(product)}
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
                        width: "44px",
                        height: "44px",
                        borderRadius: "14px",
                        background: "rgba(255, 255, 255, 0.75)",
                        display: "grid",
                        placeItems: "center",
                        marginBottom: "8px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                      }}
                    >
                      {renderCategoryIcon(product.category)}
                    </div>

                    <span
                      style={{
                        fontSize: "14px",
                        fontWeight: 700,
                        color: "#0f172a",
                        lineHeight: 1.2,
                      }}
                    >
                      {product.name}
                    </span>
                    <span style={{ fontSize: "11px", color: "#64748b", marginTop: "4px" }}>
                      {product.provider}
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <div className="category-label">{product.badgeText}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Product Detail Modal */}
        {selectedProduct && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 50,
              background: "rgba(15, 23, 42, 0.45)",
              backdropFilter: "blur(4px)",
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
                padding: "32px",
                maxHeight: "90vh",
                overflowY: "auto",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "20px",
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
                  <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#0f172a", marginTop: "4px" }}>
                    {selectedProduct.name}
                  </h2>
                  <p style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>
                    Underwritten by {selectedProduct.provider} • Rating ⭐ {selectedProduct.rating}
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

              {!submissionSuccess ? (
                <>
                  <p style={{ fontSize: "13px", color: "#334155", lineHeight: 1.5, marginBottom: "20px" }}>
                    {selectedProduct.description}
                  </p>

                  <div style={{ background: "#f8fafc", borderRadius: "14px", padding: "16px", marginBottom: "20px" }}>
                    <div style={{ fontSize: "12px", fontWeight: 700, color: "#475569", marginBottom: "10px" }}>
                      KEY POLICY BENEFITS
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

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", paddingTop: "16px", borderTop: "1px solid #e2e8f0" }}>
                    <button
                      className="btn-signin"
                      style={{ marginTop: 0, width: "100%", padding: "12px 24px" }}
                      disabled={isProcuring}
                      onClick={handleConfirmProcurement}
                    >
                      {isProcuring ? (
                        <div className="spinner" />
                      ) : (
                        <>
                          <span>Select Product</span>
                          <ArrowRight className="arrow-icon" style={{ width: "16px", height: "16px" }} />
                        </>
                      )}
                    </button>
                  </div>
                </>
              ) : (
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                  <div
                    style={{
                      width: "56px",
                      height: "56px",
                      borderRadius: "50%",
                      background: "#dcfce7",
                      color: "#16a34a",
                      display: "grid",
                      placeItems: "center",
                      margin: "0 auto 16px",
                    }}
                  >
                    <CheckCircle2 style={{ width: "32px", height: "32px" }} />
                  </div>
                  <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#0f172a" }}>
                    Product Selected!
                  </h3>
                  <p style={{ fontSize: "13px", color: "#64748b", marginTop: "6px" }}>
                    Selection reference: <strong style={{ color: "#0ea5c9" }}>{procurementRef}</strong>
                  </p>

                  <button
                    className="btn-signin"
                    style={{ marginTop: "24px" }}
                    onClick={() => setSelectedProduct(null)}
                  >
                    Done & Return to Catalog
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
