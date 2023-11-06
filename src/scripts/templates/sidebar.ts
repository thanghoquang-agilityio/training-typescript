import { SIDEBAR_LIST } from '@/constants';

/**
 * Generates the sidebar HTML template based on current path.
 * @param {string} currentPath - The current path of the application.
 * @returns {string} - The generated HTML template for the sidebar.
 */
const sidebarTemplate = (currentPath: string): string => {
  const sidebarItemsHTML = SIDEBAR_LIST.map(
    ({ path, iconName, title }) =>
      `
      <li>
        <a href="${path}" class="text ${path === currentPath && 'sidebar-active'}">
          <img class="icon-sidebar-action" src="./icons/${iconName}.svg" alt="${iconName}-icon" />${title}
        </a>
      </li>
    `,
  ).join('');

  return `
    <img class="icon-sidebar-logo" src="./icons/logo.svg" alt="logo" />
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

export const renderSidebar = (currentPath: string) => {
  const sidebarElement: HTMLElement | null = document.querySelector('.sidebar');

  if (sidebarElement) sidebarElement.innerHTML = sidebarTemplate(currentPath);
};
