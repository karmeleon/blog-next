import React from 'react';
import { css } from '@emotion/react';
import Link from 'next/link';

function range(num: number): Array<any> {
	const arr = new Array(num);
	arr.fill(0);
	return arr;
}

const SQUARES_PER_SIDE = 3;
const OUTER_SIZE = 30 * 3 * Math.sqrt(2);

export default function HeaderLogo() {
	const squareSets = (
		<>
			<div className="square-sets-left">
				{range(SQUARES_PER_SIDE).map((_, idx) => (
					<div className="square-set" key={idx}>
						{range(SQUARES_PER_SIDE).map((_, idx) => (
							<div className="square square-left" key={idx} />
						))}
					</div>
				))}
			</div>
			<div className="square-sets-right">
				{range(SQUARES_PER_SIDE).map((_, idx) => (
					<div className="square-set" key={idx}>
						{range(SQUARES_PER_SIDE).map((_, idx) => (
							<div className="square square-right" key={idx} />
						))}
					</div>
				))}
			</div>
		</>
	);

	return (
		<div
			className="triangle-square-container"
			// scss doesn't load with the page, so use Emotion to placehold for the logo
			css={css`
				width: ${OUTER_SIZE}px;
				height: ${OUTER_SIZE}px;
				margin: 0 auto;
			`}
		>
			<Link href="/" passHref>
				<a title="Home">
					<div className="outer-square">
						<div className="square-rows">{squareSets}</div>
						<div className="square-columns">{squareSets}</div>
					</div>
				</a>
			</Link>
		</div>
	);
}
