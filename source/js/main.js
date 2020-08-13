import {ieFix} from './utils/ie-fix';

import {initModals} from './modules/init-modals';
import {menu} from './modules/menu';

// Utils
// ---------------------------------

ieFix();

// Modules
// ---------------------------------

initModals();
menu();
