""" Github repository browsing. """

class ListView
    
    constructor: (config, options) ->
        @self = new Element('div', options)
        Object.extend(@self, ListView.prototype)
        @self.init(config)
        return @self
    
    init: (@config) ->
        
        @config.columns ?= []
        @config.columns_width ?= [200 for i in [0..@config.columns]]
        
        @addClassName 'listview'
        
        @setStyle
            backgroundColor: '#E6F0E6'
            padding: '3px'
            'float': 'left'
        
        t = """
        <div class="headers-row" style="float: left; clear: both; border: 1px #4D944D solid;"></div>
        <div class="data-rows" style="float: left; clear: both;"></div>
        """
        @insert new Template(t).evaluate({})
        
        @headers = @select('.headers-row')[0]
        @rows = @select('.data-rows')[0]
        
        for col in [0..@config.columns.length-1]
            text = @config.columns[col]
            
            t = """
            <div class="header" style="float: left; padding: 6px; color: #003300; background-color: #CCE0CC; font-weight: bold;">#{text}</div>
            """
            @headers.insert new Template(t).evaluate({})
            
            @select('.header')[col].setStyle({width: @config.columns_width[col] + 'px'})
            
        
        return
    
    append_row: (data) ->
        
        if data.length != @config.columns.length
            console.log ['number of data elements does not match number of columns!', data]
            return
        
        row = @select('.row').length
        
        t = """
        <div class="row" style="float: left; clear: both; background-color: white; border-bottom: 1px #4D944D solid; border-left: 1px #4D944D solid; border-right: 1px #4D944D solid;"></div>
        """
        @rows.insert new Template(t).evaluate({})
        
        for col in [0..@config.columns.length-1]
            text = data[col]
            
            t = """
            <div class="cell" style="float: left; padding: 6px;">#{text}</div>
            """
            @select('.row')[row].insert new Template(t).evaluate({})
            cell = @select('.row')[row].select('.cell')[col]
            cell.setStyle { width: @config.columns_width[col] + 'px', height: '22px' }
        
        return @select('.row')[row]

""" This here is necessary because PrototypeJS stupidly sets headers that are rejected by the xmlhttprequest. """
GithubCompatibleAjaxRequest = Class.create(Ajax.Request, {
    setRequestHeaders: () ->
        headers =
          'Accept': 'text/javascript, text/html, application/xml, text/xml, */*'

        if @method == 'post'
            if @options.encoding?
                headers['Content-type'] = @options.contentType + '; charset=' + @options.encoding
            else
                headers['Content-type'] = @options.contentType

          # Force "Connection: close" for older Mozilla browsers to work
          # around a bug where XMLHttpRequest sends an incorrect
          #Content-length header. See Mozilla Bugzilla #246651.
          if (this.transport.overrideMimeType &&
              (navigator.userAgent.match(/Gecko\/(\d{4})/) || [0,2005])[1] < 2005)
                headers['Connection'] = 'close'
        

        if (typeof @options.requestHeaders == 'object')
          extras = @options.requestHeaders

          if (Object.isFunction(extras.push))
            for i in [0..extras.length-1] by 2
              headers[extras[i]] = extras[i+1]
          else
            $H(extras).each((pair) => headers[pair.key] = pair.value)

        for name in headers
          @transport.setRequestHeader(name, headers[name])
})

