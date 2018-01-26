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
  Tracker
} from 'meteor/tracker'
import {
  ReactiveVar
} from 'meteor/reactive-var'
import {
  get_checkboxes_value
} from '/imports/functions/get_checkboxes_value.js';

import './create_dishes_form.html';


Meteor.subscribe('files.images.all');

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
    return Session.get('image_id');
  },

  load_dish: function() {
    dish_url = Images.meata.base64;
    return dish_url;
  }
});

Template.uploadForm.events({
  'change #file_input' (e, template) {
    if (e.currentTarget.files && e.currentTarget.files[0]) {
      // We upload only one file, in case
      // multiple files were selected
      var upload;
      var reader = new FileReader();
      reader.readAsDataURL(e.currentTarget.files[0]);
      reader.onloadend = function () {
        upload = Images.insert({
          file: e.currentTarget.files[0],
          streams: 'dynamic',
          chunkSize: 'dynamic',
          meta: {
            base64: reader.result
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
              var dish_url = Images.meta.base64;
              $(".circle_base").css("background-image", "url(" + dish_url + ")");
            }, 500);
            Session.set('image_id', Images._id);
            /** above is the line that prevents meteor from reloading **/
          }
          Meteor._reload.onMigrate(function() {
            return [false];
          });
          template.currentUpload.set(false);
        });

        upload.start();
      };
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
    if (selected_dish) {
      Ingredients.find({
        dish_name: selected_dish.dish_name,
        user_id: Meteor.userId()
      });
      return "ingredient_update";
    } else {
      return "ingredient_input";
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

    if (!ingredient_name || ingredient_name == '' || !ingredient_quantity || ingredient_quantity == ''){
      Materialize.toast('Please complete ingedient before add into dish.', 4000, 'rounded red lighten-2');
      return false;
    }

    var ingedient_temp = Session.get('ingredient_temp')
    ingedient_temp.push({
      dish_name: dish_name,
      user_id: Meteor.userId(),
      ingredient_name: ingredient_name,
      ingredient_quantity: ingredient_quantity,
      ingredient_unit: ingredient_unit
    });

    Session.set('ingredient_temp', ingedient_temp);

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
    $('select>option:eq(0)').prop('selected', true);
  },

  'click #ingredient_update': function(event) {
    event.preventDefault();
    var dish_name = $('#dish_name').val();
    var ingredient_name = $('#ingredient_name').val();
    var ingredient_quantity = $('#ingredient_quantity').val();
    var ingredient_unit = $('#ingredient_unit').val();
    Meteor.call('ingredient.update', dish_name, Meteor.userId(), ingredient_name, ingredient_quantity, ingredient_unit, function(err) {
      if (err) Materialize.toast('Error: ' + err.message, 4000, 'rounded red lighten-2');
    });

    $('#ingredient_name').val("");
    $('#ingredient_quantity').val("");
    $('select>option:eq(0)').prop('selected', true);
  },

  'click #delete_perm_ingredient': function(event) {
    Meteor.call('ingredient.remove', this._id, function(err) {
      if (err) Materialize.toast('Error: ' + err.message, 4000, 'rounded red lighten-2');
    });
  },

  'click #delete_temp_ingredient': function(event) {
    filter_array = Session.set('ingredient_temp').filter(function( obj ) {
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

Template.food_tags.onRendered(function() {
  this.$('.collapsible').collapsible('open', 0);
  this.$('.collapsible').collapsible('close', 1);
  this.$('.collapsible').collapsible('close', 2);
  this.$('.collapsible').collapsible('close', 3);
  this.$('.collapsible').collapsible('close', 4);
  this.$('.collapsible').collapsible('close', 5);
  this.$('.collapsible').collapsible('close', 6);
  this.$('.collapsible').collapsible('close', 7);
  this.$('.collapsible').collapsible('close', 8);
  this.$('.collapsible').collapsible({
    accordion: false, // A setting that changes the collapsible behavior to expandable instead of the default accordion style
  });
});

Template.food_tags.helpers({

  title_list: [{
      name: 'Cuisine',
      id: 'Cuisine'
    },
    {
      name: 'Protein',
      id: 'Protein'
    },
    {
      name: 'Categories',
      id: 'Categories'
    },
    {
      name: 'Cooking method',
      id: 'Cooking_method'
    },
    {
      name: 'Taste',
      id: 'Taste'
    },
    {
      name: 'Texture',
      id: 'Texture'
    },
    {
      name: 'Vegetables',
      id: 'Vegetables'
    },
    {
      name: 'Condiements',
      id: 'Condiements'
    },
    {
      name: 'Serving temperature',
      id: 'Serving_temperature'
    },
  ],
});

Template.cuisines_list.helpers({
  cuisines_list: [{
      name: 'African',
      id: 'African'
    },
    {
      name: 'American',
      id: 'American'
    },
    {
      name: 'Australian',
      id: 'Australian'
    },
    {
      name: 'Chinese',
      id: 'Chinese'
    },
    {
      name: 'French',
      id: 'French'
    },
    {
      name: 'Fusion',
      id: 'Fusion'
    },
    {
      name: 'Indian',
      id: 'Indian'
    },
    {
      name: 'International',
      id: 'International'
    },
    {
      name: 'Italian',
      id: 'Italian'
    },
    {
      name: 'Japanese',
      id: 'Japanese'
    },
    {
      name: 'Korean',
      id: 'Korean'
    },
    {
      name: 'Mexican',
      id: 'Mexican'
    },
    {
      name: 'Nordic',
      id: 'Nordic'
    },
    {
      name: 'Portuguese',
      id: 'Portuguese'
    },
    {
      name: 'South American',
      id: 'South_American'
    },
    {
      name: 'Southeast Asian',
      id: 'Southeast_Asian'
    },
    {
      name: 'Spanish',
      id: 'Spanish'
    },
    {
      name: 'Taiwanese',
      id: 'Taiwanese'
    },
  ],
});

Template.cuisines_list.events({
  'change .filled-in': function(event, template) {
    get_checkboxes_value('cuisines_tags', template);
  }
});

Template.proteins_list.helpers({
  proteins_list: [{
      name: 'Beef',
      id: 'Beef'
    },
    {
      name: 'Chicken',
      id: 'Chicken'
    },
    {
      name: 'Egg',
      id: 'Egg'
    },
    {
      name: 'Fish',
      id: 'Fish'
    },
    {
      name: 'Lamb',
      id: 'Lamb'
    },
    {
      name: 'Pork',
      id: 'Pork'
    },
    {
      name: 'Seafood',
      id: 'Seafood'
    },
  ],
})

Template.proteins_list.events({
  'change .filled-in': function(event, template) {
    get_checkboxes_value('proteins_tags', template);
  }
});

Template.categories_list.helpers({
  categories_list: [{
      name: 'Bread',
      id: 'Bread'
    },
    {
      name: 'Burger',
      id: 'Burger'
    },
    {
      name: 'Cake',
      id: 'Cake'
    },
    {
      name: 'Curry',
      id: 'Curry'
    },
    {
      name: 'Dessert',
      id: 'Dessert'
    },
    {
      name: 'Drinks',
      id: 'Drinks'
    },
    {
      name: 'Noodles',
      id: 'Noodles'
    },
    {
      name: 'Pasta',
      id: 'Pasta'
    },
    {
      name: 'Pastry',
      id: 'Pastry'
    },
    {
      name: 'Porridge',
      id: 'Porridge'
    },
    {
      name: 'Rice',
      id: 'Rice'
    },
    {
      name: 'Salad',
      id: 'Salad'
    },
    {
      name: 'Sandwich',
      id: 'Sandwich'
    },
    {
      name: 'Soup',
      id: 'Soup'
    },
    {
      name: 'Vegan',
      id: 'Vegan'
    },
    {
      name: 'Vegetarian',
      id: 'Vegetarian'
    },
  ]
});

Template.categories_list.events({
  'change .filled-in': function(event, template) {
    get_checkboxes_value('categories_tags', template);
  }
});

Template.cooking_methods_list.helpers({
  cooking_methods_list: [{
      name: 'BBQ',
      id: 'BBQ'
    },
    {
      name: 'Braised',
      id: 'Braised'
    },
    {
      name: 'Deep-fried',
      id: 'Deep_fried'
    },
    {
      name: 'Poached',
      id: 'Poached'
    },
    {
      name: 'Roast',
      id: 'Roast'
    },
    {
      name: 'Smoked',
      id: 'Smoked'
    },
    {
      name: 'Sous-vide',
      id: 'Sous_vide'
    },
    {
      name: 'Steamed',
      id: 'Steamed'
    },
    {
      name: 'Stewed',
      id: 'Stewed'
    },
    {
      name: 'Stir-fried',
      id: 'Stir_fried'
    },
  ],
});

Template.cooking_methods_list.events({
  'change .filled-in': function(event, template) {
    get_checkboxes_value('cooking_methods_tags', template);
  }
});

Template.tastes_list.helpers({
  tastes_list: [{
      name: 'Bitter',
      id: 'Bitter'
    },
    {
      name: 'Cheesy',
      id: 'Cheesy'
    },
    {
      name: 'Floral',
      id: 'Floral'
    },
    {
      name: 'Heavy',
      id: 'Heavy'
    },
    {
      name: 'Hot',
      id: 'Hot'
    },
    {
      name: 'Salty',
      id: 'Salty'
    },
    {
      name: 'Savory',
      id: 'Savory'
    },
    {
      name: 'Smoky',
      id: 'Smoky'
    },
    {
      name: 'Sour',
      id: 'Sour'
    },
    {
      name: 'Spicy',
      id: 'Spicy'
    },
    {
      name: 'Sweet',
      id: 'Sweet'
    },
    {
      name: 'Tart',
      id: 'Tart'
    },
    {
      name: 'Umami',
      id: 'Umami'
    },
  ],
});

Template.tastes_list.events({
  'change .filled-in': function(event, template) {
    get_checkboxes_value('tastes_tags', template);
  }
});

Template.textures_list.helpers({
  textures_list: [{
      name: 'Dry',
      id: 'Dry'
    },
    {
      name: 'Mushy',
      id: 'Mushy'
    },
    {
      name: 'Moist',
      id: 'Moist'
    },
    {
      name: 'Gooey',
      id: 'Gooey'
    },
    {
      name: 'Greasy',
      id: 'Greasy'
    },
    {
      name: 'Oily',
      id: 'Oily'
    },
    {
      name: 'Crumbly',
      id: 'Crumbly'
    },
    {
      name: 'Creamy',
      id: 'Creamy'
    },
  ],
});

Template.textures_list.events({
  'change .filled-in': function(event, template) {
    get_checkboxes_value('textures_tags', template);
  }
});

Template.vegetables_list.helpers({
  vegetables_list: [{
      name: 'Beans',
      id: 'Beans'
    },
    {
      name: 'Flowers & flower buds',
      id: 'Flowers_buds'
    },
    {
      name: 'Fruits',
      id: 'Fruits'
    },
    {
      name: 'Grains',
      id: 'Grains'
    },
    {
      name: 'Herbs',
      id: 'Herbs'
    },
    {
      name: 'Melons',
      id: 'Melons'
    },
    {
      name: 'Root vegetables',
      id: 'Roots'
    },
    {
      name: 'Salad leaf vegetables',
      id: 'Salad_leaves'
    },
    {
      name: 'Squashes',
      id: 'Squashes'
    },
  ],
});

Template.vegetables_list.events({
  'change .filled-in': function(event, template) {
    get_checkboxes_value('vegetables_tags', template);
  }
});

Template.condiments_list.helpers({
  condiments_list: [{
      name: 'Butter',
      id: 'Butter'
    },
    {
      name: 'Cheese',
      id: 'Cheese'
    },
    {
      name: 'Cream',
      id: 'Cream'
    },
    {
      name: 'Dried food',
      id: 'Dried_food'
    },
    {
      name: 'Dried fruits',
      id: 'Dried_fruits'
    },
    {
      name: 'Dried seafood',
      id: 'Dried_seafood'
    },
    {
      name: 'Dried vegetables',
      id: 'Dried_vegetables'
    },
    {
      name: 'Dry herbs',
      id: 'Dry_herbs'
    },
    {
      name: 'Flour',
      id: 'Flour'
    },
    {
      name: 'Jam',
      id: 'Jam'
    },
    {
      name: 'Oil',
      id: 'Oil'
    },
    {
      name: 'Powder',
      id: 'Powder'
    },
    {
      name: 'Salt',
      id: 'Salt'
    },
    {
      name: 'Sauce',
      id: 'Sauce'
    },
    {
      name: 'Sugar',
      id: 'Sugar'
    },
    {
      name: 'Yoghurt',
      id: 'Yoghurt'
    },
  ],
});

Template.condiments_list.events({
  'change .filled-in': function(event, template) {
    get_checkboxes_value('condiemnts_tags', template);
  }
});

Template.serving_temperature_list.helpers({
  serving_temperature_list: [{
      name: 'Chill',
      id: 'Chill'
    },
    {
      name: 'Cold',
      id: 'Cold'
    },
    {
      name: 'Frozen',
      id: 'Frozen'
    },
    {
      name: 'Hot',
      id: 'Hot'
    },
    {
      name: 'Warm',
      id: 'Warm'
    },
  ],
});

Template.serving_temperature_list.events({
  'change .filled-in': function(event, template) {
    get_checkboxes_value('serving_temperature_tags', template);
  }
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
    var dish_selling_price = event.target.dish_selling_price.value;
    if (dish_name.trim().length == "" || dish_cost.trim().length == "" || dish_selling_price.trim().length == "") {
      Materialize.toast("Sorry we can't save your dish. We need to have at least your dish name, dish cost and selling price to save", 6000, 'rounded red lighten-2');
    } else {
      var dish_description = event.target.dish_description.value;
      var cooking_time = event.target.cooking_time.value;
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
      Meteor.call('dish.insert', Session.get('image_id'), user_id, kitchen_id, dish_name, dish_description, Session.get('serving_option_tags'), cooking_time,
        dish_cost, dish_selling_price, dish_profit, Session.get('allergy_tags'), Session.get('dietary_tags'), Session.get('cuisines_tags'), Session.get('proteins_tags'),
        Session.get('categories_tags'), Session.get('cooking_methods_tags'), Session.get('tastes_tags'), Session.get('textures_tags'), Session.get('vegetables_tags'),
        Session.get('condiments_tags'), Session.get('serving_temperature_tags'), new Date(), new Date(), false, false, function(err){
          if (!err) { // no error when create dishes
            Materialize.toast('Nice! You have created a dish!', 4000, "rounded red lighten-2");
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
            Materialize.toast('Oops! Error occur when create a dish. Please try again later.' + err.message, 4000, "rounded red lighten-2");
          }
        })
    }
    Session.set('image_id',null);
    Session.keys = {}
    Session.set('ingredient_temp', []);
  },
  'click .update_dish_submit_btn': function(event) {
    event.preventDefault();
    var kitchen = Kitchen_details.findOne({
      user_id: Meteor.userId()
    });
    var kitchen_id = kitchen._id;
    var user_id = Meteor.userId();
    var dish_name = $('#dish_name').val();
    var dish_description = $('#dish_description').val();
    var cooking_time = $('#cooking_time').val();
    var dish_cost = $('#dish_cost').val();
    var dish_selling_price = $('#dish_selling_price').val();
    var dish_profit = dish_selling_price - dish_cost;

    Meteor.call('dish.update',
      Session.get('selected_dishes_id'),
      Session.get('image_id'),
      user_id,
      kitchen_id,
      dish_name,
      dish_description,
      Session.get('serving_option_tags'),
      cooking_time,
      dish_cost,
      dish_selling_price,
      dish_profit,
      Session.get('allergy_tags'),
      Session.get('dietary_tags'),
      Session.get('cuisines_tags'),
      Session.get('proteins_tags'),
      Session.get('categories_tags'),
      Session.get('cooking_methods_tags'),
      Session.get('tastes_tags'),
      Session.get('textures_tags'),
      Session.get('vegetables_tags'),
      Session.get('condiments_tags'),
      Session.get('serving_temperature_tags'),
      new Date(),
      function(err) {
        if (err) Materialize.toast('Oops! Error update dish. Please try again. ' + err.message, 4000, "rounded red lighten-2");
      }
    );

    // Ingredients_temporary.find({}).forEach(function(doc) {
    //   Ingredients.insert(doc);
    // });

    var list_ingredients = Session.get('ingredient_temp');
    list_ingredients.forEach(function(doc){
      doc.dish_name = event.target.dish_name.value;
    });
    list_ingredients.forEach(function(doc){
      Ingredients.insert(doc);
    });

    Session.set('ingredient_temp', []);
    Session.set('selected_dishes_id', null);
  }
});
