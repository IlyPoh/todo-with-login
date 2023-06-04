// types
import { IFilterOptions } from '../../../types';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: IFilterOptions[];
}

export const Select = ({ options, ...props }: SelectProps) => {
  return (
    <select {...props}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.text}
        </option>
      ))}
    </select>
  );
};
