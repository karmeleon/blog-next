// @ts-check
const securityHeaders = [
	{
		key: 'X-Content-Type-Options',
		value: 'nosniff',
	},
];

/** @type {import('next').NextConfig} */
export default {
	reactStrictMode: true,
	images: {
		// TODO: enable avif once it supports animations
		formats: ['image/webp'],
	},
	async rewrites() {
		return [
			{
				source: '/',
				destination: '/ps/0',
			},
		];
	},
	async headers() {
		return [
			{
				// Apply these headers to all routes in your application.
				source: '/(.*)',
				headers: securityHeaders,
			},
		];
	},
};
