// This line waits for the entire HTML document to be loaded before running the script.
// It ensures that all the HTML elements we want to manipulate (like buttons and divs) exist before we try to access them.
document.addEventListener("DOMContentLoaded", function () {
  // Get references to all the important HTML elements by their IDs.
  // We store them in variables so we can easily access and manipulate them later.
  const chatbotContainer = document.getElementById("chatbot-container");
  const clostBtn = document.getElementById("close-btn");
  const sendBtn = document.getElementById("send-btn");
  const chatBotInput = document.getElementById("chatbot-input");
  const chatbotIcon = document.getElementById("chatbot-icon");

  // This is the event listener for the floating chatbot icon.
  // When the user clicks the icon, it removes the 'hidden' class from the chatbot container
  // to make it visible and hides the icon itself.
  chatbotIcon.addEventListener("click", () => {
    chatbotContainer.classList.remove("hidden");
    chatbotIcon.style.display = "none";
  });

  // This is the event listener for the 'close' button inside the chatbot.
  // When clicked, it adds the 'hidden' class back to the chatbot container to hide it
  // and makes the floating icon visible again.
  clostBtn.addEventListener("click", () => {
    chatbotContainer.classList.add("hidden");
    chatbotIcon.style.display = "flex";
  });

  // This listener handles the 'Send' button click.
  // When the button is clicked, it calls the sendMessage function.
  sendBtn.addEventListener("click", sendMessage);

  // This listener handles the 'Enter' key press in the input field.
  // If the user presses the 'Enter' key, it also calls the sendMessage function,
  // making the user experience faster and more intuitive.
  chatBotInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
  });
});

// This function is the main logic for sending a user's message.
function sendMessage() {
  // Get the text from the input field and remove any extra spaces at the beginning or end.
  const userMessage = document.getElementById("chatbot-input").value.trim();
  // Check if the user has actually typed something. If the input is empty, do nothing.
  if (userMessage) {
    // Call appendMessage to display the user's message in the chat window.
    appendMessage("user", userMessage);
    // Clear the input field to get ready for the next message.
    document.getElementById("chatbot-input").value = "";
    // Call getBotResponse to get a reply from the bot.
    getBotResponse(userMessage);
  }
}

// This function adds a new message bubble to the chat window.
// It takes two arguments: 'sender' (to determine if it's a 'user' or 'bot' message) and the 'message' text.
function appendMessage(sender, message) {
  const messageContainer = document.getElementById("chatbot-messages");
  // Create a new div element for the message.
  const messageElement = document.createElement("div");
  // Add CSS classes to style the message correctly (e.g., 'message user' or 'message bot').
  messageElement.classList.add("message", sender);
  // Set the text content of the message element.
  messageElement.textContent = message;
  // Add the new message element to the chat window.
  messageContainer.appendChild(messageElement);
  // This line automatically scrolls the chat window to the bottom, so the user can always see the latest message.
  messageContainer.scrollTop = messageContainer.scrollHeight;
}

