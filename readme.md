# Api ts template

This template allows you to quickly launch an express API without much coniguration.


# Configuration

- The configuration is quick you just need to add your database in the .env and also add a JWT_ENCRYPTION

-   You can also add entities to your database ~/src/core/models (using typeORM https://typeorm.io/#/)
 There is an example available with the User table
 
 - For routes add them in ~ /src/routes/api
	 If your routes are in the secured folder, a token will have to be sent to access the route
	 otherwise the API return "unauthorized"

