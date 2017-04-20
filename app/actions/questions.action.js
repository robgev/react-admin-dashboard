const setInitialQuestions = (questions) => {
  return {
    type: "SET_INITIAL_QUESTIONS",
    questions: questions
  }
};

const addQuestion = (newQuestion) => {
  return {
    type: "ADD_NEW_QUESTION",
    newQuestion: newQuestion
  }
};

const deleteQuestion = (id) => {
  return {
    type: "DELETE_QUESTION",
    id: id
  }
};

export {setInitialQuestions, addQuestion, deleteQuestion}
