/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Input } from '@catena-x/portal-shared-components';
import { Grid } from '@mui/material';
import { useState } from 'react';

const InputValidation = ({ item, handleChange, type }: any) => {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState(false);

  const firstAttribute = item?.attribute[0];
  if (!firstAttribute) return null;

  const handleValidate = () => {
    const regex = new RegExp(firstAttribute.value);
    if (regex.test(inputValue) || '') {
      handleChange(inputValue, type, item.technicalKey);
      setError(false);
    } else {
      setError(true);
    }
  };

  const handleClear = () => {
    setInputValue('');
    handleChange('', type, item.technicalKey);
    setError(false);
  };

  return (
    <Grid container spacing={2} alignItems={'flex-end'}>
      <Grid item xs={4}>
        <Input
          placeholder="Enter a value"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          error={error} // You can manage error state based on regex match
          helperText="Invalid input"
        />
      </Grid>
      <Grid item>
        <Button variant="contained" size="small" onClick={handleValidate}>
          Validate
        </Button>
      </Grid>
      <Grid item>
        <Button variant="contained" size="small" onClick={handleClear}>
          Clear
        </Button>
      </Grid>
    </Grid>
  );
};

export default InputValidation;
