import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import axios from "axios";

function PlayerQuestion({ username, gameId, setGameId, socket }) {
  const [question, setQuestion] = useState(null);
  const [timer, setTimer] = useState(10);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [answerTime, setAnswerTime] = useState(null);
  const [totalScore, setTotalScore] = useState(0);

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
        setSelectedAnswer("");
        setStartTime(Date.now());
      } else if (response.data.status === "end") {
        alert("Quiz has ended!");
        navigate("/");
      } else {
        alert("Error loading question");
      }
    };
    fetchQuestion();

    const fetchTotalScore = async () => {
      const response = await axios.post("http://localhost:5000/get_scores", {
        game_id: gameId,
      });
      if (response.data.status === "success") {
        setTotalScore(response.data.scores[username]);
      } else {
        alert("Error loading total score");
      }
    };

    fetchTotalScore();

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
      console.log((answerTime - startTime) / 1000);
      const checkAnswer = async () => {
        const response = await axios.post("http://localhost:5000/check_answer", {
          game_id: gameId,
          username: username,
          question_id: questionId,
          question_index: questionIndex,
          answer: selectedAnswer,
          answer_time: (answerTime - startTime) / 1000,
        });
        if (response.data.status === "success") {
          alert(response.data.correct ? `Correct! Points: ${response.data.points}` : "Incorrect!");
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
      setTimer(10);
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
      <h3>Total Score: {totalScore}</h3>
      <h1>{question.question}</h1>
      {selectedAnswer ? (
        <div>Selected answer: {selectedAnswer}</div>
      ) : (
        <ul>
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => {
                setAnswerTime(Date.now());
                setSelectedAnswer(option);
              }}
            >
              {option}
            </button>
          ))}
        </ul>
      )}
      <div>Time left: {timer}</div>
    </div>
  );
}

export default PlayerQuestion;
