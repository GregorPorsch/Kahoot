import axios from "axios";
import { API_BASE_URL } from "../utils/constants";
import { handleApiResponse, handleError } from "../utils/helpers";

// Join a game
export async function joinGame(username, gameId) {
  try {
    const response = await axios.post(`${API_BASE_URL}/join`, {
      player_name: username,
      game_id: gameId,
    });
    return handleApiResponse(response.data);
  } catch (error) {
    handleError(error);
  }
}

export async function leaveGame(username, gameId) {
  try {
    const response = await axios.post(`${API_BASE_URL}/leave`, {
      player_name: username,
      game_id: gameId,
    });
    return handleApiResponse(response.data);
  } catch (error) {
    handleError(error);
  }
}

export async function playerExists(username, gameId) {
  try {
    const response = await axios.post(`${API_BASE_URL}/exists/player`, {
      player_name: username,
      game_id: gameId,
    });
    return handleApiResponse(response.data);
  } catch (error) {
    handleError(error);
  }
}

export async function gameExists(gameId) {
  try {
    const response = await axios.post(`${API_BASE_URL}/exists/game`, {
      game_id: gameId,
    });
    return handleApiResponse(response.data);
  } catch (error) {
    handleError(error);
  }
}

export async function getQuestion(quizId, questionIndex) {
  console.log("getQuestion", quizId, questionIndex);
  try {
    const response = await axios.post(`${API_BASE_URL}/questions/get`, {
      quiz_id: quizId,
      question_index: questionIndex,
    });
    console.log(response);
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

export async function getScores(gameId) {
  try {
    const response = await axios.post(`${API_BASE_URL}/scores`, { game_id: gameId });
    return handleApiResponse(response.data);
  } catch (error) {
    handleError(error);
  }
}

export async function checkAnswer(gameId, username, quizId, questionIndex, answer, answerTime) {
  try {
    const response = await axios.post(`${API_BASE_URL}/answers/check`, {
      game_id: gameId,
      username: username,
      quiz_id: quizId,
      question_index: questionIndex,
      answer: answer,
      answer_time: answerTime,
    });
    return handleApiResponse(response.data);
  } catch (error) {
    handleError(error);
  }
}
