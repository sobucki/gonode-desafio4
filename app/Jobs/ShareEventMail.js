'use strict'

const Mail = use('Mail')

class ShareEventMail {
  // If this getter isn't provided, it will default to 1.
  // Increase this number to increase processing concurrency.
  static get concurrency () {
    return 1
  }

  // This is required. This is a unique key used to identify this job.
  static get key () {
    return 'ShareEventMail-job'
  }

  // This is where the work is done.
  async handle ({ email, event }) {
    console.log(`Job:${ShareEventMail.key}`)

    await Mail.send(
      ['emails.share_events'],
      {
        event
      },
      message => {
        message
          .to(email)
          .from('share_events@mail.com', 'Bot Events | Message')
          .subject('Look my events!')
      }

    )
  }
}

module.exports = ShareEventMail

