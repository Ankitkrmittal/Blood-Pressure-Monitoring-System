import axios from "./axios";

async function getAssistantResponse(message = "", chatHistory = []) {
  const { data: response } = await axios({
    method: "post",
    url: "/api/user/assistant",
    data: {
      message,
      chatHistory,
    },
  });

  return response;
}

export const assistanceApi = {
  getAssistantResponse,
};
