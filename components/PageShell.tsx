import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import styled from '@emotion/styled';

import { Header, mobileBreak, smallBreak, largeBreak } from '../shared/styles';
import Sidebar from './Sidebar';
import HeaderLogo from './HeaderLogo';

export const MainContainer = styled.div`
	width: 100%;
	flex-direction: column;
	margin: 0 auto;
	display: flex;
	justify-content: space-between;
	align-items: flex-start;

	@media (min-width: ${mobileBreak}) {
		width: 750px;
		flex-direction: row;
	}

	@media (min-width: ${smallBreak}) {
		width: 970px;
		flex-direction: row;
	}

	@media (min-width: ${largeBreak}) {
		width: 1170px;
		flex-direction: row;
	}
`;

export const ContentColumn = styled.div`
	width: 95%;
	margin: 0 auto;

	@media (min-width: ${mobileBreak}) {
		width: calc(66% - 4px);
	}
`;

interface Props {
	children: React.ReactNode;
	titlePrefix?: string;
}

export default function PageShell({ children, titlePrefix }: Props) {
	const router = useRouter();

	let title;
	if (titlePrefix != null) {
		title = `${titlePrefix} | Blog.`;
	} else {
		title = 'Blog.';
	}
	return (
		<>
			<Head>
				<title>{title}</title>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<meta property="og:url" content={`https://sha.wn.zone${router.asPath}`} />
				<meta property="og:locale" content="en_US" />
				<meta property="og:site_name" content="sha.wn.zone" />
				<meta property="fb:app_id" content="2021111818111122" />
				<link rel="icon" href="/favicon.png" />
				<script async src="https://www.googletagmanager.com/gtag/js?id=UA-109571230-1"></script>
				<script
					dangerouslySetInnerHTML={{
						__html: `
							window.dataLayer = window.dataLayer || [];
							function gtag(){dataLayer.push(arguments);}
							gtag('js', new Date());

							gtag('config', 'UA-109571230-1');
						`,
					}}
				/>
			</Head>
			<Header>
				<HeaderLogo />
			</Header>
			<MainContainer>
				<ContentColumn>{children}</ContentColumn>
				<Sidebar />
			</MainContainer>
		</>
	);
}
