import React, {useEffect, useReducer} from 'react';
import PostDetail from '../components/postDetail/postDetail';
import Comments from '../components/comments/comments';
import styles from './post.module.scss'

function post({match, history}) {

  const initialState = {
    isLoading: true,
    data: {},
    comments: [],
    error: false
  }

  const [state, dispatch] = useReducer(reducer, initialState);

  function reducer(state, action){
    switch(action.status){
      case "success":
        return {...state, 
          data:action.payload,
          isLoading: false
        };

      case "comments":
        return {...state, 
          comments:action.payload
        };

      case "failed":
        return {...state,
          error: true
        };
    } 
  }

  useEffect(() => {
    fetch(`https://jsonplaceholder.typicode.com/posts/${match.params.postId}`)
    .then(res=>res.json())
    .then(json=>dispatch({
      payload: json,
      status: "success"
    }))
    .catch(err=>dispatch({
      status: "failed"
    }))

  }, [state.isLoading])

  function fetchComments(){
    fetch(`https://jsonplaceholder.typicode.com/comments?postId=${match.params.postId}`)
    .then(res=>res.json())
    .then(json=>dispatch({
      payload: json,
      status: "comments"
    }))
    .catch(err=>dispatch({
      status: "failed"
    }))
  }

  function deletePost(){
    fetch(`https://jsonplaceholder.typicode.com/posts/${match.params.postId}`, {
      method: 'DELETE',
    })
    .then(history.push(`/posts?userId=${state.data.userId}`))
    .catch(err=>dispatch({
      status: "failed"
    }))
  }

  return (
    <>
      {
        !state.isLoading && <> 
        <button onClick={deletePost} className={styles.deletePost}>Delete Me</button>
        <PostDetail {...state.data}/>
        <div className={styles.comments}>
          <button onClick={fetchComments}>Comments</button>
          {
            state.comments.length > 0 &&
            state.comments.map((item)=><Comments name={item.name} key={item.id} body={item.body} email={item.email}/>)
          }
        </div>
        </>
      }
      {
        state.error && <Error/>
      }
    </>
  )
}

export default post
