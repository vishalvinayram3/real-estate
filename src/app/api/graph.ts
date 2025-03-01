// pages/api/graph.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { workflow, MessagesState } from "./stateGraph";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MessagesState | { error: string }>
) {
  try {
    // Use the provided messages from the request body, or fallback to a default message.
    const inputState: MessagesState = req.body && req.body.messages 
      ? { messages: req.body.messages }
      : { messages: [{ role: "user", content: "Start" }] };

    // Set the workflow state based on the provided input.
    workflow.state = inputState;

    const finalState = await workflow.run();
    res.status(200).json(finalState);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
