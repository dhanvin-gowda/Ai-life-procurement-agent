"use client"
import React, { useMemo, useState } from "react";

/* ---------------------------------- Types ---------------------------------- */

interface ProductItem {
  id: string;
  label: string;
}

interface ProductCategory {
  id: string;
  label: string;
  icon: string;
  description: string;
  items: ProductItem[];
}

type SelectionState = Record<string, string[]>;

/* ---------------------------------- Data ---------------------------------- */

const CATEGORIES: ProductCategory[] = [
  {
    id: "vegetables",
    label: "Vegetables",
    icon: "\u{1F96C}",
    description: "Select a vegetable from the list",
    items: [
      { id: "broccoli", label: "Broccoli" },
      { id: "carrot", label: "Carrot" },
      { id: "spinach", label: "Spinach" },
      { id: "potato", label: "Potato" },
      { id: "onion", label: "Onion" },
      { id: "tomato", label: "Tomato" },
    ],
  },
  {
    id: "fruits",
    label: "Fruits",
    icon: "\u{1F34E}",
    description: "Select a fruit from the list",
    items: [
      { id: "apple", label: "Apple" },
      { id: "banana", label: "Banana" },
      { id: "mango", label: "Mango" },
      { id: "grapes", label: "Grapes" },
      { id: "orange", label: "Orange" },
      { id: "papaya", label: "Papaya" },
    ],
  },
  {
    id: "groceries",
    label: "Groceries",
    icon: "\u{1F6D2}",
    description: "Select groceries from the list",
    items: [
      { id: "rice", label: "Rice" },
      { id: "wheat-flour", label: "Wheat Flour" },
      { id: "sugar", label: "Sugar" },
      { id: "salt", label: "Salt" },
      { id: "cooking-oil", label: "Cooking Oil" },
      { id: "lentils", label: "Lentils" },
    ],
  },
  {
    id: "clothes",
    label: "Clothes",
    icon: "\u{1F455}",
    description: "Select clothing from the list",
    items: [
      { id: "t-shirt", label: "T-Shirt" },
      { id: "jeans", label: "Jeans" },
      { id: "jacket", label: "Jacket" },
      { id: "socks", label: "Socks" },
      { id: "cap", label: "Cap" },
      { id: "shoes", label: "Shoes" },
    ],
  },
  {
    id: "electronics",
    label: "Electronics",
    icon: "\u{1F4F1}",
    description: "Select electronics from the list",
    items: [
      { id: "headphones", label: "Headphones" },
      { id: "charger", label: "Charger" },
      { id: "power-bank", label: "Power Bank" },
      { id: "mouse", label: "Mouse" },
      { id: "keyboard", label: "Keyboard" },
      { id: "speaker", label: "Speaker" },
    ],
  },
  {
    id: "others",
    label: "Others",
    icon: "\u{1F381}",
    description: "Select a other from the list",
    items: [
      { id: "notebook", label: "Notebook" },
      { id: "pen-set", label: "Pen Set" },
      { id: "yoga-mat", label: "Yoga Mat" },
      { id: "water-bottle", label: "Water Bottle" },
      { id: "backpack", label: "Backpack" },
      { id: "sunglasses", label: "Sunglasses" },
      { id: "umbrella", label: "Umbrella" },
      { id: "perfume", label: "Perfume" },
      { id: "wallet", label: "Wallet" },
      { id: "watch", label: "Watch" },
    ],
  },
];

const DEFAULT_SELECTIONS: SelectionState = {
  vegetables: ["broccoli", "carrot"],
  others: ["pen-set"],
};

/* --------------------------------- Styles ---------------------------------- */

