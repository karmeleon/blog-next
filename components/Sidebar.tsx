import React from 'react';
import { css } from '@emotion/react';
import styled from '@emotion/styled';

import { H2, P, A, Hr, outlineColor, mobileBreak } from '../shared/styles';

const SidebarColumn = styled.aside`
	width: 95%;
	margin: 0 auto;

	@media (min-width: ${mobileBreak}) {
		width: calc(33% - 4px);
	}
`;

const SidebarOutline = styled.div`
	background: linear-gradient(-135deg, transparent 13px, ${outlineColor} 0);
	padding: 5px;
`;

const SidebarContent = styled.div`
	background: linear-gradient(-135deg, transparent 15px, white 0);
	padding: 15px;
`;

const Sidebar = () => (
	<SidebarColumn>
		<SidebarOutline>
			<SidebarContent>
				<H2
					css={css`
						margin-top: 0;
					`}
				>
					About
				</H2>
				<P>
					This is a blog I made to talk about programming type things that I find or write. If you find the
					stuff here interesting, feel free to shoot me an email at <A href="mailto:sh@wn.zone">sh@wn.zone</A>{' '}
					or take a look at <A href="https://karmeleon.github.io/assets/resume.html">my resumé</A> or{' '}
					<A href="https://www.linkedin.com/in/shawn-walton-7582838a/">LinkedIn</A>! There are a few older
					things on <A href="https://github.com/karmeleon">my Github</A> that I haven’t written about, so you
					might as well go check that out too.
				</P>
				<Hr />
				<H2>Links</H2>
				<ul>
					<li>
						<A href="https://play.google.com/store/apps/details?id=com.karmeleon.battmon">
							Android Wear battery monitor (Battmon)
						</A>
					</li>
					<li>
						<A href="https://karmeleon.github.io/WGL-fractal/">WebGL Mandelbrot set viewer</A>
					</li>
					<li>
						<A href="https://github.com/karmeleon/Pbrot/">OpenMP/OpenCL Buddhabrot set generator</A>
					</li>
					<li>
						<A href="https://github.com/karmeleon/ImageRecognitionCUDA">CUDA object recognition trainer</A>
					</li>
				</ul>
			</SidebarContent>
		</SidebarOutline>
	</SidebarColumn>
);

export default Sidebar;
