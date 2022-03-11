import React from "react";
import { FaFileUpload, FaFolderPlus } from "react-icons/fa";
import { Button, Col, Container, Modal, Row, Table } from "react-bootstrap"

const FileUploadModal = (props: any) => {
  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>

      </Modal.Header>
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
          <FileUploadModal
              show={modalShow}
              onHide={() => setModalShow(false)}
            />
          <hr />
          <Button className="float-end" style={{marginLeft: "4px"}} variant="primary" onClick={() => setModalShow(true)}><FaFolderPlus /></Button>
          <Button className="float-end" variant="primary" onClick={() => setModalShow(true)}><FaFileUpload /></Button>
          <Table hover>
              <tr>
                  <td>Luke 1:1-4</td>
                  <td><Button variant="primary">Remove</Button></td>
              </tr>
          </Table>
        </Col>
      </Row>
    </Container>
    )
}