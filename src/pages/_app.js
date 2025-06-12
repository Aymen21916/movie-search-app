
import '../../public/globals.css'
import { Provider } from 'react-redux'
import { store } from '../store'
import { useEffect } from 'react'
import Head from "next/head";


function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (storedTheme === 'dark' || (storedTheme === 'system' && systemPrefersDark)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <Provider store={store}>
      <Head>
        {/* Add this line to set your new favicon */}
        <link rel="icon" href="/icon.png" className='w-10 h-10 rounded-full'/>
        <title>Movie Explorer</title>
        <meta name="description" content="Search for your favorite movies" />
      </Head>
      <Component {...pageProps} />
    </Provider>
  )
}

export default MyApp