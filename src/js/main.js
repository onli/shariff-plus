import * as services from './services/index.js';

const Defaults = {
  theme: 'color',

  // URL to backend that requests social counts. null means "disabled"
  backendUrl: null,

  // Link to the "about" page
  infoUrl: 'https://www.richard-fath.de/de/software/shariff-plus.html',

  // Type of display for the "about" page: "blank", "popup" or "self", default = "blank"
  infoDisplay: 'blank',

  // localisation: "de" or "en"
  lang: 'de',

  // fallback language for not fully localized services
  langFallback: 'en',

  mailUrl: function() {
    var shareUrl = url.parse(this.getURL(), true)
    shareUrl.query.view = 'mail'
    delete shareUrl.search
    return url.format(shareUrl)
  },

  mailBody: function() { return this.getURL() },

  // Media (e.g. image) URL to be shared
  mediaUrl: null,

  // horizontal/vertical
  orientation: 'horizontal',

  // icon/icon-count/standard
  buttonStyle: 'standard',

  // a string to suffix current URL
  referrerTrack: null,

  // services to be enabled in the following order
  services: ['twitter', 'facebook', 'info'],

  title: document.title,

  twitterVia: null,

  flattrUser: null,

  flattrCategory: null,

  // build URI from rel="canonical" or document.location
  url: function() {
    var url = document.location.href
    var canonical = document.querySelector('link[rel=canonical]').href || this.getMeta('og:url') || ''

    if (canonical.length > 0) {
      if (canonical.indexOf('http') < 0) {
        if (canonical.indexOf('//') !== 0) {
          canonical = document.location.protocol + '//' + document.location.host + canonical
        } else {
          canonical = document.location.protocol + canonical
        }
      }
      url = canonical
    }

    return url
  }
}

class Shariff {
  constructor(element, options) {
    // the DOM element that will contain the buttons
    this.element = element

    this.options = Defaults;
    if (options) {
      for (let option in options) {
        this.options[option] = options[option];
      }
    }
    if (element.dataset) {
      for (let option in element.dataset) {
        this.options[option] = element.dataset[option];
      }
    }
    

    // filter available services to those that are enabled and initialize them
    this.services = Object.keys(services)
      .filter(service => this.isEnabledService(service))
      .sort((a, b) => {
        let services = this.options.services
        return services.indexOf(a) - services.indexOf(b)
      })
      .map(serviceName => services[serviceName](this))

    this._addButtonList()

    if (this.options.backendUrl !== null && this.options.buttonStyle !== 'icon') {
      this.getShares(this._updateCounts.bind(this))
    }
  }

  isEnabledService(serviceName) {
    return this.options.services.indexOf(serviceName) > -1
  }

  getLocalized(data, key) {
    if (typeof data[key] === 'object') {
      if (typeof data[key][this.options.lang] === 'undefined') {
        return data[key][this.options.langFallback]
      } else {
        return data[key][this.options.lang]
      }
    } else if (typeof data[key] === 'string') {
      return data[key]
    }
    return undefined
  }

  // returns content of <meta name="" content=""> tags or '' if empty/non existant
  getMeta(name) {
    var metaContent = $(`meta[name="${name}"],[property="${name}"]`).attr('content')
    return metaContent || ''
  }

  getInfoUrl() {
    return this.options.infoUrl
  }

  getInfoDisplayPopup() {
    return (this.options.infoDisplay === 'popup')
  }

  getInfoDisplayBlank() {
    return (
      (this.options.infoDisplay !== 'popup') &&
      (this.options.infoDisplay !== 'self')
    )
  }

  getURL() {
    return this.getOption('url')
  }

  getOption(name) {
    var option = this.options[name]
    return (typeof option === 'function') ? option.call(this) : option
  }

  getTitle() {
    let title = this.getOption('title')
    if (this.element.dataset['title']) {
        return title
    }
    title = title || this.getMeta('DC.title')
    let creator = this.getMeta('DC.creator')
    return (title && creator) ? `${title} - ${creator}` : title
  }

