// import logo from './logo.svg';
import './App.css';
import React from 'react';
import {Accordion, Container, Row, Col, Form, Navbar} from 'react-bootstrap';
import { Route, Switch } from 'react-router-dom';
import { CategoryItem } from './components/CategoryItem/CategoryItem';
import { useAppSelector } from './hooks';
import { MetadataCategory } from './models/metadata-model';

var metadata: MetadataCategory[] | undefined;

function App() {
  metadata = useAppSelector((state) => state.metadataReducer.Metadata.Categories);

  return (
    <div>
      <Navbar>
        <Container>
          <Navbar.Brand>OBA Configurator</Navbar.Brand>
        </Container>
      </Navbar>
      
    </div>
  );
}

const Navigation = () => {
  return (
    <Switch>
      <Route path='' component={main}/>
      <Route path='/main' component={main}/>
    </Switch>
  );
}

const main = () => {
  if (metadata === undefined) metadata = [];
  
  return (
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
        <Row>
          <h2>File Manager</h2>
        </Row>
      </Container>
  )
}

export default App;
