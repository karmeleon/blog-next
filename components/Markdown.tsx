// the errors in react-markdown are impossible to understand, don't bother to try
// @ts-nocheck
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { css } from '@emotion/react';
import Image from 'next/image';
import gfm from 'remark-gfm';
import footnotes from 'remark-footnotes';
import { H1, H2, H3, H4, A, Hr, Table, Blockquote, mobileBreak, smallBreak, largeBreak } from '../shared/styles';
import { ImageMap } from '../lib/post';
import PreloadImageContext from '../lib/imagePreload';

interface Props {
	children: string;
	images: ImageMap;
}

const Markdown = ({ children, images }: Props) => {
	const components = {
		code({ inline, className, children, ...props }) {
			const match = /language-(\w+)/.exec(className || '');
			return !inline && match ? (
				<SyntaxHighlighter language={match[1]} PreTag="div" {...props}>
					{String(children).replace(/\n$/, '')}
				</SyntaxHighlighter>
			) : (
				<code className={className} {...props}>
					{children}
				</code>
			);
		},
		img({ node, src, alt, ...props }) {
			const image = images[src];

			return (
				<div
					css={css`
						display: block;
						max-width: 100%;
						max-height: 100%;
						margin: 0 auto;
						position: relative;
					`}
				>
					<PreloadImageContext.Consumer>
						{(shouldPreload) => (
							<Image
								sizes={`(max-width: ${mobileBreak}) 87vw, (max-width: ${smallBreak}) 451px, 596px`}
								alt={alt}
								placeholder="blur"
								{...image}
								{...props}
								priority={shouldPreload}
							/>
						)}
					</PreloadImageContext.Consumer>
				</div>
			);
		},
		h1: H1,
		h2: H2,
		h3: H3,
		h4: H4,
		a({ href, ...props }) {
			return (
				<Link href={href} passHref>
					<A {...props} />
				</Link>
			);
		},
		hr: Hr,
		table: Table,
		blockquote: Blockquote,
	};

	return (
		<ReactMarkdown components={components} remarkPlugins={[gfm, footnotes]} skipHtml>
			{children}
		</ReactMarkdown>
	);
};

export default Markdown;
