import '../styles/globals.css'
import '../styles/custom.css'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { Toaster } from 'react-hot-toast';
config.autoAddCss = false

import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <Toaster position="top-right" />
    </>
  )
}

export default MyApp
