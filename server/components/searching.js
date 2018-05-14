import {
    Meteor
} from 'meteor/meteor';
import {
    HTTP
} from 'meteor/http'


Meteor.methods({

    'searching'(lat, lng, serving_option, date, time, keyword)
    {
        // check(limit, Object)
        let kitchen_id = []
        let dish_id = []
        let searched_results = []
        let searchingQuery = []
        let radius = 1 / 6378.1
        let baseOnLocation = false

        //- limit records
        let from = 0
        let to = 1

        //- limit must be positive
        if(to <= 0)
        {
            to = 1
        }

        if(serving_option.length > 0)
        {

            // console.log('serving options > 0')
            searchingQuery.push({serving_option: serving_option});  
            console.log('serving options: ', serving_option.length)  
        }else{
            searchingQuery.push({serving_option: null}); 
        }
        
        console.log('searching query', searchingQuery);

        //- if date and time is not missing
        if((!_.isEmpty(date.trim()) && _.isDate(time)) || (!_.isEmpty(date.trim())))
        {
            // console.log('has date')
            let datetime = stringToDate(date, "yyyy-mm-dd", "-");
            let dateTimeBetween = getDateTimeBetweenTwoDateTimes(new Date(), datetime) //- minutes or hours + minutes

            //- convert to minutes
            let minutes = (dateTimeBetween.hours * 60) + dateTimeBetween.minutes;
            if(minutes > 0)
            {
                let up = minutes - 15;
                let down = minutes + 30;
                //- query here
                var dish_search = Dishes.find({
                    'cooking_time': {
                        // '$gte': up, //- sớm hơn 15 phút
                        '$lte': down  //- trễ hơn 30 phút
                    }
                }).fetch();

                //- add to kitchen id array
                kitchen_id = saveToArr(kitchen_id, dish_search.map(a=>a.kitchen_id));

                //- add to dish id
                dish_id = saveToArr(dish_id, dish_search.map(a=>a._id));

            }
            // console.log(datetime)

        }

        //- if time is not empty
        if(_.isDate(time))
        {
            // console.log('has time')
            let dateTimeBetween = getDateTimeBetweenTwoDateTimes(new Date(), time) //- minutes or hours + minutes
            //- convert to minutes
            let minutes = (dateTimeBetween.hours * 60) + dateTimeBetween.minutes;
            //- check if the time is in the future
            if(minutes > 0)
            {
                let up = minutes - 15;
                let down = minutes + 30;
                //- query here
                var dish_search = Dishes.find({
                    'cooking_time': {
                        // '$gte': up, //- sớm hơn 15 phút
                        '$lte': down  //- trễ hơn 30 phút
                    },
                    'online_status': true
                }).fetch();

                // console.log('time results: ' ,  dish_search);
                //- add to dish id
                dish_id = saveToArr(dish_id, dish_search.map(a=>a._id));
                console.log('dish id',dish_id)
                //- add to kitchen id
                kitchen_id = saveToArr(kitchen_id, dish_search.map(a=>a.kitchen_id));

            }
        }

        //- final query
        //- find by kitchen id
        //- remove other dish in kitchen return
        //- dish_id
        let find_kitchen_id = Kitchen_details.find({
            '_id': {
                '$in': kitchen_id
            },

            // kitchen_address_conversion: {"$geoWithin": {"$centerSphere": [[lng, lat], radius]}},
        }).fetch()

        // console.log('find kitchen id', find_kitchen_id);

        //- searching depends on location latitude and longitude
        if((lat && lng) && (serving_option.length > 0 || !_.isEmpty(date.trim()) || _.isDate(time)))
        {
            console.log('here')
            baseOnLocation = true;

            searchingQuery.push({kitchen_address_conversion: {"$geoWithin": {"$centerSphere": [[lng, lat], radius]}}});

            //- final search depends on location
            let kitchen_search = Kitchen_details.aggregate([
                {
                    //- find query here
                    $match: {
                        $and: [
                            { kitchen_address_conversion: {"$geoWithin": {"$centerSphere": [[lng, lat], radius]}} , },
                            { $or: searchingQuery },
                        ]
                    },

                },
                {
                    $lookup:
                    {
                        from: 'menu',
                        localField: '_id',
                        foreignField: 'kitchen_id',
                        as: 'Menu'
                    },
                },
                {
                    $lookup:
                    {
                        from: 'dishes',
                        localField: '_id',
                        foreignField: 'kitchen_id',
                        as: 'Dish'
                    },
                },
                {
                    $sort: {
                        average_rating: -1
                    }
                },
                // {
                //     $group:{

                //     }
                // }
                // {
                //     $skip: from
                // }, {
                //     $limit: to
                // }
            ])

            //- show results
            searched_results = _.union(searched_results, kitchen_search)

            // let all_dish = _.groupBy(searched_results, '_id')
            // let all_dish = searched_results.map(a=>a.Dish)
            // let final_array = _.where(searched_results, {'._id': 'TuiygfaZYugTT9Jg4'})
            // // let final_array = searched_results[0].Dish;
            // console.log('all dish', all_dish);
            // console.log('........................', final_array)

            //- combine
            // console.log('total dish id', dish_id);
            // console.log('all dish length', all_dish.length);
            // for(let i = 0; i<all_dish.length; i++)
            // {
            //     console.log('all dish id', all_dish[i][0]._id);

            //     for(let j = 0; j<dish_id.length; j++)
            //     {
            //         console.log('dish id: ', dish_id[j]);
            //         if(all_dish[i][0]._id == dish_id[j])
            //         {
            //             console.log('~~~~~~~~~~~~~~~~~~~~~', all_dish[i][0]._id)
            //             console.log('dish.....', all_dish[i]);
            //             console.log('search result...', searched_results[i].Dish);
            //             searched_results[i].Dish.push(all_dish[i][0])
            //         }
            //     }
            //     //- check if kitchen id is exist in dish_id
            //     // if(_.contains(dish_id, all_dish[i]._id) )
            //     // {
            //     //     searched_results[i].Dish = all_dish[i]
            //     // }
            //     // searched_results[i].Dish = all_dish[i]
            //     console.log('search value ' + i, searched_results[i]);
            // }


            //- using map for searched_results

            // let d = lodash.map(searched_results, 'Dish')[0]
            // console.log('dishssssss....id........', dish_id)
            // let removeItem = lodash.remove(searched_results, function(obj){
            //     for(let i=0; i<dish_id.length; i++)
            //     {
            //         return obj.Dish._id === dish_id[i]
            //     }
            // })
            // console.log(removeItem)


        }

        //- else
        if(!baseOnLocation)
        {
            //- if not providing location
            //- random search
            //- final search depends on location
            let kitchen_search = Kitchen_details.aggregate([
                {
                    //- find query here
                    $match: {
                        $or: searchingQuery
                    },

                },
                {
                    $lookup:
                    {
                        from: 'menu',
                        localField: '_id',
                        foreignField: 'kitchen_id',
                        as: 'Menu'
                    },
                },
                {
                    $lookup:
                    {
                        from: 'dishes',
                        localField: '_id',
                        foreignField: 'kitchen_id',
                        as: 'Dish'
                    },
                },
                {
                    $sort: {
                        average_rating: -1
                    }
                },
                // {
                //     $skip: from
                // }, {
                //     $limit: to
                // }
                // {
                //     $group:{

                //     }
                // }
            ])

            //- show results
            searched_results = _.union(searched_results, kitchen_search, find_kitchen_id);
        }

        if (keyword.trim() == '') {
            return searched_results;
        } else {
            var keywordDish = [];
            var keywordMenu = [];
            var kitchenDish = [];
            var kitchenMenu = [];
            for (var i = 0; i < searched_results.length; i++) {
                var keywords = keyword.toLowerCase().trim().split(" ");
                var allDish = [];
                var allMenu = [];
                var keywordDish = [];
                var keywordMenu = [];
                keywords.map((keyword, index) => {
                    // keyword must has length > 3
                    if (keyword.length >= 3) {
                        keywordDish = searched_results[i].Dish.filter((dish) => {
                            return dish.dish_name.toLowerCase().indexOf(keyword) > -1
                        });
                        allDish = allDish.concat(keywordDish);
                        keywordMenu = searched_results[i].Menu.filter((menu) => {
                            return menu.menu_name.toLowerCase().indexOf(keyword) > -1
                        });
                        allMenu = allMenu.concat(keywordMenu);
                    }
                });
                searched_results[i].Dish = allDish;
                searched_results[i].Menu = allMenu;
            }
            return searched_results;
        }

    },


});

