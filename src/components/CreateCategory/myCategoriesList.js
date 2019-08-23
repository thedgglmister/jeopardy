import React, { Component } from 'react';

class MyCategoriesList extends Component {
  constructor(props) {
    super(props);

    console.log(882);
    console.log(this.props.myCategories);

    this.state = {
      myCategories: this.props.myCategories,
      loading: this.props.loading,
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.myCategories != this.props.myCategories || prevProps.loading != this.props.loading) {
      this.setState({
        myCategories: this.props.myCategories,
        loading: this.props.loading,
      });
    }
  }

  render() {
    const { myCategories, loading } = this.state;

    return (
      <div>
        <h1>My Categories</h1>
        {loading && <div>Loading ...</div>}
        <div>
          {myCategories.map(category => (
            <div key={category.categoryId}>
              <a href="#" name={category.categoryId} onClick={this.props.setCurrentCategoryId}>
                {category.categoryName ? category.categoryName : 'Untitled'}
                {!category.complete && <span>(Incomplete)</span>}
              </a>
            </div>
          ))}
          <br/>

          <div>
            <a href = "#" onClick={this.props.setCurrentCategoryId}>
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
