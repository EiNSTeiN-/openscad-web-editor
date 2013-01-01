""" A class encapsulating the editor and the THREE.js viewer """

class Editor
    
    constructor: (text, options) ->
        @self = new Element('div', options)
        Object.extend(@self, Editor.prototype)
        @self.init(text)
        return @self
    
    init: (@text) ->
    
        @text ?= ''
        
        t = """
        <div>
            <div id="editor-outside" style="float: left;">
                <div id="editor" style="width: 700px; height: 480px;"></div>
            </div>
            <div id="scene" style="float: left; width: 700px; height: 480px; border: 1px #808080 solid; margin: 4px;"></div>
        </div>
        """
        @insert new Template(t).evaluate({})
        @editor_div = @select('#editor')[0]
        @editor_outside = @select('#editor-outside')[0]
        @scene_div = @select('#scene')[0]
        
        @initeditor()
        
        @parser = new lexer.Parser()
        
        @scene_width = 700
        @height = 480
    
        @zoom = 20
        @zoom_speed = 5
        
        @move_theta = 45
        @move_phi = 60
        @radius = 1600
        
        @initrenderer()
        
        @scene = new THREE.Scene()
        @initcamera()
        @initlights()
        @initgrid()
        @initcontrols()
        
        @update()
        @animate()
        
        Event.observe window, 'resize', (e) => @resized()
        new PeriodicalExecuter((pe) =>
            if @editor_div.cumulativeOffset().top > 0
                @resized()
                pe.stop()
        , 1)
        
        return
    
    resized: (e) ->
        
        clientheight = window.innerHeight || document.body.clientHeight || document.documentElement.clientHeight
        @height = (clientheight - @editor_outside.viewportOffset().top - 20)
        
        @editor_width = 550
        @scene_width = (document.viewport.getDimensions().width - @editor_width - 40)
        
        @renderer.setSize(@scene_width, @height)
        @camera.aspect = @scene_width / @height
        
        @editor_outside.setStyle {width: @editor_width + 'px', height: @height + 'px'}
        @editor_div.setStyle {width: @editor_width + 'px', height: @height + 'px'}
        @scene_div.setStyle {width: @scene_width + 'px', height: @height + 'px'}
        
        @render()
        
        return
    
    initeditor: () ->
        
        @editor_div.update @text
        
        @editor = ace.edit(@editor_div)
        @editor.setTheme("ace/theme/dawn")
        @editor.getSession().setMode("ace/mode/scad")
        
        return
    
    initcontrols: () ->
        @select('#scene')[0].observe 'mousewheel', (e) => @mousewheel(e)
        
        @controls = new THREE.TrackballControls( @camera, @renderer.domElement )

        @controls.rotateSpeed = 1.0
        @controls.panSpeed = 0.2

        @controls.noZoom = false
        @controls.noPan = false

        @controls.staticMoving = true
        @controls.dynamicDampingFactor = 0.3
        
        @controls.keys = [ 65, 83, 68 ]
        return
    
    mousewheel: (e) ->
        
        @zoom += (if e.wheelDelta > 0 then -@zoom_speed else @zoom_speed)
        @camera.fov = @zoom
        @camera.updateProjectionMatrix()
        
        @render()
        
        return
    
    initcamera: () ->
        @view_angle = 10
        @aspect = @scene_width / @height
        @near = 1
        @far = 10000
        
        @camera = new THREE.PerspectiveCamera(@zoom, @aspect, @near, @far)
        @camera.position.y = -450;
        @camera.position.z = 400;
        
        @camera.lookAt(new THREE.Vector3(0, 0, 0));
        
        @scene.add(@camera)
        
        return
    
    initrenderer: () ->
    
        params = 
            clearColor: 0x00000000
            clearAlpha: 0
            antialias: true
        @renderer = new THREE.CanvasRenderer(params)
        @renderer.clear()
        @renderer.setSize(@scene_width, @height)
        @renderer.shadowMapEnabled = true
        @renderer.shadowMapAutoUpdate = true
        
        @select('#scene')[0].insert @renderer.domElement
        @select('#scene')[0].setStyle
            backgroundColor: '#ffffff'
        
        return
    
    initlights: () ->
        ambientLight = new THREE.AmbientLight( 0x404040 )
        @scene.add( ambientLight )

        directionalLight = new THREE.DirectionalLight( 0xffffff )
        directionalLight.position.x = 1
        directionalLight.position.y = 1
        directionalLight.position.z = 0.75
        directionalLight.position.normalize()
        @scene.add( directionalLight )

        directionalLight = new THREE.DirectionalLight( 0x808080 )
        directionalLight.position.x = - 1
        directionalLight.position.y = 1
        directionalLight.position.z = - 0.75
        directionalLight.position.normalize()
        @scene.add( directionalLight )
        
        return
    
    initgrid: () ->
        @grid_size = 200
        @grid_spacing = 10
        
        geometry = new THREE.Geometry()
        geometry.vertices.push( new THREE.Vector3( -@grid_size/2, 0, 0 ) )
        geometry.vertices.push( new THREE.Vector3( @grid_size/2, 0, 0 ) )

        material = new THREE.LineBasicMaterial( { color: 0x000000, opacity: 0.4 } )

        for i in [0..20]

            line = new THREE.Line( geometry, material )
            line.position.y = (i * @grid_spacing) - (@grid_size / 2)
            @scene.add( line )

            line = new THREE.Line( geometry, material )
            line.position.x = (i * @grid_spacing) - (@grid_size / 2)
            line.rotation.z = 90 * Math.PI / 180
            @scene.add( line )

        
        return
    
    animate: () ->
        #console.log ['animate...', @animate]
        requestAnimationFrame(() => @animate())
        @render()
        return
    
    render: () ->
        @controls.update()
        @renderer.render(@scene, @camera)
        return
    
    setValue: (text) -> @editor.setValue(text)
    getValue: () -> @editor.getValue()
    
    set_fetch_file_callback: (@fetch_file_callback) -> return
    
    include_callback: (name) ->
        content = @fetch_file_callback(name)
        
        console.log ['include file', name, 'size', content.length]
        
        tree = @parser.parse(content)
        return tree
    
    use_callback: (name) ->
        content = @fetch_file_callback(name)
        
        console.log ['use file', name, 'size', content.length]
        
        tree = @parser.parse(content)
        return tree
    
    update: () ->
        
        text = @getValue()
        console.log ['text length', text.length]
        
        return if text.length == 0
        
        try
            tree = @parser.parse(text)
            console.log ['tree', tree]
            evaluator = new OpenSCADEvaluator(tree)
            
            root_ctx = new Context()
            evaluator.register_builtins(root_ctx)
            
            if @fetch_file_callback?
                root_ctx.set 'include', (name) => return @include_callback(name)
                root_ctx.set 'use', (name) => return @use_callback(name)
            
            s = evaluator.evaluate(root_ctx)
            
            threerender = new THREERenderer(@scene)
            @geometry = threerender.render(s)
            console.log ['s', s]
        catch e
        
            console.log ['error while parsing.', e]
            console.log e.stack
            
            return
            
        console.log ['geometry', @geometry]
        
        params = 
            wireframe: false
            opacity: 0.7
            color: new THREE.Color(0xcc0000)
            vertexColors: new THREE.Color(0)
            wireframeLinewidth: 2
        
        material = new THREE.MeshBasicMaterial(params)
        @mesh = new THREE.Mesh(@geometry, material)
        
        @scene.add @mesh
        
        @render()
        
        return
