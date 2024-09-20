import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { handleCreateGame } from "../utils/handlers";
import { useToastContext } from "../context/ToastContext";

import styles from "../assets/styles/LobbyHome.module.css";
import { toast, Toaster } from "sonner";

function Home() {
  const navigate = useNavigate();
  const { socket, setGameId } = useAppContext();
  const { setToastContext } = useToastContext();

  return (
    <div className={styles.container}>
      <Toaster richColors position="bottom-center" />
      <h1>Kahoot!</h1>
      <div>
        <button
          className={styles.create_button}
          onClick={() => handleCreateGame(socket, setGameId, setToastContext, navigate)}
        >
          Create Game
        </button>
      </div>
    </div>
  );
}

export default Home;
