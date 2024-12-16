import { config } from "dotenv";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { BaseLanguageModel } from "langchain/base_language";
import { BaseChatModel } from "langchain/chat_models/base";
import { ChatOpenAI } from "@langchain/openai";
import { OpenAI } from "@langchain/openai";

/*
What is the purpose of this chain?
This is RAG chain that generates an answer to a question based on a given context:
When implementing Retrieval Augmented Generation (RAG), 
you provide information as part of the prompt that will help the LLM generate an accurate response.
We want the function to return a chain that instructs the LLM to generate 
an answer to a question based on the context provided. 
The chain should not be concerned with where that information comes from.
*/

export interface GenerateAnswerInput {
  question: string;
  context: string;
}
// end::interface[]

// tag::function[]
{
  /*
  // TODO: Create a Prompt Template
  // const answerQuestionPrompt = PromptTemplate.fromTemplate(`
  // TODO: Return a RunnableSequence
  // return RunnableSequence.from<GenerateAnswerInput, string>([])
*/
}
// end::function[]
export default function initGenerateAnswerChain(
  llm: BaseLanguageModel
): RunnableSequence<GenerateAnswerInput, string> {
  const answerQuestionPrompt = PromptTemplate.fromTemplate(`
    Use only the following context to answer the following question.

    Question:
    {question}

    Context:
    {context}

    Answer as if you have been asked the original question.
    Do not use your pre-trained knowledge.

    If you don't know the answer, just say that you don't know, don't try to make up an answer.
    Include links and sources where possible.
  `);

  return RunnableSequence.from<GenerateAnswerInput, string>([
    answerQuestionPrompt,
    llm,
    new StringOutputParser(),
  ]);
}

const llm = new OpenAI();
const answerChain = initGenerateAnswerChain(llm);

async function run() {
  const output = await answerChain.invoke({
    question: "Who is the CEO of Neo4j?",
    context: "Neo4j CEO: Emil Eifrem",
  });
  console.log(output); // Emil Eifrem is the CEO of Neo4j
}

run();
// Emil Eifrem is the CEO of Neo4j
// end::usage[]
