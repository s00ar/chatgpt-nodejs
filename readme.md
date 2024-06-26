Project Overview
This backend application integrates WhatsApp with OpenAI's ChatGPT to automatically respond to messages. It uses the whatsapp-web.js library to interface with WhatsApp through a web browser session controlled by Puppeteer. The application is built on Node.js and uses Express for handling HTTP requests.

Version Updates
This version introduces enhancements and critical updates including:

Puppeteer Configuration: Adjusted Puppeteer's parameters to ensure stability and performance when interacting with WhatsApp Web.
Error Handling Improvements: Enhanced how errors are caught during the WhatsApp client initialization to provide fallbacks and retries, improving the robustness of the connection.
Dynamic Manifest Handling: Implemented a method to dynamically fetch the manifest file necessary for whatsapp-web.js to function, accommodating changes in WhatsApp Web's deployment.
Project Structure
.env: Contains environment variables for configuration.
apiHandler.js: Functions for sending requests to OpenAI's ChatGPT model.
authMiddleware.js: Middleware for JWT-based authentication.
database.js: Configuration for MySQL database connection.
ignoredNumberRoutes.js: Express routes for managing numbers that should be ignored.
index.js: Entry point for the application, sets up the Express server and the WhatsApp client.
messageHandler.js: Contains logic for handling incoming messages and formulating responses.
package.json: Defines project dependencies and metadata.
userRoutes.js: Routes for user authentication and management.
Key Files and Their Functions
index.js
Sets up the WhatsApp client with robust error handling and the Express server. Integrates routes and middleware for user management and number ignoring functionalities.

Key Updates in This Version:

javascript
Copy code
const client = new Client({
  puppeteer: {
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      devtools: true,  // Enables devtools to assist in debugging Puppeteer actions
  },
  webVersionCache: {
    type: "remote",
    remotePath:
      "https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html",
  },
});
Puppeteer's Configuration: Enhanced for better performance in a headless environment.
Web Version Cache: A new approach to fetch the manifest dynamically which points to a remote HTML file that conforms to the expected structure by whatsapp-web.js.
database.js
Configures a pool for MySQL connections to handle database interactions efficiently.

messageHandler.js
Processes incoming messages to determine if they should be ignored or responded to with the aid of OpenAI's ChatGPT.

apiHandler.js, authMiddleware.js, userRoutes.js, ignoredNumberRoutes.js
Handle various aspects of the API's functionality from user authentication, managing ignored numbers, and interfacing with OpenAI's API.

Installation
To set up the project:

Clone the repository:
bash
Copy code
git clone <repository-url>
Install dependencies:
bash
Copy code
npm install
Set up environment variables:
Duplicate .env.example to .env and fill out the necessary values.
Start the application:
bash
Copy code
npm start
Usage
Scan the QR code generated in the console with WhatsApp to link it with your device. The server handles incoming messages and uses ChatGPT to generate appropriate responses, which are then sent back through WhatsApp.#   c h a t g p t - n o d e j s  
 