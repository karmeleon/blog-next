import React from 'react';
import Link from 'next/link';
import styled from '@emotion/styled';

import { A, titleFontStack } from '../shared/styles';

interface Props {
	total: number;
	current: number;
}

const PagerContainer = styled.div`
	text-align: center;
	margin-bottom: 20px;
	font-size: 1.6em;
	font-family: ${titleFontStack};

	> * {
		margin: 0 3px;
	}
`;

const Pager = ({ current, total }: Props) => {
	const components = [];

	if (current !== 0) {
		// Render the first page URL as "/" instead of "/?page=0"
		const path = current === 1 ? '/' : `/ps/${current - 1}`;
		components.push(
			<Link href={path} key="prev" passHref>
				<A>&lt;</A>
			</Link>,
		);
	}
	for (let i = 0; i < total; i++) {
		if (current === i) {
			components.push(<span key="current">{i + 1}</span>);
		} else if (i === 0) {
			components.push(
				<Link href="/" key="/" passHref>
					<A>{i + 1}</A>
				</Link>,
			);
		} else {
			const path = `/ps/${i}`;
			components.push(
				<Link href={path} key={path} passHref>
					<A>{i + 1}</A>
				</Link>,
			);
		}
	}
	if (current !== total - 1) {
		const path = `/ps/${current + 1}`;
		components.push(
			<Link href={path} key="next" passHref>
				<A>&gt;</A>
			</Link>,
		);
	}

	return <PagerContainer>{components}</PagerContainer>;
};

export default Pager;
