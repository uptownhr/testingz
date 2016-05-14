const router = require('koa-router')({ prefix: '/' })

const async = require('async'),
  Promise = require('bluebird'),
  config = require('../config'),
  { Project, Contact, Product } = require('../models')

const stripe = require('stripe')(config.payment.stripe.secret_key)

router.get('/', async ctx => {
  const [projects, products] = await Promise.all([Project.find(), Product.find()])

  ctx.render('index', {
    projects,
    products,
    stripe: config.payment.stripe.public_key
  }, true)
})

router.post('charge', async ctx => {
  const stripeToken = ctx.request.body.stripeToken
  const product = await Product.findOne({ _id: ctx.request.body.id })

  try {
    let charge = await stripe.charges.create({
      amount: product.price * 100, //cents
      description: product.name,
      currency: 'usd',
      source: stripeToken
    })
  }catch (err) {
    if (err && err.type == 'StripeCardError') {
      ctx.flash.errors = [{ msg: 'Error: Card has been declined.' }]
    } else if (err) {
      ctx.flash.errors = [{ msg: 'Error: Payment did not go through.' }]
    }
  }

  ctx.flash.success = [{ msg: 'Success: Payment has been accepted.' }]
  ctx.redirect('/')
})

// contact us route
router.get('/contact', function (req, res) {
  res.render('contact.jade');
})

// post contact data to model
router.post('/contact', function (req, res) {
  var id = req.body.id;
  var body = req.body;
  Contact.findOne({ _id: id }, function (err, contact) {
    if (contact) {
      contact.name = body.name;
      contact.email = body.email;
      contact.message = body.message;
      contact.created = body.created;
      contact.save(function (err, saved) {
        res.redirect('/');
      }) //end of save method
    } //end of if clause
    else { // new contact instance
      var contact = new Contact({
        name: body.name,
        email: body.email,
        message: body.message,
        created: body.created
      })

      contact.save(function (err, saved) {
        if (err) {
          req.flash('errors', { msg: 'Contact Info Was Not Saved!' });
        } else {
          req.flash('success', { msg: 'Your message was sent successfully, Thank You!' })
        }

        res.redirect('/contact');
      })
    }
  }) //end of mongoose findOne method
}) //end of post request

module.exports = router
