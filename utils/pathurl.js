import {
  getStorage
} from "./utilities";

export const linkRevert = (link) => {
  link = link.trim();
  if (!!link == false) {
    return '/pages/index/index';
  }
  if (link.startsWith("either://machine")) {
    return `/pages/detail/index?id=${getUrlId(link)}`;
  }
  if (link.startsWith("either://user")) {
    return `/pages/corporation/index?id=${getUrlId(link)}`;
  }
  if (link.startsWith("either://contact/us")) {
    return `/pages/relationMe/index`;
  }
}

function getUrlId(link) {
  return link.replace(/.*\/([^/]+)$/, '$1');
}