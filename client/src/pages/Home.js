import React, { useContext } from "react";
import axios from "axios";
import {useEffect, useState} from "react";
import { useNavigate} from "react-router-dom";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import { AuthContext } from "../helper/AuthContext";

function Home() {

    const [listOfPosts, setListOfPosts] = useState([]);
    let history = useNavigate();
    
    const { authState } = useContext(AuthContext);

  useEffect(()=>{

    if(!localStorage.getItem("accessToken")){
      history("/login");
    }else{
          axios.get("http://localhost:3333/posts").then((response)=>{
            setListOfPosts(response.data);
          });
        }
        }, []);

  

  const likeAPost = (postId) =>{
    axios.post("http://localhost:3333/likes", { PostId: postId}, {
       headers: { accessToken: localStorage.getItem("accessToken")} 
    }).then((response)=>{
      alert(response.data);
      setListOfPosts(listOfPosts.map((post)=>{
        if (post.id  === postId) {
          if(response.data.liked) {

          
          return {...post, Likes: [...post.Likes, 0]};
          }else{
            const likeArray = post.Likes;
            likeArray.pop();
            return {...post, Likes: likeArray};
          }
        }else{
          return post
        }
      }))
    });
  }



    return (
        <div>
        {listOfPosts.map((value, key)=>{ 
            return (
             <div className="post"
              
              > 
            {/* ispisovanje kroz react  */}
                <div className="title"> {value.title} </div> 
                <div className="body" onClick={()=>{
                  history(`/post/${value.id}`)
              }}> {value.postText}</div> 
                  <div className="footer">
                  <div className="username"> {value.username}</div>
                  <div className="buttons">
                      <ThumbUpAltIcon
                        onClick={() => {
                            likeAPost(value.id);
                            }}
                            className="likeBttn"
                      />
                      
                        <label> {value.Likes.length}</label>
                    </div> 
                  </div>
                </div>
            );
            })}
        </div>
    );
}

export default Home
