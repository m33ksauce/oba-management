import React, { ChangeEvent, useState } from "react";
import { FaFileUpload, FaFolderPlus } from "react-icons/fa";
import { Button, Col, Container, Modal, Row, Table } from "react-bootstrap"

const FileUploadModal = (props: any) => {
  const [ fileForUpload, setFileForUpload ] = useState<File>();

  const uploadChangeHandler = (event: ChangeEvent) => {
    if (typeof event.target != 'undefined') {
      const target = event?.target as HTMLInputElement;
      if (typeof target != 'undefined'
      && target.files != null) {
        const file = target.files[0];
        if (typeof file != 'undefined' && file != null) {
          setFileForUpload(file);
          console.log(file)
        }
      }
    }
  }

  const uploadFile = () => {
    const formData = new FormData();
    
    if ( typeof fileForUpload != "undefined") {
      formData.append('check', fileForUpload, "unknown.jpg");
    }
    

    fetch('http://localhost:5001/oralbibleapp/us-central1/handler/api/v1/audio/single', {
      method: 'POST',
      body: formData,
    })
    .then((resp) => resp.json())
    .then((res) => {
      console.log('success', res);
    })
    .catch((err) => {
      console.log('Error:', err);
    })
  }

  var handleUpload = () => {
    console.log("we uploadin");
    uploadFile()
    props.onHide();
  }

  const fileInput = <input
    type="file"
    name="audio"
    onChange={uploadChangeHandler}
  />

  const dirInput = <input
    type="file"
    /* @ts-expect-error */
    directory="" 
    webkitdirectory=""
    onChange={uploadChangeHandler}
  />
  
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
          <label className="mx-3">Path</label>
          <input type="text"/>
          <label className="mx-3">Upload file: </label>
          {(props.mode === "directory") ? dirInput : fileInput}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.onHide}>Cancel</Button>
        <Button variant="primary" onClick={handleUpload}>Upload</Button>
      </Modal.Footer>
    </Modal>
  )
}

const FileList = (props: any) => {
  return (
    <Table hover>
      <tbody>
        {props.files.map((file: any) => {
          return(
            <tr>
              <td style={{verticalAlign: "bottom"}}><h6>{file.name}</h6></td>
              <td>
                <Button className="float-end" style={{marginLeft: "4px"}} variant="secondary">Remove</Button>
                <Button className="float-end" variant="primary">Edit</Button>
              </td>
            </tr>
          )
        })}
      </tbody>
    </Table>
  )
}

export const AudioFilesPage = () => {
  const [modalShow, setModalShow] = React.useState(false);
  const [modalMode, setModalMode] = React.useState("file");

  const showModal = (mode: string) => {
    setModalMode(mode);
    setModalShow(true);
  }

  let files = [
    { name: "Luke 1:1-4" },
    { name: "Luke 1:5" },
    { name: "Luke 1:6-8" },
  ]

  return (
    <Container>
      <Row>
        <Col lg={{ span: 6, offset: 3}}>
          <h1>
            Audio Files
            <Button className="float-end" style={{marginLeft: "4px"}} variant="primary" onClick={() => showModal("directory")}><FaFolderPlus /></Button>
            <Button className="float-end" variant="primary" onClick={() => showModal("file")}><FaFileUpload /></Button>
          </h1>
          <FileUploadModal
              show={modalShow}
              onHide={() => setModalShow(false)}
              mode={modalMode}
            />
          <hr />
          <FileList files={files} />
        </Col>
      </Row>
    </Container>
    )
}