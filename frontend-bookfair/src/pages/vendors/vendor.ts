import React from 'react';
import PublisherLayout from '../../layouts/PublisherLayout';

const VendorsHomePage: React.FC = () =>
  React.createElement(
    PublisherLayout,
    null,
    React.createElement(
      'div',
      { className: 'p-6' },
      React.createElement('h1', { className: 'text-2xl font-semibold' }, 'Vendors'),
      React.createElement(
        'p',
        { className: 'mt-2 text-gray-600' },
        'Welcome to the vendor portal. Manage your profile, products, and orders here.'
      )
    )
  );

export default VendorsHomePage;
