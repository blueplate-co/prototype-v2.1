export function get_checkboxes_value(checkbox_tag, template) {
  var get_checkboxes = template.findAll("input[type=checkbox]:checked");
    var selected_checkboxes = get_checkboxes.map(function(item){
      return item.value;
  });
  Session.set(checkbox_tag,selected_checkboxes);
}
