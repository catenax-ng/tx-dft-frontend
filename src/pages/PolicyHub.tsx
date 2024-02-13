/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Divider, FormControl } from '@mui/material';
import { Input, SelectList, Typography } from 'cx-portal-shared-components';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { useGetPolicyTemplateQuery } from '../features/provider/policies/apiSlice';

const PolicyHub = () => {
  const { data, isSuccess } = useGetPolicyTemplateQuery();
  const [formData, setFormData] = useState<any>({});
  const { handleSubmit, control } = useForm();

  useEffect(() => {
    if (isSuccess) setFormData(data);
  }, [data, isSuccess]);

  const onSubmit = () => {
    // const outputData = formData;
    // for (const type in outputData) {
    //   const policies = outputData[type];
    //   for (const policy in policies) {
    //     const nestedObject = policies[policy];
    //     policies[policy] = {
    //       technicalKey: nestedObject.technicalKey,
    //       value: nestedObject?.value?.value ? nestedObject.value.value : nestedObject.value,
    //     };
    //   }
    // }
    // Handle form submission
    console.log(formData);
  };

  const handleChange = (e: any, type: any, key: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [key]: {
          ...prev[type][key],
          value: e || '', //Backend needs the value inside an array
        },
      },
    }));
  };

  const handleItems = (items: any) =>
    items.attribute.map((el: any, index: number) => {
      return { index, ...el };
    });

  const renderFormField = (item: any, type: any, key: any) => {
    const firstAttribute = item.attribute[0];
    if (!firstAttribute) return null;

    if (firstAttribute.key === 'Regex') {
      return (
        <FormControl fullWidth sx={{ mb: 3 }}>
          <Controller
            name={formData[type][key].value}
            control={control}
            render={({ fieldState: { error } }) => (
              <Input
                label={formData[type][key].technicalKey}
                name={item.technicalKey}
                value={item.value}
                onChange={e => {
                  const {
                    target: { value },
                  } = e;
                  handleChange(value, type, key);
                }}
                error={!!error}
              />
            )}
          />
        </FormControl>
      );
    } else if (firstAttribute.key === 'Brands' || firstAttribute.key === 'Version' || firstAttribute.key === 'Static') {
      return (
        <FormControl fullWidth sx={{ mb: 3 }}>
          <Controller
            name={formData[type][key].technicalKey}
            control={control}
            render={({ fieldState: { error } }) => (
              <SelectList
                keyTitle="value"
                defaultValue={item.value}
                items={handleItems(item)}
                variant="filled"
                label={item.technicalKey}
                placeholder="Select a value"
                type={'text'}
                error={!!error}
                disableClearable={false}
                onChangeItem={e => handleChange(e, type, key)}
              />
            )}
          />
        </FormControl>
      );
    } else {
      return null;
    }
  };

  if (isSuccess) {
    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        {Object.keys(formData).map(type => (
          <div key={type}>
            <Typography variant="h6">{type}</Typography>
            <Divider />
            {Object.keys(formData[type]).map(key => {
              const item = formData[type][key];
              return <div key={key}>{renderFormField(item, type, key)}</div>;
            })}
          </div>
        ))}
        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
      </form>
    );
  } else return null;
};

export default PolicyHub;
