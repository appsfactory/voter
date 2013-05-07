# Voter App

## Server
### Users Management
* Admins
* Answerers

### Quizes
Created by Admins

Each questions has:
* arbitraty number of Questions
* allow users to change votes?
* settings
	* display graph on public screen
	* graph type (bar, pie, other?)
	* welcome message

#### Questions
Each question has:
* type
* text
* possible answers (editable button labels)

#### Question Types
True False or Multiple choice
(T/F is really just a subset of Multiple Choice,)

#### Public Screen
The public screen is intended to be displayed to the entire population, eg through a projector during a presentation. By default it shows:

* text of the current question
* the current percentage of people who voted for each answer, in a bar graph
* url for clients to load to participate

##### Introductory Screen
Before voting begins, this screen displays a welcome message, instructions and the url at which to vote

##### Intermediary Screen
Displayed when one question is closed but the next is yet to open. This displays a simple message and the participation url

##### Results Screen
TBD. Potentially: leaderboard or single winner, small versions of all charts, etc

## Client
The primary purpose of the client application is to display the questions to the participants and allow them to answer them. 

- anonymous authentication - at application launch a unique identifier for the handset is created and stored on the device. This identifier is used to access history, prevent duplicate votes, etc.
- “claim account” - allows users to association a name with thier account, potentially including a username/password setup for long-term access.
- receive win notification - if the administrator declares a user a winner the device displays the information for in-person fulfillment 
