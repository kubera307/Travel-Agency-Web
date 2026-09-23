import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('React ErrorBoundary caught error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5] text-slate-900 p-6 font-sans">
          <div className="max-w-md w-full bg-white border border-stone-200 p-8 rounded-2xl shadow-xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-[#B68D40] flex items-center justify-center mx-auto text-xl font-bold">
              !
            </div>
            <h2 className="font-serif text-2xl font-bold text-slate-900">
              Something went wrong
            </h2>
            <p className="text-xs text-slate-500 font-light leading-relaxed">
              {this.state.error?.message || 'An unexpected rendering error occurred.'}
            </p>
            <button
              type="button"
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="inline-block bg-[#B68D40] hover:bg-[#a77f34] text-white text-xs font-semibold px-6 py-2.5 rounded-xl transition shadow-sm"
            >
              Clear Cache & Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

