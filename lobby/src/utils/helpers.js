// Helper function to handle API responses
export function handleApiResponse(response) {
  if (response.status === "error") {
    console.error("API Error:", response.error);
    alert("An error occurred. Please try again later.");
    return null;
  }
  return response;
}

// Helper function to handle errors
export function handleError(error) {
  console.error("Error:", error);
  alert("An error occurred. Please try again later.");
}
