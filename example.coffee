class Person
  constructor: (@name) ->
  greet: ->
    "Hello #{@name}"

  



dude = new Person('Lebowski')

# console.log(dude.greet())

foo = (first, others...=[1,2], last=10) ->
  console.log first
  console.log others
  console.log last

foo(1)
