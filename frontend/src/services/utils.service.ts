

export function translateMessageDate(dateStr: string): string {
    const now = new Date();
    const date = new Date(dateStr);

    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    var year = date.getFullYear();
    var month = date.getMonth();
    var day = date.getDate();
    var hour = date.getHours();
    var minutes = date.getMinutes();

    if (now.getTime() - date.getTime() > 86400000) { /** one day in ms */
        return months[month] + ' ' + day + ', ' + year;
    }
    return "Today " + hour + ":" + minutes;
}