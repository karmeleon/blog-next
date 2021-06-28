import { css, Global } from '@emotion/react';
import styled from '@emotion/styled';

export const globalStyles = (
	<Global
	  	styles={css`
			* {
				box-sizing: border-box;
			}

			body {
				margin: 0;
				font-family: 'Helvetica Neue', sans-serif;
				display: flex;
				flex-flow: column;
				height: 100%;
				font-size: 14px;
				line-height: 1.42857143;
			}
	  	`}
	/>
);

export const mobileBreak = '768px';
export const smallBreak = '992px';
export const largeBreak = '1200px';

export const outlineColor = 'rgba(128, 128, 128, 1)';

export const titleFontStack = '"Khand", sans-serif';

export const H1 = styled.h1`
	font-size: 36px;
	margin-top: 20px;
	margin-bottom: 10px;
	font-weight: 500;
	line-height: 1.1;
	margin: .67em 0;

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

export const A = styled.a`
	color: #428bca;
	text-decoration: none;

	&:hover, &:focus {
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
