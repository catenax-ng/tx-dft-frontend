/* eslint-disable @typescript-eslint/no-explicit-any */
import InfoIcon from '@mui/icons-material/Info';
import { Box, Button, Divider, FormControl, FormLabel } from '@mui/material';
import { Input, SelectList, Tooltips, Typography } from 'cx-portal-shared-components';
import { isArray, isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { ADD_POLICY_DIALOG_TYPES, SELECT_POLICY_TYPES } from '../constants/policies';
import { useGetPolicyTemplateQuery } from '../features/provider/policies/apiSlice';
import { setPolicyDialog } from '../features/provider/policies/slice';
import { useAppDispatch, useAppSelector } from '../features/store';
import { PolicyHubModel } from '../models/Polices.models';
import { ALPHA_NUM_REGEX } from '../utils/constants';
import { toReadableCapitalizedCase } from '../utils/utils';

const PolicyHub = ({ onSubmit }: any) => {
  const { t } = useTranslation();
  const { selectedUseCases, useCaseNames } = useAppSelector(state => state.appSlice);
  const { policyDialogType } = useAppSelector(state => state.policySlice);
  const { data, isSuccess } = useGetPolicyTemplateQuery({
    useCases: useCaseNames,
  });
  const [formData, setFormData] = useState<any>({});
  const [nameError, setNameError] = useState(false);
  const { control } = useForm();
  const showPolicyName = policyDialogType === 'Add' || policyDialogType === 'Edit';
  const dispatch = useAppDispatch();

  const dialogTypeCheck = ADD_POLICY_DIALOG_TYPES.includes(policyDialogType);

  useEffect(() => {
    if (isSuccess) {
      if (isEmpty(selectedUseCases) && dialogTypeCheck) {
        setFormData(PolicyHubModel.convert(data));
      } else if (!isEmpty(selectedUseCases) && dialogTypeCheck) {
        setFormData(PolicyHubModel.usecaseFilter(data, selectedUseCases));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isSuccess, selectedUseCases]);

  const handleChange = (e: any, type: string, key: string) => {
    setFormData((prev: any) => {
      const updatedFormData = { ...prev };
      const policies = updatedFormData[type];
      // if its a valid policy not a custom values
      if (isArray(policies)) {
        // Find the object in the policies array with the given technicalKey
        const policyToUpdate = policies.find((policy: any) => policy.technicalKey === key);
        // If the policyToUpdate is found, update its value
        if (policyToUpdate) {
          policyToUpdate.value = e || '';
        }
      } else {
        updatedFormData[key] = e || '';
      }
      return updatedFormData;
    });
  };

  
  const handleItems = (items: any) =>
    items.attribute.map((el: any, index: number) => {
      return { index, ...el };
    });

  const renderFormField = (item: any, type: any, key: any) => {
    const firstAttribute = item?.attribute[0];
    if (!firstAttribute) return null;

    const formLabel = (
      <Box sx={{ display: 'flex', flexDirection: 'row' }}>
        <Typography variant={'body3'} mr={0.5} fontWeight={'bold'}>
          {toReadableCapitalizedCase(item.technicalKey)}
        </Typography>
        {!isEmpty(item.description) && (
          <Tooltips tooltipPlacement="top" tooltipText={item.description}>
            <span>
              <InfoIcon fontSize="small" color="disabled" />
            </span>
          </Tooltips>
        )}
      </Box>
    );

    if (firstAttribute?.key === 'Regex') {
      return (
        <FormControl fullWidth sx={{ mb: 3, width: 300, '& .MuiBox-root': { marginTop: 0 } }}>
          <FormLabel>{formLabel}</FormLabel>
          <Controller
            name={formData[type][key].value}
            control={control}
            render={() => (
              <Input
                placeholder="Enter a value"
                value={item.value}
                onChange={e => handleChange(e.target.value, type, item.technicalKey)}
                helperText="Invalid input"
              />
            )}
          />
        </FormControl>
      );
    } else if (SELECT_POLICY_TYPES.includes(firstAttribute?.key)) {
      return (
        <FormControl fullWidth sx={{ mb: 3, width: 300, '& .MuiBox-root': { marginTop: 0 } }}>
          <FormLabel>{formLabel}</FormLabel>
          <Controller
            name={formData[type][key].technicalKey}
            control={control}
            render={({ fieldState: { error } }) => (
              <SelectList
                keyTitle="value"
                defaultValue={item.value}
                items={handleItems(item)}
                variant="filled"
                label={''}
                placeholder="Select a value"
                type={'text'}
                error={!!error}
                disableClearable={false}
                onChangeItem={e => handleChange(e, type, item.technicalKey)}
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
        {showPolicyName && (
          <FormControl sx={{ mb: 3, width: 300 }}>
            <Input
              value={formData.policy_name}
              variant="filled"
              label={'Policy name'}
              placeholder={'Enter policy name'}
              type={'text'}
              error={nameError}
              onChange={e => {
                const { value } = e.target;
                if (ALPHA_NUM_REGEX.test(value) || value === '') {
                  setNameError(false);
                  handleChange(value, 'policy_name', 'policy_name');
                }
              }}
            />
          </FormControl>
        )}
        {Object.keys(formData)?.map(type => {
          if (isArray(formData[type])) {
            return (
              <div key={type}>
                <Typography variant="body2" fontWeight={'bold'}>
                  {type}
                </Typography>
                <Divider sx={{ mb: 2 }} />
                {Object.keys(formData[type]).map(key => {
                  const item = formData[type][key];
                  return <div key={key}>{renderFormField(item, type, key)}</div>;
                })}
              </div>
            );
          } else return null;
        })}
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', my: 1 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              if (showPolicyName && isEmpty(formData.policy_name)) {
                setNameError(true);
                return;
              }
              setNameError(false);
              onSubmit(PolicyHubModel.preparePayload(formData));
            }}
          >
            {t('button.submit')}
          </Button>
          <Button variant="contained" sx={{ ml: 2 }} onClick={() => dispatch(setPolicyDialog(false))}>
            {t('button.close')}
          </Button>
        </Box>
      </form>
    );
  } else return null;
};

export default PolicyHub;
