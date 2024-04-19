import axios from 'axios';
import pool from './database.js';

// Function to check if a phone number is in the ignore list
async function isNumberIgnored(phoneNumber) {
  try {
    const [results] = await pool.query('SELECT 1 FROM ignored_numbers WHERE phone_number = ?', [phoneNumber]);
    return results.length > 0;
  } catch (error) {
    console.error('Error querying the database:', error);
    // Return false if there's an error querying the database
    return false;
  }
}

// Main function to handle incoming messages
export async function handleIncomingMessage(message) {
  try {
    // Check if the sender's phone number is in the ignore list
    const ignore = await isNumberIgnored(message.from);
    if (ignore) {
      console.log(`Message from ${message.from} ignored.`);
      return 'Message ignored due to number being in the ignore list';  // Modify this to return a placeholder message or log it
    }

    // Placeholder for fetching chat history and building the prompt
    const chat = await message.getChat();
    const messages = await chat.fetchMessages({ limit: 5 });
    const conversation = messages.map(m => m.body).join('\n');

    const DEFAULT_PROMPT = process.env.DEFAULT_PROMPT || 'How can I assist you today?';  // Changed default prompt
    const prompt = `${DEFAULT_PROMPT}\n\n${conversation}`;

    // Send the prompt to OpenAI's API and process the response
    const response = await sendRequestToOpenAI(prompt);
    return processApiResponse(response);
  } catch (error) {
    console.error('Error handling the message:', error);
    // Return a placeholder message if an error occurs
    return 'Currently unable to process your message. Please try again later.';
  }
}

// Function to send a request to OpenAI's API
async function sendRequestToOpenAI(prompt) {
  try {
    const response = await axios.post('https://api.openai.com/v1/completions', {
      model: 'text-davinci-003',
      prompt: prompt,
      max_tokens: 150,
      temperature: 0.7,
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    // Throw an error or handle it as needed
    throw new Error('Failed to fetch response from OpenAI: ' + error.message);
  }
}

// Function to process the API response
function processApiResponse(response) {
  if (!response.choices || response.choices.length === 0 || !response.choices[0].text) {
    console.error('Incomplete or empty response from OpenAI:', response);
    return "I'm sorry, I didn't catch that. Could you repeat?";
  }
  return response.choices[0].text.trim();
}

// Optional: Modify these functions if needed to handle errors or incomplete data better
function getErrorMessage() {
  return 'Oops, something went wrong. Please try again later.';
}

function getIncompleteResponseMessage() {
  return "I didn't understand that. Could you rephrase your question?";
}
