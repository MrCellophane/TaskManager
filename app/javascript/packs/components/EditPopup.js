import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import PropTypes from 'prop-types';
import TaskRepository from './TaskRepository';


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

  // componentDidUpdate (prevProps) {
  // const { cardId } = this.props;
  // if (cardId != null && cardId !== prevProps.cardId) {
  //  this.loadCard(cardId);
  // }
  // }

  componentDidMount() {
    const { cardId } = this.props;
    this.loadCard(cardId);
  }

  loadCard = (cardId) => {
    this.setState({ isLoading: true });
    TaskRepository.show(cardId)
      .then(({ data }) => {
        this.setState({ task: data, isLoading: false });
      });
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
    const { name, description, author, state } = this.state.task;

    TaskRepository.update(cardId, {
      name: name,
      description: description,
      author_id: author.id,
      state: state,
    }).then(() => {
      onClose(state);
    });
  }

  handleCardDelete = () => {
    const { cardId, onClose } = this.props;
    const { task } = this.state;
    TaskRepository.destroy(cardId)
      .then(() => {
        onClose(task.state);
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
