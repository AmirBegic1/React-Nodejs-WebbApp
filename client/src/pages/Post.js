import React, {useEffect, useState, useContext} from "react";
import {useParams} from "react-router-dom";
import {useNavigate} from "react-router-dom";
import axios from "axios";

import {AuthContext } from "../helper/AuthContext";

function Post() {
    let { id } = useParams();
    const [postObject, setPostObject] = useState({});
    const [comments , setComments] = useState([]);
    const[newComment, setNewComment] = useState("");
    const { authState } = useContext(AuthContext);

    let history = useNavigate();


    useEffect(()=>{
            axios.get(`http://localhost:3333/posts/byId/${id}`).then((response)=>{
            setPostObject(response.data);
        });
        axios.get(`http://localhost:3333/comments/${id}`).then((response)=>{
            setComments(response.data);
        });
    }, []);


    const addComment = () =>{
        axios.post("http://localhost:3333/comments", {commentBody: newComment, PostId: id}, 
            {
                headers: {
                    accessToken: localStorage.getItem("accessToken"),
                },
            }
        ).then((response)=>{
            if(response.data.error){
                alert(response.data.error);
            }else{

            
            const commentToAdd = {commentBody: newComment, username: response.data.username}
            setComments([...comments, commentToAdd]);
            setNewComment("");
            }
        });

        

    }

    const deleteComment = (id) =>{
        axios.delete(`http://localhost:3333/comments/${id}`, { headers: {accessToken: localStorage.getItem('accessToken')},
    }).then(() =>{
            setComments(comments.filter((val)=>{
                return val.id != id ;
            })
        );
    });
    }
    
    const deletePost = (id) =>{
        axios.delete(`http://localhost:3333/posts/${id}` , { headers: {accessToken: localStorage.getItem('accessToken') }},).then(() =>{
            history("/");
        });
    };

    return (
        
        
            <div className="postPage">
                <div className="leftSide">
                    <div className="post" id="individual">
                        <div className="title">{postObject.title}</div>
                        <div className="body">{postObject.postText}</div>
                        <div className="footer">{postObject.username}
                            
                            {authState.username === postObject.username && <button onClick={() => {deletePost(postObject.id)}} >Obrisi post!</button>}
                        </div>
                    </div>
                </div>

                <div className="rightSide">
                    <div className="addCommentContainer"> 
                    <input type="text" placeholder="Komentar..." autoComplete="off" value={newComment} onChange={(event) => {setNewComment(event.target.value)}}/>
                    <button onClick={addComment} >Dodaj Komentar</button>
                    </div>
                    <div className="listOfComments">
                        {comments.map((comment , key) =>{
                            return <div key={key} className="comment">{comment.commentBody}
                            <label>Korisnik: {comment.username}</label>
                            {authState.username === comment.username && (
                                <button onClick={() => {deleteComment(comment.id)}}> OBRISI </button>
                            )}
                            </div>
                        })}
                    </div>
                </div>
            </div>
        
    )
}

export default Post
