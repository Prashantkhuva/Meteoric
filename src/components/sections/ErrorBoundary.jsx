"use client";

import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("[ErrorBoundary]", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center px-6">
          <div className="text-center max-w-md">
            <p className="text-[var(--text-muted)] text-[6rem] font-bold leading-none mb-4 select-none">
              !
            </p>
            <h1 className="text-2xl font-semibold text-[var(--text-primary)] mb-3">
              Something went wrong
            </h1>
            <p className="text-[var(--text-muted)] text-sm leading-relaxed mb-8">
              An unexpected error occurred. Please try refreshing the page.
            </p>
            <button
              data-no-magnetic
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--accent)] text-[var(--accent-text)] text-sm font-semibold hover:opacity-90 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
