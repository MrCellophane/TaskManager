import React from 'react';
import PropTypes from 'prop-types';

export default class LaneHeader extends React.Component {
  render() {
    const { id, cards, total_count } = this.props;
    return (
      <div>
        <b>{id}</b>
        {' '}
        (
        {cards.length}
        /
        {total_count}
        )
      </div>
    );
  }
}

LaneHeader.propTypes = {
  id: PropTypes.number.isRequired,
  cards: PropTypes.string.isRequired,
  total_count: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
};
