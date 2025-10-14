/**
 * Mobile Controls Module - Handles virtual joystick and mobile button input
 * - joystickActive: Flag indicating if the virtual joystick is currently active.
 * - joystickTouchId: Identifier of the current joystick touch.
 * - joystickStartX: Starting X position of the joystick touch.
 * - joystickStartY: Starting Y position of the joystick touch.
 * - joystickMaxDistance: Maximum distance the joystick can move from its start position.
 */
let joystickActive = false;
let joystickTouchId = null;
let joystickStartX = 0;
let joystickStartY = 0;
let joystickMaxDistance = 60;

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
    showInitialJoystick();
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
    showInitialJoystick();
    bindMobileButton('btnJump', 'Space');
    bindMobileButton('btnThrow', 'F');
  }
}

/**
 * Shows the joystick at an initial default position (bottom-left area).
 */
function showInitialJoystick() {
  const joystickArea = document.getElementById('joystickArea');
  const rect = joystickArea.getBoundingClientRect();
  const initialX = 75;
  const initialY = rect.height - 75;

  const base = document.getElementById('joystickBase');
  const stick = document.getElementById('joystickStick');

  base.style.left = initialX + 'px';
  base.style.top = initialY + 'px';
  stick.style.left = initialX + 'px';
  stick.style.top = initialY + 'px';

  base.classList.remove('d-none');
  stick.classList.remove('d-none');
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
    showInitialJoystick();
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
 * Resets the joystick state to default values, clearing keyboard inputs and deactivating the joystick.
 */
function resetJoystickState() {
  keyboard.Left = false;
  keyboard.Right = false;
  joystickActive = false;
  joystickTouchId = null;
}

/**
 * Disables the context menu for mobile control buttons only to prevent right-click interactions.
 */
function disableContextMenu() {
  const btnJump = document.getElementById('btnJump');
  const btnThrow = document.getElementById('btnThrow');
  const joystickArea = document.getElementById('joystickArea');

  [btnJump, btnThrow, joystickArea].forEach((element) => {
    if (element) {
      element.addEventListener('contextmenu', (event) => {
        event.preventDefault();
      });
    }
  });
}
