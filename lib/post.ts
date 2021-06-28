import fs from 'fs';
import { join } from 'path';
import matter from 'gray-matter';

const postsDirectory = join(process.cwd(), 'posts');

export interface PostMetadata {
	title: string;
	// can't use a Date obj cuz it's not serializable
	// parse this with new Date()
	date: number;
	url: string;
}

export interface Post {
	metadata: PostMetadata;
	// Raw Markdown text
	content: string;
	excerpt: string;
}

// TODO: maybe find a type for this?
function excerptExtractor(markdown: string): string {
	const previewCutoff = markdown.indexOf('<!--more-->');

	if (previewCutoff > 0) {
		return markdown.substring(0, previewCutoff);
	} else {
		return markdown;
	}
}

export function getPostSlugs() {
	return fs.readdirSync(postsDirectory);
}

export function getPostBySlug(slug: string): Post {
	const realSlug = slug.replace(/\.md$/, '');
	const fullPath = join(postsDirectory, `${realSlug}.md`);
	const fileContents = fs.readFileSync(fullPath, 'utf8');
	const { data, content } = matter(fileContents);

	return {
		metadata: {
			title: data.title,
			date: Date.parse(data.date),
			url: `/p/${realSlug}`,
		},
		content,
		excerpt: excerptExtractor(content),
	};
}

export function getAllPosts() {
	const slugs = getPostSlugs();
	const posts = slugs
		.map((slug) => getPostBySlug(slug))
		// sort posts by date in descending order
		.sort((post1, post2) => (post1.metadata.date > post2.metadata.date ? -1 : 1));
	return posts;
}
