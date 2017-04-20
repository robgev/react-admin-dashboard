const deleteQuestion = (questions, id) => {
  const questionsCopy = Object.assign({}, questions);
  delete questionsCopy[id];
  return questionsCopy;
};

export default function(questions = {}, action) {
  switch (action.type) {
    case "SET_INITIAL_QUESTIONS":
      return action.questions;
    case "ADD_NEW_QUESTION":
      return {...questions, [action.newQuestion.id]: action.newQuestion};
    case "DELETE_QUESTION":
      return deleteQuestion(questions, action.id);
    case "EDIT_QUESTION":
      return {...questions, [action.question.id]: action.question};
  }
  return questions;
}
