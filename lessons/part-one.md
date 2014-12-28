# Create a Baseline Template
When beginning a project development plan engineers will need to translate the designs to a structure for coding, testing and maintaining the software.  Theses designs provide engineers with the information required to develop a baseline template that facilitates data the project.  We can use the Express tool to accomplish this quickly and apply the best practices for the framework. 

## Generating An Express Application
To do this you need to make sure you have installed Express4 globally, you can refer to earlier tutorials about this.  This requires the use of a command-line console.  Open your console and navigate to the the project workspace folder where you will be saving your project.  Run the following command:
	[command-line]

## Defining Structure to Facilitate Data
In creating maintainable software there is a concept called the fundamentals of formatting.  Key components to this concept are structure and readability.  Structure in terms of code development can mean indentation, object and component separation.  Readability can be obtained by using meaningful naming conventions.  Another concept that needs to be accounted for is testing because it consumes a large part of the project budget.
Because this system is specifically designed as a CRM we want to define the user data model that we can use in our database and code.  This will be a simple object with a users:
  * User Identification
  * First Name
  * Last Name
  * Email
  * Password

## SSL and Simple Session Management
To secure system data from things like wiretapping and man-in-the-middle attacks the system needs to initiate use of the Secure Socket Layer (SSL).  By adding the SSL component to our Hypertext Transfer Protocol (HTTP) we create what is know as HTTPS connection.  SSL establishes a encrypted link between the user and the system in addition to verifying the systems authenticity though 3rd party services over HTTP.

### HTTPS for Development and Testing
When developing and testing an application it is to much trouble and expense to use a registered SSL certificate so we use a generalized replication that resembles the requirements of security goals.  To generate a self signed certificate for development and testing you will need to have OpenSSL installed.  Begin by generating a key and cert file:
	[command-line]
When done we simply load the key and certificate files into our node application and set out HTTPS communication options.

### HTTPS for Implementation
Once done with an projects development and testing we need to purchase or register our SSL certificates so our user base isn't driven away by their browsers security warning.  There are several ways to go about obtaining a SSL certificates and some are free to the open source community.  Here is a quick list of whats available:
  [list of ssl options]

### Session Management
In order to take advantage of the SSL connection for user authentication we need to begin using session management.  	In this guide we only review the basic implementation of session management but there are further steps that can be taken to gain more information and control of a user sessions.
