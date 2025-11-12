const Product = require("../models/Product");

/**
 * Create new book
 */
exports.create = async (req, res) => {
  try {
    const { title, summary, price, brand, category, stockQuantity, coverImage } = req.body;

    if (!title || !price || !brand || !category || !coverImage) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Book cover path must start with / (so it works from public/)
    const imagePath = coverImage.startsWith("/")
      ? coverImage
      : "/" + coverImage.replace(/\\/g, "/");

    const book = new Product({
      title,
      summary,
      price,
      brand,
      category,
      stockQuantity,
      coverImage: imagePath,
    });

    await book.save();
    res.status(201).json(book);
  } catch (error) {
    console.error("Error creating book:", error);
    res.status(500).json({ message: "Server error while adding book" });
  }
};

/**
 * Get all books
 */
exports.getAll = async (req, res) => {
  try {
    const filter = {};
    const sort = {};
    let skip = 0;
    let limit = 0;

    if (req.query.brand) {
      filter.brand = { $in: Array.isArray(req.query.brand) ? req.query.brand : [req.query.brand] };
    }

    if (req.query.category) {
      filter.category = { $in: Array.isArray(req.query.category) ? req.query.category : [req.query.category] };
    }

    if (req.query.user) filter.isDeleted = false;

    if (req.query.sort) {
      sort[req.query.sort] = req.query.order === "asc" ? 1 : -1;
    }

    if (req.query.page && req.query.limit) {
      const pageSize = Number(req.query.limit);
      const page = Number(req.query.page);
      skip = pageSize * (page - 1);
      limit = pageSize;
    }

    const totalDocs = await Product.countDocuments(filter);
    const results = await Product.find(filter)
      .sort(sort)
      .populate("brand")
      .populate("category")
      .skip(skip)
      .limit(limit);

    res.set("X-Total-Count", totalDocs);
    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ message: "Error fetching books" });
  }
};

/**
 * Get single book
 */
exports.getById = async (req, res) => {
  try {
    const book = await Product.findById(req.params.id).populate("brand").populate("category");
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.status(200).json(book);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving book" });
  }
};

/**
 * Update book
 */
exports.updateById = async (req, res) => {
  try {
    const updatedBook = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate("brand")
      .populate("category");

    if (!updatedBook) return res.status(404).json({ message: "Book not found" });
    res.status(200).json(updatedBook);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating book" });
  }
};

/**
 * Delete / undelete
 */
exports.deleteById = async (req, res) => {
  try {
    const deletedBook = await Product.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
    if (!deletedBook) return res.status(404).json({ message: "Book not found" });
    res.status(200).json(deletedBook);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting book" });
  }
};

exports.undeleteById = async (req, res) => {
  try {
    const restored = await Product.findByIdAndUpdate(
      req.params.id,
      { isDeleted: false },
      { new: true }
    )
      .populate("brand")
      .populate("category");

    if (!restored) return res.status(404).json({ message: "Book not found" });
    res.status(200).json(restored);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error restoring book" });
  }
};