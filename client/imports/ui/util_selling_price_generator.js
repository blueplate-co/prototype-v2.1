import React, { Component } from "react";
import { withTracker } from "meteor/react-meteor-data";

class SellingPriceGenerator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dishes: [],
    };
  }

  generate() {
    if (confirm("Please make sure you back-up we database before run it.")) {
      // Save it!
      var selectDate = moment('2018-05-25T00:00:00.000Z').startOf('day').toDate();
      var validDishes = Dishes.find({
        createdAt: {
          $lt: selectDate,
        },
      }).fetch();
      debugger
      validDishes.map((item, index) => {
        Meteor.call(
          "util.generateSellingPrice",
          item._id,
          item.dish_selling_price,
          (err, res) => {
            if (!err) {
              Materialize.toast(
                "Generated for dishes " + item.dish_name,
                4000,
                "rounded bp-green"
              );
            }
          }
        );
      });
    } else {
      // Do nothing!
    }
  }

  render() {
    return (
      <div className="card section">
        <h5>Selling price</h5>
        <span>
          Click generate, all dishes from <b>begin</b> to <b>Thu May 24 2018</b>{" "}
          will be update 115%
        </span>
        <button
          onClick={() => this.generate()}
          style={{ marginTop: "30px", width: "250px", float: "right" }}
          className="waves-effect waves-dark btn"
          type="button"
        >
          Generate
        </button>
      </div>
    );
  }
}

export default withTracker(props => {
  const handle = Meteor.subscribe("theDishes");
  return {
    currentUser: Meteor.user(),
    listLoading: !handle.ready(),
  };
})(SellingPriceGenerator);
