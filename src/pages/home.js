import { Helmet } from 'react-helmet';
import { useFormik } from 'formik';
import { Button, Container, Form } from 'react-bootstrap';
import { Fragment, useEffect, useState, useCallback } from 'react';

import CustomErrorBoundary from 'components/ErrorBoundary';
import { dialTones, localities, ringTones } from 'utils';
import {
  createDialChannel,
  createDialToneChannel,
  createRingToneChannel
} from 'utils/audio';
import { Transport } from 'tone';

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
  const [sounds, setSounds] = useState({});
  const { values, handleChange, handleSubmit, setFieldValue } = useFormik({
    initialValues: {
      hookState: false,
      dialing: false,
      ringing: false,
      locality: 'na'
    }
  });
  const startCall = useCallback(() => {
    sounds.dialTone.stop();
    sounds.dialing.start('8608698669');
    setFieldValue('dialing', true);
    setTimeout(() => {
      setFieldValue('dialing', false);
      setFieldValue('ringing', true);
      sounds.dialing.stop();
      sounds.ringTone.start(2);
    }, 5250);
  }, [sounds, setFieldValue]);

  useEffect(
    () =>
      setSounds((prevVal) => {
        Object.entries(prevVal).forEach(([, { channel, nodes }]) => {
          nodes.forEach((node) => node.dispose());
          channel.mute = true;
        });

        if (values.hookState) {
          Transport.start();
          const dialToneChannel = createDialToneChannel(toneData.dialTone);

          dialToneChannel.start();

          return {
            dialTone: dialToneChannel,
            ringTone: createRingToneChannel(toneData.ringTone),
            dialing: createDialChannel({ pressDurationMs: 500, volume: -8 })
          };
        } else {
          return {};
        }
      }),
    [values.hookState, toneData]
  );

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
              <Button
                disabled={values.ringing || values.dialing}
                variant={
                  values.ringing || values.dialing ? 'success' : 'danger'
                }
                onClick={startCall}
              >
                Start Call
              </Button>
            </Form.Group>
          )}
        </Form>
      </Container>
    </Fragment>
  );
}
