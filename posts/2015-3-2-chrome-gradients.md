---
layout: post
title: Chrome and gradients are not friends.
date: 2015-3-2
---

While I was making this site, I discovered that Chrome has a bug with really tall gradients. The beveled corner effect I have on here is done like this:

~~~css
.blog-post-outline {
	background: linear-gradient(135deg, transparent 15px, rgba(0,0,0,0.5) 0);
	padding: 5px;
}

.blog-post-content {
	background: linear-gradient(135deg, transparent 15px, white 0);
	padding: 15px;
	/* ... */
}
~~~

Chrome fails to actually render it when the div it's in is tall enough, instead just showing the standard 90 degree corner. To see what I mean, open up [this long post]({% post_url 2015-2-21-buddhabrot %}) in Chrome and look at the upper left-hand corner of the post. The sidebar and the excerpt on the homepage work fine because they're shorter. [This Codepen](http://codepen.io/anon/pen/KwBwBp) demonstrates the issue as well. IE11 has no problem with it and while Firefox blurs the edge pretty badly, it does show up. The Chrome team has known about this for [about two years now](https://code.google.com/p/chromium/issues/detail?id=177293), but there's been no real progress since. I hope they fix it soon, but until then I'll have to find a workaround.

EDIT: Hey, they fixed it in July 2016 and I didn't notice!