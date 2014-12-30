# Jade and Bootstrap
It has become a common practice to use template engines like Jade Template Engine with the Express framework.  Template engines give developers the ability to increase reuse and interact with data.  To increase accessibility and provide stability in a responsive design with cross platform capability the Bootstrap framework can be use.  Using Bootstrap code snips from the framework homepage of it many other code snip sites and tutorials with Jade is quick and easy and can greatly enhance the Bootstrap framework. 

## Navbar & Footer Components
Two of the most important sections users will look for are the navigation bar and footer because they provide the main features of your web application.  Bootstrap provides a great tool-set for creating a responsive navigation and provides you all the code you need.  

With the navbar component from Bootstrap you have the option of creating a truly responsive user experience between desktop and mobile environments.  Here we will only cover implementing the a basic navbar component structure.  If you would like to make your navbar even more responsive to the user environment you'll want to use the collapse component (Code provided on Bootstrap homepage).

When developing a footer it is good to position it at the bottom of a window.  A common mistake is seen on pages with little content in a large view area.  When this happens users see a large blank, non styles section that just seems like a half (I prefer a little more crude word to be used here, a#$) done job.  Bootstrap doesn't have a footer component but it does provide the Affix JavaScript library and some very nice sample code with good footer navigation practices.  We will go ahead and use the sample code they provided.

## Site Navigation
Now that we have our navigation components setup our Express routes need to be defined.  This is done by deciding what pages and functionalities will be presented in our Jade template.  Since we are building a simple authentication and user management application that is going to be used  with MongoDB we can cover the complete CRUD principle in this guide.  

To accomplish the goals of this application we need the following user navigation items:

  * Read    | Sign In
  * Create  | New Account
  * Update | Edit Profile
  * Delete  | Remove Profile

In addition:

  * Index      | Homepage
  * Logout   | Forget the signed in user information. 
  * Error      | Something wrong happened! ( no link needed )

## Modal and Forms
When you have finished defining the users navigation routes we can move on to and give those routes something to look at and use by preparing the user environment to interact with MongoDB.  Using the Bootstrap modal and a efficient way of structuring the component into a Jade template for  an authentication process (create account, read credentials) is relatively simple.  When that is done then forms can be placed in the functionalities that require the user to send information.

