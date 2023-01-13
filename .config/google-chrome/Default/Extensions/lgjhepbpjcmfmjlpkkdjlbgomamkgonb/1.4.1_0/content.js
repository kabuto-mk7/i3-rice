const cssId = 'darkModeStylesheet';
const pageCssId = 'darkModePageStylesheet';
const iconContainerId = 'darkModeIconContainer';
const EXTENSION_ACTIVE_KEY = 'GDDM-active';
const PAGE_ACTIVE_KEY = 'GDDM-page-active';

const createLink = (id, cssFilename) => {
  const link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = chrome.runtime.getURL(`css/${cssFilename}.css`);
  link.media = 'all';
  return link;
}

const createWithClasses = (element = "", classes = []) => {
  const created = document.createElement(element);
  created.classList.add(...classes);
  return created;
}

const addAttachments = () => {
  const editorContainer = document.getElementsByClassName('kix-appview-editor-container')[0];
  const iconContainer = createWithClasses('div', ['iconContainer']);
  iconContainer.id = iconContainerId;
  editorContainer.appendChild(iconContainer);
  createToggle('GDDMMainToggle', EXTENSION_ACTIVE_KEY, 'dark_mode_docs', cssId, 'GDDMCheckboxMain');
  createToggle('GDDMPageToggle', PAGE_ACTIVE_KEY, 'page_style', pageCssId, 'GDDMCheckboxPage', createExtraBtns);
}

const handleToggle = (event, storageKey = "", fileName = "", linkId = "") => {
  const selected = event.target.checked;
  chrome.storage.sync.set({ [storageKey]: selected ? 'true' : 'false' });
  if (selected) {
    addLinkIfInactive(linkId, fileName);
  } else {
    removeLinkIfActive(linkId)
  }
}

const createExtraBtns = () => {
  const iconContainer = document.getElementById(iconContainerId);

  const extraExtensionWrapper = createWithClasses('a');
  extraExtensionWrapper.href = 'https://chrome.google.com/webstore/detail/google-drive-dark-mode/mhlhbpejnmlkaiaggagblklodbbldmmc?hl=en&authuser=0';
  extraExtensionWrapper.target = '_newtab';
  const extraExtensionButton = createWithClasses('button', ['icon', 'extra']);
  extraExtensionWrapper.appendChild(extraExtensionButton);
  iconContainer.appendChild(extraExtensionWrapper);

  const closeButton = createWithClasses('button', ['icon', 'closeButton']);
  closeButton.onclick = () => {
    iconContainer.parentElement.removeChild(iconContainer);
  }
  iconContainer.appendChild(closeButton);

  const donateButtonWrapper = createWithClasses('a', ['donateWrapper']);
  donateButtonWrapper.href = "https://www.paypal.com/donate/?hosted_button_id=F9CQY44NXP8K2";
  donateButtonWrapper.target = '_newtab';
  const donateButton = createWithClasses('button', ['icon', 'donation']);
  donateButtonWrapper.appendChild(donateButton);
  iconContainer.appendChild(donateButtonWrapper);
}

const createToggle = (checkboxId = "", storageKey = "", fileName = "", linkId = "", className = "", callback = () => { }) => {
  chrome.storage.sync.get([storageKey], function (result) {
    const extensionToggleCheckbox = createCheckbox(checkboxId, className, (event) => handleToggle(event, storageKey, fileName, linkId));
    extensionToggleCheckbox.checked = result[storageKey] === "true";

    const extensionToggleIcon = createWithClasses('div', ['icon']);
    const extensionToggleLabel = createWithClasses('label');
    extensionToggleLabel.htmlFor = checkboxId;
    extensionToggleLabel.appendChild(extensionToggleCheckbox);
    extensionToggleLabel.appendChild(extensionToggleIcon);

    document.getElementById(iconContainerId).appendChild(extensionToggleLabel);
    callback();
  });
}

// Try to initialize the extension
try {
  const head = document.getElementsByTagName('head')[0];
  chrome.storage.sync.get([EXTENSION_ACTIVE_KEY], function (result) {
    if (result[EXTENSION_ACTIVE_KEY] === "true") {
      const mainLink = createLink(cssId, 'dark_mode_docs');
      head.appendChild(mainLink);
    }
  });

  chrome.storage.sync.get([PAGE_ACTIVE_KEY], function (result) {
    if (result[PAGE_ACTIVE_KEY] === "true") {
      const pageStyleLink = createLink(pageCssId, 'page_style');
      head.appendChild(pageStyleLink);
    }
  });

  const attachmentStyleLink = createLink('darkModeDocsAttachments', 'attachments');
  const pageAnimLink = createLink('darkModePageStylesheetPerm', 'page_anim');

  head.appendChild(pageAnimLink);
  head.appendChild(attachmentStyleLink);

  addAttachments();

  console.log("Dark mode enabled successfully!");
} catch (err) {
  console.log("Error while loading dark mode: ", err);
}

const removeLinkIfActive = (linkId) => {
  if (document.getElementById(linkId)) {
    const linkToCSS = document.getElementById(linkId);
    linkToCSS.parentElement.removeChild(linkToCSS);
  }
}

const addLinkIfInactive = (linkId, fileName) => {
  if (!document.getElementById(linkId)) {
    const head = document.getElementsByTagName('head')[0];
    const link = createLink(linkId, fileName);
    head.appendChild(link);
  }
}

chrome.runtime.onMessage.addListener(function (message) {
  const messageToken = message.split(';');
  const state = messageToken[0];
  const linkId = messageToken[1];
  const fileName = messageToken[2];

  if (state === "true") {
    addLinkIfInactive(linkId, fileName);
  } else {
    removeLinkIfActive(linkId);
  }
});

const createCheckbox = (id = '', className = '', onClick = () => { }) => {
  const checkbox = createWithClasses('input');
  checkbox.type = 'checkbox';
  checkbox.classList.add(...['GDDMCheckboxInput', className]);
  checkbox.id = id;
  checkbox.onclick = onClick;
  return checkbox;
}