class GithubRepo
    
    constructor: (args, options) ->
        @self = new Element('div', options)
        Object.extend(@self, GithubRepo.prototype)
        @self.init(args)
        return @self
    
    parse_args: (args) ->
        
        args = args.substring(1) if args[0] == '/'
        args = args.substring(0, args.length-1) if args[args.length-1] == '/'
        
        @args = args.split('/')
        @user = @args[0]
        @repo = @args[1]

        if @args.length >= 4 and @args[2].toLowerCase() in ['tree', 'blob']
            @branch = @args[3]
            @type = @args[2].toLowerCase()
            if @args.length >= 5
                if @type == 'tree'
                    @path = @args[4..].join('/')
                    @filename = null
                else
                    @path = @args[4...@args.length-1].join('/')
                    @filename = @args[@args.length-1]
            else
                @path = ''
        else
            @branch = 'master'
            @path = ''
        
        return

    init: (args) ->
        
        @parse_args(args)
        
        if @type == 'blob'
            t = """
            <div id="github-openscad-editor">
                <span style="font-size: 22px;"><b>Github</b> &raquo; <span class="github-path"></span></span><br />
                <br />
                <div class="repo-editor" style="float: left; clear: both;"></div>
                <div class="waiting" style="float: left; clear: both; margin-top: 20px;"></div>
            </div>
            """
            @insert new Template(t).evaluate({})
            
            @location = @select('.github-path')[0]
            @editor_container = @select('.github-path')[0]
            @waiting = @select('.waiting')[0]
            
            @blobs = new Hash()
            @fetch_blob((data) => @fetch_blob_callback(data))
            
        else
            
            t = """
            <div id="github-repo">
                <br />
                <span style="font-size: 22px;"><b>Github</b> &raquo; <span class="github-path"></span></span><br />
                <br />
                <div class="repo-owner" style="float: left; clear: both;"></div>
                <div class="repo-files" style="float: left; clear: both;"></div><br />
                <div class="waiting" style="float: left; clear: both; margin-top: 20px;"></div>
            </div>
            """
            @insert new Template(t).evaluate({})
            
            @location = @select('.github-path')[0]
            @owner = @select('.repo-owner')[0]
            @files = @select('.repo-files')[0]
            @waiting = @select('.waiting')[0]
            
            @setStyle
                margin: 'auto'
                width: '800px'
            @fetch_repository((data) => @fetch_repository_callback(data))
        
        @show_path()
        
        return
    
    show_path: () ->
        
        @user_url = '#github/' + @user
        @repo_url = '#github/' + @user + '/' + @repo
        
        if @branch.toLowerCase() == 'master' and @path == ''
            @branch_url = @repo_url
        else
            @branch_url = '#github/' + @user + '/' + @repo + '/tree/' + @branch
        
        #path = '<a href="' + @user_url + '">' + @user + '</a>'
        path = @user
        path += ' &raquo; <a href="' + @repo_url + '">' + @repo + '</a>'
        path += ' &raquo; branch: <a href="' + @branch_url + '">' + @branch + '</a>'
        if @path != ''
            path += ' &raquo; tree: ' + @path
        if @type == 'blob' and @filename?
            path += ' &raquo; blob: ' + @filename
        @location.update path
        
        return
    
    fetch_blob: (cb) ->
        """ Perform an ajax request to github and fetches the contents of a blob. """
        
        path = if @path == '' then '' else '/' + @path
        url = 'https://api.github.com/repos/' + @user + '/' + @repo + '/contents' + path + '/' + @filename + '?ref=' + @branch
        new GithubCompatibleAjaxRequest url,
            method: 'get'
            evalJSON: true
            onSuccess: (response) => cb(response.responseJSON)
        
        return
    
    fetch_blob_callback: (data) ->
        
        @waiting.hide()
        
        @blob_data = data
        
        text = Base64.decode(data.content)
        
        @editor = new Editor('')
        @editor_container.insert @editor
        
        @editor.set_fetch_file_callback((name) => return @file_include_callback(name))
        
        @editor.setValue(text)
        @editor.update()
        
        return
    
    file_include_callback: (name) ->
        
        content = null
        
        console.log ['fetching file from github...', name]
        
        path = if @path == '' then '' else '/' + @path
        url = 'https://api.github.com/repos/' + @user + '/' + @repo + '/contents' + path + '/' + name + '?ref=' + @branch
        new GithubCompatibleAjaxRequest url,
            asynchronous: false
            method: 'get'
            evalJSON: true
            onSuccess: (response) => content = Base64.decode(response.responseJSON.content)
        
        return content
    
    fetch_repository: (cb) ->
        """ Perform an ajax request to github and fetches the information about a repository. """
        
        url = 'https://api.github.com/repos/' + @user + '/' + @repo
        
        new GithubCompatibleAjaxRequest url,
            method: 'get'
            evalJSON: true
            onSuccess: (response) => cb(response.responseJSON)
        
        return
    
    fetch_repository_callback: (data) ->
        
        @repo_data = data
        
        owner = data.owner.login
        avatar = data.owner.avatar_url
        created = data.created_at
        
        t = """
        <div style="float: left; background-color: #E6F0E6; padding: 3px; color: #003300;">
            <div style="float: left; border: 1px #4D944D solid; background-color: #CCE0CC; padding: 6px; width: 760px;">
                <div style="float: left; padding: 4px; padding-right: 10px;">
                    <img src="#{avatar}" />
                </div>
                <div style="float: left;">
                    <span style="font-size: larger; font-weight: bold;">Owner</span> #{owner}<br />
                    <span style="font-weight: bold;">Created on</span> #{created}<br />
                </div>
            </div>
        </div>
        """
        @owner.insert new Template(t).evaluate({})
        
        @fetch_contents((data) => @fetch_contents_callback(data))
        
        return
    
    fetch_contents: (cb) ->
        """ Perform an ajax request to github and fetches the files in the repository. """
        
        path = @path
        path += '/' + @filename if @type == 'blob' and @filename?
        url = 'https://api.github.com/repos/' + @user + '/' + @repo + '/contents/' + path + '?ref=' + @branch
        
        new GithubCompatibleAjaxRequest url,
            method: 'get'
            evalJSON: true
            onSuccess: (response) =>
                cb(response.responseJSON)
        
        
        return
    
    fetch_contents_callback: (response) ->
        
        @waiting.hide()
        
        @listview = new ListView
            columns: ['&nbsp;', 'Name', 'Size']
            columns_width: [24, 632, 80]
        
        @files.insert @listview
        
        for obj in response
            if obj.type == 'file' and obj.name.endsWith('.scad')
                path = @path + '/' + obj.name
                url = @user + '/' + @repo + '/blob/' + @branch + '/' + obj.path
                icon = '<div class="openscad-icon"></div>'
                name = '<a href="#github/' + url + '">' + obj.path + '</a>'
            else if obj.type == 'dir'
                path = @path + '/' + obj.name
                url = @user + '/' + @repo + '/tree/' + @branch + '/' + obj.path
                icon = '<div class="directory-icon"></div>'
                name = '<a href="#github/' + url + '">' + obj.path + '</a>'
            else
                icon = '<div class="file-icon"></div>'
                name = obj.name
            row = @listview.append_row [icon, name, if obj.size then obj.size else '-']
            
            if (obj.type == 'file' and obj.name.endsWith('.scad')) or obj.type == 'dir'
                row.url = url
                name_cell = row.select('.cell')[1]
                name_cell.setStyle
                    cursor: 'hand'
                name_cell.observe 'click', (e) => @browse_cell(e)
                name_cell.observe 'mouseover', (e) => 
                    e.findElement('.row').setStyle({backgroundColor: '#f0f0f0'})
                name_cell.observe 'mouseout', (e) => e.findElement('.row').setStyle({backgroundColor: '#ffffff'})
        
        return
    
    browse_cell: (e) ->
        row = e.findElement('.row')
        url = row.url
        
        document.location = '#github/' + url
        #@app.navigate_to(GithubRepo, )
        return
