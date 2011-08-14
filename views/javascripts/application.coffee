$ ->
  class Tweet extends Backbone.Model

  class Tweets extends Backbone.Collection
    model: Tweet
    setURL: (search) -> 
      @url = "http://search.twitter.com/search.json?q=#{search}&callback=?&rpp=200"
      console.log @url
    parse: (response)->
      results = response.results
      _.values _.reduce(results, (a, b) ->
        a[b.from_user_id] = b
        a
      ,{})
    selectRandom: -> 
      toReturn = @at(@randomUpTo(@length))
      @remove toReturn
      toReturn

    randomUpTo: (ceiling) ->
      Math.floor(Math.random()*ceiling)

  class TweetView extends Backbone.View
    tagName:'li'
    template: _.template($('#tweet-template').html())
    initialize: ->
      @model.view = @
    render: ->
      $(@el).html(@template(@model.toJSON()))
      @
    active: ->
      $(@el).addClass 'active'

  class TweetsView extends Backbone.View
    el:$('#app')
    searchInput:$('#search')
    events: 
      'click #select':'pickRandom'
      'change #search':'getTweets'
    initialize: ->
      @tweets = new Tweets();
      @tweets.bind 'reset', (tweets) =>
        $("#tweets").empty()
        tweets.each (tweet) =>
          @render(new TweetView(model:tweet).render().el)
      @getTweets()
    getTweets: ->
      @tweets.setURL(@searchInput.val())
      @tweets.fetch()
    pickRandom: ->
      tweet = @tweets.selectRandom()
      tweet.view.active()
      console.log tweet
      @$('#winner').text(tweet.get('from_user'))

    render: (tweet) ->
      @$('#tweets').append tweet
      
  window.App = new TweetsView
        
        
