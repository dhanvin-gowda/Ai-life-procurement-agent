"use client";

import React from "react";
import {
  ShoppingBag,
  Trash2,
  Minus,
  Plus,
  CheckCircle2,
  ArrowRight,
  LayoutGrid,
  Zap,
} from "lucide-react";
import { CartItem } from "./select-product-client";

interface CarProductProps {
  cartItems: CartItem[];
  isIntegerOnlyCategory: (category: string, unit?: string) => boolean;
  onUpdateQuantity: (productId: string, newQtyStr: string) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onCheckout: () => void;
  onCompare: () => void;
  isProcuring: boolean;
  isComparing: boolean;
  onBrowseCatalog: () => void;
}

export default function CarProduct({
  cartItems,
  isIntegerOnlyCategory,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCheckout,
  onCompare,
  isProcuring,
  isComparing,
  onBrowseCatalog,
}: CarProductProps) {
  if (cartItems.length === 0) {
    return (
      <div className="empty-cart-card">
        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            background: "#eff6ff",
            color: "#3b82f6",
            display: "grid",
            placeItems: "center",
            margin: "0 auto 16px",
          }}
        >
          <ShoppingBag style={{ width: "32px", height: "32px" }} />
        </div>
        <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#0f172a" }}>
          Your Cart is Empty
        </h3>
        <p
          style={{
            fontSize: "13.5px",
            color: "#64748b",
            marginTop: "6px",
            marginBottom: "20px",
          }}
        >
          Browse the product catalog and add items for procurement.
        </p>
        <button
          onClick={onBrowseCatalog}
          style={{
            padding: "10px 20px",
            background: "#4e6df2",
            color: "#ffffff",
            border: "none",
            borderRadius: "10px",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <LayoutGrid style={{ width: "16px", height: "16px" }} />
          <span>Browse Products Catalog</span>
        </button>
      </div>
    );
  }

  return (
    <div className="cart-container">
      {/* Left Column: Cart Items List */}
      <div className="cart-items-wrapper">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "4px",
          }}
        >
          <span style={{ fontSize: "13px", fontWeight: 700, color: "#334155" }}>
            ITEMS IN CART ({cartItems.length})
          </span>
          <button
            onClick={onClearCart}
            style={{
              background: "none",
              border: "none",
              color: "#ef4444",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <Trash2 style={{ width: "14px", height: "14px" }} />
            <span>Clear Cart</span>
          </button>
        </div>

        {cartItems.map((item) => {
          const isInt = isIntegerOnlyCategory(
            item.product.category,
            item.product.unit
          );
          return (
            <div key={item.product.id} className="cart-item-card">
              <img
                src={item.product.imageUrl}
                alt={item.product.name}
                className="cart-item-img"
              />

              <div className="cart-item-details">
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: 700,
                      color: "#64748b",
                      textTransform: "uppercase",
                    }}
                  >
                    {item.product.category}
                  </span>
                  {isInt && (
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: 700,
                        color: "#4e6df2",
                        background: "#eef2ff",
                        padding: "2px 6px",
                        borderRadius: "4px",
                      }}
                    >
                      Whole Units Only
                    </span>
                  )}
                </div>
                <h4
                  style={{
                    fontSize: "15px",
                    fontWeight: 700,
                    color: "#0f172a",
                    marginTop: "2px",
                  }}
                >
                  {item.product.name}
                </h4>
                <p style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>
                  Vendor: {item.product.provider}
                </p>
              </div>

              {/* Inline Quantity Controls */}
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <button
                  className="qty-box qty-box-btn qty-box-minus"
                  style={{ width: "34px", height: "34px", fontSize: "14px" }}
                  onClick={() => {
                    const cur = isInt
                      ? parseInt(item.quantity, 10) || 1
                      : parseFloat(item.quantity) || 1;
                    const next = isInt
                      ? Math.max(1, cur - 1)
                      : Math.max(0.1, Math.round((cur - 1) * 100) / 100);
                    onUpdateQuantity(item.product.id, String(next));
                  }}
                >
                  <Minus style={{ width: "14px", height: "14px" }} />
                </button>

                <div
                  className="qty-box qty-box-input"
                  style={{ height: "34px", minWidth: "56px" }}
                >
                  <input
                    type="text"
                    className="qty-input"
                    style={{ fontSize: "13px" }}
                    value={item.quantity}
                    onChange={(e) =>
                      onUpdateQuantity(item.product.id, e.target.value)
                    }
                    onBlur={() => {
                      if (isInt) {
                        const p = parseInt(item.quantity, 10);
                        onUpdateQuantity(
                          item.product.id,
                          String(isNaN(p) || p < 1 ? 1 : p)
                        );
                      } else {
                        const p = parseFloat(item.quantity);
                        onUpdateQuantity(
                          item.product.id,
                          String(isNaN(p) || p <= 0 ? 1 : p)
                        );
                      }
                    }}
                  />
                </div>

                <div
                  className="qty-box qty-box-unit"
                  style={{ height: "34px", fontSize: "12px", padding: "0 8px" }}
                >
                  <span>{item.product.unit}</span>
                </div>

                <button
                  className="qty-box qty-box-btn qty-box-plus"
                  style={{ width: "34px", height: "34px", fontSize: "14px" }}
                  onClick={() => {
                    const cur = isInt
                      ? parseInt(item.quantity, 10) || 0
                      : parseFloat(item.quantity) || 0;
                    const next = isInt
                      ? cur + 1
                      : Math.round((cur + 1) * 100) / 100;
                    onUpdateQuantity(item.product.id, String(next));
                  }}
                >
                  <Plus style={{ width: "14px", height: "14px" }} />
                </button>

                <button
                  onClick={() => onRemoveItem(item.product.id)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#94a3b8",
                    cursor: "pointer",
                    padding: "6px",
                    borderRadius: "6px",
                    marginLeft: "4px",
                  }}
                  title="Remove Item"
                >
                  <Trash2 style={{ width: "16px", height: "16px" }} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Right Column: Procurement Cart Summary & Compare */}
      <div className="cart-summary-card">
        <h3
          style={{
            fontSize: "16px",
            fontWeight: 800,
            color: "#0f172a",
            marginBottom: "16px",
          }}
        >
          Order Summary
        </h3>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            borderBottom: "1px solid #f1f5f9",
            paddingBottom: "16px",
            marginBottom: "16px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "13px",
              color: "#64748b",
            }}
          >
            <span>Total Products:</span>
            <strong style={{ color: "#0f172a" }}>{cartItems.length} items</strong>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "13px",
              color: "#64748b",
            }}
          >
            <span>Quantities Breakdown:</span>
            <span
              style={{
                fontSize: "12px",
                color: "#334155",
                fontWeight: 600,
                textAlign: "right",
              }}
            >
              {cartItems
                .map((i) => `${i.quantity} ${i.product.unit}`)
                .join(", ")}
            </span>
          </div>
        </div>

        <div
          style={{
            background: "#f8fafc",
            borderRadius: "12px",
            padding: "12px",
            marginBottom: "20px",
            border: "1px solid #e2e8f0",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "12px",
              color: "#16a34a",
              fontWeight: 700,
            }}
          >
            <CheckCircle2 style={{ width: "16px", height: "16px" }} />
            <span>QuickCommerce API Active</span>
          </div>
          <p style={{ fontSize: "11px", color: "#64748b", marginTop: "4px" }}>
            Real-time price comparison across Blinkit, Zepto, Instamart, BigBasket & 7 more apps.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <button
            className="btn-signin"
            style={{ marginTop: 0, width: "100%", padding: "14px 20px" }}
            disabled={isComparing || isProcuring}
            onClick={onCompare}
          >
            {isComparing ? (
              <div className="spinner" />
            ) : (
              <>
                <Zap style={{ width: "16px", height: "16px", fill: "#ffffff" }} />
                <span>Compare Across 11 Apps</span>
                <ArrowRight
                  className="arrow-icon"
                  style={{ width: "16px", height: "16px" }}
                />
              </>
            )}
          </button>

          <button
            onClick={onCheckout}
            disabled={isProcuring || isComparing}
            style={{
              width: "100%",
              padding: "11px 18px",
              background: "#f1f5f9",
              color: "#334155",
              border: "1px solid #cbd5e1",
              borderRadius: "12px",
              fontSize: "12.5px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            Direct Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
