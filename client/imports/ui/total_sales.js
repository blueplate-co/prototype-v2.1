import React, { Component } from "react";
import { Line } from "react-chartjs-2";
import { Meteor } from "meteor/meteor";

export default class TotalSales extends Component {
  constructor(props) {
    super(props);
    this.state = {
      by: "dishes",
      time: "week",
      total_by_dishes: "0",
      data: {
        labels: ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"],
        datasets: [
          {
            label: "Total sales",
            fill: true,
            lineTension: 0.3,
            backgroundColor: "rgba(75,192,192,0.4)",
            borderColor: "rgba(75,192,192,1)",
            borderCapStyle: "butt",
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: "miter",
            pointBorderColor: "rgba(75,192,192,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(75,192,192,1)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: [0, 0, 0, 0, 0, 0, 0],
          },
        ],
      },
    };
  }

  componentDidMount() {
    Meteor.call("dashboard.totalSales", "week", (err, response) => {
      var total = 0;
      for (var i = 0; i < response.length; i++) {
        total += Math.round(response[i].sales / 1.15);
      }
      this.setState({
        total_by_dishes: total,
      });
    });
    Meteor.call("dashboard.totalsalesData", "week", (err, response) => {
      var result = [0, 0, 0, 0, 0, 0, 0];
      for (var i = 0; i < response.length; i++) {
        if (response[i]._id.day > 1) {
          result[response[i]._id.day - 2] = Math.round(response[i].sales / 1.15);
        } else {
          // Date:       Mon Tue Wed Thu Fri Sat Sun
          // $dayofweek: 2.  3.  4.  5.  6.  7.  1.
          // $index      0.  1.  2.  3.  4.  5.  6.
          // Sunday always in index 6
          result[6] = Math.round(response[i].sales / 1.15);
        }
      }
      var config = this.state.data;
      config.datasets[0].data = result;
      this.setState({
        data: config,
      });
    });
  }

  changeOption(type) {
    this.setState({
      by: type,
    });
  }

  changeTimeframe(type) {
    var config = this.state.data;
    this.setState({
      time: type,
    });
    switch (type) {
      case "week":
        config.labels = ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"];
        this.setState({
          data: config,
        });
        Meteor.call("dashboard.totalSales", "week", (err, response) => {
          var total = 0;
          for (var i = 0; i < response.length; i++) {
            total += Math.round(response[i].sales / 1.15);
          }
          this.setState({
            total_by_dishes: total,
          });
        });
        Meteor.call("dashboard.totalsalesData", "week", (err, response) => {
          var result = [0, 0, 0, 0, 0, 0, 0];
          for (var i = 0; i < response.length; i++) {
            if (response[i]._id.day > 1) {
              result[response[i]._id.day - 2] = Math.round(response[i].sales / 1.15);
            } else {
              // Date:       Mon Tue Wed Thu Fri Sat Sun
              // $dayofweek: 2.  3.  4.  5.  6.  7.  1.
              // $index      0.  1.  2.  3.  4.  5.  6.
              // Sunday always in index 6
              result[6] = Math.round(response[i].sales / 1.15);
            }
          }
          var config = this.state.data;
          config.datasets[0].data = result;
          this.setState({
            data: config,
          });
        });
        break;
      case "month":
        config.labels = [
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "10",
          "11",
          "12",
          "13",
          "14",
          "15",
          "16",
          "17",
          "18",
          "19",
          "20",
          "21",
          "22",
          "23",
          "24",
          "25",
          "26",
          "27",
          "28",
          "29",
          "30",
        ];
        this.setState({
          data: config,
        });
        Meteor.call("dashboard.totalSales", "month", (err, response) => {
          var total = 0;
          for (var i = 0; i < response.length; i++) {
            total += Math.round(response[i].sales / 1.15);
          }
          this.setState({
            total_by_dishes: total,
          });
        });
        Meteor.call("dashboard.totalsalesData", "month", (err, response) => {
          var result = [0, 0, 0, 0, 0, 0, 0, 0 ,0 ,0, 0, 0, 0, 0, 0, 0, 0, 0 ,0 ,0, 0, 0, 0, 0, 0, 0, 0, 0 , 0 , 0, 0];
          for (var i = 0; i < response.length; i++) {
            result[response[i]._id.day - 1] = Math.round(
              response[i].sales / 1.15
            );
          }
          var config = this.state.data;
          config.datasets[0].data = result;
          this.setState({
            data: config,
          });
        });
        break;
      case "year":
        config.labels = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
        this.setState({
          data: config,
        });
        Meteor.call("dashboard.totalSales", "year", (err, response) => {
          var total = 0;
          for (var i = 0; i < response.length; i++) {
            total += Math.round(response[i].sales / 1.15);
          }
          this.setState({
            total_by_dishes: total,
          });
        });
        Meteor.call("dashboard.totalsalesData", "year", (err, response) => {
          var result = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
          for (var i = 0; i < response.length; i++) {
            result[response[i]._id.day] = Math.round(
              response[i].sales / 1.15
            );
          }
          var config = this.state.data;
          config.datasets[0].data = result;
          this.setState({
            data: config,
          });
        });
        break;
    }
  }

  render() {
    return (
      <div className="card dashboard-totalsales">
        <div className="wrapper_content">
          <ul className="list-timeframe">
            <li
              className={this.state.time == "week" ? "active" : ""}
              onClick={() => this.changeTimeframe("week")}
            >
              week
            </li>
            <li
              className={this.state.time == "month" ? "active" : ""}
              onClick={() => this.changeTimeframe("month")}
            >
              month
            </li>
            <li
              className={this.state.time == "year" ? "active" : ""}
              onClick={() => this.changeTimeframe("year")}
            >
              year
            </li>
          </ul>
          <div className="info">
            <span>total sales</span>
            {this.state.by == "dishes" ? (
              <h5>${this.state.total_by_dishes}</h5>
            ) : (
              <h5>${this.state.total_by_menus}</h5>
            )}
          </div>
          <Line data={this.state.data} />
        </div>
      </div>
    );
  }
}
