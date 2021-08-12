import { useEffect } from 'react';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { globalStyles } from '../shared/styles';
import '../shared/headerAnimation.scss';

function MyApp({ Component, pageProps }: AppProps) {
	const router = useRouter();

	useEffect(() => {
		const handleRouteChange = (url: string) => {
			// log the pageview with their URL
			if ('gtag' in window) {
				(window as any).gtag('config', process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS, {
					page_path: url,
				});
			}
		};
		// When the component is mounted, subscribe to router changes
		// and log those page views
		router.events.on('routeChangeComplete', handleRouteChange);

		// If the component is unmounted, unsubscribe
		// from the event with the `off` method
		return () => {
			router.events.off('routeChangeComplete', handleRouteChange);
		};
	}, [router.events]);

	return (
		<>
			{globalStyles}
			<Component {...pageProps} />
		</>
	);
}
export default MyApp;
