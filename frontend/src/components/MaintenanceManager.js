import React, { useState, useEffect } from 'react';
import { maintenanceAPI } from '../services/api';
import { toast } from 'react-toastify';
import '../styles/seatbooking.css';

const FLOOR_1_2_LAYOUT = [
  { id: 'T1', x: 20, y: 20, seats: 4, label: 'T1' },
  { id: 'T2', x: 20, y: 50, seats: 4, label: 'T2' },
  { id: 'T3', x: 20, y: 80, seats: 4, label: 'T3' },
  { id: 'T4', x: 50, y: 30, seats: 8, label: 'Big T4' },
  { id: 'T5', x: 50, y: 70, seats: 8, label: 'Big T5' },
  { id: 'T6', x: 80, y: 20, seats: 4, label: 'T6' },
  { id: 'T7', x: 80, y: 50, seats: 4, label: 'T7' },
  { id: 'T8', x: 80, y: 80, seats: 4, label: 'T8' },
];

const FLOOR_3_LAYOUT = [
  { id: 'T1', x: 20, y: 30, seats: 4, label: 'T1' },
  { id: 'T2', x: 80, y: 30, seats: 4, label: 'T2' },
  { id: 'T3', x: 50, y: 50, seats: 4, label: 'Center' },
  { id: 'T4', x: 30, y: 80, seats: 4, label: 'T4' },
  { id: 'T5', x: 70, y: 80, seats: 4, label: 'T5' },
];

const MaintenanceManager = () => {
  const [activeFloor, setActiveFloor] = useState(1);
  const [maintenanceSeats, setMaintenanceSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState('Furniture issue');

  const manager = JSON.parse(localStorage.getItem('manager'));
  const currentLayout = activeFloor === 3 ? FLOOR_3_LAYOUT : FLOOR_1_2_LAYOUT;

  useEffect(() => {
    fetchMaintenanceSeats();
  }, []);

  const fetchMaintenanceSeats = async () => {
    try {
      const response = await maintenanceAPI.getMaintenanceSeats();
      setMaintenanceSeats(response.data.maintenanceSeats);
    } catch (error) {
      console.error('Error fetching maintenance seats:', error);
      toast.error('Failed to load maintenance seats');
    }
  };

  const handleSeatClick = (tableId, seatIndex) => {
    const seatId = `${activeFloor}-${tableId}-S${seatIndex + 1}`;
    
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(prev => prev.filter(id => id !== seatId));
    } else {
      setSelectedSeats(prev => [...prev, seatId]);
    }
  };

  const handleMarkMaintenance = async () => {
    if (selectedSeats.length === 0) {
      toast.warn('Please select at least one seat');
      return;
    }

    setLoading(true);
    try {
      const promises = selectedSeats.map(seatId =>
        maintenanceAPI.markSeatMaintenance({
          seatId,
          reason,
          markedBy: manager?.email || 'manager@restaurant.com'
        })
      );

      await Promise.all(promises);
      toast.success(`${selectedSeats.length} seat(s) marked for maintenance`);
      setSelectedSeats([]);
      fetchMaintenanceSeats();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to mark seats');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMaintenance = async () => {
    if (selectedSeats.length === 0) {
      toast.warn('Please select at least one seat');
      return;
    }

    setLoading(true);
    try {
      await maintenanceAPI.bulkRemoveMaintenance(selectedSeats);
      toast.success(`${selectedSeats.length} seat(s) removed from maintenance`);
      setSelectedSeats([]);
      fetchMaintenanceSeats();
    } catch (error) {
      toast.error('Failed to remove seats from maintenance');
    } finally {
      setLoading(false);
    }
  };

  const RectangularTable = ({ tableConfig }) => {
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
            const isMaintenance = maintenanceSeats.includes(seatId);
            
            return (
              <div
                key={seatIndex}
                className={`seat-chair ${isSelected ? 'selected' : ''} ${isMaintenance ? 'occupied' : ''}`}
                onClick={() => handleSeatClick(id, seatIndex)}
                title={isMaintenance ? 'Under Maintenance' : `Seat ${seatIndex + 1}`}
                style={{
                  cursor: 'pointer',
                  background: isMaintenance ? '#fed7d7' : isSelected ? '#48bb78' : 'white'
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

  return (
    <div className="container">
      <h2 style={{ color: '#667eea', marginBottom: '20px' }}>🔧 Seat Maintenance Manager</h2>

      <div style={{ background: '#f7fafc', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Reason (e.g., Furniture issue, Cleaning)"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            style={{ flex: 1, minWidth: '200px', padding: '10px', borderRadius: '5px', border: '1px solid #cbd5e0' }}
          />
          <button
            onClick={handleMarkMaintenance}
            disabled={loading || selectedSeats.length === 0}
            className="btn"
            style={{ background: '#ed8936', color: 'white' }}
          >
            🔧 Mark as Maintenance ({selectedSeats.length})
          </button>
          <button
            onClick={handleRemoveMaintenance}
            disabled={loading || selectedSeats.length === 0}
            className="btn"
            style={{ background: '#48bb78', color: 'white' }}
          >
            ✓ Remove from Maintenance ({selectedSeats.length})
          </button>
        </div>
      </div>

      <div className="floor-selector" style={{ marginBottom: '20px' }}>
        {[1, 2, 3].map(floor => (
          <button
            key={floor}
            className={`floor-btn ${activeFloor === floor ? 'active' : ''}`}
            onClick={() => {
              setActiveFloor(floor);
              setSelectedSeats([]);
            }}
          >
            Floor {floor}
          </button>
        ))}
      </div>

      <div className="seat-legend" style={{ marginBottom: '20px' }}>
        <div className="legend-item">
          <div className="legend-box" style={{ background: 'white', borderColor: '#cbd5e0' }}></div>
          <span>Available</span>
        </div>
        <div className="legend-item">
          <div className="legend-box" style={{ background: '#48bb78', borderColor: '#2f855a' }}></div>
          <span>Selected</span>
        </div>
        <div className="legend-item">
          <div className="legend-box" style={{ background: '#fed7d7', borderColor: '#fc8181' }}>🔧</div>
          <span>Under Maintenance</span>
        </div>
      </div>

      <div className="cafeteria-layout">
        <div className="entrance-label">ENTRANCE</div>
        {currentLayout.map((table) => (
          <RectangularTable key={table.id} tableConfig={table} />
        ))}
      </div>

      <div style={{ marginTop: '20px', textAlign: 'center', color: '#666' }}>
        <p>Currently {maintenanceSeats.length} seat(s) under maintenance</p>
      </div>
    </div>
  );
};

export default MaintenanceManager;