import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'uikit/dist/css/uikit.min.css';
import styles from '../styles/yootheme-styles.json';

const UIWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    const loadUIkit = async () => {
      const UIkit = (await import('uikit')).default;
      const Icons = (await import('uikit/dist/js/uikit-icons')).default;
      UIkit.use(Icons);

      // Apply custom styles
      const root = document.documentElement;
      const { theme } = styles;

      // Apply base colors
      Object.entries(theme.colors).forEach(([key, value]) => {
        root.style.setProperty(`--${key}-color`, value as string);
      });

      // Apply component styles
      document.body.style.backgroundColor = theme.colors.background;
      document.body.style.color = theme.colors.text;

      // Custom CSS for dark theme
      const style = document.createElement('style');
      style.textContent = `
        :root {
          --theme-background: ${theme.colors.background};
          --theme-surface: ${theme.cards.default.backgroundColor};
          --theme-border: ${theme.colors.border};
          --theme-text: ${theme.colors.text};
          --theme-primary: ${theme.colors.primary};
          --theme-text-secondary: ${theme.colors.textSecondary};
        }

        body {
          background-color: var(--theme-background) !important;
          color: var(--theme-text) !important;
        }

        /* Card Styles */
        .uk-card,
        .uk-card-default,
        .uk-card.uk-card-default {
          background-color: var(--theme-surface) !important;
          border-radius: ${theme.cards.default.borderRadius} !important;
          box-shadow: ${theme.cards.default.boxShadow} !important;
          border: ${theme.cards.default.border} !important;
        }

        .uk-card-body {
          background-color: var(--theme-surface) !important;
        }

        /* Button Styles */
        .uk-button {
          border-radius: ${theme.buttons.default.borderRadius} !important;
          height: 44px !important;
          line-height: 42px !important;
          font-weight: 500 !important;
          text-transform: none !important;
          transition: all 0.2s ease !important;
          padding: 0 16px !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          width: 100% !important;
          font-size: 14px !important;
        }

        .uk-button [uk-icon] {
          width: 20px !important;
          height: 20px !important;
          margin-right: 8px !important;
          line-height: inherit !important;
        }

        .uk-button-default {
          background-color: ${theme.buttons.default.backgroundColor} !important;
          color: ${theme.colors.text} !important;
          border: 1px solid ${theme.colors.border} !important;
        }

        .uk-button-default:hover {
          background-color: ${theme.buttons.default.hover.backgroundColor} !important;
          border-color: ${theme.colors.primary} !important;
        }

        .uk-button-primary {
          background-color: ${theme.colors.primary} !important;
          color: #000000 !important;
          border: none !important;
        }

        .uk-button-primary:hover {
          background-color: ${theme.buttons.primary.hover.backgroundColor} !important;
          transform: translateY(-1px) !important;
        }

        .uk-button-primary:disabled {
          background-color: ${theme.colors.secondary}88 !important;
          color: ${theme.colors.text}88 !important;
          cursor: not-allowed !important;
          transform: none !important;
        }

        .uk-button-danger {
          background-color: ${theme.colors.danger} !important;
          color: #FFFFFF !important;
          border: none !important;
        }

        .uk-button-danger:hover {
          background-color: ${theme.colors.danger}DD !important;
          transform: translateY(-1px) !important;
        }

        /* Form Styles */
        .uk-form-label {
          color: var(--theme-text) !important;
          font-weight: 500 !important;
        }

        .uk-input,
        .uk-select,
        .uk-textarea {
          background-color: ${theme.forms.input.backgroundColor} !important;
          border: 1px solid ${theme.forms.input.borderColor} !important;
          color: ${theme.forms.input.color} !important;
          border-radius: ${theme.forms.input.borderRadius} !important;
          height: ${theme.forms.input.height} !important;
          line-height: ${theme.forms.input.lineHeight} !important;
        }

        .uk-input:focus,
        .uk-select:focus,
        .uk-textarea:focus {
          background-color: ${theme.forms.input.backgroundColor} !important;
          border-color: ${theme.forms.input.focus.borderColor} !important;
          box-shadow: ${theme.forms.input.focus.boxShadow} !important;
        }

        .uk-select {
          color: ${theme.colors.text} !important;
        }

        .uk-select option {
          background-color: ${theme.forms.input.backgroundColor} !important;
          color: ${theme.colors.text} !important;
        }

        /* Range Input */
        .uk-range {
          height: ${theme.forms.range.height} !important;
          -webkit-appearance: none;
          background: transparent;
        }

        .uk-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          background: ${theme.forms.range.thumbColor} !important;
          height: ${theme.forms.range.thumbSize} !important;
          width: ${theme.forms.range.thumbSize} !important;
          border-radius: 50%;
          cursor: pointer;
          margin-top: -6px;
        }

        .uk-range::-webkit-slider-runnable-track {
          background: ${theme.forms.range.trackColor} !important;
          height: ${theme.forms.range.height} !important;
          border-radius: 2px;
        }

        /* Progress Bar */
        .uk-progress {
          background-color: var(--theme-background) !important;
          border: 1px solid var(--theme-border) !important;
          height: 15px !important;
          border-radius: 8px !important;
        }

        .uk-progress::-webkit-progress-bar {
          background-color: var(--theme-background) !important;
          border-radius: 8px !important;
        }

        .uk-progress::-webkit-progress-value {
          background-color: var(--theme-primary) !important;
          border-radius: 8px !important;
        }

        /* Text Colors */
        .uk-text-muted,
        .uk-text-meta {
          color: var(--theme-text-secondary) !important;
        }

        .uk-card-title {
          color: var(--theme-text) !important;
          font-weight: 500 !important;
        }

        /* Slider Container */
        .uk-slider-container {
          background-color: var(--theme-surface) !important;
        }

        /* Debug Area */
        .uk-background-muted {
          background-color: var(--theme-background) !important;
          color: var(--theme-text) !important;
        }

        /* Icons */
        [uk-icon] {
          color: currentColor !important;
        }

        /* Navbar Styles */
        .uk-navbar-container {
          background-color: ${theme.colors.background} !important;
        }

        .uk-navbar-container:not(.uk-navbar-transparent) {
          background-color: ${theme.colors.background} !important;
        }

        .uk-navbar-dropdown {
          background-color: ${theme.colors.background} !important;
          border: 1px solid ${theme.colors.border} !important;
          padding: 15px !important;
        }

        .uk-navbar-dropdown-nav > li > a {
          color: ${theme.colors.text} !important;
          padding: 8px 12px !important;
          border-radius: 4px !important;
          transition: background-color 0.2s !important;
        }

        .uk-navbar-dropdown-nav > li > a:hover {
          background-color: ${theme.colors.primary}22 !important;
          color: ${theme.colors.primary} !important;
        }

        .uk-navbar-nav > li > a {
          color: ${theme.colors.text} !important;
          transition: color 0.2s !important;
          min-height: 60px !important;
        }

        .uk-navbar-nav > li > a:hover {
          color: ${theme.colors.primary} !important;
        }

        .uk-navbar-nav > li.uk-active > a {
          color: ${theme.colors.primary} !important;
        }

        /* Icon styles in navbar */
        .uk-navbar-nav [uk-icon] {
          color: currentColor !important;
        }

        /* Card Styles */
        .uk-card {
          background-color: ${theme.colors.background} !important;
          border: 1px solid ${theme.colors.border} !important;
          border-radius: 8px !important;
          transition: all 0.2s ease !important;
        }

        .uk-card-hover:hover {
          transform: translateY(-2px) !important;
          border-color: ${theme.colors.primary} !important;
          box-shadow: 0 10px 20px rgba(0,0,0,0.2) !important;
        }

        .uk-card-body {
          padding: 30px !important;
        }

        .uk-card-title {
          color: ${theme.colors.text} !important;
          font-size: 1.2rem !important;
          font-weight: 500 !important;
          margin: 0 !important;
        }

        /* Container Styles */
        .uk-container-expand {
          padding-left: 20px !important;
          padding-right: 20px !important;
        }

        /* Grid Styles */
        .uk-grid {
          margin-left: -20px !important;
        }

        .uk-grid > * {
          padding-left: 20px !important;
        }

        /* Make sure the grid fills the height */
        .uk-grid-match > div > .uk-card {
          height: 100% !important;
        }

        /* Dashboard Card Hover Effects */
        .dashboard-card {
          transform-style: preserve-3d !important;
          perspective: 1000px !important;
        }

        .dashboard-card:hover {
          transform: translateY(-5px) scale(1.02) !important;
        }

        .dashboard-card:hover .uk-card-body {
          border-color: var(--color-primary) !important;
          box-shadow: 0 15px 30px rgba(0,0,0,0.3) !important;
        }

        .dashboard-card:hover .card-background {
          opacity: 0.15 !important;
        }

        .dashboard-card:hover .icon-container {
          transform: translateY(-5px) !important;
        }

        .dashboard-card:hover .uk-card-title {
          transform: translateY(2px) !important;
          color: var(--color-primary) !important;
        }

        .dashboard-card .uk-card-body {
          will-change: transform, box-shadow !important;
        }

        .dashboard-card .icon-container,
        .dashboard-card .uk-card-title {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }

        /* Fancy hover animation for FontAwesome icons */
        .dashboard-card:hover .svg-inline--fa {
          transform: scale(1.1) !important;
          filter: drop-shadow(0 0 8px var(--color-primary)) !important;
        }

        /* Add subtle pulse animation on hover */
        @keyframes cardPulse {
          0% { box-shadow: 0 0 0 0 rgba(var(--color-primary-rgb), 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(var(--color-primary-rgb), 0); }
          100% { box-shadow: 0 0 0 0 rgba(var(--color-primary-rgb), 0); }
        }

        .dashboard-card:hover {
          animation: cardPulse 1.5s infinite !important;
        }

        /* Improve card interactivity */
        .dashboard-card {
          cursor: pointer !important;
          user-select: none !important;
          -webkit-tap-highlight-color: transparent !important;
        }

        /* Add active state effect */
        .dashboard-card:active {
          transform: translateY(0) scale(0.98) !important;
          transition: transform 0.1s !important;
        }
      `;
      document.head.appendChild(style);
    };
    
    loadUIkit();
  }, []);

  return (
    <div className="uk-scope">
      {children}
    </div>
  );
};

export default dynamic(() => Promise.resolve(UIWrapper), {
  ssr: false
});
