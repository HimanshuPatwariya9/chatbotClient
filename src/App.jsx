import { useState, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import ClipLoader from "react-spinners/ClipLoader";

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [generatingAnswer, setGeneratingAnswer] = useState(false);
  const [selectedSector, setSelectedSector] = useState("");
  const [messageHistory, setMessageHistory] = useState([]);
  const [showCustomQuestionInput, setShowCustomQuestionInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingButton, setLoadingButton] = useState(false);
  const sectors = ["Health", "Education", "Finance", "Agriculture", "Electricity", "Railway"];

  const preloadedQuestions = {
    Health: [
      "What are the benefits of a balanced diet?",
      "How does exercise improve mental health?",
      "What are the symptoms of diabetes?",
      "How can stress be managed effectively?",
      "What is the importance of regular health check-ups?",
      "How do vaccines work?",
      "What are the benefits of drinking water?",
      "How can one maintain a healthy heart?",
      "What are the causes of obesity?",
      "How does sleep affect overall health?"
    ],
    Education: [
      "What are the advantages of online learning?",
      "How does early childhood education impact development?",
      "What are effective teaching strategies?",
      "How can technology enhance education?",
      "What is the importance of STEM education?",
      "How does inclusive education benefit students?",
      "What are the challenges in higher education?",
      "How can parents support their child's education?",
      "What are the benefits of bilingual education?",
      "How does education influence career opportunities?"
    ],
    Finance: [
      "What are the benefits of investing in stocks?",
      "How does inflation affect the economy?",
      "What is the importance of financial planning?",
      "How can one manage personal debt effectively?",
      "What are the advantages of mutual funds?",
      "How does cryptocurrency work?",
      "What are the benefits of having a savings account?",
      "How can one improve their credit score?",
      "What is the role of insurance in financial planning?",
      "How do interest rates impact loans and savings?"
    ],
    Agriculture: [
      "What are the benefits of organic farming?",
      "How does climate change impact agriculture?",
      "What is the importance of crop rotation?",
      "How can technology improve farming practices?",
      "What are the challenges of sustainable agriculture?",
      "How does soil health affect crop yield?",
      "What are the benefits of precision agriculture?",
      "How can farmers manage pests naturally?",
      "What is the role of irrigation in agriculture?",
      "How do genetically modified organisms (GMOs) impact farming?"
    ],
    Electricity: [
      "What are the benefits of renewable energy?",
      "How does electricity impact modern life?",
      "What are the challenges of electricity generation?",
      "How can energy efficiency be improved?",
      "What is the importance of the power grid?",
      "How does solar power work?",
      "What are the advantages of wind energy?",
      "How can electricity storage be enhanced?",
      "What is the role of nuclear energy in power generation?",
      "How does electricity impact economic development?"
    ],
    Railway: [
      "What are the advantages of high-speed rail?",
      "How does railway infrastructure impact the economy?",
      "What are the challenges of railway maintenance?",
      "How can railway safety be improved?",
      "What is the importance of rail freight transport?",
      "How does railway technology impact efficiency?",
      "What are the benefits of passenger rail services?",
      "How can rail transport reduce carbon emissions?",
      "What is the role of railways in urban development?",
      "How does the railway industry create jobs?"
    ]
  };

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

  async function generateAnswer(questionToAsk) {
    if (!selectedSector) {
      setAnswer("Please select a sector first.");
      return;
    }

    setGeneratingAnswer(true);
    setLoading(true);

    try {
      const response = await axios({
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyCJ3H5Tj0CDpDDJwDzHsKcoyLIyi6bansA`,
        method: "post",
        data: {
          contents: [
            {
              parts: [
                {
                  text: `Please provide an answer related to ${selectedSector} in 7 lines, if possible provide link to the source and only one link is sufficient, and link will be formated as{for more information- https///........ }. If not related to ${selectedSector} field or domain, respond with "Sorry - maybe not related to this sector ." ${questionToAsk}`,
                },
              ],
            },
          ],
        },
      });

      const generatedAnswer = response.data.candidates[0].content.parts[0].text;
      setAnswer(generatedAnswer);
      addMessageToHistory({ question: questionToAsk, answer: generatedAnswer });
    } catch (error) {
      console.log(error);
      setAnswer("Sorry - Something went wrong. Please try again!");
      addMessageToHistory({ question: questionToAsk, answer: "Sorry - Something went wrong." });
    }

    setGeneratingAnswer(false);
    setLoading(false);
  }

  const handleSectorSelection = (sector) => {
    setSelectedSector(sector);
    setAnswer("");
    setShowCustomQuestionInput(false);
  };

  const handlePreloadedQuestionClick = (preloadedQuestion) => {
    setQuestion(preloadedQuestion);
    generateAnswer(preloadedQuestion);
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
                selectedSector === sector
                  ? "bg-blue-500 text-white"
                  : "bg-blue-200 text-blue-800"
              }`}
              onClick={() => handleSectorSelection(sector)}
            >
              {sector}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col md:flex-row flex-grow">
        <div className="md:fixed md:w-1/5 p-4">
          <img src={imageUrl} alt="Sector Image" className="rounded-lg w-full h-auto" />
        </div>

        <div className="flex-grow md:ml-1/5 p-4 overflow-y-auto flex flex-col-reverse">
          <div className="max-w-2xl mx-auto">
            {messageHistory.slice(0).reverse().map((message, index) => (
              <div key={index} className="bg-blue-500 text-white rounded-lg shadow-md p-4 mb-4">
                <div className="bg-sky-950 rounded-2xl p-4">
                  <ReactMarkdown>{message.question}</ReactMarkdown>
                </div>
                <div className="mt-2">
                  <ReactMarkdown>{message.answer}</ReactMarkdown>
                </div>
              </div>
            ))}
          </div>

          <div className="max-w-2xl mx-auto mt-auto">
            <div className="bg-white rounded-lg shadow-md p-4 mb-4">
              <div className="text-gray-600 mb-2">Ask anything related to {selectedSector}</div>
              <div className="flex flex-wrap mb-4">
                {preloadedQuestions[selectedSector]?.map((preloadedQuestion, index) => (
                  <button
                    key={index}
                    className="bg-blue-200 text-blue-800 text-xs px-2 py-1 rounded-md mb-2 mr-2"
                    onClick={() => handlePreloadedQuestionClick(preloadedQuestion)}
                  >
                    {preloadedQuestion}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowCustomQuestionInput((prev) => !prev)}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors mb-4"
              >
                {showCustomQuestionInput ? "Hide" : "Other"}
              </button>
              {showCustomQuestionInput && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    generateAnswer(question);
                  }}
                  className="flex mb-4"
                >
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
              )}
              <button
                onClick={clearMessageHistory}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      {loading && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <ClipLoader color="#ffffff" size={50} />
        </div>
      )}
    </div>
  );
}

export default App;