const baseURL = u => u.replace(/^https?:\/\//i, '')

export function graph(graph, { path, params = {}, graph_id = 1 }) {
  graph.classList.add('sa-graph')
  const iframe = document.createElement('iframe')
  params = { embed: true, graph_id, ...params }
  const paramString =
    '?' +
    Object.entries(params)
      .map(([k, v]) => `${k}=${v}`)
      .join('&')
  const url =
    'https://simpleanalytics.com/' + baseURL(process.env.APP_DOMAIN) + path
  iframe.setAttribute('src', url + paramString)
  iframe.setAttribute('id', 'sa-graph-' + graph_id)
  iframe.setAttribute('scrolling', 'no')
  iframe.style.width = '100%'
  iframe.style.border = 'none'
  graph.innerHTML = iframe.outerHTML

  return {}
}

/* set up the Simple Analytics events and listeners */
export default () => {
  window.onresize = function() {
    document
      .querySelectorAll('.sa-graph iframe')
      .forEach(iframe => iframe.contentWindow.postMessage('true', '*'))
  }

  window.addEventListener('message', event => {
    if (typeof event.data !== 'object') return
    const { type, id, height, pageviews } = event.data
    if (type === 'resize') {
      document.getElementById('sa-graph-' + id).height = height + 'px'
    } else if (type === 'pageviews') {
      var graph = document.getElementById('sa-graph-' + id)
      var selector = graph.parentNode.getAttribute(
        'data-sa-page-views-selector'
      )
      if (selector)
        document
          .querySelectorAll(selector)
          .forEach(
            pageViewsElement => (pageViewsElement.textContent = pageviews)
          )
    }
  })

  return () => {
    window.onresize = null
    window.removeEventListener('message')
  }
}
