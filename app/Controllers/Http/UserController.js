'use strict'

const User = use('App/Models/User')
const Hash = use('Hash')

class UserController {
  async store ({ request }) {
    const data = request.only(['username', 'email', 'password'])

    const user = await User.create(data)

    return user
  }

  async update ({ request, response, auth: { user } }) {
    const data = request.only(['password', 'password_old', 'username'])

    if (!data.password) {
      return response.status(401).send({
        error: {
          message: 'Você não informou a nova senha'
        }
      })
    }


    if (data.password_old) {
      const isSame = await Hash.verify(data.password_old, user.password)

      if (!isSame) {
        return response.status(401).send({
          error: {
            message: 'A senha antiga não é válida'
          }
        })
      }
      if (data.password_old === data.password) {
        return response.status(401).send({
          error: {
            message: 'A nova senha deve ser diferente da antiga'
          }
        })
      }
      delete data.password_old
    }


    user.merge(data)

    await user.save()

    return user
  }
}

module.exports = UserController
