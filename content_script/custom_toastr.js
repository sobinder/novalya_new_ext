let customToastrCount = 0; // Keep track of the number of custom toastr messages displayed

function showCustomToastr(type, message, timeout, showCountdown, fixToastr, showStopButton) {
  // Create the custom toastr container
  const customToastr = document.createElement('div');
  customToastr.id = 'customToastr' + customToastrCount; // Append a unique ID
  customToastr.className = 'custom-toastr';

  // Increment the custom toastr count
  customToastrCount++;

  // Create the toastr content container
  const toastrContent = document.createElement('div');
  toastrContent.className = 'toastr-content';

  // Create the icon element
  const toastrIcon = document.createElement('img');
  toastrIcon.id = 'toastrIcon';
  toastrIcon.src = `${chrome.runtime.getURL('assets/images/loading-forever.gif')}`;
  toastrIcon.alt = 'Toastr Icon';

  // Set the class name based on the type
  if (type === 'success') {
    // toastrIcon.className = 'fa fa-circle-o-notch fa-spin'; // Use 'fas' for Font Awesome Solid icons
    customToastr.classList.add('success-color');
  } else if (type === 'error') {
    // toastrIcon.className = 'fa fa-circle-o-notch fa-spin'; // Use 'fas' for Font Awesome Solid icons
    customToastr.classList.add('error-color');
  } else {
    // toastrIcon.className = 'fa fa-circle-o-notch fa-spin'; // Use 'fas' for Font Awesome Solid icons
    customToastr.classList.add('info-color');
  }

  // Create the message element with countdown timer
  const toastrMessage = document.createElement('div');
  toastrMessage.id = 'toastrMessage';
  toastrMessage.className = 'toastr-message';

  // Display the initial message
  toastrMessage.textContent = message;

  // Create a button element for the "Stop" button if showStopButton is true
  if (showStopButton) {
    const stopButton = document.createElement('button');
    stopButton.textContent = 'Stop';
    stopButton.id = 'stop_run';
    // Add a click event handler to the button
    stopButton.addEventListener('click', function () {
      stopButton.textContent = 'Stopped';
      adjustToastrPositions();
    });

    // Append the "Stop" button to the content container
    toastrContent.appendChild(stopButton);
    toastrContent.appendChild(document.createElement('span'));
  }

  // Append the icon, message, and button (if applicable) to the content container
  toastrContent.appendChild(toastrIcon);
  toastrContent.appendChild(toastrMessage);

  // Append the content container to the custom toastr container
  customToastr.appendChild(toastrContent);

  // Append the custom toastr to the body
  document.body.appendChild(customToastr);

  // Set the icon font size to control its size
  toastrIcon.style.fontSize = '24px'; // Adjust the size as needed

  if (showCountdown && !fixToastr) {
    // Update the countdown timer every second
    const countdownInterval = setInterval(function () {
      timeout -= 1000;
      if (timeout <= 0) {
        // Clear the countdown interval when the timeout is reached
        clearInterval(countdownInterval);
        // Hide the toastr only if showCountdown is true and fixToastr is false
        if (showCountdown && !fixToastr) {
          customToastr.style.display = 'none';
          // Remove the custom toastr from the DOM after it's hidden
          document.body.removeChild(customToastr);
          // Decrement the custom toastr count
          customToastrCount--;
          // Adjust the positions of remaining custom toastr messages
          adjustToastrPositions();
        }
      } else {
        // Update the toastr message with the remaining time
        toastrMessage.textContent = message + ' (in ' + timeout / 1000 + ' seconds)';
      }
    }, 1000);
  } else if (!fixToastr) {
    const countdownInterval = setInterval(function () {
      timeout -= 1000;
      if (timeout <= 0) {
        // Clear the countdown interval when the timeout is reached
        clearInterval(countdownInterval);
        // Hide the toastr only if fixToastr is false
        if (!fixToastr) {
          customToastr.style.display = 'none';
          // Remove the custom toastr from the DOM after it's hidden
          document.body.removeChild(customToastr);
          // Decrement the custom toastr count
          customToastrCount--;
          // Adjust the positions of remaining custom toastr messages
          adjustToastrPositions();
        }
      }
    }, 1000);
  }

  // Show the toastr
  customToastr.style.display = 'block';

  // Adjust the positions of custom toastr messages
  adjustToastrPositions();
}



// Function to adjust the positions of custom toastr messages
function adjustToastrPositions() {
  const toastrHeight = 60; // Adjust the height as needed
  const marginBetweenToastrs = 10; // Adjust the margin as needed
  let topOffset = 0;

  for (let i = 0; i < customToastrCount; i++) {
    const toastr = document.getElementById('customToastr' + i);
    if (toastr) {
      toastr.style.top = topOffset + 'px';
      topOffset += toastrHeight + marginBetweenToastrs;
    }
  }
}
