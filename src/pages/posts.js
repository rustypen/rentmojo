import React, {useReducer, useEffect} from 'react';
import styles from './posts.module.scss';
import {Link} from 'react-router-dom';
import Error from '../components/error/error';

function posts({location}) {
  const userId = new URLSearchParams(location.search).get("userId");

  
  const initialState = {
    isLoading: true,
    data: [],
    error: false,
    filter: "",
    limit: 0,
    page: 1
  }

  const [state, dispatch] = useReducer(reducer, initialState);

  function reducer(state, action){
    switch(action.status){
      case "success":
        return {...state, 
          data:action.payload,
          isLoading: false
        };

      case "filter":
        return {...state,
          filter: action.filter
        };

      case "pagination":
        return {...state,
          page: action.page || state.page,
          limit: action.limit || state.limit
        }

      case "failed":
        return {...state,
          error: true
        };
    } 
  }

  async function fetcher(){
    let res = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}&_page=${state.page}&_limit=${state.limit}`)
    let json = await res.json()
    return json.map((item)=>({
      title: item.title,
      postId: item.id
    }))
  }

  useEffect(() => {
    fetcher().then(data=>
      dispatch({
        payload: data,
        status: "success"
      })
    )
    .catch(err=>dispatch({
      status: "error"
    }))
    ;

  }, [state.page, state.limit])

  function projection(){  
    if(state.filter !== ""){
      return state.data.filter((item)=>item.title.toLowerCase().startsWith(state.filter.toLowerCase()))
    } 
    return state.data;
  }


  function handleFilter(e){
    dispatch({
      filter: e.target.value,
      status: "filter"
    })
  }


  function handlePagination(e){
    switch(e.target.name){
      case "page":
        return dispatch({
          page: e.target.value,
          status: "pagination"
        })
      case "limit":
        return dispatch({
          limit: e.target.value,
          status: "pagination"
        })
    }
  }


  return (<>
    <div className={styles.controls}>
      <input type="text" placeholder="Title" name="search" value={state.filter} onChange={handleFilter} className={styles.filter} />
      <div className={styles.limitsAndSkips}>
        <label>
          Skip:
          <input type="number" name="page" value={state.page} onChange={handlePagination}/>
        </label>
        <label>
          Limit:
          <input type="number" name="limit" value={state.limit} onChange={handlePagination}/>
        </label>
      </div>
    </div>
    <div className={styles.posts}>
      {
        !state.isLoading 
        && projection().map((item)=>
        <div key={item.postId} className={styles.item}>
          <Link to={`/post/${item.postId}`} >{item.title}</Link>
        </div>
        )
      }
      {
        state.error && <Error/>
      }
    </div>
  </>)
}

export default posts
