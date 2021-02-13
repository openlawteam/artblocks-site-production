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

    let hashPairs=[];
    let decPairs=[];
    let tokenData=this.props.tokenHashes;
    console.log("tokenData:"+tokenData);
    if (this.props.projectId<3){
      //tokenData=this.props.tokenHashes;
      let numHashes = tokenData.length;
      for (let i = 0; i < numHashes; i++) {
        for (let j = 0; j < 32; j++) {
            hashPairs.push(tokenData[i].slice(2 + (j * 2), 4 + (j * 2)));
        }
      }
      decPairs = hashPairs.map(x => {
      return parseInt(x, 16);
      });
    } else {
      //tokenData = this.props.tokenHashes;
      for (let j = 0; j<32;j++){
        hashPairs.push(tokenData.slice(2+(j*2),4+(j*2)));
      }
    }
      decPairs = hashPairs.map(x=>{
      return parseInt(x,16);
    });



    let features = [];



    if (this.props.projectId==="0"){
      let steps;
      if (decPairs[28]<3){
        features.push("HyperRainbow");
      } else if (Math.floor(decPairs[26].map( 0, 255, 12, 20))===14 && Math.floor(decPairs[28].map(0,255,5,50))===11 && decPairs[22]>=32 && decPairs[31] >= 35) {
        features.push("Perfect Spectrum");
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

        } else if (!features.includes("Slinky") && !features.includes("Pipe")){
        features.push("Bold");
      }
      }
      if (decPairs[24]<30){
        if (features.includes("Bold") || features.includes("Slinky") || features.includes("Fuzzy") || features.includes("Pipe")){
        } else {
        features.push("Ribbed [Color: "+decPairs[25]+"]");
      }
      }
      if (decPairs[22]>=32 && decPairs[31] >= 35){
        steps=200;
      }

      let startingColor=decPairs[29];
      let endingColor=decPairs[28] < 3?(decPairs[29]+((Math.floor(decPairs[26].map( 0, 255, 12, 20))*steps))/0.5)%255:Math.floor((decPairs[29]+((Math.floor(decPairs[26].map( 0, 255, 12, 20))*steps))/Math.floor(decPairs[28].map(0,255,5,50)))%255);
      let difference = function (a, b) { return Math.abs(startingColor - endingColor); };
      if (difference()<3 || difference()>252){
        if (!features.includes("Perfect Spectrum") && !features.includes("Fuzzy")){
          features.splice(0,0,"Full Spectrum");
        }
      };

      features.push("Starting Color: "+decPairs[29]);
      if (decPairs[28] < 3){
        features.push("End Color: "+(decPairs[29]+((Math.floor(decPairs[26].map( 0, 255, 12, 20))*steps))/0.5)%255);
        features.push("Color Spread: 0.5");
      } else {
        features.push("End Color: "+Math.floor((decPairs[29]+((Math.floor(decPairs[26].map( 0, 255, 12, 20))*steps))/Math.floor(decPairs[28].map(0,255,5,50)))%255));
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

    } else if (this.props.projectId==="6"){

    }


    return(
      <div>
      {features.length>0 &&
      <Alert variant="info">
      <p>Features</p>
      <Container>
      {features.map((feature,index)=>{
        return(
        <Row key={index} >
        <p style={{"fontSize":"12px", "lineHeight": "1px"}} key={index}>{feature}</p>
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
