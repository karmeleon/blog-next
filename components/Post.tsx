import React from 'react';
import { css } from '@emotion/react';
import styled from '@emotion/styled';

import { A, H3, H4, outlineColor } from '../shared/styles';
import { Post as PostType } from '../lib/post';
import PreloadImageContext from '../lib/imagePreload';
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
	isPreview: boolean;
	isAboveFold: boolean;
}

const Post = ({ post, isPreview, isAboveFold }: Props) => {
	const [isLoaded, setIsLoaded] = React.useState(false);

	React.useEffect(() => setIsLoaded(true), []);

	const dateObject = new Date(post.metadata.date);
	const dateString = isLoaded ? dateObject.toDateString() : '...loading...';

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
							<A href={post.metadata.url}>Full post &gt;</A>
						</H4>
					</div>
				)}
			</>
		);
	} else {
		content = <Markdown images={post.metadata.images}>{post.content}</Markdown>;
	}

	return (
		<PreloadImageContext.Provider value={isAboveFold}>
			<PostOuter>
				<PostOutline>
					<PostContainer>
						<Header>
							<H3>
								<A href={post.metadata.url}>{post.metadata.title}</A>
							</H3>
							<InfoLine>
								<time dateTime={dateObject.toISOString()}>{dateString}</time>
							</InfoLine>
						</Header>
						<article>{content}</article>
					</PostContainer>
				</PostOutline>
			</PostOuter>
		</PreloadImageContext.Provider>
	);
};

Post.defaultProps = {
	isAboveFold: false,
	isPreview: false,
};

export default Post;
