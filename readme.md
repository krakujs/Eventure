# Eventure Project

## Setup

1. Unzip the project
   ```
   ```

2. Install dependencies:
   - For the frontend: ( I have some unresolved issues for frontend but everything works fine )
     ```
     cd eventure-frontend
     npm install --force
     ```
   - For the backend:
     ```
     cd node-chat-system
     npm install
     ```

## Running the Application

1. Start the java backend server:
   ```
   cd Eventure
    ./mvnw spring-boot:run      
    ``` 

2. Start the backend server:
   ```
   cd node-chat-system
   npm start
   ``` 

3. Start the frontend development server:
   ```
   cd eventure-frontend
   npm start
   ```


The application should now be running and accessible in your web browser on localhost:3000.

## Okta Authentication
As we are using Okta for OAuth, you cannot directly signup. Read ## User Creation for more. 
For testing purposes, you can use the following Okta credentials:

- Email: 2001ujjwalsolanki@gmail.com
- Password: Epita@123

Please note that this is a test user account.

## User Creation

To add new users to the project:
1. You can request the software owner to create a user for you as we need to update the tokens in java application.properties to add a new okta user/organization. Furthermore the organization can add as many sub-users as they want and they will all be connected with the same project. 
2. Alternatively, you can ask owner for a personal link to create your own Okta user under this project.

The benefit is that if we wish to give/sell this to a company/organization then they can create their own okta account and create users as reqruied.
1. Users will be prompted to change their passwords later when they first login. 

## Note

If you encounter any issues or need additional users created, please contact the project administrator @UjjwalSolanki.