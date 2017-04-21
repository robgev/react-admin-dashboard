import React from 'react';
import {connect} from 'react-redux';
import {map, filter} from 'lodash';

function mapStateToProps(state) {
  return (
    {
      candidates: state.candidates,
      selectedCandidate: state.selectedCandidate,
      questions: state.quesitons
    }
  );
};

class MakeInterviewList extends React.PureComponent {
  constructor(props){
    super(props);
    this.candidate = props.candidates[props.selectedCandidate]
  };
  render() {
    const allQuestions = filter(this.props.questions, {positionId: this.candidate.profession});
    const RenderQuestions = map(allQuestions, question => {
      return(
        <div
          key={question.id}
        >
          {question.questionText}
        </div>
      );
    });
  };
};

export default connect(mapStateToProps)(MakeInterviewList);
