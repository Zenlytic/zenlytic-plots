import React from 'react';
import PropTypes from 'prop-types';

export default function Button({ text, onClick, color }) {
  return (
    <button style={{ color }} onClick={onClick}>
      {text}
    </button>
  );
}
Button.propTypes = {
  /**
   * Is this the principal call to action on the page?
   */
  primary: PropTypes.bool,
  /**
   * What background color to use
   */
  color: PropTypes.string,
  /**
   * How large should the button be?
   */
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  /**
   * Button contents
   */
  text: PropTypes.string.isRequired,
  /**
   * Optional click handler
   */
  onClick: PropTypes.func,
};

Button.defaultProps = {
  primary: false,
  size: 'medium',
  onClick: undefined,
  color: 'red',
};
