'use strict'

// abbreviate at last blank before length and add "\u2026" (horizontal ellipsis)
var abbreviateText = function (text, length) {
  var div = document.createElement('div')
  var node = document.createTextNode(text)
  div.appendChild(node)
  var abbreviated = div.textContent
  if (abbreviated.length <= length) {
    return text
  }

  var lastWhitespaceIndex = abbreviated
    .substring(0, length - 1)
    .lastIndexOf(' ')
  abbreviated = abbreviated.substring(0, lastWhitespaceIndex) + '\u2026'

  return abbreviated
}

export default function data(shariff) {
  var shareUrl = new URL('https://twitter.com/intent/tweet');

  var title = shariff.getTitle()

  shareUrl.searchParams.set('url', shariff.getURL());
  if (shariff.options.twitterVia !== null) {
    shareUrl.searchParams.set('via', shariff.options.twitterVia);
  }
  // From Twitters documentation (May 2021):
  // The length of your passed Tweet text should not exceed 280 characters
  // when combined with any passed hashtags, via, or url parameters.
  var remainingTextLength = (280 - (shareUrl.searchParams.via || '').length - (shareUrl.searchParams.url || '').length)
  shareUrl.searchParams.set('text', abbreviateText(title, remainingTextLength));

  return {
    popup: true,
    shareText: {
      en: 'tweet',
      ja: 'のつぶやき',
      ko: '짹짹',
      ru: 'твит',
      sr: 'твеет',
      zh: '鸣叫',
    },
    name: 'twitter',
    faPrefix: 'fab',
    faName: 'fa-twitter',
    title: {
      bg: 'Сподели в Twitter',
      cs: 'Sdílet na Twiiteru',
      da: 'Del på Twitter',
      de: 'Bei Twitter teilen',
      en: 'Share on Twitter',
      es: 'Compartir en Twitter',
      fi: 'Jaa Twitterissä',
      fr: 'Partager sur Twitter',
      hr: 'Podijelite na Twitteru',
      hu: 'Megosztás Twitteren',
      it: 'Condividi su Twitter',
      ja: 'ツイッター上で共有',
      ko: '트위터에서 공유하기',
      nl: 'Delen op Twitter',
      no: 'Del på Twitter',
      pl: 'Udostępnij na Twitterze',
      pt: 'Compartilhar no Twitter',
      ro: 'Partajează pe Twitter',
      ru: 'Поделиться на Twitter',
      sk: 'Zdieľať na Twitteri',
      sl: 'Deli na Twitterju',
      sr: 'Podeli na Twitter-u',
      sv: 'Dela på Twitter',
      tr: "Twitter'da paylaş",
      zh: '在Twitter上分享',
    },
    // shareUrl: 'https://twitter.com/intent/tweet?text='+ shariff.getShareText() + '&url=' + url
    shareUrl: shareUrl + shariff.getReferrerTrack()
  }
}
