'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Event = use('App/Models/Event')

/**
 * Resourceful controller for interacting with events
 */
class EventController {
  /**
   * Show a list of all events.
   * GET events
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view, auth: { user } }) {
    const { page } = request.get()
    const events = await Event.query().where('user_id', user.id)
      .with('user')
      .paginate(page)

    return events
  }

  /**
   * Create/save a new event.
   * POST events
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response, auth: { user } }) {
    const data = request.only(['title', 'location', 'time'])

    const event = await Event.create({ ...data, user_id: user.id })

    return event
  }

  /**
   * Display a single event.
   * GET events/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, auth: { user } }) {
    const event = await Event.findOrFail(params.id)

    if (event.user_id !== user.id) {
      return response.status(401).send({
        error: {
          message: 'Você não tem permissão para ver este evento.'
        }
      })
    }

    await event.load('user')

    return event
  }

  /**
   * Update event details.
   * PUT or PATCH events/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
    const event = await Event.findOrFail(params.id)
    const data = request.only(['title', 'location', 'time'])

    event.merge(data)

    await event.save()

    return event
  }

  /**
   * Delete a event with id.
   * DELETE events/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, response, auth: { user } }) {
    const event = await Event.findOrFail(params.id)

    if (event.user_id !== user.id) {
      return response.status(401).send({
        error: {
          message: 'Você não tem permissão para excluir este evento.'
        }
      })
    }

    await event.delete()
  }
}

module.exports = EventController
