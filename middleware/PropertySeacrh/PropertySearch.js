const pool = require('../configs/elephantsql');

module.exports = class {
  /**
   * To be used for requests have no feature field.
   * @param {Response} response
   * @param {Number} pagination The zero-index page number for the requested data.
   * Note: 10 items per page.
   */
  constructor(response, pagination) {
    this.pagination = pagination;

    /**
     * Callback function for pool.query() implementations.
     * @param {Error} err The usual error parameter of the pool.query() callback function.
     * @param {Object} result The usual result parameter of the pool.query() callback function.
     * @returns {Response} Express.js HTTP response.
     */
    this.resultResponse = (err, result) => {
      if (err) {
        return response.status(500).send({
          remark: 'Error',
          message: err.message,
        });
      }
      if (result.rows.length === 0) {
        return response.status(200).send({
          remark: 'Empty',
          message: 'No property available',
        });
      }
      return response.status(200).send({
        remark: 'Success',
        message: 'Property available',
        data: {
          properties: result.rows,
        },
      });
    };
  }

  /**
   * Search for housing properties by location only.
   * @param {String} location Location could be the name of a state or LGA.
   * @returns {Response} Express.js HTTP response.
   */
  byLocation(location) {
    return pool.query(
      'SELECT * from properties WHERE state=$1 OR lga=$1 ORDER BY property_id DESC OFFSET $2 LIMIT 10',
      [location, this.pagination],
      this.resultResponse,
    );
  }

  /**
   * Search for housing properties of a certain type.
   * @param {String} type The type of housing property.
   * @returns {Response} Express.js HTTP response.
   */
  byPropertyType(type) {
    pool.query(
      'SELECT * from properties AS p, property_types as pt WHERE property_type=pt.id AND pt.property_name=$1 ORDER BY property_id DESC OFFSET $2 LIMIT 10',
      [type, this.pagination],
      this.resultResponse,
    );
  }

  /**
   * Search for housing properties of a certain type and location
   * @param {String} location Location could be the name of a state or LGA.
   * @param {String} type The type of housing property.
   * @returns {Response} Express.js HTTP response.
   */
  byLocationAndPropertyType(location, type) {
    pool.query(
      'SELECT * from properties AS p, property_types as pt WHERE (p.state=$1 OR p.lga=$1) AND p.property_type=pt.id AND pt.property_name=$2 ORDER BY property_id DESC OFFSET $3 LIMIT 10',
      [location, type, this.pagination],
      this.resultResponse,
    );
  }
};
