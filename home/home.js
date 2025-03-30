document.addEventListener("DOMContentLoaded", function () {
    // Get DOM elements
    const loadingSpinner = document.getElementById("loading-spinner");
    const heroContent = document.getElementById("hero-content");
    const welcomeMessageElem = document.getElementById("welcome-message");
    const featureGrid = document.getElementById("feature-grid");
  
    // Simulate fetching data with a timeout
    setTimeout(function () {
      const welcomeMessage = "Welcome to Your Amazing Website";
      const features = [
        "User Authentication & Profile Management",
        "Interactive Data Visualization",
        "LLM Integration for Smart Responses",
        "Form Validation and Submission",
        "API Data Fetching and Display",
      ];
  
      // Update the welcome message
      welcomeMessageElem.textContent = welcomeMessage;
  
      // Hide the spinner and show hero content
      loadingSpinner.style.display = "none";
      heroContent.style.display = "block";
  
      // Create feature cards dynamically
      features.forEach((feature, index) => {
        const featureCard = document.createElement("div");
        featureCard.className = "feature-card";
  
        const heading = document.createElement("h3");
        heading.textContent = "Feature " + (index + 1);
        featureCard.appendChild(heading);
  
        const paragraph = document.createElement("p");
        paragraph.textContent = feature;
        featureCard.appendChild(paragraph);
  
        const link = document.createElement("a");
        link.href = "#feature-" + (index + 1);
        link.textContent = "Learn more →";
        featureCard.appendChild(link);
  
        featureGrid.appendChild(featureCard);
      });
    }, 1500);
  });
  