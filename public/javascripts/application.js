(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  $(function() {
    var Tweet, TweetView, Tweets, TweetsView;
    Tweet = Backbone.Model.extend({});
    Tweets = Backbone.Collection.extend({
      model: Tweet,
      url: 'http://search.twitter.com/search.json?q=comorichweb&callback=?&rpp=20',
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
      }
    });
    TweetsView = Backbone.View.extend({
      el: $('#tweets'),
      events: {
        'click': 'pickRandom'
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
        return this.tweets.fetch();
      },
      pickRandom: function() {
        var tweet;
        tweet = this.tweets.selectRandom();
        return alert(tweet.get('from_user'));
      },
      render: function(tweet) {
        return $(this.el).append(tweet);
      }
    });
    return window.App = new TweetsView;
  });
}).call(this);
