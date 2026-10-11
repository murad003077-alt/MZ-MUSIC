import React from 'react';
import { render } from '@testing-library/react-native';
import App from '../../App';

describe('MZ MUSIC app smoke test', () => {
  it('renders without crashing', () => {
    const tree = render(<App />);
    expect(tree).toBeTruthy();
  });
});
