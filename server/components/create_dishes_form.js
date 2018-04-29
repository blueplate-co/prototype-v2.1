import {
  Meteor
} from 'meteor/meteor';
import {
  Match
} from 'meteor/check';
import {
  check
} from 'meteor/check';

import rotate_images from './image-processing.js';

Shopping_cart = new Mongo.Collection('shopping_cart');
Dishes = new Mongo.Collection('dishes');
Ingredients = new Mongo.Collection('ingredients');

Images = new FilesCollection({
  storagePath: () => {
    return process.env.PWD + '/public/dishes_upload/';
  },
  collectionName: 'Images',
  allowClientCode: false,
  onBeforeUpload(file) {

    if (file.size <= 5242880 && /png|jpg|jpeg/i.test(file.extension)) {
      return true;
    } else {
      return 'Please upload image, with size equal or less than 5MB';
    }
  }
});

Images.on('afterUpload', function(fileRef) {
  if (/png|jpe?g/i.test(fileRef.extension || '')) {
    rotate_images(this, fileRef, (error, fileRef) => {
      if (error) {
        console.error(error);
      }
    });
  }
})
/**
Meteor.publish('files.images.all', function() {
  return Images.find().cursor;
});
**/

Meteor.methods({
  'saveToKraken'(imgName, imgPath){
    check(imgName, String);
    check(imgPath, String);
    var sizes = {};
    //- declare some key
    var Kraken = require('kraken');
    var kraken = new Kraken({
      "api_key": "7f26da7198b9f421fc6dd7df3ee256e9",
      "api_secret": "88b424bc8e85febe7c18bec79d4ea31e6bc71546"
    });

    //- change image name
    // imgName = changeImgName(imgPath)

    // console.log('here in saveToKraken function');
    // console.log('image path', imgPath);
    // console.log('image name', imgName);

    //- some sizes definition
    var params2 = {
        file: imgPath,
        wait: true,
        lossy: true, //- switch to lossless
        s3_store: {
            key: "AKIAJLVB7Y7XKMLK7AVQ",
            secret: "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",
            bucket: "blueplate-images/images",
            region: "ap-southeast-1"
        },
        resize: [
            {
                id: 'original',
                strategy: 'none',
                quality: 90,
                lossy: false,
                storage_path: "original/" + imgName
            },
            {
                id: "small",
                strategy: "fit",
                // size: 100,
                width: 100,
                height: 100,
                scale: 40,
                enhance: true,
                storage_path: "small/" + imgName
            },
            {
                id: "medium",
                strategy: "square",
                size: 300,
                storage_path: "medium/" + imgName
            },
            {
                id: "large",
                strategy: "square",
                size: 400,
                storage_path: "large/" + imgName
            }
        ]
    };

    // console.log('param', params2);
    var returned_data = null;
    kraken.upload(params2, function (status) {
      console.log(status);
      if (status.success) {

        console.log("Success. Optimized image URL: %s", status);
        // console.log('return data: ', sizes);

      } else {
        console.log("Fail. Error message: %s", status.message);
      }
    });

  },
  'shopping_cart.insert' (
    foodie_id,
    homecook_id,
    foodie_name,
    homecook_name,
    address,
    serving_option,
    ready_time,
    dish_id,
    dish_name,
    quantity,
    dish_price,
  ) {
    check(foodie_id, String);
    check(homecook_id, String);
    check(foodie_name, String);
    check(homecook_name, String);
    check(address, Match.Any);
    check(serving_option, Match.Any);
    check(ready_time, Match.Any);
    check(dish_id, Match.Any);
    check(dish_name, Match.Any);
    check(quantity, Match.Any);
    check(dish_price, Match.Any);

    Shopping_cart.insert({
      buyer_id: foodie_id,
      seller_id: homecook_id,
      buyer_name: foodie_name,
      seller_name: homecook_name,
      address: address,
      serving_option: serving_option,
      ready_time: ready_time,
      product_id: dish_id,
      product_name: dish_name,
      quantity: quantity,
      product_price: dish_price,
      total_price_per_dish: dish_price,
      updatedAt: new Date(),
      createdAt: new Date()
    })
  },

  'shopping_cart.update' (
    order_id,
    quantity,
    total_price_per_dish
  ) {

    check(order_id, String);
    check(total_price_per_dish, Match.Any);

    Shopping_cart.update({
      _id: order_id
    }, {
      $set: {
        quantity: quantity,
        total_price_per_dish: total_price_per_dish,
        updatedAt: new Date()

      }
    });
  },

  'shopping_cart.remove' (
    cart_id
  ) {

    check(cart_id, String);

    Shopping_cart.remove({
      _id: cart_id
    })
  },

  'shopping_cart.update_serving' (
    buyer_id,
    seller_id,
    address,
    serving_option
  ) {

    check(buyer_id, String);
    check(seller_id, String);
    check(address, String);
    check(serving_option, Match.Any);

    Shopping_cart.update({
      buyer_id: buyer_id,
      seller_id: seller_id
    }, {
      $set: {
        address: address,
        serving_option: serving_option,
        updatedAt: new Date()
      }
    }, {
      multi: true
    });
  },


  'ingredient.update' (dish_name, user_id, ingredient_name, ingredient_quantity, ingredient_unit) {
    check(dish_name, String);
    check(user_id, String);
    check(ingredient_quantity, Match.Any);
    check(ingredient_unit, Match.Any);

    Ingredients.insert({
      dish_name: dish_name,
      user_id: Meteor.userId(),
      ingredient_name: ingredient_name,
      ingredient_quantity: ingredient_quantity,
      ingredient_unit: ingredient_unit,
    });
  },
  'ingredient.remove' (_id) {
    check(_id, String);
    Ingredients.remove({
      _id: _id
    })
  }
});

