import * as React from "react";
import { Button, Col, Form, Tabs, Tab } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { BASE_URL } from "./config";

const ArtistInterface = ({
  project,
  account,
  isWhitelisted,
  artBlocks,
  web3,
  scriptJSON,
  projectTokenDetails,
  projectScriptDetails,
  projectURIInfo,
  projectRoyaltyInfo,
  currency,
  currencyAddress,
  onJSONChange,
  onValuesUpdated,
}) => {
  const [formValue, setFormValue] = React.useState("");
  const [idValue, setIdValue] = React.useState("");
  // eslint-disable-next-line
  const [interaction, setInteraction] = React.useState(true);

  const history = useHistory();

  function handleValueChange(event) {
    setFormValue(event.target.value);
  }

  function handleIdChange(event) {
    setIdValue(event.target.value);
  }

  async function handleChange(e, type) {
    e.preventDefault();
    setInteraction(true);

    if (type === "price") {
      await artBlocks.methods
        .updateProjectPricePerTokenInWei(
          project,
          web3.utils.toWei(formValue, "ether")
        )
        .send({
          from: account,
        })
        .once("receipt", (receipt) => {
          console.log(receipt);
          onValuesUpdated();
        })
        .catch((err) => {
          //alert(err);
          setInteraction(false);
        });
    } else if (type === "projectName") {
      await artBlocks.methods
        .updateProjectName(project, formValue)
        .send({
          from: account,
        })
        .once("receipt", (receipt) => {
          console.log(receipt);
          onValuesUpdated();
        })
        .catch((err) => {
          //alert(err);
          setInteraction(false);
        });
    } else if (type === "artistName") {
      await artBlocks.methods
        .updateProjectArtistName(project, formValue)
        .send({
          from: account,
        })
        .once("receipt", (receipt) => {
          console.log(receipt);
          onValuesUpdated();
        })
        .catch((err) => {
          //alert(err);
          setInteraction(false);
        });
    } else if (type === "website") {
      await artBlocks.methods
        .updateProjectWebsite(project, formValue)
        .send({
          from: account,
        })
        .once("receipt", (receipt) => {
          console.log(receipt);
          onValuesUpdated();
        })
        .catch((err) => {
          //alert(err);
          setInteraction(false);
        });
    } else if (type === "description") {
      await artBlocks.methods
        .updateProjectDescription(project, formValue)
        .send({
          from: account,
        })
        .once("receipt", (receipt) => {
          console.log(receipt);
          onValuesUpdated();
        })
        .catch((err) => {
          //alert(err);
          setInteraction(false);
        });
    } else if (type === "license") {
      await artBlocks.methods
        .updateProjectLicense(project, formValue)
        .send({
          from: account,
        })
        .once("receipt", (receipt) => {
          console.log(receipt);
          onValuesUpdated();
        })
        .catch((err) => {
          //alert(err);
          setInteraction(false);
        });
    } else if (type === "maxInvocations") {
      await artBlocks.methods
        .updateProjectMaxInvocations(project, formValue)
        .send({
          from: account,
        })
        .once("receipt", (receipt) => {
          console.log(receipt);
          onValuesUpdated();
        })
        .catch((err) => {
          //alert(err);
          setInteraction(false);
        });
    } else if (type === "addScript") {
      await artBlocks.methods
        .addProjectScript(project, formValue)
        .send({
          from: account,
        })
        .once("receipt", (receipt) => {
          console.log(receipt);
          onValuesUpdated();
        })
        .catch((err) => {
          //alert(err);
          setInteraction(false);
        });
    } else if (type === "removeLastScript") {
      await artBlocks.methods
        .removeProjectLastScript(project)
        .send({
          from: account,
        })
        .once("receipt", (receipt) => {
          console.log(receipt);
          onValuesUpdated();
        })
        .catch((err) => {
          //alert(err);
          setInteraction(false);
        });
    } else if (type === "updateScript") {
      //alert(project, idValue, formValue);
      await artBlocks.methods
        .updateProjectScript(project, idValue, formValue)
        .send({
          from: account,
        })
        .once("receipt", (receipt) => {
          console.log(receipt);
          onValuesUpdated();
        })
        .catch((err) => {
          //alert(err);
          setInteraction(false);
        });
    } else if (type === "updateArtistAddress") {
      //alert(project, idValue, formValue);
      await artBlocks.methods
        .updateProjectArtistAddress(project, formValue)
        .send({
          from: account,
        })
        .once("receipt", (receipt) => {
          console.log(receipt);
          onValuesUpdated();
          //this.setState({loadQueue:project*1000000});
          history.goBack();
        })
        .catch((err) => {
          //alert(err);
          setInteraction(false);
        });
    } else if (type === "hashesPerToken") {
      //alert(project, idValue, formValue);
      await artBlocks.methods
        .toggleProjectUseHashString(project)
        .send({
          from: account,
        })
        .once("receipt", (receipt) => {
          console.log(receipt);
          onValuesUpdated();
          //this.setState({loadQueue:project*1000000});
        })
        .catch((err) => {
          //alert(err);
          setInteraction(false);
        });
    } else if (type === "updateAdditionalPayee") {
      //alert(project, idValue, formValue);
      await artBlocks.methods
        .updateProjectAdditionalPayee(project, formValue)
        .send({
          from: account,
        })
        .once("receipt", (receipt) => {
          console.log(receipt);
          onValuesUpdated();
          //this.setState({loadQueue:project*1000000});
        })
        .catch((err) => {
          //alert(err);
          setInteraction(false);
        });
    } else if (type === "updateAdditionalPayeePercentage") {
      //alert(project, idValue, formValue);
      await artBlocks.methods
        .updateProjectAdditionalPayeePercentage(project, formValue)
        .send({
          from: account,
        })
        .once("receipt", (receipt) => {
          console.log(receipt);
          onValuesUpdated();
          //this.setState({loadQueue:project*1000000});
        })
        .catch((err) => {
          //alert(err);
          setInteraction(false);
        });
    } else if (type === "updateSecondaryMarketRoyaltyPercentage") {
      //alert(project, idValue, formValue);
      await artBlocks.methods
        .updateProjectSecondaryMarketRoyaltyPercentage(project, formValue)
        .send({
          from: account,
        })
        .once("receipt", (receipt) => {
          console.log(receipt);
          onValuesUpdated();
          //this.setState({loadQueue:project*1000000});
        })
        .catch((err) => {
          //alert(err);
          setInteraction(false);
        });
    } else if (type === "scriptJSON") {
      //alert(project, idValue, formValue);
      await artBlocks.methods
        .updateProjectScriptJSON(project, JSON.stringify(scriptJSON))
        .send({
          from: account,
        })
        .once("receipt", (receipt) => {
          console.log(receipt);
          onValuesUpdated();
          //this.setState({loadQueue:project*1000000});
        })
        .catch((err) => {
          //alert(err);
          setInteraction(false);
        });
    } else if (type === "updateProjectIpfsHash") {
      //alert(project, idValue, formValue);
      await artBlocks.methods
        .updateProjectIpfsHash(project, formValue)
        .send({
          from: account,
        })
        .once("receipt", (receipt) => {
          console.log(receipt);
          onValuesUpdated();
          //this.setState({loadQueue:project*1000000});
        })
        .catch((err) => {
          //alert(err);
          setInteraction(false);
        });
    } else if (type === "updateProjectBaseURI") {
      //alert(project, idValue, formValue);
      await artBlocks.methods
        .updateProjectBaseURI(project, formValue)
        .send({
          from: account,
        })
        .once("receipt", (receipt) => {
          console.log(receipt);
          onValuesUpdated();
          //this.setState({loadQueue:project*1000000});
        })
        .catch((err) => {
          //alert(err);
          setInteraction(false);
        });
    } else if (type === "updateProjectBaseIpfsURI") {
      //alert(project, idValue, formValue);
      await artBlocks.methods
        .updateProjectBaseIpfsURI(project, formValue)
        .send({
          from: account,
        })
        .once("receipt", (receipt) => {
          console.log(receipt);
          onValuesUpdated();
          //this.setState({loadQueue:project*1000000});
        })
        .catch((err) => {
          //alert(err);
          setInteraction(false);
        });
    } else if (type === "updateProjectCurrencyInfo") {
      //alert(project, idValue, formValue);
      let address =
        formValue === ""
          ? "0x0000000000000000000000000000000000000000"
          : formValue;
      console.log("formValue:" + address);
      await artBlocks.methods
        .updateProjectCurrencyInfo(project, idValue, address)
        .send({
          from: account,
        })
        .once("receipt", (receipt) => {
          console.log(receipt);
          onValuesUpdated();
          //this.setState({loadQueue:project*1000000});
        })
        .catch((err) => {
          //alert(err);
          setInteraction(false);
        });
    } else if (type === "overrideTokenDynamicImageWithIpfsLink") {
      //alert(project, idValue, formValue);
      await artBlocks.methods
        .overrideTokenDynamicImageWithIpfsLink(idValue, formValue)
        .send({
          from: account,
        })
        .once("receipt", (receipt) => {
          console.log(receipt);
          onValuesUpdated();
          //this.setState({loadQueue:project*1000000});
        })
        .catch((err) => {
          //alert(err);
          setInteraction(false);
        });
    } else if (type === "clearTokenIpfsImageUri") {
      //alert(project, idValue, formValue);
      await artBlocks.methods
        .clearTokenIpfsImageUri(idValue)
        .send({
          from: account,
        })
        .once("receipt", (receipt) => {
          console.log(receipt);
          onValuesUpdated();
          //this.setState({loadQueue:project*1000000});
        })
        .catch((err) => {
          //alert(err);
          setInteraction(false);
        });
    } else if (type === "useIpfsForStatic") {
      await artBlocks.methods
        .toggleProjectUseIpfsForStatic(project)
        .send({
          from: account,
        })
        .once("receipt", (receipt) => {
          console.log(receipt);
          onValuesUpdated();
        })
        .catch((err) => {
          //alert(err);
          setInteraction(false);
        });
    } else if (type === "isDynamic") {
      await artBlocks.methods
        .toggleProjectIsDynamic(project)
        .send({
          from: account,
        })
        .once("receipt", (receipt) => {
          console.log(receipt);
          onValuesUpdated();
        })
        .catch((err) => {
          //alert(err);
          setInteraction(false);
        });
    } else if (type === "toggleActive") {
      alert(project);
      await artBlocks.methods
        .toggleProjectIsActive(project)
        .send({
          from: account,
        })
        .once("receipt", (receipt) => {
          console.log(receipt);
          onValuesUpdated();
        })
        .catch((err) => {
          //alert(err);
          setInteraction(false);
        });
    } else if (type === "togglePaused") {
      await artBlocks.methods
        .toggleProjectIsPaused(project)
        .send({
          from: account,
        })
        .once("receipt", (receipt) => {
          console.log(receipt);
          onValuesUpdated();
        })
        .catch((err) => {
          //alert(err);
          setInteraction(false);
        });
    } else if (type === "toggleLocked") {
      await artBlocks.methods
        .toggleProjectIsLocked(project)
        .send({
          from: account,
        })
        .once("receipt", (receipt) => {
          console.log(receipt);
          onValuesUpdated();
        })
        .catch((err) => {
          //alert(err);
          setInteraction(false);
        });
    } else if (type === "updatePayeeInfo") {
      //alert(project, idValue, formValue);
      await artBlocks.methods
        .updateProjectAdditionalPayeeInfo(project, formValue, idValue)
        .send({
          from: account,
        })
        .once("receipt", (receipt) => {
          console.log(receipt);
          onValuesUpdated();
        })
        .catch((err) => {
          //alert(err);
          setInteraction(false);
        });
    }
  }

  let scriptCount = projectScriptDetails && projectScriptDetails[1];

  function returnScriptIds() {
    let scripts = [];
    for (let i = 0; i < scriptCount; i++) {
      scripts.push(<option key={i}>{i}</option>);
    }
    return scripts;
  }

  // artistAddress

  return (
    <Col>
      <h3>Artist Dashboard</h3>
      <h5>Artist Address: {projectTokenDetails && projectTokenDetails[0]}</h5>
      <p>
        Below you can control your project's representation on the blockchain.{" "}
        <b>Only adjust settings that you are comfortable with. </b>
      </p>
      <p>
        Please be mindful of <i>which</i> fields that are modifable after a
        project is locked. Some are and some are not. Once a project is locked
        it is frozen permanently/immutably so choose wisely.
      </p>

      <Tabs defaultActiveKey="project" id="uncontrolled-tab-example">
        <Tab eventKey="project" title="Project">
          <div>
            <br />
            <Form onSubmit={(e) => handleChange(e, "projectName")}>
              <Form.Group>
                <Form.Label>
                  <b>Update Project Name</b>
                </Form.Label>
                <Form.Control
                  onChange={handleValueChange}
                  type="text"
                  placeholder="Enter Name"
                />
                <Form.Text className="text-muted">
                  This <b>cannot</b> be changed once project is locked.
                </Form.Text>
              </Form.Group>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
            <br />
          </div>

          <div>
            <Form onSubmit={(e) => handleChange(e, "artistName")}>
              <Form.Group>
                <Form.Label>
                  <b>Update Artist Name</b>
                </Form.Label>
                <Form.Control
                  onChange={handleValueChange}
                  type="text"
                  placeholder="Enter Name"
                />
                <Form.Text className="text-muted">
                  This <b>cannot</b> be changed once project is locked.
                </Form.Text>
              </Form.Group>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
            <br />
          </div>

          <div>
            <Form onSubmit={(e) => handleChange(e, "website")}>
              <Form.Group>
                <Form.Label>
                  <b>Update Project Website</b>
                </Form.Label>
                <Form.Control
                  onChange={handleValueChange}
                  type="url"
                  placeholder="Enter your website here. Can be Instagram or Twitter link too."
                />
                <Form.Text className="text-muted">
                  This can be modified after a project is locked.
                </Form.Text>
              </Form.Group>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
            <br />
          </div>

          <div>
            <Form onSubmit={(e) => handleChange(e, "description")}>
              <Form.Group>
                <Form.Label>
                  <b>Update Project Description</b>
                </Form.Label>
                <Form.Control
                  onChange={handleValueChange}
                  as="textarea"
                  rows={3}
                  type="text"
                  placeholder="Enter your project description here. Include any details you would like for people to see about the project."
                />
                <Form.Text className="text-muted">
                  This can be modified after a project is locked.
                </Form.Text>
              </Form.Group>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
            <br />
          </div>

          <div>
            <Form onSubmit={(e) => handleChange(e, "license")}>
              <Form.Group>
                <Form.Label>
                  <b>Update License</b>
                </Form.Label>
                <Form.Control
                  onChange={handleValueChange}
                  type="text"
                  placeholder="Please specify a license for your content. Example: NIFTY License"
                />
                <Form.Text className="text-muted">
                  This <b>cannot</b> be changed once project is locked.
                </Form.Text>
              </Form.Group>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
            <br />
          </div>
        </Tab>
        <Tab eventKey="token" title="Token">
          <div>
            <br />
            <Form onSubmit={(e) => handleChange(e, "price")}>
              <Form.Group>
                <Form.Label>
                  <b>Update Price per Token</b>
                </Form.Label>
                <Form.Control
                  onChange={handleValueChange}
                  type="number"
                  min="0"
                  step="any"
                  placeholder={`Price for each purchase in ${currency}.`}
                />
                <Form.Text className="text-muted">
                  This can be modified after a project is locked.
                </Form.Text>
              </Form.Group>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
            <br />
          </div>

          <div>
            {project >= 3 && (
              <Form
                onSubmit={(e) => handleChange(e, "updateProjectCurrencyInfo")}
              >
                <Form.Group>
                  <Form.Label>
                    <b>Update Currency Information</b>
                  </Form.Label>
                  <br />

                  <Form.Label>
                    Current Currency: {currency && currency}
                  </Form.Label>
                  <br />
                  <Form.Label>
                    Current Currency Address: {currencyAddress}
                  </Form.Label>
                  <br />

                  <Form.Label>Currency Symbol:</Form.Label>
                  <Form.Control
                    onChange={handleIdChange}
                    type="text"
                    placeholder="Specify the symbol for the currency you are using. ETH, DAI, etc."
                  ></Form.Control>
                  <Form.Label>Currency Address:</Form.Label>
                  <Form.Control
                    onChange={handleValueChange}
                    type="text"
                    placeholder="Specify the ERC20 Contract Address for selected currency. If ETH leave blank."
                  ></Form.Control>

                  <Form.Text className="text-muted">
                    The above values <b>can</b> be changed once project is
                    locked. Both of these fields are updated in the same
                    function call so make sure you fill both in (or just the
                    currency field if you're setting the currency to ETH.)
                  </Form.Text>
                </Form.Group>

                <Button variant="primary" type="submit">
                  Submit
                </Button>
              </Form>
            )}
          </div>
          <br />
          <div>
            <Form onSubmit={(e) => handleChange(e, "maxInvocations")}>
              <Form.Group>
                <Form.Label>
                  <b>Update Maximum Invocations</b>
                </Form.Label>
                <Form.Control
                  onChange={handleValueChange}
                  type="number"
                  placeholder="The maximum number of iterations that can be purchased. Must be less than 1,000,000."
                />
                <Form.Text className="text-muted">
                  This <b>cannot</b> be changed once project is locked.
                </Form.Text>
              </Form.Group>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
            <br />
          </div>
        </Tab>
        <Tab eventKey="scripts" title="Scripts">
          <div>
            <br />
            <Form onSubmit={(e) => handleChange(e, "scriptJSON")}>
              <Form.Group>
                <Form.Label>
                  <b>Update Script JSON</b>
                </Form.Label>
                <br />
                <Form.Label>
                  The Script JSON provides information for the server to parse
                  the script correctly. It is stored in the contract as a single
                  string. This means you cannot update items individaully. The
                  boxes below are pre-populated with the values currently set
                  for the JSON. If you want to make an update, only modify the
                  boxes you want to change and click "sumbit". Anything left
                  blank will stay blank, any data you don't modify will remain
                  "as is" in the updated script.
                </Form.Label>
                <br />
                <Form.Label>
                  Current JSON:{" "}
                  {projectScriptDetails && projectScriptDetails[0]}
                </Form.Label>
                <br />
                <Form.Label>Script Type:</Form.Label>
                <Form.Control
                  onChange={(e) => onJSONChange(e, "type")}
                  value={(scriptJSON.type && scriptJSON.type) || ""}
                  as="select"
                >
                  <option>--- Select Script Type ---</option>
                  <option>p5js</option>
                  <option>processing</option>
                  <option>a-frame</option>
                  <option>threejs</option>
                  <option>vox</option>
                  <option>megavox</option>
                  <option>js</option>
                  <option>svg</option>
                  <option>custom</option>
                  <option>regl</option>
                </Form.Control>
                <Form.Label>Version:</Form.Label>
                <Form.Control
                  onChange={(e) => onJSONChange(e, "version")}
                  value={scriptJSON.version || ""}
                  type="text"
                  placeholder="Specify version number of script, if applicable."
                ></Form.Control>
                <Form.Label>Aspect Ratio (width/height):</Form.Label>
                <Form.Control
                  onChange={(e) => onJSONChange(e, "aspectRatio")}
                  type="text"
                  value={scriptJSON.aspectRatio || ""}
                  placeholder="Required. Specify aspect ratio (width divided by height)."
                ></Form.Control>
                <Form.Label>Instructions:</Form.Label>
                <Form.Control
                  onChange={(e) => onJSONChange(e, "instructions")}
                  value={scriptJSON.instructions || ""}
                  as="textarea"
                  rows={3}
                  type="text"
                  placeholder="Use this space to give user interactivity instructions if appropriate. Separate each instruction with a '|' (pipe)"
                ></Form.Control>
                <Form.Label>Animation Length in Seconds:</Form.Label>
                <Form.Control
                  onChange={(e) => onJSONChange(e, "animationLengthInSeconds")}
                  value={scriptJSON.animationLengthInSeconds || ""}
                  type="number"
                  placeholder="Set length of animation for non-static outputs. Leave blank if static."
                ></Form.Control>
                <Form.Label>Interactive?</Form.Label>
                <Form.Control
                  onChange={(e) => onJSONChange(e, "interactive")}
                  value={scriptJSON.interactive || ""}
                  type="text"
                  placeholder="If your project can be interacted with set to true, otherwise leave blank."
                ></Form.Control>
                {isWhitelisted && (
                  <div>
                    <Form.Label>Curation Status</Form.Label>
                    <Form.Control
                      onChange={(e) => onJSONChange(e, "curation_status")}
                      value={scriptJSON.curation_status || ""}
                      type="text"
                      placeholder="curated | playground | factory"
                    ></Form.Control>
                  </div>
                )}
                <Form.Text className="text-muted">
                  The above values <b>cannot</b> be changed once project is
                  locked.
                </Form.Text>
              </Form.Group>

              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
            <br />
          </div>

          <div>
            <Form onSubmit={(e) => handleChange(e, "addScript")}>
              <Form.Group>
                <Form.Label>
                  <b>Add Project Script</b>
                </Form.Label>
                <Form.Control
                  onChange={handleValueChange}
                  as="textarea"
                  rows={3}
                  type="text"
                  placeholder="Enter your script here."
                />
                <Form.Text className="text-muted">
                  This <b>cannot</b> be changed once project is locked. Visit{" "}
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={BASE_URL + "/project/" + project}
                  >
                    project dashboard{" "}
                  </a>
                  to see full script.
                </Form.Text>
              </Form.Group>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
            <br />
          </div>

          <div>
            <Form onSubmit={(e) => handleChange(e, "updateScript")}>
              <Form.Group>
                <Form.Label>
                  <b>Update Project Script</b>
                </Form.Label>
                <Form.Control
                  onChange={handleValueChange}
                  as="textarea"
                  rows={3}
                  type="text"
                  placeholder="Enter your update here and select which scriptId you are updating below."
                />
                <Form.Text className="text-muted">
                  This <b>cannot</b> be changed once project is locked. Visit{" "}
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={BASE_URL + "/project/" + project}
                  >
                    project dashboard{" "}
                  </a>
                  to see full script.
                </Form.Text>
              </Form.Group>
              <Form.Group>
                <Form.Label>Script Id</Form.Label>
                <Form.Control onChange={handleIdChange} as="select">
                  <option>--- Select Script Id to Update ---</option>
                  {returnScriptIds()}
                </Form.Control>
              </Form.Group>

              <Button variant="primary" type="submit">
                Submit
              </Button>
              <Button
                variant="primary mx-1"
                onClick={(e) => handleChange(e, "removeLastScript")}
              >
                Remove Last Script
              </Button>
            </Form>
            <br />
          </div>
          <br />
          {/*
          <div>
            <Form>
              <Form.Group>
                <Form.Label><b>Use Hashes?</b></Form.Label>
                <br/>
                <Button variant="primary mx-1" onClick={e => handleChange(e, "hashesPerToken")}>
                  {projectScriptDetails && projectScriptDetails[2]?"Project is uses/stores a token hash. Click to set it to remove.":"Project does not use a token hash. Click to add."}
                </Button>

                <Button variant="primary mx-1" onClick={e => handleChange(e, "isDynamic")}>
                  {projectDescription && projectDescription[5]?"Project is dynamic. Click to set it to static.":"Project is static. Click to set it to dynamic."}
                </Button>
                <Form.Text className="text-muted">

                  This <b>cannot</b> be changed once project is locked or once a purchase has been made.
                </Form.Text>
              </Form.Group>

            </Form>
            <br/>
          </div>
        */}
          <div></div>
          <br />

          <div>
            <Form onSubmit={(e) => handleChange(e, "updateProjectIpfsHash")}>
              <Form.Group>
                <Form.Label>
                  <b>Update Project IPFS Hash</b>
                </Form.Label>
                <br />
                <Form.Label>
                  Currently: {projectScriptDetails && projectScriptDetails[3]}
                </Form.Label>
                <Form.Control
                  onChange={handleValueChange}
                  type="text"
                  placeholder="Enter asset IPFS hash."
                />
                <Form.Text className="text-muted">
                  This <b>cannot</b> be modified after a project is locked.
                  Mostly used for static (non script based) projects with assets
                  stored on IPFS.
                </Form.Text>
              </Form.Group>
              <Button variant="primary" type="submit">
                Submit
              </Button>
              <Button
                variant="primary mx-1"
                onClick={(e) => handleChange(e, "useIpfsForStatic")}
              >
                {projectURIInfo && projectURIInfo[2]
                  ? "Using IPFS URI for Static Images. Click to use a BaseURI."
                  : "Using custom URI for static images. Click to use IPFS."}
              </Button>
            </Form>
            <br />
          </div>
        </Tab>
        <Tab eventKey="royalties" title="Royalties/Payees">
          <div>
            <br />
            <Form onSubmit={(e) => handleChange(e, "updatePayeeInfo")}>
              <Form.Group>
                <Form.Label>
                  <b>Update Additional Payee Info</b>
                </Form.Label>
                <br />
                <Form.Label>
                  Current Payee: {projectTokenDetails && projectTokenDetails[5]}
                </Form.Label>
                <br />
                <Form.Label>
                  Current Percentage:{" "}
                  {projectTokenDetails && projectTokenDetails[6]}%
                </Form.Label>
                <br />
                <br />

                <Form.Label>
                  <b>Update Additional Payee Address:</b>
                </Form.Label>
                <Form.Control
                  onChange={handleValueChange}
                  type="text"
                  placeholder="Enter payee address."
                />
                <Form.Text className="text-muted">
                  <b>
                    This address will receive proceeds of each purchase based on
                    the percentage specified below. Can be changed after project
                    is locked.
                  </b>
                </Form.Text>
                <Form.Label>
                  <b>Update Additional Payee Percentage:</b>
                </Form.Label>
                <Form.Control
                  onChange={handleIdChange}
                  type="number"
                  placeholder="Enter whole number for percentage of funds to go to additional payee."
                />
                <Form.Text className="text-muted">
                  This represents the percentage of net funds after subtracting
                  Art Blocks percentage.
                </Form.Text>
                <Form.Text className="text-muted">
                  The above data are combined into a single function therefore
                  both most be populated even if you're only modifying one of
                  them. Make sure both fields are filled in before submitting.
                </Form.Text>
              </Form.Group>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
            <br />
          </div>

          <div>
            <Form
              onSubmit={(e) =>
                handleChange(e, "updateSecondaryMarketRoyaltyPercentage")
              }
            >
              <Form.Group>
                <Form.Label>
                  <b>Update Secondary Market Royalty</b>
                </Form.Label>
                <br />
                <Form.Label>
                  Currently: {projectRoyaltyInfo && projectRoyaltyInfo[3]}%
                </Form.Label>
                <Form.Control
                  onChange={handleValueChange}
                  type="number"
                  placeholder="Enter whole number for percentage for your desired secondary market royalty."
                />
                <Form.Text className="text-muted">
                  Note this is not guaranteed. A platform must be willing to
                  implement this feature specifically. This can be modified
                  after a project is locked.
                </Form.Text>
              </Form.Group>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
            <br />
          </div>
        </Tab>
        <Tab eventKey="uri" title="URI">
          <div>
            <br />
            <Form onSubmit={(e) => handleChange(e, "updateProjectBaseURI")}>
              <Form.Group>
                <Form.Label>
                  <b>Update Project BaseURI</b>
                </Form.Label>
                <br />
                <Form.Label>
                  Current setting: {projectURIInfo ? projectURIInfo[0] : null}
                </Form.Label>
                <Form.Control
                  onChange={handleValueChange}
                  type="url"
                  placeholder="Enter base URI here. The URI serves the token JSON which points to the token image and other metadata."
                />
                <Form.Text className="text-muted">
                  This can be modified after a project is locked. Modifying this
                  will change where the metadata for each project is retreived.
                </Form.Text>
              </Form.Group>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
            <br />
          </div>

          <div>
            <Form onSubmit={(e) => handleChange(e, "updateProjectBaseIpfsURI")}>
              <Form.Group>
                <Form.Label>
                  <b>Update Project BaseIPFS URI</b>
                </Form.Label>
                <br />
                <Form.Label>
                  Current setting: {projectURIInfo && projectURIInfo[1]}
                </Form.Label>
                <Form.Control
                  onChange={handleValueChange}
                  type="url"
                  placeholder="Enter desired base IPFS URI."
                />
                <Form.Text className="text-muted">
                  This can be modified after a project is locked. Modifying this
                  will change where the metadata for each project is retreived
                  when stored on IPFS.
                </Form.Text>
              </Form.Group>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
            <br />
          </div>

          <div>
            <Form
              onSubmit={(e) =>
                handleChange(e, "overrideTokenDynamicImageWithIpfsLink")
              }
            >
              <Form.Group>
                <Form.Label>
                  <b>Override Token Dynamic Image with IPFS</b>
                </Form.Label>
                <Form.Control
                  onChange={handleValueChange}
                  type="text"
                  placeholder="Enter token IPFS hash."
                />
              </Form.Group>
              <Form.Group>
                <Form.Control
                  onChange={handleIdChange}
                  type="number"
                  placeholder="Enter tokenId"
                ></Form.Control>
              </Form.Group>
              <Form.Text className="text-muted">
                This can be modified after a project is locked.
              </Form.Text>
              <Button variant="primary" type="submit">
                Submit
              </Button>
              <Button
                variant="primary mx-1"
                onClick={(e) => handleChange(e, "clearTokenIpfsImageUri")}
              >
                Clear Token IPFS URI
              </Button>
            </Form>
            <br />
          </div>

          <br />
        </Tab>
        <Tab eventKey="danger" title="Danger">
          <div>
            <br />
            <Form onSubmit={(e) => handleChange(e, "updateArtistAddress")}>
              <Form.Group>
                <Form.Label>
                  <b>Update Artist Address</b>
                </Form.Label>
                <Form.Control
                  onChange={handleValueChange}
                  type="text"
                  placeholder="Enter new artist address"
                />
                <Form.Text className="text-muted">
                  <b>
                    Caution! Once you change the artist address control of the
                    project will immediately be transferred to the new address!
                  </b>
                </Form.Text>
              </Form.Group>
              <Button variant="danger" type="submit">
                Submit
              </Button>
            </Form>
            <br />
            {projectTokenDetails && projectTokenDetails[0] === account && (
              <Button
                variant="danger mx-1 btn-block"
                onClick={(e) => handleChange(e, "togglePaused")}
              >
                {projectScriptDetails && projectScriptDetails[5]
                  ? "This project is paused. Click here to unpause."
                  : "Click to pause project."}
              </Button>
            )}

            <br />
          </div>

          {isWhitelisted && (
            <div>
              <Button
                variant="danger mx-1 btn-block"
                onClick={(e) => handleChange(e, "toggleActive")}
              >
                {projectTokenDetails && projectTokenDetails[4]
                  ? "This project is active. Click here to deactivate."
                  : "Click to activate project."}
              </Button>
              <Button
                variant="danger mx-1 btn-block"
                onClick={(e) => handleChange(e, "toggleLocked")}
              >
                {projectScriptDetails && !projectScriptDetails[4]
                  ? "This project is unlocked. Click here to lock it (permanently)."
                  : "Project is permanently locked."}
              </Button>
            </div>
          )}
        </Tab>
      </Tabs>
    </Col>
  );
};

export default ArtistInterface;
