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
	typescript: {
		// vercel sucks
		ignoreBuildErrors: true,
	},
};
