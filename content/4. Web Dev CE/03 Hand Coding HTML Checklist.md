Create your first two pages and upload them to your website. Remember to name the home page "index.html" (lowercase i) or it will not show up. Use real text related to your topic. Filler, fluff, or nonsense text will not be accepted.
##### Document Head Requirements

Please include a title in the head of the document.

- [ ] The HTML language attribute is present
- [ ] The title is present referencing the company name.
- [ ] The character set is present
- [ ] The author meta tag is present
- [ ] The description meta tag is present
- [ ] The viewport meta tag is present

##### Semantic Tags

Use four semantic html5 tags for the body of your page.

- [ ] Use a header tag for the company name and slogan  
- [ ] Use a nav tag for the navigation  
- [ ] Use a main tag for the page content  
- [ ] Use a footer tag for copyright information

##### Site Name Requirements

Use a span tag for the site name.

- [ ] Within the header tag, use a span tag for the company name or site name.

##### Navigation Requirements

Use an unordered list for inter-page navigation.

- [ ] Within the nav tag, use a ul and at least two linked anchor tags to link to both pages together

##### Heading Tags

Please include the following HTML markup within the body of _either_ of the two pages.

- [ ] Use an h1 for the page title (first thing inside the opening main tag)  
- [ ] At least three (h2) headings have been used  
- [ ] At least four paragraph (p) tags somewhere in the body of the pages

##### Other Tags

Please include the following HTML markup within the body of _either_ of the two pages.

- [ ] One address tag is present  
- [ ] One or more html comments are present  
- [ ] One or more break tags are present (creates a single space)

##### List Tags

Please include the following HTML markup within the body of _either_ of the two pages.

- [ ] Include at least one unordered list tag with li items. (the ul in the nav does NOT count)  
- [ ] Include at least one ordered list tag with list items  
- [ ] Include a definition list tag with a minimum of 3 terms and 3 definitions

##### Inline Tags

Please include the following HTML markup within the body of _either_ of the two pages.

- [ ] Italicized text using em is present. (DO NOT use with a heading tag)  
- [ ] Bold text using strong is present. (DO NOT use with a heading tag)

##### HTML Entities

Please include the following HTML markup within the body of _either_ of the two pages.

- [ ] A copyright entity symbol is present  
- [ ] A bullet entity is present

##### Phone Number Link

Include a link to a phone number that will make a call on a phone.

- [ ] At least one telephone link (tel:)

##### Links to Other Sites

Create two links from either of your pages to a related site. For example: if you are designing a site about food, then link to a site that sells cooking stuff.

- [ ] At least two links to other sites that open in a new tab (_blank)

##### Validation

Please insure your site passes the HTML validation tests.

- [ ] HTML passes a [W3C validator](https://validator.w3.org/)

##### Upload to GitHub

- [ ] Make a commit in VS-Code 
- [ ] Push the commit to GitHub
- [ ] Make sure that the website loads properly
- [ ] Submit the URL to the website on Canvas

## Tips for Meeting the Requirements

### Home page (`index.html`)
- Use this page for your **contact info** — an `<address>` block with your name, city, and phone number naturally covers the `address` tag, the `br` tag (line breaks between name/city/phone), and the `tel:` link all at once.
- Write 1–2 real paragraphs introducing yourself, with 2 `h2` section headers (e.g. "About Me," "What You'll Find Here").

### Hobbies page (`hobbies.html`)
- Pick 2–3 real hobbies and describe each one — this is where the list tags fit naturally:
  - **Unordered list**: gear/equipment needed for one hobby
  - **Ordered list**: steps for how you do/practice the hobby
- Work in `<em>` and `<strong>` where they'd naturally add emphasis in your writing — not on headings.
- Use the bullet entity (`&bull;`) as a separator in a short list, e.g. a list of genres or categories.

### Food page (`food.html`)
- This is the best spot for the **definition list** — list 3+ favorite dishes as `<dt>` terms with a real one-sentence definition as `<dd>`. This is the requirement students forget most, so call it out explicitly.
- Add your **two outbound links** here (`target="_blank"`) — link to a real recipe site or restaurant.

### Across all three pages
- Don't chase `h2`/`p` counts on one page — write genuinely, 1–2 paragraphs and a heading or two per page, and the site-wide totals (3+ `h2`, 4+ `p`) take care of themselves.
- Reuse the same `<header>`, `<nav>`, and `<footer>` on all three pages — build it once, then copy it over so the meta tags, `span` site name, and `&copy;` entity stay consistent.

### Before uploading
- Run each page through the [W3C Validator](https://validator.w3.org/) and fix errors from the top down — an early missing closing tag often causes a cascade of false errors below it.