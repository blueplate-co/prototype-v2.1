
export function search_distinct_for_delivery_in_shopping_cart(field){
  return _.uniq(Shopping_cart.find({'buyer_id': Meteor.userId(), 'serving_option':'Delivery'}, {
      sort: {[field]: 1}, fields: {[field]: 1}
    }).fetch().map(x => x[field]), true);
  }

  export function search_distinct_in_shopping_cart(field){
    return _.uniq(Shopping_cart.find({'buyer_id': Meteor.userId()}, {
        sort: {[field]: 1}, fields: {[field]: 1}
      }).fetch().map(x => x[field]), true);
    }

  export function search_distinct_in_shopping_cart_seller_specific(field, seller_id){
    return _.uniq(Shopping_cart.find({'buyer_id': Meteor.userId(), 'seller_id': seller_id}, {
        sort: {[field]: 1}, fields: {[field]: 1}
      }).fetch().map(x => x[field]), true);
  }

    export function search_distinct_in_order_record(field, status){
      return _.uniq(Order_record.find({'seller_id': Meteor.userId(), 'status':status}, {
          sort: {[field]: 1}, fields: {[field]: 1}
        }).fetch().map(x => x[field]), true);
      }

/** Search Distinct Originial
  export function search_distinct(collection, field){
    return _.uniq(collection.find({'buyer_id': Meteor.userId()}, {
        sort: {[field]: 1}, fields: {[field]: 1}
      }).fetch().map(x => x[field]), true);
    }
**/
