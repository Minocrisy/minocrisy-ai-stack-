import React from 'react';
import { Listbox } from '@headlessui/react';
import { ChevronUpDownIcon } from '@heroicons/react/24/outline';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  disabled?: boolean;
  error?: string;
  className?: string;
}

interface ListboxOptionProps {
  active: boolean;
  selected: boolean;
  disabled?: boolean;
}

export function Select({
  label,
  value,
  onChange,
  options,
  disabled = false,
  error,
  className = '',
}: SelectProps) {
  const selectedOption = options.find(option => option.value === value);

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}

      <Listbox
        value={value}
        onChange={onChange}
        disabled={disabled}
      >
        <div className="relative">
          <Listbox.Button
            className={`
              relative w-full cursor-default rounded-md border
              bg-white dark:bg-gray-800
              py-2 pl-3 pr-10 text-left
              focus:outline-none focus:ring-2 focus:ring-blue-500
              disabled:bg-gray-50 disabled:text-gray-500
              dark:disabled:bg-gray-900 dark:disabled:text-gray-400
              ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}
              ${className}
            `}
          >
            <span className="block truncate">
              {selectedOption?.label || 'Select an option'}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>

          <Listbox.Options
            className="
              absolute z-10 mt-1 max-h-60 w-full overflow-auto
              rounded-md bg-white dark:bg-gray-800
              py-1 text-base shadow-lg ring-1
              ring-black ring-opacity-5 focus:outline-none
              sm:text-sm
            "
          >
            {options.map((option) => (
              <Listbox.Option
                key={option.value}
                value={option.value}
                className={({ active, selected, disabled }: ListboxOptionProps) => `
                  relative cursor-default select-none py-2 pl-3 pr-9
                  ${active ? 'bg-blue-100 dark:bg-blue-900/50' : ''}
                  ${selected ? 'font-medium' : 'font-normal'}
                  ${disabled ? 'opacity-50' : ''}
                `}
              >
                {({ selected }: { selected: boolean }) => (
                  <span className="block truncate">
                    {option.label}
                  </span>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>

      {error && (
        <p className="mt-1 text-sm text-red-500 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
