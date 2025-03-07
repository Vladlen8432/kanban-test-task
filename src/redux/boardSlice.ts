import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Issue = {
  id: number;
  title: string;
  state: "open" | "closed";
  assignee: string | null;
  url: string;
};

export type BoardState = {
  todo: Issue[];
  inProgress: Issue[];
  done: Issue[];
};

const initialState: BoardState = {
  todo: [],
  inProgress: [],
  done: [],
};

const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    setIssue: (state, action: PayloadAction<Issue[]>) => {
      state.todo = action.payload.filter(
        (issue) => issue.state === "open" && issue.assignee === null
      );
      state.inProgress = action.payload.filter(
        (issue) => issue.state === "open" && issue.assignee !== null
      );
      state.done = action.payload.filter((issue) => issue.state === "closed");
    },
    moveIssue: (
      state,
      action: PayloadAction<{
        id: number;
        from: keyof BoardState;
        to: keyof BoardState;
      }>
    ) => {
      const { id, from, to } = action.payload;
      const issueIndex = state[from].findIndex((issue) => issue.id === id);
      if (issueIndex !== -1) {
        const [movedIssue] = state[from].splice(issueIndex, 1);
        state[to].push(movedIssue);
      }
    },
  },
});

export const { setIssue, moveIssue } = boardSlice.actions;
export default boardSlice.reducer;
