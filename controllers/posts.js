const handleResponse = require("../service/handleResponse");
const Post = require("../models/posts");
const Comment = require("../models/comments");

const posts = {
  getPosts: handleResponse.errorAsync(async (req, res, next) => {
    const timeSort = req.query.timeSort == "asc" ? "createdAt":"-createdAt";
    const q = req.query.q !== undefined ? {"content": new RegExp(req.query.q)} : {};
    const allPosts = await Post.find(q).populate({
      path: "user",
      select: "name photo"
    }).populate({
      path: "comments",
      select: "comment user"
    }).sort(timeSort);
    handleResponse.success(res, "資料讀取成功", allPosts);
  }),
  getPost: handleResponse.errorAsync(async (req, res, next) => {
    const id = req.params.id;
    const thePost = await Post.findById(`${id}`).populate({
      path: "user",
      select: "name photo"
    }).populate({
      path: "comments",
      select: "comment user"
    });
    if (await Post.findById(`${id}`) !== null){
      handleResponse.success(res, "資料讀取成功", thePost);
    }else{
      handleResponse.errorNew(400, "無此筆資料", next);
    }
  }),
  createPosts: handleResponse.errorAsync(async (req, res, next) => {
    const body = req.body;
    if (body.content.trim()){
      const newPost = await Post.create(body);
      handleResponse.success(res, "資料讀取成功", newPost);
    }else{
      handleResponse.errorNew(400, "內文資料未填", next);
    }
  }),
  deleteAllPosts: handleResponse.errorAsync(async (req, res, next) => {
    if (req.originalUrl === "/posts/") {
      handleResponse.errorNew(404, "無此網站路由", next);
    }else{
      await Post.deleteMany({});
      handleResponse.success(res, "刪除成功", Post);
    }
  }),
  deleteOnePost: handleResponse.errorAsync(async (req, res, next) => {
    const id = req.params.id;
    if (await Post.findById(`${id}`) !== null){
      await Post.findByIdAndDelete(`${id}`);
      handleResponse.success(res, "刪除成功", Post);
    }else{
      handleResponse.errorNew(400, "無此筆資料", next);
    }
  }),
  updatePosts: handleResponse.errorAsync(async (req, res, next) => {
    const content = req.body.content;
    const id = req.params.id;
    if (await Post.findById(`${id}`) !== null){
      if(content.trim()){
        const updatePost = await Post.findByIdAndUpdate(`${id}`, {content}, {new: true, runValidators: true});
        handleResponse.success(res, "資料修改成功", updatePost);
      }else{
        handleResponse.errorNew(400, "內文資料未填", next);
      }
    }else{
      handleResponse.errorNew(400, "無此筆資料", next);
    }
  }),
  commentPost: handleResponse.errorAsync(async (req, res, next) => {
    const postId = req.params.id;
    const userId = req.user.id;
    const { comment } = req.body;
    const findPostId = await Post.findById(`${postId}`);
    if (findPostId === null) {
      handleResponse.errorNew(400, "無此筆貼文", next);
    }else{
      const newComment = await Comment.create({
        comment,
        postId,
        userId
      });
      handleResponse.success(res, "留言成功", newComment);
    }
  })
};

module.exports = posts;