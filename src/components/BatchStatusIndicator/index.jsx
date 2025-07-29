/**
 * Batch Status Indicator Component
 * Shows when questions were last updated and current batch status
 */

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getSystemStatus } from '../../services/firestoreService.js';

const StatusContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  padding: 12px 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  font-size: 12px;
  z-index: 1000;
  max-width: 280px;
  transition: all 0.3s ease;
  
  ${props => props.collapsed && `
    padding: 8px 12px;
    cursor: pointer;
  `}
  
  &:hover {
    box-shadow: 0 6px 25px rgba(0, 0, 0, 0.15);
  }
`;

const StatusHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${props => props.collapsed ? '0' : '8px'};
  cursor: pointer;
`;

const StatusIcon = styled.span`
  font-size: 14px;
  margin-right: 6px;
`;

const StatusTitle = styled.span`
  font-weight: 600;
  color: #333;
  font-size: 13px;
`;

const CollapseButton = styled.button`
  background: none;
  border: none;
  font-size: 12px;
  cursor: pointer;
  padding: 2px 4px;
  border-radius: 4px;
  opacity: 0.6;
  
  &:hover {
    opacity: 1;
    background: rgba(0, 0, 0, 0.05);
  }
`;

const StatusDetails = styled.div`
  display: ${props => props.collapsed ? 'none' : 'block'};
`;

const StatusRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
  color: #666;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const StatusLabel = styled.span`
  font-size: 11px;
  opacity: 0.8;
`;

const StatusValue = styled.span`
  font-size: 11px;
  font-weight: 500;
  color: #333;
`;

const HealthBadge = styled.span`
  display: inline-block;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  
  ${props => {
    switch(props.health) {
      case 'healthy':
        return 'background: #d4edda; color: #155724;';
      case 'warning':
        return 'background: #fff3cd; color: #856404;';
      case 'error':
        return 'background: #f8d7da; color: #721c24;';
      default:
        return 'background: #e2e3e5; color: #495057;';
    }
  }}
`;

const RefreshButton = styled.button`
  background: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 4px 8px;
  font-size: 10px;
  cursor: pointer;
  margin-top: 6px;
  width: 100%;
  
  &:hover {
    background: #0056b3;
  }
  
  &:disabled {
    background: #6c757d;
    cursor: not-allowed;
  }
`;

const BatchStatusIndicator = () => {
  const [status, setStatus] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const result = await getSystemStatus();
      setStatus(result.status);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error fetching system status:', error);
      setStatus({
        health: 'error',
        errors: ['Failed to fetch status']
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    
    // Refresh status every 5 minutes
    const interval = setInterval(fetchStatus, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const formatTime = (timestamp) => {
    if (!timestamp) return 'Never';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    if (diffHours >= 24) {
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}d ago`;
    } else if (diffHours >= 1) {
      return `${diffHours}h ago`;
    } else if (diffMinutes >= 1) {
      return `${diffMinutes}m ago`;
    } else {
      return 'Just now';
    }
  };

  const getHealthIcon = (health) => {
    switch(health) {
      case 'healthy': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      default: return '❓';
    }
  };

  if (loading && !status) {
    return (
      <StatusContainer collapsed={collapsed}>
        <StatusHeader collapsed={collapsed}>
          <div>
            <StatusIcon>⏳</StatusIcon>
            <StatusTitle>Loading...</StatusTitle>
          </div>
        </StatusHeader>
      </StatusContainer>
    );
  }

  return (
    <StatusContainer collapsed={collapsed}>
      <StatusHeader 
        collapsed={collapsed}
        onClick={() => setCollapsed(!collapsed)}
      >
        <div>
          <StatusIcon>{getHealthIcon(status?.health)}</StatusIcon>
          <StatusTitle>System Status</StatusTitle>
        </div>
        <CollapseButton onClick={(e) => {
          e.stopPropagation();
          setCollapsed(!collapsed);
        }}>
          {collapsed ? '▲' : '▼'}
        </CollapseButton>
      </StatusHeader>
      
      <StatusDetails collapsed={collapsed}>
        <StatusRow>
          <StatusLabel>Health:</StatusLabel>
          <HealthBadge health={status?.health}>
            {status?.health || 'unknown'}
          </HealthBadge>
        </StatusRow>
        
        {status?.currentBatch && (
          <>
            <StatusRow>
              <StatusLabel>Current Batch:</StatusLabel>
              <StatusValue>{status.currentBatch.id.slice(-8)}</StatusValue>
            </StatusRow>
            
            <StatusRow>
              <StatusLabel>Generated:</StatusLabel>
              <StatusValue>{formatTime(status.currentBatch.generatedAt)}</StatusValue>
            </StatusRow>
            
            <StatusRow>
              <StatusLabel>Questions:</StatusLabel>
              <StatusValue>{status.currentBatch.questionCount}</StatusValue>
            </StatusRow>
          </>
        )}
        
        {!status?.currentBatch && (
          <StatusRow>
            <StatusLabel>Status:</StatusLabel>
            <StatusValue style={{ color: '#856404' }}>No active batch</StatusValue>
          </StatusRow>
        )}
        
        <StatusRow>
          <StatusLabel>Total Questions:</StatusLabel>
          <StatusValue>{status?.database?.totalQuestions || 0}</StatusValue>
        </StatusRow>
        
        <StatusRow>
          <StatusLabel>Total Batches:</StatusLabel>
          <StatusValue>{status?.database?.totalBatches || 0}</StatusValue>
        </StatusRow>
        
        <StatusRow>
          <StatusLabel>Last Check:</StatusLabel>
          <StatusValue>{formatTime(lastUpdate)}</StatusValue>
        </StatusRow>
        
        {status?.warnings && status.warnings.length > 0 && (
          <StatusRow>
            <StatusLabel style={{ color: '#856404' }}>Warnings:</StatusLabel>
            <StatusValue style={{ color: '#856404' }}>
              {status.warnings.length}
            </StatusValue>
          </StatusRow>
        )}
        
        {status?.errors && status.errors.length > 0 && (
          <StatusRow>
            <StatusLabel style={{ color: '#721c24' }}>Errors:</StatusLabel>
            <StatusValue style={{ color: '#721c24' }}>
              {status.errors.length}
            </StatusValue>
          </StatusRow>
        )}
        
        <RefreshButton 
          onClick={fetchStatus}
          disabled={loading}
        >
          {loading ? 'Refreshing...' : 'Refresh Status'}
        </RefreshButton>
      </StatusDetails>
    </StatusContainer>
  );
};

export default BatchStatusIndicator; 