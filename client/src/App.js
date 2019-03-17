import React, { Component } from 'react';
import Login from './pages/login';
import Threads from './pages/threads';
import NewThread from './pages/newthread';
import {BrowserRouter, Route} from 'react-router-dom';
class App extends Component {

    render(){

        return (
            <BrowserRouter>
                <div>
                <Route exact={true} path="/" render={()=>(
                    <Login />
                )}/>
                <Route exact={true} path="/threads" render={()=>(
                    <Threads />
                )}/>
                <Route exact={true} path="/newthread" render={()=>(
                    <NewThread />
                )}/>
                </div>
            </BrowserRouter>
        );
    }
}

export default App;