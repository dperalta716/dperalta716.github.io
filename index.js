// Function to display Python output in the terminal
function outf(text) {
    const contentDiv = document.getElementById("Content");
    contentDiv.innerHTML += `<div>${text.replace(/\n/g, "<br>")}</div>`;
  }
  
  // Function to fetch and run the Python game
  async function runPythonCode() {
    try {
      // Fetch the Python code from the game.py file
      const response = await fetch("./game.py");
      if (!response.ok) throw new Error(`Failed to load game.py: ${response.statusText}`);
      const pythonCode = await response.text();
  
      // Clear previous output
      document.getElementById("Content").innerHTML = "";
  
      // Configure Skulpt to run the Python code
      Sk.configure({
        output: outf,
        read: (x) => {
          if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined) {
            throw `File not found: '${x}'`;
          }
          return Sk.builtinFiles["files"][x];
        },
      });
  
      // Run the Python code
      Sk.misceval.asyncToPromise(() => Sk.importMainWithBody("<stdin>", false, pythonCode)).catch((err) => {
        outf(err.toString());
      });
    } catch (error) {
      outf(`Error: ${error.message}`);
    }
  }
  
  // Attach the click event to the "Run" button
  document.getElementById("run-button").addEventListener("click", runPythonCode);
  