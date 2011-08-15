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

    getRandom: -> @at(@randomUpTo(@length))
    removeRandom: -> 
      toReturn = @getRandom()
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
    deactive: ->
      $(@el).removeClass 'active'
    active: ->
      $(@el).addClass 'active'
  
  class TweetsView extends Backbone.View
    SELECTION_LENGTH: 5000
    RANDOM_SELECTION_INTERVAL: 100
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

    hilightRandom: =>
      if(@tweet)
        @tweet.view.deactive()
      @tweet = @tweets.getRandom()
      @tweet.view.active()
    selectWinner: =>
      clearInterval @interval
      @tweet.view.deactive()
      tweet = @tweets.removeRandom()
      tweet.view.active()
      @$('#winner').text tweet.get('from_user')

    pickRandom: ->
      @interval = setInterval @hilightRandom, @RANDOM_SELECTION_INTERVAL
      setTimeout @selectWinner, @SELECTION_LENGTH

    render: (tweet) ->
      @$('#tweets').append tweet
      
  window.App = new TweetsView
        
        
