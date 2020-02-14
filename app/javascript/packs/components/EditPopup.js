import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { fetch } from './Fetch';


export default class EditPopup extends React.Component {
  state = {
    task: {
      id: null,
      name: '',
      description: '',
      state: null,
      author: {
        id: null,
        first_name: null,
        last_name: null,
        email: null,
      },
      assignee: {
        id: null,
        first_name: null,
        last_name: null,
        email: null,
      },
    },
    isLoading: true,
  }

  loadCard = (cardId) => {
    this.setState({ isLoading: true });
    fetch('GET', window.Routes.api_v1_task_path(cardId, { format: 'json' })).then(({ data }) => {
      this.setState({ task: data, isLoading: false });
      
    });
  }
  //componentDidUpdate (prevProps) {
   // const { cardId } = this.props;
   // if (cardId != null && cardId !== prevProps.cardId) {
    //  this.loadCard(cardId);
   // }
  //}

  componentDidMount() {
    const { cardId } = this.props;
    if (cardId != null) {
      this.loadCard(cardId);
    }
  }


  handleNameChange = (e) => {
    const { task } = this.state;
    this.setState({ task: { ...task, name: e.target.value } });
  }

  handleDecriptionChange = (e) => {
    const { task } = this.state;
    this.setState({ task: { ...task, description: e.target.value } });
  }

  handleCardEdit = () => {
    const { cardId, onClose } = this.props;
    const { task } = this.state;
    fetch('PUT', window.Routes.api_v1_task_path(cardId, { format: 'json' }), {
      name: task.name,
      description: task.description,
      author_id: task.author.id,
      state: task.state,
    }).then((response) => {
      if (response.statusText === 'OK') {
        onClose(task.state);
      } else {
        alert(`Update failed! ${response.status} - ${response.statusText}`);
      }
    });
  }

  handleCardDelete = () => {
    const { cardId, onClose } = this.props;
    const { task } = this.state;
    fetch('DELETE', window.Routes.api_v1_task_path(cardId, { format: 'json' }))
      .then((response) => {
        if (response.statusText === 'OK') {
          onClose(task.state);
        } else {
          alert(`DELETE failed! ${response.status} - ${response.statusText}`);
        }
      });
  }

  render() {
    const { show, onClose } = this.props;
    const { task, isLoading } = this.state;
    if (isLoading) {
      return (
        <Modal animation={false} show={show} onHide={onClose}>
          <Modal.Header closeButton>
            <Modal.Title>
              Info
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Your task is loading. Please be patient.
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={onClose}>Close</Button>
          </Modal.Footer>
        </Modal>
      );
    }
    return (
      <div>
        <Modal animation={false} show={show} onHide={onClose}>
          <Modal.Header closeButton>
            <Modal.Title>
              Task #
              {' '}
              {task.id}
              {' '}
              [
              {task.state}
              ]
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form>
              <Form.Group controlId="formTaskName">
                <Form.Label>Task name:</Form.Label>
                <Form.Control
                  type="text"
                  value={task.name}
                  placeholder="Set the name for the task"
                  onChange={this.handleNameChange}
                />
              </Form.Group>
              <Form.Group controlId="formDescriptionName">
                <Form.Label>Task description:</Form.Label>
                <Form.Control
                  as="textarea"
                  rows="3"
                  value={task.description}
                  placeholder="Set the description for the task"
                  onChange={this.handleDecriptionChange}
                />
              </Form.Group>
            </Form>
            Author:
            {' '}
            {task.author.first_name}
            {' '}
            {task.author.last_name}
          </Modal.Body>

          <Modal.Footer>
            <Button variant="danger" onClick={this.handleCardDelete}>Delete</Button>
            <Button variant="secondary" onClick={onClose}>Close</Button>
            <Button variant="success" onClick={this.handleCardEdit}>Save changes</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

EditPopup.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  cardId: PropTypes.number.isRequired,
};
