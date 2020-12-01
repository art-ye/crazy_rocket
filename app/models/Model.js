const { Model: ObjectionModel } = require('objection');

module.exports = class Model extends ObjectionModel {
  $beforeInsert() {
    this.created_at = (new Date()).toISOString();
  }

  $beforeUpdate() {
    this.updated_at = (new Date()).toISOString();
  }
};
