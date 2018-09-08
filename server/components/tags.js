import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Session } from 'meteor/session'
import { check } from 'meteor/check';

Tags = new Mongo.Collection('tags');

Meteor.methods({
  'check_tags' () {
    var tags = [];
    var dish_tags = Dishes.distinct("dish_tags.tag");
    var menu_tags = Menu.distinct("menu_tags.tag");
    var kitchen_tags = Kitchen_details.distinct("kitchen_tags.tag");
    for (i=0; i < dish_tags.length; i++) {
      tags.push(dish_tags[i])
    }
    for (i=0; i< menu_tags.length; i++) {
      tags.push(menu_tags[i])
    }
    for (i=0; i< kitchen_tags.length; i++) {
      tags.push(kitchen_tags[i])
    }
    return tags;
  },
  'tags.insert'(tag_name) {
    //this method is used to transfer all the tags that are inside Dishes/Menu/Kitchen_details collection to Tags Collection.
    //At the same time, pass all the _id to the associated tags
    var dishes_id = [];
    var menus_id = [];
    var kitchens_id = [];

    if (!Tags.findOne({tag_name: tag_name})) {
      Tags.insert({
        tag_name: tag_name,
        deleted: false,
        dishes_id: [],
        menus_id: [],
        kitchens_id: [],
        count: 0,
        createdAt: new Date()
      })
      Dishes.find({dish_tags: {tag: tag_name}}).forEach((dish) => {
        dishes_id.push(dish._id)
      })
      console.log("Dish Array: " + dishes_id)
      Tags.update({tag_name: tag_name},{$addToSet: {dishes_id: {$each: dishes_id}}})

      Menu.find({menu_tags: {tag: tag_name}}).forEach((menu) => {
        menus_id.push(menu._id)
      })
      console.log("Menu Array: " + menus_id)
      Tags.update({tag_name: tag_name},{$addToSet: {menus_id: {$each: menus_id}}})

      Kitchen_details.find({kitchen_tags: {tag: tag_name}}).forEach((kitchen) => {
        kitchens_id.push(kitchen._id)
      })
      console.log("Kitchen Array: " + kitchens_id)
      Tags.update({tag_name: tag_name},{$addToSet: {kitchens_id: {$each: kitchens_id}}})
      Meteor.call('tags_total_count.update', tag_name)
      return tag_name + " is transferred.";
    } else {
      Dishes.find({dish_tags: {tag: tag_name}}).forEach((dish) => {
        dishes_id.push(dish._id)
      })
      console.log("Dish Array: " + dishes_id)
      Tags.update({tag_name: tag_name},{$addToSet: {dishes_id: {$each: dishes_id}}})

      Menu.find({menu_tags: {tag: tag_name}}).forEach((menu) => {
        menus_id.push(menu._id)
      })
      console.log("Menu Array: " + menus_id)
      Tags.update({tag_name: tag_name},{$addToSet: {menus_id: {$each: menus_id}}})

      Kitchen_details.find({kitchen_tags: {tag: tag_name}}).forEach((kitchen) => {
        kitchens_id.push(kitchen._id)
      })
      console.log("Kitchen Array: " + kitchens_id)
      Tags.update({tag_name: tag_name},{$addToSet: {kitchens_id: {$each: kitchens_id}}})
      Meteor.call('tags_total_count.update', tag_name)
      return tag_name + " is already existed, but dishes/menus/kitchens count updated";
    }
  },
  'tags_total_count.update' (tag_name) {
    console.log('***** UPDATE TAG TOTAL COUNT IN OPERATION *****')
    var tag = Tags.findOne({tag_name: tag_name})
    console.log(tag)
    var tag_count = tag.dishes_id.length + tag.menus_id.length + tag.kitchens_id.length

    check(tag_name, String);
    check(tag_count, Number);

    console.log("Total count = " + tag_count + ". Inserting to " + tag_name)
    Tags.update({tag_name: tag_name}, {$set: {count: tag_count}})
    console.log(tag_name + " total count updated")
    console.log('***** UPDATE TAG TOTAL COUNT OPERATION COMPLETED *****')
  },
  'tags.display'() {
    return Tags.find({}, {sort: {count: -1}, limit: 30}).fetch()
  },
  'tags.remove'(tags, collection, _id) {
    console.log('*********** TAGS.REMOVE IN OPERATION **********')
    var tags = Object.values(tags)
    console.log('There are ' + tags.length + ' tags.')
    console.log(typeof(tags) + ': ' + tags)
    switch (collection) {
      case "Dishes":
        console.log('Collection to work on: Dishes')
        if (tags.length > 0 || tags) {
          for (i=0; i< tags.length; i++) {
            var tag = tags[i].toString();
            if (Tags.findOne({tag_name: tag, dishes_id: _id})) {
              Tags.update({tag_name: tag}, {$pull: {dishes_id: _id}})
              console.log(_id + ' HAS BEEN REMOVED FROM TAG: ' + tag)
            } else {
              console.log('UNABLE TO FIND' + _id  + ' FROM TAG: ' + tag + ' , REMOVAL TERMINATED')
            }
            console.log('***** MOVING ON NEXT LOOP *****')
          }
        } else {
          console.log('***** NO TAGS WERE REMOVED *****')
        }
        console.log('********** TAGS.REMOVE COMPLETED **********')
      break;
      case "Menu":
        console.log('Collection to work on: Menu')
        console.log('There are ' + tags.length + ' tags.')
        if (tags.length > 0 || tags) {
          for (i=0; i< tags.length; i++) {
            var tag = tags[i].toString();
            if (Tags.findOne({tag_name: tag, menus_id: _id})) {
              Tags.update({tag_name: tag}, {$pull: {menus_id: _id}})
              console.log(_id + ' HAS BEEN REMOVED FROM TAG: ' + tag)
            } else {
              console.log('UNABLE TO FIND' + _id  + ' FROM TAG: ' + tag + ' , REMOVAL TERMINATED')
            }
            console.log('***** MOVING ON NEXT LOOP *****')
          }
        } else {
          console.log('***** NO TAGS WERE REMOVED *****')
        }
        console.log('********** TAGS.REMOVE COMPLETED **********')
      break;
      case "Kitchen_details":
        console.log('Collection to work on: Kitchens_details')
        console.log('There are ' + tags.length + ' tags.')
        if (tags.length > 0 || tags) {
          for (i=0; i< tags.length; i++) {
            var tag = tags[i].toString();
            if (Tags.findOne({tag_name: tag, kitchens_id: _id})) {
              Tags.update({tag_name: tag}, {$pull: {kitchens_id: _id}})
              console.log(_id + ' HAS BEEN REMOVED FROM TAG: ' + tag)
            } else {
              console.log('UNABLE TO FIND' + _id  + ' FROM TAG: ' + tag + ' , REMOVAL TERMINATED')
            }
            console.log('***** MOVING ON NEXT LOOP *****')
          }
        } else {
          console.log('***** NO TAGS WERE REMOVED *****')
        }
        console.log('********** TAGS.REMOVE COMPLETED **********')
    }
  },
  'new_tags.upsert'(tags, collection, _id) {
    console.log('********* NEW_TAG.INSERT IN OPERATION *********')
    console.log('here is the id: ' + _id)
      switch (collection) {
        case "Dishes":
          console.log('Collection to work on: Dishes')
          for (i=0; i < tags.length; i++) {
            console.log('total tag length:' + tags.length)
            console.log('on loop: ' + (i + 1))
            var tag_name = tags[i].tag
            console.log('Tag name working on:' + tag_name);
            console.log('Check if tag is deleted');
            if (!Dishes.findOne({_id: _id, dish_tags: {tag: tag_name}})) {
              console.log(tag_name + ' is removed. Removing dishes_id from this tag document.')
              Tags.update({tag_name: tag_name}, {$pull: {dishes_id: _id}})
            } else {
              if (!Tags.findOne({tag_name: tag_name})) {
                console.log('Tag not existed, creating new tag')
                Tags.insert({
                  tag_name: tag_name,
                  deleted: false,
                  dishes_id: [],
                  menus_id: [],
                  kitchens_id: [], //Although it is called kitchens_id, the _id that pass over is actually the User ID, from Meteor.userId()
                  count: 0,
                  createdAt: new Date()
                })
                console.log(tag_name + ': tag creation done. Updating dish_id: ' + _id + ' to Tag collection')
                Tags.update({tag_name: tag_name},{$push: {dishes_id: _id}})
                console.log(_id + ' has inserted to :' + tag_name)
                console.log("***** MOVING ON TO NEXT LOOP *****")
              } else {
                console.log('tag exists, so updating dish_id: ' + _id + ' to Tag collection')
                if (Tags.findOne({tag_name: tag_name, dishes_id: _id})) {
                  console.log(_id + " is already existed in " + tag_name)
                  console.log("***** MOVING ON TO NEXT LOOP *****")
                } else {
                  Tags.update({tag_name: tag_name},{$push: {dishes_id: _id}})
                  console.log(_id + ' has inserted to ' + tag_name)
                  console.log("***** MOVING ON TO NEXT LOOP *****")
                }
              }
            }
            //update total count of the tag
            Meteor.call('tags_total_count.update', tag_name)
          }
          //update total count of the tag
          Meteor.call('tags_total_count.update', tag_name)
          console.log("********** OPERATION ENDED **********")
        break;
        case "Menu":
          console.log('Collection to work on: Menu')
          for (i=0; i < tags.length; i++) {
            console.log('total tag length:' + tags.length)
            console.log('on loop: ' + (i + 1))
            var tag_name = tags[i].tag
            console.log('Tag name working on:' + tag_name);
            console.log('Check if tag is deleted');
            if (!Menu.findOne({_id: _id, menu_tags: {tag: tag_name}})) {
              console.log(tag_name + ' is removed. Removing Menu_id from this tag document.')
              Tags.update({tag_name: tag_name}, {$pull: {menus_id: _id}})
            } else {
              if (!Tags.findOne({tag_name: tag_name})) {
                console.log('Tag not existed, creating new tag')
                Tags.insert({
                  tag_name: tag_name,
                  deleted: false,
                  dishes_id: [],
                  menus_id: [],
                  kitchens_id: [], //Although it is called kitchens_id, the _id that pass over is actually the User ID, from Meteor.userId()
                  count: 0,
                  createdAt: new Date()
                })
                console.log(tag_name + ': tag creation done. Updating menu_id: ' + _id + ' to Tag collection')
                Tags.update({tag_name: tag_name},{$push: {menus_id: _id}})
                console.log(_id + ' has inserted to :' + tag_name)
                console.log("***** MOVING ON TO NEXT LOOP *****")
              } else {
                console.log('tag exists, so updating menu_id: ' + _id + ' to Tag collection')
                if (Tags.findOne({tag_name: tag_name, menus_id: _id})) {
                  console.log(_id + " is already existed in " + tag_name)
                  console.log("***** MOVING ON TO NEXT LOOP *****")
                } else {
                  Tags.update({tag_name: tag_name},{$push: {menus_id: _id}})
                  console.log(_id + ' has inserted to ' + tag_name)
                  console.log("***** MOVING ON TO NEXT LOOP *****")
                }
              }
            }
            //update total count of the tag
            Meteor.call('tags_total_count.update', tag_name)
          }
          console.log("********** OPERATION ENDED **********")
        break;
        case "Kitchen_details":
          console.log('Collection to work on: Kitchen_details')
          for (i=0; i < tags.length; i++) {
            console.log('total tag length:' + tags.length)
            console.log('on loop: ' + (i + 1))
            var tag_name = tags[i].tag
            console.log('Tag name working on:' + tag_name);
            console.log('Check if tag is deleted');
            if (!Kitchen_details.findOne({user_id: _id, kitchen_tags: {tag: tag_name}}) && !Kitchen_details.findOne({user_id: _id, kitchen_speciality: {tag: tag_name}})) {
              console.log(tag_name + ' is removed. Removing kitchens_id from this tag document.')
              Tags.update({tag_name: tag_name}, {$pull: {kitchens_id: _id}})
            } else {
              if (!Tags.findOne({tag_name: tag_name})) {
                console.log('Tag not existed, creating new tag')
                Tags.insert({
                  tag_name: tag_name,
                  deleted: false,
                  dishes_id: [],
                  menus_id: [],
                  kitchens_id: [], //Although it is called kitchens_id, the _id that pass over is actually the User ID, from Meteor.userId()
                  count: 0,
                  createdAt: new Date()
                })
                console.log(tag_name + ': tag creation done. Updating kitchens_id: ' + _id + ' to Tag collection')
                Tags.update({tag_name: tag_name},{$push: {kitchens_id: _id}})
                console.log(_id + ' has inserted to :' + tag_name)
                console.log("***** MOVING ON TO NEXT LOOP *****")
              } else {
                console.log('tag exists, so updating kitchens_id: ' + _id + ' to Tag collection')
                if (Tags.findOne({tag_name: tag_name, kitchens_id: _id})) {
                  console.log(_id + " is already existed in " + tag_name)
                  console.log("***** MOVING ON TO NEXT LOOP *****")
                } else {
                  Tags.update({tag_name: tag_name},{$push: {kitchens_id: _id}})
                  console.log(_id + ' has inserted to ' + tag_name)
                  console.log("***** MOVING ON TO NEXT LOOP *****")
                }
              }
            }
            //update total count of the tag
            Meteor.call('tags_total_count.update', tag_name)
          }
          console.log("********** OPERATION ENDED **********")
        break;
      }
  }
})
