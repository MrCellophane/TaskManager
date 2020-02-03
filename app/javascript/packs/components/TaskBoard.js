import React from "react";
import Board from "react-trello";
import { fetch } from './Fetch';
import LaneHeader from './LaneHeader';
import Button from 'react-bootstrap/Button';
import AddPopup from './AddPopup';


const components = {
  LaneHeader: LaneHeader
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
      archived: null
    },
    addPopupShow: false
  }

  generateLane(id, title) {
    const tasks = this.state[id];

    return {
      id,
      title,
      total_count: (tasks) ? tasks.meta.total_count : 'None',
      cards: (tasks) ? tasks.items.map((task) => {
        return {
          ...task,
          label: task.state,
          title: task.name
        };
      }) : []
    }
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

  loadLines() {
    this.loadLine('new_task');
    this.loadLine('in_development');
    this.loadLine('in_qa');
    this.loadLine('in_code_review');
    this.loadLine('ready_for_release');
    this.loadLine('released');
    this.loadLine('archived');
  }

  componentDidMount() {
    this.loadLines();
  }

  loadLine(state, page = 1) {
    this.fetchLine(state, page).then(( data ) => {
      this.setState({
        [state]: data
      });
    });
  }

  fetchLine(state, page = 1) {
    return fetch('GET', window.Routes.api_v1_tasks_path({ q: { state_eq: state }, page: page, per_page: 10, format: 'json' })).then(({data}) => {
      return data;
    })
  }

  onLaneScroll = (requestedPage, state) => {
    return this.fetchLine(state, requestedPage).then(({items}) => {
      return items.map((task) => {
        return {
          ...task,
          label: task.state,
          title: task.name
        };
      });
    })
  }

  handleDragEnd = (cardId, sourceLaneId, targetLaneId) => {
    fetch('PUT', window.Routes.api_v1_task_path(cardId, { format: 'json' }), { task: { state: targetLaneId } })
      .then(() => {
        this.loadLine(sourceLaneId);
        this.loadLine(targetLaneId);
      });
  }

  handleAddShow = () => {
    this.setState({ addPopupShow: true });
  }
  
  handleAddClose = ( added = false ) => {
    this.setState({ addPopupShow: false });
    if (added == true) {
      this.loadLine('new_task');
    };
  }
  
  render() {
    return <div>
      <h1>Your tasks</h1>
      <Button variant="primary" 
          onClick={this.handleAddShow}>Create new task
      </Button>
      <Board
        data={this.getBoard()}
        onLaneScroll={this.onLaneScroll}
        customLaneHeader={<LaneHeader/>}
        cardsMeta={this.state}
        draggable
        laneDraggable={false}
        handleDragEnd={this.handleDragEnd}
        components={components} 
      />
      <AddPopup
        show = {this.state.addPopupShow}
        onClose={this.handleAddClose}
      />
      
    </div>;
  }
}