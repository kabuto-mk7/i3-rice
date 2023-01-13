const extenstionActiveKey = 'GDDM-active';
const pageActiveKey = 'GDDM-page-active';

const setVersionLabel = () => {
  let version = 'V 1.4.1';
  document.getElementById('message').innerText = version;
}

const loadActiveConfig = () => {
  const activeElement = document.getElementById("active-option");

  chrome.storage.sync.get([extenstionActiveKey], function (result) {
    if (result[extenstionActiveKey] === "false") {
      activeElement.checked = false;
    } else {
      activeElement.checked = true;
    }
  });

  activeElement.onclick = function () {
    let message = `${this.checked};darkModeStylesheet;dark_mode_docs`;
    chrome.storage.sync.set({ [extenstionActiveKey]: this.checked ? 'true' : 'false' });
    chrome.tabs.query({ currentWindow: true, active: true },
      function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, message);
      })
  }
}

const loadPageConfig = () => {
  const pageConfigElement = document.getElementById("page-option");

  chrome.storage.sync.get([pageActiveKey], function (result) {
    if (result[pageActiveKey] === "false") {
      pageConfigElement.checked = false;
    } else {
      pageConfigElement.checked = true;
    }
  });

  pageConfigElement.onclick = function () {
    let message = `${this.checked};darkModePageStylesheet;page_style`;
    chrome.storage.sync.set({ [pageActiveKey]: this.checked ? 'true' : 'false' });
    chrome.tabs.query({ currentWindow: true, active: true },
      function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, message);
      })
  }
}

document.addEventListener('DOMContentLoaded', function () {
  setVersionLabel();
  loadActiveConfig();
  loadPageConfig();
})
