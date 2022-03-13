import React from "react";
import { FaFileUpload, FaFolderPlus } from "react-icons/fa";
import { Button, Col, Container, Modal, Row, Table } from "react-bootstrap"

const FileUploadModal = (props: any) => {
  var handleUpload = () => {
    console.log("we uploadin");
    props.onHide();
  }

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>File Upload</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <label className="mx-3">Upload file: </label>
          <input type="file" directory="" webkitdirectory=""/>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.onHide}>Cancel</Button>
        <Button variant="primary" onClick={handleUpload}>Save changes</Button>
      </Modal.Footer>
    </Modal>
  )
}

export const AudioFilesPage = () => {
  const [modalShow, setModalShow] = React.useState(false);

  return (
    <Container>
      <Row>
        <Col lg={{ span: 6, offset: 3}}>
          <h1>Audio Files</h1>
          <hr />
          <FileUploadModal
              show={modalShow}
              onHide={() => setModalShow(false)}
            />
          <Button className="float-end" style={{marginLeft: "4px"}} variant="primary" onClick={() => setModalShow(true)}><FaFolderPlus /></Button>
          <Button className="float-end" variant="primary" onClick={() => setModalShow(true)}><FaFileUpload /></Button>
          <Table hover>
            <tbody>
              <tr>
                  <td>Luke 1:1-4</td>
                  <td><Button variant="primary">Remove</Button></td>
              </tr>
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
    )
}