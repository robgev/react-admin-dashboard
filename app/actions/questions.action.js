const setInitialQuestions = (questions) => {
  return {
    type: "SET_INITIAL_QUESTIONS",
    questions: questions
  }
}

const addQuestion = (newQuestion) => {
  return {
    type: "ADD_NEW_QUESTION",
    newQuestion: newQuestion
  }
}

export {setInitialQuestions, addQuestion}
