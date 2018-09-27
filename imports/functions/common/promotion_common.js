/**
 * Check this current kitchen is in promotion program
 * 
 * @param {*} dish_id dish id
 */
const dish_list = [
    // {
    //     id: 'gTgGQ8rF8qo4thFnB',
    //     amount: 0.5
    // },
    // {
    //     id: 'jc4eWDq66ghmogQFC',
    //     amount: 0.5
    // },
    // {
    //     id: '5D8osuvKbfpCmy9dr',
    //     amount: 0.5
    // }
];
// const dish_list = [
//     {
//         id: 'RvypCcmYHtT5AMWZz',
//         amount: 0.5
//     },
//     {
//         id: 'CZDD8M3cyJH8WyXnA',
//         amount: 0.5
//     },
//     {
//         id: 'FTJhJZqgnDZcwsskn',
//         amount: 0.5
//     },
//     {
//         id: 'X7NoJSfjDLJxbgGAF',
//         amount: 0.5
//     }
// ];

export function get_promotion_list(dish_id) {
    return dish_list;
};

export function checking_promotion_dish(dish_id) {
    return dish_list.filter(item => {
        return item.id === dish_id
    })
};

export function get_amount_promotion(dish_id) {
    var result = dish_list.filter(item => {
        return item.id === dish_id
    });
    return result[0].amount;
};

export function getCookie(name) {
    var dc = document.cookie;
    if (dc.length > 0) {
        //- has cookies
        var prefix = name + "=";
        var begin = dc.indexOf("; " + prefix);
        if (begin == -1) {
            //- no promotion cookies
            begin = dc.indexOf(prefix);
            if (begin != 0) return -1;
        } else {
            //- has promotion cookies
            begin += 2;
            var end = document.cookie.indexOf(";", begin);
            if (end == -1) {
                end = dc.length;
            }
            return end; 
        }
    } else {
        //- no cookies in browser
        return -1;
    }
}

export function delete_cookies(name) {
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}