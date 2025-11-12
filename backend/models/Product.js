const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema(
  {
    // Book title
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // Optional summary / synopsis
    summary: {
      type: String,
      trim: true,
    },

    // Book price
    price: {
      type: Number,
      required: true,
    },

    // Author
    brand: {
      type: Schema.Types.ObjectId,
      ref: "brand",
      required: true,
    },

    // Genre
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    // Inventory
    stockQuantity: {
      type: Number,
      default: 0,
    },

    // ✅ Cover image stored as relative public path
    // Example value: "/images/book‑1.png"
    coverImage: {
      type: String,
      required: true,
      trim: true,
    },

    // Optional flag for soft delete
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Product", productSchema);