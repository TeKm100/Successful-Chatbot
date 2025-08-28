// Wait until the DOM is fully loaded before running this script
document.addEventListener("DOMContentLoaded", function () {
  // Get references to important HTML elements
  const chatbotContainer = document.getElementById("chatbot-container");
  const closeBtn = document.getElementById("close-btn");
  const sendBtn = document.getElementById("send-btn");
  const chatBotInput = document.getElementById("chatbot-input");
  const chatbotIcon = document.getElementById("chatbot-icon");

  // Show chatbot when icon is clicked
  chatbotIcon.addEventListener("click", () => {
    chatbotContainer.classList.remove("hidden");
    chatbotIcon.style.display = "none";
  });

  // Hide chatbot when close button is clicked
  closeBtn.addEventListener("click", () => {
    chatbotContainer.classList.add("hidden");
    chatbotIcon.style.display = "flex";
  });

  // Send message on button click
  sendBtn.addEventListener("click", sendMessage);

  // Send message on Enter key press
  chatBotInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
  });
});

// Function to send a message
function sendMessage() {
  const userMessage = document.getElementById("chatbot-input").value.trim();
  if (userMessage) {
    appendMessage("user", userMessage); // Display user message
    document.getElementById("chatbot-input").value = ""; // Clear input
    getBotResponse(userMessage); // Get bot reply
  }
}

// Function to add messages to the chat window
function appendMessage(sender, message, tempId = null) {
  const messageContainer = document.getElementById("chatbot-messages");
  const messageElement = document.createElement("div");

  messageElement.classList.add("message", sender);
  messageElement.textContent = message;

  // ✅ If it's a temporary message (like "...analysing"), tag it
  if (tempId) {
    messageElement.setAttribute("id", tempId);
  }

  messageContainer.appendChild(messageElement);

  // ✅ Auto-scroll to the latest message
  messageContainer.scrollTop = messageContainer.scrollHeight;

  return messageElement;
}

// Async function to get bot's response (local data + Gemini API fallback)
async function getBotResponse(userMessage) {
  const lowerCaseMessage = userMessage.toLowerCase();
  let botMessage = null;

  // ✅ Add a temporary "thinking/analysing" message
  const loadingId = "loading-msg-" + Date.now();
  appendMessage("bot", "...analysing 🤔", loadingId);

  // Local dataset of responses
  const responses = {
    "hello": "Hi there! How can I help you?",
    "how are you": "I'm a bot, but I'm doing great! Thanks for asking.",
    "what is your name": "I don't have a name. I am a simple chatbot.",
    "bye": "Goodbye! Have a great day.",
    "what is the date?": getLocalDate(),
    "what is the current date?": getLocalDate(),
    "date": getLocalDate(),
    "okay": "Alright😊 if there's anything you want me to help you with, please don't hesitate to ask!",
    "today's date": getLocalDate(),
    "what day is it?": getLocalDate(),
    "what is a computer?": "A computer is an electronic device that manipulates information, or data. It can store, retrieve, and process data.",
    "how does the internet work?": "The internet is a global network of interconnected computer networks that communicate using standard protocols. Data is split into packets and sent across the network.",
    "who created the internet?": "The internet was developed over many years by scientists and engineers. Vint Cerf and Bob Kahn are often credited as the 'fathers of the internet'.",
    "what is javascript?": "JavaScript is a programming language that enables interactive and dynamic content on websites.",
    "what is a chatbot?": "A chatbot is a computer program designed to simulate conversation with human users.",

    // ✅ Your FULafia info stays intact
    "about fulafia": "The Federal University of Lafia (FULafia) is a public university in Lafia, Nasarawa State, Nigeria. It was established in 2011.",
    "fulafia location": "FULafia is located in Lafia, Nasarawa State, Nigeria.",
    "contact fulafia": "Contact information is on their official website: fulafia.edu.ng.",
    "how to apply to fulafia": "You must choose FULafia in JAMB, meet the cut-off, and register for post-UTME on their portal.",
    "fulafia post utme portal": "Usually found at fulafia.edu.ng or my.fulafia.edu.ng under 'Admissions'.",
    "fulafia admission list": "Check via JAMB CAPS and the FULafia official portal.",
    "fulafia student portal": "Log in at my.fulafia.edu.ng or studenthub.fulafia.edu.ng to register courses, pay fees, etc.",
    "how to pay fulafia school fees": "Log in, generate a Remita invoice (RRR), and pay online or at a bank.",
    "fulafia clearance": "After admission, pay your fees, then go through online and physical clearance at your department."
  };

  // 1. Exact match
  if (responses[lowerCaseMessage]) {
    botMessage = responses[lowerCaseMessage];
  } else {
    // 2. Keyword match
    for (const key in responses) {
      if (lowerCaseMessage.includes(key.toLowerCase())) {
        botMessage = responses[key];
        break;
      }
    }
  }

  // 3. Fallback to Gemini API
  if (botMessage === null) {
    const API_KEY = "AIzaSyCC5TrqyhNJ3d1gB9NI9Q5M7SzJwiSRmCk"; // ⚠️ Replace with your actual Gemini API key
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: userMessage }] }]
        }),
      });

      const data = await response.json();
      if (!data.candidates || !data.candidates.length) {
        throw new Error("No response from Gemini API");
      }
      botMessage = data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error("Error:", error);
      botMessage = "⚠️ Sorry, I'm having trouble responding. Please try again.";
    }
  }

  // ✅ Remove the "...analysing 🤔" message once response is ready
  const loadingElement = document.getElementById(loadingId);
  if (loadingElement) {
    loadingElement.remove();
  }

  // Small delay to mimic "thinking"
  setTimeout(() => {
    appendMessage("bot", botMessage);
  }, 500);
}

// Helper to get today's date in a nice format
function getLocalDate() {
  const date = new Date();
  const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
}
