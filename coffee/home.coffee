""" Home page. """

class HomePage
    
    constructor: (app, args, options) ->
        @self = new Element('div', options)
        Object.extend(@self, HomePage.prototype)
        @self.init(app, args)
        return @self
    
    init: (@app, @args) ->
        
        t = """
        <div id="home-page">
        <br />
        <span style="font-size: 34px;"> <b>OpenSCAD web-based editor</b></span><br />
        <p>
            View and edit your OpenSCAD models in your browser!
        </p>
        <span>
            <span class="error-message">
                error?!
            </span>
            <input id="search-term" type="text" style="width: 400px;" />
            <a href="#repositories" class="browse">browse &raquo;</a><br />
            <span style="font-size: smaller; color: #808080;">Enter a github repository URL in the box above.</span>
        </span>
        </div>
        """
        
        @insert new Template(t).evaluate({})
        
        @error = @select('.error-message')[0]
        @input = @select('#search-term')[0]
        
        @select('.browse')[0].observe 'click', (e) => @browse()
        @input.observe 'keyup', (e) => @keyup(e)
        
        @error.hide()
        @input.value = 'https://github.com/josefprusa/Prusa3/'
        
        return
    
    parse_repo_name: (url) ->
        
        url = url.match(/http[s]?:\/\/github\.com\/(.+)/i)
        return url[1] if url and url.length >= 2
        
        return
    
    keyup: (e) ->
        
        @error.hide()
        if e.keyCode == Event.KEY_RETURN
            @browse()
        
        return
    
    browse: () ->
        
        @github_url = @input.value
        @github_repo = @parse_repo_name(@github_url)
        
        if not @github_repo?
            console.log ['error parsing url:', @github_url]
            @error.update("I'm having trouble understanding this url, any chance there is a typo?<br />")
            @error.show()
            return
        
        current_url = document.location.href.match(/([^#]+)(#.*)?/)[1]
        document.location.href = current_url + '#github/' + @github_repo
        
        @app.navigate_to(GithubRepo, @github_repo)
        
        return
