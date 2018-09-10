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
    var kitchen_speciality_tags = Kitchen_details.distinct("kitchen_speciality.tag");
    for (i=0; i < dish_tags.length; i++) {
      tags.push(dish_tags[i])
    }
    for (i=0; i< menu_tags.length; i++) {
      tags.push(menu_tags[i])
    }
    for (i=0; i< kitchen_tags.length; i++) {
      tags.push(kitchen_tags[i])
    }
    for (i=0; i< kitchen_speciality_tags.length; i++) {
      tags.push(kitchen_speciality_tags[i])
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
        kitchens_id.push(kitchen.user_id)
      })
      Kitchen_details.find({kitchen_speciality: {tag: tag_name}}).forEach((kitchen) => {
        console.log('kitchen_speciality': kitchen)
        kitchens_id.push(kitchen.user_id)
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
        kitchens_id.push(kitchen.user_id)
      })
      Kitchen_details.find({kitchen_speciality: {tag: tag_name}}).forEach((kitchen) => {
        kitchens_id.push(kitchen.user_id)
      })
      console.log("Kitchen Array: " + kitchens_id)
      Tags.update({tag_name: tag_name},{$addToSet: {kitchens_id: {$each: kitchens_id}}})
      Meteor.call('tags_total_count.update', tag_name)
      return tag_name + " is already existed, but dishes/menus/kitchens count updated";
    }
  },
  'tags_total_count.update' (tag_name) {

    var tag = Tags.findOne({tag_name: tag_name})
    var tag_count = tag.dishes_id.length + tag.menus_id.length + tag.kitchens_id.length

    check(tag_name, String);
    check(tag_count, Number);

    Tags.update({tag_name: tag_name}, {$set: {count: tag_count}})

  },
  'tags.display'() {
    return Tags.find({}, {sort: {count: -1}, limit: 30}).fetch()
  },
  'tags.remove'(tags, collection, _id) {

    var tags = Object.values(tags)

    switch (collection) {
      case "Dishes":
        if (tags.length > 0 || tags) {
          for (i=0; i< tags.length; i++) {
            var tag = tags[i].toString();
            if (Tags.findOne({tag_name: tag, dishes_id: _id})) {
              Tags.update({tag_name: tag}, {$pull: {dishes_id: _id}})
            } else {
              console.log('UNABLE TO FIND' + _id  + ' FROM TAG: ' + tag + ' , REMOVAL TERMINATED')
            }
          }
        } else {
          console.log('***** NO TAGS WERE REMOVED *****')
        }
      break;
      case "Menu":
        if (tags.length > 0 || tags) {
          for (i=0; i< tags.length; i++) {
            var tag = tags[i].toString();
            if (Tags.findOne({tag_name: tag, menus_id: _id})) {
              Tags.update({tag_name: tag}, {$pull: {menus_id: _id}})
            } else {
              console.log('UNABLE TO FIND' + _id  + ' FROM TAG: ' + tag + ' , REMOVAL TERMINATED')
            }
          }
        } else {
          console.log('***** NO TAGS WERE REMOVED *****')
        }
      break;
      case "Kitchen_details":
        if (tags.length > 0 || tags) {
          for (i=0; i< tags.length; i++) {
            var tag = tags[i].toString();
            if (Tags.findOne({tag_name: tag, kitchens_id: _id})) {
              Tags.update({tag_name: tag}, {$pull: {kitchens_id: _id}})
            } else {
              console.log('UNABLE TO FIND' + _id  + ' FROM TAG: ' + tag + ' , REMOVAL TERMINATED')
            }
          }
        } else {
          console.log('***** NO TAGS WERE REMOVED *****')
        }
    }
  },
  'new_tags.upsert'(tags, collection, _id) {
      switch (collection) {
        case "Dishes":
          for (i=0; i < tags.length; i++) {
            var tag_name = tags[i].tag

            if (!Dishes.findOne({_id: _id, dish_tags: {tag: tag_name}})) {
              Tags.update({tag_name: tag_name}, {$pull: {dishes_id: _id}})
            } else {

              if (!Tags.findOne({tag_name: tag_name})) {
                Tags.insert({
                  tag_name: tag_name,
                  deleted: false,
                  dishes_id: [],
                  menus_id: [],
                  kitchens_id: [], //Although it is called kitchens_id, the _id that pass over is actually the User ID, from Meteor.userId()
                  count: 0,
                  createdAt: new Date()
                })
                Tags.update({tag_name: tag_name},{$push: {dishes_id: _id}})
              } else {
                if (Tags.findOne({tag_name: tag_name, dishes_id: _id})) {
                  console.log(_id + " is already existed in " + tag_name)
                } else {
                  Tags.update({tag_name: tag_name},{$push: {dishes_id: _id}})
                }
              }
            }
            //update total count of the tag
            Meteor.call('tags_total_count.update', tag_name)
          }
          //update total count of the tag
          Meteor.call('tags_total_count.update', tag_name)
        break;
        case "Menu":
          for (i=0; i < tags.length; i++) {
            var tag_name = tags[i].tag

            if (!Menu.findOne({_id: _id, menu_tags: {tag: tag_name}})) {
              Tags.update({tag_name: tag_name}, {$pull: {menus_id: _id}})
            } else {
              if (!Tags.findOne({tag_name: tag_name})) {
                Tags.insert({
                  tag_name: tag_name,
                  deleted: false,
                  dishes_id: [],
                  menus_id: [],
                  kitchens_id: [], //Although it is called kitchens_id, the _id that pass over is actually the User ID, from Meteor.userId()
                  count: 0,
                  createdAt: new Date()
                })
                Tags.update({tag_name: tag_name},{$push: {menus_id: _id}})
              } else {
                if (Tags.findOne({tag_name: tag_name, menus_id: _id})) {
                  console.log(_id + " is already existed in " + tag_name)
                } else {
                  Tags.update({tag_name: tag_name},{$push: {menus_id: _id}})
                }
              }
            }
            //update total count of the tag
            Meteor.call('tags_total_count.update', tag_name)
          }
        break;
        case "Kitchen_details":
          for (i=0; i < tags.length; i++) {
            var tag_name = tags[i].tag
            if (!Kitchen_details.findOne({user_id: _id, kitchen_tags: {tag: tag_name}}) && !Kitchen_details.findOne({user_id: _id, kitchen_speciality: {tag: tag_name}})) {
              Tags.update({tag_name: tag_name}, {$pull: {kitchens_id: _id}})
            } else {
              if (!Tags.findOne({tag_name: tag_name})) {
                Tags.insert({
                  tag_name: tag_name,
                  deleted: false,
                  dishes_id: [],
                  menus_id: [],
                  kitchens_id: [], //Although it is called kitchens_id, the _id that pass over is actually the User ID, from Meteor.userId()
                  count: 0,
                  createdAt: new Date()
                })
                Tags.update({tag_name: tag_name},{$push: {kitchens_id: _id}})
              } else {
                if (Tags.findOne({tag_name: tag_name, kitchens_id: _id})) {
                  console.log(_id + " is already existed in " + tag_name)
                } else {
                  Tags.update({tag_name: tag_name},{$push: {kitchens_id: _id}})
                }
              }
            }
            //update total count of the tag
            Meteor.call('tags_total_count.update', tag_name)
          }
        break;
      }
  },
  'tag_autocomplete.get'() {
    var tag_names = Tags.find({}, {tag_name: 1}).fetch();
    var data = {}
    for (i=0; i < tag_names.length; i++) {
      data[tag_names[i].tag_name.toString()] = null;
    }
    return data;
  },
  'tag_result.get'(tag) {
    var result = {
      dish: [],
      menu: [],
      kitchen: []
    };
    //get dishes details
    for (i=0; i < tag.dishes_id.length; i++) {
      result.dish.push(Dishes.findOne({_id: tag.dishes_id[i]}))
    }
    //get menus details
    for (i=0; i < tag.menus_id.length; i++) {
      result.menu.push(Menu.findOne({_id: tag.menus_id[i]}))
    }
    //get kitchens details
    for (i=0; i < tag.kitchens_id.length; i++) {
      result.kitchen.push(Kitchen_details.findOne({user_id: tag.kitchens_id[i]}))
    }
    return result;
  }
})
