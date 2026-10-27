# ZIP STRUCTURE (read-only reference)

The following is the complete file tree as stored in `finanza-v1.0.0 (1).zip`, before extraction. Original template files are preserved unchanged at the repository root.

```
404.html
LICENSE.txt
READ-ME.txt
about.html
contact.html
css/
css/bootstrap.min.css
css/style.css
feature.html
financial-services-website-template.jpg
img/
img/about.jpg
img/bg.png
img/carousel-1.jpg
img/carousel-2.jpg
img/header.jpg
img/service-1.jpg
img/service-2.jpg
img/service-3.jpg
img/service-4.jpg
img/team-1.jpg
img/team-2.jpg
img/team-3.jpg
img/testimonial-1.jpg
img/testimonial-2.jpg
img/testimonial-3.jpg
img/testimonial-4.jpg
index.html
js/
js/main.js
lib/
lib/animate/
lib/animate/animate.css
lib/animate/animate.min.css
lib/counterup/
lib/counterup/counterup.min.js
lib/easing/
lib/easing/easing.js
lib/easing/easing.min.js
lib/owlcarousel/
lib/owlcarousel/LICENSE
lib/owlcarousel/assets/
lib/owlcarousel/assets/ajax-loader.gif
lib/owlcarousel/assets/owl.carousel.css
lib/owlcarousel/assets/owl.carousel.min.css
lib/owlcarousel/assets/owl.theme.default.css
lib/owlcarousel/assets/owl.theme.default.min.css
lib/owlcarousel/assets/owl.theme.green.css
lib/owlcarousel/assets/owl.theme.green.min.css
lib/owlcarousel/assets/owl.video.play.png
lib/owlcarousel/owl.carousel.js
lib/owlcarousel/owl.carousel.min.js
lib/waypoints/
lib/waypoints/links.php
lib/waypoints/waypoints.min.js
lib/wow/
lib/wow/wow.js
lib/wow/wow.min.js
project.html
scss/
scss/bootstrap.scss
scss/bootstrap/
scss/bootstrap/scss/
scss/bootstrap/scss/_accordion.scss
scss/bootstrap/scss/_alert.scss
scss/bootstrap/scss/_badge.scss
scss/bootstrap/scss/_breadcrumb.scss
scss/bootstrap/scss/_button-group.scss
scss/bootstrap/scss/_buttons.scss
scss/bootstrap/scss/_card.scss
scss/bootstrap/scss/_carousel.scss
scss/bootstrap/scss/_close.scss
scss/bootstrap/scss/_containers.scss
scss/bootstrap/scss/_dropdown.scss
scss/bootstrap/scss/_forms.scss
scss/bootstrap/scss/_functions.scss
scss/bootstrap/scss/_grid.scss
scss/bootstrap/scss/_helpers.scss
scss/bootstrap/scss/_images.scss
scss/bootstrap/scss/_list-group.scss
scss/bootstrap/scss/_mixins.scss
scss/bootstrap/scss/_modal.scss
scss/bootstrap/scss/_nav.scss
scss/bootstrap/scss/_navbar.scss
scss/bootstrap/scss/_offcanvas.scss
scss/bootstrap/scss/_pagination.scss
scss/bootstrap/scss/_popover.scss
scss/bootstrap/scss/_progress.scss
scss/bootstrap/scss/_reboot.scss
scss/bootstrap/scss/_root.scss
scss/bootstrap/scss/_spinners.scss
scss/bootstrap/scss/_tables.scss
scss/bootstrap/scss/_toasts.scss
scss/bootstrap/scss/_tooltip.scss
scss/bootstrap/scss/_transitions.scss
scss/bootstrap/scss/_type.scss
scss/bootstrap/scss/_utilities.scss
scss/bootstrap/scss/_variables.scss
scss/bootstrap/scss/bootstrap-grid.scss
scss/bootstrap/scss/bootstrap-reboot.scss
scss/bootstrap/scss/bootstrap-utilities.scss
scss/bootstrap/scss/bootstrap.scss
scss/bootstrap/scss/forms/
scss/bootstrap/scss/forms/_floating-labels.scss
scss/bootstrap/scss/forms/_form-check.scss
scss/bootstrap/scss/forms/_form-control.scss
scss/bootstrap/scss/forms/_form-range.scss
scss/bootstrap/scss/forms/_form-select.scss
scss/bootstrap/scss/forms/_form-text.scss
scss/bootstrap/scss/forms/_input-group.scss
scss/bootstrap/scss/forms/_labels.scss
scss/bootstrap/scss/forms/_validation.scss
scss/bootstrap/scss/helpers/
scss/bootstrap/scss/helpers/_clearfix.scss
scss/bootstrap/scss/helpers/_colored-links.scss
scss/bootstrap/scss/helpers/_position.scss
scss/bootstrap/scss/helpers/_ratio.scss
scss/bootstrap/scss/helpers/_stretched-link.scss
scss/bootstrap/scss/helpers/_text-truncation.scss
scss/bootstrap/scss/helpers/_visually-hidden.scss
scss/bootstrap/scss/mixins/
scss/bootstrap/scss/mixins/_alert.scss
scss/bootstrap/scss/mixins/_border-radius.scss
scss/bootstrap/scss/mixins/_box-shadow.scss
scss/bootstrap/scss/mixins/_breakpoints.scss
scss/bootstrap/scss/mixins/_buttons.scss
scss/bootstrap/scss/mixins/_caret.scss
scss/bootstrap/scss/mixins/_clearfix.scss
scss/bootstrap/scss/mixins/_color-scheme.scss
scss/bootstrap/scss/mixins/_container.scss
scss/bootstrap/scss/mixins/_deprecate.scss
scss/bootstrap/scss/mixins/_forms.scss
scss/bootstrap/scss/mixins/_gradients.scss
scss/bootstrap/scss/mixins/_grid.scss
scss/bootstrap/scss/mixins/_image.scss
scss/bootstrap/scss/mixins/_list-group.scss
scss/bootstrap/scss/mixins/_lists.scss
scss/bootstrap/scss/mixins/_pagination.scss
scss/bootstrap/scss/mixins/_reset-text.scss
scss/bootstrap/scss/mixins/_resize.scss
scss/bootstrap/scss/mixins/_table-variants.scss
scss/bootstrap/scss/mixins/_text-truncate.scss
scss/bootstrap/scss/mixins/_transition.scss
scss/bootstrap/scss/mixins/_utilities.scss
scss/bootstrap/scss/mixins/_visually-hidden.scss
scss/bootstrap/scss/utilities/
scss/bootstrap/scss/utilities/_api.scss
scss/bootstrap/scss/vendor/
scss/bootstrap/scss/vendor/_rfs.scss
service.html
team.html
testimonial.html
```

