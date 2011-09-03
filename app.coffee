express = require 'express'
stylus = require 'stylus'
app = module.exports = express.createServer()

app.configure ->
  publicDir = "#{__dirname}/public"
  viewsDir  = "#{__dirname}/views"
  coffeeDir = "#{viewsDir}/coffeescript"

  app.set "views", viewsDir
  app.set "view engine", "jade"
  app.use app.router
  app.use express.compiler(
    src: viewsDir, 
    dest: publicDir, 
    enable: ['coffeescript'])
  app.use(stylus.middleware debug: true, src: viewsDir, dest: publicDir, compile: compileMethod)
  app.use express.static(publicDir)



compileMethod = (str, path) ->
  stylus(str)
    .set('filename', path)
    .set('compress', true)


app.get "/", (req, res) ->
  res.render "index", title: "Twitter Raffle", subtitle: "By <a href='http://comorichweb.posterous.com/'>Como Rich Web</a>"

app.get '/disqualified', (req, res) ->
  # load disqualified users from yaml file
  fs = require 'fs'
  yaml = require 'yaml'
  fs.readFile 'config/settings.yml', (err, data) ->
    contents = data.toString('utf-8')
    res.json(yaml.eval(contents))

app.listen 3000
console.log "Express server listening on port %d in %s mode", app.address().port, app.settings.env
