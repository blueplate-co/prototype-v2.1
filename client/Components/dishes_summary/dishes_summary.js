import { Blaze } from 'meteor/blaze'
import { checkboxes_recall } from '/imports/functions/checkboxes_recall.js'

Template.dishes_summary.onRendered(function(){
  window.scrollTo(0,0);
  $('.modal').modal({
    dismissible: false, // Modal can be dismissed by clicking outside of the modal
    opacity: .5, // Opacity of modal background
    inDuration: 300, // Transition in duration
    outDuration: 200, // Transition out duration
    ready: function() {
       $(".overlay").remove();
    }, // Callback for Modal open. Modal and trigger parameters available
    complete: function() {
    $(".overlay").remove();
    } // Callback for Modal close
  });
  $('.tooltipped').tooltip({delay: 500});
  Session.set('ingredient_temp', []);
  Session.set('imgMeta', []);
});

Template.dishes_summary.events({
  'click #btn_add_dish': function(event) {
    event.preventDefault();
    Session.set('image_id',null);
    Meteor.call('getUserProfileByID', function (err, result) {
        if (err) {
          console.log('Error when get user ID: ' + err.message);
        } else {
          if (result) {
            if (typeof result.kitchen_name !== 'undefined' && typeof result.chef_name !== 'undefined' && result.kitchen_name !== null && result.chef_name !== null) {
              Session.keys = {};
              if (Blaze.getView($("#add_dish_modal_content")[0])._templateInstance.lastNode.children.length > 1) {
                $('.create_dishes_form_container').remove();
              };
              Blaze.render(Template.create_dishes_form,$("#add_dish_modal_content")[0]);
              $(".create_dish_submit_btn").hide()
              $(".update_dish_submit_btn").hide()
            } else {
              //$('#add_dish_modal').hide();
              $('.modal-overlay').last().remove();
              Materialize.toast('Please complete your homecook profile before do this action.', 4000, 'rounded bp-green');
              setTimeout(function(){
                  $('.modal-overlay').last().fadeOut();
                  $('.modal-overlay').last().remove();
              }, 300);
            }
          } else {
            $('#add_dish_modal').hide();
            $('.modal-overlay').last().remove();
            Materialize.toast('Please complete your homecook profile before do this action.', 4000, 'rounded bp-green');
            setTimeout(function(){
                $('.modal-overlay').last().fadeOut();
                $('.modal-overlay').last().remove();
            }, 300);
          }
        }
    });
  },

  'click #close_create_dish_modal': function(event) {
    // clear all selected dishes in session
    event.preventDefault();
    Session.set('selected_dishes_id', []);
    Session.set('tempImages', '');
    Session.set('ingredient_temp', []);
    Session.set('imgMeta', []);
  },

  'click .btn_edit_dish': function(event,template) {
    event.preventDefault();
    // Check if a create dish form existed in the modal
    if (Blaze.getView($("#edit_dish_modal_content")[0])._templateInstance.lastNode.children.length > 1) {
      $('.create_dishes_form_container').remove();
    };

    var selected_dishes = Session.get('selected_dishes_id');
    // remove all "on" element in value

    if (typeof selected_dishes !== "undefined" && typeof selected_dishes !== "string"){
      selected_dishes = selected_dishes.filter(function(a){return a !== "on"})
    }

    //Validation of dish selection checkbox
    if (!selected_dishes || selected_dishes.length === 0) {
      Materialize.toast("Please select a dish you'd like to edit", 4000, 'rounded bp-green');
      return false;
    } else if ( selected_dishes.length > 1 )  {
      Materialize.toast("Ops! You can't choose more than 1 dish to edit, please try again", 4000, 'rounded bp-green');
      return false;
    } else {
      // var selected_dishes = Session.get('selected_dishes_id');
      var get_dish = Dishes.findOne({_id: selected_dishes[0]});

      console.log('get dish', get_dish.meta);

      // Below parameters will be passed to create_dishes_form template using Blaze.renderWithData
      var get_dish_contents = {
        dish_name: get_dish.dish_name,
        dish_description: get_dish.dish_description,
        serving_option: get_dish.serving_option,
        cooking_time: get_dish.cooking_time,
        dish_cost: get_dish.dish_cost,
        dish_selling_price: get_dish.dish_selling_price,
      };
      Blaze.renderWithData(Template.create_dishes_form, get_dish_contents,$("#edit_dish_modal_content")[0]);
      $(".create_dish_submit_btn").hide()
      $(".update_dish_submit_btn").hide()
      Tracker.autorun(function(){
        if (get_dish.image_id) {
          var dish_image = Images.findOne({_id:get_dish.image_id});
          // var dish_image_url = dish_image.meta.base64;
          var dish_image_url = get_dish.meta.medium;
          $('.circle_base').css("background-image", "url("+dish_image_url+")");
          $('.image_upload').hide();
        }
      });
      // After template is rendered, tick the right checkboxes
      checkboxes_recall(get_dish.serving_option);
      checkboxes_recall(get_dish.allergy_tags);
      checkboxes_recall(get_dish.dietary_tags);
      checkboxes_recall(get_dish.cuisines_tags);
      checkboxes_recall(get_dish.proteins_tags);
      checkboxes_recall(get_dish.categories_tags);
      checkboxes_recall(get_dish.cooking_methods_tags);
      checkboxes_recall(get_dish.tastes_tags);
      checkboxes_recall(get_dish.textures_tags);
      checkboxes_recall(get_dish.vegetables_tags);
      checkboxes_recall(get_dish.condiments_tags);
      checkboxes_recall(get_dish.serving_temperature_tags);
      // Re-check all days, hours, mins select box
      for(var i, j = 0; i = $('#days')[0].options[j]; j++) {
          if(i.value == get_dish.days) {
              $('#days')[0].selectedIndex = j;
              break;
          }
      }
      for(var i, j = 0; i = $('#hours')[0].options[j]; j++) {
          if(i.value == get_dish.hours) {
              $('#hours')[0].selectedIndex = j;
              break;
          }
      }
      for(var i, j = 0; i = $('#mins')[0].options[j]; j++) {
          if(i.value == get_dish.mins) {
              $('#mins')[0].selectedIndex = j;
              break;
          }
      }
      // Add chips to tagging section
      console.log($('.chips-placeholder'))
      console.log(get_dish.dish_tags);
      $('#dish_tags').material_chip({data:get_dish.dish_tags});

      // Store all the values in Sessions
      Session.set('selected_dishes_id',get_dish._id);
      Session.set('image_id',get_dish.image_id);
      Session.set('serving_option_tags',get_dish.serving_option);
      Session.set('allergy_tags',get_dish.allergy_tags);
      Session.set('dietary_tags',get_dish.dietary_tags);
      Session.set('cuisines_tags',get_dish.cuisines_tags);
      Session.set('proteins_tags',get_dish.proteins_tags);
      Session.set('categories_tags',get_dish.categories_tags);
      Session.set('cooking_methods_tags',get_dish.cooking_methods_tags);
      Session.set('tastes_tags',get_dish.tastes_tags);
      Session.set('textures_tags',get_dish.textures_tags);
      Session.set('vegetables_tags',get_dish.vegetables_tags);
      Session.set('condiments_tags',get_dish.condiments_tags);
      Session.set('serving_temperature_tags',get_dish.serving_temperature_tags);
      Session.set('imgMeta', get_dish.meta);
    }
  },

  'click #btn_delete_dish': function(event) {
    var selected_dishes = Session.get('selected_dishes_id');
    if (selected_dishes !== undefined && typeof selected_dishes !== null && typeof selected_dishes !== "string"){
      selected_dishes = selected_dishes.filter(function(a){return a !== "on"})
    }
    if (!selected_dishes || selected_dishes.length === 0) {
      Materialize.toast("Please select a dish you'd like to delete", 4000, 'rounded bp-green');
    } else {
      event.preventDefault();
        $('#confirm_multi_delete').modal({
          dismissible: true, // Modal can be dismissed by clicking outside of the modal
          opacity: .5, // Opacity of modal background
          inDuration: 300, // Transition in duration
          outDuration: 200, // Transition out duration
          startingTop: '4%', // Starting top style attribute
          endingTop: '10%', // Ending top style attribute
        }
      );
      $('#confirm_multi_delete').modal('open');
    }
  },

  'click #cancel_multi': function(event) {
    Session.set('selected_dishes_id', []); // clear all selected dishes
  },

  'click #confirm_multi': function(event) {
    var selected_dishes = Session.get('selected_dishes_id');
    if (typeof selected_dishes !== "undefined" && typeof selected_dishes !== "string"){
      selected_dishes = selected_dishes.filter(function(a){return a !== "on"})
    }
    if (!selected_dishes || selected_dishes.length === 0) {
      Materialize.toast("Please select a dish you'd like to delete", 4000, 'rounded bp-green');
    } else {
      for (i = 0; i < selected_dishes.length; i++) {
        var dish_details = Dishes.findOne({_id: selected_dishes[i]});
        if (dish_details.image_id) {
          Meteor.call('dish_image.remove',dish_details.image_id, function(err) {
              if (err) Materialize.toast('Oops! Error when remove dish images. Please try again. ' + err.message, 4000, "rounded bp-green");
          });
        }
        var delete_message = dish_details.dish_name + " deleted";
        Materialize.toast(delete_message, 3000);
        Meteor.call('dish.remove', selected_dishes[i], function(err){
          if (err) {
            Materialize.toast('Oops! Error when delete dish. Please try again. ' + err.message , 4000, "rounded bp-green");
          } else {
            Meteor.call('menu.checkDish', selected_dishes[i], function(err, result) {
              if (result) {
                  var $toastContent = $('<span>This dish is already in menu. Please update your menu.</span>');
                  Materialize.toast($toastContent, 12000);
              }
            });
            sessionStorage.clear(); //clear all things to make sure everything is clean before use it again
          }
        });
      }
      Session.set('selected_dishes_id', null);
    }
  },

  'click .modal-close': function() {
    $('.modal-content').scrollTop(0);
    $('.modal-overlay').remove();
    var checkboxes = document.getElementsByClassName("dishes_checkbox");
    for (var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = false;
    };
    Ingredients_temporary.remove({});
    Session.set('imgMeta', []);
  },
  'click #modal_add_btn': function() {
    $('.modal-content').scrollTop(0);
    $('.create_dish_submit_btn').click();
  },
  'click #modal_update_btn': function() {
    $('.modal-content').scrollTop(0);
    $('.update_dish_submit_btn').click();
    var checkboxes = document.getElementsByClassName("dishes_checkbox");
    for (var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = false;
    };
  }
});