let getDateTimeBetweenTwoDateTimes = function (currentDate, futureDate)
{
    let returned_data = {};
    let milliBetween = futureDate - currentDate;
    // console.log('millisecond between: ', milliBetween)

    let dayBetween = Math.floor(milliBetween / 86400000); // days
    let hourBetween = Math.floor((milliBetween % 86400000) / 3600000); // hours
    let minuteBetween = Math.round(((milliBetween % 86400000) % 3600000) / 60000)

    //- add to object to return
    returned_data.days = dayBetween
    returned_data.hours = hourBetween
    returned_data.minutes = minuteBetween

    return returned_data;
}

let currentDateAndTime = function ()
{
    let returned_data = {};
    let currDateTime = new Date().toLocaleString(); //- "09/08/2014, 2:35:56 AM"
    //- get date
    let currDate = currDateTime.split(' ')[0].slice(0, - 1)
    //- get time
    let currTime = currDateTime.split(' ')[1];

    //- add to object
    returned_data.date = currDate;
    returned_data.time = currTime;
    return returned_data;
}

let convertFromStringToDateTime = function (date, time)
{
    return new Date(date + ' ' + time)
}

let convertHourToMinutes = function (hour)
{
    return hour*60
}

let convertDayToMinutes = function (day)
{
    return day*24*60
}

let stringToDate = function (_date,_format,_delimiter)
{
    var formatLowerCase=_format.toLowerCase();
    var formatItems=formatLowerCase.split(_delimiter);
    var dateItems=_date.split(_delimiter);
    var monthIndex=formatItems.indexOf("mm");
    var dayIndex=formatItems.indexOf("dd");
    var yearIndex=formatItems.indexOf("yyyy");
    var month=parseInt(dateItems[monthIndex]);
    month-=1;
    var formatedDate = new Date(dateItems[yearIndex],month,dateItems[dayIndex]);
    return formatedDate;
}

let saveToArr = function(kitchen_id_arr, arr)
{
    return _.union(kitchen_id_arr, _.uniq(arr))
}
