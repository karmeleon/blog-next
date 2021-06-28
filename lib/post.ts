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

export async function getPostBySlug(slug: string): Promise<Post> {
	const realSlug = slug.replace(/\.md$/, '');
	const fullPath = join(postsDirectory, `${realSlug}.md`);
	const fileContents = fs.readFileSync(fullPath, 'utf8');
	const { data, content } = matter(fileContents);

	return {
		metadata: {
			title: data.title,
			date: Date.parse(data.date),
			url: `/p/${realSlug}`,
			images: await imageExtractor(content),
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
