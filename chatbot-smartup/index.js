import openai from "./config/open-ai.js";
import readlineSync from 'readline-sync';
import colors from 'colors';

const MAX_HISTORY_LENGTH = 10; // Maximum conversation history length for context

async function main() {
  console.log(colors.bold.blue('Welcome to your SmartUp AI assistant!'));
  console.log(colors.bold.green("What questions do you have, or what would you like to talk about?"));

  const chatHistory = []; // Keeps the conversation history

  while (true) {
    const userInput = readlineSync.question(colors.yellow('You: '));

    try {
      // Build messages with limited history for better context and performance
      const messages = chatHistory.slice(-MAX_HISTORY_LENGTH).map(([role, content]) => ({ role, content }));
      messages.push({ role: 'user', content: userInput });

      const chatCompletion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: messages,
      });

      const completionText = chatCompletion.data.choices[0].message.content;

      console.log('User Input:', userInput);
      if (userInput.toLowerCase() === 'exit') {
        console.log(colors.green('Bot: ') + completionText);
        break; // Use `break` to cleanly exit the loop
      }

      console.log(colors.green('Bot: ') + completionText);

      // Update history with limited size to balance memory efficiency and context
      chatHistory.push(['user', userInput]);
      chatHistory.push(['assistant', completionText]);
      chatHistory.splice(0, chatHistory.length - MAX_HISTORY_LENGTH); // Maintain maximum size
    } catch (error) {
      console.error(colors.red('Error:'), error); // Log errors for debugging and user awareness
    }
  }
}

main();