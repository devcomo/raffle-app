(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  $(function() {
    var Tweet, TweetView, Tweets, TweetsView;
    Tweet = Backbone.Model.extend({});
    Tweets = Backbone.Collection.extend({
      model: Tweet,
      setURL: function(search) {
        this.url = "http://search.twitter.com/search.json?q=" + search + "&callback=?&rpp=200";
        return console.log(this.url);
      },
      parse: function(response) {
        var results;
        results = response.results;
        return _.values(_.reduce(results, function(a, b) {
          a[b.from_user_id] = b;
          return a;
        }, {}));
      },
      selectRandom: function() {
        var toReturn;
        toReturn = this.at(this.randomUpTo(this.length));
        this.remove(toReturn);
        return toReturn;
      },
      randomUpTo: function(ceiling) {
        return Math.floor(Math.random() * ceiling);
      }
    });
    TweetView = Backbone.View.extend({
      tagName: 'li',
      template: _.template($('#tweet-template').html()),
      initialize: function() {
        return this.model.view = this;
      },
      render: function() {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
      },
      active: function() {
        return $(this.el).addClass('active');
      }
    });
    TweetsView = Backbone.View.extend({
      el: $('#app'),
      searchInput: $('#search'),
      events: {
        'click #select': 'pickRandom',
        'change #search': 'getTweets'
      },
      initialize: function() {
        this.tweets = new Tweets();
        this.tweets.bind('reset', __bind(function(tweets) {
          return tweets.each(__bind(function(tweet) {
            return this.render(new TweetView({
              model: tweet
            }).render().el);
          }, this));
        }, this));
        return this.getTweets();
      },
      getTweets: function() {
        this.tweets.setURL(this.searchInput.val());
        return this.tweets.fetch();
      },
      pickRandom: function() {
        var tweet;
        tweet = this.tweets.selectRandom();
        tweet.view.active();
        console.log(tweet);
        return this.$('#winner').text(tweet.get('from_user'));
      },
      render: function(tweet) {
        return this.$('#tweets').append(tweet);
      }
    });
    return window.App = new TweetsView;
  });
}).call(this);
