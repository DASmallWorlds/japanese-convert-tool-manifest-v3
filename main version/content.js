chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.enabled) {
    // Load the dictionary
    chrome.runtime.getURL('dictionary.js', function (url) {
      fetch(url)
        .then((response) => response.text())
        .then((data) => {
          const dictionary = eval(data); // Assuming it's safe to evaluate

          // Helper function to replace characters in a text node
          function replaceText(node) {
            if (node.nodeType === Node.TEXT_NODE) {
              let text = node.textContent;
              dictionary.forEach(([simplified, traditional]) => {
                const regex = new RegExp(simplified, 'g');
                text = text.replace(regex, traditional);
              });
              node.textContent = text;
            }
          }

          // Traverse the DOM and replace characters
          function traverse(node) {
            replaceText(node);
            for (const childNode of node.childNodes) {
              traverse(childNode);
            }
          }

          // Start traversing from the document body
          traverse(document.body);
        })
        .catch((error) => {
          console.error('Error loading dictionary:', error);
        });
    });
  } else {
    // Disable the conversion logic here
  }
});
