<script>
  function approximateLineSegments() {
    //origin of axes
    var origin = {
      x: -Math.PI,
      y: 0
    };

    var amplitude = 1; // wave amplitude
    var rarity = 0.5; // point spacing
    var freq = 0.5; // angular frequency
    var phase = Math.PI * 2; // phase angle

    let lines = [];

    for (var i = -30; i < 40; i++) {
      lines.push({
        x1: (i - 1) * rarity + origin.x,
        y1: Math.sin(freq * (i - 1 + phase)) * amplitude + origin.y,
        x2: i * rarity + origin.x,
        y2: Math.sin(freq * (i + phase)) * amplitude + origin.y
      });
    }

    return lines;
  }

  function approximateCubicBezier(controls) {
    let data = "";

    //Bezier control points:
    //https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths#Curve_commands
    var controlStart = controls[0],
      control1 = controls[1],
      control2 = controls[2],
      controlEnd = controls[3],
      x,
      y,
      x1,
      y1,
      x2,
      y2,
      quarterX = controlEnd[0],
      startX = -(4 * quarterX),
      negateY = false;

    function negateYs() {
      if (negateY) {
        y = -y;
        y1 = -y1;
        y2 = -y2;
      }
    }

    for (x = startX; x < 6; ) {
      if (x === startX) {
        y = controlStart[1];
        x1 = x + control1[0];
        y1 = control1[1];

        negateYs();
        data = "M" + [x, y] + " C" + [x1, y1] + " ";
      } else {
        //x1/y1 are always "mirrors" of the previous x2/y2,
        //so we can use the simpler "S" syntax instead of a new "C":
        data += " S";
      }

      //Going from y=0 to y=+-1:
      x2 = x + control2[0];
      y2 = control2[1];
      x += quarterX;
      y = controlEnd[1];
      negateYs();
      data += [x2, y2] + " " + [x, y];

      //Going from y=+- back to y=0:
      x2 = x + quarterX - control1[0];
      y2 = control1[1];
      x += quarterX;
      y = controlStart[1];
      negateYs();
      data += " S" + [x2, y2] + " " + [x, y];

      negateY = !negateY;
    }

    console.log(data);
    return data;
  }

  //Draw some sine waves:

  var controlsGood = [[0, 0], [0.5, 0.5], [1, 1], [Math.PI / 2, 1]];
  var controlsBetter = [
    [0, 0],
    [0.512286623256592433, 0.512286623256592433],
    [1.002313685767898599, 1],
    [Math.PI / 2, 1]
  ];
  // approximateCubicBezier(sinesGroup, controlsGood, "stroke:red;");
  // approximateCubicBezier(
  //   sinesGroup,
  //   controlsBetter,
  //   "stroke:lime;stroke-dasharray:.5,.1"
  // );
</script>

<style>
  .a {
    stroke: blue;
  }
  .b {
    stroke: red;
  }
  .c {
    stroke: lime;
    stroke-dasharray: 0.5, 0.1;
  }
</style>

<a
  href="http://stackoverflow.com/questions/13932704/how-to-draw-sine-waves-with-svg-js">
  http://stackoverflow.com/questions/13932704/how-to-draw-sine-waves-with-svg-js
</a>

<svg
  xmlns="http://www.w3.org/2000/svg"
  width="100%"
  height="400"
  viewBox="-7.5 -1.5 15 3"
  preserveAspectRatio="xMidYMid slice">

  <g id="axes" stroke="black" stroke-width=".01">
    <line x1="-100" y1="0" x2="100" y2="0" />
    <line x1="0" y1="-100" x2="0" y2="100" />
  </g>

  <g id="sines" fill="none" stroke-width=".02">
    {#each approximateLineSegments() as item}
      <line class="a" {...item} />
    {/each}

    <path class="b" d={approximateCubicBezier(controlsGood)} />
    <path class="c" d={approximateCubicBezier(controlsBetter)} />
  </g>
</svg>

<span class="l">Line segments</span>
<span class="cb">Cubic Bezier</span>
<span class="cb2">Cubic Bezier (better)</span>
