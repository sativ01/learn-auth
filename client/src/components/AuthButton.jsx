import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'

const AuthButton = props => {
    const { icon, user: { name, photo }, disabled, authName } = props
    const {onAuth, onClose} = props
    return (
      <div className="App">
        {
          name ?
            <div className="card">
              <img src={photo} alt={name} />
              <FontAwesomeIcon
                icon={faTimesCircle}
                className="close"
                onClick={onClose}
              />
              <h4>{`@${name}`}</h4>
            </div>
            :
            <div className="button">
              <button
                onClick={onAuth}
                className={`${authName} ${disabled ? disabled : ''}`}
              >
                <FontAwesomeIcon icon={icon} size="8x" color="white" />
              </button>
            </div>
        }
      </div>
    );
  }

export default AuthButton;