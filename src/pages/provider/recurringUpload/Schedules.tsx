/********************************************************************************
 * Copyright (c) 2023 T-Systems International GmbH
 * Copyright (c) 2022,2023 Contributors to the Eclipse Foundation
 *
 * See the NOTICE file(s) distributed with this work for additional
 * information regarding copyright ownership.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Apache License, Version 2.0 which is available at
 * https://www.apache.org/licenses/LICENSE-2.0.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 ********************************************************************************/

import { FormControl, Grid, TextFieldProps } from '@mui/material';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { Button, Input, SelectList, Typography } from 'cx-portal-shared-components';
import { capitalize, find, isEmpty } from 'lodash';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { v4 as uuid } from 'uuid';

import {
  useGetScheduleConfigQuery,
  usePutScheduleConfigMutation,
} from '../../../features/provider/recurringUpload/apiSlice';
import { ISelectList } from '../../../models/Common';
import { SchedulesFormData } from '../../../models/RecurringUpload.models';
import { HOURS, SCHEDULE_TYPE, WEEK_DAYS } from '../../../utils/constants';

function Schedules() {
  const [type, setType] = useState(SCHEDULE_TYPE[0]);
  const [hour, setHour] = useState<Partial<ISelectList>>({});
  const [time, setTime] = useState('');
  const [day, setDay] = useState<Partial<ISelectList>>({});
  const [conKey, setConKey] = useState(uuid());

  const { data, isSuccess } = useGetScheduleConfigQuery({});
  const [putScheduleConfig] = usePutScheduleConfigMutation();

  const { control, handleSubmit, register, reset } = useForm<SchedulesFormData>({
    defaultValues: {
      type: type.value,
      hour: '',
      time: '',
      day: '',
    },
  });

  useEffect(() => {
    reset({ type: type.value, hour: '', time: '', day: '' });
  }, [data, reset, type.value]);

  const handleResetState = () => {
    setHour({});
    setTime('');
    setDay({});
    setConKey(uuid());
  };

  const onSubmit = (formData: SchedulesFormData) => {
    let payload;
    if (formData.type === SCHEDULE_TYPE[0].value) {
      payload = { type: formData.type, time: formData.hour, day: formData.day };
    } else {
      payload = { type: formData.type, time: formData.time, day: formData.day };
    }
    putScheduleConfig(payload);
    handleResetState();
  };

  const handleRenderTimePicker = () => {
    return type.value === SCHEDULE_TYPE[2].value || type.value === SCHEDULE_TYPE[1].value;
  };

  const handleCurrentSchedule = () => {
    if (data.type) {
      return (
        <>
          {capitalize(data.type)},
          {!isEmpty(data?.day) ? find(WEEK_DAYS, { id: Number(data.day) })?.title : ''}{' '}
          {data.type === SCHEDULE_TYPE[0].value ? `${data.time} times` : data.time}
        </>
      );
    } else return 'NA';
  };

  const renderDurationSelector = () => (
    <FormControl sx={{ width: 200, mr: 3 }}>
      <Controller
        name="type"
        control={control}
        render={({ field: { name, ref, onChange }, fieldState: { error } }) => (
          <SelectList
            {...register('type', { required: true })}
            name={name}
            inputRef={ref}
            label={'Select the frequency'}
            placeholder={'Select the frequency'}
            keyTitle={'title'}
            error={!!error}
            helperText={error ? error.message : null}
            items={SCHEDULE_TYPE}
            disableClearable={true}
            defaultValue={type}
            onChangeItem={val => {
              onChange(val.value);
              setType(val);
              handleResetState();
            }}
          />
        )}
      />
    </FormControl>
  );

  const renderHourlyInput = () =>
    type.value === SCHEDULE_TYPE[0].value && (
      <FormControl sx={{ width: 200 }}>
        <Controller
          name="hour"
          control={control}
          render={({ field: { name, onChange, ref }, fieldState: { error } }) => (
            <SelectList
              {...register('hour', { required: true })}
              required
              name={name}
              inputRef={ref}
              label={'Select time interval'}
              placeholder={'Select time interval'}
              keyTitle={'title'}
              error={!!error}
              helperText={error ? error.message : null}
              items={HOURS}
              disableClearable={true}
              defaultValue={hour}
              onChangeItem={val => {
                onChange(val.value);
                setHour(val);
              }}
            />
          )}
        />
      </FormControl>
    );

  const renderTimePicker = () =>
    handleRenderTimePicker() && (
      <FormControl sx={{ width: 200, mr: 3 }}>
        <Controller
          name="time"
          control={control}
          render={({ field: { onChange, ref }, fieldState: { error } }) => (
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <TimePicker
                {...register('time', { required: true })}
                key={conKey}
                ref={ref}
                label={'Select the time'}
                value={time}
                views={['hours']}
                onChange={val => {
                  const timeStamp = moment(val).format('HH:mm A');
                  onChange(timeStamp);
                  setTime(val);
                }}
                renderInput={(params: TextFieldProps) => (
                  <Input {...params} error={!!error} placeholder="Select the time" variant="filled" />
                )}
              />
            </LocalizationProvider>
          )}
        />
      </FormControl>
    );

  const renderDayPicker = () =>
    type.value === SCHEDULE_TYPE[2].value && (
      <FormControl sx={{ width: 200 }}>
        <Controller
          name="day"
          control={control}
          render={({ field: { name, ref, onChange }, fieldState: { error } }) => (
            <SelectList
              {...register('day', { required: true })}
              name={name}
              inputRef={ref}
              label={'Select the day'}
              placeholder={'Select the day'}
              keyTitle={'title'}
              error={!!error}
              helperText={error ? error.message : null}
              items={WEEK_DAYS}
              disableClearable={true}
              defaultValue={day}
              onChangeItem={val => {
                onChange(val.id);
                setDay(val);
              }}
            />
          )}
        />
      </FormControl>
    );

  if (isSuccess) {
    return (
      <Grid container display={'flex'} alignItems={'center'}>
        <Grid item xs={7}>
          <form onSubmit={handleSubmit(onSubmit)}>
            {renderDurationSelector()}

            {renderHourlyInput()}

            {renderTimePicker()}

            {renderDayPicker()}

            <FormControl fullWidth sx={{ mt: 3 }}>
              <Button sx={{ width: 100 }} type="submit">
                Submit
              </Button>
            </FormControl>
          </form>
        </Grid>
        <Grid item>
          <Typography variant="body1" mt={-4}>
            <b>Current schedule: </b>
            {handleCurrentSchedule()}
          </Typography>
        </Grid>
      </Grid>
    );
  } else return null;
}
export default Schedules;
