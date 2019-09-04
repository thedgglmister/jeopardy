import React, { Component } from 'react';

class MyCategoriesList extends Component {

  render() {
    const { myCategories, setCurrentCategory } = this.props;

    const myCategoriesList = Object.keys(myCategories).map(categoryId => ({
      ...myCategories[categoryId],
      categoryId: categoryId,
    }));

    return (
      <div>
        <h1>My Categories</h1>
        <div>
          {myCategoriesList.map(category => (
            <div key={category.categoryId}>
              <a href="#" name={category.categoryId} onClick={setCurrentCategory}>
                {category.categoryName ? category.categoryName : 'Untitled'}
                {!category.complete && <span>(Incomplete)</span>}
              </a>
            </div>
          ))}
          <br/>

          <div>
            <a href = "#" onClick={setCurrentCategory}>
              New Category
            </a>
          </div>
          <br/>
        </div>
      </div>
    );
  }
}


export default MyCategoriesList;
