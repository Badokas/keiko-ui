export function getCursorPositionInSvg(svg, mouseCoords, scaleFactor = 1) {
  let pt = svg.createSVGPoint();

  pt.x = mouseCoords.x;
  pt.y = mouseCoords.y;

  let { x, y } = pt.matrixTransform(svg.getScreenCTM().inverse());
  x = x / scaleFactor; // adjusted X
  y = y / scaleFactor; // adjusted Y

  return { x, y };
}
