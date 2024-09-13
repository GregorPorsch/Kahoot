import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { handleCreateGame } from "../utils/handlers";
import { useToastContext } from "../context/ToastContext";

import { toast, Toaster } from "sonner";

function Home() {
  const navigate = useNavigate();
  const { socket, setGameId } = useAppContext();
  const { setToastContext } = useToastContext();

  return (
    <div className="App">
      <Toaster richColors position="bottom-center" />
      <h1>Kahoot Lobby</h1>
      <div>
        <button onClick={() => handleCreateGame(socket, setGameId, setToastContext, navigate)}>
          Create Game
        </button>
      </div>
    </div>
  );
}

export default Home;
