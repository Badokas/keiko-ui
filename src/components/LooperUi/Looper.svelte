<script>
  import {
    createMachine,
    state,
    action,
    transition,
    guard,
    immediate
  } from "robot3";
  import { useMachine } from "./hooks.js";

  let mainButtonText = "Rec";
  let isTempoRunning = false;
  let isQuantizeEnabled = true;
  let isBufferEmpty = true;

  const AC = {
    EMPTY: "empty", // it's empty and stopped
    WAITING_TO_REC: "waiting_to_record", // waiting for quantization (if tempo is running)
    RECORDING: "recording", //
    WAITING_TO_PLAY: "waiting_to_play",
    PLAYING: "playing",
    WAITING_TO_OVD: "waiting_to_overdub",
    OVERDUBBING: "overdubbing",
    WAITING_TO_STOP: "waiting_to_stop",
    STOPPED: "stopped",
    CLEARING: "clearing"
  };

  const commands = [
    "toggle", // main button
    "quantized_beat"
  ];

  // const mainButtonMachine = createMachine({
  //   waiting_to_record: state(),
  //   recording: state(),
  //   waiting_to_play: state(),
  //   playing: state(),
  //   waiting_to_overdub: state()
  // });

  const machine = createMachine({
    [AC.EMPTY]: state(
      transition(
        "toggle",
        AC.WAITING_TO_REC,
        action(() => {
          console.log("waiting_to_record");
          mainButtonText = "waiting_to_record";
        })
      ),
      transition("undo", AC.STOPPED, guard(isBufferEmpty))
    ),
    [AC.WAITING_TO_REC]: state(
      immediate(
        AC.RECORDING,
        guard(() => {
          if (!isTempoRunning) {
            console.log("recording");
            mainButtonText = "recording";
            return true;
          }
          return false;
        })
      ),
      transition(
        "quantized_beat",
        AC.RECORDING,
        action(() => {
          console.log("recording");
          mainButtonText = "recording";
        })
      ),
      transition("clear", AC.CLEARING),
      transition("stop", "empty"),
      transition("undo", "empty")
    ),
    [AC.RECORDING]: state(
      transition(
        "toggle",
        AC.WAITING_TO_PLAY,
        action(() => {
          console.log("waiting_to_play");
          mainButtonText = "waiting_to_play";
        })
      ),
      transition("clear", AC.CLEARING),
      transition("stop", "empty"),
      transition("undo", "empty")
    ),
    [AC.WAITING_TO_PLAY]: state(
      immediate(
        AC.PLAYING,
        guard(() => {
          if (!isTempoRunning) {
            console.log("playing");
            mainButtonText = "playing";

            return true;
          }

          return false;
        })
      ),
      transition(
        "quantized_beat",
        AC.PLAYING,
        action(() => {
          console.log("playing");
          mainButtonText = "playing";
        })
      ),
      transition("clear", AC.CLEARING)
    ),
    [AC.PLAYING]: state(
      transition(
        "toggle",
        AC.OVERDUBBING,
        action(() => {
          console.log("overdubbing");
          mainButtonText = "overdubbing";
        })
      ),
      transition("stop", "waiting_to_stop"),
      transition("clear", AC.CLEARING)
    ),
    [AC.WAITING_TO_OVD]: state(
      transition("quantized_beat", AC.OVERDUBBING),
      transition("clear", AC.CLEARING)
    ),
    [AC.OVERDUBBING]: state(
      transition(
        "toggle",
        AC.PLAYING,
        action(() => {
          console.log("playing");
          mainButtonText = "playing";
        })
      ),
      transition("stop", AC.WAITING_TO_STOP),
      transition("clear", AC.CLEARING)
    ),
    [AC.WAITING_TO_STOP]: state(
      immediate(
        AC.STOPPED,
        guard(() => {
          if (!isQuantizeEnabled) {
            console.log("stopped");
            mainButtonText = "stopped";
            return true;
          }
          return false;
        })
      ),
      transition(
        "quantized_beat",
        AC.STOPPED,
        action(() => {
          console.log("stopped");
          mainButtonText = "stopped";
        })
      ),
      transition("clear", AC.CLEARING)
    ),
    [AC.STOPPED]: state(
      transition(
        "toggle",
        AC.PLAYING,
        action(() => {
          console.log("playing");
          mainButtonText = "playing";
        })
      ),
      transition("clear", AC.CLEARING)
    ),
    [AC.CLEARING]: state(
      immediate(
        "empty",
        action(() => {
          console.log("clearing");
          mainButtonText = "Rec";
        })
      )
    )
  });

  const [current, send] = useMachine(machine);
</script>

<div>Main display: {$current}</div>
<div>isBufferEmpty: {isBufferEmpty}</div>
<button on:click={() => send('toggle')}>{mainButtonText}</button>
<button on:click={() => send('undo')}>Undo</button>
<button on:click={() => send('clear')}>Clear</button>
<button on:click={() => send('stop')}>Stop</button>
<button on:click={() => send('quantized_beat')}>dev_quantized_beat</button>
