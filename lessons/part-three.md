# MongoDB using Mongoose
MongoDB is a popular noSQL solution for a database management system that works well with Agile development principles.  In short it give developers the flexibility to change or add to our model as they innovate their ideas.   Node.js and MongoDB need to communicate in order for us to carry out our application requirements and in order to make writing validation, casting and business logic boilerplates simple the package called Mongoose can be used.  

Some engineers may be asking why the not use the MongoDB package for Node.js?  The answer is Mongoose is backed by the MongoDB team in addition to their native bindings package. Each package provides special characteristics for different sets of requirements. Our requirements for the CRM allow the more simplistic and capability driven package, Mongoose.

## Defining Schema and Code Structure
When working with a DBMS its is a good idea to make sure it can meet the requirements of you CRUD endpoints.  What this means is the DBMS can effectively receive a specific request  that triggers a specific response.  Looking to what data is being transacted, begin making decisions on how to apply CRUD endpoints.  

Before we start writing code we need to facilitate a file structure that helps us reuse and test code efficiently and separates data that is consistently used like models and configuration settings.  In this lesson we choose to separate code into sub-folders that represent object oriented concepts.  Folders that are going to generated though this tutorial in ./data/user` will be `config`, `model`, `create`, `read`, `update` and `delete`, each to contain an `index.js` file.  This will be a simple object schema that will be placed in the model file `./data/user/models/user.js` with fields for:

  * User Identification (MongoDB Object ID)
  * First Name (String)
  * Last Name (String)
  * Email (String)
  * Password (String)

## Create & Secure User Object
It is a good idea to encrypt sensitive information that only the user should know or see such as the password in our user object model.  To do this a package called Node Bcrypt will be used that allows people to apply the popular key derivation function (KDF) for password encryption designed by Niels Provos and David Mazières.  

Utilizing callback functions helps provide a layer of separation or requirements in our data interaction.  Using the structure previously defined create a generic connection for creating a new user in the database in the `./data/user/create/index.js` file.  

Moving on create the function that will bind to the CRM application.  One thing that needs to be done is to open a MongoDB connection to communicate the create request.  

## Read & Verify User Object


## Update Object


## Delete Object