// insert Dish into db
Meteor.methods({
  'dish.insert': function(
    image_id,
    user_id,
    kitchen_id,
    dish_name,
    dish_description,
    serving_option,
    cooking_time,
    days,
    hours,
    mins,
    dish_cost,
    dish_selling_price,
    dish_profit,
    allergy_tags,
    dietary_tags,
    dish_tags,
    createdAt,
    updatedAt,
    online_status,
    deleted,
    //- insert the image different sizes
    imgMeta
  ) {
    console.log('image meta data', imgMeta);
    // check it before insert
    check(image_id, Match.Any);
    check(user_id, String); //unessesary, check per-per args but not ever exist
    check(kitchen_id, String);
    check(dish_name, String);
    check(dish_description, Match.Any);
    check(serving_option, Match.Any);
    check(cooking_time, Match.Any);
    check(dish_cost, Match.Any);
    check(dish_selling_price, Match.Any);
    check(dish_profit, Match.Any);
    check(allergy_tags, Match.Any);
    check(dietary_tags, Match.Any);
    check(dish_tags, Match.Any);
    check(createdAt, Date);
    check(updatedAt, Date);
    //- checking meta data for image sizes
    check(imgMeta, Object);

    Dishes.insert({
      image_id: image_id,
      user_id: Meteor.userId(),
      kitchen_id: kitchen_id,
      dish_name: dish_name,
      dish_description: dish_description,
      serving_option: serving_option,
      cooking_time: cooking_time,
      days: days,
      hours: hours,
      mins: mins,
      dish_cost: dish_cost,
      dish_selling_price: dish_selling_price,
      dish_profit: dish_profit,
      allergy_tags: allergy_tags,
      dietary_tags: dietary_tags,
      dish_tags: dish_tags,
      createdAt: new Date(),
      updatedAt: new Date(),
      online_status: false,
      order_count: 0,
      average_rating: 0,
      deleted: false,
      //- insert meta data for image sizes
      meta: imgMeta
    });
  }
});

let changeImgName = function(imgPath)
{

  //- return new name DateTime in milliseconds + unique ID
  let currentDate = new Date()
  var milliseconds = currentDate.getMilliseconds()
  //- uniqid
  let uniqid = require('uniqid');

  //- get extension from img path
  let fileExtension = require('file-extension')
  let extension = fileExtension(imgPath)
  console.log('file extension', extension)

  return milliseconds + '_' + uniqid()+ '.' + extension

}
