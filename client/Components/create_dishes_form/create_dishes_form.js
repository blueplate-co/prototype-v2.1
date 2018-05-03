import {
  Mongo
} from 'meteor/mongo';
import {
  Template
} from 'meteor/templating';
import {
  Session
} from 'meteor/session'
import {
  FilesCollection
} from 'meteor/ostrio:files';
import {
  ReactiveVar
} from 'meteor/reactive-var'
import {
  get_checkboxes_value
} from '/imports/functions/get_checkboxes_value.js';

import './create_dishes_form.html';


// Meteor.subscribe('files.images.all');

/** function from ostrio **/

Template.uploadForm.onCreated(function() {
  this.currentUpload = new ReactiveVar(false);
  Session.keys = {}
});

Template.uploadForm.helpers({
  currentUpload() {
    return Template.instance().currentUpload.get();
  },

  checkUpload() {
    return Session.get('imgMeta');
  },

  load_dish: function() {
    var dish_url = Session.get('imgMeta');
    return dish_url.medium;
  }
});


Template.uploadForm.events({
  'change #file_input' (e, template) {
    if (e.currentTarget.files && e.currentTarget.files[0]) {
      // We upload only one file, in case
      // multiple files were selected
      var file = e.currentTarget.files[0];
      return data = processImage(file, function(data) {
        upload = Images.insert({
          file: data,
          isBase64: true,
          fileName: file.name,
          streams: 'dynamic',
          chunkSize: 'dynamic',
          meta: {
            base64: data
          }
        }, false);

        upload.on('start', function() {

          Meteor._reload.onMigrate(function() {
            return [false];
          });
          template.currentUpload.set(this);
        });

        upload.on('end', function(error, Images) {
          if (error) {
            alert('Error during upload: ' + error.message);
          } else {
            Meteor.setTimeout(function() {
              Session.set('tempImages', Images.meta.base64);
              var dish_url = Session.get('tempImages');
              $(".circle_base").css("background-image", "url(" + dish_url + ")");
            }, 500);
            Session.set('image_id', Images._id);
            /** above is the line that prevents meteor from reloading **/

            let newImgName = changeImgName(Images.path)
            console.log('image new name: ', newImgName)
            //- meteor call
            Meteor.call('saveToKraken', newImgName, Images.path, (error, result)=>{
              if(error) console.log('kraken errors', error);
              console.log(result);
            });

            //- declare some sizes
            var original = 'https://blueplate-images.s3.ap-southeast-1.amazonaws.com/images/original/' + newImgName;
            var large    = 'https://blueplate-images.s3.ap-southeast-1.amazonaws.com/images/large/' + newImgName;
            var medium   = 'https://blueplate-images.s3.ap-southeast-1.amazonaws.com/images/medium/' + newImgName;
            var small    = 'https://blueplate-images.s3.ap-southeast-1.amazonaws.com/images/small/' + newImgName;

            //- add to sizes object
            var sizes    = {};
            sizes.origin = original;
            sizes.large  = large;
            sizes.medium = medium;
            sizes.small  = small;

            //- set to session
            Session.set('imgMeta', sizes);
            console.log('sizes', Session.get('imgMeta'));

          }
          Meteor._reload.onMigrate(function() {
            return [false];
          });
          template.currentUpload.set(false);
        });

        upload.start();
      });

    }
  }
});

/** fucntion from Ostrio -- end here -- **/

Template.ingredient_input.onRendered(function() {
  this.$('select').material_select();
});

