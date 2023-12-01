import { SIDEBAR_LIST } from '@/constants';
import { PathnameValid } from '@/types';

/**
 * Generates the sidebar HTML template based on current path.
 * @param {string} currentPath - The current path of the application.
 * @returns {string} - The generated HTML template for the sidebar.
 */
const sidebarTemplate = (currentPath: PathnameValid): string => {
  const sidebarItemsHTML = SIDEBAR_LIST.map(
    (item) =>
      `
      <li>
        <a href="${item?.path}" class="text ${item?.path === currentPath ? 'sidebar-active' : ''}">
          <img class="icon-sidebar-action" src="./icons/${item?.iconName}.svg" alt="${item?.iconName}-icon" />${item?.title}
        </a>
      </li>
    `,
  ).join('');

  return `
    <a class="sidebar-logo" href="/">  
      <img class="icon-sidebar-logo" src="./icons/logo.svg" alt="logo" />
    </a>
    <div class="sidebar-actions">
      <ul class="sidebar-pages">
        ${sidebarItemsHTML}
      </ul>
      <div class="sidebar-information">
        <a class="text" href="javascript:void(0)">
          <img
            class="icon-sidebar-action"
            src="./icons/users.svg"
            alt="users-icon"
          />Community
        </a>
        <a class="text" href="javascript:void(0)">
          <img
            class="icon-sidebar-action"
            src="./icons/message.svg"
            alt="message-icon"
          />Social
        </a>
      </div>
      <div class="sidebar-account">
        <a class="text" href="javascript:void(0)">
          <img
            class="icon-sidebar-action"
            src="./icons/sliders.svg"
            alt="sliders-icon"
          />Settings
        </a>
        <a class="text" href="javascript:void(0)">
          <img
            class="icon-sidebar-action"
            src="./icons/logout.svg"
            alt="logout-icon"
          />Logout
        </a>
      </div>
    </div>`;
};

export default sidebarTemplate;
