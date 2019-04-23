import React from 'react';
import Particles from 'react-particles-js';

class ParticleComponent extends React.Component{
    render(){
        return(
            <div style={{backgroundColor:"#173f5f", position:"absolute", top:0, left:0, width:"100%", height:"100%"}}>
            <Particles
                params={{
                    "particles": {
                        "number": {
                            "value": 50
                        },
                        "size": {
                            "value": 3
                        }
                    },
                    "interactivity": {
                        "events": {
                            "onhover": {
                                "enable": true,
                                "mode": "repulse"
                            }
                        }
                    }
                }}
            />
            </div>
        )
    }
}

export default ParticleComponent;