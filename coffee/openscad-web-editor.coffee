""" The main application. """

Event.observe window, 'load', () ->
    o = new App()
    $('body').insert o

class App
    
    constructor: (options) ->
        @self = new Element('div', options)
        Object.extend(@self, App.prototype)
        @self.init()
        return @self
    
    init: () ->
        
        t = """
        <div style="margin: 0px;">
            <div id="menu">
                <a href="#" id="home">OpenSCAD-Editor</a>
                <a href="#about" id="about">about</a>
            </div>
            <div id="content">
                
            </div>
        </div>
        """
        
        @insert new Template(t).evaluate({})
        
        @select('#home')[0].observe 'click', (e) => @navigate_to(HomePage)
        @select('#about')[0].observe 'click', (e) => @navigate_to(AboutPage)
        
        [path, args] = @anchor_path()
        path = 'home' if not path? or path not in ['home', 'about', 'github']
        if path?
            @navigate_to(HomePage, args) if path == 'home'
            @navigate_to(AboutPage, args) if path == 'about'
            
            @navigate_to(GithubRepo, args) if path == 'github'
        
        @menu = @select('#menu')[0]
        @content = @select('#content')[0]
            
        Event.observe window, 'resize', (e) => @resized()
        
        @resized()
            
        return
    
    resized: (e) ->
    
        width = (document.viewport.getDimensions().width - 30)
        @content.setStyle { width: width + 'px' }
        @menu.setStyle { width: width + 'px' }
        
        return
    
    anchor_path: () ->
        
        path = document.location.href.match(/#([^\/]+)(\/(.+))?/i)
        return [path[1], path[3]] if path and path.length >= 4
        
        return [null, null]
    
    cleanup: () ->
        @select('#content')[0].update ''
    
    navigate_to: (ctor, args) ->
        
        @cleanup()
        
        @page = new ctor(@, args)
        @select('#content')[0].insert @page
        
        return
