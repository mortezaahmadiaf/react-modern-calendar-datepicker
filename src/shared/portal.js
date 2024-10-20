import { createPortal } from 'react-dom';
import { useState, useLayoutEffect } from 'react';

// create portal just with this id
const portalIds = ['date-picker-container'];

const createWrapperAndAppendToBody = wrapperId => {
  // create div element
  const wrapperElement = document.createElement('div');
  // assign id to created div
  wrapperElement.setAttribute('id', wrapperId);
  // add div to body tag of project
  document.body.appendChild(wrapperElement);
  return wrapperElement;
};

export const ReactPortal = ({ children, wrapperId = 'date-picker-container' }) => {
  const [wrapperElement, setWrapperElement] = useState(null);

  useLayoutEffect(() => {
    let element = document.getElementById(wrapperId);
    let systemCreated = false;
    // if element is not found with wrapperId or wrapperId is not provided,
    // create and append to body
    if (!element && portalIds.includes(wrapperId)) {
      systemCreated = true;
      element = createWrapperAndAppendToBody(wrapperId);
    }
    setWrapperElement(element);

    return () => {
      // delete the programatically created element
      if (systemCreated && element.parentNode) {
        element.parentNode.removeChild(element);
      }
    };
  }, [wrapperId]);

  // wrapperElement state will be null on very first render.
  if (wrapperElement === null) return null;
  return createPortal(children, wrapperElement);
};

export default ReactPortal;
