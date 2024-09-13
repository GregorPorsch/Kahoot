import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { useToastContext } from "../context/ToastContext";
import { getQuestion } from "../services/api";
import { ANSWER_TIME } from "../utils/constants";
import { handleNextQuestion } from "../utils/handlers";
import useTimer from "../hooks/useTimer";

import { toast, Toaster } from "sonner";

function Question() {
  const [question, setQuestion] = useState(null);
  const [showNextButton, setShowNextButton] = useState(false);

  const location = useLocation();
  const { quizId, questionIndex } = location.state || {};
  const { socket, gameId } = useAppContext();
  const navigate = useNavigate();
  const { setToastContext } = useToastContext();

  // Setup des Timers
  const { timer, setTimer } = useTimer(ANSWER_TIME, () => setShowNextButton(true));

  // Frage laden
  useEffect(() => {
    const fetchQuestion = async () => {
      console.log("fetchQuestion", quizId, questionIndex);
      getQuestion(quizId, questionIndex).then((response) => {
        if (response.status === "success") {
          setQuestion(response.data);
        } else if (response.status === "end") {
          setToastContext({ message: "Game ended!", type: "info" });
          navigate(`/lobbyleaderboard/${gameId}`);
        } else {
          toast.error("Error fetching question!");
        }
      });
    };
    fetchQuestion();
  }, [quizId, questionIndex, navigate, gameId]);

  // Wartescreen bis Frage geladen
  if (!question) return <div>Loading...</div>;

  return (
    <div>
      <h1>Question: {question.question}</h1>
      <ul>
        {question.options ? (
          question.options.map((option, index) => <li key={index}>{option}</li>)
        ) : (
          <p>Loading...</p>
        )}
      </ul>
      <div>Time left: {timer}</div>
      {showNextButton && (
        <button
          onClick={() =>
            handleNextQuestion(
              socket,
              gameId,
              quizId,
              questionIndex,
              setTimer,
              setShowNextButton,
              navigate
            )
          }
        >
          Next Question
        </button>
      )}
    </div>
  );
}

export default Question;
