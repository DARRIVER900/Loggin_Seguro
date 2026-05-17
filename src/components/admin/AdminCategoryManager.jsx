import { useState } from "react";
import { sanitizePlaylistName } from "../../utils/security";

const initialCategories = ["Trending Now", "New Discoveries", "Editorial Picks"];

const AdminCategoryManager = () => {
  const [categories, setCategories] = useState(initialCategories);
  const [categoryName, setCategoryName] = useState("");
  const cleanCategoryName = sanitizePlaylistName(categoryName);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!cleanCategoryName || categories.includes(cleanCategoryName)) {
      return;
    }

    setCategories((currentCategories) => [...currentCategories, cleanCategoryName]);
    setCategoryName("");
  };

  return (
    <section className="admin-panel" aria-labelledby="categories-title">
      <div className="section-heading">
        <p className="eyebrow">Editorial tools</p>
        <h2 id="categories-title">Featured playlists and categories</h2>
      </div>

      <form onSubmit={handleSubmit} className="music-search" aria-label="Create featured category">
        <label htmlFor="category-name" className="sr-only">
          Featured category name
        </label>
        <input
          id="category-name"
          type="text"
          className="input-field"
          placeholder="Create a featured category..."
          value={categoryName}
          onChange={(event) => setCategoryName(event.target.value.slice(0, 60))}
          aria-describedby="category-help"
          maxLength={60}
        />
        <span id="category-help" className="sr-only">
          Add a unique category name for the administrative dashboard.
        </span>
        <button
          type="submit"
          className="loggin-button"
          disabled={!cleanCategoryName || categories.includes(cleanCategoryName)}
        >
          Add category
        </button>
      </form>

      <div className="category-list" aria-live="polite">
        {categories.map((category) => (
          <span key={category} className="category-pill">{category}</span>
        ))}
      </div>
    </section>
  );
};

export default AdminCategoryManager;
