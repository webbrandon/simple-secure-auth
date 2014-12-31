# MongoDB using Mongoose
MongoDB is a popular noSQL solution for a database management system that works well with Agile development principles.  In short it give developers the flexibility to change or add to our model as they innovate their ideas.   Node.js and MongoDB need to communicate in order for us to carry out our application requirements and in order to make writing validation, casting and business logic boilerplates simple the package called Mongoose can be used.  

Some engineers may be asking why the not use the MongoDB package for Node.js?  The answer is Mongoose is backed by the MongoDB team in addition to their native bindings package. Each package provides special characteristics for different sets of requirements. Our requirements for the CRM allow the more simplistic and capability driven package, Mongoose.

## Defining Schema and Code Structure
When working with a DBMS its is a good idea to make sure it can meet the requirements of you CRUD endpoints.  What this means is the DBMS can effectively receive a specific request  that triggers a specific response.  

Before we start writing code we need to facilitate a file structure that helps us reuse and test code efficiently and separates data that is consistently used like models and configuration settings.  In this lesson we choose to separate code into sub-folders that represent object oriented concepts.  Folders that are going to generated though this tutorial in `./data/user` will be `config`, `model`, `create`, `read`, `update` and `delete`, each to contain an `index.js` file.  

Looking to what data is being transacted, begin making decisions on how to apply CRUD endpoints.  This will be a simple object schema that will be placed in the model file `./data/user/models/user.js` with fields for:

  * User Identification (MongoDB Object ID)
  * First Name (String)
  * Last Name (String)
  * Email (String)
  * Password (String)

Moving on create the function that will bind to the CRM application.  One thing that needs to be done is to open a MongoDB connection to communicate the create request.  In the file `./data/user/config/index.js` add database configurations that will be used for connecting to the user database.

## Create & Secure User Object
It is a good idea to encrypt sensitive information that only the user should know or see such as the password in our user object model.  To do this a package called Node Bcrypt will be used that allows people to apply the popular key derivation function (KDF) for password encryption designed by Niels Provos and David Mazières.  To do this open the user model created earlier.

Utilizing callback functions helps provide a layer of separation or requirements in our data interaction.  Using the structure previously defined create a generic connection for creating a new user in the database in the `./data/user/create/index.js` file.  

Now that everything is in place to create a secured user object expose the application to it.  In the `./data/user/index.js` file create a exports function that will open the database, creates  user object if the email address doesn't exist.  Call this function in the `./routes/user.js` file at the create user route.  

In the example the user session is passed to this request so they are signed in if successful in creating an account but this is not necessary, just remove the `sess` value from being passed and used.  If you decide to keep this functionality it will require the use of the `isUser` exported function discussed in the next section.

## Read & Verify User Object
Like utilizing callback functions for the creating a user object, do so again with for the read and verify There will be three required functions to begin the authentication process.  First need to verify the user against submitted credentials, then want to create a id check for pages that only the use should see(The point of the authentication process).  Since in the last step of the example sends want to send the user  to their profile you want to make sure the information being edited is current(e. g. An administrator edits their profile.).  In `./data/user/read/index.js` file create three exported functions.
  
In the `./data/user/index.js` file create a exports function that will open the database, read  user object database and verify user password and login credentials.  When making the connection between `isUser` function and the application, use the default Node.js export object structure `req, res, next` and place in a export function called `grant`.  

Call these function in the `./routes/users.js` file.  When using `grant`, place it in between the route request and  the callback function of the route requiring user authentication.  The user session object must be passed for these processes.

## Update Object
This a much simpler process to conduct than other CRUD principles that are being used in these lessons thanks to the preparation of data being in earlier lessons.  In `./data/user/read/index.js` file there will be one exported function that utilizes callback functionality.
  
In the `./data/user/index.js` file create a exports function that will open the database, update and verify.  Call the function in the `./routes/users.js` file.  This does require the `grant` component.  The user session object must be passed for these processes.

## Delete Object


