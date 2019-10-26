# Bulletin
![Bulletin VR](project/static/assets/blong_large.png)

## Inspiration
Social anxiety affects hundreds of thousands of people and can negatively impact social interaction and mental health. Around campus, we found bulletin boards with encouraging anonymous messages, and we felt that these anonymous bulletin boards were a viable approach to combat social anxiety. Previous studies have shown that people with social anxiety felt more comfortable with online interaction and that online interaction decreases social anxiety even more in people with high levels of social anxiety or depression. With these results, we decided that an online platform would enhance the capabilities of the aforementioned bulletin boards. Further, being online can add yet another layer of anonymity to encourage those struggling with social anxiety to contribute their voices. We also felt that creating a virtual reality platform for these bulletin boards can add interactivity and make communication feel more personal and realistic. 

## What is WebVR?
The advantages of a Web-based virtual reality (shortened to WebVR) application over a traditional system-dependent virtual reality application are its wide availability (as internet-connected devices are commonplace), elimination of any proprietary software or hardware, and its open-sourced nature. The code behind it is free to use and anyone can modify it, creating a continually updating landscape as developers add to and improve upon it. 
WebVR applications will allow for greater access and provide more value to users, may it be consumers experiencing virtual reality for the first time, researchers viewing a cell scaffold, industry designers reviewing a concept model, or medical students observing a surgical procedure. As such, we aimed to develop with WebVR specifically because of its accessibility and application possibilities.

## How it works
Our platform uses the A-Frame WebVR Framework to create VR scenes that can run in a browser environment. Every five seconds, the JavaScript script uses AJAX to make a request to the Flask-powered server. The server queries the database and returns the messages that the frontend should display. If a user submits their own message, the server checks the message to see if it is appropriate and then saves it to the database, replacing old elements if the current number of messages is above the capacity that we define.
## Installation
Installing everything is very simple. After cloning the Repo to your computer, enter the folder.

If you don't have `virtualenv` installed for Python, run
``` bash
pip install virtualenv
```

Make a virtual environment:
``` bash
python -m venv virt
```

To activate the environment, on Windows run:
``` bash
virt\Scripts\activate
```

And on Linux or Mac run:
``` bash
source virt/bin/activate
```

To install the necessary pip packages into the environment, run:
``` bash
pip install -r requirements.txt
```

Finally, to run the Python application, run:
``` bash
python application.py
```

Now you can go to `http://localhost:5000/` and use the application.
## Next steps
## Team Members
- Kevin Chen
- Mykyta Solonko
- Hamilton Wan
- Brandon Zhu

![B VR](project/static/assets/bulletin.png)
