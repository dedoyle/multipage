import 'core-js/stable'
import 'regenerator-runtime/runtime'

import './index.scss'

console.log('home')

new Promise(resolve => {
  setTimeout(() => {
    resolve(1)
  }, 500)
})