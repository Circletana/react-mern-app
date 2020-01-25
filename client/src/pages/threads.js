import React, { Component } from 'react';
import { Redirect } from 'react-router';
import Typography from '@material-ui/core/Typography';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';
import AddIcon from '@material-ui/icons/Add';
import axios from 'axios';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import NavBar from '../components/navbar';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Chip from '@material-ui/core/Chip';
import moment from 'moment';

class Threads extends Component{
    
    state = {
        threads:[],
        search:""
    };

    createThread = () => {

    }

    componentDidMount(){
        this.getThreads();
    }

    handleSearch = (e)=>{
        this.setState({search:e.target.value});
        axios.post('/api/loadthreads?search='+e.target.value)
        .then(resp=>{
            this.setState({threads:resp.data.data});
        }).catch(err=>console.log(err));
    }

    getThreads = () =>{
        let token = localStorage.getItem("token");
        axios.defaults.headers.common['Authorization'] = token;
        axios.post('/api/loadthreads')
        .then(resp=>{
            //console.log(resp.data);
            if(resp.data.status === "error")
                console.log(resp.data.message);
            else
                this.setState({threads:resp.data.data});
            
        }).catch(err=>console.log(err));
    }

    render(){
        let token = localStorage.getItem("token");
        if(!token) return (<Redirect to="/" />);
        if(this.state.redirect) return (<Redirect to="/newthread" />);
        return (
            <div>
                <NavBar />

                <div style={{marginLeft:"auto", marginRight:"auto", padding:20, maxWidth:800}}>
                <Grid container spacing={16} style={{padding:20}}>
                    <Grid item xs={9}><Typography variant="h5" color="inherit" style={{marginTop:35}}>Threads</Typography></Grid>
                    <Grid item xs={3}><TextField
                        id="standard-name"
                        fullWidth
                        label="Search"
                        value={this.state.search}
                        onChange={this.handleSearch}
                        margin="normal"/>
                    </Grid>
                </Grid>
                <Divider variant="middle"/>
                
                <Typography variant="h6" color="textSecondary" style={{flex:1, paddingLeft:20}}>
                    {this.state.threads.length===0 ? "No threads": ""}
                </Typography>
                {this.state.threads.map(function(n){
                    return (
                        <Card key={n._id} style={{margin:1}}>
                            <CardContent>
                            <Typography color="textSecondary" gutterBottom>{n.title}</Typography>
                            <Typography variant="h5" component="h2">{n.description}</Typography>
                            <Grid container>
                                <Grid item xs={10}>{n.tags.map(function(t){ return <Chip style={{marginTop:5, marginRight:5}} label={t}/> })}</Grid>
                                <Grid item xs={2}>
                                    <Typography color="textSecondary" style={{fontSize:13}}>{n.user.email.split("@")[0]}<br/>{moment(n.createdAt).format('MMM Do YY')}</Typography>
                                </Grid>
                            </Grid>
                            </CardContent>

                        </Card>
                    );
                })}

                </div>
                <Tooltip title="Create Thread" aria-label="Create Thread">
                    <Fab onClick={()=>this.setState({redirect:true})} color="secondary" style={{position:'absolute', bottom:20, right:20}}>
                        <AddIcon />
                    </Fab>
                </Tooltip>
            </div>
        );
    }
}

export default Threads;