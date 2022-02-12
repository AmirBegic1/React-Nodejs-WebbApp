import React, {useContext, useEffect} from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate} from "react-router-dom";
import { AuthContext } from "../helper/AuthContext";

function CreatePost() {
  const { authState } = useContext(AuthContext);

  let history = useNavigate();
  const initialValues = {
    title: "",
    postText: "",
   
    
  };

  useEffect(()=>{
    if(!localStorage.getItem("accessToken")){
      history("/login");
    }
  }, []);

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Morate unijeti naslov! "),
    postText: Yup.string().required("Morate unijeti text! "),
    
  });
  
  const onSubmit = (data) => {

    axios.post("http://localhost:3333/posts", data, {headers: {accessToken: localStorage.getItem("accessToken")},
    }).then((response) => {
      history("/");
    });
  };

  


  return (
    <div className="createPostPage">
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        <Form className="formContainer">
          <label>Title: </label>
          <ErrorMessage name="title" component="span" />
          <Field
            autocomplete="off"
            id="inputCreatePost"
            name="title"
            placeholder="(Ex. Naslov1...)"
          />
          <label>Post: </label>
          <ErrorMessage name="postText" component="span" />
          <Field
            autocomplete="off"
            id="inputCreatePost"
            name="postText"
            placeholder="(Ex. Post1...)"
          />


          <button type="submit"> Create Post</button>
        </Form>
      </Formik>
    </div>
  );
}

export default CreatePost;