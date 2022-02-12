const express = require("express")
const router = express.Router()
const { Posts , Likes} = require("../models");

const {validateToken} = require("../middlewares/AuthMiddleware");



router.get("/", async (req, res)=>{
    //spojio obje tabele
    const listOfPosts = await Posts.findAll({include: [Likes]});
    res.json(listOfPosts);
});

router.get('/byId/:id', async (req,res)=>{
    const id = req.params.id;
    const post = await Posts.findByPk(id);
    res.json(post);
});

router.post("/" , validateToken ,async (req, res) =>{
    const post = req.body;
    post.username = req.user.username;
    await Posts.create(post);
    res.json(post);
});

router.delete("/:postId", validateToken, async (req, res)=>{
    const postId = req.params.postId;
    const commentId = req.params.commentId;

    await Posts.destroy({where: {
 
     id: postId,
   }});

   res.json("POST IZBRISAN! ");
});

module.exports = router