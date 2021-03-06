Want to use this as basis for a new cli-app 'butler'.
Should be able to say 'butler {item}', which sends a Flock message to {username} based on template. 
Example template: "Hi, Can you get me {item}. Seat: {seat}"

Invocation:
* Alfred workflow that can call butler
* command line
* scheduled time every day with pre-specified {item}

Additional:
* butler list all requests
* butler cancel 

# flock-cli
Command line interface for flock messaging

----

Quick start
```
# Install flock-cli app from flock app store
# Note down the auth token recieved in mail
> export FLOCK_TOKEN <auth_token>

> npm install -g flock-cli

> flock
```
![Menu](https://dl.dropboxusercontent.com/u/98511276/flockathon/snip1.png)
![Menu](https://dl.dropboxusercontent.com/u/98511276/flockathon/snip2.png)

```
# One command usage

> flock -u "first_name last_name" -m "Hello"

> flock -g "group_name" -f file.txt

> flock -g "group_name" --image img.png

> flock -g "group_name" --flockml "<flockml><b>Hello</b></flockml>"

# Help

> flock --help
USAGE: node flock [OPTION1] [OPTION2]... arg1 arg2...
The following options are supported:
  -t, --token <ARG1> 	Specify the Flock API token.
  -m, --text <ARG1>  	Specify the text message you want to send
  -u, --to <ARG1>    	Specify the user you want to send the message to in format "first_name<space>last_name"
  -g, --group <ARG1> 	Specify the group you want to send the message to
  -f, --file <ARG1>  	Specify file path to upload
  --flockml <ARG1>   	Specify Flock Markup language
  --image <ARG1>     	Specify URL of the image

```
----
PS: In case you can't recall what a particular unix command does, this app also contains a bot (flock-cli Bot), which responds to unix commands with their man pages. 
