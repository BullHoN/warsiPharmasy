const mongoose = require("mongoose");

const CategorySchema = mongoose.Schema({
  itemName: String,
  categoryName: {
    type: String,
    index: true
  },
  discount: {
    type: Number,
    default: 0,
  },
  priceItems: [
    {
      priceTag: String,
      price: Number,
    },
  ],
  isAvailable:{
      type: Boolean,
      default: true
  }
});


const CategoryItem = mongoose.model("CategoryItem",CategorySchema);
module.exports = CategoryItem;