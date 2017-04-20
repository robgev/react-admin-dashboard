export default function(questions = {}, action) {
  switch (action.type) {
    case "SET_INITIAL_QUESTIONS":
      return action.questions;
    case "ADD_NEW_QUESTION":
      return {...questions, [action.newQuestion.id]: action.newQuestion};
  }
  return questions;
}
