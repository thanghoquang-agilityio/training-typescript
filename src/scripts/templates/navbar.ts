import { NAVBAR_LIST } from '@/constants';

/**
 * Generates the navbar HTML template.
 * @returns {string} - The generated HTML template for the navbar.
 */
const navbarTemplate = (): string => {
  const navbarItemsHTML = NAVBAR_LIST.map(({ title }) => `<span class="text">${title}</span>`).join(
    '',
  );

  return `
    <navbar class="navbar">
      <div class="navbar-categories">
        ${navbarItemsHTML}
      </div>
      <div class="navbar-actions">
        <img
          class="icon-navbar-action"
          src="./icons/search.svg"
          alt="search-icon"
        />
        <img class="icon-navbar-action" src="./icons/bell.svg" alt="bell-icon" />
        <div class="profile-menu">
          <img
            class="avatar-profile"
            src="./images/avatar-profile.png"
            alt="avatar"
          />
          <span class="text">Tetiana</span>
        </div>
      </div>
    </navbar>`;
};

export const renderNavbar = () => {
  const navbarElement: HTMLElement | null = document.querySelector('.top-navbar');

  if (navbarElement) navbarElement.innerHTML = navbarTemplate();
};
