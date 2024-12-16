import { useState, useEffect } from "react";
import "./App.css";

function App() {
  // Attempt limits
  const possibleAttempts = 20;
  const maxFailedAttempts = 5;

  // State variables
  const [numOfAttempts, setNumOfAttempts] = useState(0);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [language, setLanguage] = useState("");
  const [color, setColor] = useState("");
  const [visible, setVisible] = useState(false);
  const [mainContentVisible, setMainContentVisible] = useState(false);
  const [contentOne, setContentOne] = useState("Hello Welcome");
  const [contentOneBg, setContentOneBg] = useState("white");
  const [contentOneColor, setContentOneColor] = useState("black");
  const [prevTrials, setPrevTrials] = useState([]); // To store previous trial combinations
  const [trialHistory, setTrialHistory] = useState([]); // For rendering trial info dynamically

  const progColours = [
    "Python-Navy",
    "C++-Purple",
    "Javascript-Yellow",
    "Go-Blue",
    "Dart-Red",
    "Perl-Magenta",
  ];

  // Timer for initial display
  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      setMainContentVisible(true);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  // Trial class
  class Trial {
    constructor(langColor, isPassed, attemptNumber) {
      this.langColor = langColor;
      this.isPassed = isPassed;
      this.attemptNumber = attemptNumber;
    }

    getTrialInfo() {
      return {
        attemptNumber: this.attemptNumber,
        langColor: this.langColor,
        isPassed: this.isPassed,
      };
    }
  }

  // Registry class for handling trials
  class Registry {
    constructor() {
      this.trialRegistry = [];
    }

    createTrial(langColor, isPassed, attemptNumber) {
      const trial = new Trial(langColor, isPassed, attemptNumber);
      this.trialRegistry.push(trial);
      return trial;
    }
  }

  // Registry instance
  const registry = new Registry();

  // Input handlers
  const handleLanguageChange = (e) => setLanguage(e.target.value);
  const handleColorChange = (e) => setColor(e.target.value);

  // Main logic to handle click event
  const handleClickEvent = (e) => {
    e.preventDefault();

    const newText1 = `${language.charAt(0).toUpperCase()}${language
      .slice(1)
      .toLowerCase()}-${color.charAt(0).toUpperCase()}${color
      .slice(1)
      .toLowerCase()}`;

    setNumOfAttempts((prev) => prev + 1);

    if (numOfAttempts >= possibleAttempts) {
      setContentOne("Maximum attempts reached. Try again later.");
      registry.createTrial(newText1, false, numOfAttempts + 1);
      setTrialHistory((prevHistory) => [
        ...prevHistory,
        registry.createTrial(newText1, false, numOfAttempts + 1),
      ]);
      alert("Game Over: Max attempts reached");
      return;
    }

    if (failedAttempts >= maxFailedAttempts) {
      setContentOne("YOU HAVE FAILED TOO MANY TIMES");
      registry.createTrial(newText1, false, numOfAttempts + 1);
      setTrialHistory((prevHistory) => [
        ...prevHistory,
        registry.createTrial(newText1, false, numOfAttempts + 1),
      ]);
      alert("Game Over: Max failed attempts reached");
      return;
    }

    if (prevTrials.includes(newText1.toLowerCase())) {
      setContentOne("Duplicate Entry. Please try a new combination.");
      setContentOneBg("red");
      setContentOneColor("white");
      return;
    }

    let matchFound = false;

    // Normalize input (both language and color) and compare case-insensitively
    const normalizedInput = newText1.toLowerCase();

    for (let progColour of progColours) {
      // Normalize both predefined programming language-color and user input
      if (normalizedInput === progColour.toLowerCase()) {
        matchFound = true;
        setContentOne("Success");
        const bgColor = progColour.split("-")[1].toLowerCase();
        setContentOneBg(bgColor);
        setContentOneColor("white");
        registry.createTrial(newText1, true, numOfAttempts + 1);
        setTrialHistory((prevHistory) => [
          ...prevHistory,
          registry.createTrial(newText1, true, numOfAttempts + 1),
        ]);
        alert("Success");
        break;
      }
    }

    if (!matchFound) {
      setFailedAttempts((prev) => prev + 1);
      setContentOne("No Match Found");
      setContentOneBg("red");
      setContentOneColor("white");
      registry.createTrial(newText1, false, numOfAttempts + 1);
      setTrialHistory((prevHistory) => [
        ...prevHistory,
        registry.createTrial(newText1, false, numOfAttempts + 1),
      ]);
    }

    setPrevTrials([...prevTrials, newText1.toLowerCase()]);
    setLanguage("");
    setColor("");
  };

  return (
    <div>
      <form>
        <h1> LETS PLAY</h1>

        {visible && progColours.map((item, index) => <p key={index}>{item}</p>)}

        {mainContentVisible && (
          <div>
            <p
              style={{
                backgroundColor: contentOneBg,
                color: contentOneColor,
                padding: "10px",
              }}
            >
              {contentOne}
            </p>

            <div>
              <span>Language:</span>
              <input value={language} onChange={handleLanguageChange} />
              <p></p>
              <span>Color:</span>
              <input value={color} onChange={handleColorChange} />
              <button onClick={handleClickEvent}>Click me</button>
            </div>
          </div>
        )}
      </form>

      <hr />

      <div>
        <h2>Trial History:</h2>
        <table border="1" style={{ width: "100%", textAlign: "center" }}>
          <thead>
            <tr>
              <th>Attempt Number</th>
              <th>Programming Language and Color</th>
              <th>Success</th>
            </tr>
          </thead>
          <tbody>
            {trialHistory.map((trial, index) => (
              <tr key={index}>
                <td>{trial.attemptNumber}</td>
                <td
                  style={{
                    backgroundColor: trial.langColor.split("-")[1].toLowerCase(),
                    color: "white",
                  }}
                >
                  {trial.langColor}
                </td>
                <td
                  style={{
                    backgroundColor: trial.isPassed ? "green" : "red",
                    color: "white",
                  }}
                >
                  {trial.isPassed ? "✔" : "✘"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
