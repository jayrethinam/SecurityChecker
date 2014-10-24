{@app} = require('zappajs') 15000, ->
    @configure =>
      @use 'bodyParser', 'methodOverride', @app.router, 'static'
      @set 'basepath': '/v1.0'

    @configure
      development: => @use errorHandler: {dumpExceptions: on, showStack: on}
      production: => @use 'errorHandler'

    @enable 'serve jquery', 'minify'
    
    util = require('util')
    security = require('./securitychecker')
    @get '/security/status': ->        
        security.securityCheck (res) =>
            util.log "GET Security Check result " + res        
            return @send res    
