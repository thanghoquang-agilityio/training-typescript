import { showAlertMessage } from '@/utils';
import { ERROR_MESSAGES } from '@/constants';
import { PathnameValid } from '@/types';
import { sidebarTemplate } from '@/templates';

const renderSidebar = (currentPath: PathnameValid) => {
  const sidebarElement = document.querySelector('.sidebar') as HTMLElement;

  if (!sidebarElement) {
    showAlertMessage(ERROR_MESSAGES.renderSidebar);

    return;
  }

  sidebarElement.innerHTML = sidebarTemplate(currentPath);
};

export default renderSidebar;
