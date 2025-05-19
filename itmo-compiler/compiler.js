let idx = 0
let s = `
// Mandelbrot set visualization

let WIDTH = 80;
let HEIGHT = 24;
let SCALE = 1000;
let MAX_ITER = 100;
let gradient = " .''----~~~~::::;;;;;;=======+++++++********????????%%%%%%%%%%&&&&&&&&&&$$$$$$$$$$############@@@@@@";

for let y = 0; y < HEIGHT; y += 1  {
    for let x = 0; x < WIDTH; x += 1 {
        // Convert screen coordinates to scaled Mandelbrot coordinates
        let cr = (-2 * SCALE) + (x * 3 * SCALE) / (WIDTH - 1);
        let ci = (-1 * SCALE) + (y * 2 * SCALE) / (HEIGHT - 1);

        let zr = 0;
        let zi = 0;
        let iterations = 0;

        // Mandelbrot iteration
        while iterations < MAX_ITER {
            let zr_sq = zr * zr;
            let zi_sq = zi * zi;
            
            // Check escape condition
            if zr_sq + zi_sq > 4 * SCALE * SCALE {
                break;
            }

            // Calculate next iteration values
            let new_zr = (zr_sq - zi_sq) / SCALE + cr;
            zi = (2 * zr * zi) / SCALE + ci;
            zr = new_zr;
            
            iterations += 1;
        }

        // Select character based on iteration count
        if iterations != MAX_ITER {
            print_char!(gradient[iterations])
        } else {
            print!("#");
        }
        
    }
    print!("\\n");
}

`

var Module = {
  noExitRuntime: true,
  onRuntimeInitialized: function () {
    console.log("WASM initialized")
    document.getElementById('loading').classList.add('hidden')
    document.getElementById('interface').classList.remove('hidden')
  },
  preRun: function () {
    FS.init(
      () => {
        if (idx < s.length) {
          let ret = s.charCodeAt(idx)
          idx += 1
          return ret
        }
        return null
      },
      (char) => {
        document.getElementById('code').value += String.fromCharCode(char)
      },
      (char) => {
        document.getElementById('terminal').value += String.fromCharCode(char)
      }
    )
  },
}

function runWithStdin() {
  try {
    const text = document.getElementById('stdinInput').value
    idx = 0
    s = text

    document.getElementById('code').value = ''
    document.getElementById('terminal').value = ''

    FS.writeFile('/input.txt', text)

    Module._main()
  } catch (err) {
    document.getElementById('terminal').value += err.message
  }
}

// Initialize default code
document.getElementById('stdinInput').value = s