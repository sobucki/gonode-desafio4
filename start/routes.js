'use strict'

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.post('users', 'UserController.store').validator('User')
Route.post('sessions', 'SessionController.store').validator('Session')

Route.group(() => {
  Route.put('users', 'UserController.update')

  Route.resource('event', 'EventController')
    .apiOnly()
    .validator(new Map([[['event.store'], ['Event']]]))

  Route.post('event/:events_id/share', 'ShareEventController.share').validator('ShareEvent')
}).middleware(['auth'])
