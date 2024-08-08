import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function PlayerQuestion({ username, gameId, setGameId, socket }) {
  const [question, setQuestion] = useState(null);
  const [timer, setTimer] = useState(5);
  const [selectedAnswer, setSelectedAnswer] = useState("");

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
        navigate("/");
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
  }, [gameId, questionIndex]);

  // Wenn Timer abgelaufen -> Checken der Antwort
  useEffect(() => {
    if (timer === 0) {
      const checkAnswer = async () => {
        const response = await axios.post("http://localhost:5000/check_answer", {
          game_id: gameId,
          question_id: questionId,
          question_index: questionIndex,
          answer: selectedAnswer,
        });
        if (response.data.status === "success") {
          alert(response.data.correct ? "Correct!" : "Incorrect!");
        } else {
          alert("Error checking answer");
        }
      };
      checkAnswer();
    }
  }, [timer, selectedAnswer, gameId, questionIndex]);

  // Lobby client klickt auf NextButton
  // "next_question" wird vom Player Client empfangen
  // Timer wird neu gestartet und Weiterleitung zur nächsten Frage
  useEffect(() => {
    const handleNextQuestion = (data) => {
      console.log("Next question");
      setTimer(5);
      navigate(`/player_question/${questionId}/${parseInt(questionIndex) + 1}`);
    };

    socket.on("next_question", handleNextQuestion);

    return () => {
      socket.off("next_question", handleNextQuestion);
    };
  }, [socket, questionId, questionIndex, navigate]);

  // Wartescreen bis Frage geladen
  if (!question) return <div>Loading...</div>;

  return (
    <div>
      <h1>{question.question}</h1>
      <ul>
        {question.options.map((option, index) => (
          <button key={index} onClick={() => setSelectedAnswer(option)}>
            {option}
          </button>
        ))}
      </ul>
      <div>Time left: {timer}</div>
    </div>
  );
}

export default PlayerQuestion;
