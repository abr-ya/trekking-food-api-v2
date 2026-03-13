import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { PrismaService } from '../prisma/prisma.service';
import * as dns from 'dns';
import * as net from 'net';
import { promisify } from 'util';

const dnsResolve4 = promisify(dns.resolve4);

@ApiTags('test')
@Controller('test')
export class TestController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('db-check')
  @AllowAnonymous()
  @ApiOperation({
    summary: 'Database connectivity check',
    description:
      'Runs DNS resolution, TCP connection, Prisma auth, and a simple query. Returns timing and pass/fail for each step. Useful for debugging DB issues.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Returns timestamp, environment, results array (DNS, TCP, DB auth, simple query), and summary (total/passed/failed, averageResponseTime).',
  })
  async deepDbCheck() {
    const results: Array<{
      test: string;
      success: boolean;
      timeMs?: number;
      data?: unknown;
      error?: string;
      code?: string;
    }> = [];

    // Test 1: DNS check
    try {
      const dnsStart = Date.now();
      const url = new URL(process.env.DATABASE_URL!);
      const dnsResult = await this.resolveHostname(url.hostname);
      results.push({
        test: 'DNS Resolution',
        success: true,
        timeMs: Date.now() - dnsStart,
        data: dnsResult,
      });
    } catch (error: unknown) {
      results.push({
        test: 'DNS Resolution',
        success: false,
        error: error instanceof Error ? error.message : String(error),
      });
    }

    // Test 2: TCP connection
    try {
      const tcpStart = Date.now();
      const url = new URL(process.env.DATABASE_URL!);
      await this.testTcpConnection(url.hostname, parseInt(url.port || '5432', 10));
      results.push({
        test: 'TCP Connection',
        success: true,
        timeMs: Date.now() - tcpStart,
      });
    } catch (error: unknown) {
      results.push({
        test: 'TCP Connection',
        success: false,
        error: error instanceof Error ? error.message : String(error),
      });
    }

    // Test 3: Database authentication (through Prisma)
    try {
      const authStart = Date.now();
      await this.prisma.client.$connect();
      results.push({
        test: 'Database Authentication',
        success: true,
        timeMs: Date.now() - authStart,
      });
    } catch (error: unknown) {
      const err = error as Error & { code?: string };
      results.push({
        test: 'Database Authentication',
        success: false,
        error: err.message,
        code: err.code,
      });
    }

    // Test 4: Simple query
    if (!results.some((r) => !r.success)) {
      try {
        const queryStart = Date.now();
        await this.prisma.client.$queryRaw`SELECT 1 as connection_test`;
        results.push({
          test: 'Simple Query',
          success: true,
          timeMs: Date.now() - queryStart,
        });
      } catch (error: unknown) {
        results.push({
          test: 'Simple Query',
          success: false,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    const withTime = results.filter((r) => r.timeMs != null);
    const averageResponseTime =
      withTime.length > 0 ? withTime.reduce((acc, r) => acc + (r.timeMs ?? 0), 0) / results.length : 0;

    return {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      results,
      summary: {
        totalTests: results.length,
        passed: results.filter((r) => r.success).length,
        failed: results.filter((r) => !r.success).length,
        averageResponseTime,
      },
    };
  }

  private async resolveHostname(hostname: string) {
    const addresses = await dnsResolve4(hostname);
    return {
      hostname,
      addresses,
      family: 4,
    };
  }

  private testTcpConnection(host: string, port: number, timeout = 5000): Promise<void> {
    return new Promise((resolve, reject) => {
      const socket = new net.Socket();
      const timer = setTimeout(() => {
        socket.destroy();
        reject(new Error(`TCP connection timeout after ${timeout}ms`));
      }, timeout);

      socket.connect(port, host, () => {
        clearTimeout(timer);
        socket.destroy();
        resolve();
      });

      socket.on('error', (error: Error) => {
        clearTimeout(timer);
        reject(error);
      });
    });
  }
}
