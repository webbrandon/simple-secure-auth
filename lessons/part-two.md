# Jade and Bootstrap
It has become a common practice to use template engines like Jade Template Engine with the Express framework.  Template engines give developers the ability to increase reuse and an increased ability to interact with data.  To increase accessibility and provide stability in a responsive design with cross platform capability the Bootstrap framework can be use.  Using Bootstrap code snips from the framework homepage of it many other code snip sites and tutorials with Jade is quick and easy and can greatly enhance the Bootstrap framework.

## Structure & Code
To begin using the bootstrap framework download and place the framework files in the instructed locations.  In express this is in the `./public` folder.  This means we need to rename our `stylesheet` folder to `css` and `javascript` to `js`.  This also requires the use of the jQuery library, download and place files in `js` folder.

Create a file structure to facilitate general jade code, functionality and object oriented paradigms.  Start by creating several folders in `./views/`.  Create a `navbar`, `footer` and `user` folder and in each create a `modal` and `mixins` folder include the base of './views`.  In each folder create an `index.jade` file if it doesn't already exist.

With files in place the structure is now ready for some preparation code such as using Bootstrap and jQuery in the application template.  Open `./mixins/index.jade` to begin creating a `CSS` and `JS` mixin method.  Jade mixins are useful because they allow developers to clump and reuse code segments.  In addition use a block segment to extend the layout to each template file which allows them to include unique Cascading Style Sheets (CSS) and JavaScript files that might not be needed in the global template.

```jade
// View File: mixins/index.jade 
mixin CSS()
  link(rel='stylesheet', href='/css/style.css')
  link(rel='stylesheet', href='/css/bootstrap.css')
  link(rel='stylesheet', href='/css/bootstrap-theme.css')
  block CSS

mixin JS()
  script(src='/js/jquery-2.1.1.js')
  script(src='/js/bootstrap.js')
  script(src='/js/uuid.js')
  block JS
```

Now we call these mixins into our global template `./layout.jade`.   The `CSS` mixin method will be placed in the header and replaces the `style.css` include statement.  At the bottom of the body content the place the `JS` mixin method.  Build on the `body` and enclose the `block content` marker in a view-port flexible container provided by Bootstrap.  

```jade
// View File: layout.jade
include ./mixins/index.jade

doctype html
html
  head
    title= title
    +CSS()

  body
    .container
      .row
        .col-xs-12.col-sm-12.col-md-12.col-lg-12
          block content
    +JS()
```

The template is eventually going to give users the ability to edit or delete their account. In the  `./routes` the `index.js` file and have the homepage response send a data object by the name of `profile` with the user session object data.

```jade
  /* GET home page. */
  router.get('/', function(req, res) {
    res.render('index', { profile: req.session.user, title: 'Express' });
  });
```

## Navbar & Footer Components
Two of the most important sections users will look for are the navigation bar and footer because they provide the main features of your web application.  Bootstrap provides a great tool-set for creating a responsive navigation and provides you all the code you need.  

Call the files already generated into the `layout.jade` file.  For sake of pleasant viewing, force some space at the beginning and end of the `block content` marker.

```jade
// View File: layout.jade 
include ./mixins/index.jade

doctype html
html
  head
    title= title
    +CSS()

  body
    include ./navbar/index.jade
    br
    .container
      .row
        .col-xs-12.col-sm-12.col-md-12.col-lg-12
          block content
    br
    br
    include ./footer/index.jade
    +JS()
``` 

With the `navbar` component from Bootstrap you have the option of creating a truly responsive user experience between desktop and mobile environments.  Here we will only cover implementing the a basic `navbar` component structure.  If you would like to make your `navbar` even more responsive to the user environment you'll want to use the collapse component (Code provided on Bootstrap homepage).

In the `./views/navbar` folder open the `index.jade` file.  To utilize the `profile` object and make the `navbar` recognize if a user or guest exist for content display decisions.

