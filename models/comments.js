const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: [true, "Comment can not be empty!"]
    },
    createAt: {
      type: Date,
      default: Date.now
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "users",
      required: [true, "A comment must belong to a user."]
    },
    post: {
      type: mongoose.Schema.ObjectId,
      ref: "posts",
      required: [true, "A comment must belong to a post."]
    }
  },
  { versionKey: false }
);

// 「前置器」，如果使用到 find 語法，就會觸發這段程式碼
// 作用為將 user 的 ID 資料轉換成 name、id、created 資料
// 「^find」代表是 find 開頭的都會吃到
commentSchema.pre(/^find/, function(next) {
  this.populate({
    path: "user",
    select: "name id createdAt"
  });
  
  next(); // middleware
});

const Comment = mongoose.model("comments", commentSchema);

module.exports = Comment;