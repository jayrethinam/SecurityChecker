exec = require('child_process').exec
fs = require('fs')
util = require 'util'
linuxflavors = ["ubuntu","debian","centos",]

@ostype = 'unknown'
@osflavor = 'unknown'

execute = (command, callback)->
	exec command, (error, stdout, stderr) =>
		#util.log "execute - Error : " + error
		#util.log "execute - stdout : " + stdout
		#util.log "execute - stderr : " + stderr
		if error?
			return callback new Error "Execution failed"
		String stdOutput = stdout.toString() unless stdout is null
		String errOutput = stderr.toString() unless stderr is null
		callback null, stdOutput, errOutput 

checkflavor = (callback)->
	@ostype = require('os').type()
	if fs.existsSync('/etc/lsb-release') is true
		contents = fs.readFileSync('/etc/lsb-release','utf8')
		#console.log contents
		for val in linuxflavors
			@osflavor = val if contents.toLowerCase().indexOf(val.toLowerCase()) != -1
		console.log "OS: #{@ostype}, Flavor: #{@osflavor}"
		callback null

ubuntuSecurityCheck = (callback)->
	command = "/usr/lib/update-notifier/apt-check --human-readable"
	execute command, (error, output, erroutput)->
		if error instanceof Error
			return console.log "received Error while executing the command - ", command
		console.log "Execution success :  output is ", output
		console.log "Execution success :  Error print  is ",erroutput
		#Sample output
		#5 packages can be updated.
		#0 updates are security updates.
		#parsing the output
		tmparr = []
		tmparr = output.split "\n"
		for i in tmparr
			util.log "i value " + i
		pkgvars = tmparr[0].split(/[ ]+/)
		securitvars = tmparr[1].split(/[ ]+/)
		@result =
			"os" : ostype
			"flavor" : osflavor
			"PackagesTobeInstalled" :
				"TotalPackages" : pkgvars[0]
				"securityPackages" : securitvars[0]
		callback @result 



securityCheck = (callback)->
	checkflavor ()->

		return callback new Error "OS is not Linux... Security Check is supported only in Linux " unless ostype is "Linux"
		switch osflavor
			when "ubuntu"
				ubuntuSecurityCheck (result) =>
				callback result			
			else
				callback 
					OS: ostype
					flavor: osflavor
		#if ostype is "Linux" and osflavor is "ubuntu"
			
		#further flavors to be added

module.exports.securityCheck = securityCheck


	