// This is the core function that decides the bot's response.
// It's an 'async' function because it might need to wait for a response from the Gemini API.
async function getBotResponse(userMessage) {
  // Convert the user's message to lowercase for consistent matching.
  const lowerCaseMessage = userMessage.toLowerCase();
  // Initialize botMessage to null. We'll only assign a value if we find a response.
  let botMessage = null;

  // This is our custom, local training data.
  // We use an object where keys are the questions/keywords and values are the predefined answers.
  const responses = {
  // General chat responses
  "hello": "Hi there! How can I help you?",
  "how are you": "I'm a bot, but I'm doing great! Thanks for asking.",
  "what is your name": "I don't have a name. I am a simple chatbot.",
  "bye": "Goodbye! Have a great day.",
  "what is the date?": getLocalDate(),
  "what is the current date?": getLocalDate(),
  "date": getLocalDate(),
  "okay": "Alright😊 if there's anything you me to help you with please don't hesistate to ask me!",
  "today's date": getLocalDate(),
  "what day is it?": getLocalDate(),
  "what is a computer?": "A computer is an electronic device that manipulates information, or data. It has the ability to store, retrieve, and process data.",
  "how does the internet work?": "The internet is a global network of interconnected computer networks that communicate using a standard set of protocols. Information is broken into packets and sent across this network.",
  "who created the internet?": "The internet was not created by a single person but was developed over many years by a group of scientists and engineers. Vint Cerf and Bob Kahn are often credited as the 'fathers of the internet' for their work on TCP/IP protocols.",
  "what is javascript?": "JavaScript is a programming language that enables interactive web pages. It's often used for front-end development to add dynamic behavior to a website.",
  "what is a chatbot?": "A chatbot is a computer program designed to simulate conversation with human users, especially over the internet.",

  // FULafia-specific information (merged into the same object)
  "about fulafia": "The Federal University of Lafia (FULafia) is a public university located in Lafia, Nasarawa State, Nigeria. It was established in 2011.",
  "what is fulafia": "The Federal University of Lafia (FULafia) is a public university located in Lafia, Nasarawa State, Nigeria. It was established in 2011.",
  "fulafia location": "FULafia is located in Lafia, Nasarawa State, Nigeria.",
  "contact fulafia": "You can find contact information for FULafia on their official website: fulafia.edu.ng. For specific issues, you may need to check the relevant department's page.",
  "how to apply to fulafia": "To apply to FULafia, you must have chosen the university as your first choice in JAMB and meet the cut-off mark. You then need to register for the post-UTME screening on the university's portal.",
  "fulafia post utme portal": "The FULafia Post-UTME application portal is typically found on the university's main website or a dedicated admissions portal. Look for the 'Admissions' or 'Prospective Students' section on fulafia.edu.ng or my.fulafia.edu.ng.",
  "fulafia admission requirements": "Admission requires a minimum JAMB score (the specific score varies by year and course), at least five O'Level credits including English and Mathematics, and successful completion of the post-UTME screening. Specific departments may have higher cut-off marks.",
  "fulafia admission list": "The FULafia admission list is usually released on the JAMB Central Admission Processing System (CAPS) and also on the university's official portal. You can check your admission status by logging into your JAMB CAPS account.",
  "how to check admission status": "You can check your admission status by logging into your JAMB CAPS account. If admitted, you will see a congratulatory message and can accept or reject the offer.",
  "fulafia student portal": "The FULafia student portal is where students can log in to perform various tasks like course registration and school fees payment. The URL for the portal is typically my.fulafia.edu.ng or studenthub.fulafia.edu.ng.",
  "how to log in to fulafia portal": "To log in to the FULafia portal, you need your Matriculation Number or Applicant ID and your password. If you are a new student, you may use your Applicant ID and the password you created during your application.",
  "fulafia portal password reset": "If you forget your password, there is usually a 'Forgot Password' link on the login page of the portal. You will need to enter your user ID or email to reset it.",
  "fulafia student login": "Use your Matriculation Number or Applicant ID and password to log in to the FULafia student portal at studenthub.fulafia.edu.ng or my.fulafia.edu.ng.",
  "how to pay fulafia school fees": "To pay your school fees at FULafia, you need to log in to the student portal, generate a payment invoice with a unique RRR code, and then make the payment online using a card or at any commercial bank.",
  "fulafia school fees payment guide": "Login to the portal, go to the 'FEES' menu, select the session, and click 'Generate invoice'. You can then pay via Remita using options like USSD, bank transfer, or card payment.",
  "fulafia school fees portal": "The school fees payment is done directly on the FULafia student portal after you log in. Payments are typically processed via the Remita platform.",
  "what is remita": "Remita is a payment gateway used by FULafia and many other institutions in Nigeria to process online and bank-based payments.",
  "fulafia acceptance fee": "After gaining admission, new students must pay an acceptance fee before they can proceed with other registrations. This is done on the student portal after accepting the admission offer on JAMB CAPS.",
  "fulafia course registration": "Course registration is done on the student portal after you have successfully paid your school fees. You must register your courses for each semester before the deadline.",
  "fulafia clearance": "After being admitted and paying your fees, you will need to go through a physical and online clearance process. This involves presenting your original credentials at your department for verification.",
  "fulafia matriculation number": "Your matriculation number is assigned to you after you have successfully paid your acceptance and school fees. It will be sent to your registered email address or appear on your dashboard after you log in again.",
};

  // 1. First, we check if the user's message is an exact match to a key in our local data.
  if (responses[lowerCaseMessage]) {
    botMessage = responses[lowerCaseMessage];
  } else {
    // 2. If there's no exact match, we loop through our data to see if the user's message contains any of our keywords.
    for (const key in responses) {
      if (lowerCaseMessage.includes(key.toLowerCase())) {
        botMessage = responses[key];
        break; // Exit the loop as soon as we find a match to avoid multiple responses.
      }
    }
  }

  // 3. This is the fallback logic. If we still haven't found a response from our local data, we call the Gemini API.
  if (botMessage === null) {
    const API_KEY = "AIzaSyCC5TrqyhNJ3d1gB9NI9Q5M7SzJwiSRmCk";
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

    try {
      // This is an asynchronous fetch request to the Gemini API.
      // We use 'await' to pause the function until the API returns a response.
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // The body of the request sends the user's message to the API.
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: userMessage }],
            },
          ],
        }),
      });

      // Parse the JSON data from the API response.
      const data = await response.json();

      // Check for errors or empty responses from the API.
      if (!data.candidates || !data.candidates.length) {
        throw new Error("No response from Gemini API");
      }

      // Extract the bot's response text from the API data.
      botMessage = data.candidates[0].content.parts[0].text;
    } catch (error) {
      // If there's an error with the API call (e.g., network issues), this code will run.
      console.error("Error:", error);
      botMessage = "Sorry, I'm having trouble responding. Please try again.";
    }
  }

  // Add a slight delay (500 milliseconds) to make the bot's response feel more natural,
  // as if it's "thinking."
  setTimeout(() => {
    // Finally, display the bot's message in the chat.
    appendMessage("bot", botMessage);
  }, 500);
}

// This is a new helper function to get the current date from the user's browser.
function getLocalDate() {
  const date = new Date();
  // Use toLocaleDateString to format the date in a readable format.
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}