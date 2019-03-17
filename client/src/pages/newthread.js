import React, { Component } from 'react';
import { Redirect } from 'react-router';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import NavBar from '../components/navbar';
import axios from 'axios';


class NewThread extends Component{

    state = {
        title:"",
        description:"",
        tags:"",
        error:null,
        message:null,
        redirect:false
    };

    createNewThread = () =>{
        if(this.state.title==="" || this.state.description==="" || this.state.tags==="")
            return this.setState({error:"All fields are required"});
        let token = localStorage.getItem("token");
        axios.defaults.headers.common['Authorization'] = token;
        axios.post('http://localhost:3001/api/newthread', {title:this.state.title, description:this.state.description, tags:this.state.tags})
        .then(resp=>{
            console.log(resp.data);
            if(resp.data.status==="error")
                this.setState({error:resp.data.message});
            else{
                this.setState({message:"New thread created. Redirecting..."});
            }
        }).catch(err=>console.log(err));
    }

    handleClose = () => {
        if(this.state.message)
            this.setState({redirect:true, error:null, message:null});
        this.setState({error:null, message:null});
    }

    render(){
        let token = localStorage.getItem("token");
        if(!token) return (<Redirect to="/"/>);
        if(this.state.redirect) return (<Redirect to="/threads"/> );

        return (
            <div>
                <NavBar />
                <Card style={{ marginLeft:"auto", marginRight:"auto", marginTop:20, padding:20, maxWidth:600}}>
                    <CardContent>
                    <Typography variant="h6" color="inherit">New Thread</Typography>
                    <TextField
                        id="outlined-multiline-static"
                        label="Title"
                        margin="normal"
                        fullWidth
                        variant="outlined"
                        onChange={e=>this.setState({title:e.target.value})}/>
                    <TextField
                        label="Description"
                        multiline
                        rows="4"
                        margin="normal"
                        fullWidth
                        variant="outlined"
                        onChange={e=>this.setState({description:e.target.value})}/>
                    <TextField
                        label="Tags"
                        margin="normal"
                        fullWidth
                        variant="outlined"
                        helperText="Enter tags seperated by a space"
                        onChange={e=>this.setState({tags:e.target.value})}/>

                    <br/><br/>
                    <Button variant="contained" color="primary" onClick={e=>this.createNewThread()}>Create Thread</Button>                
                    </CardContent>
                </Card>
                <Snackbar 
                    open={(this.state.error||this.state.message) ? true:false} 
                    message={this.state.error || this.state.message}
                    variant="error"
                    autoHideDuration={4000}
                    onClose={this.handleClose}/>
                
            </div>
        );
    }
}

export default NewThread;