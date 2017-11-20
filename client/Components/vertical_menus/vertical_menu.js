

Template.vertical_menu_card.helpers({
    'menu':function(){
      return Menu.find();

    },

    'dishes_retreival': function() {
     var dishes_id = String(this);
     var find_dishes = Dishes.findOne({"_id": dishes_id});
     return find_dishes;
   },

    'find_ingredient':function(){
      var dish_name=this.dish_name;
      var find_ingre = Ingredients.find({"dish_name":dish_name});
        console.log (find_ingre);
      return find_ingre;
    }
    })
