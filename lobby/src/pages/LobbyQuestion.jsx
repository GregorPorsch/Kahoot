import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { useToastContext } from "../context/ToastContext";
import { getQuestion } from "../services/api";
import { ANSWER_TIME } from "../utils/constants";
import { handleNextQuestion } from "../utils/handlers";
import useTimer from "../hooks/useTimer";

import styles from "../assets/styles/LobbyQuestion.module.css";
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
    <div className={styles.container}>
      <Toaster richColors position="bottom-center" />
      <div className={styles.timer}>{timer}</div>
      <h1 className={styles.question}>{question.question}</h1>
      <div className={styles["options-container"]}>
        <button className={`${styles.option} ${styles.red}`}>{question.options[0]}</button>
        <button className={`${styles.option} ${styles.blue}`}>{question.options[1]}</button>
        <button className={`${styles.option} ${styles.yellow}`}>{question.options[2]}</button>
        <button className={`${styles.option} ${styles.green}`}>{question.options[3]}</button>
      </div>
      {showNextButton && (
        <button
          className={styles["next-button"]}
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
