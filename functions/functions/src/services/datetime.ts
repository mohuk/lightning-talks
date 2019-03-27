import * as constants from '../constants';

/** Get day of the week string from date. */
export const getDayOfWeek = (date: Date): string => {

    const dayNumber = date.getDay();

    switch (dayNumber) {
        case 1: return constants.monday; break;
        case 2: return constants.tuesday; break;
        case 3: return constants.wednesday; break;
        case 4: return constants.thursday; break;
        case 5: return constants.friday; break;
        case 6: return constants.saturday; break;
        default: return constants.sunday; break; // Case value = 0
    }
}

/** Get day of the month string from date */
export const getDayOfMonth = (date: Date): string => {

    const dayNumber = date.getDate();

    switch (dayNumber) {
        case 1: return '1st'; break;
        case 2: return '2nd'; break;
        case 3: return '3rd'; break;
        case 21: return '21st'; break;
        case 22: return '22nd'; break;
        case 23: return '23rd'; break;
        case 31: return '31st'; break;
        default: return dayNumber + 'th'; break; // Case value = 8th or 16th or 24th
    }
}

/** Get month string from date */
export const getMonth = (date: Date): string => {

    const monthNumber = date.getMonth();

    switch (monthNumber) {
        case 0: return constants.january; break;
        case 1: return constants.february; break;
        case 2: return constants.march; break;
        case 3: return constants.april; break;
        case 4: return constants.may; break;
        case 5: return constants.june; break;
        case 6: return constants.july; break;
        case 7: return constants.august; break;
        case 8: return constants.september; break;
        case 9: return constants.october; break;
        case 10: return constants.november; break;
        default: return constants.december; break; // Case value = 11
    }
}

/** Get current day's next working day */
export const getNextWork = (date: Date): Date => {

    date.setDate(date.getDate() + 1); // Next day

    if (date.getDay() === 0) {
        date.setDate(date.getDate() + 1);
    }
    else if (date.getDay() === 6) {
        date.setDate(date.getDate() + 2);
    }

    return date;
}
