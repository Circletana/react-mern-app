import React, { Component} from 'react';
import Axios from 'axios';

class Upload extends Component{

    onChange = e => {
        let formdata = new FormData();
        const files = Array.from(e.target.files);
        files.forEach((file, i) => formdata.append(i, file));
        Axios.post('/api/upload', formdata, { headers: {'Content-Type':'multipart/form-data'} })
        .then(res=>console.log(res))
        .catch(err=>console.log(err));

    }

    render(){
        return (<input type="file" onChange={this.onChange}/>);
    }
}

export default Upload;