const styles = `
.qs-app { min-height: 100vh; background: #f6f7fb; color: #1f2430; font-family: "Segoe UI", "Inter", system-ui, -apple-system, sans-serif; }
.qs-topbar { display: flex; align-items: center; justify-content: space-between; padding: 18px 40px; background: #fff; border-bottom: 1px solid #e6e8ee; }
.qs-brand { display: flex; align-items: center; gap: 8px; font-weight: 800; font-size: 1.3rem; }
.qs-brand-icon { font-size: 1.4rem; }
.qs-search input { border: none; background: transparent; color: #7c8296; font-size: .95rem; outline: none; text-align: right; width: 220px; }
.qs-tabs { display: flex; gap: 8px; padding: 14px 40px; background: #fff; border-bottom: 1px solid #e6e8ee; overflow-x: auto; }
.qs-tab { display: flex; align-items: center; gap: 8px; padding: 10px 18px; border-radius: 999px; border: none; background: transparent; color: #7c8296; font-size: .95rem; font-weight: 600; cursor: pointer; white-space: nowrap; transition: background .15s ease, color .15s ease; }
.qs-tab:hover { background: #f2f3f7; }
.qs-tab--active { background: #fdeaf1; color: #e91e63; }
.qs-tab-icon { font-size: 1.05rem; }
.qs-content { max-width: 900px; margin: 32px auto; padding: 0 24px 64px; display: flex; flex-direction: column; gap: 24px; }
.qs-hero { display: flex; align-items: center; gap: 18px; background: #fdeaf1; border-radius: 14px; padding: 28px 32px; }
.qs-hero-icon { font-size: 2.4rem; }
.qs-hero h1 { margin: 0 0 4px; font-size: 1.6rem; color: #e91e63; }
.qs-hero p { margin: 0; color: #7c8296; }
.qs-picker, .qs-summary { background: #fff; border-radius: 14px; border: 1px solid #e6e8ee; padding: 24px 28px 28px; }
.qs-picker-header, .qs-summary-header { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 18px; }
.qs-picker-header h2, .qs-summary-header h2 { margin: 0; font-size: 1.05rem; }
.qs-picker-hint { font-weight: 400; color: #7c8296; font-size: .9rem; }
.qs-link-button { border: none; background: none; color: #7c8296; font-size: .9rem; cursor: pointer; padding: 0; }
.qs-link-button:hover:not(:disabled) { color: #e91e63; }
.qs-link-button:disabled { opacity: .4; cursor: default; }
.qs-options-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
@media (max-width: 640px) { .qs-options-grid { grid-template-columns: 1fr; } }
.qs-option { position: relative; display: flex; align-items: center; gap: 12px; padding: 14px 16px; border: 1px solid #e6e8ee; border-radius: 10px; cursor: pointer; transition: border-color .15s ease, background .15s ease; }
.qs-option:hover { border-color: #f6b8d0; }
.qs-option input { position: absolute; opacity: 0; width: 0; height: 0; }
.qs-option-box { width: 20px; height: 20px; flex: 0 0 20px; border: 1.5px solid #c7cad4; border-radius: 5px; display: flex; align-items: center; justify-content: center; color: #fff; font-size: .75rem; }
.qs-option-label { font-weight: 600; font-size: .95rem; color: #1f2430; }
.qs-option--checked { background: #fdeaf1; border-color: #e91e63; }
.qs-option--checked .qs-option-box { background: #e91e63; border-color: #e91e63; }
.qs-option--checked .qs-option-label { color: #e91e63; }
.qs-option:focus-within { outline: 2px solid #e91e63; outline-offset: 2px; }
.qs-chip-row { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }
.qs-chip { display: inline-flex; align-items: center; gap: 6px; background: #fdeaf1; color: #e91e63; border-radius: 999px; padding: 6px 8px 6px 14px; font-size: .88rem; font-weight: 600; }
.qs-chip-remove { border: none; background: none; color: #e91e63; cursor: pointer; font-size: 1rem; line-height: 1; padding: 2px; }
.qs-chip--summary { padding: 6px 14px; background: #f1f2f6; color: #1f2430; }
.qs-summary-group { margin-top: 16px; }
.qs-summary-group:first-of-type { margin-top: 0; }
.qs-summary-group-title { margin: 0; font-weight: 700; font-size: .92rem; color: #1f2430; }
.qs-summary-empty { color: #7c8296; margin: 0; }
`;

/* -------------------------------- Component --------------------------------- */

