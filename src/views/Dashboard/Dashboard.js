import React from "react";
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";

import axios from "axios";
import Domain from "components/Constants/Keys";
import Button from "components/CustomButtons/Button.js";

//import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";

const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0"
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF"
    }
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1"
    }
  }
};

const useStyles = makeStyles(styles);

export default class Dashboard extends React.Component {
  constructor() {
    super();
    this.state = {
      categories: [],
      books: [],
      categoryName: ""
    };
  }
  classes = () => {
    return useStyles();
  };

  componentDidMount() {
    this.getCategories();
  }

  getCategories = () => {
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.getToken()
    };

    axios
      .get(Domain + "api/admins/get-categories", {
        headers: headers
      })
      .then(response => {
        this.setState({
          categories: response.data.categories
        });
      })
      .catch(error => {
        alert(error.message);
      });
  };

  getBooksInCategory = category => {
    this.setState({
      categoryName: category.name
    });
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.getToken()
    };

    axios
      .get(Domain + "api/admins/get-category-books/" + category.id, {
        headers: headers
      })
      .then(response => {
        this.setState({
          books: response.data.books
        });
      })
      .catch(error => {
        alert(error.message);
      });
  };

  getToken = () => {
    let state = localStorage["appState"];
    if (state) {
      let AppState = JSON.parse(state);
      if (AppState.isLoggedIn == true) {
        this.setState({
          token: AppState.user_token
        });
        return AppState.user_token;
      }
    }
  };

  render() {
    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={6}>
            <Card>
              <CardHeader color="primary">
                <h4 className={this.classes.cardTitleWhite}>
                  Categories Table
                </h4>
                <p className={this.classes.cardCategoryWhite}>
                  Each category contains different books
                </p>
              </CardHeader>
              <CardBody>
                <Table
                  tableHeaderColor="primary"
                  tableHead={["Category Name", "Action"]}
                  tableData={this.state.categories.map((category, index) => [
                    category.name,
                    <Button
                      color="rose"
                      onClick={() => {
                        this.getBooksInCategory(category);
                      }}
                    >
                      View Books
                    </Button>
                  ])}
                />
              </CardBody>
            </Card>
          </GridItem>

          <GridItem xs={12} sm={12} md={6}>
            <Card>
              <CardHeader color="primary">
                <h4 className={this.classes.cardTitleWhite}>
                  {this.state.categoryName + " "} Books
                </h4>
                <p className={this.classes.cardCategoryWhite}>
                  books in {this.state.categoryName + " "} Category
                </p>
              </CardHeader>
              <CardBody>
                <Table
                  tableHeaderColor="primary"
                  tableHead={["Category Name"]}
                  tableData={this.state.books.map((book, index) => [
                    book.book_title
                  ])}
                />
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}
