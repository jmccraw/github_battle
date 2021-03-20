import React, { useState, useEffect, useReducer } from 'react';
import { battle } from '../utils/api';
import { FaCompass, FaBriefcase, FaUsers, FaUserFriends, FaUser } from 'react-icons/fa';
import PropTypes from 'prop-types';
import Card from './Card';
import Loading from './Loading';
import Tooltip from './Tooltip';
import queryString from 'query-string';
import { Link } from 'react-router-dom';

function ProfileList({ profile }) {
  return (
    <ul className="card-list">
      <li>
        <FaUser color="rgb(239, 115, 115" size={22} />
        {profile.name}
      </li>
      {profile.location && (
        <li>
          <Tooltip text="User’s Location">
            <FaCompass color="rgb(114, 115, 255)" size={22} />
            {profile.location}
          </Tooltip>
        </li>
      )}
      {profile.company && (
        <li>
          <Tooltip text="User’s Company">
            <FaBriefcase color="#795548" size={22} />
            {profile.company}
          </Tooltip>
        </li>
      )}
      <li>
        <FaUsers color="rgb(129, 195, 245" size={22} />
        {profile.followers.toLocaleString()}
      </li>
      <li>
        <FaUserFriends color="rgb(64, 183, 95" size={22} />
        {profile.following.toLocaleString()}
      </li>
    </ul>
  );
}

ProfileList.propTypes = {
  profile: PropTypes.object.isRequired
};

function resultsReducer( state, action ) {
  switch ( action.type ) {
    case 'fetch':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'success':
      return {
        winner: action.winner,
        loser: action.loser,
        loading: false,
        error: null
      };
    case 'error':
      return {
        ...state,
        loading: false,
        error: action.message
      };
    default:
      throw new Error( 'Failed to load selected Battle' );
  }
}

export default function Results({ location }) {
  const { playerOne, playerTwo } = queryString.parse( location.search );
  const [state, dispatch] = useReducer(
    resultsReducer,
    { winner: null, loser: null, loading: true, error: null }
  );

  useEffect( () => {
    dispatch({ type: 'fetch' });

    battle( [ playerOne, playerTwo ] )
      .then( players => {
        dispatch({ type: 'success', winner: players[0], loser: players[1] });
      } ).catch( ({ message }) => {
        dispatch({ type: 'error', message });
      } );
  }, [ playerOne, playerTwo ] );

  const {winner, loser, loading, error} = state;

  if ( loading === true ) return <Loading text="Battling" />;

  if ( error ) return <p className="center-text error">{error}</p>;

  return (
    <>
      <div className="grid space-around container-sm">
        <Card
          header={winner.score === loser.score ? 'Tie' : 'Winner'}
          subheader={`Score: ${winner.score.toLocaleString()}`}
          avatar={winner.profile.avatar_url}
          href={winner.profile.html_url}
          name={winner.profile.login}
        >
          <ProfileList profile={winner.profile} />
        </Card>
        <Card
          header={winner.score === loser.score ? 'Tie' : 'Loser'}
          subheader={`Score: ${loser.score.toLocaleString()}`}
          avatar={loser.profile.avatar_url}
          href={loser.profile.html_url}
          name={loser.profile.login}
        >
          <ProfileList profile={loser.profile} />
        </Card>
      </div>
      <Link
        className="btn dark-btn btn-space"
        to="/battle"
      >
        Reset
      </Link>
    </>
  );
}