  getReferrerTrack() {
    return this.options.referrerTrack || ''
  }

  // returns shareCounts of document
  getShares(callback) {
    var backend = new URL(this.options.backendUrl);
    backend.searchParams.set('url', this.getURL());
    let myRequest = new Request(backend);
    fetch(myRequest)
      .then(response => response.json())
      .then((json) => {
        callback(json);
       });
  }

  // add value of shares for each service
  _updateCounts(data, status, xhr) {
    if (!data) {
        return;
    }
    var fbValue = null;

    for (const [serviceName, value] of Object.entries(data)) {
      if (value >= 1000) {
        value = Math.round(value / 1000) + 'k'
      }
      var doAppend = true
      if (serviceName === 'facebook') {
        fbValue = value
        if (this.options.facebookCountBtn === 'like') {
          doAppend = false
        }
      }
      if (this.isEnabledService(serviceName) && doAppend) {
        let counter = document.createElement('span');
        counter.classList.add('share_count');
        counter.innerHTML = value;
        this.element
          .querySelector(`.${serviceName} a`)
          .append(counter);
      }
    }
  }

  // add html for button-container
  _addButtonList() {
    var buttonList = document.createElement('ul');
    buttonList.classList.add(
      'theme-' + this.options.theme,
      'orientation-' + this.options.orientation,
      'button-style-' + this.options.buttonStyle,
      'shariff-col-' + this.options.services.length
    );
    // add html for service-links
    this.services.forEach(service => {
      var li = document.createElement('li');
      li.classList.add("shariff-button", service.name);
      
      var shareLink = document.createElement('a');
      shareLink.href = service.shareUrl;

      if (this.options.buttonStyle === 'standard') {
        var shareText = document.createElement('span');
        shareText.classList.add('share_text');
        shareText.innerHTML = this.getLocalized(service, 'shareText');
        shareLink.append(shareText);
      }

      if (typeof service.faPrefix !== 'undefined' && typeof service.faName !== 'undefined') {
        var prefix = document.createElement('span');
        prefix.classList.add(service.faPrefix, service.faName);
        shareLink.prepend(prefix);
      }

      if (service.popup) {
        shareLink.dataset['rel'] = 'popup';
        if (service.name !== 'info') {
          shareLink.setAttribute('rel', 'nofollow');
        }
      } else if (service.blank) {
        shareLink.setAttribute('target', '_blank');
        if (service.name === 'info') {
          shareLink.setAttribute('rel', 'noopener noreferrer');
        } else {
          shareLink.setAttribute('rel', 'nofollow noopener noreferrer');
        }
      } else if (service.name !== 'info') {
        shareLink.setAttribute('rel', 'nofollow');
      }
      shareLink.setAttribute('title', this.getLocalized(service, 'title'));

      // add attributes for screen readers
      shareLink.setAttribute('role', 'button');
      shareLink.setAttribute('aria-label', this.getLocalized(service, 'title'));

      li.append(shareLink);

      buttonList.append(li);
    })

    // event delegation
    buttonList.addEventListener('click', function(e) {
      e.preventDefault();

      var url = e.target.closest('[data-rel="popup"]').href;

      // if a twitter widget is embedded on current site twitter's widget.js
      // will open a popup so we should not open a second one.
      if (url.match(/twitter\.com\/intent\/(\w+)/)) {
        var w = window
        if (w.__twttr && w.__twttr.widgets && w.__twttr.widgets.loaded) {
          return
        }
      }

      window.open(url, '_blank', 'width=600,height=460')
    });
    
    this.element.append(buttonList);
  }
}

// TODO: Have a shariff class that builds the shariff html elements

// TODO: Init the shariff object for all shariff placeholder elements, .shariff
document.querySelectorAll('.shariff').forEach(function (currentValue, currentIndex, listObj) {
  if (!currentValue.hasOwnProperty('shariff')) {
    currentValue.shariff = new Shariff(currentValue, {theme: 'abc'});
  }
});