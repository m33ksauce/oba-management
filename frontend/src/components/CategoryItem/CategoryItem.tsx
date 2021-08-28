import './CategoryItem.css';
import React from 'react';
import { Container, Row, Col, Form, FormControl, Accordion, Button } from 'react-bootstrap';

type CategoryProps = {
    title: string,
    children: any[]
}

export class CategoryItem extends React.Component<CategoryProps> {
    render() {
        var children = [];
        if (this.props.children !== undefined) {
            children = this.props.children;
        }
        return (
            <Container>
                <Row><Col>
                    <Form>
                        <Form.Label>Title</Form.Label>
                        <FormControl placeholder={this.props.title} />
                    </Form>
                </Col></Row>
                <Row style={{marginTop: "1em"}}>
                    <Col>
                    <h4>Children</h4>
                    {children.map((child, i) => {
                        return (
                            <Accordion>
                                <Accordion.Item eventKey={i.toString()}>
                                    <Accordion.Header>{child.title}</Accordion.Header>
                                    <Accordion.Body>
                                        <CategoryItem title={child.title} children={child.children} />
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Accordion>
                        )
                    })}
                </Col></Row>
                <Row>
                    <Col>
                        <Button variant="primary" size="sm">Add Child</Button>
                    </Col>
                </Row>
            </Container>
        )
    }
}