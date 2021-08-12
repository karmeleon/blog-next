import { GetStaticPropsContext, InferGetStaticPropsType } from 'next';

import { getAllPosts, getPostByDatelessSlug } from '../../lib/post';

import PageShell from '../../components/PageShell';
import Post from '../../components/Post';

export const getStaticProps = async (context: GetStaticPropsContext) => {
	const slug = context?.params?.slug;
	if (slug == null || typeof slug !== 'string') {
		throw new Error(`${slug} is not a valid slug`);
	}

	const post = await getPostByDatelessSlug(slug);

	return {
		props: {
			post,
		},
	};
};

export async function getStaticPaths() {
	const totalPages = await getAllPosts();

	const paths = totalPages.map((post) => ({ params: { slug: post.metadata.datelessSlug } }));

	return {
		paths,
		fallback: false,
	};
}

export default function PostPage({ post }: InferGetStaticPropsType<typeof getStaticProps>) {
	return (
		<PageShell titlePrefix={post.metadata.title}>
			<Post post={post} isAboveFold />
		</PageShell>
	);
}
