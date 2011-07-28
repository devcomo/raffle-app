$ ->
  Tweet = Backbone.Model.extend({});

  Tweets = Backbone.Collection.extend
    model: Tweet
    url: 'http://search.twitter.com/search.json?q=comorichweb&callback=?&rpp=200'
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

  TweetView = Backbone.View.extend
    tagName:'li'
    template: _.template($('#tweet-template').html())
    initialize: ->
      @model.view = @
    render: ->
      $(@el).html(@template(@model.toJSON()))
      @
    active: ->
      $(@el).addClass 'active'

  TweetsView = Backbone.View.extend
    el:$('#app')
    events: 
      'click #select':'pickRandom'
    initialize: ->
      @tweets = new Tweets();
      @tweets.bind 'reset', (tweets) =>
        tweets.each (tweet) =>
          @render(new TweetView(model:tweet).render().el)
      @tweets.fetch()
    pickRandom: ->
      tweet = @tweets.selectRandom()
      tweet.view.active()

    render: (tweet) ->
      @$('#tweets').append tweet
      
  window.App = new TweetsView
        
        
