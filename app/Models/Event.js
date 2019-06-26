'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Event extends Model {
  static get dates () {
    return super.dates.concat('time')
  }
  static castDates (field, value) {
    if (['time'].indexOf(field) > -1) {
      return value.format('DD/MM/YYYY')
    }
    return super.formatDates(field, value)
  }

  user () {
    return this.belongsTo('App/Models/User')
  }
}

module.exports = Event
