// Explanation:

// This file contains the sendRequestToOpenAI function encapsulated for clarity.
// It uses environment variables for the OpenAI API key (OPENAI_API_KEY).
// It sends the request with appropriate headers and content body.
// It handles errors, including:
// Retrying rate-limited requests with exponential backoff.
// Re-throwing other errors for the caller to handle.

const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;

export async function sendRequestToOpenAI(prompt) {
  const config = {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    }
  };

  const body = {
    model: 'gpt-3.5-turbo-instruct',
    prompt: prompt,
    temperature: 0.7,
    max_tokens: 150
  };

  try {
    const response = await axios.post('https://api.openai.com/v1/completions', body, config);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 429) {
      const retryAfter = error.response.headers['retry-after'] || 30; // Use a default if not available
      console.log(`Retrying after ${retryAfter} seconds due to rate limiting...`);
      await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
      return sendRequestToOpenAI(prompt); // Retry on rate limiting
    } else {
      console.error('Error calling OpenAI API:', error);
      throw error; // Re-throw for caller handling
    }
  }
}
