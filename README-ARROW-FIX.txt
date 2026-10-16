Deep Blue — Reliable arrow-bubble removal

This patch removes the tiny northeast-arrow bubbles on photography and visual-art thumbnails. The clickable images, fullscreen viewer navigation arrows, and “View all” links remain unchanged.

HOW TO APPLY
1. Unzip and open deep-blue-arrows-actual-fix.
2. At https://github.com/egentler/deep-blue, choose Add file > Upload files.
3. Drag the FOUR items inside the folder (index.html, _layouts, assets, and this readme optional) into the repository upload area. Preserve folders.
4. Commit to main, wait for GitHub Pages to finish, and refresh the site. To bypass cache, open a private/incognito tab.

Included site files:
- index.html: removes arrow markup from the homepage thumbnails.
- _layouts/archive.html: removes arrow markup from the archive thumbnails.
- _layouts/default.html: refreshes the CSS URL to avoid stale cached CSS, keeping the previous shorter header.
- assets/css/gallery.css: keeps earlier header changes and adds a hide safeguard.

No changes to .pages.yml, posts, images, or publishing settings.
