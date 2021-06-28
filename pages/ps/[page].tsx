import { GetStaticPropsContext, InferGetStaticPropsType } from 'next';

import { getPostsForPage, getTotalPages } from '../../lib/post';

import PageShell from '../../components/PageShell';
import Post from '../../components/Post';
import Pager from '../../components/Pager';

export const getStaticProps = async (context: GetStaticPropsContext) => {
	const pageStr = context?.params?.page;
	let pageNum;

	if (typeof pageStr === 'string') {
		pageNum = parseInt(pageStr, 10);
	} else {
		pageNum = 0;
	}
	const posts = await getPostsForPage(pageNum);
	const totalPages = getTotalPages();

	return {
		props: {
			posts,
			totalPages,
			currentPage: pageNum,
		},
	};
};

export async function getStaticPaths() {
	const totalPages = getTotalPages();

	const paths = [];

	for (let i = 0; i < totalPages; i++) {
		paths.push({ params: { page: `${i}` } });
	}

	return {
		paths,
		fallback: false,
	};
}

export default function Page({ posts, totalPages, currentPage }: InferGetStaticPropsType<typeof getStaticProps>) {
	return (
		<PageShell>
			{posts.map((post) => (
				<Post post={post} isPreview key={post.metadata.title} />
			))}
			<Pager total={totalPages} current={currentPage} />
		</PageShell>
	);
}
