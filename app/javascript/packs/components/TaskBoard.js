import React from 'react';
import Board from 'react-trello';
import Button from 'react-bootstrap/Button';
import LaneHeader from './LaneHeader';
import CreatePopup from './CreatePopup';
import EditPopup from './EditPopup';
import TaskRepository from './TaskRepository';

const components = {
  LaneHeader,
};

export default class TasksBoard extends React.Component {
  state = {
    board: {
      new_task: null,
      in_development: null,
      in_qa: null,
      in_code_review: null,
      ready_for_release: null,
      released: null,
      archived: null,
      isCreateModalOpen: false,
      isEditModalOpen: false,
      editCardId: null,
    },
  }


  componentDidMount() {
    this.loadLines();
  }

  getBoard() {
    return {
      lanes: [
        this.generateLane('new_task', 'New'),
        this.generateLane('in_development', 'In Dev'),
        this.generateLane('in_qa', 'In QA'),
        this.generateLane('in_code_review', 'in CR'),
        this.generateLane('ready_for_release', 'Ready for release'),
        this.generateLane('released', 'Released'),
        this.generateLane('archived', 'Archived'),
      ],
    };
  }

  onLaneScroll = (requestedPage, state) => this.fetchLine(state, requestedPage).then(({ items }) => items.map((task) => ({
    ...task,
    label: task.state,
    title: task.name,
  })))

  handleDragEnd = (cardId, sourceLaneId, targetLaneId) => {
    TaskRepository.update(cardId, { task: { state: targetLaneId } })
      .then(() => {
        this.loadLine(sourceLaneId);
        this.loadLine(targetLaneId);
      });
  }

  handleCreateShow = () => {
    this.setState({ isCreateModalOpen: true });
  }

  handleCreateClose = (added = false) => {
    this.setState({ isCreateModalOpen: false });
    if (added === true) {
      this.loadLine('new_task');
    }
  }

  handleCreateHide = () => {
    this.setState({ isCreateModalOpen: false });
  }

  handleTaskCreated = () => {
    this.handleCreateHide();
    this.loadLine('new_task');
  }

  onCardClick = (cardId) => {
    this.setState({ editCardId: cardId });
    this.handleEditShow();
  }

  handleEditClose = (edited = '') => {
    this.setState({ isEditModalOpen: false, editCardId: null });
    switch (edited) {
      case 'new_task':
      case 'in_development':
      case 'in_qa':
      case 'in_code_review':
      case 'ready_for_release':
      case 'released':
      case 'archived':
        this.loadLine(edited);
        break;
      default:
        break;
    }
  }

  handleEditShow = () => {
    this.setState({ isEditModalOpen: true });
  }

  generateLane(id, title) {
    const tasks = this.state[id];
    return {
      id,
      title,
      total_count: (tasks) ? tasks.meta.total_count : 'None',
      cards: (tasks) ? tasks.items.map((task) => ({
        ...task,
        label: task.state,
        title: task.name,
      })) : [],
    };
  }

  loadLines() {
    this.loadLine('new_task');
    this.loadLine('in_development');
    this.loadLine('in_qa');
    this.loadLine('in_code_review');
    this.loadLine('ready_for_release');
    this.loadLine('released');
    this.loadLine('archived');
  }


  loadLine(state, page = 1) {
    this.fetchLine(state, page).then((data) => {
      this.setState({
        [state]: data,
      });
    });
  }

  fetchLine(state, page = 1) {
    return TaskRepository.index(state, page)
      .then(({ data }) => data);
  }

  render() {
    const { isCreateModalOpen, editCardId, isEditModalOpen } = this.state;
    return (
      <div>
        <h1>Your tasks</h1>
        <Button
          variant="info"
          onClick={this.handleCreateShow}
        >
          Create new task
        </Button>
        <Board
          data={this.getBoard()}
          onLaneScroll={this.onLaneScroll}
          customLaneHeader={<LaneHeader />}
          cardsMeta={this.state}
          draggable
          laneDraggable={false}
          handleDragEnd={this.handleDragEnd}
          components={components}
          onCardClick={this.onCardClick}
        />
        <CreatePopup
          show={isCreateModalOpen}
          onClose={this.handleCreateClose}
          onTaskCreate={this.handleTaskCreate}
        />
        <EditPopup
          show={isEditModalOpen}
          onClose={this.handleEditClose}
          cardId={editCardId}
        />
      </div>
    );
  }
}
