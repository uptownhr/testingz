const router = require('koa-router')({ prefix: '/' })

const async = require('async'),
  Promise = require('bluebird'),
  config = require('../config'),
  Project = require('../models/Project'),
  Product = require('../models/Product');

const stripe = require('stripe')(config.payment.stripe.secret_key);

router.get('/', async ctx => {
  const [projects, products] = await Promise.all([Project.find(), Product.find()])

  ctx.render('index.pug', {
    projects,
    products,
    stripe: config.payment.stripe.public_key
  }, true)
})

router.post('charge', async ctx => {
  const stripeToken = req.body.stripeToken

  const product = await Product.findOne({ _id: req.body.id })

  stripe.charges.create({
    amount: product.price * 100, //cents
    description: product.name,
    currency: 'usd',
    source: stripeToken
  }, (err, charge) => {
    if (err && err.type == 'StripeCardError') {
      req.flash('errors', { msg: 'Error: Card has been declined.' });
    } else if (err) {
      req.flash('errors', { msg: 'Error: Payment did not go through.' });
    } else {
      req.flash('success', { msg: 'Success: Payment has been accepted.' });
    }

    ctx.redirect('/');
  });
})

module.exports = router
