'use strict'

const Event = use('App/Models/Event')
const Kue = use('Kue')
const Job = use('App/Jobs/ShareEventMail')

class ShareEventController {
  async share ({ request, response, params, auth: { user } }) {
    const event = await Event.findOrFail(params.events_id)
    const email = request.input('email')

    if (event.user_id !== user.id) {
      return response.status(401).send({
        error: {
          message: 'Este evento não pertence a você.'
        }
      })
    }

    Kue.dispatch(Job.key, { email, event }, { attempts: 3 })

    return event
  }
}

module.exports = ShareEventController