```jade
// View File: navbar/index.jade
nav.navbar.navbar-default
  .container
    .navbar-header
      a.navbar-brand(href="/") Simple Secure Auth
    .navbar-right
      if profile.type == 'guest'
        // Guest navigation here
      else
        // User navigation here
```

When developing a footer it is good to position it at the bottom of a window.  A common mistake is seen on pages with little content in a large view area.  When this happens users see a large blank, non styles section that just seems like a half (I prefer a little more crude word to be used here, a#$) done job.  Bootstrap doesn't have a footer component but it does provide the Affix JavaScript library and some very nice sample code with good footer navigation practices.  We will go ahead and use the sample code they provided.

This code requires some custom CSS to be inserted in the `styles.css` file.

```css
/* CSS File: style.css */
@CHARSET "UTF-8";
* {	
  margin: 0;
  padding: 0;
}
html {
  position: relative;
  min-height: 100%;
}
body {
  /* Margin bottom by footer height */
  margin-bottom: 60px;
}
/* Sticky footer styles
-------------------------------------------------- */

.footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  /* Set the fixed height of the footer here */
  height: 60px;
  background-color: #f5f5f5;
  padding-top:20px;
  margin-top:20px;
}
.footer img {
  margin:-10px;
  padding:0px;
}
.footer > .container {
  padding-right: 15px;
  padding-left: 15px;
}

body {
  font: 14px "Lucida Grande", Helvetica, Arial, sans-serif;
}

a {
  color: #00B7FF;
}
```

The footer code consist of a `footer` class and container.

```jade
// View File: footer/index.jade
.footer
  .container
    small.text-muted Copyright by Me!
```

## Site Navigation
Now that we have our navigation components setup our Express routes need to be defined.  This is done by deciding what pages and functionalities will be presented in our Jade template.  Since we are building a simple authentication and user management application that is going to be used with MongoDB we can cover the complete CRUD principle in this guide.  

To accomplish the goals of this application we need the following user navigation items:
  * Read    | Sign In
  * Create  | New Account
  * Update | Edit Profile
  * Delete  | Remove Profile

In addition:
  * Index      | Homepage
  * Logout   | Forget the signed in user information. 
  * Error      | Something wrong happened! ( no link needed )

This means a route will be needed for a edit profile page in the `./routes/users.js` file.  Instead of pulling a list of users make the default `/` route get the `users/index` view and send the `profile` object created earlier.

```node
router.get('/', function(req, res) {
    res.render('user/index', {profile: req.session.user, title:'Edit Profile'});
});
```

In the `./navbar` folder edit the `index.jade` and `mixin/index.jade`.  Here put code in place to facilitate the functionalities that are going to be presented to the user.  When signed in the `navbar` will display  allow a user to click their name to view and edit/delete their account and sign-out.

```jade
// View File: navbar/mixins/index.jade
mixin signin()
  button.btn.btn-default.navbar-btn(type="button") Sign in
  
mixin signedin()
  p.navbar-text 
    a.navbar-link(href="/user") #{profile.firstname} #{profile.lastname}
    |  |  
    a.navbar-link(href='/user/signout') Sign Out
    
mixin register()
  button.btn.btn-primary.navbar-btn(type="button") Register
```

```jade
// View File: navbar/index.jade
include ./mixins/index.jade

nav.navbar.navbar-default
  .container
    .navbar-header
      a.navbar-brand(href="/") Simple Secure Auth
    .navbar-right
      if profile.type == 'guest'
        +signin()  
        |  
        +register()
      else
        +signedin()
```

## Modal and Forms
When you have finished defining the users navigation routes we can move on to and give those routes something to look at and use by preparing the user environment to interact with MongoDB.  Using the Bootstrap modal and a efficient way of structuring the component into a Jade template for  an authentication process (create account, read credentials) is relatively simple.  When that is done then forms can be placed in the functionalities that require the user to send information.

