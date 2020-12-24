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
        if (features.includes("Bold") || features.includes("Slinky") || features.includes("Fuzzy")){
        } else {
        features.push("Ribbed [Color: "+decPairs[25]+"]");
      }
      }
      if (decPairs[22]>=32 && decPairs[31] >= 35){
        steps=200;
      }
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

    } else if (this.props.projectId==="3"){
      console.log("in script"+tokenData)

      let seedA = parseInt(tokenData.slice(0, 16), 16);
      console.log("seedA: "+seedA);
      let blotcolorname = [];

      let colfreqs = [40, 80, 100, 10, 3, 100, 100, 80, 3, 40, 10, 100, 40, 10, 100, 80, 3, 100, 100, 10, 3, 40, 100, 80, 100, 10, 80, 40, 100, 3, 40, 3, 100, 100, 80, 10, 28, 3, 80, 100, 100, 40];
      let colnames = ["White", "Silver Gray", "Spanish Gray", "Gunmetal Gray", "Stone Gray", "Marengo Gray", "Argentinian Blue", "Savoy Blue", "Egyptian Blue", "Bleu de France", "Delft Blue", "Moroccan Blue", "Avocado Green", "Forest Green", "Mantis Green", "Shamrock Green", "Tea Green", "Emerald Green", "Cardinal Red", "Carmine Red", "Crimson Red", "Salmon Red", "Lust Red", "Spanish Red", "Tyrian Purple", "Royal Purple", "Orchid Purple", "Mardis Gras Purple", "Palatinate Purple", "Thistle Purple", "Cream Yellow", "Xanthic Yellow", "Canary Yellow", "Golden Yellow", "Hunyadi Yellow", "Process Yellow", "Beaver Brown", "Beige Brown", "Chestnut Brown", "Chocolate Brown", "Dark Brown", "Khaki Brown"];

      let numblobs = 1;
      let randnum = Math.floor((rnd().map(0,1,0,1000))); //int(map(rnd(), 0, 1, 0, 1000));
      console.log("randnum"+randnum);
      if (randnum < 300) {
        numblobs = 2;
        if (randnum < 50) {
        numblobs = 3;
        }
      }

      features.push(GetBlotTypeFromNumblots(numblobs));
      for (let i = 0; i < numblobs; i++) {
        getFillColor();
        features.push("Color: "+blotcolorname[i]);
      }

      function getFillColor() {
        let whichArray =[];
        let which = Math.floor((rnd().map(0,1,0,colnames.length))); //int(map(rnd(), 0, 1, 0, colnames.length));
        //whichArray.push(which);
        let threshold = rnd().map(0,1,0,100); //map(rnd(), 0, 1, 0, 100);

        while (threshold > colfreqs[which]) {
            which = Math.floor((rnd().map(0,1,0,colnames.length))); //int(map(rnd(), 0, 1, 0, colnames.length));
            whichArray.push(which);
          }
          blotcolorname.push(colnames[which]);
          console.log("WhichArray: "+whichArray);
        }

        function GetBlotTypeFromNumblots(numblots) {
          if (numblots === 3) {
            return "Ternary Cryptoblot";
          }
          if (numblots === 2) {
            return "Binary Cryptoblot";
          }
          if (numblots === 1) {
            return "Unary Cryptoblot";
          }
        }

        function rnd() {
          seedA ^= seedA << 13;
          seedA ^= seedA >> 17;
          seedA ^= seedA << 5;

          return (((seedA < 0) ? ~seedA + 1 : seedA) % 1000) / 1000;
        }

    } else if (this.props.projectId==="4"){


      let hashPairs = [];
      for (let j = 0; j < 32; j++) {
        hashPairs.push(tokenData.slice(2 + (j * 2), 4 + (j * 2)));
      }
      let rvs = hashPairs.map(x => {
        return parseInt(x, 16) % 20;
      });

      let palette_choices = ["Moonrise",
      "Budapest",
      "Rushmore",
      "Invaders",
      "Jade Theory",
      "Frost",
      "Purple Rain",
      "Kingdom"
      ];

      let rv0 = rvs[0];

    let rv2 = rvs[2];
    let rv3 = rvs[3];
    let rv4 = rvs[4];
    let rv5 = rvs[5];
    let rv6 = rvs[6];

    let cp_r = rnd_outcome(rv0, [19, 18, 17, 16, 14, 12, 8], [7, 6, 5, 4, 3, 2, 1], 0);
    var pie_count = rnd_outcome(rv2, [19, 18, 17, 16, 14, 12], [4, 5, 6, 8, 14, 12], 10);
    var stk_color = rnd_outcome(rv3, [10], ["Silver"], "Midnight");
    var pie_number = rnd_outcome(rv4, [10], [2], 1);
    var palette = palette_choices[cp_r]

    if (rv5 === 19) {
      if (rv6 === 19) {
        stk_color = "Lime"
        palette = "Cyber"
      }
    }
    if (rv5 === 18) {
      if (rv6 === 18) {
        stk_color = "Silver"
        palette = "Cloud Nine"
      }
    }

    features = ["Palette: " + palette,
              "Count: " + String(pie_count-1),
              "Slices: " + (pie_number === 2 ? "Multi" : "Single"),
              "Stroke: " + stk_color]

    function rnd_outcome(input, values, outcome, fallback) {
      var zip = (a,b) => a.map((x,i) => [x,b[i]]);
      for (let [a, b] of zip(values, outcome))
        if (input >= a) {
          return b;
        }
        return fallback;
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
