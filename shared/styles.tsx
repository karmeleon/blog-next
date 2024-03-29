import { css, Global } from '@emotion/react';
import styled from '@emotion/styled';
import Link from 'next/link';

export const mobileBreak = '768px';
export const smallBreak = '992px';
export const largeBreak = '1200px';

export const outlineColor = 'rgba(128, 128, 128, 1)';

export const titleFontStack = '"Khand", sans-serif';
export const bodyFontStack = '"Open Sans", "Helvetica Neue", sans-serif';

export const globalStyles = (
	<Global
		styles={css`
			* {
				box-sizing: border-box;
			}

			body {
				margin: 0;
				font-family: ${bodyFontStack};
				display: flex;
				flex-flow: column;
				height: 100%;
				font-size: 14px;
				line-height: 1.42857143;
			}
		`}
	/>
);

export const H1 = styled.h1`
	font-size: 36px;
	margin-top: 20px;
	margin-bottom: 10px;
	font-weight: 500;
	line-height: 1.1;
	margin: 0.67em 0;

	a:hover {
		color: black;
	}
`;

export const H2 = styled.h2`
	font-family: ${titleFontStack};
	font-weight: lighter;
	font-size: 30px;
	margin-top: 25px;
	margin-bottom: 10px;
	line-height: 1.1;
`;

export const H3 = styled.h3`
	font-family: ${titleFontStack};
	font-size: 2em;
	font-weight: normal;
	margin: 0;
	padding-top: 3px;
`;

export const H4 = styled.h4`
	font-family: ${titleFontStack};
	font-size: 20px;
	font-weight: normal;
	margin: 0;
	padding-top: 5px;
`;

export const A = styled(Link)`
	color: #428bca;
	text-decoration: none;

	&:hover,
	&:focus {
		color: #2a6496;
		text-decoration: underline;
	}
`;

export const P = styled.p`
	margin: 0 0 10px;
`;

export const Header = styled.header`
	font-family: ${titleFontStack};
	font-size: 1.5em;
	text-align: center;
	padding: 10px;
	flex: 0 1 auto;
`;

export const Hr = styled.hr`
	margin-top: 20px;
	margin-bottom: 20px;
	border: 0;
	border-top: 1px solid #eee;
`;

export const Table = styled.table`
	width: 100%;
	@media (min-width: ${mobileBreak}) {
		width: 60%;
	}
	margin: 5px auto;
	border-collapse: collapse;
	border-spacing: 0px;

	thead > tr {
		background-color: ${outlineColor};
		color: white;

		th:not(:first-of-type) {
			border-left: 1px solid white;
		}
	}

	td {
		background-color: whitesmoke;
		border-bottom: 1px solid white;
		border-right: 1px solid white;
		padding: 4px;

		&:first-of-type {
			font-weight: bold;
			background-color: lightgrey;
		}
	}
`;

export const Blockquote = styled.blockquote`
	font-size: 1.1em;
`;
