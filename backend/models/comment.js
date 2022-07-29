const { Schema, model, set } = require("mongoose");

const commentSchema = new Schema({
  text: String,
  blogs: {
    type: Schema.Types.ObjectId,
    ref: "Blog",
  },
});

commentSchema.set("toJSON", {
  transform: (doc, res) => {
    res.id = res._id.toString();
    delete res._id;
    delete res.__v;
  },
});

module.exports = model("User-Comment", commentSchema);
