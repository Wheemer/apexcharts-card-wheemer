/**
 * ApexCharts is bundled from dist/apexcharts.esm.js, not src/.
 * Stock moveDynamicPointOnHover skips y === 0 and y === gridHeight, so a
 * numeric zero on a min-0 axis never draws a hover marker.
 */
const fs = require('fs')
const path = require('path')

const target = path.join(
  __dirname,
  '..',
  'node_modules',
  'apexcharts',
  'dist',
  'apexcharts.esm.js'
)

const oldSnippet =
  's=null===(i=h[e][t])||void 0===i?void 0:i[0],r=(null===(a=h[e][t])||void 0===a?void 0:a[1])||0;var u=n.globals.dom.baseEl.querySelector(".apexcharts-series[data\\\\:realIndex=\'".concat(e,"\'] .apexcharts-series-markers path"));if(u&&r<n.globals.gridHeight&&r>0){var g=u.getAttribute("shape"),p=l.getMarkerPath(s,r,g,1.5*c);u.setAttribute("d",p)}'

const newSnippet =
  's=null===(i=h[e][t])||void 0===i?void 0:i[0],r=null===(a=h[e][t])||void 0===a?void 0:a[1];var u=n.globals.dom.baseEl.querySelector(".apexcharts-series[data\\\\:realIndex=\'".concat(e,"\'] .apexcharts-series-markers path"));if(u){if(null!=r&&!isNaN(r)){var y=Math.min(Math.max(r,0),n.globals.gridHeight),g=u.getAttribute("shape"),p=l.getMarkerPath(s,y,g,c);u.setAttribute("d",p)}else u.setAttribute("d","")}'

const source = fs.readFileSync(target, 'utf8')
if (source.includes(newSnippet)) {
  process.stdout.write('hover marker patch already applied\n')
  process.exit(0)
}
if (!source.includes(oldSnippet)) {
  process.stderr.write('hover marker patch target not found in apexcharts.esm.js\n')
  process.exit(1)
}
fs.writeFileSync(target, source.replace(oldSnippet, newSnippet))
process.stdout.write('patched apexcharts hover marker\n')
