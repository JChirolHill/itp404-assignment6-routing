export function trimTitle(title) {
  return (title.length > 35) ? title.substring(0, 35) + '...' : title;
}

export function getUrl(permalink) {
  return 'https://www.reddit.com' + permalink;
}

export function getImage(url) {
  return (hasImage(url)) ? url : '';
}

export function parseNum(num) {
  return num.toLocaleString();
}

export function hasImage(url) {
  return /.*\.(jpg|jpeg|png)/.test(url);
}
