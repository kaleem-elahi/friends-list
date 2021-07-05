import React from 'react';
import PropTypes from 'prop-types';
import {
  CardBody,
} from 'reactstrap';


const FriendCard = props => (
    <div className="main-card-container">
      <CardBody className="main-card">
        <div className="title-container">
          <strong>{props.name}</strong>
          <div>is your friend</div>
        </div>

        <div className=" w-25 d-flex justify-content-around">
          <button className="icon-button" disabled={props.loading} onClick={
                () => props.toggleFavourite(props)
              }>
            {props.favourite ? (
              <i className="star fa fa-star " />) : (
              <i className="star fa fa-star-o"/>
            )}
          </button>
          <button className="icon-button" disabled={props.loading}>
            <i className=" trash fa fa-trash" onClick={
              () => props.handleDelete(props.id)
            } />
          </button>
        </div>
      </CardBody>
    </div>
);

FriendCard.propTypes = {
  name: PropTypes.string,
  favourite: PropTypes.bool,
};
FriendCard.defaultProps = {
  name: 'default name',
  favourite: false,
};

export default FriendCard;
