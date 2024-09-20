import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useTimer from "../hooks/useTimer";
import { useAppContext } from "../context/AppContext";
import { useToastContext } from "../context/ToastContext";
import { getQuestion, getScores, checkAnswer } from "../services/api";
import { ANSWER_TIME } from "../utils/constants";
import { handleNextQuestion, cleanupSocketEvents } from "../services/socket";
import { handleAnswerSelection } from "../utils/handlers";
import WaitingScreen from "../components/PlayerQuestion/WaitingScreen";
import ResultScreen from "../components/PlayerQuestion/ResultScreen";

import styles from "../assets/styles/PlayerQuestion.module.css";
import { toast, Toaster } from "sonner";

const PlayerQuestion = () => {
  const [question, setQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [totalScore, setTotalScore] = useState(0);

  const [isWaiting, setIsWaiting] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(null);

  const { socket, gameId, username } = useAppContext();
  const { setToastContext } = useToastContext();
  const location = useLocation().state;
  const { quizId, questionIndex } = location || {};
  const navigate = useNavigate();

  // Timer Setup
  const onTimeUp = async () => {
    console.log("Time up!", splitTime);
    const response = await checkAnswer(
      gameId,
      username,
      quizId,
      questionIndex,
      selectedAnswer,
      splitTime
    );
    setIsWaiting(false);
    setIsAnswerCorrect(response.correct);
    setSelectedAnswer("");
    toast.info(response.correct ? `Correct! Points: ${response.points}` : "Incorrect!");
  };
  const { timer, setTimer, splitTime, recordSplitTime } = useTimer(ANSWER_TIME, onTimeUp);

  // Initialisieren der Zustände beim Starten der Komponente
  useEffect(() => {
    setIsWaiting(false);
    setIsAnswerCorrect(null);
    setSelectedAnswer("");

    const fetchQuestionAndScore = async () => {
      try {
        const questionResponse = await getQuestion(quizId, questionIndex);
        if (questionResponse.status === "success") {
          setQuestion(questionResponse.data);
        } else if (questionResponse.status === "end") {
          setToastContext({ message: "Game ended!", type: "info" });
          navigate(`/playerleaderboard/${gameId}`);
        } else {
          toast.error("Error fetching question!");
        }

        const scoreResponse = await getScores(gameId);
        setTotalScore(scoreResponse.data[username]);
      } catch (error) {
        console.error("Error fetching question or score:", error);
      }
    };

    fetchQuestionAndScore();
  }, [quizId, questionIndex, gameId, username, navigate]);

  // Socket events
  useEffect(() => {
    handleNextQuestion(socket, setTimer, navigate);

    return () => {
      cleanupSocketEvents(socket);
    };
  }, [socket]);

  if (!question) return <div>Loading...</div>;

  return (
    <div style={styles.container}>
      <Toaster richColors position="bottom-center" />
      {isWaiting ? (
        <WaitingScreen />
      ) : isAnswerCorrect !== null ? (
        <ResultScreen isAnswerCorrect={isAnswerCorrect} />
      ) : (
        <div>
          <p className={styles.score}>Score: {totalScore}</p>
          <h1 className={styles.question}>{question.question}</h1>
          <div className={styles["options-container"]}>
            <button
              className={`${styles.option} ${styles.red}`}
              onClick={() =>
                handleAnswerSelection(
                  setSelectedAnswer,
                  question.options[0],
                  recordSplitTime,
                  setIsWaiting
                )
              }
            />
            <button
              className={`${styles.option} ${styles.blue}`}
              onClick={() =>
                handleAnswerSelection(
                  setSelectedAnswer,
                  question.options[1],
                  recordSplitTime,
                  setIsWaiting
                )
              }
            />
            <button
              className={`${styles.option} ${styles.yellow}`}
              onClick={() =>
                handleAnswerSelection(
                  setSelectedAnswer,
                  question.options[2],
                  recordSplitTime,
                  setIsWaiting
                )
              }
            />
            <button
              className={`${styles.option} ${styles.green}`}
              onClick={() =>
                handleAnswerSelection(
                  setSelectedAnswer,
                  question.options[3],
                  recordSplitTime,
                  setIsWaiting
                )
              }
            />
          </div>
          <div className={styles.timer}>{timer}</div>
        </div>
      )}
    </div>
  );
};

export default PlayerQuestion;
