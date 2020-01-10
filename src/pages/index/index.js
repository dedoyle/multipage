import 'core-js/stable'
import 'regenerator-runtime/runtime'
import './index.scss'

const app = () => import('@/common/js/common.js')

new Promise(resolve => {
  setTimeout(() => {
    resolve(2)
  }, 500)
})
