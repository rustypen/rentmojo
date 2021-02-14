import React, {useReducer, useEffect} from 'react';
import styles from './home.module.scss';
import Error from '../components/error/error';
import { Link} from 'react-router-dom'

function home() {

  const initialState = {
    isLoading: true,
    data: [],
    error: false,
    filter: ""
  }

  const [state, dispatch] = useReducer(reducer, initialState);

  function reducer(state, action){
    // debugger;
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

      case "failed":
        return {...state,
          error: true,
          isLoading: true
        };

      default: 
        return {...state}
    } 
  }


  async function fetcher(){
    try{
      let res = await fetch('https://jsonplaceholder.typicode.com/users')
      let json = await res.json()
      return json.map((item)=>({
        userid: item.id,
        name: item.name,
        company: item.company.name
      }))
    }
    catch(err){
      throw err;
    }
  }

  useEffect(() => {
    fetcher().then(data=>
      dispatch({
        payload: data,
        status: "success"
      })
    ).catch(err=>dispatch({
      status: "failed"
    }))
  }, [])


  function projection(){  
    if(state.filter !== ""){
      return state.data.filter((item)=>item.name.toLowerCase().startsWith(state.filter.toLowerCase()) || item.company.toLowerCase().startsWith(state.filter.toLowerCase()))
    }
    return state.data;
  }


  function handleFilter(e){
    dispatch({
      filter: e.target.value,
      status: "filter"
    })
  }
  

  return <>
  {!state.isLoading && <>
    <div>
      <input type="text" placeholder="Company, Name" name="filter" value={state.filter} onChange={handleFilter} className={styles.filter}/>
  </div>
  <table className={styles.table}>
    <thead>
      <tr>
        <th>name</th>
        <th>company</th>
        <th>blog posts</th>
      </tr>
    </thead>
    <tbody>
      {
        
        !state.isLoading 
        && projection().map((item)=><tr key={item.userid}>
          <td>{item.name}</td>
          <td>{item.company}</td>
          <td><Link to={`/posts?userId=${item.userid}`}>Blog Posts</Link></td>
        </tr>
        )
      }
    </tbody>
  </table>
  </>}
  {
    state.error && <Error/>
  }
  </>
}

export default home
