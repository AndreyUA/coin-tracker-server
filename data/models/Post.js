const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    family: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "families",
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    text: {
        type: String,
        required: true
    },
    isRemoved: {
        type: Boolean,
        default: false,
    },
});

module.exports = Post = mongoose.model("Post", PostSchema);