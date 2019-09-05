import React, { Component } from 'react';

import BoardCategory from './boardCategory';



class BoardCategories extends Component {
  constructor(props) {
    super(props);

    this.ref = React.createRef();
  }

  componentDidMount() {
    console.log(99977);
    console.log(this.ref.current);
  }



  render() {
    const { categoriesArr, round, gameId, activeQuestion } = this.props;

    const boardCategoriesContainerStyle = {
      display: 'flex',
      position: 'relative',
    }

    return (
      <div className="board-categories-container" ref={this.ref} style={boardCategoriesContainerStyle}>
        {categoriesArr.map((category) => (
          <BoardCategory key={category.categoryId}
                         gameId={gameId}
                         category={category}
                         round={round}
                         activeQuestion={activeQuestion}/>
        ))}
      </div>
    );
  }
}

export default BoardCategories;
