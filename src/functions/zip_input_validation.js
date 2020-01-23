//@flow
import validate from 'validate.js';

/**
 * Check whether the input zip code, which is currently in this.state, is of
 * valid format.If it is valid, return true, otherwise false.
 *
 * @param {string} zipInput The user-input zip code.
 * @returns {boolean} true if validation passes; otherwise false.
 */
function isZipValid(zipInput: string) {
  return validate({zip: zipInput}, constraints) === undefined ? true : false;
}

const constraints = {
  zip: {
    // do not check for empty value here, because the regex pattern already
    // deems empty value as invalid
    format: {
      pattern: /\d{5}/, // regex pattern must be enclosed by forward slashes
    },
  },
};

export {isZipValid};
