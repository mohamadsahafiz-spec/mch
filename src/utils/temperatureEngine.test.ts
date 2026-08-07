import { describe, it, expect } from 'vitest';
import { TemperatureEngine } from './temperatureEngine';

describe('TemperatureEngine Parity Verification', () => {
  const sampleLogText = `
2026-08-06 08:00:00 [INFO] System Starting
2026-08-06 08:00:10 Recv>> Commnad No: 1, Station No: 1, Read Data Value: 230
2026-08-06 08:00:10 Recv>> Command No: 1, Station No: 2, Read Data Value: 245
2026-08-06 08:00:10 Recv>> Command No: 1, Station No: 3, Read Data Value: 250
2026-08-06 08:00:10 Recv>> Command No: 2, Station No: 1, Read Data Value: 999
2026-08-06 08:00:20 Recv>> Command No: 1, Station No: 1, Read Data Value: 236
2026-08-06 08:00:20 Recv>> Command No: 1, Station No: 2, Read Data Value: 255
2026-08-06 08:01:00 Recv>> Command No: 1, Station No: 1, Read Data Value: 240
MALFORMED LINE WITHOUT TIMESTAMP
2026-08-07 00:00:10 Recv>> Command No: 1, Station No: 1, Read Data Value: 220
`;

  it('correctly parses raw log text into converted °C values and filters commands', () => {
    const records = TemperatureEngine.parseLog(sampleLogText, { cmdFilter: '1' });

    // Filtered Command No: 1 only (7 valid records, ignoring Command No: 2)
    expect(records.length).toBe(7);

    // Verify raw 230 -> 23.0°C conversion
    expect(records[0].rawVal).toBe(230);
    expect(records[0].val).toBe(23.0);
    expect(records[0].ch).toBe(1);

    // Verify Station No 2 conversion 245 -> 24.5°C
    expect(records[1].rawVal).toBe(245);
    expect(records[1].val).toBe(24.5);
    expect(records[1].ch).toBe(2);
  });

  it('respects raw value min and max filters', () => {
    const filtered = TemperatureEngine.parseLog(sampleLogText, {
      cmdFilter: '1',
      filterMin: 235,
      filterMax: 252
    });

    // Only 236, 240, 245, 250 fall within raw [235, 252]
    expect(filtered.length).toBe(4);
    filtered.forEach((r) => {
      expect(r.rawVal).toBeGreaterThanOrEqual(235);
      expect(r.rawVal).toBeLessThanOrEqual(252);
    });
  });

  it('resamples data correctly into time interval buckets', () => {
    const records = TemperatureEngine.parseLog(sampleLogText, { cmdFilter: '1' });
    const resampled = TemperatureEngine.resampleData(records, 30); // 30-second interval

    expect(resampled[1]).toBeDefined();
    expect(resampled[1].length).toBeGreaterThan(0);
    expect(resampled[1][0].val).toBe(23.0);
  });

  it('calculates statistics accurately (min, max, avg, range, points)', () => {
    const records = TemperatureEngine.parseLog(sampleLogText, { cmdFilter: '1' });
    const resampled = TemperatureEngine.resampleData(records, 30);
    const ch1Stats = TemperatureEngine.calcStats(resampled[1]);

    expect(ch1Stats).not.toBeNull();
    if (ch1Stats) {
      expect(ch1Stats.min).toBeLessThanOrEqual(ch1Stats.max);
      expect(ch1Stats.range).toBe(Math.round((ch1Stats.max - ch1Stats.min) * 10) / 10);
      expect(ch1Stats.points).toBe(resampled[1].length);
    }
  });

  it('detects day boundaries across multi-day logs', () => {
    const records = TemperatureEngine.parseLog(sampleLogText, { cmdFilter: '1' });
    const boundaries = TemperatureEngine.getDayBoundaries(records);

    expect(boundaries.length).toBe(1);
    expect(boundaries[0].date).toBe('2026-08-07');
  });

  it('runs complete analysis pipeline smoothly', () => {
    const result = TemperatureEngine.analyzeTemperatureLogs([sampleLogText], {
      cmdFilter: '1',
      intervalSec: 30
    });

    expect(result.rawRecords.length).toBe(7);
    expect(result.dayBoundaries.length).toBe(1);
    expect(result.combinedStats).not.toBeNull();
    expect(result.timeRange).not.toBeNull();
  });
});
