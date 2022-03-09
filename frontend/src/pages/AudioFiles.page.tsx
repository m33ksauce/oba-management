import { Button, Col, Container, Row, Table } from "react-bootstrap"

export const AudioFilesPage = () => {
    return (
      <Container>
        <Row>
          <Col lg={{ span: 6, offset: 3}}>
            <h1>Audio Files</h1><hr />

            <Table hover>
                <tr>
                    <td>Luke 1:1-4</td>
                    <td><Button>Remove</Button></td>
                </tr>
            </Table>
          </Col>
        </Row>
      </Container>
    )
  }