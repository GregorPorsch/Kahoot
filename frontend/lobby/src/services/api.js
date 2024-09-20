import axios from "axios";
import { API_BASE_URL } from "../utils/constants";
import { handleApiResponse, handleError } from "../utils/helpers";

// Create a new game
export async function createGame() {
  console.log("createGame");
  try {
    const response = await axios.get(`${API_BASE_URL}/create`);
    return handleApiResponse(response.data);
  } catch (error) {
    console.log("Hier ist der Fehler");
    handleError(error);
  }
}

// Get all quizzes
export async function getQuizzes() {
  try {
    const response = await axios.get(`${API_BASE_URL}/questions/all_quizzes`);
    return handleApiResponse(response.data);
  } catch (error) {
    handleError(error);
  }
}

// Get all players in a game
export async function getPlayers(gameId) {
  try {
    const response = await axios.post(`${API_BASE_URL}/players`, { game_id: gameId });
    return handleApiResponse(response.data);
  } catch (error) {
    handleError(error);
  }
}

// Get a question
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

// Get scores
export async function getScores(gameId) {
  try {
    const response = await axios.post(`${API_BASE_URL}/scores`, { game_id: gameId });
    return handleApiResponse(response.data);
  } catch (error) {
    handleError(error);
  }
}

// Leave a game
export async function leaveGame(gameId, username) {
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
