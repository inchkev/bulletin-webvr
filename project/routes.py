from flask import jsonify, request, render_template, url_for, flash, redirect
import numpy as np
from project import application, db
from project.db_models import Message
from profanity import profanity
from fuzzywuzzy import fuzz
from fuzzywuzzy import process
import json
from sqlalchemy import asc


MAX_MESSAGES = 5

# SERVING WEBPAGES
@application.route("/")
def index():
    return render_template("index.html")

@application.route("/rooms")
def rooms():
    return render_template("rooms.html")

@application.route("/wellness")
def wellness():
    return render_template("vr.html")

@application.route("/test")
def test():
    return render_template("test.html")


# SERVER-SIDE PROCESSING
@application.route("/getinput", methods = ['POST'])
def getinput():
    if request.method == 'POST':
        try:
            values = request.get_json()
            print(values)
            messages = process_messages(values)
            print(messages)
            (to_add, to_remove) = generate_return_lists(messages)

            '''for key in messages.keys():
                messages_in_db = Messages.query.filter_by(id=key).all()
                if len(messages_in_db) == 0:
                    to_remove.append(key)'''
            return jsonify({"toAdd":to_add, "toRemove": to_remove})
        except:
            return jsonify({"error":"error"})

#converts list of message objects into convenient dictionary (2D dictionary)
def messages_to_dict(messages):
    dic = {}
    for m in messages:
        d = {}
        d["data"] = m["data"]
        d["xrot"] = m["xrot"]
        d["yrot"] = m["yrot"]
        dic[m["id"]] = d
    return dic

@application.route("/submit", methods = ['POST'])
def submit():
    if request.method == 'POST':
        try:
            values = request.get_json()
            messages = process_messages(values["messages"])
            message_approved = is_bad_message(values["message"])
            if message_approved == False:
                new_id = get_available_id()
                #replaces oldest entry
                if new_id == False:
                    #gets minimum primary key (oldest message)
                    to_replace = Message.query.order_by(asc(Message.id)).first()
                    db.session.delete(to_replace)
                    new_message = Message(mes_id=to_replace.mes_id, content = values["message"], xrot=values["xrot"], yrot=values["yrot"])
                #just adds a new entry
                else:
                    new_message = Message(mes_id=new_id, content = values["message"], xrot=values["xrot"], yrot=values["yrot"])
                db.session.add(new_message)
                db.session.commit()
            (to_add, to_remove) = generate_return_lists(messages)
            return jsonify({"toAdd":to_add, "toRemove": to_remove, "approved": not message_approved})
        except:
            return jsonify({"error":"error"})

def get_available_id():
    messages = Message.query.with_entities(Message.mes_id).all()
    #makes list of used ids
    ids = [i[0] for i in messages]
    #if we have not used all of our allotted messages, just use the next ID (auto-increment basically)
    if len(ids) < MAX_MESSAGES:
        return len(ids) + 1
    for i in range(1, MAX_MESSAGES+1):
        if i not in ids:
            return i
    return False

# parses message JSON
def process_messages(m):
    messages = []
    for val in m:
        messages.append(json.loads(val))
    return messages_to_dict(messages)

# decides what needs to be added or updated
def generate_return_lists(messages):
    db_messages = Message.query.all();
    # arrays to return to the frontend
    to_remove = []
    to_add = []

    # checks if new messages were added or if contents changed
    for m in db_messages:
        #if we need to just add a message
        if m.mes_id not in messages:
            print(messages)
            print(m.mes_id)
            to_add.append({"id": m.mes_id, "data": m.content, "xrot": m.xrot, "yrot": m.yrot})
        else:
            # if an existing id has changed
            if m.content != messages[m.mes_id]["data"] or m.xrot != messages[m.mes_id]["xrot"] or m.yrot != messages[m.mes_id]["yrot"]:
                print("REMOVING")
                to_remove.append(m.mes_id)
                to_add.append({"id": m.mes_id, "data": m.content, "xrot": m.xrot, "yrot": m.yrot})
    return (to_add, to_remove)

# message approval
def is_bad_message(msg):
   if(profanity.contains_profanity(msg)):
       return True
   with open('phrases.json') as f:
       data = json.load(f)
   for phrase in data:
       for word in data[phrase]:
           ratio = fuzz.token_set_ratio(word,msg)
           if ratio > 60:
               return True
   return False