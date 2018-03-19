import {Bar, Line, Pie} from 'meteor/jmsalash:chartjs';
import {Moment} from 'meteor/momentjs:moment';
import {date_time_conversion} from '/imports/functions/date_time_conversion.js';

Template.dashbaord_sales.onRendered(function(){

var popCanvas = $('#sales_chart');

var time_test = new Date()

var time_ms = Date.now();

var time_ms_24 = time_ms - 24*60*60*1000;

var transaction = Transactions.find({'seller_id': Meteor.userId(),'status': 'Completed'}).fetch()
var counter = transaction.length
var time_label = [];
var sales_data = [];



  for(i=0;i<13;i++){
    var time_ms_test = time_ms_24 + (i)*2*60*60*1000;
    var hour = (time_ms - time_ms_test)/(60*60*1000);
    var amount = 0;

    for(x=0;x<counter;x++){

      console.log(time_ms_24)

      console.log(Date.parse(transaction[x].updatedAt))

      console.log(time_ms_test)

      if(Date.parse(transaction[x].updatedAt) > time_ms_24 && Date.parse(transaction[x].updatedAt) < time_ms_test){

          amount += transaction[x].amount


      }
    }
    time_label[i] = 'last '+ hour + ' hrs';
    sales_data[i] = amount;
    console.log(amount)
  }

    var barChart = new Chart(popCanvas,{
      type: 'line',
      data:{
        labels: time_label,
        datasets:[{
          label: 'Sales',
          data: sales_data,
          backgroundColor:[
            'rgba(255, 99, 132, 0.6)',
            'rgba(255, 99, 132, 0.6)',
            'rgba(255, 99, 132, 0.6)',
            'rgba(255, 99, 132, 0.6)',
            'rgba(255, 99, 132, 0.6)',
            'rgba(255, 99, 132, 0.6)',
            'rgba(255, 99, 132, 0.6)',
            'rgba(255, 99, 132, 0.6)',
            'rgba(255, 99, 132, 0.6)',
            'rgba(255, 99, 132, 0.6)',
            'rgba(255, 99, 132, 0.6)',
            'rgba(255, 99, 132, 0.6)',
            'rgba(255, 99, 132, 0.6)'
          ]
        }]
      }

    });
})
