""" About page. """

class AboutPage
    
    constructor: (args, options) ->
        @self = new Element('div', options)
        Object.extend(@self, AboutPage.prototype)
        @self.init(args)
        return @self
    
    init: (@args) ->
        
        t = """
        <div id="home-page">
        <br />
        <span style="font-size: 34px;"> <b>About...</b></span><br />
        <p>
            This is a small project involving OpenSCAD, Github and 3D printing.<br />
            <br />
            Github repository @ <a href="https://github.com/EiNSTeiN-/openscad-web-editor">https://github.com/EiNSTeiN-/openscad-web-editor</a>
        </p>
        </div>
        """
        
        @insert new Template(t).evaluate({})
        
        return
