import uuid from 'uuid/v4';

const defQuestions = {
  Developer: {
    Intern: [
      {
        question: "Why Do you Want to Work as a Developer at our Company?",
        id: uuid()
      },
      {
        question: "Can you name different measures to guarantee correctness of data entry?",
        id: uuid()
      },
    ],
    Junior: [
      {
        question: "Can you name different measures to guarantee correctness of data entry?",
        id: uuid()
      },
      {
        question: "Can you name different techniques for prototyping an application?",
        id: uuid()
      },
    ],
    Middle: [
      {
        question: "Can you name different techniques for prototyping an application?",
        id: uuid()
      },
      {
        question: "How do you manage conflicts in a web application when different people are editing the same data?",
        id: uuid()
      },
    ],
    Senior: [
      {
        question: "How do you manage conflicts in a web application when different people are editing the same data?",
        id: uuid()
      },
      {
        question: "How do you make sure that your code can handle different kinds of error situations?",
        id: uuid()
      },
    ]
  },
}

export default function(questions = defQuestions, action) {
  switch (action.type) {
    case "CHANGE_QUESTIONS":
      const newQuestions = Object.assign({}, questions);
      const {profession, level, index, question} = action.payload;
      newQuestions[profession][level][index].question = question;
      return newQuestions;
    case "ADD_QUESTION":
      const addQuestion = Object.assign({}, {...questions});
      addQuestion[action.payload.profession][action.payload.level].push([""]);
      return addQuestion;
    case "REMOVE_QUESTION":
      const removeQuestion = Object.assign({}, {...questions});
      const {professionR, levelR, indexR} = action.payload;
      removeQuestion[professionR][levelR].splice(indexR, 1);
      return removeQuestion;
    case "ADD_POSITION":
      const questionsWnewPos = Object.assign({}, {
        ...questions,
      });
      questionsWnewPos[action.payload.newPosition] = {Intern: [], Junior: [], Middle: [], Senior: []};
      return questionsWnewPos;
    case "REMOVE_POSITION":
      const questionsWOpos = Object.assign({}, {...questions});
      delete questionsWOpos[action.payload.positionToRemove];
      return questionsWOpos;
  }
  return questions;
}
