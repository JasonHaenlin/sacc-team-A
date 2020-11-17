const sendgrid = require('@sendgrid/mail');

/**
 * Responds to an HTTP request from Cloud Tasks and sends an email using data
 * from the request body.
 *
 * @param {object} req Cloud Function request context.
 * @param {object} req.body The request payload.
 * @param {string} req.body.to_email Email address of the recipient.
 * @param {string} req.body.to_name Name of the recipient.
 * @param {string} req.body.from_name Name of the sender.
 * @param {object} res Cloud Function response context.
 */
exports.sendEmail = async (to_email, subject, content) => {
  // Get the SendGrid API key from the environment variable.
  const key = process.env.SENDGRID_API_KEY;
  if (!key) {
    const error = new Error(
      'SENDGRID_API_KEY was not provided as environment variable.'
    );
    error.code = 401;
    throw error;
  }
  sendgrid.setApiKey(key);

  if (!to_email) {
    const error = new Error('Email address not provided.');
    error.code = 400;
    throw error;
  }

  // Construct the email request.
  const msg = {
    to: to_email,
    from: 'younes.abdennadher@etu.univ-cotedazur.fr',
    subject: subject,
    html: content,
  };

  try {
    sendgrid.send(msg).then((res) => {
    }).catch((error) => {
      console.log(error);
    });
    // Send OK to Cloud Task queue to delete task.
  } catch (error) {
    console.log(error);
    // Any status code other than 2xx or 503 will trigger the task to retry.
  }
};
