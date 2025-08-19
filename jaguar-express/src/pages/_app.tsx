import type { AppProps } from 'next/app';
import Head from 'next/head';
import '@/styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Jaguar Express - Delivery Rápido y Seguro</title>
        <meta name="description" content="Tu plataforma de delivery favorita. Conectamos a los mejores restaurantes y tiendas con tu hogar, ofreciendo entregas rápidas y seguras." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#059669" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Jaguar Express - Delivery Rápido y Seguro" />
        <meta property="og:description" content="Tu plataforma de delivery favorita. Conectamos a los mejores restaurantes y tiendas con tu hogar, ofreciendo entregas rápidas y seguras." />
        <meta property="og:image" content="/og-image.jpg" />
        <meta property="og:url" content="https://jaguarexpress.com" />
        <meta property="og:site_name" content="Jaguar Express" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Jaguar Express - Delivery Rápido y Seguro" />
        <meta name="twitter:description" content="Tu plataforma de delivery favorita. Conectamos a los mejores restaurantes y tiendas con tu hogar, ofreciendo entregas rápidas y seguras." />
        <meta name="twitter:image" content="/og-image.jpg" />
        
        {/* Additional SEO */}
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Jaguar Express" />
        <meta name="keywords" content="delivery, comida, restaurantes, pedidos, domicilios, Colombia, Bogotá" />
        <link rel="canonical" href="https://jaguarexpress.com" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}