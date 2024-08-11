import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function Question({ socket, gameId, setGameId }) {
  const [question, setQuestion] = useState(null);
  const [timer, setTimer] = useState(10);
  const [showNextButton, setShowNextButton] = useState(false);

  const { questionId, questionIndex } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Laden der aktuellen Frage
    const fetchQuestion = async () => {
      const response = await axios.get(
        `http://localhost:5000/get_question/${questionId}/${questionIndex}`
      );
      if (response.data.status === "success") {
        setQuestion(response.data.question);
      } else if (response.data.status === "end") {
        alert("Quiz has ended!");
        navigate(`/lobbyleaderboard/${gameId}`);
      } else {
        alert("Error loading question");
      }
    };
    fetchQuestion();

    // Setup des Timers
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [questionId, questionIndex]);

  // Wenn Timer abgelaufen -> NextButton anzeigen
  useEffect(() => {
    if (timer === 0) {
      setShowNextButton(true);
    }
  }, [timer]);

  // Lobby client klickt auf NextButton
  // "next_question" wird an die Player Clients gesendet in app.py
  // Timer wird neu gestartet und Weiterleitung zur nächsten Frage
  const handleNextQuestion = () => {
    socket.emit("next_question", {
      game_id: gameId,
      question_id: questionId,
      question_index: parseInt(questionIndex) + 1,
    });
    setTimer(10);
    navigate(`/question/${questionId}/${parseInt(questionIndex) + 1}`);
  };

  // Wartescreen bis Frage geladen
  if (!question) return <div>Loading...</div>;

  return (
    <div>
      <h1>{question.question}</h1>
      <ul>
        {question.options ? (
          question.options.map((option, index) => <li key={index}>{option}</li>)
        ) : (
          <p>Loading...</p>
        )}
      </ul>
      <div>Time left: {timer}</div>
      {showNextButton && <button onClick={handleNextQuestion}>Next Question</button>}
    </div>
  );
}

export default Question;