Template.ingredient_input.helpers({
  units: [{
      name: 'g',
      shortform: 'g'
    },
    {
      name: 'kg',
      shortform: 'kg'
    },
    {
      name: 'litre',
      shortform: 'l'
    },
    {
      name: 'ml',
      shortform: 'ml'
    },
    {
      name: 'm',
      shortform: 'm'
    },
    {
      name: 'cm',
      shortform: 'cm'
    },
    {
      name: 'teaspoon',
      shortform: 'tsp'
    },
    {
      name: 'tablespoon',
      shortform: 'tbs'
    },
    {
      name: 'cup',
      shortform: 'c'
    },
    {
      name: 'pound',
      shortform: 'lb'
    },
    {
      name: 'ounce',
      shortform: 'oz'
    },
    {
      name: 'inch',
      shortform: 'in'
    },
    {
      name: 'portion(s)',
      shortform: 'portions'
    },
    {
      name: 'piece(s)',
      shortform: 'pieces'
    },
  ],
  'perm_ingredient_collection': function() {
    if (this.dish_name) {
      console.log('true');
      var value = Ingredients.find({
        dish_name: this.dish_name,
        user_id: Meteor.userId()
      });
      return value;
    } else {
      console.log('false');
      return false;
    }
  },
  'temp_ingredient_list': function() {
    return Ingredients_temporary.find();
  },
  'check_status': function() {
    var selected_dish = Session.get('selected_dishes_id');
    if (!selected_dish || selected_dish.length === 0) {
      return "ingredient_input";
    } else {
      Ingredients.find({
        dish_name: selected_dish.dish_name,
        user_id: Meteor.userId()
      });
      return "ingredient_update";
    }
  }
});

Template.ingredient_input.events({
  'click #ingredient_input': function(event) {
    event.preventDefault();
    var dish_name = $('#dish_name').val();
    var ingredient_name = $('#ingredient_name').val();
    var ingredient_quantity = $('#ingredient_quantity').val();
    var ingredient_unit = $('#ingredient_unit').val();

    console.log('ingredient quantity', ingredient_quantity)

    if (!ingredient_name || ingredient_name == '' ||
        !ingredient_quantity || ingredient_quantity == '' ||
        !_.isNumber(ingredient_quantity) )
    {

      if(ingredient_name == '')
      {
        Materialize.toast('Please  your ingredient name.', 4000, 'rounded bp-green');
        return false;
      }

      if(ingredient_quantity == '')
      {
        Materialize.toast('Please check your the quantity field again. Number is required', 4000, 'rounded bp-green');
        return false;
      }

      // Materialize.toast('Please complete ingedient before add into dish.', 4000, 'rounded bp-green');
      // return false;
    }

    var ingredient_temp = Session.get('ingredient_temp')
    ingredient_temp.push({
      dish_name: dish_name,
      user_id: Meteor.userId(),
      ingredient_name: ingredient_name,
      ingredient_quantity: ingredient_quantity,
      ingredient_unit: ingredient_unit
    });
    Session.set('ingredient_temp', ingredient_temp);

    // should keep that to make visual action on modal content
    Ingredients_temporary.insert({
      dish_name: dish_name,
      user_id: Meteor.userId(),
      ingredient_name: ingredient_name,
      ingredient_quantity: ingredient_quantity,
      ingredient_unit: ingredient_unit,
    });

    $('#ingredient_name').val("");
    $('#ingredient_quantity').val("");
    $('#ingredient_unit option[value=0]').prop('selected', true);
  },

  'click #ingredient_update': function(event) {
    event.preventDefault();
    var dish_name = $('#dish_name').val();
    var ingredient_name = $('#ingredient_name').val();
    var ingredient_quantity = $('#ingredient_quantity').val();
    var ingredient_unit = $('#ingredient_unit').val();
    Meteor.call('ingredient.update', dish_name, Meteor.userId(), ingredient_name, ingredient_quantity, ingredient_unit, function(err) {
      if (err) Materialize.toast('Error: ' + err.message, 4000, 'rounded bp-green');
    });

    $('#ingredient_name').val("");
    $('#ingredient_quantity').val("");
    $('#ingredient_unit option[value=0]').prop('selected', true);
  },

  'click #delete_perm_ingredient': function(event) {
    Meteor.call('ingredient.remove', this._id, function(err) {
      if (err) Materialize.toast('Error: ' + err.message, 4000, 'rounded bp-green');
    });
  },

  'click #delete_temp_ingredient': function(event) {
    filter_array = Session.get('ingredient_temp').filter(function( obj ) {
      return obj._id !== this._id;
    });
    Session.set('ingredient_temp', filter_array);

    Ingredients_temporary.remove({
      _id: this._id
    });
  }
});

Template.price.onCreated(function(){
  this.profit = new ReactiveVar(0);
})

Template.price.helpers({
  'profit': function() {
    return Template.instance().profit.get()
  }
});

Template.price.events({
  'change .dish_price': function() {
    var cost = $('#dish_cost').val();
    var selling_price = $('#dish_selling_price').val();
    var profit_calculation = selling_price - cost;
    Template.instance().profit.set(profit_calculation);
  }
});

