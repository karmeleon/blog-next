import type { AppProps } from 'next/app';
import { globalStyles } from '../shared/styles';
import '../shared/headerAnimation.scss';

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<>
			{globalStyles}
			<Component {...pageProps} />
		</>
	);
}
export default MyApp;
