'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Event = use('App/Models/Event')
const moment = require('moment')

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

    const numEvents = await Event.query()
      .where('time', data.time)
      .where('user_id', user.id)
      .getCount()

    if (numEvents > 0) {
      return response.status(401).send({
        error: {
          message: 'Não é possivel criar um evento na mesma data.'
        }
      })
    }

    if (moment().isAfter(data.time)) {
      return response.status(401).send({
        error: {
          message: 'A data do evento deve ser maior que a data atual.'
        }
      })
    }

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
  async update ({ params, request, response, auth: { user } }) {
    const event = await Event.findOrFail(params.id)
    const data = request.only(['title', 'location', 'time'])

    if (user.id !== event.user_id) {
      return response.status(401).send({
        error: {
          message: 'Você não possui permissão para esta edição.'
        }
      })
    }

    // Se o evento ja ocorreu
    if (moment().isAfter(event.time)) {
      return response.status(401).send({
        error: {
          message: 'Você não pode editar eventos que já ocorreram.'
        }
      })
    }

    // Se a data a ser salva for menor que hoje
    if (moment().isAfter(data.time)) {
      return response.status(401).send({
        error: {
          message: 'Você não pode alterar um evento para uma data anterior a hoje.'
        }
      })
    }

    const numEvents = await Event.query()
      .where('time', data.time)
      .where('user_id', user.id)
      .getCount()

    if (numEvents > 0) {
      return response.status(401).send({
        error: {
          message: 'Não é alterar um evento para a mesma data.'
        }
      })
    }

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

    // Se o evento ja ocorreu
    if (moment().isAfter(event.time)) {
      return response.status(401).send({
        error: {
          message: 'Você não pode deletar eventos que já ocorreram.'
        }
      })
    }

    await event.delete()
  }
}

module.exports = EventController
