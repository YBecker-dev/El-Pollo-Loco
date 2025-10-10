/**
 * Mobile Controls Module - Handles virtual joystick and mobile button input
 */

/**
 * Binds touch event handlers to a mobile button for keyboard simulation.
 * @param {string} buttonId - The ID of the button element to bind
 * @param {string} keyboardProperty - The keyboard property to simulate (e.g., 'Space', 'F')
 */
function bindMobileButton(buttonId, keyboardProperty) {
  const button = document.getElementById(buttonId);
  bindTouchHandler(button, keyboardProperty, 'touchstart', true);
  bindTouchHandler(button, keyboardProperty, 'touchend', false);
}

/**
 * Binds a touch event handler to a button element for keyboard simulation.
 * @param {HTMLElement} button - The button element to bind the handler to
 * @param {string} keyboardProperty - The keyboard property to modify
 * @param {string} eventType - The touch event type ('touchstart' or 'touchend')
 * @param {boolean} value - The value to set for the keyboard property
 */
function bindTouchHandler(button, keyboardProperty, eventType, value) {
  button.addEventListener(
    eventType,
    (event) => {
      if (event.cancelable) {
        event.preventDefault();
      }
      keyboard[keyboardProperty] = value;
    },
    { passive: false }
  );
}

/**
 * Toggles the visibility of mobile controls based on screen width and show parameter.
 * @param {boolean} show - Whether to show or hide the mobile controls
 */
function toggleMobileControlsVisibility(show) {
  const mobileControls = document.getElementById('mobileControls');
  if (show && window.innerWidth <= 1370) {
    mobileControls.classList.remove('d-none');
  } else {
    mobileControls.classList.add('d-none');
  }
}

/**
 * Sets up mobile controls including virtual joystick and button bindings if screen width is small enough.
 */
function setupMobileControls() {
  if (window.innerWidth <= 1370) {
    setupVirtualJoystick();
    bindMobileButton('btnJump', 'Space');
    bindMobileButton('btnThrow', 'F');
  }
}

/**
 * Sets up event listeners for the virtual joystick touch interactions.
 */
function setupVirtualJoystick() {
  const joystickArea = document.getElementById('joystickArea');

  joystickArea.addEventListener('touchstart', handleJoystickTouchStart, { passive: false });
  joystickArea.addEventListener('touchmove', handleJoystickTouchMove, { passive: false });
  joystickArea.addEventListener('touchend', handleJoystickTouchEnd, { passive: false });
  joystickArea.addEventListener('touchcancel', handleJoystickTouchEnd, { passive: false });
}

/**
 * Handles the start of a joystick touch interaction.
 * @param {TouchEvent} event - The touch event
 */
function handleJoystickTouchStart(event) {
  event.preventDefault();
  if (joystickActive) return;

  const touch = event.touches[0];
  joystickTouchId = touch.identifier;
  const startPos = calculateTouchPosition(touch, document.getElementById('joystickArea'));

  joystickStartX = startPos.x;
  joystickStartY = startPos.y;

  showJoystick(startPos);
  joystickActive = true;
}

/**
 * Handles joystick movement during touch interaction.
 * @param {TouchEvent} event - The touch event
 */
function handleJoystickTouchMove(event) {
  event.preventDefault();
  if (!joystickActive) return;

  const touch = findCurrentTouch(event.touches);
  if (!touch) return;

  const touchPos = calculateTouchPosition(touch, document.getElementById('joystickArea'));
  const stickPos = calculateStickPosition(touchPos);

  updateJoystickVisual(stickPos);
  updateKeyboardFromJoystick(touchPos);
}

/**
 * Handles the end of a joystick touch interaction.
 * @param {TouchEvent} event - The touch event
 */
function handleJoystickTouchEnd(event) {
  event.preventDefault();
  if (!joystickActive) return;

  if (isCurrentTouchEnded(event)) {
    hideJoystick();
    resetJoystickState();
  }
}

