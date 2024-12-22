import React, { useEffect, useState } from 'react';
import { Input } from './Input';

interface ParameterSchema {
  type: string;
  description?: string;
  minimum?: number;
  maximum?: number;
  enum?: string[];
  default?: any;
}

interface ParameterControlProps {
  name: string;
  schema: ParameterSchema;
  value: any;
  onChange: (value: any) => void;
  onValidate?: (isValid: boolean) => void;
}

export function ParameterControl({
  name,
  schema,
  value,
  onChange,
  onValidate
}: ParameterControlProps) {
  const [error, setError] = useState<string | null>(null);
  const [localValue, setLocalValue] = useState(value ?? schema.default ?? '');

  useEffect(() => {
    validateValue(localValue);
  }, [localValue]);

  const validateValue = (val: any) => {
    let isValid = true;
    let errorMessage = null;

    if (schema.type === 'number' || schema.type === 'integer') {
      const numVal = Number(val);
      if (isNaN(numVal)) {
        isValid = false;
        errorMessage = 'Must be a valid number';
      } else if (schema.minimum !== undefined && numVal < schema.minimum) {
        isValid = false;
        errorMessage = `Minimum value is ${schema.minimum}`;
      } else if (schema.maximum !== undefined && numVal > schema.maximum) {
        isValid = false;
        errorMessage = `Maximum value is ${schema.maximum}`;
      }
    } else if (schema.type === 'string' && schema.enum && !schema.enum.includes(val)) {
      isValid = false;
      errorMessage = `Must be one of: ${schema.enum.join(', ')}`;
    }

    setError(errorMessage);
    onValidate?.(isValid);
    return isValid;
  };

  const handleChange = (newValue: any) => {
    setLocalValue(newValue);
    if (validateValue(newValue)) {
      onChange(newValue);
    }
  };

  const renderControl = () => {
    switch (schema.type) {
      case 'number':
      case 'integer':
        if (schema.minimum !== undefined && schema.maximum !== undefined) {
          return (
            <div className="space-y-2">
              <input
                type="range"
                min={schema.minimum}
                max={schema.maximum}
                step={schema.type === 'integer' ? 1 : 0.1}
                value={localValue}
                onChange={(e) => handleChange(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>{schema.minimum}</span>
                <span>{localValue}</span>
                <span>{schema.maximum}</span>
              </div>
            </div>
          );
        }
        return (
          <Input
            type="number"
            value={localValue}
            onChange={(e) => handleChange(e.target.value)}
            min={schema.minimum}
            max={schema.maximum}
            step={schema.type === 'integer' ? 1 : 0.1}
          />
        );

      case 'string':
        if (schema.enum) {
          return (
            <select
              value={localValue}
              onChange={(e) => handleChange(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {schema.enum.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          );
        }
        return (
          <Input
            type="text"
            value={localValue}
            onChange={(e) => handleChange(e.target.value)}
          />
        );

      case 'boolean':
        return (
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={localValue}
              onChange={(e) => handleChange(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {name}
            </span>
          </label>
        );

      default:
        return (
          <Input
            type="text"
            value={localValue}
            onChange={(e) => handleChange(e.target.value)}
          />
        );
    }
  };

  return (
    <div className="space-y-1">
      {schema.type !== 'boolean' && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {name}
        </label>
      )}
      {schema.description && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
          {schema.description}
        </p>
      )}
      {renderControl()}
      {error && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
}
