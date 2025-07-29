/**
 * Cost Monitoring Dashboard Component
 * Displays API usage and cost statistics
 */

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getCostStatistics, getApiLogs } from '../../services/apiLoggingService.js';

const DashboardContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  font-size: 14px;
  z-index: 2000;
  max-width: 800px;
  max-height: 80vh;
  overflow-y: auto;
  min-width: 600px;
  
  ${props => props.hidden && 'display: none;'}
`;

const DashboardHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid #e9ecef;
`;

const DashboardTitle = styled.h2`
  margin: 0;
  color: #333;
  font-size: 20px;
  font-weight: 600;
`;

const CloseButton = styled.button`
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 12px;
  margin-left: auto;
  
  &:hover {
    background: #c82333;
  }
`;

const TimeframeSelector = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
`;

const TimeframeButton = styled.button`
  background: ${props => props.active ? '#007bff' : '#f8f9fa'};
  color: ${props => props.active ? 'white' : '#495057'};
  border: 1px solid ${props => props.active ? '#007bff' : '#dee2e6'};
  border-radius: 6px;
  padding: 6px 12px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.active ? '#0056b3' : '#e9ecef'};
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

const StatCard = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 16px;
  border-radius: 12px;
  text-align: center;
  
  ${props => props.variant === 'success' && `
    background: linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%);
  `}
  
  ${props => props.variant === 'warning' && `
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  `}
  
  ${props => props.variant === 'info' && `
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  `}
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 4px;
`;

const StatLabel = styled.div`
  font-size: 12px;
  opacity: 0.9;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Section = styled.div`
  margin-bottom: 24px;
`;

const SectionTitle = styled.h3`
  margin: 0 0 12px 0;
  color: #333;
  font-size: 16px;
  font-weight: 600;
`;

const BreakdownGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
`;

const BreakdownCard = styled.div`
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 16px;
`;

const BreakdownTitle = styled.h4`
  margin: 0 0 12px 0;
  color: #495057;
  font-size: 14px;
  font-weight: 600;
`;

const BreakdownItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
  border-bottom: 1px solid #e9ecef;
  
  &:last-child {
    border-bottom: none;
  }
`;

const BreakdownLabel = styled.span`
  font-size: 12px;
  color: #666;
  text-transform: capitalize;
`;

const BreakdownValue = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: #333;
`;

const RecentCallsTable = styled.div`
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  overflow: hidden;
`;

const TableHeader = styled.div`
  background: #e9ecef;
  padding: 12px 16px;
  font-weight: 600;
  font-size: 12px;
  color: #495057;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 80px 80px 100px 80px;
  gap: 12px;
  padding: 10px 16px;
  border-bottom: 1px solid #e9ecef;
  font-size: 11px;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:nth-child(even) {
    background: rgba(0, 0, 0, 0.02);
  }
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 9px;
  font-weight: 600;
  text-transform: uppercase;
  
  ${props => props.success ? `
    background: #d4edda;
    color: #155724;
  ` : `
    background: #f8d7da;
    color: #721c24;
  `}
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
`;

const ErrorMessage = styled.div`
  background: #f8d7da;
  color: #721c24;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 12px;
