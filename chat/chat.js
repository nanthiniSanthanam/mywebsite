// Global state variables
let messages = [];
let isTyping = false;
let selectedModel = "gpt-4";

// Helper: Format a timestamp into a short time string.
function formatTime(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// Update the chat messages area based on the messages array and typing status.
function updateChatMessages() {
  const chatMessages = document.getElementById("chat-messages");
  chatMessages.innerHTML = ""; // Clear current messages

  messages.forEach((message) => {
    const messageDiv = document.createElement("div");
    messageDiv.className = "message " + message.sender + (message.isError ? " error" : "");
    
    const contentDiv = document.createElement("div");
    contentDiv.className = "message-content";
    
    const textDiv = document.createElement("div");
    textDiv.className = "message-text";
    textDiv.textContent = message.text;
    
    const timestampDiv = document.createElement("div");
    timestampDiv.className = "message-timestamp";
    timestampDiv.textContent = formatTime(message.timestamp);
    
    contentDiv.appendChild(textDiv);
    contentDiv.appendChild(timestampDiv);
    messageDiv.appendChild(contentDiv);
    chatMessages.appendChild(messageDiv);
  });

  // If LLM is typing, show a typing indicator.
  if (isTyping) {
    const typingDiv = document.createElement("div");
    typingDiv.className = "message ai typing";
    
    const contentDiv = document.createElement("div");
    contentDiv.className = "message-content";
    
    const typingIndicator = document.createElement("div");
    typingIndicator.className = "typing-indicator";
    // Create three span elements to simulate a typing animation.
    for (let i = 0; i < 3; i++) {
      const span = document.createElement("span");
      typingIndicator.appendChild(span);
    }
    
    contentDiv.appendChild(typingIndicator);
    typingDiv.appendChild(contentDiv);
    chatMessages.appendChild(typingDiv);
  }

  // Add an element to scroll into view.
  const messagesEnd = document.createElement("div");
  messagesEnd.id = "messagesEnd";
  chatMessages.appendChild(messagesEnd);

  scrollToBottom();
}

// Scroll to the bottom of the chat messages.
function scrollToBottom() {
  const messagesEnd = document.getElementById("messagesEnd");
  if (messagesEnd) {
    messagesEnd.scrollIntoView({ behavior: "smooth" });
  }
}

// Handle form submission to send a user message.
function sendMessage(e) {
  e.preventDefault();
  const inputField = document.getElementById("chat-input");
  const inputValue = inputField.value.trim();
  if (!inputValue) return;

  // Add user's message.
  const userMessage = {
    id: Date.now(),
    text: inputValue,
    sender: "user",
    timestamp: new Date().toISOString(),
  };
  messages.push(userMessage);
  inputField.value = "";
  updateChatMessages();

  // Show typing indicator and simulate LLM response.
  isTyping = true;
  updateChatMessages();
  simulateLLMResponse(inputValue, selectedModel);
}

// Simulate an LLM API response.
function simulateLLMResponse(userInput, model) {
  setTimeout(() => {
    let aiResponse;
    const lowerInput = userInput.toLowerCase();
    if (lowerInput.includes("hello") || lowerInput.includes("hi")) {
      aiResponse = "Hello! How can I assist you today?";
    } else if (lowerInput.includes("weather")) {
      aiResponse =
        "I don't have access to real-time weather data, but I can help you find weather information for your area. Would you like me to explain how to check the weather?";
    } else if (lowerInput.includes("time")) {
      aiResponse = "The current time is " + new Date().toLocaleTimeString() + ".";
    } else if (lowerInput.includes("help")) {
      aiResponse =
        "I can help you with various tasks like answering questions, providing information, brainstorming ideas, or just having a conversation. What would you like to know about?";
    } else if (lowerInput.includes("thank")) {
      aiResponse = "You're welcome! If you have any more questions, feel free to ask.";
    } else if (lowerInput.includes("code") || lowerInput.includes("programming")) {
      aiResponse =
        "I can help with programming questions and explain code examples. What language or specific concept are you interested in?";
    } else {
      const responses = [
        "That's an interesting point. Can you tell me more about it?",
        "I understand. Let me know if you'd like more information about this topic.",
        "Thanks for sharing that. Is there anything specific you're looking to learn?",
        "I see what you mean. How can I help you further with this?",
        "That's a great question. I'd be happy to explore this topic with you.",
      ];
      aiResponse = responses[Math.floor(Math.random() * responses.length)];
    }

    // Append model information for demonstration.
    aiResponse += " (Responded using " + model + ")";
    const aiMessage = {
      id: Date.now(),
      text: aiResponse,
      sender: "ai",
      timestamp: new Date().toISOString(),
    };
    messages.push(aiMessage);
    isTyping = false;
    updateChatMessages();
  }, 1500);
}

// Clear chat history and start fresh.
function clearChat() {
  messages = [
    {
      id: Date.now(),
      text: "Chat history cleared. How can I help you today?",
      sender: "ai",
      timestamp: new Date().toISOString(),
    },
  ];
  updateChatMessages();
}

// Set up event listeners once the DOM content is loaded.
document.addEventListener("DOMContentLoaded", () => {
  // Add an initial welcome message.
  messages.push({
    id: 1,
    text: "Hello! I'm your AI assistant. How can I help you today?",
    sender: "ai",
    timestamp: new Date().toISOString(),
  });
  updateChatMessages();

  // Model selection
  document.getElementById("model-select").addEventListener("change", (e) => {
    selectedModel = e.target.value;
  });

  // Chat form submission
  document.getElementById("chat-form").addEventListener("submit", sendMessage);

  // Clear chat button
  document.getElementById("clear-chat-btn").addEventListener("click", clearChat);

  // Sample questions: set input when a sample question is clicked.
  document.querySelectorAll(".sample-question").forEach((item) => {
    item.addEventListener("click", function () {
      // Remove surrounding quotes if any
      document.getElementById("chat-input").value = this.textContent.replace(/"/g, "");
    });
  });
});
