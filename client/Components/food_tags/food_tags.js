
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
