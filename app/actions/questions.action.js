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

const editQuestion = (changedQuestion) => {
  return {
    type: "EDIT_QUESTION",
    question: {
      id: changedQuestion.id,
      positionId: changedQuestion.positionId,
      questionText: changedQuestion.questionText
    }
  }
};

export {setInitialQuestions, addQuestion, deleteQuestion}