`;

const CostMonitoringDashboard = ({ isVisible, onClose }) => {
  const [stats, setStats] = useState(null);
  const [recentCalls, setRecentCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState('all');

  const timeframes = [
    { key: 'today', label: 'Today' },
    { key: 'week', label: 'This Week' },
    { key: 'month', label: 'This Month' },
    { key: 'all', label: 'All Time' }
  ];

  const fetchData = async (timeframe) => {
    try {
      setLoading(true);
      setError(null);
      
      const [statsResult, logsResult] = await Promise.all([
        getCostStatistics(timeframe),
        getApiLogs({ limit: 10 })
      ]);
      
      if (!statsResult.success) {
        throw new Error(statsResult.error || 'Failed to fetch statistics');
      }
      
      setStats(statsResult.stats);
      setRecentCalls(logsResult.success ? logsResult.logs : []);
      
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isVisible) {
      fetchData(selectedTimeframe);
    }
  }, [isVisible, selectedTimeframe]);

  const formatCurrency = (amount) => {
    return `$${(amount || 0).toFixed(4)}`;
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  if (!isVisible) return null;

  return (
    <DashboardContainer>
      <DashboardHeader>
        <DashboardTitle>💰 Cost Monitoring Dashboard</DashboardTitle>
        <CloseButton onClick={onClose}>Close</CloseButton>
      </DashboardHeader>

      <TimeframeSelector>
        {timeframes.map(timeframe => (
          <TimeframeButton
            key={timeframe.key}
            active={selectedTimeframe === timeframe.key}
            onClick={() => setSelectedTimeframe(timeframe.key)}
          >
            {timeframe.label}
          </TimeframeButton>
        ))}
      </TimeframeSelector>

      {error && (
        <ErrorMessage>
          ❌ Error: {error}
        </ErrorMessage>
      )}

      {loading ? (
        <LoadingSpinner>
          ⏳ Loading dashboard data...
        </LoadingSpinner>
      ) : stats ? (
        <>
          <StatsGrid>
            <StatCard>
              <StatValue>{formatCurrency(stats.totalCost)}</StatValue>
              <StatLabel>Total Cost</StatLabel>
            </StatCard>
            
            <StatCard variant="info">
              <StatValue>{stats.totalCalls}</StatValue>
              <StatLabel>Total API Calls</StatLabel>
            </StatCard>
            
            <StatCard variant="success">
              <StatValue>{stats.successfulCalls}</StatValue>
              <StatLabel>Successful Calls</StatLabel>
            </StatCard>
            
            <StatCard variant="warning">
              <StatValue>{stats.failedCalls}</StatValue>
              <StatLabel>Failed Calls</StatLabel>
            </StatCard>
            
            <StatCard variant="info">
              <StatValue>{formatCurrency(stats.averageCostPerCall)}</StatValue>
              <StatLabel>Avg Cost/Call</StatLabel>
            </StatCard>
            
            <StatCard>
              <StatValue>{Math.round(stats.averageTokensPerCall)}</StatValue>
              <StatLabel>Avg Tokens/Call</StatLabel>
            </StatCard>
          </StatsGrid>

          <BreakdownGrid>
            <BreakdownCard>
              <BreakdownTitle>📊 By Provider</BreakdownTitle>
              {Object.entries(stats.providerStats).map(([provider, data]) => (
                <BreakdownItem key={provider}>
                  <BreakdownLabel>{provider}</BreakdownLabel>
                  <BreakdownValue>
                    {data.calls} calls • {formatCurrency(data.cost)}
                  </BreakdownValue>
                </BreakdownItem>
              ))}
            </BreakdownCard>

            <BreakdownCard>
              <BreakdownTitle>🤖 By Model</BreakdownTitle>
              {Object.entries(stats.modelStats).map(([model, data]) => (
                <BreakdownItem key={model}>
                  <BreakdownLabel>{model}</BreakdownLabel>
                  <BreakdownValue>
                    {data.calls} calls • {formatCurrency(data.cost)}
                  </BreakdownValue>
                </BreakdownItem>
              ))}
            </BreakdownCard>

            <BreakdownCard>
              <BreakdownTitle>🎯 By Purpose</BreakdownTitle>
              {Object.entries(stats.purposeStats).map(([purpose, data]) => (
                <BreakdownItem key={purpose}>
                  <BreakdownLabel>{purpose}</BreakdownLabel>
                  <BreakdownValue>
                    {data.calls} calls • {formatCurrency(data.cost)}
                  </BreakdownValue>
                </BreakdownItem>
              ))}
            </BreakdownCard>
          </BreakdownGrid>

          <Section>
            <SectionTitle>📋 Recent API Calls</SectionTitle>
            <RecentCallsTable>
              <TableHeader>Recent API Activity</TableHeader>
              {recentCalls.map(call => (
                <TableRow key={call.id}>
                  <div>
                    <strong>{call.provider}</strong> • {call.model}
                    <br />
                    <span style={{ fontSize: '10px', color: '#666' }}>
                      {formatTimestamp(call.timestamp)}
                    </span>
                  </div>
                  <div>{call.tokensUsed || 0}</div>
                  <div>{formatCurrency(call.estimatedCost)}</div>
                  <div>{call.purpose}</div>
                  <div>
                    <StatusBadge success={call.success}>
                      {call.success ? 'Success' : 'Failed'}
                    </StatusBadge>
                  </div>
                </TableRow>
              ))}
              
              {recentCalls.length === 0 && (
                <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                  No recent API calls found
                </div>
              )}
            </RecentCallsTable>
          </Section>
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          No data available
        </div>
      )}
    </DashboardContainer>
  );
};

export default CostMonitoringDashboard; 