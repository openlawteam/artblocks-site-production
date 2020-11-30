import React, { Component} from 'react'
import {Row,Container,Alert} from 'react-bootstrap';

class Features extends Component {

  render(){
    console.log("featurepage: "+this.props.projectId);
    console.log("hash string: "+this.props.tokenHashes);
    // eslint-disable-next-line no-extend-native
    Number.prototype.map = function (in_min, in_max, out_min, out_max) {
      return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
    }

    let tokenData=this.props.tokenHashes;
    let numHashes = tokenData.length;
    let hashPairs = [];
    for (let i = 0; i < numHashes; i++) {
        for (let j = 0; j < 32; j++) {
            hashPairs.push(tokenData[i].slice(2 + (j * 2), 4 + (j * 2)));
        }
    }
    let decPairs = hashPairs.map(x => {
        return parseInt(x, 16);
    });

    let features = [];
    let steps;


    if (this.props.projectId==="0"){
      if (decPairs[28]<3){
        features.push("HyperRainbow");
      }

      if (decPairs[22]<32 && decPairs[31] < 35){
        features.push("Pipe");
        steps=50;
      } else if (decPairs[31] < 35){
        features.push("Slinky");
        steps=50;
      }
      if (decPairs[22]<32 && decPairs[31] >= 35){
        features.push("Fuzzy");
        steps=1000;
      }
      if (decPairs[23]<15){
        if (features.includes("Fuzzy")){

        } else {
        features.push("Bold");
      }
      }
      if (decPairs[24]<30){
        if (features.includes("Bold") || features.includes("Slinky")){
        } else {
        features.push("Ribbed [Color: "+decPairs[25]+"]");
      }
      }


      if (decPairs[22]>=32 && decPairs[31] >= 35){
        steps=200;
      }
      features.push("Starting Color: "+decPairs[29]);
      if (decPairs[28] < 3){
        features.push("Color Spread: 0.5");
      } else {
        features.push("Color Spread: "+Math.floor(decPairs[28].map(0,255,5,50)));
      }

      if (decPairs[30] < 128){
        features.push("Color Direction: Reverse");
      } else {
        features.push("Color Direction: Forward");
      }

      features.push("Height: "+Math.floor(decPairs[27].map(0, 255, 3, 4)));
      features.push("Segments: "+Math.floor(decPairs[26].map( 0, 255, 12, 20)));
      features.push("Steps Between Segments: "+steps);

    } else if (this.props.projectId==="1"){

    } else if (this.props.projectId==="2"){
      let pair = this.props.tokenHashes[0].slice(5,7);
      let dec = parseInt(pair,16);
      console.log("pair:"+pair);
      console.log("dec:" +dec);

      //console.log(decPairs[6]);
      if (dec>252){
        features.push("Complementary Variant");
      } else if (dec>239){
        features.push("Dark Variant");
      } else if (dec>226){
        features.push("Light Variant");
      } else  {
        features.push("Standard Variant");
      }

    }

    return(
      <div>
      {features.length>0 &&
      <Alert variant="info">
      <p>Features</p>
      <Container>
      {features.map((feature,index)=>{
        return(
        <Row>
        <p style={{"fontSize":"12px", "line-height": "1px"}} key={index}>{feature}</p>
        </Row>
      )
      })}
      </Container>
      </Alert>
    }
</div>

    )

  }
}

export default Features;
