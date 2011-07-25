(function() {
  var Tweet, Tweets, tweets;
  Tweet = Backbone.Model.extend({});
  Tweets = Backbone.Collection.extend({
    model: Tweet,
    url: 'http://search.twitter.com/search.json?q=comorichweb&callback=?',
    parse: function(response) {
      return response.results;
    }
  });
  tweets = new Tweets();
  tweets.bind('reset', function(collection) {
    return console.log(collection);
  });
  tweets.fetch();
}).call(this);
