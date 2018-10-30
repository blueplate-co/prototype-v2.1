Template.promotion_modal.helpers({
    'promotion_amount': function () {
        if (localStorage.getItem('display_promotion') !== null) {
            var amount = localStorage.getItem('display_promotion');
            return amount;
        }
        var amount = 0;
        var url_string = window.location.href; //window.location.href
        var url = new URL(url_string);
        var promotion = url.searchParams.get("promotion");
        if (!promotion) promotion = '0';
        amount = parseInt(promotion.replace(/^\D+/g, ''));
        localStorage.setItem('display_promotion', amount);
        return amount;
    },
    'custom_theme': function() {
        let expire_day = moment('03/11/2018', 'DD/MM/YYYY');
        if (expire_day > moment()) {
            return true;
        } else {
            return false;
        }
    }
});