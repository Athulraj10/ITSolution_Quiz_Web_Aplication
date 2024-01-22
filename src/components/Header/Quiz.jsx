import React, { useState, useEffect } from "react";
import Loader from "../Loader/Loader";

const Quiz = () => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [result, setResult] = useState("");
  const [correctScore, setCorrectScore] = useState(0);
  const [askedCount, setAskedCount] = useState(0);
  const totalQuestion = 5;
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    loadQuestion();
  }, []);

  const loadQuestion = async () => {
    const APIUrl = "https://opentdb.com/api.php?amount=1";
    try {
      const result = await fetch(APIUrl);
      const data = await result.json();
      setResult("");
      setIsLoaded(false);
      showQuestion(data?.results[0]);
    } catch (error) {
      console.error("Error fetching question:", error);
    }
  };

  const showQuestion = (data) => {
    setSelectedAnswer(null);
    const correctAnswer = HTMLDecode(data.correct_answer);
    let incorrectAnswer = data.incorrect_answers;
    let optionsList = [...incorrectAnswer, correctAnswer];
    optionsList.sort(() => Math.random() - 0.5);

    setQuestion(`${data.question} \n ${data.category}`);
    setOptions(optionsList);
  };

  const checkAnswer = () => {
    if (selectedAnswer !== null) {
      const selectedOption = options[selectedAnswer];
      const correctAnswer = HTMLDecode(options[options.length - 1]);

      if (selectedOption === correctAnswer) {
        setCorrectScore(correctScore + 1);
        setResult(
          <p className="text-green-600">
            <i className="fas fa-check"></i>Correct Answer!
          </p>
        );
      } else {
        setResult(
          <p className="text-red-600">
            <i className="fas fa-times"></i>Incorrect Answer!
            <small className="block text-gray-600">
              <b>Correct Answer: </b>
              {correctAnswer}
            </small>
          </p>
        );
      }

      setTimeout(() => {
        checkCount();
        loadQuestion();
      }, 1000);
    } else {
      setResult(
        <p className="text-yellow-600">
          <i className="fas fa-question"></i>Please select an option!
        </p>
      );
    }
  };

  const HTMLDecode = (textString) => {
    let doc = new DOMParser().parseFromString(textString, "text/html");
    return doc.documentElement.textContent;
  };

  const checkCount = () => {
    setAskedCount(askedCount + 1);
    if (askedCount === totalQuestion - 1) {
      setResult(<p className="text-blue-600">Your score is {correctScore}.</p>);
    } else {
      setTimeout(() => {
        loadQuestion();
      }, 300);
    }
  };

  const selectOption = (index) => {
    if (askedCount < totalQuestion) {
      setSelectedAnswer(index);
    }
  };

  const restartQuiz = () => {
    setCorrectScore(0);
    setAskedCount(0);
    setResult("");
    loadQuestion();
  };

  return isLoaded ? (
    <Loader />
  ) : (
  <div >
      <div className="flex items-center justify-center h-screen">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="mb-4 text-xl font-bold">{question}</div>
        <ul className="space-y-2">
          {options.map((option, index) => (
            <li
              key={index}
              className={`py-2 px-4 rounded-md cursor-pointer ${
                selectedAnswer === index
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => selectOption(index)}
            >
              {index + 1}. {option}
            </li>
          ))}
        </ul>
        <button
          onClick={checkAnswer}
          disabled={selectedAnswer === null}
          className="mt-4 py-2 px-4 bg-green-500 text-white rounded-md cursor-pointer"
        >
          Submit Answer
        </button>
        <button
          onClick={restartQuiz}
          style={{ display: askedCount === totalQuestion ? "block" : "none" }}
          className="mt-4 py-2 px-4 bg-blue-500 text-white rounded-md cursor-pointer"
        >
          Play Again
        </button>
        <div className="mt-4">{result}</div>
        <p className="text-green-600 mt-4">Correct Score: {correctScore}</p>
        <p className="text-gray-600">Total Questions: {totalQuestion}</p>
      </div>
    </div>
  </div>
  );
};

export default Quiz;
