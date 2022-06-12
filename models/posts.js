const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "users",
      required: [true, "使用者 ID 未填"]
    },
    content: {
      type: String,
      required: [true, "內文資料未填"]
    },
    image: {
      type: String,
      default: ""
    },
    likes: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "users"
      }
    ]
  },
  {
    versionKey: false,
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// 許多框架上都有 virtual 的概念，例如：Vue、React、Angular
// 「虛擬」的意思，會將資料虛擬的掛在第 32、33 行，類似 join 的概念
// 因為是虛擬的，所以不會影響到效能
// 在 MongoDB 中稱為「引用」
postSchema.virtual("comments", {
  ref: "comments",
  foreignField: "post",
  localField: "_id"
});

const Post = mongoose.model("posts", postSchema);

module.exports = Post;