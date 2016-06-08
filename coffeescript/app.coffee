console.log "main file here"

defaultTM = {
	alpha: ["1", "0", "B"],
	input: ["1", "0", "B"],
	states: 3,
	blank: "B",
	initial: 0,
	final: [2],
	transitions:
		{
			# state q0
			"0": {
				"1": {next: 1, move: "R", write: "B"},
				"0": {next: 0, move: "R", write: "B"},
				"B": {next: 2, move: "N", write: "B"}
			},
			# state q1
			"1": {
				"1": {next: 0, move: "R", write: "B"},
				"0": {next: 1, move: "R", write: "B"},
				"B": {next: 1, move: "R", write: "B"} 
			},
			# state q2
			"2": {
				"1": null,
				"0": null,
				"B": null
			}
		}
}


tm = new Turing.TuringMachine(defaultTM)
tm.reset "1001100111100101100101111011111110010001110010010010110011010000001000010101011101000110010110110011010111101110110111101010010101110011001111100101000000111010010000000101100010000110010011100001011000000101010001011010001001010101000100101010001000100110100010001000001101011001000101111001000011101111000001101100111011001111010010111000010100011101101000100101010110001101010000001001010000101101101011100011010011000011010111001111101100111101001010000001101100000101110100001010101010111111100010001101101010010011010000010011000000110100010110010000100011010000000100101011110001100011001101001010101000011001110100100010000001000011010011101000000001110111001110100010110110100111010111001001101011000110011110101000010001111101110001011001101010000000011101111010111000110111101011111011000011111001000000000110101111010100100101101010110011000111011011011000110110111011110111111000101000110101111000000010010000011101111011111001110100100111100011001101100111100111111010110111001001101001"
tm.work()

console.log "Accepts: " + tm.accept

# test parser
parser = new Parser.TableParser()
parser.getBasicConfig()
console.log parser


#======================
# create event handlers
click = (id, func) ->
	document.getElementById(id).addEventListener('click', func)


createTable = (e)->
	e.preventDefault()
	tm.buildHTML()

makeStep = (e) ->
	e.preventDefault()
	# simply let the tm make a step
	tm.step()

runTM = (e) ->
	e.preventDefault()
	# make all the moves, reuse makeStep
	tm.work()

# set the event handlers here
click("build-table", createTable)
click("run-button", runTM)
click("step-button", makeStep)
