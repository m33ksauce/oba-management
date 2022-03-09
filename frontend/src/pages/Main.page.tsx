import React from 'react';
import {Accordion, Container, Row, Col} from 'react-bootstrap';
import { CategoryItem } from '../components/CategoryItem/CategoryItem';
import { useAppSelector } from '../hooks';
import { MetadataCategory } from '../models/metadata-model';

var metadata: MetadataCategory[] | undefined;

export const MainPage = () => {
    metadata = useAppSelector((state) => state.metadataReducer.Metadata.Categories);
    if (metadata === undefined) metadata = [];
    
    return (
      <Container>
          <Row>
            <Col lg={{ span: 6, offset: 3 }}>
              <h1>Metadata</h1><hr />
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
    )
  }