import React from "react";

type CheckboxProps = {
  value: boolean;
  onChange: React.ChangeEventHandler<HTMLInputElement>
  name: string;
  id: string;
  disabled?: boolean;
};

export function Checkbox({
  value,
  onChange,
  name,
  id,
  disabled,
}: CheckboxProps) {
  return (
    <input
      type="checkbox"
      checked={value}
      disabled={disabled}
      onChange={onChange}
      id={id}
      name={name}
      className="checkbox checkbox-sm"
    />
  );
}