Template.food_allergies.helpers({
  allergy_list: [{
      name: 'Milk',
      file_name: 'milk'
    },
    {
      name: 'Tree-nuts',
      file_name: 'tree_nuts'
    },
    {
      name: 'Fish',
      file_name: 'fish'
    },
    {
      name: 'Egg',
      file_name: 'egg'
    },
    {
      name: 'Wheat',
      file_name: 'wheat'
    },
    {
      name: 'Shellfish',
      file_name: 'shellfish'
    },
    {
      name: 'Peanuts',
      file_name: 'peanuts'
    },
    {
      name: 'Soy',
      file_name: 'soy'
    },
  ],
});

Template.food_allergies.events({
  'change .filled-in': function(event, template) {
    get_checkboxes_value('allergy_tags', template);
  }
});

Template.dietary_preferences.helpers({
  dietary_list: [{
      name: 'Diabetic',
      file_name: 'diabetic'
    },
    {
      name: 'Low Sodium',
      file_name: 'low_sodium'
    },
    {
      name: 'Pescetartrian',
      file_name: 'pescetartrian'
    },
    {
      name: 'Gluten free',
      file_name: 'gluten_free'
    },
    {
      name: 'Low carbs',
      file_name: 'low_carb'
    },
    {
      name: 'Vegan',
      file_name: 'vegan'
    },
    {
      name: 'High Protein',
      file_name: 'high_protein'
    },
    {
      name: 'Nuts Free',
      file_name: 'nuts_free'
    },
    {
      name: 'Vegetarian',
      file_name: 'vegetarian'
    },
    {
      name: 'Lactose Free',
      file_name: 'lactose_free'
    },
    {
      name: 'Paleo',
      file_name: 'paleo'
    },
  ],
});

Template.dietary_preferences.events({
  'change .filled-in': function(event, template) {
    get_checkboxes_value('dietary_tags', template);
  }
});


Template.tagging.onRendered(function() {
  $('#dish_tags').material_chip();
});

Template.create_dishes_form.onCreated( function(){
  this.kitchen = this.subscribe('getKitchenDetail');
});

