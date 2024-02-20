/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Divider, FormControl } from '@mui/material';
import { SelectList, Typography } from 'cx-portal-shared-components';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import InputValidation from '../components/policies/InputValidation';
import { SELECT_POLICY_TYPES } from '../constants/policies';
import { useGetPolicyTemplateQuery } from '../features/provider/policies/apiSlice';
import { IPolicyHubResponse } from '../features/provider/policies/types';
import { toReadableCapitalizedCase } from '../utils/utils';

const PolicyHub = () => {
  const { t } = useTranslation();
  const { data, isSuccess } = useGetPolicyTemplateQuery({});
  const [formData, setFormData] = useState<IPolicyHubResponse>({});
  const { handleSubmit, control } = useForm<IPolicyHubResponse>();

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
    const firstAttribute = item?.attribute[0];
    if (!firstAttribute) return null;

    if (firstAttribute?.key === 'Regex') {
      return (
        <FormControl fullWidth sx={{ mb: 3 }}>
          <Controller
            name={formData[type][key].value}
            control={control}
            render={() => <InputValidation item={item} handleChange={handleChange} type={type} />}
          />
        </FormControl>
      );
    } else if (SELECT_POLICY_TYPES.includes(firstAttribute?.key)) {
      return (
        <FormControl sx={{ mb: 3, width: 300 }}>
          <Controller
            name={formData[type][key].technicalKey}
            control={control}
            render={({ fieldState: { error } }) => (
              <SelectList
                keyTitle="value"
                defaultValue={item.value}
                items={handleItems(item)}
                variant="filled"
                label={toReadableCapitalizedCase(item.technicalKey)}
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
      <form>
        {Object.keys(formData)?.map(type => (
          <div key={type}>
            <Typography variant="h6">{type}</Typography>
            <Divider />
            {Object.keys(formData[type]).map(key => {
              const item = formData[type][key];
              return <div key={key}>{renderFormField(item, type, key)}</div>;
            })}
          </div>
        ))}
        <Button type="submit" variant="contained" color="primary" onClick={handleSubmit(onSubmit)}>
          {t('button.submit')}
        </Button>
      </form>
    );
  } else return null;
};

export default PolicyHub;
