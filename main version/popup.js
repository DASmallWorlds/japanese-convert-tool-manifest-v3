document.getElementById("convertButton").addEventListener("click", function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: convertJapaneseCharacters,
    });
  });
});

function convertJapaneseCharacters() {
  // Read the dictionary file
  fetch(chrome.runtime.getURL("dictionary.json"))
    .then((response) => response.json())
    .then((dictionary) => {
      // Function to recursively traverse and replace text nodes
      function replaceText(node) {
        if (node.nodeType === Node.TEXT_NODE) {
          let textContent = node.textContent;
          for (const simplified in dictionary) {
            const traditional = dictionary[simplified];
            const regex = new RegExp(simplified, "g");
            textContent = textContent.replace(regex, traditional);
          }
          node.textContent = textContent;
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          // Recursively process child elements
          for (const childNode of node.childNodes) {
            replaceText(childNode);
          }
        }
      }

      // Replace characters on the page
      replaceText(document.body);
    });
}
