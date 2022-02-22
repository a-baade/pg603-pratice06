import React, { useState, useEffect } from "react";
import { useLoader } from "./useLoader";
import { fetchJSON, postJSON } from "./http";

function ShowQuestion({ question, onReload }) {
  async function handleAnswer(answer) {
    const { id } = question;
    postJSON("/quiz/answer", { id, answer });
    onReload();
  }
  return (
    <div>
      <h1>{question.question}</h1>
      {Object.keys(question.answers)
        .filter((a) => question.answers[a])
        .map((a) => (
          <div key={a}>
            <button onClick={() => handleAnswer(a)}>
              {question.answers[a]}
            </button>
          </div>
        ))}
    </div>
  );
}

function QuestionComponent({ reload }) {
  const [question, setQuestion] = useState();

  async function handleQuizLoader() {
    const res = await fetch("/quiz/random");
    setQuestion(await res.json());
  }

  function handleReload() {
    setQuestion(undefined);
    reload();
  }

  if (!question) {
    return (
      <div>
        <button onClick={handleQuizLoader}>New question?</button>
      </div>
    );
  }
  return <ShowQuestion question={question} onReload={handleReload} />;
}

export function QuizApp() {
  const {
    data: score,
    loading,
    reload,
  } = useLoader(async () => fetchJSON("/quiz/score"));

  return (
    <>
      <h1>Welcome to the quiz show</h1>
      {score && (
        <div>
          You have answered {score.correct} out of {score.answered} correct
        </div>
      )}
      <QuestionComponent reload={reload} />
    </>
  );
}
