/**
 * Check this current kitchen is in promotion program
 * 
 * @param {*} dish_id dish id
 */
// const dish_list = [
//     {
//         id: 'gTgGQ8rF8qo4thFnB',
//         amount: 0.5
//     },
//     {
//         id: 'jc4eWDq66ghmogQFC',
//         amount: 0.5
//     },
//     {
//         id: 'ofkBkFd2dQwvKbTRM',
//         amount: 0.5
//     }
// ]
const dish_list = [
    {
        id: 'RvypCcmYHtT5AMWZz',
        amount: 0.5
    },
    {
        id: 'CZDD8M3cyJH8WyXnA',
        amount: 0.5
    },
    {
        id: 'FTJhJZqgnDZcwsskn',
        amount: 0.5
    }
]
export function checking_promotion_dish(dish_id) {
    return dish_list.filter(item => {
        return item.id === dish_id
    })
};


/**
 * Get amount promotion of dish id
 * 
 * @param {*} dish_id dish id
 */
export function get_amount_promotion(dish_id) {
    var result = dish_list.filter(item => {
        return item.id === dish_id
    });
    return result[0].amount;
};