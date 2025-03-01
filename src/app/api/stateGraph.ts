import { OpenAIAgent } from "langchain/agents";
import {OpenAI} from 'openai'
import { wrapOpenAI } from "langsmith/wrappers";

// Define a simple message type and state interface.
export interface Message {
  role: "system" | "ai" | "user";
  content: string;
}

export interface MessagesState {
  messages: Message[];
}

// Instantiate your ChatOpenAI model.
const openai = wrapOpenAI(new OpenAI());


const model = new OpenAIa({ modelName: "gpt-4" });

// The routing function to decide next node based on last AI message.
export function routingFunction(state: MessagesState): string {
  try {
    const lastMessage = state.messages[state.messages.length - 1];
    const messageContent = lastMessage.content || String(lastMessage);
    if (messageContent.toLowerCase().includes("tool_advisor")) {
      return "tool_advisor";
    } else if (messageContent.toLowerCase().includes("tool_critic")) {
      return "tool_critic";
    }
    return "task_operator";
  } catch (e) {
    console.error("Error in routingFunction:", e);
    return "task_operator";
  }
}

// Node: toolAdvisor – provides image enhancement advice.
export async function toolAdvisor(
  state: MessagesState
): Promise<MessagesState> {
  const response: BaseMessage = await model.call([
    new SystemMessage("You are an image enhancement advisor."),
    ...state.messages,
  ]);
  const aiMessage: Message = {
    role: "ai",
    content: response.content,
  };
  state.messages.push(aiMessage);
  return state;
}

// Node: toolCritic – critiques the image.
export async function toolCritic(
  state: MessagesState
): Promise<MessagesState> {
  const response: BaseMessage = await model.call([
    new SystemMessage("You are an image enhancement critic."),
    ...state.messages,
  ]);
  const aiMessage: Message = {
    role: "ai",
    content: response.content,
  };
  state.messages.push(aiMessage);
  return state;
}

// Node: taskOperator – supervises and decides the next step.
// In the Python code, model.bind_tools is used. Here we simply call the model.
export async function taskOperator(
  state: MessagesState
): Promise<MessagesState> {
  try {
    const response: BaseMessage = await model.call(state.messages);
    const aiMessage: Message = {
      role: "ai",
      content: response.content,
    };
    state.messages.push(aiMessage);
    return state;
  } catch (e) {
    console.error("Error in taskOperator:", e);
    throw e;
  }
}

// Node: tools – performs a simple image background removal.
export function tools(imageUrl: string): string {
  return `Background removed from ${imageUrl}`;
}

// (Optional) Node: taskOperatorRouter – if you need additional routing.
export function taskOperatorRouter(state: MessagesState): string {
  try {
    const lastMessage = state.messages[state.messages.length - 1];
    const messageContent = lastMessage.content || String(lastMessage);
    if (messageContent.toLowerCase().includes("tools")) {
      return "tools";
    } else if (messageContent.toLowerCase().includes("ask_human")) {
      return "ask_human";
    }
    return "ask_human";
  } catch (e) {
    console.error("Error in taskOperatorRouter:", e);
    return "ask_human";
  }
}

/**
 * A simple state graph class that holds nodes and edges.
 */
export class StateGraph {
  state: MessagesState;
  nodes: Record<string, (state: MessagesState) => any>;
  edges: Record<string, string[]>;
  conditionalEdges: Record<
    string,
    {
      router: (state: MessagesState) => string;
      mapping: Record<string, string>;
    }
  >;
  entryPoint: string;
  finishPoint?: string;

  constructor(initialState: MessagesState) {
    this.state = initialState;
    this.nodes = {};
    this.edges = {};
    this.conditionalEdges = {};
    this.entryPoint = "";
  }

  addNode(id: string, fn: (state: MessagesState) => any) {
    this.nodes[id] = fn;
  }

  addEdge(from: string, to: string) {
    if (!this.edges[from]) {
      this.edges[from] = [];
    }
    this.edges[from].push(to);
  }

  setEntryPoint(id: string) {
    this.entryPoint = id;
  }

  setFinishPoint(id: string) {
    this.finishPoint = id;
  }

  addConditionalEdges(
    from: string,
    router: (state: MessagesState) => string,
    mapping: Record<string, string>
  ) {
    this.conditionalEdges[from] = { router, mapping };
  }

  // Run the workflow until there is no valid next node.
  async run(): Promise<MessagesState> {
    let currentNode = this.entryPoint;
    while (true) {
      if (!this.nodes[currentNode]) {
        throw new Error(`Node ${currentNode} not found`);
      }
      console.log(`Running node: ${currentNode}`);
      // Execute the node (it can be async)
      const result = await this.nodes[currentNode](this.state);
      this.state = result;

      // If we reached a finish point, stop.
      if (this.finishPoint && currentNode === this.finishPoint) {
        break;
      }

      // Check for conditional edges first.
      if (this.conditionalEdges[currentNode]) {
        const { router, mapping } = this.conditionalEdges[currentNode];
        const nextKey = router(this.state);
        if (mapping[nextKey]) {
          currentNode = mapping[nextKey];
          continue;
        }
      }
      // Otherwise, follow the first available edge if any.
      const outEdges = this.edges[currentNode];
      if (outEdges && outEdges.length > 0) {
        currentNode = outEdges[0];
      } else {
        break;
      }
    }
    return this.state;
  }
}

// ---
// Build the workflow by adding nodes and edges.

export const initialState: MessagesState = { messages: [] };

export const workflow = new StateGraph(initialState);

// Add nodes.
workflow.addNode("task_operator", taskOperator);
workflow.addNode("tool_advisor", toolAdvisor);
workflow.addNode("tools", async (state: MessagesState) => {
  // For demonstration, we assume the tool receives an image URL from the state.
  // In a real-world scenario, you might store additional parameters in the state.
  const imageUrl = "http://example.com/image.jpg";
  const result = tools(imageUrl);
  // Append a new AI message with the result.
  state.messages.push({ role: "ai", content: result });
  return state;
});
workflow.addNode("tool_critic", toolCritic);

// Set entry point and edges.
workflow.addEdge("tool_advisor", "task_operator");
workflow.addEdge("tool_critic", "task_operator");
workflow.setEntryPoint("task_operator");

// Additional edge: tools leads back to task_operator.
workflow.addEdge("tools", "task_operator");

// Add conditional edges for task_operator.
workflow.addConditionalEdges("task_operator", routingFunction, {
  tool_advisor: "tool_advisor",
  tools: "tools",
  tool_critic: "tool_critic",
});
