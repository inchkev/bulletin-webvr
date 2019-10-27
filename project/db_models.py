from project import db

class Message(db.Model):
    __tablename__ = 'messages'
    id = db.Column(db.Integer, primary_key=True)
    mes_id = db.Column(db.Integer, nullable=False)
    content = db.Column(db.String(600), nullable=False)
    xrot = db.Column(db.Float, nullable=False)
    yrot = db.Column(db.Float, nullable=False)
    room_id = db.Column(db.Integer, nullable=False)

    def __repr__(self):
        return f"Message('{self.content}')"
