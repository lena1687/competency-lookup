import {
  act,
  fireEvent,
  screen,
  waitFor,
  render,
} from '@testing-library/react';
import React from 'react';
import mockCompetencyData from '../../../tests/assets/competencyData.json';
import { Lookup } from './Lookup';
import { SummaryValue } from '../../../types';

describe('Lookup', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockCompetencyData),
      }),
    ) as jest.Mock;
  });

  it('Should render Lookup page', async () => {
    const { container } = render(<Lookup />);
    await waitFor(() => {
      expect(screen.getByText('Lookup Parameters')).toBeInTheDocument();
    });
  });

  it('Should render participant results', async () => {
    const { container } = render(<Lookup />);
    await waitFor(() => {
      expect(screen.getByText('Lookup Parameters')).toBeInTheDocument();
    });

    const radioInput = container.querySelector('input[value="participant"]');

    await act(() => {
      fireEvent.click(radioInput!);
    });

    await waitFor(() => {
      expect(screen.getByText('Lookup Parameters')).toBeInTheDocument();
    });

    const competencyDropdown = container.querySelector(
      'select[name="competency"]',
    )!;
    const participantDropdown = container.querySelector(
      'select[name="participant"]',
    )!;

    const lookupButton = container.querySelector('button[type="submit"]')!;

    await waitFor(() => {
      expect(competencyDropdown).toBeInTheDocument();
      expect(participantDropdown).toBeInTheDocument();
      expect(lookupButton).toBeDisabled();
      expect(container.querySelector('.lookup-result')).toBeNull();
    });

    await act(() => {
      fireEvent.change(competencyDropdown!, {
        target: { value: 'Enthusiasm' },
      });
      fireEvent.change(participantDropdown!, {
        target: { value: 'Vera Voorbeeld' },
      });
    });

    await waitFor(() => {
      expect(lookupButton).not.toBeDisabled();
    });

    await act(() => {
      fireEvent.click(lookupButton);
    });

    await waitFor(() => {
      expect(
        screen.getByText('Vera Voorbeeld scored 4.8 on Enthusiasm'),
      ).toBeInTheDocument();
    });
  });

  it('Should reset selected values if lookup mode is changed', async () => {
    const { container } = render(<Lookup />);

    await waitFor(() => {
      expect(screen.getByText('Lookup Parameters')).toBeInTheDocument();
    });

    await act(() => {
      fireEvent.click(container.querySelector('input[value="participant"]')!);
    });

    const competencyDropdown = container.querySelector(
      'select[name="competency"]',
    )!;
    const participantDropdown = container.querySelector(
      'select[name="participant"]',
    )!;

    await act(() => {
      fireEvent.change(competencyDropdown!, {
        target: { value: 'Enthusiasm' },
      });
      fireEvent.change(participantDropdown!, {
        target: { value: 'Vera Voorbeeld' },
      });
    });

    const lookupButton = container.querySelector('button[type="submit"]')!;

    await waitFor(() => {
      expect(lookupButton).not.toBeDisabled();
    });

    await act(() => {
      fireEvent.click(container.querySelector('input[value="summary"]')!);
    });

    await waitFor(() => {
      expect(lookupButton).toBeDisabled();
    });
  });

  describe('Summary results', () => {
    it('Should render summary - competency type results', async () => {
      await selectSummary('MBOLevel', SummaryValue.TYPE);

      await waitFor(() => {
        expect(
          screen.getByText(`The type of MBOLevel is 'level'`),
        ).toBeInTheDocument();
      });
    });

    it('Should render summary - average results', async () => {
      await selectSummary('Enthusiasm', SummaryValue.AVERAGE);

      await waitFor(() => {
        expect(
          screen.getByText(`The average score for Enthusiasm is 3.6`),
        ).toBeInTheDocument();
      });
    });

    it('Should render summary - lowest results', async () => {
      await selectSummary('Reliability', SummaryValue.LOWEST);

      await waitFor(() => {
        expect(
          screen.getByText(`The lowest score for Reliability is 2.4`),
        ).toBeInTheDocument();
      });
    });

    it('Should render summary - highest results', async () => {
      await selectSummary('Total', SummaryValue.HIGHEST);

      await waitFor(() => {
        expect(
          screen.getByText(`The highest score for Total is 4.0`),
        ).toBeInTheDocument();
      });
    });
  });
});

async function selectSummary(competency: string, summary: SummaryValue) {
  const { container } = render(<Lookup />);
  await waitFor(() => {
    expect(screen.getByText('Lookup Parameters')).toBeInTheDocument();
  });

  const radioInput = container.querySelector('input[value="summary"]');

  await act(() => {
    fireEvent.click(radioInput!);
  });

  await waitFor(() => {
    expect(screen.getByText('Lookup Parameters')).toBeInTheDocument();
  });

  const competencyDropdown = container.querySelector(
    'select[name="competency"]',
  )!;
  const summaryDropdown = container.querySelector('select[name="summary"]')!;

  const lookupButton = container.querySelector('button[type="submit"]')!;

  await waitFor(() => {
    expect(competencyDropdown).toBeInTheDocument();
    expect(summaryDropdown).toBeInTheDocument();
    expect(lookupButton).toBeDisabled();
    expect(container.querySelector('.lookup-result')).toBeNull();
  });

  await act(() => {
    fireEvent.change(competencyDropdown!, {
      target: { value: competency },
    });
    fireEvent.change(summaryDropdown!, {
      target: { value: summary },
    });
  });

  await waitFor(() => {
    expect(lookupButton).not.toBeDisabled();
  });

  await act(() => {
    fireEvent.click(lookupButton);
  });

  return container;
}
