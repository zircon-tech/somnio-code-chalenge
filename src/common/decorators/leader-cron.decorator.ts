import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import { AwsMetaService } from '../../aws-meta/aws-meta.service';
import { AppConfig, EnvObjects } from '../../config/types';

export function LeaderCron(arg1, arg2?): MethodDecorator {
  const injectConfig = Inject(ConfigService);
  const injectAwsMeta = Inject(AwsMetaService);
  const cronDecorator = Cron(arg1, arg2);
  return (target, propertyKey, descriptor) => {
    injectConfig(target, 'configService');
    injectAwsMeta(target, 'awsMetaService');
    const oldCall = descriptor.value;
    if (!(oldCall instanceof Function)) {
      return cronDecorator(target, propertyKey, descriptor);
    }
    Object.defineProperty(oldCall, 'isExecuting', {
      enumerable: false,
      writable: true,
    });
    (oldCall as any).isExecuting = false;
    const newCall = async function (...args) {
      const { jobsEnabled } = (
        this.configService as ConfigService
      ).get<AppConfig>(EnvObjects.APP_CONFIG);
      if (!jobsEnabled) {
        return;
      }
      const isLeader = await (
        this.awsMetaService as AwsMetaService
      ).isLeaderInstance();
      if (!isLeader) {
        return;
      }
      if ((oldCall as any).isExecuting) {
        return;
      }
      (oldCall as any).isExecuting = true;
      const rr = oldCall.apply(this, args);
      let rrr;
      if (rr instanceof Promise) {
        rrr = await rr;
      } else {
        rrr = rr;
      }
      (oldCall as any).isExecuting = false;
      return rrr;
    };
    descriptor.value = newCall as any;
    return cronDecorator(target, propertyKey, descriptor);
  };
}
