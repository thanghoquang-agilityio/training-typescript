import { showAlertMessage } from '@/utils';
import { ERROR_MESSAGES } from '@/constants';
import { navbarTemplate } from '@/templates';

const renderNavbar = () => {
  const navbarElement = document.querySelector('.top-navbar') as HTMLElement;

  if (!navbarElement) {
    showAlertMessage(ERROR_MESSAGES.renderNavbar);

    return;
  }

  navbarElement.innerHTML = navbarTemplate();
};

export default renderNavbar;
