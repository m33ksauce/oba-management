// import logo from './logo.svg';
import './App.css';
import React from 'react';
import {Accordion, Container, Row, Col, Form, Navbar} from 'react-bootstrap';
import { CategoryItem } from './components/CategoryItem/CategoryItem';
import { useAppSelector } from './hooks';
import { MetadataCategory } from './models/metadata-model';

function App() {
  var metadata = useAppSelector((state) => state.metadataReducer.Metadata.Categories);

  if (metadata === undefined) metadata = [];

  return (
    <div>
      <Navbar>
        <Container>
          <Navbar.Brand>OBA Configurator</Navbar.Brand>
        </Container>
      </Navbar>
      <Container>
        <Row>
          <Col lg={{ span: 6, offset: 3 }}>
            <Accordion>
            {metadata.map((m: MetadataCategory, i: number) => {
              return (
                  <Accordion.Item eventKey={i.toString()}>
                    <Accordion.Header>{m.title}</Accordion.Header>
                    <Accordion.Body>
                      <CategoryItem title={m.title} children={m.children} />
                    </Accordion.Body>
                  </Accordion.Item>
              )
            })}
            </Accordion>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export class CategoryItemBad extends React.Component {
  render() {
    return (
      <Container>
        <Row>
          <Form>
            <Form.Label column>Title</Form.Label>
            <Form.Control></Form.Control>
          </Form>
        </Row>
        <Row style={{marginTop: "1em"}}>
          <h3>Children</h3>
          <Accordion>
            <Accordion.Item eventKey="0">
              <Accordion.Header>Luke</Accordion.Header>
              <Accordion.Body>
              <Row>
                <Form>
                  <Form.Label column>Title</Form.Label>
                  <Form.Control></Form.Control>
                </Form>
              </Row>
              <Row>
                <Accordion>
                  <Accordion.Item eventKey="0">
                    <Accordion.Header>Luke 1</Accordion.Header>
                    <Accordion.Body>Something.</Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </Row>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Row>
      </Container>
    )
  }
}


export default App;
