// export { AptoPlay } from './AptoPlay';

import { AptoPlay } from './AptoPlay';

const aptoPlay = new AptoPlay('titleId', 'xSecretKey');
console.log(aptoPlay.getTitleId());

aptoPlay.login('email', 'password');
