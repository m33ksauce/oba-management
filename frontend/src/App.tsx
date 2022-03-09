// import logo from './logo.svg';
import './App.css';
import React from 'react';
import { Container, Row, Navbar, Nav} from 'react-bootstrap';
import { Route, Routes, Link } from 'react-router-dom';
import { MainPage } from './pages/Main.page';
import { AudioFilesPage } from './pages/AudioFiles.page';

function App() {

  return (
    <div>
      <Container>
        <Row>
          <Navbar bg="dark" variant="dark">
            <Navbar.Brand>OBA Configurator</Navbar.Brand>
            <Nav>
              <Nav.Link as={Link} to="/main">Main</Nav.Link>
              <Nav.Link as={Link} to="/audio-files">Audio Files</Nav.Link>
            </Nav>
          </Navbar>
        </Row>
      </Container>
      <br />
      <Content />
    </div>
  );
}

const Content = () => {
  return (
    <Routes>
      <Route path='' element={<MainPage />} />
      <Route path='/main' element={<MainPage />} />
      <Route path='/audio-files' element={<AudioFilesPage />} />
    </Routes>
  );
}

export default App;
