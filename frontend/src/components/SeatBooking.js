import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { bookingAPI, maintenanceAPI } from '../services/api'; 
import '../styles/seatbooking.css';

// Floor 1 & 2: 6 tables of 4, 2 tables of 8 (40 seats)
const FLOOR_1_2_LAYOUT = [
  { id: 'T1', x: 20, y: 20, seats: 4, type: 'rect-4', label: 'T1' },
  { id: 'T2', x: 20, y: 50, seats: 4, type: 'rect-4', label: 'T2' },
  { id: 'T3', x: 20, y: 80, seats: 4, type: 'rect-4', label: 'T3' },
  { id: 'T4', x: 50, y: 30, seats: 8, type: 'rect-8', label: 'Big T4' },
  { id: 'T5', x: 50, y: 70, seats: 8, type: 'rect-8', label: 'Big T5' },
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

const SeatBooking = ({ bookingDate, timeSlot, partySize, onConfirm, onBack, embedded }) => {
  const [activeFloor, setActiveFloor] = useState(1);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [occupiedSeats, setOccupiedSeats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [maintenanceSeats, setMaintenanceSeats] = useState([]); // NEW


  const currentLayout = activeFloor === 3 ? FLOOR_3_LAYOUT : FLOOR_1_2_LAYOUT;

  useEffect(() => {
    fetchOccupiedSeats();
    fetchMaintenanceSeats();
    // eslint-disable-next-line
  }, [bookingDate, timeSlot]);

  const fetchOccupiedSeats = async () => {
    setLoading(true);
    try {
      const dateStr = bookingDate.toISOString().split('T')[0];
      
      // CALL BACKEND API
      const response = await bookingAPI.getOccupiedSeats(dateStr, timeSlot);
      if(response.data.success) {
          setOccupiedSeats(response.data.occupiedSeats);
      }
    } catch (error) {
      console.error("Failed to fetch seat status", error);
      toast.error("Could not refresh seat availability");
    } finally {
        setLoading(false);
    }
  };

  const fetchMaintenanceSeats = async () => {
    try {
      const response = await maintenanceAPI.getMaintenanceSeats();
      if (response.data.success) {
        setMaintenanceSeats(response.data.maintenanceSeats);
      }
    } catch (error) {
      console.error("Failed to fetch maintenance seats", error);
    }
  };

  const handleSeatClick = (tableId, seatIndex) => {
    const seatId = `${activeFloor}-${tableId}-S${seatIndex + 1}`;
    
    // Prevent selection of occupied OR maintenance seats
    if (occupiedSeats.includes(seatId) || maintenanceSeats.includes(seatId)) return;

    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(prev => prev.filter(id => id !== seatId));
    } else {
      if (selectedSeats.length >= partySize) {
        toast.warning(`You can only select ${partySize} seats for your party size.`);
        return;
      }
      setSelectedSeats(prev => [...prev, seatId]);
    }
  };

  const handleConfirmSelection = () => {
    if(selectedSeats.length !== partySize) {
        toast.warn(`Please select exactly ${partySize} seats.`);
        return;
    }
    onConfirm(selectedSeats);
  };

    const RectangularTable = ({ tableConfig, selectedSeats, occupiedSeats, maintenanceSeats, onSeatClick }) => {
    const { id, x, y, seats, label } = tableConfig;
    const isLarge = seats === 8;
    const tableWidth = isLarge ? 160 : 80;
    const tableHeight = 60;

    const renderSeatRow = (startIndex, count, position) => {
      return (
        <div className={`seat-row ${position}`}>
          {Array.from({ length: count }).map((_, i) => {
            const seatIndex = startIndex + i;
            const seatId = `${activeFloor}-${id}-S${seatIndex + 1}`;
            
            const isSelected = selectedSeats.includes(seatId);
            const isOccupied = occupiedSeats.includes(seatId);
            const isMaintenance = maintenanceSeats.includes(seatId); // NEW
            
            return (
              <div
                key={seatIndex}
                className={`seat-chair ${isSelected ? 'selected' : ''} ${isOccupied || isMaintenance ? 'occupied' : ''}`}
                onClick={() => onSeatClick(id, seatIndex)}
                title={isMaintenance ? "Under Maintenance" : isOccupied ? "Occupied" : `Seat ${seatIndex + 1}`}
                style={{
                  background: isMaintenance ? '#fed7d7' : undefined,
                  cursor: isMaintenance ? 'not-allowed' : undefined
                }}
              >
                {isMaintenance ? '🔧' : seatIndex + 1}
              </div>
            );
          })}
        </div>
      );
    };

    return (
      <div className="table-group" style={{ left: `${x}%`, top: `${y}%` }}>
        {renderSeatRow(0, seats / 2, 'top')}
        <div className="table-surface" style={{ width: `${tableWidth}px`, height: `${tableHeight}px` }}>
          {label}
        </div>
        {renderSeatRow(seats / 2, seats / 2, 'bottom')}
      </div>
    );
  };

  const StatusLegend = () => (
    <div className="seat-legend">
      <div className="legend-item">
        <div className="legend-box" style={{ background: 'white', borderColor: '#cbd5e0' }}></div>
        <span>Available</span>
      </div>
      <div className="legend-item">
        <div className="legend-box" style={{ background: '#48bb78', borderColor: '#2f855a' }}></div>
        <span>Selected</span>
      </div>
      <div className="legend-item">
        <div className="legend-box" style={{ background: '#edf2f7', borderColor: '#e2e8f0' }}></div>
        <span>Occupied</span>
      </div>
      <div className="legend-item">
        <div className="legend-box" style={{ background: '#fed7d7', borderColor: '#fc8181' }}>🔧</div>
        <span>Maintenance</span>
      </div>
    </div>
  );

  // Helper for windows
  const WindowWall = ({ side }) => (
    <div className={`window-indicator ${side}`}>
        <div className="window-glazing"></div>
        <span className="window-text">WINDOW VIEW</span>
        <div className="window-glazing"></div>
    </div>
  );

  return (
    <div className="seat-booking-wrapper" style={embedded ? {padding: '10px', minHeight: 'auto', paddingBottom: '20px'} : {}}>
      <div style={{display: 'flex', justifyContent: embedded ? 'center' : 'space-between', alignItems: 'center', maxWidth: '900px', margin: '0 auto 20px'}}>
        {!embedded && (
          <button onClick={onBack} className="btn-secondary" style={{padding: '8px 15px', borderRadius: '5px', cursor: 'pointer'}}>
              ← Back to Form
          </button>
        )}
        <div style={{textAlign: 'center'}}>
            <h2 style={{margin: 0,  color : '#070606' , fontSize: embedded ? '1.3rem' : '2rem'}}>Select {partySize} Seats</h2>
            <div style={{fontSize: '0.9rem', color:'#666'}}>{bookingDate.toDateString()} | {timeSlot}</div>
        </div>
        {!embedded && <div style={{width: '90px'}}></div>} {/* Spacer for alignment */}
      </div>

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

      <StatusLegend />

      <div className="cafeteria-layout" style={embedded ? {height: '450px', maxWidth: '800px'} : {}}>
        <div className="entrance-label">ENTRANCE</div>
        
        {/* NEW: Visual Window Indicators */}
        <WindowWall side="left" />
        <WindowWall side="right" />

        {loading && <div style={{position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', zIndex:10, background:'rgba(255,255,255,0.9)', padding:'20px', borderRadius:'10px'}}>Loading seats...</div>}
        
        {currentLayout.map((table) => (
          <RectangularTable 
            key={table.id}
            tableConfig={table}
            onSeatClick={handleSeatClick}
            selectedSeats={selectedSeats}
            occupiedSeats={occupiedSeats}
            maintenanceSeats={maintenanceSeats}
            />
        ))}
      </div>
      

      <div className="booking-actions">
        <div>
          <div style={{fontSize: '0.9rem', color: '#666'}}>Selected</div>
          <div style={{fontSize: '1.2rem', fontWeight: 'bold'}}>
             {selectedSeats.length} / {partySize} Seats
          </div>
        </div>
        <button 
            type="button"
            className="action-btn" 
            onClick={handleConfirmSelection}
            disabled={selectedSeats.length !== partySize}
            style={{opacity: selectedSeats.length !== partySize ? 0.5 : 1}}
        >
          Confirm Selection
        </button>
      </div>
    </div>
  );
};



export default SeatBooking;