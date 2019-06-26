'use strict'

const Antl = use('Antl')

class Event {
  get validateAll () {
    return true
  }
  get rules () {
    return {
      title: 'required',
      location: 'required',
      time: 'date:required'
    }
  }

  get messages () {
    return Antl.list('validation')
  }
}

module.exports = Event
