# Shariff-Plus – Social Media Buttons With Privacy [![Build Status](https://travis-ci.org/richard67/shariff-plus.svg?branch=master)](https://travis-ci.org/richard67/shariff-plus)

Shariff-Plus enables website users to share and like their favorite content without compromising their privacy. [Demo](https://www.richard-fath.de/shariff-plus-demo/index.html)

It is equal to [Shariff by Heise Medien](https://github.com/heiseonline/shariff) plus extensions like showing the Facebook "Like" button in a dialog, which is not intended to be ever included into Shariff, or other enhancements or corrections which have not been integrated into Shariff (yet).

Some social service providers like e.g. Facebook supply official code snippets for their buttons which quietly siphon personal data from all page visitors. Shariff-Plus enables visitors to see how popular your page is on Facebook and share your content with others without needless data leaks.

**Shariff** `(/ˈʃɛɹɪf/)` is an open-source, low-maintenance, high-privacy solution maintained by German computer magazine c't and heise online.

Shariff consists of two parts: a simple JavaScript client library and an optional server-side component. The latter fetches the number of likes or shares. Share buttons and share counts work without a connection between your visitors' browsers and *social networks* (unless they decide to share, of course).

**Shariff-Plus** is maintained by [me](https://github.com/richard67). It can be used instead of the Shariff JavaScript client library and optionally uses the original Shariff's server-side component.

## Getting Started

1. Download the [latest release](https://github.com/richard67/shariff-plus/releases/latest)
2. Upload all files included in the release
3. Include CSS in `<head>`:
    * `shariff.complete.css` uses the dependencies included in the release files
    * if [Font Awesome](https://github.com/FortAwesome/Font-Awesome) is already included in your site, use `build/shariff.min.css`
4. Include JavaScript right before `</body>`:
    * `shariff.complete.js` uses the dependencies included in the release files
    * if [jQuery](https://github.com/jquery/jquery) is already included in your site, use `build/shariff.min.js`
5. Insert one or more `<div class="shariff">` elements.
6. Customize the look using data-* attributes.

To enable the counters in the buttons, see section [Backends](#backends).

Usage example:

```html
<!DOCTYPE html>
<html>
<head>
    <link href="/path/to/shariff.min.css" rel="stylesheet">
</head>
<body>
    <h1>My article</h1>
    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>

    <h2>Minimum buttons:</h2>
    <div class="shariff"></div>

    <h2>More advanced buttons:</h2>
    <div class="shariff" data-backend-url="/path/to/backend" data-url="https://www.example.com/my-article.html" data-theme="grey" data-orientation="vertical"></div>

    <!-- immediately before </body> -->
    <script src="/path/to/shariff.min.js"></script>
</body>
</html>
```

## Getting Started using `npm`

You can also use the Shariff-Plus node package by installing it via `npm`:

```sh
$ cd my-project
$ npm install shariff-plus --save
```

Edit your JS main script, include Shariff-Plus and initialize it in one or more containers:

```js
// my-app.js
var ShariffPlus = require('shariff-plus');
var $ = require('jquery');
var buttonsContainer = $('.some-selector');
new ShariffPlus(buttonsContainer, {
    orientation: 'vertical'
});
```

## Running demo site

After downloading Shariff-Plus, install its dependencies by running `npm install`.

```sh
$ git clone https://github.com/richard67/shariff-plus.git
$ cd shariff-plus
$ npm install
$ npm run dev
```

## Options (data attributes)

Differences to Shariff are marked with (1), (2) and so on and explained below the table.

| Attribute        | Description | Default |
|------------------|-------------|---------|
| `data-backend-url` | The path to your Shariff backend, see below. Setting the value to `null` disables the backend feature. No counts will occur.  | `null` |
| `data-button-style` | How to display the buttons. Values: `standard`, `icon`, `icon-count`. With `icon` only the icon is shown, with `icon-count` icon and counter and with `standard` icon, text and counter are shown, depending on the display size.  | `standard` |
| `data-dialogs-media-url` (1) | The path to css or js for special dialogs like e.g. the one of the `facebooklike` service. This has to be an absolute URL. Example: `https://www.example.com/shariff`. This allows to use own css e.g. for the `facebooklike` dialog. | Path to directory where Shariff-Plus is installed. |
| `data-facebook-count-btn` (1) | The button(s) which shall show the counter from backend if both services `facebook` and `facebooklike` are used. Values: `like`, `share`, `both`. | `like` |
| `data-facebooklike-css` (1) | Name of the CSS file for the `facebooklike` dialog. The file has to be present in the folder specified by the `data-dialogs-media-url` option. Example : `data-facebooklike-css="my-styles.css"`. | `facebooklike_dlg.css` |
| `data-facebooklike-options` (1) | An entity-encoded JSON string containing an object with options for the Facebook "Like" button as provided by the Facebook configurator for that button. Example with default values of Facebook: `data-facebooklike-options="{&quot;width&quot;:450,&quot;layout&quot;:&quot;standard&quot;,&quot;action&quot;:&quot;like&quot;,&quot;size&quot;:&quot;large&quot;,&quot;show_faces&quot;:true,&quot;share&quot;:true,&quot;appId&quot;:&quot;99999&quot;}"` with 99999 = Facebook `app_id`. | See example, with appId = value of the `fb:app_id` meta tag or `null` if not defined. |
| `data-flattr-category` | Category to be used for Flattr. | `null` |
| `data-flattr-user` | User that receives Flattr donation. | `null` |
| `data-info-url` (2) | URL of the info page. | `https://www.richard-fath.de/de/software/shariff-plus.html` |
| `data-info-display` | How to display the info page. Values: `blank`, `popup`, `self`. | `blank` |
| `data-lang`      | The localisation to use. Available: `bg`, `cs`, `da`, `de`, `en`, `es`, `fi`, `fr`, `hr`, `hu`, `it`, `ja`, `ko`, `nl`, `no`, `pl`, `pt`, `ro`, `ru`, `sk`, `sl`, `sr`, `sv`, `tr`, `zh` | `de` |
| `data-mail-body` | If a `mailto:` link is used in `data-mail-url`, then this value is used as the mail body. The body text should contain the placeholder `{url}` which will be replaced with the share URL. | see `data-url`  |
| `data-mail-subject` | If a `mailto:` link is used in `data-mail-url`, then this value is used as the mail subject. | see `data-title` |
| `data-mail-url`  | The url target used for the `mail` service button | `?view=mail` |
| `data-media-url` | Media url to be shared (pinterest) | `null` |
| `data-orientation` | `vertical` will stack the buttons vertically. | `horizontal`  |
| `data-referrer-track` | A string that will be appended to the share url. Can be disabled using `null`. | `null` |
| `data-services` (3)   | An entity-encoded JSON string containing an array of service names to be enabled. Example: `data-services="[&quot;facebook&quot;,&quot;twitter&quot;]"` Available service names: `buffer`, `clipboard`, `diaspora`, `facebook`, `facebooklike`, `fediverse`, `flattr`, `flipboard`, `info`, `linkedin`, `mail`, `pinterest`, `pocket`, `print`, `qzone`, `reddit`, `stumbleupon`, `telegram`, `tencent`, `threema`, `tumblr`, `twitter`, `vk`, `weibo`, `whatsapp`, `xing` | `twitter`, `facebooklike`, `facebook`, `info` |
| `data-theme`       | We include 3 color schemes, `standard`, `grey` and `white`. | `standard` |
| `data-title`       | Title to be used as share text in Twitter/Whatsapp | page's `DC.title`/`DC.creator` or `<title>` |
| `data-twitter-via` | Screen name of the user to attribute the Tweet to | `null` |
| `data-url`         | The canonical URL of the page to check. | page's canonical URL or `og:url` or current URL |

(1) This option exists only in Shariff-Plus.

(2) The default value of Shariff is `https://ct.de/-2467514`.

(3) The service `facebooklike` exists only in Shariff-Plus.

## Constructor arguments

All data attributes above are also available as constructor arguments in JavaScript. However, the
leading `data-` is omitted and the name is in camelCase instead of kebab-case:

```js
var buttonsContainer = $('.some-selector');
new Shariff(buttonsContainer, {
    backendUrl: '/my/backend/url',
    orientation: 'vertical',
    mailUrl: 'mailto:me@example.com',
});
```

## Events

Shariff buttons emit the `shariff-share` event if they are clicked.

```js
$('body').on('shariff-share', function(event) {
    var service = event.details;
    ...
});
```

This can be used to track shares using analytics software. It is recommended to register the event handler only after the analytics script becomes available.

**Piwik example:**

```js
(function() {
  var _my_piwik_onload = function() {
    var piwik = this;

    $('body').on('shariff-share', function(event) {
      var service = event.detail;
      piwik.trackEvent('Sharing', service.name);
    });
  }

  _paq.push([ _my_piwik_onload ]);
})();
```

## Supported browsers

Shariff-Plus supports the following Browsers:

- Firefox
- Google Chrome
- Internet Explorer/Edge
- Safari

The current and previous major releases of Firefox, Google Chrome, Internet Explorer/Edge and Safari are supported on a rolling basis.

## Supported services

Shariff-Plus supports the following social sharing services:

- buffer
- Clipboard
- diaspora*
- facebook
- Fediverse
- Flattr
- Flipboard
- LinkedIn
- Mail
- Pinterest
- Pocket
- Print
- Qzone
- reddit
- StumbleUpon
- Telegram
- Tencent Weibo
- Threema
- Tumblr
- Twitter
- VK
- Weibo
- WhatsApp
- XING

In addition, the service `facebooklike` provides a button to show the Facebook "Like" button in a dialog.

Finally, the service `Info` provides a button to show an info page about the social sharing buttons.
The URL of this page can be set with an option. Default value: `https://www.richard-fath.de/de/software/shariff-plus.html`, which is the German version of the Shariff-Plus project homepage.
The project homepage is also available in [English](https://www.richard-fath.de/en/software/shariff-plus.html) and [Russian](https://www.richard-fath.de/ru/software/shariff-plus.html).

## Backends

In order to display share counts with Shariff, you need the following backend:

* [shariff-backend-php](https://github.com/heiseonline/shariff-backend-php)

Third-party backends:

* [shariff-backend-java](https://github.com/shred/shariff-backend-java)

Once you have one of these backends up and running, insert its URL into the `data-backend-url` attribute. For example, if the backend runs under `https://example.com/my-shariff-backend/`, the `data-backend-url` should be `/my-shariff-backend/`. The script will handle the rest.

## Third-party integrations

There are no third-party integrations of Shariff-Plus yet.

If you have created such an integration, e.g. an integration of Shariff-Plus into your favourite CMS, create a pull request on GitHub to let your integration be listed here, or send me an email with the details using the contact form on my homepage.

A good starting point for creating a third-party integrations of Shariff-Plus is to use an existing third-party integration of the original Shariff and then replace files from or references to Shariff by the same for Shariff-Plus.
