import React from 'react';
import Link from 'next/link';
import { css } from '@emotion/react';
import styled from '@emotion/styled';

import { A, H3, H4, outlineColor } from '../shared/styles';
import { Post as PostType } from '../lib/post';
import Markdown from './Markdown';

const PostOuter = styled.section`
	margin-bottom: 30px;

	&:after {
		content: ' ';
		display: block;
		height: 0;
		clear: both;
	}
`;

const PostOutline = styled.div`
	background: linear-gradient(135deg, transparent 17px, ${outlineColor} 0);
	padding: 5px;
`;

const PostContainer = styled.div`
	background: linear-gradient(135deg, transparent 15px, white 0);
	padding: 15px;
	color: black;
`;

const Header = styled.div`
	margin-bottom: 12px;
`;

const InfoLine = styled.span`
	color: grey;
	margin-bottom: 10px;
`;

interface Props {
	post: PostType;
	isPreview?: boolean;
}

const Post = ({ post, isPreview }: Props) => {
	const dateObject = new Date(post.metadata.date);

	let content;

	if (isPreview) {
		content = (
			<>
				<Markdown images={post.metadata.images}>{post.excerpt}</Markdown>
				{post.excerpt !== post.content && (
					<div
						css={css`
							text-align: center;
						`}
					>
						<H4>
							<Link href={post.metadata.url} passHref>
								<A>Full post &gt;</A>
							</Link>
						</H4>
					</div>
				)}
			</>
		);
	} else {
		content = <Markdown images={post.metadata.images}>{post.content}</Markdown>;
	}

	return (
		<PostOuter>
			<PostOutline>
				<PostContainer>
					<Header>
						<H3>
							<Link href={post.metadata.url} passHref>
								<A>{post.metadata.title}</A>
							</Link>
						</H3>
						<InfoLine>
							<time dateTime={dateObject.toISOString()}>{dateObject.toDateString()}</time>
						</InfoLine>
					</Header>
					<article>{content}</article>
				</PostContainer>
			</PostOutline>
		</PostOuter>
	);
};

export default Post;
