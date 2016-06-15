class Turing.TuringMachine
	constructor: (config) ->
		@config = config # object
		@alpha = config.alpha # array
		@input = config.input # array
		@states = config.states # array
		@blank = config.blank # string
		@initial = config.initial # number or string
		@final = config.final # number
		@transitions = config.transitions # object
		@band = [] # array of input
		@currPos = 0 # default position
		@currState = @initial
		@halt = false
		@accept = false
		@directions =
			"R": 1,
			"L": -1,
			"N": 0


	# make able to reuse the tm
	setBand: (input) ->
		@band = input.split ""
		#@band.unshift @blank
		@band.push @blank

	reset: (input) ->
		@setBand input if input?
		@halt = false
		@accept = false
		@currPos = 0
		@currState = @initial

	# basic operations
	read: ->
		@band[@currPos]

	write: (w) ->
		@band[@currPos] = w

	move: (direction) ->
		# get the direction
		d = @directions[direction]
		d = 1 if d? # default is right
		@currPos += d

	# make transition
	step: =>
		# return if already completed
		if @halt
			console.log "Already completed"
			return @accepted
		# return if empty band
		return no if @band.length == 0
		# don't move outside the band
		if @currPos > @band.length
			@shouldHalt(null)
			return @accept

		# read the input
		r = @read()
		# get the transition object
		trans = @transitions[@currState][r]
		#console.log "found trans", trans
		# decide if need to halt
		@shouldHalt trans

		# make the move here
		if trans?
			@write trans.write
			@move trans.move
			@currState = trans.next
		# short ouput

	shouldHalt: (trans) ->
		#console.log "calling shouldHalt!"
		#console.log "trans? -> " + trans == undefined
		#console.log "is final: " + @currState in @final
		# if trans is null, then halt
		if trans == null || trans == undefined
			@halt = true
			@accept = @currState in @final
			#console.log "is final: " + @currState in @final
			return true
		return false

	# move until halt
	work: ->
		until @halt
			@step()

	formatTrans: (t) ->
		#t = @transitions[s][a]
		if t == null
			return "-"
		return t.next + ", " + t.move + ", " + t.write

	buildHTML: ->
		console.log "building html"
		# loop through each char from alphabet
		out = '<thead class="double-height">
				<th colspan="1">Input Symbols</th>
			</thead>
			<tbody>'

		tbl = '<thead>
			<tr>
				<th colspan="1000">States</th>
			</tr>
			<tr>'

		for s in @states
			tbl += "<th><div>" + s + "</div></th>"

		tbl += "</tr></thead><tbody>"

		for a in @alpha
			out += "<tr><td>" + a + "</td></tr>"
			# create new row in table
			tbl += "<tr>"
			for s in @states
				tbl += "<td><div contenteditable>" + @formatTrans(@transitions[s][a]) + "</div></td>"
			tbl += "</tr>"
		out += "</tbody>"
		tbl += "</tbody>"
		# change the left table in the DOM
		document.getElementById("table-left").innerHTML = out
		# change the larger table in the DOM
		document.getElementById("state-table").innerHTML = tbl
