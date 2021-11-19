import React, {Component} from 'react';
import {
  Card,
  Button,
  CardDeck,
  Col,
  ButtonGroup,
  Pagination,
  Container,
} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import {staticRenderGenerator, liveRenderUrl} from './utils';

class UserGalleryCard extends Component {
  constructor(props) {
    super(props);
    this.state = {page: 1};
    this.handlePageChange = this.handlePageChange.bind(this);
  }

  handlePageChange(number) {
    this.setState({
      page: number,
      loadQueue: this.props.project * 1000000 + (number - 1) * 20,
    });
  }

  render() {
    let active = this.state.page;
    let items = [];
    if (this.props.projects[this.props.project].tokens) {
      let projectTokens = this.props.projects[this.props.project].tokens;
      for (
        let number = 1;
        number <= Math.ceil(projectTokens.length / 12);
        number++
      ) {
        items.push(
          <Pagination.Item
            style={{minWidth: '3rem', fontSize: '0.8rem', textAlign: 'center'}}
            key={number}
            onClick={
              number !== active
                ? () => {
                    this.handlePageChange(number);
                  }
                : undefined
            }
            active={number === active}>
            {number}
          </Pagination.Item>
        );
      }
    }

    const paginationBasic = (
      <Container className="mx-1">
        <div className="text-xs-center">
          <br />
          <Pagination className="flex-wrap text-left">{items}</Pagination>
          <br />
        </div>
      </Container>
    );

    return (
      <div>
        <CardDeck>
          {this.props.projects[this.props.project].tokens.map(
            (token, index) => {
              if (
                this.props.projects[this.props.project].tokens
                  .slice((this.state.page - 1) * 12, this.state.page * 12)
                  .includes(token)
              ) {
                return (
                  <div key={index}>
                    <Col>
                      <Card
                        border="light"
                        className="mx-auto"
                        style={{width: '16rem'}}>
                        <Card.Body>
                          {<Card.Img src={staticRenderGenerator(token)} />}

                          <div className="text-center">
                            <ButtonGroup size="sm" style={{left: '-16px'}}>
                              <Button variant="light" disabled>
                                #
                                {Number(token) -
                                  Number(this.props.project) * 1000000}
                              </Button>
                              <Button
                                as={Link}
                                to={'/token/' + token}
                                variant="light"
                                onClick={() =>
                                  this.props.handleToggleView(
                                    'viewToken',
                                    token
                                  )
                                }>
                                Details
                              </Button>
                              <Button
                                variant="light"
                                onClick={() =>
                                  window.open(
                                    staticRenderGenerator(token),
                                    '_blank'
                                  )
                                }>
                                Image
                              </Button>
                              <Button
                                variant="light"
                                onClick={() =>
                                  window.open(liveRenderUrl(token), '_blank')
                                }>
                                Live
                              </Button>
                            </ButtonGroup>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  </div>
                );
              } else {
                return null;
              }
            }
          )}
        </CardDeck>
        {paginationBasic}
      </div>
    );
  }
}

export default UserGalleryCard;
