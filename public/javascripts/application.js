(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  $(function() {
    var Tweet, TweetView, Tweets, TweetsView;
    Tweet = (function() {
      __extends(Tweet, Backbone.Model);
      function Tweet() {
        Tweet.__super__.constructor.apply(this, arguments);
      }
      return Tweet;
    })();
    Tweets = (function() {
      __extends(Tweets, Backbone.Collection);
      function Tweets() {
        Tweets.__super__.constructor.apply(this, arguments);
      }
      Tweets.prototype.model = Tweet;
      Tweets.prototype.setURL = function(search) {
        this.url = "http://search.twitter.com/search.json?q=" + search + "&callback=?&rpp=200";
        return console.log(this.url);
      };
      Tweets.prototype.parse = function(response) {
        var results;
        results = response.results;
        return _.values(_.reduce(results, function(a, b) {
          a[b.from_user_id] = b;
          return a;
        }, {}));
      };
      Tweets.prototype.getRandom = function() {
        return this.at(this.randomUpTo(this.length));
      };
      Tweets.prototype.removeRandom = function() {
        var toReturn;
        toReturn = this.getRandom();
        this.remove(toReturn);
        return toReturn;
      };
      Tweets.prototype.randomUpTo = function(ceiling) {
        return Math.floor(Math.random() * ceiling);
      };
      return Tweets;
    })();
    TweetView = (function() {
      __extends(TweetView, Backbone.View);
      function TweetView() {
        TweetView.__super__.constructor.apply(this, arguments);
      }
      TweetView.prototype.tagName = 'li';
      TweetView.prototype.template = _.template($('#tweet-template').html());
      TweetView.prototype.initialize = function() {
        return this.model.view = this;
      };
      TweetView.prototype.render = function() {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
      };
      TweetView.prototype.deactive = function() {
        return $(this.el).removeClass('active');
      };
      TweetView.prototype.active = function() {
        return $(this.el).addClass('active');
      };
      return TweetView;
    })();
    TweetsView = (function() {
      __extends(TweetsView, Backbone.View);
      function TweetsView() {
        this.selectWinner = __bind(this.selectWinner, this);
        this.hilightRandom = __bind(this.hilightRandom, this);
        TweetsView.__super__.constructor.apply(this, arguments);
      }
      TweetsView.prototype.SELECTION_LENGTH = 5000;
      TweetsView.prototype.RANDOM_SELECTION_INTERVAL = 100;
      TweetsView.prototype.el = $('#app');
      TweetsView.prototype.searchInput = $('#search');
      TweetsView.prototype.events = {
        'click #select': 'pickRandom',
        'change #search': 'getTweets'
      };
      TweetsView.prototype.initialize = function() {
        this.tweets = new Tweets();
        this.tweets.bind('reset', __bind(function(tweets) {
          $("#tweets").empty();
          return tweets.each(__bind(function(tweet) {
            return this.render(new TweetView({
              model: tweet
            }).render().el);
          }, this));
        }, this));
        return this.getTweets();
      };
      TweetsView.prototype.getTweets = function() {
        this.tweets.setURL(this.searchInput.val());
        return this.tweets.fetch();
      };
      TweetsView.prototype.hilightRandom = function() {
        if (this.tweet) {
          this.tweet.view.deactive();
        }
        this.tweet = this.tweets.getRandom();
        return this.tweet.view.active();
      };
      TweetsView.prototype.selectWinner = function() {
        var tweet;
        clearInterval(this.interval);
        this.tweet.view.deactive();
        tweet = this.tweets.removeRandom();
        tweet.view.active();
        return this.$('#winner').text(tweet.get('from_user'));
      };
      TweetsView.prototype.pickRandom = function() {
        this.interval = setInterval(this.hilightRandom, this.RANDOM_SELECTION_INTERVAL);
        return setTimeout(this.selectWinner, this.SELECTION_LENGTH);
      };
      TweetsView.prototype.render = function(tweet) {
        return this.$('#tweets').append(tweet);
      };
      return TweetsView;
    })();
    return window.App = new TweetsView;
  });
}).call(this);
