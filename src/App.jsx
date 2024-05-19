import { useState, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [generatingAnswer, setGeneratingAnswer] = useState(false);
  const [selectedSector, setSelectedSector] = useState("");
  const [messageHistory, setMessageHistory] = useState([]);

  const sectors = ["Health", "Education", "Finance", "Agriculture", "Electricity", "Railway"];

  useEffect(() => {
    const storedMessageHistory = localStorage.getItem("messageHistory");
    if (storedMessageHistory) {
      setMessageHistory(JSON.parse(storedMessageHistory));
    }
  }, []);

  const addMessageToHistory = (message) => {
    const updatedHistory = [...messageHistory, message];
    setMessageHistory(updatedHistory);
    localStorage.setItem("messageHistory", JSON.stringify(updatedHistory));
  };

  const clearMessageHistory = () => {
    setMessageHistory([]);
    localStorage.removeItem("messageHistory");
  };

  async function generateAnswer(e) {
    e.preventDefault();
    if (!selectedSector) {
      setAnswer("Please select a sector first.");
      return;
    }
    setGeneratingAnswer(true);
    try {
      const response = await axios({
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyCJ3H5Tj0CDpDDJwDzHsKcoyLIyi6bansA`,
        method: "post",
        data: {
          contents: [{ parts: [{ text: `Please provide an answer related to ${selectedSector} in 7 lines. If not related  to ${selectedSector} field or domanin, respond with "Sorry - Something went wrong." ${question}` }] }],
        },
      });

      const generatedAnswer = response.data.candidates[0].content.parts[0].text;
      setAnswer(generatedAnswer);
      addMessageToHistory({ question, answer: generatedAnswer });
    } catch (error) {
      console.log(error);
      setAnswer("Sorry - Something went wrong. Please try again!");
      addMessageToHistory({ question, answer: "Sorry - Something went wrong." });
    }

    setGeneratingAnswer(false);
  }

  const handleSectorSelection = (sector) => {
    setSelectedSector(sector);
    setAnswer("");
  };

  const imageUrl = "https://miro.medium.com/v2/resize:fit:750/format:webp/1*9I6EIL5NG20A8se5afVmOg.gif";

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="bg-white p-4">
        <div className="flex flex-wrap justify-center space-x-2">
          {sectors.map((sector, index) => (
            <button
              key={index}
              className={`px-4 py-2 rounded-md text-sm font-medium mb-2 ${
                selectedSector === sector ? "bg-blue-500 text-white" : "bg-blue-200 text-blue-800"
              }`}
              onClick={() => handleSectorSelection(sector)}
            >
              {sector}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-col md:flex-row">
        <div className="md:fixed md:w-1/4 p-4">
          <img src={imageUrl} alt="Sector Image" className="rounded-lg w-full h-auto" />
        </div>
        <div className="flex-grow md:ml-1/4 p-4 overflow-y-auto">
          <div className="max-w-lg mx-auto">
            <div className="bg-white rounded-lg shadow-md p-4 mb-4">
              <div className="text-gray-600 mb-2">Ask anything related to {selectedSector}</div>
              <form onSubmit={generateAnswer} className="flex mb-4">
                <input
                  required
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="flex-grow border rounded-l-md p-2"
                  placeholder="Type your question..."
                  disabled={!selectedSector}
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 transition-colors"
                  disabled={generatingAnswer}
                >
                  {generatingAnswer ? "Generating..." : "Ask"}
                </button>
              </form>
              <button
                onClick={clearMessageHistory}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
              >
                Clear
              </button>
            </div>
            {messageHistory.map((message, index) => (
              <div key={index} className="bg-blue-500 text-white rounded-lg shadow-md p-4 mb-4 max-w-md">
                <div className="bg-sky-950 rounded-2xl p-4">
                  <ReactMarkdown>{message.question}</ReactMarkdown>
                </div>
                <div className="mt-2">
                  <ReactMarkdown>{message.answer}</ReactMarkdown>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
