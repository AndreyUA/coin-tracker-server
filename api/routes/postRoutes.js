const { Router } = require('express');
const { check, validationResult } = require("express-validator");

const authMiddleware = require('../middlewares/authMiddleware');

const Post = require("../../data/models/Post");

const router = Router();

// @route       POST api/post
// @desc        Create new post
// @access      Private
router.post(
    '/',
    [
        check("name", "Person name is required").not().isEmpty(),
        check("text", "Post's text required").not().isEmpty(),
        authMiddleware,
    ],
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, text } = req.body;

        try {
            const post = new Post({ name, text, family: req.family.id })

            await post.save();

            res.json(post);
        } catch (error) {
            console.log(error);

            res.status(500).send("Server Error");
        }
    }
);

// @route       GET api/post/all
// @desc        Get all active posts
// @access      Private
router.get("/all", authMiddleware, async (req, res) => {
    try {
        // TODO: check filter for removed posts (isRemoved === true)
        const posts = 
            await (await Post.find())
                .filter((post) => post.family.toString() === req.family.id.toString())
                .sort((postA, postB) => 
                    new Date(postB.date).getTime() - new Date(postA.date).getTime())
                .filter((post) => !post.isRemoved);

        if (!posts || posts.length === 0)
            return res.status(404).json({ msg: "Posts not found" });

        res.send(posts);
    } catch (error) {
        console.log(error);

        res.status(500).send("Server error");
    }
});

module.exports = router;