/**
 * Calculates the touch position relative to a given area element.
 * @param {Touch} touch - The touch object
 * @param {HTMLElement} area - The area element to calculate position relative to
 * @returns {Object} Object with x and y coordinates
 */
function calculateTouchPosition(touch, area) {
  const rect = area.getBoundingClientRect();
  return {
    x: touch.clientX - rect.left,
    y: touch.clientY - rect.top,
  };
}

/**
 * Calculates the constrained stick position within the maximum distance from the start position.
 * @param {Object} touchPos - The current touch position with x and y coordinates
 * @returns {Object} The constrained stick position
 */
function calculateStickPosition(touchPos) {
  const deltaX = touchPos.x - joystickStartX;
  const deltaY = touchPos.y - joystickStartY;
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

  if (distance > joystickMaxDistance) {
    const angle = Math.atan2(deltaY, deltaX);
    return {
      x: joystickStartX + Math.cos(angle) * joystickMaxDistance,
      y: joystickStartY + Math.sin(angle) * joystickMaxDistance,
    };
  }
  return touchPos;
}

/**
 * Shows the virtual joystick at the specified position.
 * @param {Object} position - The position to show the joystick at with x and y coordinates
 */
function showJoystick(position) {
  const base = document.getElementById('joystickBase');
  const stick = document.getElementById('joystickStick');

  base.style.left = position.x + 'px';
  base.style.top = position.y + 'px';
  stick.style.left = position.x + 'px';
  stick.style.top = position.y + 'px';

  base.classList.remove('d-none');
  stick.classList.remove('d-none');
}

/**
 * Updates the visual position of the joystick stick element.
 * @param {Object} position - The position to move the stick to with x and y coordinates
 */
function updateJoystickVisual(position) {
  const stick = document.getElementById('joystickStick');
  stick.style.left = position.x + 'px';
  stick.style.top = position.y + 'px';
}

/**
 * Updates keyboard state based on joystick touch position for movement controls.
 * @param {Object} touchPos - The current touch position with x and y coordinates
 */
function updateKeyboardFromJoystick(touchPos) {
  const deltaX = touchPos.x - joystickStartX;
  const threshold = 20;
  keyboard.Left = deltaX < -threshold;
  keyboard.Right = deltaX > threshold;
}

/**
 * Finds the current touch in the touches list by identifier.
 * @param {TouchList} touches - The list of current touches
 * @returns {Touch|null} The current touch or null if not found
 */
function findCurrentTouch(touches) {
  for (let i = 0; i < touches.length; i++) {
    if (touches[i].identifier === joystickTouchId) {
      return touches[i];
    }
  }
  return null;
}

/**
 * Checks if the current touch has ended in the touch event.
 * @param {TouchEvent} event - The touch event
 * @returns {boolean} True if the current touch has ended
 */
function isCurrentTouchEnded(event) {
  if (event.type === 'touchend' || event.type === 'touchcancel') {
    for (let i = 0; i < event.changedTouches.length; i++) {
      if (event.changedTouches[i].identifier === joystickTouchId) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Hides the virtual joystick elements by adding the 'd-none' class.
 */
function hideJoystick() {
  const base = document.getElementById('joystickBase');
  const stick = document.getElementById('joystickStick');
  base.classList.add('d-none');
  stick.classList.add('d-none');
}

/**
 * Resets the joystick state to default values, clearing keyboard inputs and deactivating the joystick.
 */
function resetJoystickState() {
  keyboard.Left = false;
  keyboard.Right = false;
  joystickActive = false;
  joystickTouchId = null;
}

/**
 * Disables the context menu for specified elements to prevent right-click interactions.
 */
function disableContextMenu() {
  const canvas = document.getElementById('canvas');
  const gameContainer = document.getElementById('gameContainer');
  const title = document.getElementById('title');

  [canvas, gameContainer, title, document.body].forEach((element) => {
    element.addEventListener('contextmenu', (event) => {
      event.preventDefault();
    });
  });
}
