import React, { Component, ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: any;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: any): State {
    return { hasError: true, error };
  }
  override render() {
    if (this.state.hasError) {
      return (
        <div style={{
          background: '#0A0A0A',
          color: '#00FF88',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'monospace',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{fontSize: '48px', marginBottom: '20px'}}>⚖️</div>
          <div style={{fontSize: '24px', letterSpacing: '4px', marginBottom: '16px'}}>
            VERDICT
          </div>
          <div style={{fontSize: '12px', color: '#888', letterSpacing: '2px'}}>
            SYSTEM INITIALIZING...
          </div>
          <div style={{
            marginTop: '20px',
            fontSize: '10px',
            color: '#333',
            maxWidth: '400px'
          }}>
            {this.state.error?.toString()}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
