const setInitialQuestions = (questions) => {
  return {
    type: "SET_INITIAL_QUESTIONS",
    questions
  }
};

const addQuestion = (newQuestion) => {
  return {
    type: "ADD_NEW_QUESTION",
    newQuestion
  }
};

const deleteQuestion = (id) => {
  return {
    type: "DELETE_QUESTION",
    id
  }
};

const editQuestion = (changedQuestion) => {
  const {id, positionId, questionText} = changedQuestion
  return {
    type: "EDIT_QUESTION",
    question: {
      id,
      positionId,
      questionText,
    }
  }
};

export {setInitialQuestions, addQuestion, deleteQuestion, editQuestion}
