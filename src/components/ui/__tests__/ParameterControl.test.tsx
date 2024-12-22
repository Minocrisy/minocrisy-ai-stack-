import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { ParameterControl } from '../ParameterControl';

describe('ParameterControl', () => {
  const mockOnChange = jest.fn();
  const mockOnValidate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders number input with slider for range values', () => {
    render(
      <ParameterControl
        name="temperature"
        schema={{
          type: 'number',
          minimum: 0,
          maximum: 1,
          description: 'Controls randomness',
        }}
        value={0.5}
        onChange={mockOnChange}
        onValidate={mockOnValidate}
      />
    );

    expect(screen.getByRole('slider')).toBeInTheDocument();
    expect(screen.getByText('Controls randomness')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('renders select input for enum values', () => {
    render(
      <ParameterControl
        name="style"
        schema={{
          type: 'string',
          enum: ['modern', 'vintage', 'abstract'],
          description: 'Art style',
        }}
        value="modern"
        onChange={mockOnChange}
        onValidate={mockOnValidate}
      />
    );

    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
    expect(screen.getByText('Art style')).toBeInTheDocument();
    expect(screen.getAllByRole('option')).toHaveLength(3);
  });

  it('renders checkbox for boolean values', () => {
    render(
      <ParameterControl
        name="enhanced"
        schema={{
          type: 'boolean',
          description: 'Enable enhancement',
        }}
        value={false}
        onChange={mockOnChange}
        onValidate={mockOnValidate}
      />
    );

    expect(screen.getByRole('checkbox')).toBeInTheDocument();
    expect(screen.getByText('enhanced')).toBeInTheDocument();
    expect(screen.getByText('Enable enhancement')).toBeInTheDocument();
  });

  it('validates number input within range', () => {
    render(
      <ParameterControl
        name="count"
        schema={{
          type: 'number',
          minimum: 1,
          maximum: 10,
        }}
        value={5}
        onChange={mockOnChange}
        onValidate={mockOnValidate}
      />
    );

    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '15' } });

    expect(screen.getByText('Maximum value is 10')).toBeInTheDocument();
    expect(mockOnValidate).toHaveBeenLastCalledWith(false);

    fireEvent.change(input, { target: { value: '7' } });
    expect(mockOnValidate).toHaveBeenLastCalledWith(true);
  });

  it('validates enum values', () => {
    render(
      <ParameterControl
        name="mode"
        schema={{
          type: 'string',
          enum: ['fast', 'balanced', 'quality'],
        }}
        value="fast"
        onChange={mockOnChange}
        onValidate={mockOnValidate}
      />
    );

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'balanced' } });

    expect(mockOnChange).toHaveBeenCalledWith('balanced');
    expect(mockOnValidate).toHaveBeenLastCalledWith(true);
  });
});
