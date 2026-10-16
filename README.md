# Deep Blue — student literary & arts journal

A static Jekyll website for GitHub Pages, designed to be edited with Pages CMS.

## How to publish for the first time

1. Upload the **contents** of this folder (not the enclosing folder and not the ZIP itself) to the root of your `deep-blue` GitHub repository, using **Add file → Upload files**. You can drag files and folders into the upload area. Be sure the hidden `.pages.yml` gets included (show hidden files on your Mac with Command–Shift–period).
2. Open repository **Settings → Pages**. Under **Build and deployment**, set **Source** to **Deploy from a branch**, branch **main**, folder **/(root)**; save.
3. After the initial publication, use the Pages link in Settings to open your staging site. For a repository `deep-blue`, the address will be `https://YOUR-USERNAME.github.io/deep-blue/`.
4. Go to https://app.pagescms.org and sign in with GitHub. Authorize the GitHub app for this repository. Pages CMS will read `.pages.yml` and show the **Student work** collection and **Site wording**.

## Publishing new student work

- In Pages CMS choose **Student work → New**. Add a title, date, category, approved byline, short description, and (if useful) a cover image.
- Put the poem, story, essay, or artist statement into **Full text / artist statement**.
- Save/publish in Pages CMS. It commits to GitHub; GitHub Pages automatically rebuilds the static site.
- The latest date appears first and older work moves down automatically.
- Delete the sample entries when ready; then, under **Site wording**, turn off **Show sample-content notice**.

## Before connecting deepbluelr.com

The `_config.yml` file has `baseurl: "/deep-blue"`, which is appropriate for the temporary GitHub Pages project address. When switching to the custom domain `deepbluelr.com`, change it to `baseurl: ""` as part of the custom-domain configuration. We have *not* moved the domain or changed DNS yet.

## Safety and privacy

The repo is public. Only upload student work you are allowed to publish; use anonymous or approved bylines and strip location metadata from photos if necessary. Do not store private submissions or drafts in this public repository.

## Files

- `_posts/`: student pieces, automatically ordered by date
- `assets/uploads/`: uploaded images
- `.pages.yml`: editor setup
- `_data/site.yml`: general page wording
- `_layouts/`: reusable templates
- `assets/css/style.css`: site design
- `assets/js/archive.js`: homepage filters
