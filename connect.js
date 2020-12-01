require('dotenv').config();

const Knex = require('knex');
const { Model } = require('objection');
const { db } = require('./config');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
Model.knex(Knex(db));
