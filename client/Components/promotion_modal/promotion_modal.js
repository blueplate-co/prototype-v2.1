Template.promotion_modal.helpers({
    'promotion_amount': function() {
        var url_string = window.location.href; //window.location.href
        var url = new URL(url_string);
        var promotion = url.searchParams.get("promotion");
        if (promotion) promotion = 0;
        var amount = parseInt(promotion.replace( /^\D+/g, ''));
        return amount;
    }
  });