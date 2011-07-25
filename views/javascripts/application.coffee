Tweet = Backbone.Model.extend({});

Tweets = Backbone.Collection.extend
  model: Tweet
  url: 'http://search.twitter.com/search.json?q=comorichweb&callback=?'
  parse: (response)->
    response.results

tweets = new Tweets();

tweets.bind 'reset', (collection) ->
  console.log collection

tweets.fetch()

TweetView = Backbone.View.extend
  tagName:'li'
  render: ->
    $(@el).html(@template(@model.toJSON()))
    
