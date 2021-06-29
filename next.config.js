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
};
