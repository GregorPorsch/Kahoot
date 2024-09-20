const ResultScreen = ({ isAnswerCorrect }) => (
  <div className="result-screen">
    {isAnswerCorrect ? <p>Richtige Antwort!</p> : <p>Falsche Antwort!</p>}
  </div>
);

export default ResultScreen;
