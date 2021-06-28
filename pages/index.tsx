import { InferGetStaticPropsType } from 'next';

import { getAllPosts } from '../lib/post';

import PageShell from '../components/PageShell';
import Post from '../components/Post';

export const getStaticProps = async () => {
	const posts = await getAllPosts();

	return {
		props: {
			posts,
		},
	};
};

export default function Home({ posts }: InferGetStaticPropsType<typeof getStaticProps>) {
	return (
		<PageShell>
			{posts.map((post) => (
				<Post post={post} isPreview key={post.metadata.title} />
			))}
		</PageShell>
	);
}
