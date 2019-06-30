import Vue from 'vue';

import dayjs from 'dayjs';

import advancedFormat from 'dayjs/plugin/advancedFormat';
import calendar from 'dayjs/plugin/calendar';

Vue.prototype.$dayjs = dayjs;

dayjs.extend(advancedFormat);
dayjs.extend(calendar);
