import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import FormField from '../components/ui/form-field';

describe('FormField', () => {
  it('renders the label and fires onChangeText', () => {
    const onChangeText = jest.fn();
    const { getByText, getByLabelText, getByPlaceholderText } = render(
      <FormField label="Name" value="" onChangeText={onChangeText} placeholder="Enter a Name" />
    );

    expect(getByText('Name')).toBeTruthy();
    expect(getByPlaceholderText('Enter a Name')).toBeTruthy();

    fireEvent.changeText(getByLabelText('Name'), 'Alice');
    expect(onChangeText).toHaveBeenCalledWith('Alice');
  });
});