Template.create_dishes_form.events({
  'submit form': function(event) {
    event.preventDefault();
    var kitchen = Kitchen_details.findOne({
      user_id: Meteor.userId()
    });
    var kitchen_id = kitchen._id;
    var user_id = Meteor.userId();
    var dish_name = event.target.dish_name.value;
    var dish_cost = event.target.dish_cost.value;
    var dish_selling_price = Math.floor(parseInt(event.target.dish_selling_price.value) + (parseInt(event.target.dish_selling_price.value) * 0.15)); // add fee 15% into selling price
    if (dish_name.trim().length == "" || dish_cost.trim().length == "" || dish_selling_price.toString().trim().length == "" || Session.get('tempImages') == "") {
      Materialize.toast("Sorry we can't save your dish. We need to have at least your dish images, dish name, dish cost and selling price to save", 6000, 'rounded bp-green');
      return false;
    } else {
      var dish_description = event.target.dish_description.value;
      var days = event.target.days.value;
      var hours = event.target.hours.value;
      var mins = event.target.mins.value;
      var cooking_time = (parseInt(days) * 24 * 60) + (parseInt(hours) * 60) + parseInt(mins);
      if (cooking_time === 0) {
        Materialize.toast("Cooking time must greater than 0 mins", 6000, 'rounded bp-green');
        return true;
      }
      var dish_profit = dish_selling_price - dish_cost;
      // Ingredients_temporary.find({}).forEach(function(doc) {
      //   Ingredients.insert(doc);
      // });
      // make sure the latest value in ingredient array is the latest dish name
      var list_ingredients = Session.get('ingredient_temp');
      list_ingredients.forEach(function(doc){
        doc.dish_name = event.target.dish_name.value;
      });
      list_ingredients.forEach(function(doc){
        Ingredients.insert(doc);
      });
      var dish_tags = $('#dish_tags').material_chip('data')
      if (!Session.get('imgMeta')) {
        Session.set('imgMeta', null)
      }
      if (!Session.get('serving_option_tags')) {
        Materialize.toast('Please choose your serving option.', 4000, "rounded bp-green");
        return false;
      } else {
        if (Session.get('serving_option_tags').length == 0) {
          Materialize.toast('Please choose your serving option.', 4000, "rounded bp-green");
          return false;
        }
      }
      Meteor.call('dish.insert', Session.get('image_id'), user_id, kitchen_id, dish_name, dish_description, Session.get('serving_option_tags'), cooking_time, days, hours, mins,
        dish_cost, dish_selling_price, dish_profit, Session.get('allergy_tags'), Session.get('dietary_tags'), dish_tags, new Date(), new Date(), false, false,
        //- adding meta data for different image sizes
        Session.get('imgMeta'),
        function(err){
          if (!err) { // no error when create dishes
            Materialize.toast('Nice! You have created a dish!', 4000, "rounded bp-green");
            // trigger click on close button
            Ingredients_temporary.remove({});
            event.target.dish_name.value = "";
            event.target.dish_description.value = "";
            event.target.cooking_time.value = "";
            event.target.dish_cost.value = "";
            event.target.dish_selling_price.value = "";
            var checkboxes = document.getElementsByClassName("filled-in");
            for (var i = 0; i < checkboxes.length; i++) {
              checkboxes[i].checked = false;
            };
            Session.keys = {}; /** clear Session.get for image upload to reset back to original **/
            Materialize.updateTextFields();
            // uncheck all checkbox when complete create dishes
            var checkboxes = document.getElementsByClassName("dishes_checkbox");
            for (var i = 0; i < checkboxes.length; i++) {
              checkboxes[i].checked = false;
            };
            // hide popup with trigger click cancel button on modal
            $('#add_dish_modal > div.modal-footer > a.modal-action.modal-close.waves-effect.waves-green.btn-flat')[0].click();
            return false;
          } else {
            Materialize.toast('Oops! Error occur when create a dish. Please try again later.' + err.message, 4000, "rounded bp-green");
          }
        })
        Session.set('image_id',null);
        Session.keys = {}
        Session.set('ingredient_temp', []);
        Session.set('tempImages', []);
        Session.set('imgMeta', []);
        $('#dish_tags').material_chip({
          data: [],
        });
      $('.modal').modal('close');
    }
  },
  'click .update_dish_submit_btn': function(event) {
    event.preventDefault();
    console.log('updating...');
    var kitchen = Kitchen_details.findOne({
      user_id: Meteor.userId()
    });
    var kitchen_id = kitchen._id;
    var user_id = Meteor.userId();
    var dish_name = $('#dish_name').val();
    var dish_description = $('#dish_description').val();
    var days = $('#days').val();
    var hours = $('#hours').val();
    var mins = $('#mins').val();
    var cooking_time = (parseInt(days) * 24 * 60) + (parseInt(hours) * 60) + parseInt(mins);
    if (cooking_time === 0) {
      Materialize.toast("Cooking time must greater than 0 mins", 6000, 'rounded bp-green');
      return true;
    }
    var dish_cost = $('#dish_cost').val();
    var dish_selling_price = $('#dish_selling_price').val();
    var dish_profit = dish_selling_price - dish_cost;

    var dish_tags = $('#dish_tags').material_chip('data')
    console.log(Session.get('imgMeta'));

    Meteor.call('dish.update',
      Session.get('selected_dishes_id'),
      Session.get('image_id'),
      user_id,
      kitchen_id,
      dish_name,
      dish_description,
      Session.get('serving_option_tags'),
      cooking_time,
      days,
      hours,
      mins,
      dish_cost,
      dish_selling_price,
      dish_profit,
      Session.get('allergy_tags'),
      Session.get('dietary_tags'),
      dish_tags,
      Session.get('imgMeta'),
      function(err) {
        if (err) {
          Materialize.toast('Oops! Error update dish. Please try again. ' + err.message, 4000, "rounded bp-green");
        } else {
          Materialize.toast('Update successful.' , 4000, "rounded bp-green");

              var list_ingredients = Session.get('ingredient_temp');
              list_ingredients.forEach(function(doc){
                doc.dish_name = event.target.dish_name.value;
              });
              list_ingredients.forEach(function(doc){
                Ingredients.insert(doc);
              });

              Session.set('ingredient_temp', []);
              Session.set('selected_dishes_id', null);
              Session.set('imgMeta', []);
        }
      }
    );
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
