const securityHeaders = [
	{
		key: 'X-Content-Type-Options',
		value: 'nosniff',
	},
];

module.exports = {
	reactStrictMode: true,
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