export default function SelectProduct() {
  const [activeCategoryId, setActiveCategoryId] = useState<string>(
    CATEGORIES[CATEGORIES.length - 1].id
  );
  const [selections, setSelections] = useState<SelectionState>(DEFAULT_SELECTIONS);
  const [search, setSearch] = useState("");

  const activeCategory = useMemo(
    () => CATEGORIES.find((c) => c.id === activeCategoryId) ?? CATEGORIES[0],
    [activeCategoryId]
  );

  const activeSelectedIds = selections[activeCategory.id] ?? [];

  const toggleItem = (categoryId: string, itemId: string) => {
    setSelections((prev) => {
      const current = prev[categoryId] ?? [];
      const next = current.includes(itemId)
        ? current.filter((id) => id !== itemId)
        : [...current, itemId];
      return { ...prev, [categoryId]: next };
    });
  };

  const removeItem = (categoryId: string, itemId: string) => {
    setSelections((prev) => ({
      ...prev,
      [categoryId]: (prev[categoryId] ?? []).filter((id) => id !== itemId),
    }));
  };

  const clearCategory = (categoryId: string) => {
    setSelections((prev) => ({ ...prev, [categoryId]: [] }));
  };

  const clearAll = () => setSelections({});

  const totalCount = Object.values(selections).reduce(
    (sum, ids) => sum + ids.length,
    0
  );

  const categoriesWithSelections = CATEGORIES.filter(
    (c) => (selections[c.id] ?? []).length > 0
  );

  return (
    <div className="qs-app">
      <style>{styles}</style>

      <header className="qs-topbar">
        <div className="qs-brand">
          <span className="qs-brand-icon" aria-hidden="true">
            {"\u{1F6CD}\u{FE0F}"}
          </span>
          <span>QuickShop</span>
        </div>
        <div className="qs-search">
          <input
            type="search"
            placeholder="Find what you need"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Find what you need"
          />
        </div>
      </header>

      <nav className="qs-tabs" aria-label="Shopping categories">
        {CATEGORIES.map((category) => (
          <button
            key={category.id}
            type="button"
            className={
              "qs-tab" + (category.id === activeCategory.id ? " qs-tab--active" : "")
            }
            onClick={() => setActiveCategoryId(category.id)}
            aria-pressed={category.id === activeCategory.id}
          >
            <span className="qs-tab-icon" aria-hidden="true">
              {category.icon}
            </span>
            {category.label}
          </button>
        ))}
      </nav>

      <main className="qs-content">
        <section className="qs-hero">
          <span className="qs-hero-icon" aria-hidden="true">
            {activeCategory.icon}
          </span>
          <div>
            <h1>{activeCategory.label}</h1>
            <p>{activeCategory.description}</p>
          </div>
        </section>

        <section className="qs-picker" aria-labelledby="qs-picker-heading">
          <div className="qs-picker-header">
            <h2 id="qs-picker-heading">
              Choose {activeCategory.label}{" "}
              <span className="qs-picker-hint">(select multiple)</span>
            </h2>
            <button
              type="button"
              className="qs-link-button"
              onClick={() => clearCategory(activeCategory.id)}
              disabled={activeSelectedIds.length === 0}
            >
              Clear
            </button>
          </div>

          <div className="qs-options-grid">
            {activeCategory.items.map((item) => {
              const checked = activeSelectedIds.includes(item.id);
              return (
                <label
                  key={item.id}
                  className={"qs-option" + (checked ? " qs-option--checked" : "")}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleItem(activeCategory.id, item.id)}
                  />
                  <span className="qs-option-box" aria-hidden="true">
                    {checked ? "\u2713" : ""}
                  </span>
                  <span className="qs-option-label">{item.label}</span>
                </label>
              );
            })}
          </div>

          {activeSelectedIds.length > 0 && (
            <div className="qs-chip-row" aria-live="polite">
              {activeSelectedIds.map((id) => {
                const item = activeCategory.items.find((i) => i.id === id);
                if (!item) return null;
                return (
                  <span className="qs-chip" key={id}>
                    {item.label}
                    <button
                      type="button"
                      className="qs-chip-remove"
                      onClick={() => removeItem(activeCategory.id, id)}
                      aria-label={`Remove ${item.label}`}
                    >
                      {"\u00D7"}
                    </button>
                  </span>
                );
              })}
            </div>
          )}
        </section>

        <section className="qs-summary" aria-labelledby="qs-summary-heading">
          <div className="qs-summary-header">
            <h2 id="qs-summary-heading">All Selections ({totalCount})</h2>
            <button
              type="button"
              className="qs-link-button"
              onClick={clearAll}
              disabled={totalCount === 0}
            >
              Clear all
            </button>
          </div>

          {categoriesWithSelections.length === 0 ? (
            <p className="qs-summary-empty">Nothing selected yet.</p>
          ) : (
            categoriesWithSelections.map((category) => (
              <div className="qs-summary-group" key={category.id}>
                <p className="qs-summary-group-title">
                  <span aria-hidden="true">{category.icon}</span> {category.label}
                </p>
                <div className="qs-chip-row">
                  {(selections[category.id] ?? []).map((id) => {
                    const item = category.items.find((i) => i.id === id);
                    if (!item) return null;
                    return (
                      <span className="qs-chip qs-chip--summary" key={id}>
                        {item.label}
                      </span>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  );
}