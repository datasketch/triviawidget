function createElement(tag, options) {
  return {
    tag: tag,
    attrs: options.attrs || {},
    children: options.children || []
  }
}

function renderElement(node) {
  if (typeof node === 'string') {
    return document.createTextNode(node)
  }

  const el = document.createElement(node.tag)

  for (const [attr, value] of Object.entries(node.attrs)) {
    el.setAttribute(attr, value)
  }

  for (const child of node.children) {
    el.appendChild(renderElement(child))
  }

  return el
}
