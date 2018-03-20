/*import { Accounts } from 'meteor/accounts-base';
import { Template } from 'meteor/templating';*/

export function search_distinct_order_record_orders_tracking(field, status){
  return _.uniq(Order_record.find({'buyer_id': Meteor.userId(), 'status':status}, {
      sort: {[field]: 1}, fields: {[field]: 1}
    }).fetch().map(x => x[field]), true);
}
