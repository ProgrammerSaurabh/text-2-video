import React from 'react';

import { Field, Input, Label } from '@headlessui/react';

const Color = ({ id, label, value, onChange = () => null }) => {
  return (
    <>
      <Field>
        <Label
          className='block'
          htmlFor={id}
        >
          {label}
        </Label>
        <div className='flex justify-start items-center h-[50px]'>
          <div className='w-full h-full rounded-md border rounded-tr-none rounded-br-none border-[#e0e0e0] bg-white py-3 px-4 grow'>
            {value}
          </div>
          <Input
            type='color'
            className='h-full rounded-md border rounded-tl-none rounded-bl-none border-[#e0e0e0] bg-[#e0e0e0] text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md'
            id={id}
            defaultValue={value}
            onChange={onChange}
          />
        </div>
      </Field>
    </>
  );
};

export default Color;
