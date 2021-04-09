import React, { Component} from 'react'
import {Container, Figure} from 'react-bootstrap';

class Sustainability extends Component {

  render(){

    return(
      <div className="container mt-5">
      <h1 className="text-center"><b>Community + Sustainability</b></h1>

      <hr />
      <Container>
      <div className="text-center">
      <Figure>
        <Figure.Image
          width={250}
          alt="CryptoClimate #50"
          src={"https://lh3.googleusercontent.com/Pb95y9FbyRaibJ2qvm3AhiQ83xTDr98EGsJ6kGNZrSdLQ0EXZFRYS_5lwRhrL6_2q9D-Wo9WNE641LlUUHMlgld4loz5PQmrVfo2=s0"}
        />
        <Figure.Caption>
          <a href="https://opensea.io/assets/0x495f947276749ce646f68ac8c248420045cb7b5e/20973156443705115113792982080402275335274697976325416737038491024614655787009">Squig Valley by Higher Design Co</a>
        </Figure.Caption>
      </Figure>
      </div>
      <h5>ELI5</h5>
      <h6>Blockchains make a platform like Art Blocks possible, but at the same time the tech is responsible for significant world wide energy consumption. Art Blocks is building a portfolio of sustainability and community initiatives in order to contribute in a positive way to our world. While purchasing carbon offset credits may not be a <b>solution</b>, we believe that by incorporating human friendly initiatives into the core culture of our project early on we can potentially set a precedent as this vibrant NFT ecosystem expands. Anything less is frankly a missed opportunity and we intend to lead by example.</h6>
      <br/>
      <hr/>
      <h5>Energy</h5>
      <p>There is a lot of controversy around the energy consumption of NFTs. While there is absolutely zero doubt that blockchain technology is a massive energy consumer around the globe, the energy consumption as a direct result of the NFT ecosystem is not fully understood. Yes, you can examine energy consumption per transaction on the Ethereum blockchain and estimate the direct energy cost of minting a new NFT. However NFTs are not (yet) a major source of overall transaction volume on the Ethereum blockchain and Ethereum blocks will be mined regardless of the existence of NFTs.</p>
      <p>However, it is important to note that this is only the beginning of the NFT movement, and if NFTs were to be adopted more widely, that percentage of the activity on the Ethereum blockchain <i>would increase</i> along with the wider adoption. So while our little nerdy NFT world might not be directly responsible for a villainous amount of energy consumption at this very moment, platforms need to begin participating in ecological initiatives <b>NOW</b> to ingrain sustainability practices into their company culture and actually contribute in a positive way as our ecosystem expands.</p>
      <p>Everyone participating in the Ethereum network is excited for and patiently waiting for the launch of ETH2.0, an upgraded version of Ethereum that operates purely on a "Proof of Stake" model. This model is significantly more energy efficient and will make operating on the newtwork an overall more positive experience for all. The problem is that this transition could be 1-2 years away. Art Blocks has started building a portfolio of carbon offset initiatives that will allow is to help lessen the negative impacts our technology is having on our planet now, but our intention is to make it part of our culture and continue to regularly retire carbon credits even after Ethereum transitions to a purely proof of stake validation model.</p>
      <p>As of March 26th, 2021 Art Blocks has retired a total of 7,000 tons of carbon offset credits and will continue to retire more as the platform grows. While credits can vary dramatically in price and type, we are committed to purchasing and retiring credits for projects located all over the world in an effort to maximize the overall impact we, as a platform, are having on the environment.</p>
      <p>Below are certificates that represent our contributions to date:</p>
      <ul>
      <li>
      <a href="/Certificate of Retirement _ Sistema Biogas_Art Blocks.pdf" rel="noopener noreferrer" target="_blank">Sistema Biogas</a>
      </li>
      <li>
      <a href="/Certificate of Retirement_Grouped Small Hyrdo_Art Blocks.pdf" rel="noopener noreferrer" target="_blank">Grouped Small Hydro</a>
      </li>
      <li>
      <a href="/Certificate_Guyuan_Wuhuaping_Art Blocks.pdf" rel="noopener noreferrer" target="_blank">Guyuan Wuhuaping Wind Power Project</a>
      </li>
      </ul>
      <br/>
      <hr/>
      <h5>Community</h5>
      <p>There is simply too much money flowing throught the NFT space to ignore opportunities to help our communities. So far Art Blocks has contributed over $25,000 to our creative coding community. As we grow as a platform we intend to grow our community outreach and support as well and like our sustainability initiatives want to incorporate charitable giving and foundational support into our corporate culture.</p>
      <p>Not only will Art Blocks be providing financial support to organizations at the platform level, but we encourage artists to share some of their success with local charities and organizations as well.</p>
      <br/>
      <hr/>

      <h5>More Info</h5>
      <p>Look for badges denoting projects and artists that are making positive contributions to our world in the future! By participating in those projects you will also indirectly be making an impact as well.</p>
      <p>For more information please reach out to us at info at artblocks dot io or join the conversation in <a href="https://discord.gg/VGX9fyhWBn" rel="noopener noreferrer" target="_blank">Discord</a>.</p>





      </Container>
      </div>
    )

  }
}

export default Sustainability;
