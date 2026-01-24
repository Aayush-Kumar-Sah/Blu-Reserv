import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import './SeatBooking.css';

// Floor 1 & 2: 6 tables of 4, 2 tables of 8 (40 seats)
const FLOOR_1_2_LAYOUT = [
  // Left Column (4-seaters)
  { id: 'T1', x: 20, y: 20, seats: 4, type: 'rect-4', label: 'T1' },
  { id: 'T2', x: 20, y: 50, seats: 4, type: 'rect-4', label: 'T2' },
  { id: 'T3', x: 20, y: 80, seats: 4, type: 'rect-4', label: 'T3' },
  
  // Middle Column (8-seaters)
  { id: 'T4', x: 50, y: 30, seats: 8, type: 'rect-8', label: 'Big T4' },
  { id: 'T5', x: 50, y: 70, seats: 8, type: 'rect-8', label: 'Big T5' },

  // Right Column (4-seaters)
  { id: 'T6', x: 80, y: 20, seats: 4, type: 'rect-4', label: 'T6' },
  { id: 'T7', x: 80, y: 50, seats: 4, type: 'rect-4', label: 'T7' },
  { id: 'T8', x: 80, y: 80, seats: 4, type: 'rect-4', label: 'T8' },
];

// Floor 3: 5 tables of 4 (20 seats)
const FLOOR_3_LAYOUT = [
  { id: 'T1', x: 20, y: 30, seats: 4, type: 'rect-4', label: 'T1' },
  { id: 'T2', x: 80, y: 30, seats: 4, type: 'rect-4', label: 'T2' },
  { id: 'T3', x: 50, y: 50, seats: 4, type: 'rect-4', label: 'Center' },
  { id: 'T4', x: 30, y: 80, seats: 4, type: 'rect-4', label: 'T4' },
  { id: 'T5', x: 70, y: 80, seats: 4, type: 'rect-4', label: 'T5' },
];

const SeatBooking = ({ onBookingSuccess }) => {
  const [activeFloor, setActiveFloor] = useState(1);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [occupiedSeats, setOccupiedSeats] = useState([]);

  // Get layout based on active floor
  const currentLayout = activeFloor === 3 ? FLOOR_3_LAYOUT : FLOOR_1_2_LAYOUT;

  useEffect(() => {
    setSelectedSeats([]);
    // Mock occupied seats
    const mockOccupied = [`T3-S2`, `T3-S3`, `T1-S1`]; 
    setOccupiedSeats(mockOccupied);
  }, [activeFloor]);

  const handleSeatClick = (tableId, seatIndex) => {
    const seatId = `${tableId}-S${seatIndex + 1}`;
    if (occupiedSeats.includes(seatId)) return;

    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(prev => prev.filter(id => id !== seatId));
    } else {
      setSelectedSeats(prev => [...prev, seatId]);
    }
  };

  const handleConfirm = () => {
    if(selectedSeats.length === 0) return;
    toast.success(`Booked ${selectedSeats.length} seats on Floor ${activeFloor}!`);
    if(onBookingSuccess) onBookingSuccess();
  };

  return (
    <div className="seat-booking-wrapper">
      <h2 style={{ textAlign: 'center', marginBottom: '10px' }}>Select Seats</h2>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px' }}>
        Click on the chairs to select them
      </p>

      {/* Floor Tabs */}
      <div className="floor-selector">
        {[1, 2, 3].map(floor => (
          <button
            key={floor}
            className={`floor-btn ${activeFloor === floor ? 'active' : ''}`}
            onClick={() => setActiveFloor(floor)}
          >
            Floor {floor}
          </button>
        ))}
      </div>

      <div className="cafeteria-layout">
        <div className="entrance-label">ENTRANCE</div>
        {currentLayout.map((table) => (
          <RectangularTable 
            key={table.id}
            tableConfig={table}
            onSeatClick={handleSeatClick}
            selectedSeats={selectedSeats}
            occupiedSeats={occupiedSeats}
          />
        ))}
      </div>

      {/* Footer */}
      {selectedSeats.length > 0 && (
        <div className="booking-actions">
          <div>
            <div style={{fontSize: '0.9rem', color: '#666'}}>Total Price</div>
            <div style={{fontSize: '1.5rem', fontWeight: 'bold'}}>
              Free
              <span style={{fontSize: '0.8rem', fontWeight: 'normal'}}> ({selectedSeats.length} seats)</span>
            </div>
          </div>
          <button className="action-btn" onClick={handleConfirm}>
            Confirm Reservation
          </button>
        </div>
      )}
    </div>
  );
};

const RectangularTable = ({ tableConfig, selectedSeats, occupiedSeats, onSeatClick }) => {
    const { id, x, y, seats, label, type } = tableConfig;
    
    // Determine dimensions based on seat count
    // 4-seater: 2 top, 2 bottom
    // 8-seater: 4 top, 4 bottom
    const isLarge = seats === 8;
    const tableWidth = isLarge ? 160 : 80;
    const tableHeight = 60; 

    // Helper to render a row of seats
    const renderSeatRow = (startIndex, count, position) => {
        return (
            <div className={`seat-row ${position}`}>
                {Array.from({ length: count }).map((_, i) => {
                    const seatIndex = startIndex + i;
                    const seatId = `${id}-S${seatIndex + 1}`;
                    const isSelected = selectedSeats.includes(seatId);
                    const isOccupied = occupiedSeats.includes(seatId);
                    
                    return (
                        <div 
                            key={seatIndex}
                            className={`seat-chair ${isSelected ? 'selected' : ''} ${isOccupied ? 'occupied' : ''}`}
                            onClick={() => onSeatClick(id, seatIndex)}
                        >
                            {seatIndex + 1}
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
      <div 
        className="table-group"
        style={{
          left: `${x}%`,
          top: `${y}%`,
        }}
      >
        {/* Top Row Seats */}
        {renderSeatRow(0, seats / 2, 'top')}

        {/* The Table Surface */}
        <div 
            className="table-surface" 
            style={{ width: `${tableWidth}px`, height: `${tableHeight}px` }}
        >
          {label}
        </div>

        {/* Bottom Row Seats */}
        {renderSeatRow(seats / 2, seats / 2, 'bottom')}
      </div>
    );
};

export default SeatBooking;