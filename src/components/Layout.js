import { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { Link, Outlet } from 'react-router-dom';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone } from '@fortawesome/free-solid-svg-icons';

export default function Layout({ children }) {
  return (
    <Fragment>
      <Helmet titleTemplate="Modemania - %s" />
      <Navbar expand="lg" variant="dark">
        <Container>
          <Navbar.Brand>
            <Nav.Link as={Link} to="/">
              <FontAwesomeIcon icon={faPhone} /> modemania
            </Nav.Link>
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Nav className="ms-auto">
              <Nav.Item>Work in Progress &trade;</Nav.Item>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container>
        <Outlet />
        {children}
      </Container>
    </Fragment>
  );
}

Layout.propTypes = {
  children: PropTypes.node
};