# Template audit checklist

- **CSS custom properties:** 41 distinct explicitly declared names, listed below. `scss/bootstrap/scss/_root.scss` also generates Bootstrap custom-property names by Sass interpolation. The original CSS and SCSS files are retained verbatim.
- **@font-face:** none in the archive. The HTML files load Jost (500, 600, 700) and Open Sans (400, 500) from Google Fonts; `scss/bootstrap.scss` assigns them to headings and body respectively.
- **Loading screen:** the `#spinner` element in `index.html` and other original HTML pages, styled by `css/style.css` and Bootstrap. It is reused in the application.
- **Cookie consent banner:** absent.
- **CAPTCHA integration:** absent.
- **Privacy policy, terms, cookie policy:** absent.
- **404:** `404.html` exists as a static template, not a Next.js route.
- **500:** absent.
- **API route filenames:** none.
- **Environment variable names:** none. There is no `.env.example` or `.env.local` in the archive.

## Declared CSS custom-property names and locations

- `--bs-aspect-ratio`: `css/bootstrap.min.css`
- `--bs-blue`: `css/bootstrap.min.css`
- `--bs-cyan`: `css/bootstrap.min.css`
- `--bs-danger`: `css/bootstrap.min.css`
- `--bs-dark`: `css/bootstrap.min.css`
- `--bs-font-monospace`: `css/bootstrap.min.css`
- `--bs-font-sans-serif`: `css/bootstrap.min.css`
- `--bs-gradient`: `css/bootstrap.min.css`
- `--bs-gray`: `css/bootstrap.min.css`
- `--bs-gray-dark`: `css/bootstrap.min.css`
- `--bs-green`: `css/bootstrap.min.css`
- `--bs-gutter-x`: `css/bootstrap.min.css`
- `--bs-gutter-y`: `css/bootstrap.min.css`
- `--bs-indigo`: `css/bootstrap.min.css`
- `--bs-info`: `css/bootstrap.min.css`
- `--bs-light`: `css/bootstrap.min.css`
- `--bs-orange`: `css/bootstrap.min.css`
- `--bs-pink`: `css/bootstrap.min.css`
- `--bs-position`: `css/bootstrap.min.css`, `scss/bootstrap/scss/_dropdown.scss`
- `--bs-primary`: `css/bootstrap.min.css`
- `--bs-purple`: `css/bootstrap.min.css`
- `--bs-red`: `css/bootstrap.min.css`
- `--bs-secondary`: `css/bootstrap.min.css`
- `--bs-success`: `css/bootstrap.min.css`
- `--bs-table-accent-bg`: `css/bootstrap.min.css`
- `--bs-table-active-bg`: `css/bootstrap.min.css`
- `--bs-table-active-color`: `css/bootstrap.min.css`
- `--bs-table-bg`: `css/bootstrap.min.css`
- `--bs-table-hover-bg`: `css/bootstrap.min.css`
- `--bs-table-hover-color`: `css/bootstrap.min.css`
- `--bs-table-striped-bg`: `css/bootstrap.min.css`
- `--bs-table-striped-color`: `css/bootstrap.min.css`
- `--bs-teal`: `css/bootstrap.min.css`
- `--bs-warning`: `css/bootstrap.min.css`
- `--bs-white`: `css/bootstrap.min.css`
- `--bs-yellow`: `css/bootstrap.min.css`
- `--dark`: `css/style.css`
- `--light`: `css/style.css`
- `--primary`: `css/style.css`
- `--secondary`: `css/style.css`
- `--tertiary`: `css/style.css`
