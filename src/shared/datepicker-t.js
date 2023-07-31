import ReactPortal from './portal';
import React, { useState, useRef, useEffect } from 'react';

export const ToolTip = ({ width = 256, space = 16, children, clickEvent, show }) => {
  const [visible, setVisible] = useState(true);
  const [style, setStyle] = useState(false);
  let el = useRef(null);

  const showTooltip = () => {
    // some maths to align the tooltip with whatever you just hovered over (the 'target')
    // or maybe it's 'math' in your weird country
    const style = { width }; // this style object will be passed as the tooltip's 'style' prop
    const dimensions = el.current.getBoundingClientRect(); // where on the screen is the target

    // center align the tooltip by taking both the target and tooltip widths into account
    style.left = dimensions.left + dimensions.width / 2 - width / 2;
    style.left = Math.max(space, style.left); // make sure it doesn't poke off the left side of the page
    style.left = Math.min(style.left, document.body.clientWidth - width - space); // or off the right

    if (dimensions.top < window.innerHeight / 2) {
      // the top half of the page
      // when on the top half of the page, position the top of the tooltip just below the target (it will stretch downwards)
      style.top = dimensions.top + dimensions.height + space;
    } else {
      // when on the bottom half, set the bottom of the tooltip just above the top of the target (it will stretch upwards)
      style.bottom = window.innerHeight - dimensions.top + space;
    }

    // setVisible(true);
    setStyle(style);
  };

  const hideTooltip = () => {
    // setVisible(false);
  };

  useEffect(() => {
    if (clickEvent) showTooltip;
  }, [clickEvent]);
  //   useEffect(() => {
  //     if (typeof show === 'boolean') setVisible(show);
  //     showTooltip;
  //   }, [show]);

  return (
    <div // a span so it's valid HTML no matter where it's used
      //   onMouseOver={showTooltip}
      //   onMouseOut={hideTooltip}
      className="portal-tooltip-trigger-text"
      ref={el}
    >
      {children}

      {visible && (
        <ReactPortal>
          <div // this <div> isn't actually a child of the <span> above. Magic portal.
            className="portal-tooltip-body"
            style={style}
          >
            {children}
          </div>
        </ReactPortal>
      )}
    </div>
  );
};

export default ToolTip;
