class Parser.TableParser
	constructor: ->
		@allStates = []
		@alpha = ""
		@blank = ""
		@inputs = []
		@initial = 0
		@final = []
		@transitions = {}
	
	getValue: (id) =>
		document.getElementById(id).getAttribute "value"
	
	getBasicConfig: =>
		@allStates = (@getValue("states") || "0, 1, 2").split(/\s*,\s*/)
		@alpha = (@getValue("alphabet") || "0, 1, B").split(/\s*,\s*/)
		@blank = @getValue("blank") || "B"
		@inputs = (@getValue("inputs") || "0, 1, B").split(/\s*,\s*/)
		@initial = @getValue("initial") || [0]
		@final = (@getValue("final") || "2").split(/\s*,\s*/)
		
		# now parse the table
		#first, get the left table
		inpSymbols = []
		inputsTable = document.getElementById("table-left").getElementsByTagName("tbody")[0].getElementsByTagName("tr")
		for row in inputsTable
			inpSymbols.push row.getElementsByTagName("td")[0].innerHTML
			
		table = document.getElementById("state-table")
		tbodyRows = table.getElementsByTagName("tbody")[0].getElementsByTagName("tr")
		theads = table.getElementsByTagName("thead")[0].getElementsByTagName("tr")[1].getElementsByTagName("th")
		stateNames = []
		for nameSpan in theads
			stateNames.push nameSpan.getElementsByTagName("div")[0].innerHTML
		
		# now we have the corresponding state Names
		# let's parse the transitions
		inp = 0
		state = 0
		for row in tbodyRows
			# assign to the right state and input
			currInp = inpSymbols[inp]
			temp = []
			# loop through the row
			#console.log row.getElementsByTagName("td")
			for col in row.getElementsByTagName("td")
				currState = stateNames[state]
				txt = col.getElementsByTagName("div")[0].innerHTML
				if not txt? or txt == null
					# write null transition
					toState = @transitions[currState] || {}
					toState[currInp] = null
					@transitions[currState] = toState
					continue
					
				txt = txt.split /\s*,\s*/
				console.log "txt: ", txt
				t = {next: txt[0], move: txt[1], write: txt[2]}
				temp.push t
				# update the state
				state = (state + 1) % stateNames.length
				# set the responding parsed data
				toState = @transitions[currState] || {}
				toState[currInp] = t
				@transitions[currState] = toState
			
			inp++
		console.log("transitions: ", @transitions)
		return @transitions
	
	
	buildHTML: ->
		console.log "parser builds table"