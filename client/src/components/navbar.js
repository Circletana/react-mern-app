import React, { Component } from 'react';
import { Redirect } from 'react-router';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import CssBaseline from "@material-ui/core/CssBaseline/CssBaseline";
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import axios from 'axios';

class NavBar extends Component{

    state = {
        logout:false,
        redirect:false,
        anchor:null,
        username:" "
    }

    componentDidMount(){
        let token = localStorage.getItem("token");
        axios.defaults.headers.common['Authorization'] = token;
        axios.post('/api/user')
        .then(resp=>{
            console.log("navbar", resp.data);
            if(resp.data.status==="error"){
                localStorage.setItem("token","");
                this.setState({logout:true});
            }
            else{
                this.setState({ username:resp.data.data.email });
            }
        }).catch(err=>console.log(err));
    }

    logout = () =>{
        // console.log("trigger");
        localStorage.setItem("token", "");
        this.setState({logout:true});
    }

    handleMenu = event => {
        this.setState({ anchor: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchor: null });
    };
    
    render(){

        let token = localStorage.getItem("token");
        if(!token) return (<Redirect to="/" />);
        if(this.state.redirect) return (<Redirect to="/threads" />);

        return (
            <div>
            <CssBaseline/>
            <AppBar position="static">
                <Toolbar>
                    <IconButton color="inherit" aria-label="Menu">
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" color="inherit" style={{flex:1}}>
                        github.com/priyanshbalyan
                    </Typography>
                    <div>
                    
                <IconButton
                  aria-owns='menu-appbar'
                  aria-haspopup="true"
                  onClick={this.handleMenu}
                  color="inherit">
                  <span style={{fontSize:12}}>{this.state.username}</span>
                  <AccountCircle />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={this.state.anchor}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(this.state.anchor)}
                  onClose={this.handleClose}
                >
                  <MenuItem onClick={this.logout}>Logout</MenuItem>
                </Menu>
              </div>
            
                </Toolbar>
            </AppBar>
            </div>
        );
    }
}

export default NavBar;