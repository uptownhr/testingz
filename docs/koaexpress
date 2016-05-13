# Koa or Express

Hackable comes in two flavors. Express or Koajs. If you're a developer that wants the latest bells and whisltes of es6, use the koa @ > 2.0
Or use @ 1.4.0 for the express version. 

## Main Difference

### Express
```js
router.get('/user/:id', function(req,res) {
  var id = req.params.id
  var user = User.findOne({_id: id}, function(err, user){
    res.render('some-view', { user: user })
  })
})
```

### KoaJs
```
router.get('/user/:id', async ctx => {
  const id = ctx.params.id
  var user = await User.findOne({_id: id})
  
  ctx.render('some-view', { user })
})
```
