import axios from "./axios";

async function getAssistantResponse(message = "", chatHistory = [], conversationId) {
  const payload = {
    message,
    chatHistory,
  };

  if (conversationId) {
    payload.conversationId = conversationId;
  }

  const { data: response } = await axios({
    method: "post",
    url: "/api/user/assistant",
    data: payload,
  });

  return response;
}

export const assistanceApi = {
  getAssistantResponse,
};
