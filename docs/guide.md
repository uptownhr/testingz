
##Instruction to creating "customized admin CRUD pages"

General Summary:
  You will first create a new model for the data you want to copy/read/update/delete.  You will be creating two jade files: one for displaying all data in collection, another one for viewing and editing one specific dataset from collection.  You will also edit the Admin.js file in '/controllers' to set the route as well as the function of the route.  In Admin.js, you will create 6 routes:
  
      1. to list and display entire data collection.
      
      2. to create and enter New set of data into the collection
      
      3. to view/edit 1 specific data set from collection by ID
      
      4. to save data into the mongoDB
      
      5. to update specific data set from collection by ID
      
      6. to remove specific data set from collection by ID
      
  Using these routes, you will add functionality into the route to manipulate the data and display the data using the two jade files you created.

STEPS

1.  create a new model schema for a new mongoDB.  
    a. example: create a new file in '/models'.  Filename can be whatever name you decide: i.e. "newModel.js"
    
    example code:
       ```js
       var mongoose = require('mongoose');
       
       var newSchema = new mongoose.Schema({
         firstname: {type: String},
         lastname: {type: String},
         email: {type: String}
       })
      
       module.exports = mongoose.model('newDATA', newSchema)
       ```
      WHERE 'newDATA' is the name of the collection where you are storing the data.
    b.  Look to Project.js and Post.js for an indepth example of what a schema should look like. 
    
2.  Create two jade files in '/views/admin': one for listing all data, another for viewing/editing specific data.  
    
    example filenames: blogListing.jade for listing all data AND blogEditView.jade forview/edit specific data.
    Example code for jade listing all data:
    ```js
    extends layout
    block content
      .dashhead
        .dashhead-titles
          h6.dashhead-subtitle Example
          h2.dashhead-title Listings
        .btn-toolbar.dashhead-toolbar
          .btn-group
            a.btn.btn-primary-outline(href='/admin/example', type='button')
              | New File
              span.icon.icon-plus
      hr.m-t
      .flextable.table-actions
        .flextable-item.flextable-primary
          .btn-toolbar-item.input-with-icon
            input.form-control.input-block(type='text', placeholder='Search users')
            span.icon.icon-magnifying-glass
        .flextable-item
      .table-full
        .table-responsive
          table.table(data-sort='table')
            thead
              tr
                td
                  input#selectAll.select-all(type='checkbox')
                th first name
                th last name
                th email
                th
            tbody
              each data in example
                tr
                  td
                    input.select-row(type='checkbox')
                  td
                    =data.firstname
                  td
                    =data.lastname
                  td
                    =data.email
                  td
                    a.btn.btn-primary-outline.btn-sm(href='/admin/example/#{data._id}')
                      | View/Edit
                      span.icon.icon-pencil
                    | &nbsp;
                    a.btn.btn-primary-outline.btn-sm(href='/admin/example/delete/#{data._id}', data-remote='true', data-confirm='Are You Sure?')
                      | Delete
                      span.icon.icon-erase
                    | &nbsp;
      .text-center
      ```
    Example code for jade viewing/editing specific data:
    
    ```js
    extends layout
    block content
      form(method="POST" action="/admin/example")
        input(type="hidden" name="_id" value=data._id)
        .dashhead
          .dashhead-titles
            h6.dashhead-subtitle Example
            h2.dashhead-title New/Edit Example
          .btn-toolbar.dashhead-toolbar
            button.btn.btn-primary-outline Save Example
            //
              <div class="btn-toolbar-item input-with-icon">
              <input type="text" value="01/01/15 - 01/08/15" class="form-control" data-provide="datepicker">
              <span class="icon icon-calendar"></span>
              </div>
        hr.m-t
        section.content-header
          #field_firstname.field.row
            .col-md-12
              .form-group
                label First Name
                input.form-control(type="text" name="firstname" placeholder="first name" value=data.firstname)
              // /.form-group
            // /.col
          // /.row
          #field_lastname.field.row
            .col-md-12
              .form-group
                label Last Name
                input.form-control(type="text" name="lastname" placeholder="last name" value=data.lastname)
              // /.form-group
            // /.col
          // /.row
          #field_email.field.row
            .col-md-12
              .form-group
                label Email
                input.form-control(type="text" name="email" placeholder="email" value=data.email)
              // /.form-group
            // /.col
          // /.row
    block scripts
    script(src="http://code.jquery.com/ui/1.10.4/jquery-ui.js")
    ```
    
3.  open "Admin.js" in "/controllers"

    a.  add your newly created model to the top portion of "Admin.js"
    ```js
    Example = models.Example
    
    ```
    
    WHERE 'Example' is the name of the model created in step 1.
        
    b.  create and add 6 routes in "Admin.js" with GET: NEW collection, LIST of collection, EDIT/VIEW collection, REMOVE           
        collection AND POST: SAVE collection AND UPDATE collection
        
        example code: 
```js
        //GET List of Collection - use jade for displaying all data
        router.get('/examples', function(req,res){
          Example.find(function(err, example){
            res.render('admin/blogListing',{
              example
            })
          })
        })
        //ADD NEW collection - use jade for view/edit collection
        router.get('/example', function(req, res){
          const example = {}
          res.render('admin/blogEditView', {example} )
        })
        //VIEW/EDIT Data - use jade for view/edit collection
        router.get('/example/:id', function(req,res){
          var id = req.params.id;
          Example.findOne({_id: id}, function(err, example){
            res.render('admin/blogEditView', {
              example
            })
          })
        })
        
        // POST Save data
        router.post('/example', function(req, res){
          var id = req.body._id
          var body = req.body;
          Example.findOne({_id: id}, function(err, example){
            if(example){
              example.firstname=body.firstname;
              example.lastname=body.lastname;
              example.email=body.email;
              example.save(function(err, saved){
                res.redirect('/admin/examples')
              })
            } else{
              var example = new Example({
                firstname: body.firstname,
                lastname: body.lastname,
                email: body.email
              })
              example.save(function(err, saved) {
                res.redirect('/admin/examples')
              })
            }
          })
        })
        
        // UPDATE specific data
        router.post('/example/:id', function(req, res){
          var id = req.params.id;
          var body = req.body;
          Example.findOne({_id: id}, function(err, example){
            example.firstname=body.firstname;
            example.lastname=body.lastname;
            example.email=body.email;
            example.save(function(err, saved){
              res.redirect('/admin/examples')
            })
          })
        })
        
        // REMOVE data
        router.get('/example/delete/:id', function(req, res){
          Example.remove({_id: req.params.id}, function(err){
            if(err){
              req.flash('error', {msg: err.message} )
            }else{
              req.flash('success', {msg: 'deleted'} )
            }
            return res.redirect('/admin/examples')
          })
        })
```
