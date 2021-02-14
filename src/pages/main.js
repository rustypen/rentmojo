import React from 'react'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Header from '../components/header/header';
import Home from './home';
import Posts from './posts';
import Post from './post';

function main() {
  return (<>
    <Header/>
    <main>
      <Router>
        {/* <Header/> */}
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/posts" component={Posts} />
          <Route path="/post/:postId" component={Post} />
        </Switch>
      </Router>
    </main>

  </>)
}

export default main