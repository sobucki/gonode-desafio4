'use strict'

const Antl = use('Antl')

class ShareEvent {
  get validateAll () {
    return true
  }
  get rules () {
    return {
      email: 'required|email'
    }
  }

  get messages () {
    return Antl.list('validation')
  }
}

module.exports = ShareEvent
