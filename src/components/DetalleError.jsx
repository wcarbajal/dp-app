import React from 'react';

export class DetalleError extends React.Component {
  constructor( props ) {
    super( props );
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError( error ) {
    return { hasError: true, error };
  }
  render() {
    if ( this.state.hasError ) {
      return <div>Error: { this.state.error.message }</div>;
    }
    return this.props.children;
  }
}