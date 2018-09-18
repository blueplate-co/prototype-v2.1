/**
 * Check this current kitchen is in promotion program
 * 
 * @param {*} dish_id dish id
 */
const admin_list = ['PLRhMRuiLtCmS7wP5', 'KFBxX5t2npXAw7xbR', 'EPcneyipquFPmM3tJ', 'ZJD4QkjW49xYSf99W', 'CXcxpM8FDhdtvvmtR', 'b8gESpr8dgwpj8ozK', 'aynrkgBky656r8g65', 'LmfXqbtqSZB2RcBdj', 'PzH9XwgPbcsGR4KKf'];

export function check_admin(user_id) {
    if (admin_list.indexOf(user_id) > -1) {
        return true;
    }
    return false;
}