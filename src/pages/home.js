import { Helmet } from 'react-helmet';
import { Container, Form, InputGroup } from 'react-bootstrap';
import { Fragment, useEffect, useState } from 'react';

import CustomErrorBoundary from 'components/ErrorBoundary';
import { dialTones, localities, ringTones } from 'utils';
import { useFormik } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faStop } from '@fortawesome/free-solid-svg-icons';
import { createDialChannel, createRingChannel } from 'utils/audio';

export const ErrorBoundary = CustomErrorBoundary;

export function Component() {
  const [toneData, setToneData] = useState({
    dialTone: {
      frequencies: [],
      volume: -Infinity
    },
    ringTone: {
      cadence: [],
      frequencies: [],
      volume: -Infinity
    }
  });
  const [channels, setChannels] = useState({});
  const { values, handleChange, handleSubmit, setFieldValue } = useFormik({
    initialValues: {
      hookState: false,
      ringing: false,
      locality: 'na'
    }
  });

  useEffect(() => {
    if (values.hookState) {
      setChannels({
        dialTone: createDialChannel(toneData.dialTone),
        ringTone: createRingChannel(toneData.ringTone)
      });
    } else {
      setChannels((prevVal) => {
        Object.entries(prevVal).forEach(([, channel]) => {
          channel.mute = true;
        });

        return {};
      });
    }
  }, [values.hookState, toneData]);

  useEffect(
    () =>
      setToneData({
        dialTone: dialTones[values.locality],
        ringTone: ringTones[values.locality]
      }),
    [values.locality]
  );

  return (
    <Fragment>
      <Helmet title="Modem Simulator" />
      <Container>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Locality</Form.Label>
            <Form.Select name="locality" onChange={handleChange}>
              {Object.entries(localities).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group>
            <Form.Label>Hook State</Form.Label>
            <Form.Switch
              name="hookState"
              onChange={handleChange}
              value={values.hookState}
            />
          </Form.Group>
          {values.hookState && (
            <Form.Group>
              <Form.Label>Start Call</Form.Label>
              <InputGroup>
                <Form.Switch
                  disabled={values.ringing}
                  onClick={() => {
                    channels.dialTone.mute = true;
                    channels.ringTone.start(5);
                    setFieldValue('ringing', true);
                  }}
                />
                <InputGroup.Text>
                  <FontAwesomeIcon
                    icon={values.ringing ? faStop : faPlay}
                    fixedWidth
                  />
                </InputGroup.Text>
              </InputGroup>
            </Form.Group>
          )}
        </Form>
      </Container>
    </Fragment>
  );
}
