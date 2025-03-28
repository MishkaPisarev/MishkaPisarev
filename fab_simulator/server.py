from flask import Flask, request, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///fab_simulator.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class Lot(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    lot_id = db.Column(db.String(50), unique=True, nullable=False)
    status = db.Column(db.String(20), default="idle")  # idle, processing, completed
    current_step = db.Column(db.String(50), default="")  # Current process step
    created_at = db.Column(db.DateTime, default=datetime.now)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/create_lot', methods=['POST'])
def create_lot():
    try:
        # Generate a unique lot ID
        timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
        lot_id = f'TG{timestamp}.1'
        
        # Create a new lot
        new_lot = Lot(
            lot_id=lot_id,
            status='idle',
            current_step='WET-CLEAN'
        )
        
        db.session.add(new_lot)
        db.session.commit()
        
        return jsonify({
            'lot_id': lot_id,
            'status': 'Lot created successfully'
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'error': str(e)
        }), 500

@app.route('/lot_details/<lot_id>', methods=['GET'])
def get_lot_details(lot_id):
    lot = Lot.query.filter_by(lot_id=lot_id).first()
    if lot:
        details = {
            'lot_id': lot.lot_id,
            'status': lot.status,
            'current_step': lot.current_step,
            'created_at': lot.created_at.strftime('%Y-%m-%d %H:%M:%S')
        }
        return jsonify(details)
    else:
        return jsonify({'error': 'Lot not found'}), 404

@app.route('/update_lot_status/<lot_id>', methods=['POST'])
def update_lot_status(lot_id):
    try:
        lot = Lot.query.filter_by(lot_id=lot_id).first()
        if lot:
            data = request.get_json()
            lot.status = data.get('status', lot.status)
            lot.current_step = data.get('current_step', lot.current_step)
            db.session.commit()
            return jsonify({'status': 'success'})
        else:
            return jsonify({'error': 'Lot not found'}), 404
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    with app.app_context():
        db.drop_all()  # Drop all tables
        db.create_all()  # Create new tables
    app.run(debug=True)

