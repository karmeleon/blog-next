import fs from 'fs';
import { join } from 'path';
import matter from 'gray-matter';
import { getPlaiceholder } from 'plaiceholder';

const postsDirectory = join(process.cwd(), 'posts');

export interface PostMetadata {
	title: string;
	// can't use a Date obj cuz it's not serializable
	// parse this with new Date()
	date: number;
	url: string;
	images: { [key: string]: Image };
	// poor guy, maybe he needs to hit the gym and get a hobby
	datelessSlug: string;
}

export interface Post {
	metadata: PostMetadata;
	// Raw Markdown text
	content: string;
	excerpt: string;
}

export interface Image {
	src: string;
	width: number;
	height: number;
	blurDataURL: string;
}

export interface ImageMap {
	[key: string]: Image;
}

const imageExtractionRegex = /!\[.*\]\((.*)\)/g;
export const POSTS_PER_PAGE = 5;

// TODO: maybe find a type for this?
function excerptExtractor(markdown: string): string {
	const previewCutoff = markdown.indexOf('<!--more-->');

	if (previewCutoff > 0) {
		return markdown.substring(0, previewCutoff);
	} else {
		return markdown;
	}
}

async function imageExtractor(markdown: string): Promise<{ [key: string]: Image }> {
	const output: { [key: string]: Image } = {};
	for (const match of markdown.matchAll(imageExtractionRegex)) {
		const path = match[1];
		const { base64, img } = await getPlaiceholder(`${path}`);
		output[path] = {
			src: img.src,
			width: img.width,
			height: img.height,
			blurDataURL: base64,
		};
	}
	return output;
}

export function getPostSlugs() {
	return fs.readdirSync(postsDirectory);
}

export function getDatelessSlug(slug: string): string {
	return slug.replace(/^(\d+)-(\d+)-(\d+)-/, '');
}

export async function getPostByDatelessSlug(searchSlug: string): Promise<Post> {
	const slugs = getPostSlugs();

	for (const slug of slugs) {
		const realSlug = slug.replace(/\.md$/, '');
		if (realSlug.endsWith(searchSlug)) {
			return getPostBySlug(slug);
		}
	}
	throw new Error(`Couldn't find a post for the dateless slug ${searchSlug}`);
}

export async function getPostBySlug(slug: string): Promise<Post> {
	const realSlug = slug.replace(/\.md$/, '');
	// the old site didn't have the date in the slugs, and I want to keep that SEO
	const slugWithoutDate = getDatelessSlug(realSlug);
	const fullPath = join(postsDirectory, `${realSlug}.md`);
	const fileContents = fs.readFileSync(fullPath, 'utf8');
	const { data, content } = matter(fileContents);

	return {
		metadata: {
			title: data.title,
			date: Date.parse(data.date),
			// the old site didn't have the date in the slugs, and I want to keep that SEO
			url: `/p/${slugWithoutDate}`,
			images: await imageExtractor(content),
			datelessSlug: slugWithoutDate,
		},
		content,
		excerpt: excerptExtractor(content),
	};
}

export async function getAllPosts() {
	const slugs = getPostSlugs();
	const posts = [];
	for (const slug of slugs) {
		const post = await getPostBySlug(slug);
		posts.push(post);
	}

	return posts.sort((post1, post2) => (post1.metadata.date > post2.metadata.date ? -1 : 1));
}

export async function getPostsForPage(page: number): Promise<Post[]> {
	const allPosts = await getAllPosts();

	return allPosts.slice(page * POSTS_PER_PAGE, (page + 1) * POSTS_PER_PAGE);
}

export function getTotalPosts(): number {
	return getPostSlugs().length;
}

export function getTotalPages(): number {
	const totalPosts = getTotalPosts();
	return Math.ceil(totalPosts / POSTS_PER_PAGE);
}
