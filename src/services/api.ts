import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "https://api.github.com/repos/facebook/react/issues";

export const api = createAsyncThunk("fetchIssues", async () => {
  const response = await axios.get(BASE_URL);
  return response.data;
});
